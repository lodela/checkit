/* ==========================================================================
   Mobile Top Navbar - Component Module
   Arquitectura SOLID + DRY para navbar mobile
   ========================================================================== */

const MobileTopNavbar = {
    
    /* ==========================================================================
       Estado del Componente
       ========================================================================== */
    
    isScrolling: false,
    lastScrollTop: 0,
    scrollThreshold: 50,
    isNavbarVisible: true,
    cartItems: 0,
    mesaData: null,
    config: null, // Configuraciones desde db.json
    
    /* ==========================================================================
       Referencias DOM
       ========================================================================== */
    
    elements: {
        navbar: null,
        hamburgerBtn: null,
        cartBtnFixed: null,
        cartBadgeFixed: null,
        drawer: null,
        drawerOverlay: null,
        drawerClose: null,
        resetBtn: null,
        appVersionText: null,
        mesaInfo: null,
        mesaNumero: null,
        personasNumero: null
    },
    
    /* ==========================================================================
       Inicialización
       ========================================================================== */
    
    async init() {
        SanbornsUtils.log('📱 Inicializando MobileTopNavbar...');
        
        try {
            // Cargar configuraciones
            await this.loadConfig();
            
            // Cache DOM elements
            this.cacheElements();
            
            // Aplicar configuraciones
            this.applyConfig();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Load mesa data
            await this.loadMesaData();
            
            // Setup scroll controller
            this.setupScrollController();
            
            SanbornsUtils.log('✅ MobileTopNavbar inicializado');
            
        } catch (error) {
            SanbornsUtils.log('❌ Error inicializando MobileTopNavbar:', error);
        }
    },
    
    /* ==========================================================================
       Cache DOM Elements
       ========================================================================== */
    
    cacheElements() {
        this.elements = {
            navbar: $('#mobile-top-navbar'),
            hamburgerBtn: $('#hamburger-btn'),
            cartBtnFixed: $('#cart-btn-fixed'), // Solo carrito fijo
            cartBadgeFixed: $('#cart-badge-fixed'), // Solo badge fijo
            drawer: $('#mobile-drawer'),
            drawerOverlay: $('#drawer-overlay'),
            drawerClose: $('#drawer-close'),
            resetBtn: $('#reset-btn'), // Botón reset
            appVersionText: $('#app-version-text'), // Texto versión
            mesaInfo: $('#mesa-info-mobile'),
            mesaNumero: $('#mesa-numero-mobile'),
            personasNumero: $('#personas-numero-mobile')
        };
        
        // Debug: verificar que elementos existen
        if (this.elements.hamburgerBtn.length === 0) {
            SanbornsUtils.log('⚠️ Hamburger button no encontrado en DOM');
        } else {
            SanbornsUtils.log('✅ Hamburger button encontrado');
        }
        
        if (this.elements.cartBtnFixed.length === 0) {
            SanbornsUtils.log('⚠️ Cart button fijo no encontrado en DOM');
        } else {
            SanbornsUtils.log('✅ Cart button fijo encontrado');
        }
        
        // Debug adicional para el carrito
        SanbornsUtils.log(`🛒 Carrito fijo - Elemento:`, this.elements.cartBtnFixed);
        SanbornsUtils.log(`🛒 Carrito fijo - CSS display:`, this.elements.cartBtnFixed.css('display'));
        SanbornsUtils.log(`🛒 Carrito fijo - Posición:`, this.elements.cartBtnFixed.css('position'));
    },
    
    /* ==========================================================================
       Event Listeners
       ========================================================================== */
    
    setupEventListeners() {
        // Hamburger menu toggle
        this.elements.hamburgerBtn.on('click', () => this.toggleDrawer());
        
        // Drawer close
        this.elements.drawerClose.on('click', () => this.closeDrawer());
        this.elements.drawerOverlay.on('click', () => this.closeDrawer());
        
        // Cart button fijo (único)
        this.elements.cartBtnFixed.on('click', () => this.goToCart());
        
        // Reset button
        this.elements.resetBtn.on('click', () => this.handleReset());
        
        // Mesa info click - Modal
        this.elements.mesaInfo.on('click', () => this.showMesaModal());
        
        // Listen to cart updates
        $(document).on('cart:updated', (e, data) => {
            this.updateCartBadge(data);
            this.updateMesaDataFromCart(); // Actualizar datos de mesa cuando cambie el carrito
        });
    },
    
    /* ==========================================================================
       Scroll Controller
       ========================================================================== */
    
    setupScrollController() {
        let ticking = false;
        
        $(window).on('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    },
    
    handleScroll() {
        const currentScrollTop = $(window).scrollTop();
        
        // Determine scroll direction and distance
        const scrollingDown = currentScrollTop > this.lastScrollTop;
        const scrollDistance = Math.abs(currentScrollTop - this.lastScrollTop);
        
        // Show/hide navbar based on scroll (usando config dinámico)
        if (scrollDistance > this.scrollThreshold) {
            if (scrollingDown && currentScrollTop > this.scrollThreshold) {
                this.hideNavbar();
            } else if (!scrollingDown || currentScrollTop <= this.scrollThreshold) {
                this.showNavbar();
            }
        }
        
        this.lastScrollTop = currentScrollTop;
    },
    
    showNavbar() {
        if (!this.isNavbarVisible) {
            this.elements.navbar.removeClass('hidden');
            this.isNavbarVisible = true;
        }
    },
    
    hideNavbar() {
        if (this.isNavbarVisible) {
            this.elements.navbar.addClass('hidden');
            this.isNavbarVisible = false;
        }
    },
    
    /* ==========================================================================
       Drawer Menu
       ========================================================================== */
    
    toggleDrawer() {
        if (this.elements.drawer.hasClass('open')) {
            this.closeDrawer();
        } else {
            this.openDrawer();
        }
    },
    
    openDrawer() {
        this.elements.drawer.addClass('open');
        this.elements.hamburgerBtn.addClass('active');
        $('body').addClass('overflow-hidden');
    },
    
    closeDrawer() {
        this.elements.drawer.removeClass('open');
        this.elements.hamburgerBtn.removeClass('active');
        $('body').removeClass('overflow-hidden');
    },
    
    /* ==========================================================================
       Cart Management
       ========================================================================== */
    
    updateCartBadge(cartData) {
        const totalItems = cartData ? cartData.totalItems : 0;
        this.cartItems = totalItems;
        
        // Solo actualizar badge del carrito fijo (único)
        if (totalItems > 0) {
            this.elements.cartBadgeFixed.text(totalItems).removeClass('d-none');
            SanbornsUtils.log('🛒 Badge carrito fijo actualizado:', totalItems);
        } else {
            this.elements.cartBadgeFixed.addClass('d-none');
            SanbornsUtils.log('🛒 Badge carrito fijo oculto');
        }
    },
    
    goToCart() {
        // Trigger navigation to cart section
        $(document).trigger('navigate:to', ['cuenta']);
        SanbornsUtils.log('🛒 Navegando al carrito...');
    },
    
    /* ==========================================================================
       Mesa Data Management
       ========================================================================== */
    
    async loadMesaData() {
        try {
            // En GitHub Pages, usar db.json para datos de mesa
            const dbData = await DataService.request('./db.json');
            const mesa = dbData.mesas?.[0]; // Primera mesa de la lista
            
            if (mesa) {
                this.mesaData = mesa;
                this.updateMesaDisplay();
                return;
            }
        } catch (error) {
            SanbornsUtils.log('Error cargando datos de mesa desde db.json', 'warn', error);
        }
        
        // Fallback: usar datos mock para estructura de mesa
        this.mesaData = {
            numero: 201,
            personas: 2,
            mesero: "JOSE LUIS BAENA LOPEZ",
            cuentaAbierta: false, // Se actualizará con datos reales del carrito
            subtotal: 0,
            impuestos: 0,
            total: 0
        };
        this.updateMesaDisplay();
        
        // Actualizar con datos reales del carrito
        this.updateMesaDataFromCart();
    },
    
    /**
     * Actualiza datos de mesa con información real del carrito
     */
    updateMesaDataFromCart() {
        if (typeof CartManager !== 'undefined' && CartManager.cart) {
            const cart = CartManager.cart;
            const hasItems = cart.items.length > 0;
            
            // Actualizar datos de cuenta con datos reales del carrito
            this.mesaData.cuentaAbierta = hasItems;
            this.mesaData.subtotal = cart.subtotal || 0;
            this.mesaData.impuestos = cart.tax || 0;
            this.mesaData.total = cart.total || 0;
            
            SanbornsUtils.log('Mesa data actualizada con carrito real:', this.mesaData);
        }
    },
    
    updateMesaDisplay() {
        if (this.mesaData) {
            this.elements.mesaNumero.text(this.mesaData.numero);
            this.elements.personasNumero.text(this.mesaData.personas);
        }
    },
    
    /* ==========================================================================
       Mesa Modal con Calculador de Propina
       ========================================================================== */
    
    showMesaModal() {
        if (!this.mesaData) return;
        
        // Asegurarse de tener datos actualizados del carrito
        this.updateMesaDataFromCart();
        
        const { numero, personas, mesero, subtotal, impuestos, total, cuentaAbierta } = this.mesaData;
        
        Swal.fire({
            title: `Mesa ${numero}`,
            html: this.buildMesaModalHTML(),
            width: '90%',
            maxWidth: '400px',
            showConfirmButton: false,
            showCloseButton: true,
            customClass: {
                container: 'mesa-modal-container',
                popup: 'mesa-modal-popup'
            },
            didOpen: () => {
                if (cuentaAbierta && total > 0) {
                    this.setupPropinaCalculator();
                }
            }
        });
    },
    
    buildMesaModalHTML() {
        const { numero, personas, mesero, subtotal, impuestos, total, cuentaAbierta } = this.mesaData;
        
        return `
            <div class="mesa-modal-content">
                <div class="mesa-info-section">
                    <div class="info-row">
                        <span class="label">Mesa:</span>
                        <span class="value">${numero}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Personas:</span>
                        <span class="value">${personas}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Mesero:</span>
                        <span class="value">${mesero}</span>
                    </div>
                    <div class="info-row">
                        <span class="label">Estado:</span>
                        <span class="value ${cuentaAbierta ? 'text-success' : 'text-muted'}">
                            ${cuentaAbierta ? 'Cuenta Abierta' : 'Sin Cuenta'}
                        </span>
                    </div>
                </div>
                
                ${cuentaAbierta && total > 0 ? `
                <div class="cuenta-section">
                    <h6 class="section-title">Cuenta Actual</h6>
                    <div class="cuenta-details">
                        <div class="cuenta-row">
                            <span>Subtotal:</span>
                            <span>$${subtotal.toFixed(2)}</span>
                        </div>
                        <div class="cuenta-row">
                            <span>Impuestos (16%):</span>
                            <span>$${impuestos.toFixed(2)}</span>
                        </div>
                        <div class="cuenta-row total-row">
                            <span><strong>Total:</strong></span>
                            <span><strong>$${total.toFixed(2)}</strong></span>
                        </div>
                    </div>
                </div>
                
                <div class="propina-section">
                    <h6 class="section-title">Calculador de Propina</h6>
                    <div class="propina-calculator">
                        <div class="propina-slider-container">
                            <label for="propina-slider">Propina: <span id="propina-percentage">10</span>%</label>
                            <input type="range" id="propina-slider" min="0" max="100" value="10" class="form-range">
                        </div>
                        <div class="propina-amounts">
                            <div class="propina-row">
                                <span>Propina:</span>
                                <span id="propina-amount">$${(total * 0.1).toFixed(2)}</span>
                            </div>
                            <div class="propina-row total-with-tip">
                                <span><strong>Total + Propina:</strong></span>
                                <span><strong id="total-with-tip">$${(total * 1.1).toFixed(2)}</strong></span>
                            </div>
                        </div>
                    </div>
                </div>
                ` : `
                <div class="no-cuenta-section">
                    <div class="text-center py-4">
                        <i class="fas fa-utensils text-muted" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                        <h6 class="text-muted">No hay productos seleccionados</h6>
                        <p class="text-muted small mb-0">Agrega productos al carrito para ver tu cuenta</p>
                    </div>
                </div>
                `}
            </div>
        `;
    },
    
    setupPropinaCalculator() {
        const slider = $('#propina-slider');
        const percentageDisplay = $('#propina-percentage');
        const propinaAmount = $('#propina-amount');
        const totalWithTip = $('#total-with-tip');
        const baseTotal = this.mesaData.total;
        
        slider.on('input', function() {
            const percentage = parseInt($(this).val());
            const tip = baseTotal * (percentage / 100);
            const totalWithTipAmount = baseTotal + tip;
            
            percentageDisplay.text(percentage);
            propinaAmount.text(`$${tip.toFixed(2)}`);
            totalWithTip.text(`$${totalWithTipAmount.toFixed(2)}`);
        });
    },
    
    /* ==========================================================================
       Configuraciones
       ========================================================================== */
    
    async loadConfig() {
        try {
            const response = await $.get('db.json');
            this.config = {
                app: response.configuraciones.app,
                ...response.configuraciones.topNavbar
            };
            this.scrollThreshold = this.config.scrollPixeles;
            SanbornsUtils.log('✅ Configuraciones cargadas:', this.config);
        } catch (error) {
            // Configuraciones por defecto si falla
            this.config = {
                app: {
                    version: "1.2.3-beta",
                    nombre: "Sanborns Digital Menu"
                },
                colorFondo: "#dc3545",
                logoImagen: "sanbornsWhite.svg",
                scrollPixeles: 50,
                animacionMs: 300,
                alturaNavbar: 60,
                mostrarHamburger: true
            };
            this.scrollThreshold = this.config.scrollPixeles;
            SanbornsUtils.log('⚠️ Usando configuraciones por defecto');
        }
    },
    
    applyConfig() {
        const navbar = this.elements.navbar;
        const logo = navbar.find('.client-logo');
        const hamburger = this.elements.hamburgerBtn; // Usar elemento cacheado
        const cartFixed = this.elements.cartBtnFixed; // Carrito fijo
        
        // Aplicar color de fondo
        navbar.css('background-color', this.config.colorFondo);
        
        // Aplicar color al hamburger fijo
        hamburger.css('background-color', this.config.colorFondo);
        
        // Aplicar color al carrito fijo (siempre visible)
        cartFixed.css('background-color', this.config.colorFondo);
        
        // Aplicar visibilidad del hamburger y posición del carrito
        if (this.config.mostrarHamburger) {
            hamburger.css('display', 'flex').removeClass('d-none');
            // Hamburger SIEMPRE en extrema derecha, carrito a la izquierda
            hamburger.css('right', '15px');
            cartFixed.css('right', '65px');
            SanbornsUtils.log('🍔 Hamburger VISIBLE - Hamburger en extrema derecha, Carrito a la izquierda');
        } else {
            hamburger.css('display', 'none').addClass('d-none');
            // Solo carrito visible, ocupa posición del hamburger
            cartFixed.css('right', '15px');
            SanbornsUtils.log('🚫 Hamburger OCULTO - Solo carrito en extrema derecha');
        }
        
        // Aplicar altura
        navbar.css('height', `${this.config.alturaNavbar}px`);
        
        // Aplicar duración de animación
        navbar.css('transition', `transform ${this.config.animacionMs}ms ease, opacity ${this.config.animacionMs}ms ease`);
        
        // Aplicar logo
        logo.attr('src', `assets/images/${this.config.logoImagen}`);
        
        // Ajustar padding-top del contenido principal
        $('#main-content').css('padding-top', `${this.config.alturaNavbar}px`);
        
        // Actualizar versión en drawer
        this.updateAppVersion();
        
        SanbornsUtils.log('🎨 Configuraciones aplicadas al navbar');
    },
    
    /* ==========================================================================
       App Reset & Version
       ========================================================================== */
    
    handleReset() {
        Swal.fire({
            title: '¿Reiniciar aplicación?',
            text: 'Se borrará todo: carrito, configuraciones y datos guardados',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, reiniciar',
            cancelButtonText: 'Cancelar',
            customClass: {
                popup: 'reset-confirm-popup'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                this.performReset();
            }
        });
    },
    
    performReset() {
        SanbornsUtils.log('🔄 Iniciando reset completo...');
        
        // Limpiar localStorage
        const keysToRemove = [
            'sanborns-cart',
            'sanborns-view-preference',
            'sanborns-user-preferences',
            'sanborns-last-visit',
            'sanborns-session'
        ];
        
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
            SanbornsUtils.log(`🗑️ Eliminado: ${key}`);
        });
        
        // Limpiar sessionStorage
        sessionStorage.clear();
        
        // Limpiar cache del navegador (si es posible)
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }
        
        // Cerrar drawer
        this.closeDrawer();
        
        // Mostrar confirmación y recargar
        Swal.fire({
            title: '¡Aplicación reiniciada!',
            text: 'Recargando página...',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            didOpen: () => {
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        });
        
        SanbornsUtils.log('✅ Reset completo finalizado');
    },
    
    updateAppVersion() {
        if (this.config && this.config.app) {
            this.elements.appVersionText.text(`v${this.config.app.version}`);
            SanbornsUtils.log(`📱 Versión actualizada: v${this.config.app.version}`);
        }
    },
};

/* ==========================================================================
   CSS Styles para el Modal (se agrega dinámicamente)
   ========================================================================== */

// Agregar estilos CSS para el modal
const mesaModalStyles = `
<style>
.mesa-modal-content {
    text-align: left;
    font-size: 1rem;
}

.mesa-info-section, .cuenta-section, .propina-section, .no-cuenta-section {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
}

.mesa-info-section:last-child, 
.cuenta-section:last-child, 
.propina-section:last-child,
.no-cuenta-section:last-child {
    border-bottom: none;
    margin-bottom: 0;
}

.section-title {
    margin-bottom: 10px;
    color: var(--sanborns-red);
    font-weight: 600;
}

.info-row, .cuenta-row, .propina-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 0;
}

.total-row, .total-with-tip {
    border-top: 1px solid #ddd;
    margin-top: 8px;
    padding-top: 8px;
    font-size: 1.1em;
}

.propina-slider-container {
    margin-bottom: 15px;
}

.propina-slider-container label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
}

.form-range {
    width: 100%;
}

.propina-amounts {
    background: #f8f9fa;
    padding: 10px;
    border-radius: 6px;
}

.no-cuenta-section {
    border-bottom: none;
}

.no-cuenta-section .fa-utensils {
    color: #6c757d;
    opacity: 0.5;
}
</style>
`;

// Inyectar estilos
$('head').append(mesaModalStyles);
