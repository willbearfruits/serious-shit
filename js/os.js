// S.H.I.T. OS - Windows 95-style Interface
// Experimental Easter Egg Interface

(function() {
  'use strict';

  // ==========================================
  // STATE
  // ==========================================
  const state = {
    windows: {},
    windowOrder: [],
    activeWindow: null,
    windowCount: 0,
    draggedWindow: null,
    dragOffset: { x: 0, y: 0 },
    startMenuOpen: false
  };

  // ==========================================
  // BOOT SEQUENCE
  // ==========================================
  function boot() {
    const bootScreen = document.getElementById('boot-screen');

    setTimeout(() => {
      bootScreen.classList.add('hidden');
      updateClock();
      setInterval(updateClock, 1000);
    }, 2500);
  }

  // ==========================================
  // WINDOW MANAGEMENT
  // ==========================================
  function createWindow(windowId) {
    if (state.windows[windowId]) {
      focusWindow(windowId);
      if (state.windows[windowId].minimized) {
        restoreWindow(windowId);
      }
      return;
    }

    const template = document.getElementById('window-template');
    const contentSource = document.querySelector(`#window-contents [data-window="${windowId}"]`);

    if (!contentSource) return;

    const windowEl = template.content.cloneNode(true).querySelector('.window');
    const title = contentSource.dataset.title || windowId;

    windowEl.dataset.windowId = windowId;
    windowEl.querySelector('.window-title').textContent = title;
    windowEl.querySelector('.window-content').innerHTML = contentSource.innerHTML;

    // Position window
    const offset = state.windowCount * 30;
    windowEl.style.left = (100 + offset) + 'px';
    windowEl.style.top = (50 + offset) + 'px';
    windowEl.style.width = '450px';
    windowEl.style.height = '350px';

    // Add event listeners
    setupWindowEvents(windowEl, windowId);

    document.getElementById('windows-container').appendChild(windowEl);

    state.windows[windowId] = {
      element: windowEl,
      minimized: false,
      maximized: false
    };
    state.windowCount++;

    addTaskbarItem(windowId, title);
    focusWindow(windowId);

    // Special handling for terminal
    if (windowId === 'terminal') {
      setupTerminal();
    }
  }

  function setupWindowEvents(windowEl, windowId) {
    const titlebar = windowEl.querySelector('.window-titlebar');
    const closeBtn = windowEl.querySelector('.window-btn.close');
    const minBtn = windowEl.querySelector('.window-btn.minimize');
    const maxBtn = windowEl.querySelector('.window-btn.maximize');

    // Drag
    titlebar.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('window-btn')) return;
      startDrag(windowId, e);
    });

    // Focus on click
    windowEl.addEventListener('mousedown', () => focusWindow(windowId));

    // Buttons
    closeBtn.addEventListener('click', () => closeWindow(windowId));
    minBtn.addEventListener('click', () => minimizeWindow(windowId));
    maxBtn.addEventListener('click', () => toggleMaximize(windowId));

    // Double-click titlebar to maximize
    titlebar.addEventListener('dblclick', () => toggleMaximize(windowId));
  }

  function focusWindow(windowId) {
    if (state.activeWindow === windowId) return;

    // Deactivate previous
    if (state.activeWindow && state.windows[state.activeWindow]) {
      state.windows[state.activeWindow].element.classList.add('inactive');
      const prevTaskbarItem = document.querySelector(`.taskbar-item[data-window="${state.activeWindow}"]`);
      if (prevTaskbarItem) prevTaskbarItem.classList.remove('active');
    }

    // Activate new
    state.activeWindow = windowId;
    const windowData = state.windows[windowId];
    if (windowData) {
      windowData.element.classList.remove('inactive');
      windowData.element.style.zIndex = ++state.windowCount + 100;

      const taskbarItem = document.querySelector(`.taskbar-item[data-window="${windowId}"]`);
      if (taskbarItem) taskbarItem.classList.add('active');
    }
  }

  function closeWindow(windowId) {
    const windowData = state.windows[windowId];
    if (!windowData) return;

    windowData.element.remove();
    delete state.windows[windowId];

    // Remove taskbar item
    const taskbarItem = document.querySelector(`.taskbar-item[data-window="${windowId}"]`);
    if (taskbarItem) taskbarItem.remove();

    // Update status bar
    updateStatusBar();

    if (state.activeWindow === windowId) {
      state.activeWindow = null;
    }
  }

  function minimizeWindow(windowId) {
    const windowData = state.windows[windowId];
    if (!windowData) return;

    windowData.element.classList.add('minimized');
    windowData.minimized = true;

    const taskbarItem = document.querySelector(`.taskbar-item[data-window="${windowId}"]`);
    if (taskbarItem) taskbarItem.classList.remove('active');

    state.activeWindow = null;
  }

  function restoreWindow(windowId) {
    const windowData = state.windows[windowId];
    if (!windowData) return;

    windowData.element.classList.remove('minimized');
    windowData.minimized = false;
    focusWindow(windowId);
  }

  function toggleMaximize(windowId) {
    const windowData = state.windows[windowId];
    if (!windowData) return;

    const el = windowData.element;

    if (windowData.maximized) {
      // Restore
      el.style.left = windowData.prevPos.left;
      el.style.top = windowData.prevPos.top;
      el.style.width = windowData.prevPos.width;
      el.style.height = windowData.prevPos.height;
      windowData.maximized = false;
    } else {
      // Maximize
      windowData.prevPos = {
        left: el.style.left,
        top: el.style.top,
        width: el.style.width,
        height: el.style.height
      };
      el.style.left = '0';
      el.style.top = '0';
      el.style.width = '100%';
      el.style.height = 'calc(100vh - 32px)';
      windowData.maximized = true;
    }
  }

  // ==========================================
  // DRAG HANDLING
  // ==========================================
  function startDrag(windowId, e) {
    const windowData = state.windows[windowId];
    if (!windowData || windowData.maximized) return;

    state.draggedWindow = windowId;
    const rect = windowData.element.getBoundingClientRect();
    state.dragOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
  }

  function handleDrag(e) {
    if (!state.draggedWindow) return;

    const windowData = state.windows[state.draggedWindow];
    if (!windowData) return;

    const newX = e.clientX - state.dragOffset.x;
    const newY = Math.max(0, e.clientY - state.dragOffset.y);

    windowData.element.style.left = newX + 'px';
    windowData.element.style.top = newY + 'px';
  }

  function stopDrag() {
    state.draggedWindow = null;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
  }

  // ==========================================
  // TASKBAR
  // ==========================================
  function addTaskbarItem(windowId, title) {
    const taskbarWindows = document.getElementById('taskbar-windows');
    const item = document.createElement('div');
    item.className = 'taskbar-item active';
    item.dataset.window = windowId;
    item.textContent = title;

    item.addEventListener('click', () => {
      const windowData = state.windows[windowId];
      if (windowData.minimized) {
        restoreWindow(windowId);
      } else if (state.activeWindow === windowId) {
        minimizeWindow(windowId);
      } else {
        focusWindow(windowId);
      }
    });

    taskbarWindows.appendChild(item);
  }

  function updateStatusBar() {
    const windowCount = Object.keys(state.windows).length;
    // Could update a status indicator here
  }

  // ==========================================
  // START MENU
  // ==========================================
  function toggleStartMenu() {
    const menu = document.getElementById('start-menu');
    const btn = document.getElementById('start-button');

    state.startMenuOpen = !state.startMenuOpen;
    menu.classList.toggle('hidden', !state.startMenuOpen);
    btn.classList.toggle('active', state.startMenuOpen);
  }

  function closeStartMenu() {
    const menu = document.getElementById('start-menu');
    const btn = document.getElementById('start-button');

    state.startMenuOpen = false;
    menu.classList.add('hidden');
    btn.classList.remove('active');
  }

  // ==========================================
  // TERMINAL
  // ==========================================
  function setupTerminal() {
    const input = document.getElementById('terminal-input');
    if (!input) return;

    input.focus();
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        processCommand(input.value);
        input.value = '';
      }
    });
  }

  function processCommand(cmd) {
    const output = document.getElementById('terminal-output');
    const command = cmd.trim().toLowerCase();

    // Echo command
    addTerminalLine(`guest@shit-os:~$ ${cmd}`);

    // Process
    switch (command) {
      case 'help':
        addTerminalLine('Available commands:');
        addTerminalLine('  help      - Show this help');
        addTerminalLine('  about     - About S.H.I.T. OS');
        addTerminalLine('  workshops - Open workshops');
        addTerminalLine('  gear      - View Fuzilator');
        addTerminalLine('  contact   - Contact info');
        addTerminalLine('  exit      - Return to normal site');
        addTerminalLine('  clear     - Clear terminal');
        addTerminalLine('  matrix    - ???');
        break;

      case 'about':
        addTerminalLine('S.H.I.T. OS v0.1.0');
        addTerminalLine('Super Hyper Incredible Things');
        addTerminalLine('By Yaniv Schonfeld');
        addTerminalLine('Nothing Is Holy.');
        break;

      case 'workshops':
        createWindow('workshops');
        addTerminalLine('Opening workshops.exe...');
        break;

      case 'gear':
      case 'fuzilator':
        createWindow('gear');
        addTerminalLine('Opening Fuzilator.exe...');
        break;

      case 'contact':
        createWindow('contact');
        addTerminalLine('Opening contact.exe...');
        break;

      case 'exit':
        addTerminalLine('Exiting S.H.I.T. OS...');
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 500);
        break;

      case 'clear':
        output.innerHTML = '';
        break;

      case 'matrix':
        addTerminalLine('Wake up, Neo...');
        addTerminalLine('The Matrix has you...');
        addTerminalLine('Follow the white rabbit.');
        document.body.style.animation = 'glitch 0.3s infinite';
        setTimeout(() => {
          document.body.style.animation = '';
        }, 3000);
        break;

      case '':
        break;

      default:
        addTerminalLine(`Command not found: ${cmd}`);
        addTerminalLine('Type "help" for available commands.');
    }

    // Scroll to bottom
    output.scrollTop = output.scrollHeight;
  }

  function addTerminalLine(text) {
    const output = document.getElementById('terminal-output');
    const line = document.createElement('div');
    line.className = 'term-line';
    line.textContent = text;
    output.appendChild(line);
  }

  // ==========================================
  // CLOCK
  // ==========================================
  function updateClock() {
    const clock = document.getElementById('clock');
    const now = new Date();
    clock.textContent = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  // ==========================================
  // EVENT LISTENERS
  // ==========================================
  function init() {
    // Boot sequence
    boot();

    // Desktop icons
    document.querySelectorAll('.icon').forEach(icon => {
      icon.addEventListener('dblclick', () => {
        const windowId = icon.dataset.window;
        const action = icon.dataset.action;

        if (windowId) {
          createWindow(windowId);
        } else if (action === 'exit') {
          window.location.href = 'index.html';
        }
      });

      icon.addEventListener('click', () => {
        document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
        icon.classList.add('selected');
      });
    });

    // Start button
    document.getElementById('start-button').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleStartMenu();
    });

    // Start menu items
    document.querySelectorAll('.start-menu-item').forEach(item => {
      item.addEventListener('click', () => {
        const windowId = item.dataset.window;
        const action = item.dataset.action;

        if (windowId) {
          createWindow(windowId);
        } else if (action === 'exit') {
          window.location.href = 'index.html';
        }

        closeStartMenu();
      });
    });

    // Close start menu on click outside
    document.addEventListener('click', (e) => {
      if (state.startMenuOpen && !e.target.closest('#start-menu') && !e.target.closest('#start-button')) {
        closeStartMenu();
      }
    });

    // Desktop click to deselect icons
    document.getElementById('desktop').addEventListener('click', (e) => {
      if (e.target.id === 'desktop' || e.target.classList.contains('desktop-icons')) {
        document.querySelectorAll('.icon').forEach(i => i.classList.remove('selected'));
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // ESC to exit
      if (e.key === 'Escape') {
        if (state.startMenuOpen) {
          closeStartMenu();
        } else {
          // Show exit confirm or just go back
          if (confirm('Exit S.H.I.T. OS and return to normal site?')) {
            window.location.href = 'index.html';
          }
        }
      }
    });

    // Language toggle in system tray
    document.getElementById('lang-indicator').addEventListener('click', () => {
      const indicator = document.getElementById('lang-indicator');
      indicator.textContent = indicator.textContent === 'EN' ? 'HE' : 'EN';
    });
  }

  // Run init when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
