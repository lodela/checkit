/* ==========================================================================
   CheckIt App - Monitor de Cuenta
   ========================================================================== */

$(document).ready(function () {
  'use strict';
  console.log(
    '%c🚀 CHECKIT 2.0 INICIANDO...',
    'background: #dc3545; color: white; font-size: 20px; padding: 10px;'
  );
  CheckItApp.init();
});

const CheckItApp = {
  currentSection: 'menu',

  async init() {
    console.log('Inicializando CheckIt App...');

    try {
      // NO inicializar splash ni mesa/silla
      // Esto es temporal para desarrollo
      
      // Setup navegación
      this.setupNavigation();

      // Mostrar menú por defecto
      this.showSection('menu');

      console.log('✅ CheckIt App inicializada');
    } catch (error) {
      console.error('Error inicializando app:', error);
    }
  },

  setupNavigation() {
    $('#mobile-nav .nav-item').on('click', e => {
      const section = $(e.currentTarget).data('section');
      this.showSection(section);
    });
  },

  showSection(sectionName) {
    console.log('Mostrando sección:', sectionName);

    // Manejar Mi Orden vs Cuenta (ambos usan cuenta-section)
    let targetSection = sectionName;
    if (sectionName === 'mi-orden') {
      targetSection = 'cuenta';
      $('#cart-section-title').html('<span class="cuenta-icon-mask text-danger me-2"></span>Mi Orden');
      $('#readonly-info').addClass('d-none');
      // Habilitar edición
    } else if (sectionName === 'cuenta') {
      targetSection = 'cuenta';
      $('#cart-section-title').html('<span class="check-icon-mask text-danger me-2"></span>Cuenta');
      $('#readonly-info').removeClass('d-none');
      // Deshabilitar edición
    }

    $('.section').removeClass('active').hide();
    $(`#${targetSection}-section`).addClass('active').fadeIn(300);

    $('#mobile-nav .nav-item').removeClass('active');
    $(`#mobile-nav .nav-item[data-section="${sectionName}"]`).addClass('active');

    this.currentSection = sectionName;
  },

  setupMeseroButtons() {
    $(document).on('click', '#llamar-mesero-btn', () => {
      this.llamarMesero();
    });

    $(document).on('click', '#pedir-cuenta-btn', () => {
      this.mostrarModalFormasPago();
    });
  },

  llamarMesero() {
    console.log('Llamando al mesero...');
    Swal.fire({
      title: 'Llamando al Mesero',
      text: 'Tu mesero será notificado en breve',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
  },

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

  procesarPago(formaPago) {
    console.log('Procesando pago con:', formaPago);

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

  renderCuentaConTabs() {
    if (!window.cuentaActual) {
      console.log('No hay datos de cuenta disponibles');
      return;
    }

    const cuenta = window.cuentaActual;
    const platillos = cuenta.Platillos || [];

    const platillosPorComensal = {};
    platillos.forEach(platillo => {
      const comensal = platillo.Comensal;
      if (!platillosPorComensal[comensal]) {
        platillosPorComensal[comensal] = [];
      }
      platillosPorComensal[comensal].push(platillo);
    });

    const comensales = Object.keys(platillosPorComensal).sort();
    let tabsHTML = '<ul class="nav nav-tabs mb-3" role="tablist">';
    let contentHTML = '<div class="tab-content">';

    // Tab General
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
    comensales.forEach(comensal => {
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

    $('#cuenta-section .container').html(tabsHTML + contentHTML);
  },

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
        <button class="btn btn-success btn-lg w-100 mt-3" onclick="CheckItApp.mostrarModalFormasPago()">
          <i class="fas fa-credit-card me-2"></i> Pagar
        </button>
      </div>
    `;
  },
};
