/* ==========================================================================
   App Main NEW - Nueva lógica para CheckIt (Monitor de Cuenta)
   ========================================================================== */

console.log(
  '%c🚀 APP-NEW.JS CARGADO CORRECTAMENTE!',
  'background: #dc3545; color: white; font-size: 20px; padding: 10px;'
);

const SanbornsAppNew = {
  currentSection: 'dashboard',
  isLoading: true,

  /**
   * Inicializa la nueva app
   */
  async init() {
    console.log(
      '%c🍽️ INICIANDO CHECKIT APP (MONITOR DE CUENTA)...',
      'background: #28a745; color: white; font-size: 16px; padding: 5px;'
    );
    SanbornsUtils.log('🍽️ Iniciando CheckIt App (Monitor de Cuenta)...');

    try {
      // Inicializar Splash Manager
      await SplashManager.init();

      // Inicializar Mesa/Silla Manager
      MesaSillaManager.init();

      // Setup navegación
      this.setupNavigation();

      // Setup eventos
      this.setupEvents();

      SanbornsUtils.log('✅ App inicializada correctamente');
    } catch (error) {
      SanbornsUtils.log('❌ Error inicializando app', 'error', error);
    }
  },

  /**
   * Setup de navegación entre secciones
   */
  setupNavigation() {
    $('#mobile-nav .nav-item').on('click', e => {
      const section = $(e.currentTarget).data('section');
      this.showSection(section);
    });

    // Click en logo (temporal - navega a menú que luego se eliminará)
    $('#logo-navbar').on('click', () => {
      SanbornsUtils.log('Click en logo - navegando a menú (temporal)');
      this.showSection('menu');
    });
  },

  /**
   * Muestra una sección específica
   */
  showSection(sectionName) {
    SanbornsUtils.log('Mostrando sección:', sectionName);

    // Ocultar todas las secciones
    $('.section').removeClass('active').hide();

    // Mostrar la sección solicitada
    $(`#${sectionName}-section`).addClass('active').fadeIn(300);

    // Actualizar navegación visual
    this.updateNavigation(sectionName);

    // Actualizar sección actual
    this.currentSection = sectionName;

    // Acciones específicas por sección
    if (sectionName === 'cuenta') {
      this.renderCuentaConTabs();
    }
  },

  /**
   * Actualiza la navegación visual
   */
  updateNavigation(sectionName) {
    // Remover clase active de todos los items
    $('#mobile-nav .nav-item').removeClass('active');

    // Agregar clase active al item correspondiente
    $(`#mobile-nav .nav-item[data-section="${sectionName}"]`).addClass(
      'active'
    );
  },

  /**
   * Setup de eventos generales
   */
  setupEvents() {
    // Botón Llamar Mesero
    $('#llamar-mesero-btn').on('click', () => {
      this.llamarMesero();
    });

    // Botón Pedir la Cuenta
    $('#pedir-cuenta-btn').on('click', () => {
      this.mostrarModalFormasPago();
    });
  },

  /**
   * Renderiza la cuenta con tabs por comensal
   */
  renderCuentaConTabs() {
    if (!window.cuentaActual) {
      SanbornsUtils.log('No hay datos de cuenta disponibles');
      return;
    }

    const cuenta = window.cuentaActual;
    const platillos = cuenta.Platillos || [];

    // Agrupar platillos por comensal
    const platillosPorComensal = {};
    platillos.forEach(platillo => {
      const comensal = platillo.Comensal;
      if (!platillosPorComensal[comensal]) {
        platillosPorComensal[comensal] = [];
      }
      platillosPorComensal[comensal].push(platillo);
    });

    // Crear tabs
    const comensales = Object.keys(platillosPorComensal).sort();
    let tabsHTML = '<ul class="nav nav-tabs mb-3" role="tablist">';
    let contentHTML = '<div class="tab-content">';

    // Tab "General" (todos los platillos)
    tabsHTML += `
      <li class="nav-item" role="presentation">
        <button class="nav-link active" id="tab-general" data-bs-toggle="tab" data-bs-target="#content-general" type="button">
          General
        </button>
      </li>
    `;

    contentHTML +=
      '<div class="tab-pane fade show active" id="content-general">';
    contentHTML += this.renderPlatillos(platillos);
    contentHTML += this.renderTotales(
      cuenta.Subtotal,
      cuenta.Impuesto,
      cuenta.Total
    );
    contentHTML += '</div>';

    // Tabs por comensal
    comensales.forEach((comensal, index) => {
      const isActive = false; // General es el active
      tabsHTML += `
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="tab-comensal-${comensal}" data-bs-toggle="tab" data-bs-target="#content-comensal-${comensal}" type="button">
            Comensal ${comensal}
          </button>
        </li>
      `;

      const platillosComensal = platillosPorComensal[comensal];
      const subtotalComensal = platillosComensal.reduce(
        (sum, p) => sum + parseFloat(p.precioUnitario),
        0
      );
      const impuestoComensal = subtotalComensal * 0.16;
      const totalComensal = subtotalComensal + impuestoComensal;

      contentHTML += `<div class="tab-pane fade" id="content-comensal-${comensal}">`;
      contentHTML += this.renderPlatillos(platillosComensal);
      contentHTML += this.renderTotales(
        subtotalComensal.toFixed(2),
        impuestoComensal.toFixed(2),
        totalComensal.toFixed(2)
      );
      contentHTML += '</div>';
    });

    tabsHTML += '</ul>';
    contentHTML += '</div>';

    // Insertar en el DOM
    $('#cuenta-section .container').html(tabsHTML + contentHTML);
  },

  /**
   * Renderiza lista de platillos
   */
  renderPlatillos(platillos) {
    let html = '<div class="platillos-list">';
    platillos.forEach(p => {
      html += `
        <div class="platillo-item">
          <div class="platillo-info">
            <span class="platillo-cantidad">${p.cantidad}x</span>
            <span class="platillo-nombre">${p.descripcion}</span>
          </div>
          <div class="platillo-precio">$${p.precioUnitario}</div>
        </div>
      `;
    });
    html += '</div>';
    return html;
  },

  /**
   * Renderiza sección de totales
   */
  renderTotales(subtotal, impuesto, total) {
    return `
      <div class="cuenta-totales mt-4">
        <div class="cuenta-row">
          <span>Subtotal:</span>
          <span class="fw-bold">$${subtotal}</span>
        </div>
        <div class="cuenta-row">
          <span>Impuestos (16%):</span>
          <span class="fw-bold">$${impuesto}</span>
        </div>
        <div class="cuenta-row cuenta-total">
          <span>Total:</span>
          <span class="fw-bold">$${total}</span>
        </div>
        <button class="btn btn-success btn-lg w-100 mt-3" onclick="SanbornsAppNew.mostrarModalFormasPago()">
          <i class="fas fa-credit-card me-2"></i> Pagar
        </button>
      </div>
    `;
  },

  /**
   * Llama al mesero
   */
  llamarMesero() {
    SanbornsUtils.log('Llamando al mesero...');
    Swal.fire({
      title: 'Llamando al Mesero',
      text: 'Tu mesero será notificado en breve',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
    // Aquí iría la llamada al servicio real
  },

  /**
   * Muestra modal de formas de pago
   */
  async mostrarModalFormasPago() {
    const { value: formaPago } = await Swal.fire({
      title: 'Forma de Pago',
      html: `
        <div class="formas-pago-container">
          <div class="forma-pago-item">
            <input type="radio" id="pago-efectivo" name="forma-pago" value="efectivo" class="form-check-input">
            <label for="pago-efectivo" class="forma-pago-label">
              <i class="fas fa-money-bill-wave"></i> Efectivo
            </label>
          </div>
          <div class="forma-pago-item">
            <input type="radio" id="pago-tarjeta" name="forma-pago" value="tarjeta" class="form-check-input">
            <label for="pago-tarjeta" class="forma-pago-label">
              <i class="fas fa-credit-card"></i> Tarjeta
            </label>
          </div>
          <div class="forma-pago-item">
            <input type="radio" id="pago-paypal" name="forma-pago" value="paypal" class="form-check-input">
            <label for="pago-paypal" class="forma-pago-label">
              <i class="fab fa-paypal"></i> PayPal
            </label>
          </div>
          <div class="forma-pago-item">
            <input type="radio" id="pago-codi" name="forma-pago" value="codi" class="form-check-input">
            <label for="pago-codi" class="forma-pago-label">
              <i class="fas fa-qrcode"></i> CoDi
            </label>
          </div>
          <div class="forma-pago-item">
            <input type="radio" id="pago-spei" name="forma-pago" value="spei" class="form-check-input">
            <label for="pago-spei" class="forma-pago-label">
              <i class="fas fa-university"></i> SPEI
            </label>
          </div>
          <div class="forma-pago-item">
            <input type="radio" id="pago-bitcoin" name="forma-pago" value="bitcoin" class="form-check-input">
            <label for="pago-bitcoin" class="forma-pago-label">
              <i class="fab fa-bitcoin"></i> Bitcoin
            </label>
          </div>
        </div>
      `,
      confirmButtonText: 'Confirmar Pago',
      confirmButtonColor: '#28a745',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const selected = document.querySelector(
          'input[name="forma-pago"]:checked'
        );
        if (!selected) {
          Swal.showValidationMessage('Selecciona una forma de pago');
          return false;
        }
        return selected.value;
      },
    });

    if (formaPago) {
      this.procesarPago(formaPago);
    }
  },

  /**
   * Procesa el pago
   */
  procesarPago(formaPago) {
    SanbornsUtils.log('Procesando pago con:', formaPago);

    // Llamar a servicio imprimir comanda (mock)
    // Llamar a servicio llamar mesero (mock)

    Swal.fire({
      title: '¡Pago Procesado!',
      html: `
        <p>Método de pago: <strong>${formaPago.toUpperCase()}</strong></p>
        <p>El mesero ha sido notificado y se acercará con la terminal de pago.</p>
        <p class="text-muted mt-3">Gracias por tu preferencia</p>
      `,
      icon: 'success',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#dc3545',
    });
  },
};

// Inicializar app cuando el DOM esté listo
$(document).ready(function () {
  'use strict';
  SanbornsAppNew.init();
});
