/* ==========================================================================
   App Main - Aplicación principal estilo 90's con jQuery
   ========================================================================== */

$(document).ready(function () {
  'use strict';

  // ==========================================================================
  // Inicialización de la App
  // ==========================================================================

  SanbornsApp.init();
});

const SanbornsApp = {
  /* ==========================================================================
       Estado de la Aplicación
       ========================================================================== */
  currentSection: 'menu',
  isLoading: true,

  /* ==========================================================================
       Inicialización
       ========================================================================== */

  async init() {
    SanbornsUtils.log('🍽️ Iniciando Sanborns WebApp...');

    try {
      // Mostrar loading screen
      this.showLoadingScreen();

      // Inicializar componentes
      await this.initComponents();

      // Setup navegación
      this.setupNavigation();

      // Setup eventos globales
      this.setupGlobalEvents();

      // NO mostrar sección inicial automáticamente
      // La sección se mostrará solo cuando el usuario haga click en un botón

      // NO ocultar loading automáticamente
      // El loading se ocultará solo cuando el usuario haga click

      SanbornsUtils.log('✅ App inicializada correctamente');
      // SanbornsUtils.showToast('¡Bienvenido a Sanborns!', 'success');
    } catch (error) {
      SanbornsUtils.log('❌ Error inicializando app', 'error', error);
      this.showErrorScreen();
    }
  },

  /**
   * Inicializa todos los componentes
   */
  async initComponents() {
    // Inicializar MobileTopNavbar (solo en mobile)
    if (window.innerWidth < 768) {
      await MobileTopNavbar.init();
    }

    // Inicializar CartManager
    CartManager.init();

    // Mostrar primer botón: "Menú del día" (siempre disponible)
    this.showMenuDelDiaButton();

    // Inicializar MenuManager (async) y mostrar botones conforme se cargan
    await this.loadMenuWithProgressiveButtons();

    // Configurar PWA
    this.setupPWA();

    // Ocultar spinner cuando todo esté listo
    this.hideSpinner();
  },

  /**
   * Carga el menú y muestra botones progresivamente
   */
  async loadMenuWithProgressiveButtons() {
    try {
      // Inicializar MenuManager
      await MenuManager.init();

      // ESPERAR a que el menú esté completamente cargado
      await MenuManager.loadMenuData();

      // Una vez cargado el menú general, mostrar su botón
      this.showMenuGeneralButton();

      // Verificar qué menús contextuales están disponibles y mostrar botones
      this.showContextualMenuButtons();
    } catch (error) {
      SanbornsUtils.log('Error cargando menú', 'error', error);
      // En caso de error, mostrar solo botón general
      this.showMenuGeneralButton();
    }
  },

  /**
   * Muestra el botón "Menú del día" (siempre disponible)
   */
  showMenuDelDiaButton() {
    const buttonHtml = `
            <button class="btn loading-menu-btn" onclick="handleScheduleButtonClick('menu-del-dia')" style="animation-delay: 0s">
                <i class="fa-regular fa-face-smile"></i> Menú del día
            </button>
        `;

    $('#schedule-buttons-container').append(buttonHtml).removeClass('d-none');
  },

  /**
   * Muestra el botón "Menú general"
   */
  showMenuGeneralButton() {
    const buttonHtml = `
            <button class="btn loading-menu-btn" onclick="handleGeneralMenuClick()" style="animation-delay: 0.3s">
                <span class="menu-icon-mask me-2"></span> Menú Sanborns
            </button>
        `;

    $('#schedule-buttons-container').append(buttonHtml);
  },

  /**
   * Muestra botones de menús contextuales según horario y disponibilidad
   */
  showContextualMenuButtons() {
    const menuData = window.MenuManager ? window.MenuManager.menuData : null;

    if (!menuData) {
      return;
    }
    // Generar botones contextuales (desayunos, comidas, cenas)
    const contextualButtons = SanbornsUtils.generateScheduleButtons(menuData);

    contextualButtons.forEach((button, index) => {
      if (button.type === 'schedule') {
        const delay = (index + 3) * 0.3; // +3 porque ya hay 3 botones
        const buttonHtml = `
                    <button 
                        class="btn ${button.className} loading-menu-btn" 
                        onclick="handleScheduleButtonClick('${button.target}')"
                        style="animation-delay: ${delay}s"
                        title="${button.description || ''}"
                    >
                        ${button.icon} ${button.text}
                    </button>
                `;

        $('#schedule-buttons-container').prepend(buttonHtml);
      }
    });
  },

  /**
   * Oculta el spinner cuando todo está listo
   */
  hideSpinner() {
    $('.loading-spinner').fadeOut(500);
    $('.loading-text').fadeOut(500, function () {
      $(this)
        .html('<h3 class="text-white mt-3">¿Qué te apetece hoy?</h3>')
        .fadeIn(300);
    });
  },

  /* ==========================================================================
       Loading & Error States
       ========================================================================== */

  /**
   * Muestra pantalla de carga
   */
  showLoadingScreen() {
    $('#loading-screen').removeClass('fade-out');
    this.isLoading = true;
  },

  /**
   * Genera botones dinámicos en el loading screen según el horario
   */
  generateLoadingScreenButtons() {
    // Obtener datos del menú (si están disponibles)
    const menuData = window.MenuManager ? window.MenuManager.menuData : null;

    if (!menuData) {
      // Si no hay datos del menú, mostrar botón general
      this.showGeneralLoadingButton();
      return;
    }

    // Generar botones según configuración de horarios
    const buttons = SanbornsUtils.generateScheduleButtons(menuData);
    this.renderLoadingButtons(buttons);
  },

  /**
   * Muestra botón general cuando no hay datos del menú
   */
  showGeneralLoadingButton() {
    const buttonHtml = `
            <button class="btn btn-primary" onclick="handleGeneralMenuClick()">
                <span>🍽️</span> Ir al menú completo
            </button>
        `;

    $('#schedule-buttons-container').html(buttonHtml).removeClass('d-none');
  },

  /**
   * Renderiza los botones dinámicos en el loading screen
   * @param {Array} buttons - Array de configuración de botones
   */
  renderLoadingButtons(buttons) {
    if (!buttons || buttons.length === 0) {
      this.showGeneralLoadingButton();
      return;
    }

    let buttonsHtml = '';

    buttons.forEach((button, index) => {
      const delay = index * 0.2; // Stagger animation

      if (button.type === 'schedule') {
        buttonsHtml += `
                    <button 
                        class="btn ${button.className}" 
                        onclick="handleScheduleButtonClick('${button.target}')"
                        style="animation-delay: ${delay}s"
                        title="${button.description || ''}"
                    >
                        <span>${button.icon}</span> ${button.text}
                    </button>
                `;
      } else {
        buttonsHtml += `
                    <button 
                        class="btn ${button.className}" 
                        onclick="handleGeneralMenuClick()"
                        style="animation-delay: ${delay}s"
                    >
                        <span>${button.icon}</span> ${button.text}
                    </button>
                `;
      }
    });

    $('#schedule-buttons-container').html(buttonsHtml).removeClass('d-none');
  },

  /**
   * Maneja click en botón de horario específico
   * @param {string} menuNode - Nodo del menú al que navegar
   */
  handleScheduleButtonClick(menuNode) {
    // Ocultar loading screen
    this.hideLoadingScreen();

    // Cambiar estado
    this.isLoading = false;

    // Navegar a la sección específica
    setTimeout(() => {
      if (menuNode === 'Paquetes desayunos') {
        // Para desayunos, ir al menú y hacer scroll a la sección
        this.showSection('menu');
        setTimeout(() => {
          SanbornsUtils.navigateToMenuSection(menuNode);
        }, 100);
      } else {
        SanbornsUtils.navigateToMenuSection(menuNode);
      }
    }, 600);
  },

  /**
   * Maneja click en botón de menú general
   */
  handleGeneralMenuClick() {
    // Ocultar loading screen
    this.hideLoadingScreen();

    // Cambiar estado
    this.isLoading = false;

    // Ir al menú general
    setTimeout(() => {
      this.showSection('menu');
    }, 600);
  },

  hideLoader() {
    this.isLoading = false;
  },

  /**
   * Oculta pantalla de carga
   */
  hideLoadingScreen() {
    $('#loading-screen').addClass('fade-out');
    // this.isLoading = false;

    // Animar entrada del contenido principal
    $('#main-content').addClass('animate-fadeInUp');
    $('#desktop-header').addClass('animate-slideInBottom');
    $('#mobile-nav').addClass('animate-slideInBottom');
  },

  /**
   * Muestra pantalla de error
   */
  showErrorScreen() {
    $('#loading-screen .loading-spinner').html(`
            <i class="fas fa-exclamation-triangle text-warning" style="font-size: 3rem;"></i>
            <h3 class="mt-3 text-white">Error al cargar</h3>
            <p class="text-white-50">Hubo un problema al inicializar la aplicación</p>
            <button class="btn btn-light mt-3" onclick="location.reload()">
                <i class="fas fa-sync-alt me-2"></i>Reintentar
            </button>
        `);
  },

  /* ==========================================================================
       Navegación
       ========================================================================== */

  /**
   * Configura la navegación
   */
  setupNavigation() {
    // Navegación desktop
    $('#desktop-header .nav-link').on('click', e => {
      e.preventDefault();
      const $link = $(e.currentTarget);
      const section = $link.data('section');

      // Verificar si el botón está deshabilitado
      if ($link.hasClass('disabled') || $link.attr('disabled')) {
        SanbornsUtils.showToast('Función no disponible', 'warning');
        return;
      }

      if (section) {
        this.showSection(section);
      }
    });

    // Navegación móvil
    $('#mobile-nav .nav-item').on('click', e => {
      const $item = $(e.currentTarget);
      const section = $item.data('section');

      // Verificar si el botón está deshabilitado
      if ($item.hasClass('disabled')) {
        e.preventDefault();
        SanbornsUtils.showToast('Función no disponible', 'warning');
        return;
      }

      if (section) {
        this.showSection(section);
      }
    });
  },

  /**
   * Muestra una sección específica
   * @param {string} sectionName - Nombre de la sección
   */
  showSection(sectionName) {
    if (this.isLoading) return;

    let targetSection = sectionName;
    if (sectionName === 'mi-orden') {
      targetSection = 'cuenta';
    }

    const validSections = ['menu', 'cuenta', 'mesero', 'mi-orden'];
    if (!validSections.includes(sectionName)) {
      SanbornsUtils.log(`Sección no válida: ${sectionName}`, 'warn');
      return;
    }

    this.currentSection = sectionName;

    $('.section').removeClass('active').hide();

    const $sectionTitle = $(`#${targetSection}-section h2`).first();
    $('.section h2').removeClass('section-header-sticky');

    if (sectionName === 'menu') {
      if (window.MobileTopNavbar) {
        window.MobileTopNavbar.enableScrollController();
        window.MobileTopNavbar.elements.navbar.removeClass('hide-in-mi-orden');
        window.MobileTopNavbar.elements.cartBtnFixed.removeClass(
          'hide-in-mi-orden'
        );
      }
    } else {
      if (window.MobileTopNavbar) {
        window.MobileTopNavbar.disableScrollController();
      }
      $sectionTitle.addClass('section-header-sticky');
    }

    const $targetSectionEl = $(`#${targetSection}-section`);

    $targetSectionEl
      .addClass('active')
      .fadeIn(300, function () {
        // LA LÓGICA DE ACTUALIZACIÓN DE LA VISTA DEBE EJECUTARSE DESPUÉS DE QUE EL CONTENEDOR ES VISIBLE
        if (sectionName === 'mi-orden') {
          CartManager.setView('cards');
        } else if (sectionName === 'cuenta') {
          CartManager.setView('list');
        }
      })
      .addClass('animate-fadeInUp');

    this.updateNavigation(sectionName);

    $('html, body').animate({ scrollTop: 0 }, 300);

    SanbornsUtils.log(`Navegando a sección: ${sectionName}`);
  },

  /**
   * Actualiza estado visual de la navegación
   * @param {string} activeSectionName - Sección activa
   */
  updateNavigation(activeSectionName) {
    // Desktop navigation
    $('#desktop-header .nav-link')
      .removeClass('active')
      .filter(`[data-section="${activeSectionName}"]`)
      .addClass('active');

    // Mobile navigation
    $('#mobile-nav .nav-item')
      .removeClass('active')
      .filter(`[data-section="${activeSectionName}"]`)
      .addClass('active');
  },

  /* ==========================================================================
       Eventos Globales
       ========================================================================== */

  /**
   * Configura eventos globales
   */
  setupGlobalEvents() {
    // Eventos de teclado
    $(document).on('keydown', e => {
      this.handleKeyboardShortcuts(e);
    });

    // Eventos de ventana
    $(window).on('beforeunload', () => {
      // Guardar estado antes de cerrar
      this.saveAppState();
    });

    // Eventos de online/offline
    window.addEventListener('online', () => {
      SanbornsUtils.showToast('Conexión restaurada', 'success');
    });

    window.addEventListener('offline', () => {
      SanbornsUtils.showToast('Sin conexión a internet', 'warning');
    });

    // Modal events
    $('#productModal').on('hidden.bs.modal', () => {
      // Limpiar datos del modal al cerrarlo
      $('#productModal').removeData('product');
    });

    // Cart button click handler
    $('#cart-btn-fixed').on('click', () => {
      this.showSection('mi-orden');
    });

    // Prevenir zoom en inputs en iOS
    if (this.isIOS()) {
      $('input[type="number"], input[type="text"]').attr('size', '1');
    }
  },

  /**
   * Maneja atajos de teclado
   * @param {Event} e - Evento de teclado
   */
  handleKeyboardShortcuts(e) {
    // Escape - Cerrar modales
    if (e.key === 'Escape') {
      $('.modal.show').modal('hide');
    }

    // Alt + M - Ir a menú
    if (e.altKey && e.key === 'm') {
      e.preventDefault();
      this.showSection('menu');
    }

    // Alt + C - Ir a cuenta
    if (e.altKey && e.key === 'c') {
      e.preventDefault();
      this.showSection('cuenta');
    }

    // Alt + S - Ir a mesero
    if (e.altKey && e.key === 's') {
      e.preventDefault();
      this.showSection('mesero');
    }

    // Ctrl + F - Focus en búsqueda
    if (e.ctrlKey && e.key === 'f' && this.currentSection === 'menu') {
      e.preventDefault();
      $('#search-input').focus();
    }
  },

  /* ==========================================================================
       PWA Setup
       ========================================================================== */

  /**
   * Configura PWA
   */
  setupPWA() {
    // Registrar service worker (si existe)
    if ('serviceWorker' in navigator) {
      // Detectar si estamos en GitHub Pages para ajustar la ruta
      const swPath =
        window.location.hostname === 'lodela.github.io' &&
        window.location.pathname.includes('/checkit/')
          ? './sw.js'
          : '/sw.js';

      navigator.serviceWorker
        .register(swPath)
        .then(registration => {
          SanbornsUtils.log('SW registrado', 'info', registration);
        })
        .catch(error => {
          SanbornsUtils.log('Error SW', 'warn', error);
        });
    }

    // Evento de instalación de PWA
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      //this.showInstallPrompt(e);
    });
  },

  /**
   * Muestra prompt de instalación PWA
   * @param {Event} e - Evento beforeinstallprompt
   */
  showInstallPrompt(e) {
    SanbornsUtils.showToast(
      'Instala la app para una mejor experiencia',
      'info',
      5000
    );

    // Guardar evento para uso posterior
    window.deferredPrompt = e;
  },

  /* ==========================================================================
       Estado de la App
       ========================================================================== */

  /**
   * Guarda estado de la aplicación
   */
  saveAppState() {
    const appState = {
      currentSection: this.currentSection,
      timestamp: new Date().toISOString(),
    };

    SanbornsUtils.saveToStorage('sanborns-app-state', appState);
  },

  /**
   * Restaura estado de la aplicación
   */
  restoreAppState() {
    const appState = SanbornsUtils.getFromStorage('sanborns-app-state');
    if (appState && appState.currentSection) {
      this.showSection(appState.currentSection);
    }
  },

  /* ==========================================================================
       Utilidades
       ========================================================================== */

  /**
   * Detecta si es iOS
   * @returns {boolean} - Es iOS
   */
  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  },

  /**
   * Detecta si es móvil
   * @returns {boolean} - Es móvil
   */
  isMobile() {
    return window.innerWidth < 768;
  },

  /**
   * Obtiene información del dispositivo
   * @returns {Object} - Info del dispositivo
   */
  getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenWidth: screen.width,
      screenHeight: screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      isOnline: navigator.onLine,
      isMobile: this.isMobile(),
      isIOS: this.isIOS(),
    };
  },
};

/* ==========================================================================
   Funciones Globales de Utilidad
   ========================================================================== */

/**
 * Función global para mostrar sección (llamada desde HTML)
 * @param {string} sectionName - Nombre de la sección
 */
window.showSection = function (sectionName) {
  SanbornsApp.showSection(sectionName);
};

/**
 * Función global para debugging
 */
window.debugSanborns = function () {
  console.group('🍽️ Sanborns Debug Info');
  console.log('App State:', SanbornsApp);
  console.log('Cart Data:', CartManager.getCartData());
  console.log('Menu Data:', MenuManager.menuData);
  console.log('Device Info:', SanbornsApp.getDeviceInfo());
  console.groupEnd();
};

/**
 * Funciones globales para botones del loading screen
 */
window.handleScheduleButtonClick = function (menuNode) {
  SanbornsApp.handleScheduleButtonClick(menuNode);
};

window.handleGeneralMenuClick = function () {
  SanbornsApp.handleGeneralMenuClick();
};

/* ==========================================================================
   Hacer disponibles globalmente
   ========================================================================== */

window.SanbornsApp = SanbornsApp;
