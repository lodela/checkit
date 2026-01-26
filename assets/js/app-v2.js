/* CheckIt App v2.0 - Monitor de Cuenta */
$(document).ready(function () {
  CheckItApp.init();
});

const CheckItApp = {
  currentSection: 'mesa',
  mesaData: null,

  async init() {
    console.log('✅ CheckIt App inicializada');
    await this.loadPromociones();
    this.setupContinuarButton();
    await this.loadMesaData();
    this.setupNavigation();
  },

  async loadPromociones() {
    try {
      const response = await fetch('./db.json');
      const data = await response.json();
      const promociones = data.promociones?.lstima || [];
      const carouselContent = $('#carousel-content');
      carouselContent.empty();

      if (promociones.length > 0) {
        const isMobile = window.innerWidth < 768;

        promociones.forEach((promo, index) => {
          const activeClass = index === 0 ? 'active' : '';
          const imgSrc = isMobile ? promo.mobile : promo.desktop;
          const altText = promo.alt || `Promoción ${index + 1}`;

          carouselContent.append(`
            <div class="carousel-item ${activeClass}">
              <img src="${imgSrc}" class="d-block w-100" alt="${altText}" style="width: 100%; height: auto; object-fit: contain;">
            </div>
          `);
        });

        new bootstrap.Carousel('#promo-carousel', {
          interval: 5000,
          ride: 'carousel',
        });
      } else {
        carouselContent.append(`
          <div class="carousel-item active">
            <div class="bg-danger text-white text-center p-5">
              <h2>¡Bienvenido a CheckIt!</h2>
              <p>Monitor de Cuenta Digital</p>
            </div>
          </div>
        `);
      }
    } catch (error) {
      console.error('Error cargando promociones:', error);
    }
  },

  setupContinuarButton() {
    let timeLeft = 5;
    let progress = 0;
    const interval = 100; // Update every 100ms
    const totalTime = 5000; // 5 seconds
    const progressIncrement = (100 / totalTime) * interval;

    const countdownInterval = setInterval(() => {
      progress += progressIncrement;
      $('#loading-progress').css('width', progress + '%');

      if (progress >= 100) {
        clearInterval(countdownInterval);
        $('#continuar-btn').prop('disabled', false).addClass('pulse');
        $('#btn-text').addClass('d-none');
        $('#btn-icon')
          .removeClass('d-none')
          .html('Continuar <i class="fas fa-arrow-right"></i>');
      }
    }, interval);

    // Countdown text
    const textInterval = setInterval(() => {
      timeLeft--;
      $('#countdown').text(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(textInterval);
      }
    }, 1000);

    $('#continuar-btn').on('click', () => {
      if (!$('#continuar-btn').prop('disabled')) {
        $('#loading-screen').fadeOut(500, () => {
          this.showSection('mesa');
          $('.nav-item[data-section="mesa"]').addClass('active');
        });
      }
    });
  },

  async loadMesaData() {
    try {
      const response = await fetch('./db.json');
      const data = await response.json();
      this.mesaData = data.mesas?.[0] || null;
      if (this.mesaData) {
        this.updateMesaView();
      }
    } catch (error) {
      console.error('Error cargando datos de mesa:', error);
    }
  },

  updateMesaView() {
    if (!this.mesaData) return;
    const {
      numero,
      personas,
      mesero,
      cuentaAbierta,
      subtotal,
      impuestos,
      total,
    } = this.mesaData;

    $('#mesa-numero-vista').text(numero);
    $('#mesa-personas-vista').text(personas);
    $('#mesa-mesero-vista').text(mesero);
    $('#mesa-estado-vista').text(cuentaAbierta ? 'Cuenta Abierta' : 'Cerrada');
    $('#mesa-subtotal').text(`$${subtotal.toFixed(2)}`);
    $('#mesa-impuestos').text(`$${impuestos.toFixed(2)}`);
    $('#mesa-total').text(`$${total.toFixed(2)}`);

    // Propina calculator
    $('#propina-amount').text(`$${(total * 0.1).toFixed(2)}`);
    $('#total-with-tip').text(`$${(total * 1.1).toFixed(2)}`);
    this.setupPropinaCalculator(total);

    $('#mesa-numero-mobile').text(numero);
    $('#personas-numero-mobile').text(personas);
  },

  setupPropinaCalculator(baseTotal) {
    const slider = $('#propina-slider');
    const percentageDisplay = $('#propina-percentage');
    const propinaAmount = $('#propina-amount');
    const totalWithTip = $('#total-with-tip');

    slider.off('input').on('input', function () {
      const percentage = parseInt($(this).val());
      const tip = baseTotal * (percentage / 100);
      const totalWithTipAmount = baseTotal + tip;

      percentageDisplay.text(percentage);
      propinaAmount.text(`$${tip.toFixed(2)}`);
      totalWithTip.text(`$${totalWithTipAmount.toFixed(2)}`);

      // Modal cuando propina = 0%
      if (percentage === 0) {
        CheckItApp.showPropinaZeroModal();
      }
    });
  },

  showPropinaZeroModal() {
    Swal.fire({
      title: '¿Por qué 0% de propina?',
      html: `
        <div class="propina-zero-form">
          <p class="text-start mb-3">Selecciona los motivos (opcional):</p>
          <div class="form-check text-start mb-2">
            <input class="form-check-input" type="checkbox" value="servicio-lento" id="motivo1">
            <label class="form-check-label" for="motivo1">Servicio lento</label>
          </div>
          <div class="form-check text-start mb-2">
            <input class="form-check-input" type="checkbox" value="atencion-deficiente" id="motivo2">
            <label class="form-check-label" for="motivo2">Atención deficiente</label>
          </div>
          <div class="form-check text-start mb-2">
            <input class="form-check-input" type="checkbox" value="comida-fria" id="motivo3">
            <label class="form-check-label" for="motivo3">Comida fría o en mal estado</label>
          </div>
          <div class="form-check text-start mb-2">
            <input class="form-check-input" type="checkbox" value="error-pedido" id="motivo4">
            <label class="form-check-label" for="motivo4">Error en el pedido</label>
          </div>
          <div class="form-check text-start mb-2">
            <input class="form-check-input" type="checkbox" value="higiene" id="motivo5">
            <label class="form-check-label" for="motivo5">Falta de higiene</label>
          </div>
          <div class="form-check text-start mb-3">
            <input class="form-check-input" type="checkbox" value="otro" id="motivo-otro">
            <label class="form-check-label" for="motivo-otro">Otro</label>
          </div>
          
          <!-- Accordion para "Otro" -->
          <div id="otro-accordion" class="collapse">
            <div class="card card-body mb-3">
              <textarea 
                id="otro-motivo-text" 
                class="form-control" 
                rows="3" 
                placeholder="Describe el motivo..."
              ></textarea>
              <button class="btn btn-sm btn-outline-secondary mt-2" id="libro-sugerencias-btn" disabled>
                <i class="fas fa-book"></i> Libro de sugerencias
              </button>
            </div>
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Volver',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-secondary',
      },
      didOpen: () => {
        // Accordion animation para "Otro"
        $('#motivo-otro').on('change', function () {
          if ($(this).is(':checked')) {
            $('#otro-accordion').collapse('show');
          } else {
            $('#otro-accordion').collapse('hide');
          }
        });
      },
      preConfirm: () => {
        const motivos = [];
        $('.form-check-input:checked').each(function () {
          const value = $(this).val();
          if (value === 'otro') {
            const otroText = $('#otro-motivo-text').val().trim();
            if (otroText) {
              motivos.push({ tipo: 'otro', descripcion: otroText });
            }
          } else {
            motivos.push({ tipo: value });
          }
        });
        console.log('📝 Motivos propina 0%:', motivos);
        return motivos;
      },
    }).then(result => {
      if (result.isDismissed) {
        // Usuario canceló, restaurar propina al 10%
        $('#propina-slider').val(10).trigger('input');
      }
    });
  },

  setupNavigation() {
    $('.nav-item').on('click', function () {
      const section = $(this).data('section');
      CheckItApp.showSection(section);
      $('.nav-item').removeClass('active');
      $(this).addClass('active');
    });

    // Botón Ordenar ahora!
    $('#ordenar-ahora-btn').on('click', async () => {
      await this.ordenarAhora();
    });
  },

  async ordenarAhora() {
    // SweetAlert2 loading que NO se puede cerrar
    Swal.fire({
      title: 'Llamando al mesero',
      html: '<i class="fas fa-concierge-bell fa-3x fa-shake mb-3"></i><p class="mt-3">Para tomar su orden...</p>',
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    // Simular espera y cargar datos
    await this.loadCuentaData();
  },

  async loadCuentaData() {
    try {
      const response = await fetch('http://localhost:3001/consultacuenta');
      const data = await response.json();

      // Cerrar SweetAlert2
      Swal.close();

      // Agrupar platillos por Comensal
      const platillosPorComensal = {};
      const tieneComensales = data.Platillos.some(
        p => p.Comensal && p.Comensal.trim() !== ''
      );

      if (tieneComensales) {
        data.Platillos.forEach(platillo => {
          const comensal = platillo.Comensal || 'General';
          if (!platillosPorComensal[comensal]) {
            platillosPorComensal[comensal] = [];
          }
          platillosPorComensal[comensal].push(platillo);
        });
      }

      // Obtener propina de la sección Mesa
      const propinaPercentage =
        parseFloat($('#propina-percentage').text()) || 0;
      const baseTotal = parseFloat(data.Subtotal) || 0;
      const propinaMonto = (baseTotal * propinaPercentage) / 100;

      // Construir HTML
      this.buildCuentaHTML(
        data,
        platillosPorComensal,
        tieneComensales,
        propinaMonto
      );

      // Ocultar empty state, mostrar cuenta
      $('#empty-cart').hide();
      $('#cart-list-view').removeClass('d-none');
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cargar la cuenta. Intente nuevamente.',
        confirmButtonText: 'Entendido',
      });
      console.error('❌ Error cargando cuenta:', error);
    }
  },

  buildCuentaHTML(data, platillosPorComensal, tieneComensales, propinaMonto) {
    const subtotal = parseFloat(data.Subtotal) || 0;
    const impuestos = parseFloat(data.Impuesto) || 0;
    const total = parseFloat(data.Total) || 0;
    const totalConPropina = total + propinaMonto;

    let html = '<div class="cuenta-content-wrapper">';

    if (tieneComensales) {
      // Tabs por Comensal + General
      const comensales = Object.keys(platillosPorComensal).sort();

      html += `
        <ul class="nav nav-tabs mb-3" id="cuenta-tabs" role="tablist">
      `;

      comensales.forEach((comensal, index) => {
        const activeClass = index === 0 ? 'active' : '';
        const ariaSelected = index === 0 ? 'true' : 'false';
        html += `
          <li class="nav-item" role="presentation">
            <button class="nav-link ${activeClass}" id="comensal-${comensal}-tab" data-bs-toggle="tab" 
                    data-bs-target="#comensal-${comensal}" type="button" role="tab" 
                    aria-controls="comensal-${comensal}" aria-selected="${ariaSelected}">
              Comensal ${comensal}
            </button>
          </li>
        `;
      });

      // Tab General
      html += `
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="general-tab" data-bs-toggle="tab" 
                  data-bs-target="#general" type="button" role="tab" 
                  aria-controls="general" aria-selected="false">
            General
          </button>
        </li>
      </ul>
      `;

      html += `<div class="tab-content" id="cuenta-tabs-content">`;

      // Contenido de cada tab
      comensales.forEach((comensal, index) => {
        const activeClass = index === 0 ? 'show active' : '';
        html += `
          <div class="tab-pane fade ${activeClass}" id="comensal-${comensal}" role="tabpanel" 
               aria-labelledby="comensal-${comensal}-tab">
            ${this.buildPlatillosList(platillosPorComensal[comensal])}
          </div>
        `;
      });

      // Tab General con todos los platillos
      html += `
        <div class="tab-pane fade" id="general" role="tabpanel" aria-labelledby="general-tab">
          ${this.buildPlatillosList(data.Platillos)}
        </div>
      `;

      html += `</div>`;
    } else {
      // Sin tabs, solo lista general
      html += this.buildPlatillosList(data.Platillos);
    }

    html += '</div>'; // Cierre cuenta-content-wrapper

    // Totales GLOBALES - Fijos al bottom
    html += `
      <div class="ticket-totals-fixed">
        <div class="d-flex justify-content-between mb-2">
          <span><strong>SUBTOTAL:</strong></span>
          <span>$${subtotal.toFixed(2)}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
          <span><strong>IMPUESTOS (16%):</strong></span>
          <span>$${impuestos.toFixed(2)}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
          <span><strong>PROPINA (${parseFloat($('#propina-percentage').text())}%):</strong></span>
          <span>$${propinaMonto.toFixed(2)}</span>
        </div>
        <div class="d-flex justify-content-between mb-3 ticket-total-line">
          <span><strong>TOTAL:</strong></span>
          <span><strong>$${totalConPropina.toFixed(2)}</strong></span>
        </div>
        <button class="btn btn-success btn-lg w-100 rounded-pill" id="btn-pagar">
          <i class="fas fa-credit-card me-2"></i>Pagar
        </button>
      </div>
    `;

    $('#cart-list-view').html(html);
  },

  buildPlatillosList(platillos) {
    let html = `
      <div class="ticket-items">
        <div class="row fw-bold mb-2 pb-2 ticket-items-header">
          <div class="col-2">CANT</div>
          <div class="col-7">DESCRIPCION</div>
          <div class="col-3 text-end">IMPORTE</div>
        </div>
    `;

    platillos.forEach(platillo => {
      const cantidad = parseFloat(platillo.cantidad) || 0;
      const precio = parseFloat(platillo.precioUnitario) || 0;
      const importe = cantidad * precio;

      // Determinar estado del platillo (En Cocina por defecto)
      const estadoLabel =
        platillo.estado === 'servido' ? 'Servido' : 'En Cocina';
      const estadoIcon =
        platillo.estado === 'servido' ? 'fa-check-circle' : 'fa-fire';
      const estadoColor =
        platillo.estado === 'servido' ? 'text-success' : 'text-warning';

      html += `
        <div class="row mb-2 align-items-center">
          <div class="col-2">${cantidad.toFixed(0)}</div>
          <div class="col-7">
            ${platillo.descripcion}
            <br><small class="${estadoColor}"><i class="fas ${estadoIcon}"></i> ${estadoLabel}</small>
          </div>
          <div class="col-3 text-end">$${importe.toFixed(2)}</div>
        </div>
      `;
    });

    html += `</div>`;
    return html;
  },

  showSection(sectionName) {
    console.log(`📍 Navegando a: ${sectionName}`);
    $('.section').hide();
    $(`#${sectionName}-section`).show();
    this.currentSection = sectionName;
  },
};

window.CheckItApp = CheckItApp;

// Exponer showSection globalmente para compatibilidad
window.showSection = sectionName => CheckItApp.showSection(sectionName);
