// Serious S.H.I.T. - Main JavaScript
// Language toggle, theme toggle, gallery, mobile menu, scroll reveal

(function() {
  'use strict';

  // ==========================================
  // LANGUAGE MANAGEMENT
  // ==========================================
  const LANG_KEY = 'sshit-lang';
  const DEFAULT_LANG = 'he';

  function getLang() {
    return localStorage.getItem(LANG_KEY) || DEFAULT_LANG;
  }

  function setLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
    applyLang(lang);
  }

  function applyLang(lang) {
    const html = document.documentElement;
    html.setAttribute('data-lang', lang);
    html.setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr');
    html.setAttribute('lang', lang);

    document.querySelectorAll('.lang-toggle').forEach(btn => {
      btn.textContent = lang === 'he' ? 'EN' : 'עב';
    });
  }

  function toggleLang() {
    const current = getLang();
    const next = current === 'en' ? 'he' : 'en';
    setLang(next);
  }

  // ==========================================
  // THEME MANAGEMENT (Dark default)
  // ==========================================
  const THEME_KEY = 'sshit-theme';
  const DEFAULT_THEME = 'dark';

  function getTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return DEFAULT_THEME;
  }

  function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.textContent = theme === 'dark' ? 'LIGHT' : 'DARK';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  function toggleTheme() {
    const current = getTheme();
    const next = current === 'light' ? 'dark' : 'light';
    setTheme(next);
  }

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // ==========================================
  // MOBILE MENU
  // ==========================================
  function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', () => {
      nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('is-open'));
    });

    // Close menu when a nav link is clicked
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ==========================================
  // SCROLL REVEAL
  // ==========================================
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  // ==========================================
  // CONTENT LOADING
  // ==========================================
  async function loadContent(file) {
    try {
      const response = await fetch('content/' + file);
      if (!response.ok) throw new Error('Failed to load ' + file);
      return await response.json();
    } catch (error) {
      console.warn('Could not load content/' + file + ':', error);
      return null;
    }
  }

  function t(obj, lang) {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj['en'] || '';
  }

  // ==========================================
  // GALLERY / LIGHTBOX
  // ==========================================
  let galleryImages = [];
  let currentImageIndex = 0;

  function initGallery() {
    const galleryContainer = document.querySelector('#gallery-container')
      || document.querySelector('.gallery-grid')
      || document.querySelector('.gallery');
    if (!galleryContainer) return;

    galleryImages = [];
    const items = Array.from(galleryContainer.querySelectorAll('.gallery-item'));
    items.forEach((item) => {
      const src = item.dataset.src || item.querySelector('img')?.src;
      if (!src) return;
      const caption = item.dataset.caption || item.querySelector('.gallery-item-caption')?.textContent || '';
      const index = galleryImages.push({ src, caption }) - 1;
      item.addEventListener('click', () => openLightbox(index));
    });

    if (!galleryImages.length) return;

    if (!document.querySelector('.lightbox')) {
      createLightbox();
    }
  }

  function createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button class="lightbox-nav lightbox-prev" aria-label="Previous">&#8249;</button>' +
      '<button class="lightbox-nav lightbox-next" aria-label="Next">&#8250;</button>' +
      '<div class="lightbox-content"><img src="" alt=""><div class="lightbox-caption"></div></div>';
    document.body.appendChild(lightbox);

    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => navigateLightbox(1));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });
  }

  function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    document.querySelector('.lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    document.querySelector('.lightbox').classList.remove('active');
    document.body.style.overflow = '';
  }

  function navigateLightbox(direction) {
    currentImageIndex += direction;
    if (currentImageIndex < 0) currentImageIndex = galleryImages.length - 1;
    if (currentImageIndex >= galleryImages.length) currentImageIndex = 0;
    updateLightboxImage();
  }

  function updateLightboxImage() {
    const lightbox = document.querySelector('.lightbox');
    const img = lightbox.querySelector('img');
    const caption = lightbox.querySelector('.lightbox-caption');
    const current = galleryImages[currentImageIndex];

    if (current) {
      img.src = current.src;
      caption.textContent = current.caption;
    }
  }

  // ==========================================
  // DYNAMIC CONTENT RENDERING
  // ==========================================

  async function renderWorkshops() {
    const container = document.getElementById('workshops-container');
    if (!container) return;

    const data = await loadContent('workshops.json');
    if (!data) return;

    const lang = getLang();
    let html = '';

    data.workshops.forEach(workshop => {
      html += '<div class="service-card has-image">' +
        '<img src="' + workshop.image + '" alt="' + t(workshop.title, lang) + '" class="category-image" onerror="this.style.display=\'none\'">' +
        '<h3>' + t(workshop.title, lang) + '</h3>' +
        '<p>' + t(workshop.description, lang) + '</p></div>';
    });

    container.innerHTML = html;
  }

  async function renderGallery() {
    const container = document.getElementById('gallery-container');
    if (!container) return;

    const data = await loadContent('gallery.json');
    const status = document.querySelector('.gallery-status');
    if (!data || !data.items || !data.items.length) {
      if (status) status.classList.remove('is-hidden');
      return;
    }

    const lang = getLang();
    let html = '';

    const items = data.items.filter(item => item && item.src && !String(item.src).includes('example'));
    if (!items.length) {
      if (status) status.classList.remove('is-hidden');
      return;
    }

    items.forEach(item => {
      const thumb = item.thumb || item.src;
      html += '<div class="gallery-item" data-src="' + item.src + '" data-caption="' + t(item.caption, lang) + '">' +
        '<img src="' + thumb + '" alt="' + t(item.caption, lang) + '" loading="lazy">' +
        '<div class="gallery-item-caption">' + t(item.caption, lang) + '</div></div>';
    });

    container.innerHTML = html;
    if (status) status.classList.add('is-hidden');
    initGallery();
  }

  async function renderProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    const data = await loadContent('products.json');
    if (!data) return;
  }

  // ==========================================
  // BOOKING LOGIC (Auto-fill & Scroll)
  // ==========================================
  function handleBookingParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookTarget = urlParams.get('book');

    if (bookTarget) {
      const formSection = document.querySelector('.form-section');
      const selectEn = document.getElementById('ws-type-en') || document.getElementById('workshop-en') || document.getElementById('workshop-pedal-en');
      const selectHe = document.getElementById('ws-type-he') || document.getElementById('workshop-he') || document.getElementById('workshop-pedal-he');

      if (selectEn && bookTarget) selectEn.value = bookTarget;
      if (selectHe && bookTarget) selectHe.value = bookTarget;

      if (formSection) {
        setTimeout(() => {
          formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }

  // ==========================================
  // FORMSUBMIT REPLY-TO & ANALYTICS
  // ==========================================
  function trackFormSubmit(form) {
    var formName = form.getAttribute('data-form-name') || form.getAttribute('name') || 'form';
    var page = window.location.pathname.split('/').pop() || 'index.html';
    var payload = { form: formName, page: page };

    if (window.gtag) {
      window.gtag('event', 'form_submit', payload);
    }
    if (window.plausible) {
      window.plausible('form_submit', { props: payload });
    }
    if (window.umami && typeof window.umami.track === 'function') {
      window.umami.track('form_submit', payload);
    }
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push(Object.assign({ event: 'form_submit' }, payload));
    }
  }

  function initFormSubmitReplyTo() {
    var forms = document.querySelectorAll('form[action*="formsubmit.co"]');
    forms.forEach(function(form) {
      form.addEventListener('submit', function() {
        var emailInput = form.querySelector('input[name="email"]');
        var replyToInput = form.querySelector('input[name="_replyto"]');
        if (emailInput && replyToInput) {
          replyToInput.value = emailInput.value;
        }
        trackFormSubmit(form);
      });
    });
  }

  // ==========================================
  // BACK LINKS
  // ==========================================
  function initBackLinks() {
    document.querySelectorAll('[data-back]').forEach(function(link) {
      link.addEventListener('click', function(event) {
        event.preventDefault();
        if (window.history.length > 1) {
          window.history.back();
          return;
        }
        var fallback = link.getAttribute('data-back-fallback');
        if (fallback) {
          window.location.href = fallback;
        }
      });
    });
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================
  function init() {
    applyLang(getLang());
    applyTheme(getTheme());

    // Bind language toggle
    document.querySelectorAll('.lang-toggle').forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        toggleLang();
      });
    });

    // Bind theme toggle
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        toggleTheme();
      });
    });

    // Mark current page in nav
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
      var href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });

    // Init features
    initMobileMenu();
    initScrollReveal();
    initGallery();
    handleBookingParams();
    initBackLinks();
    initFormSubmitReplyTo();

    // Render dynamic content if containers exist
    renderWorkshops();
    renderGallery();
    renderProducts();
  }

  // Run init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose utilities globally
  window.SSHIT = {
    getLang,
    setLang,
    toggleLang,
    getTheme,
    setTheme,
    toggleTheme,
    loadContent,
    t
  };

  // ==========================================
  // EASTER EGG: Konami Code -> OS Interface
  // Up Up Down Down Left Right Left Right B A
  // ==========================================
  var konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  var konamiIndex = 0;

  document.addEventListener('keydown', function(e) {
    var key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

    if (key === konamiCode[konamiIndex]) {
      konamiIndex++;

      if (konamiIndex === konamiCode.length) {
        konamiIndex = 0;
        activateOS();
      }
    } else {
      konamiIndex = 0;
    }
  });

  function activateOS() {
    document.body.style.transition = 'none';
    document.body.style.filter = 'invert(1)';

    setTimeout(function() {
      document.body.style.filter = 'none';
      setTimeout(function() {
        document.body.style.filter = 'invert(1) hue-rotate(90deg)';
        setTimeout(function() {
          window.location.href = 'os.html';
        }, 200);
      }, 100);
    }, 100);
  }
})();
