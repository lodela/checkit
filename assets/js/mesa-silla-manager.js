/* ==========================================================================
   Mesa/Silla Manager - Gestión del modal de captura de Mesa y Silla
   ========================================================================== */

const MesaSillaManager = {
  mesa: null,
  silla: null,

  /**
   * Inicializa el manager
   */
  init() {
    SanbornsUtils.log('🪑 Inicializando Mesa/Silla Manager...');

    // Verificar si ya hay datos en localStorage
    const mesaGuardada = localStorage.getItem('mesa');
    const sillaGuardada = localStorage.getItem('silla');

    if (mesaGuardada && sillaGuardada) {
      this.mesa = mesaGuardada;
      this.silla = sillaGuardada;
      SanbornsUtils.log('Datos de mesa cargados desde localStorage:', {
        mesa: this.mesa,
        silla: this.silla,
      });
      return true;
    }

    return false;
  },

  /**
   * Muestra modal para capturar Mesa y Silla
   */
  async showModal() {
    const { value: formValues } = await Swal.fire({
      title: 'Datos de Mesa',
      html:
        '<input id="swal-input-mesa" class="swal2-input" placeholder="Número de Mesa" type="number" min="1">' +
        '<input id="swal-input-silla" class="swal2-input" placeholder="Número de Silla" type="number" min="1">',
      icon: 'question',
      focusConfirm: false,
      showCancelButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#dc3545',
      preConfirm: () => {
        const mesa = document.getElementById('swal-input-mesa').value;
        const silla = document.getElementById('swal-input-silla').value;

        if (!mesa || !silla) {
          Swal.showValidationMessage('Por favor ingresa ambos datos');
          return false;
        }

        if (mesa < 1 || silla < 1) {
          Swal.showValidationMessage('Los valores deben ser mayores a 0');
          return false;
        }

        return { mesa, silla };
      },
    });

    if (formValues) {
      this.mesa = formValues.mesa;
      this.silla = formValues.silla;

      // Guardar en localStorage
      localStorage.setItem('mesa', this.mesa);
      localStorage.setItem('silla', this.silla);

      SanbornsUtils.log('Mesa y Silla guardadas:', formValues);

      // Cargar datos de la cuenta
      await this.loadCuentaData();

      // Navegar a Dashboard
      SanbornsAppNew.showSection('dashboard');
    }
  },

  /**
   * Carga los datos de la cuenta desde el mock
   */
  async loadCuentaData() {
    try {
      const response = await $.get('db.json');
      const cuentaData = response.consultacuenta;
      const meseroData = response.nombreMesero;

      // Actualizar Dashboard con datos reales
      $('#dashboard-mesa').text(this.mesa);
      $('#dashboard-mesa-numero').text(this.mesa);
      $('#dashboard-personas').text(cuentaData.Personas);
      $('#dashboard-mesero').text(meseroData.Descripcion);
      $('#dashboard-subtotal').text(`$${cuentaData.Subtotal}`);
      $('#dashboard-impuestos').text(`$${cuentaData.Impuesto}`);
      $('#dashboard-total').text(`$${cuentaData.Total}`);

      // Guardar cuenta en variable global para usarla en sección Cuenta
      window.cuentaActual = cuentaData;
      window.meseroActual = meseroData.Descripcion;

      SanbornsUtils.log('Datos de cuenta cargados:', cuentaData);
    } catch (error) {
      SanbornsUtils.log('Error cargando datos de cuenta', 'error', error);
    }
  },

  /**
   * Obtiene los datos actuales
   */
  getData() {
    return {
      mesa: this.mesa,
      silla: this.silla,
    };
  },

  /**
   * Resetea los datos (para desarrollo)
   */
  reset() {
    localStorage.removeItem('mesa');
    localStorage.removeItem('silla');
    this.mesa = null;
    this.silla = null;
    SanbornsUtils.log('Datos de mesa reseteados');
  },
};
