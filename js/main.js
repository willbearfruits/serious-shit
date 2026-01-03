// Serious S.H.I.T. - Main JavaScript
// Language toggle, theme toggle, gallery, and content loading

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
    // Set on documentElement (<html>) to match the inline script in <head>
    const html = document.documentElement;
    html.setAttribute('data-lang', lang);
    html.setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr');
    html.setAttribute('lang', lang);

    // Update toggle button text
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
  // THEME MANAGEMENT (Light/Dark)
  // ==========================================
  const THEME_KEY = 'sshit-theme';
  const DEFAULT_THEME = 'light';

  function getTheme() {
    // Check localStorage first
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;

    // Fall back to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return DEFAULT_THEME;
  }

  function setTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);

    // Update toggle button
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  function toggleTheme() {
    const current = getTheme();
    const next = current === 'light' ? 'dark' : 'light';
    setTheme(next);
  }

  // Listen for system theme changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // ==========================================
  // CONTENT LOADING
  // ==========================================
  async function loadContent(file) {
    try {
      const response = await fetch(`content/${file}`);
      if (!response.ok) throw new Error(`Failed to load ${file}`);
      return await response.json();
    } catch (error) {
      console.warn(`Could not load content/${file}:`, error);
      return null;
    }
  }

  // Get translated text from content object
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

    // Create lightbox if it doesn't exist
    if (!document.querySelector('.lightbox')) {
      createLightbox();
    }
  }

  function createLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <button class="lightbox-nav lightbox-prev" aria-label="Previous">&#8249;</button>
      <button class="lightbox-nav lightbox-next" aria-label="Next">&#8250;</button>
      <div class="lightbox-content">
        <img src="" alt="">
        <div class="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(lightbox);

    // Event listeners
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => navigateLightbox(-1));
    lightbox.querySelector('.lightbox-next').addEventListener('click', () => navigateLightbox(1));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
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

  // Render workshops from JSON
  async function renderWorkshops() {
    const container = document.getElementById('workshops-container');
    if (!container) return;

    const data = await loadContent('workshops.json');
    if (!data) return;

    const lang = getLang();
    let html = '';

    data.workshops.forEach(workshop => {
      html += `
        <div class="service-card has-image">
          <img src="${workshop.image}" alt="${t(workshop.title, lang)}" class="category-image"
               onerror="this.style.display='none'">
          <h3>${t(workshop.title, lang)}</h3>
          <p>${t(workshop.description, lang)}</p>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  // Render gallery from JSON
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
      html += `
        <div class="gallery-item" data-src="${item.src}" data-caption="${t(item.caption, lang)}">
          <img src="${thumb}" alt="${t(item.caption, lang)}" loading="lazy">
          <div class="gallery-item-caption">${t(item.caption, lang)}</div>
        </div>
      `;
    });

    container.innerHTML = html;
    if (status) status.classList.add('is-hidden');
    initGallery();
  }

  // Render products from JSON
  async function renderProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    const data = await loadContent('products.json');
    if (!data) return;

    const lang = getLang();
    // Products rendering would go here
  }

  // ==========================================
  // BOOKING LOGIC (Auto-fill & Scroll)
  // ==========================================
  function handleBookingParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookTarget = urlParams.get('book');
    
    if (bookTarget) {
      // Find the form and select element
      const formSection = document.querySelector('.form-section');
      const selectEn = document.getElementById('ws-type-en');
      const selectHe = document.getElementById('ws-type-he');
      
      // Auto-select the option
      if (selectEn) selectEn.value = bookTarget;
      if (selectHe) selectHe.value = bookTarget;
      
      // Scroll to form immediately
      if (formSection) {
        // slight delay to ensure render
        setTimeout(() => {
          formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Highlight the section
          formSection.style.animation = 'highlight 1s ease';
        }, 100);
      }
    }
  }

  // ==========================================
  // INITIALIZATION
  // ==========================================
  function init() {
    // Apply saved preferences
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
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });

    // Initialize gallery if present
    initGallery();
    
    // Handle smart booking links
    handleBookingParams();

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
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;

    if (key === konamiCode[konamiIndex]) {
      konamiIndex++;

      if (konamiIndex === konamiCode.length) {
        // Easter egg triggered!
        konamiIndex = 0;
        activateOS();
      }
    } else {
      konamiIndex = 0;
    }
  });

  function activateOS() {
    // Glitch effect before redirect
    document.body.style.transition = 'none';
    document.body.style.filter = 'invert(1)';

    setTimeout(() => {
      document.body.style.filter = 'none';
      setTimeout(() => {
        document.body.style.filter = 'invert(1) hue-rotate(90deg)';
        setTimeout(() => {
          window.location.href = 'os.html';
        }, 200);
      }, 100);
    }, 100);
  }
})();
