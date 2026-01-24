/* ==========================================================================
   Splash Manager - Gestión del Splash Screen con Carousel de Promociones
   ========================================================================== */

const SplashManager = {
  promociones: [],
  timerContinuar: null,

  /**
   * Inicializa el splash screen
   */
  async init() {
    SanbornsUtils.log('🎨 Inicializando Splash Manager...');

    try {
      // Cargar promociones desde db.json
      await this.loadPromociones();

      // Renderizar carousel
      this.renderCarousel();

      // Mostrar botón continuar después de 5 segundos
      this.showContinuarButton();

      // Setup evento click en botón continuar
      this.setupContinuarButton();

      SanbornsUtils.log('✅ Splash Manager inicializado');
    } catch (error) {
      SanbornsUtils.log(
        '❌ Error inicializando Splash Manager',
        'error',
        error
      );
      // Si falla, mostrar botón inmediatamente
      this.showContinuarButtonImmediate();
    }
  },

  /**
   * Carga promociones desde db.json
   */
  async loadPromociones() {
    try {
      const response = await $.get('db.json');
      this.promociones = response.promociones.lstima || [];
      SanbornsUtils.log('Promociones cargadas:', this.promociones);
    } catch (error) {
      SanbornsUtils.log('Error cargando promociones', 'error', error);
      // Fallback a imágenes por defecto
      this.promociones = [
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1080&h=600&fit=crop',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1080&h=600&fit=crop',
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1080&h=600&fit=crop',
      ];
    }
  },

  /**
   * Renderiza el carousel con las promociones
   */
  renderCarousel() {
    const $carouselContent = $('#carousel-content');
    $carouselContent.empty();

    this.promociones.forEach((imgUrl, index) => {
      const activeClass = index === 0 ? 'active' : '';
      const $item = $(`
        <div class="carousel-item ${activeClass}">
          <img src="${imgUrl}" class="d-block w-100" alt="Promoción ${index + 1}">
        </div>
      `);
      $carouselContent.append($item);
    });

    SanbornsUtils.log(
      'Carousel renderizado con',
      this.promociones.length,
      'imágenes'
    );
  },

  /**
   * Muestra el botón continuar después de 5 segundos
   */
  showContinuarButton() {
    this.timerContinuar = setTimeout(() => {
      $('#continuar-btn-container').css({
        opacity: 1,
        transition: 'opacity 0.8s ease-in-out',
      });
      SanbornsUtils.log('Botón Continuar visible');
    }, 5000);
  },

  /**
   * Muestra el botón continuar inmediatamente (fallback)
   */
  showContinuarButtonImmediate() {
    $('#continuar-btn-container').css({
      opacity: 1,
      transition: 'opacity 0.3s ease-in-out',
    });
  },

  /**
   * Setup evento click en botón continuar
   */
  setupContinuarButton() {
    $('#btn-continuar').on('click', e => {
      e.preventDefault();
      SanbornsUtils.log('Click en botón Continuar');

      // Ocultar splash
      this.hideSplash();

      // Mostrar modal de Mesa/Silla
      MesaSillaManager.showModal();
    });
  },

  /**
   * Oculta el splash screen
   */
  hideSplash() {
    $('#loading-screen').addClass('fade-out');
    setTimeout(() => {
      $('#loading-screen').hide();
    }, 500);
  },

  /**
   * Resetea el splash (para desarrollo)
   */
  reset() {
    if (this.timerContinuar) {
      clearTimeout(this.timerContinuar);
    }
    $('#loading-screen').removeClass('fade-out').show();
    $('#continuar-btn-container').css('opacity', 0);
  },
};
