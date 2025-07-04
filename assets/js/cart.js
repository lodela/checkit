/* ==========================================================================
   Cart Manager - Gestión del carrito estilo 90's con jQuery
   ========================================================================== */

const CartManager = {
    
    /* ==========================================================================
       Estado del Carrito
       ========================================================================== */
    cart: {
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
        timestamp: new Date().toISOString()
    },

    /* ==========================================================================
       Inicialización
       ========================================================================== */
    
    init() {
        this.loadCart();
        this.bindEvents();
        this.updateUI();
        this.initViewToggle();
        SanbornsUtils.log('CartManager inicializado');
    },

    /**
     * Inicializa el toggle de vistas
     */
    initViewToggle() {
        // Cargar preferencia de vista desde localStorage
        const savedView = SanbornsUtils.getFromStorage('sanborns-view-preference') || 'cards';
        this.setView(savedView);
        
        // Event listeners para el toggle
        $('#view-cards').on('change', () => {
            if ($('#view-cards').is(':checked')) {
                this.setView('cards');
            }
        });
        
        $('#view-list').on('change', () => {
            if ($('#view-list').is(':checked')) {
                this.setView('list');
            }
        });
    },

    /**
     * Cambia entre vistas cards/list
     */
    setView(viewType) {
        const $body = $('body');
        const $toggleContainer = $('#view-toggle-container');
        
        // Remover clases anteriores
        $body.removeClass('view-cards view-list');
        
        // Agregar nueva clase
        $body.addClass(`view-${viewType}`);
        
        // Actualizar radio buttons
        if (viewType === 'cards') {
            $('#view-cards').prop('checked', true);
        } else {
            $('#view-list').prop('checked', true);
        }
        
        // Guardar preferencia
        SanbornsUtils.saveToStorage('sanborns-view-preference', viewType);
        
        // Mostrar/ocultar toggle container según si hay items
        if (this.cart.items.length > 0) {
            $toggleContainer.removeClass('d-none');
        }
        
        // Re-renderizar según la vista
        this.updateUI();
        
        SanbornsUtils.log(`Vista cambiada a: ${viewType}`);
    },

    /**
     * Carga carrito desde localStorage
     */
    loadCart() {
        const savedCart = SanbornsUtils.getFromStorage('sanborns-cart');
        if (savedCart) {
            this.cart = { ...this.cart, ...savedCart };
        }
    },

    /**
     * Guarda carrito en localStorage
     */
    saveCart() {
        this.cart.timestamp = new Date().toISOString();
        SanbornsUtils.saveToStorage('sanborns-cart', this.cart);
    },

    /* ==========================================================================
       Event Handlers
       ========================================================================== */
    
    bindEvents() {
        // Eventos del modal de producto
        $('#increaseQuantity').on('click', () => this.changeModalQuantity(1));
        $('#decreaseQuantity').on('click', () => this.changeModalQuantity(-1));
        $('#productQuantity').on('change', (e) => this.updateModalPrice());
        $('#addToCartBtn').on('click', () => this.addCurrentProduct());
        
        // Evento de ordenar
        $('#ordenar-btn').on('click', () => this.processOrder());
    },

    /* ==========================================================================
       Gestión de Productos
       ========================================================================== */
    
    /**
     * Agrega producto al carrito
     * @param {Object} product - Datos del producto
     * @param {number} quantity - Cantidad
     */
    addProduct(product, quantity = 1) {
        if (!product || !SanbornsUtils.isValidRange(quantity)) {
            SanbornsUtils.showToast('Datos de producto inválidos', 'error');
            return false;
        }

        const existingIndex = this.cart.items.findIndex(item => item.sku === product.sku);
        
        if (existingIndex !== -1) {
            // Producto existe, actualizar cantidad
            this.cart.items[existingIndex].quantity += quantity;
            this.cart.items[existingIndex].total = 
                this.cart.items[existingIndex].quantity * this.cart.items[existingIndex].price;
        } else {
            // Nuevo producto
            this.cart.items.push({
                sku: product.sku,
                name: product.orderPrductName,
                description: product.description,
                price: product.price,
                image: product.image,
                quantity: quantity,
                total: product.price * quantity,
                estado: 'nuevo' // Estado inicial: nuevo, enviado_cocina, servido
            });
        }

        this.calculateTotals();
        this.saveCart();
        this.updateUI();
        
        SanbornsUtils.showToast(`${product.orderPrductName} agregado al carrito`, 'success');
        SanbornsUtils.log('Producto agregado', 'info', { product, quantity });
        
        return true;
    },

    /**
     * Actualiza cantidad de producto
     * @param {string} sku - SKU del producto
     * @param {number} newQuantity - Nueva cantidad
     */
    updateQuantity(sku, newQuantity) {
        if (!SanbornsUtils.isValidSku(sku)) return false;

        const itemIndex = this.cart.items.findIndex(item => item.sku === sku);
        if (itemIndex === -1) return false;

        // Verificar si el producto se puede editar (solo productos nuevos)
        const item = this.cart.items[itemIndex];
        if (item.estado !== 'nuevo') {
            SanbornsUtils.showToast('No se puede modificar producto ya enviado a cocina', 'warning');
            return false;
        }

        if (newQuantity <= 0) {
            this.removeProduct(sku);
            return true;
        }

        if (!SanbornsUtils.isValidRange(newQuantity)) {
            SanbornsUtils.showToast('Cantidad no válida (1-10)', 'warning');
            return false;
        }

        this.cart.items[itemIndex].quantity = newQuantity;
        this.cart.items[itemIndex].total = 
            this.cart.items[itemIndex].price * newQuantity;

        this.calculateTotals();
        this.saveCart();
        this.updateUI();
        
        return true;
    },

    /**
     * Elimina producto del carrito
     * @param {string} sku - SKU del producto
     */
    removeProduct(sku) {
        if (!SanbornsUtils.isValidSku(sku)) return false;

        const itemIndex = this.cart.items.findIndex(item => item.sku === sku);
        if (itemIndex === -1) return false;

        // Verificar si el producto se puede eliminar (solo productos nuevos)
        const item = this.cart.items[itemIndex];
        if (item.estado !== 'nuevo') {
            SanbornsUtils.showToast('No se puede eliminar producto ya enviado a cocina', 'warning');
            return false;
        }

        const removedItem = this.cart.items.splice(itemIndex, 1)[0];
        
        this.calculateTotals();
        this.saveCart();
        this.updateUI();
        
        SanbornsUtils.showToast(`${removedItem.name} eliminado del carrito`, 'info');
        return true;
    },

    /* ==========================================================================
       Cálculos
       ========================================================================== */
    
    /**
     * Calcula totales del carrito
     */
    calculateTotals() {
        this.cart.subtotal = this.cart.items.reduce((sum, item) => sum + item.total, 0);
        this.cart.tax = this.cart.subtotal * SanbornsUtils.config.taxRate;
        this.cart.total = this.cart.subtotal + this.cart.tax;
    },

    /**
     * Obtiene cantidad total de items
     * @returns {number} - Total de items
     */
    getTotalItems() {
        return this.cart.items.reduce((sum, item) => sum + item.quantity, 0);
    },

    /* ==========================================================================
       UI Updates
       ========================================================================== */
    
    /**
     * Actualiza toda la UI del carrito
     */
    updateUI() {
        this.updateCartBadges();
        this.updateCartSection();
        this.updateCartSummary();
        this.updateOrderButton(); // Agregar esta línea
        
        // Disparar evento para notificar cambios en el carrito
        $(document).trigger('cart:updated', {
            totalItems: this.getTotalItems(),
            cart: this.cart
        });
    },

    /**
     * Actualiza badges del carrito
     */
    updateCartBadges() {
        const totalItems = this.getTotalItems();
        const $badgeDesktop = $('#cart-badge-desktop');
        const $badgeMobile = $('#cart-badge-mobile');
        const $badgeFixed = $('#cart-badge-fixed');
        
        SanbornsUtils.updateCounter($badgeDesktop, totalItems);
        SanbornsUtils.updateCounter($badgeMobile, totalItems);
        SanbornsUtils.updateCounter($badgeFixed, totalItems);
        
        // Verificar si hay productos enviados a cocina para habilitar botón "Cuenta"
        this.updateCuentaButton();
    },

    /**
     * Verifica si hay productos enviados a cocina y habilita/deshabilita botón "Cuenta"
     */
    updateCuentaButton() {
        const hasOrderedItems = this.cart.items.some(item => 
            item.estado === 'enviado_cocina' || item.estado === 'servido'
        );
        
        const $cuentaButtonMobile = $('.mobile-nav .nav-item[data-section="cuenta"]');
        const $cuentaButtonDesktop = $('#desktop-header .nav-link[data-section="cuenta"]');
        
        if (hasOrderedItems) {
            // Habilitar botón "Cuenta"
            $cuentaButtonMobile.removeClass('disabled');
            $cuentaButtonDesktop.removeClass('disabled').removeAttr('disabled');
            SanbornsUtils.log('✅ Botón "Cuenta" habilitado - hay productos enviados a cocina');
        } else {
            // Deshabilitar botón "Cuenta"
            $cuentaButtonMobile.addClass('disabled');
            $cuentaButtonDesktop.addClass('disabled').attr('disabled', true);
            SanbornsUtils.log('🔒 Botón "Cuenta" deshabilitado - no hay productos enviados a cocina');
        }
    },

    /**
     * Actualiza sección del carrito con lógica condicional
     */
    updateCartSection() {
        const $emptyCart = $('#empty-cart');
        const $cartItems = $('#cart-items');
        const $cartListView = $('#cart-list-view');
        const $cartSummary = $('#cart-summary');
        const $toggleContainer = $('#view-toggle-container');
        const $actionButtons = $('#action-buttons');
        const $readonlyInfo = $('#readonly-info');
        const $title = $('#cart-section-title');
        
        // Detectar sección activa desde la app principal
        const currentSection = window.SanbornsApp ? window.SanbornsApp.currentSection : 'mi-orden';
        const isInCuenta = currentSection === 'cuenta';
        
        // Configurar título e interfaz según sección
        if (isInCuenta) {
            $title.html('<i class="fas fa-receipt text-danger me-2"></i>Cuenta');
            $toggleContainer.addClass('d-none');
            $actionButtons.addClass('d-none');
            $readonlyInfo.removeClass('d-none');
            // Forzar vista lista en Cuenta
            $('body').removeClass('view-cards').addClass('view-list');
            
            // Mostrar botón "Pagar" en lugar de los botones normales
            this.showPayButton();
        } else {
            $title.html('<span class="cuenta-icon-mask text-danger me-2"></span>Mi Orden');
            $actionButtons.removeClass('d-none');
            $readonlyInfo.addClass('d-none');
            $('#pay-button-container').addClass('d-none');
        }

        if (this.cart.items.length === 0) {
            $emptyCart.removeClass('d-none');
            $cartItems.addClass('d-none');
            $cartListView.addClass('d-none');
            $cartSummary.addClass('d-none');
            $toggleContainer.addClass('d-none');
        } else {
            $emptyCart.addClass('d-none');
            $cartSummary.removeClass('d-none');
            
            if (!isInCuenta) {
                $toggleContainer.removeClass('d-none');
            }
            
            // Renderizar según vista activa
            const currentView = $('body').hasClass('view-list') ? 'list' : 'cards';
            
            if (currentView === 'list' || isInCuenta) {
                $cartItems.addClass('d-none');
                $cartListView.removeClass('d-none');
                this.renderCartList();
            } else {
                $cartListView.addClass('d-none');
                $cartItems.removeClass('d-none');
                this.renderCartItems();
            }
        }
    },

    /**
     * Renderiza items del carrito
     */
    renderCartItems() {
        const $container = $('#cart-items');
        $container.empty();

        this.cart.items.forEach(item => {
            // Determinar si los botones deben estar habilitados
            const isEditable = item.estado === 'nuevo';
            const buttonClass = isEditable ? '' : 'disabled opacity-50';
            const buttonStyle = isEditable ? '' : 'pointer-events: none;';
            
            // Determinar clases de estado
            let stateClasses = '';
            if (!isEditable) {
                stateClasses = 'item-locked';
                if (item.estado === 'enviado_cocina') {
                    stateClasses += ' enCocina';
                } else if (item.estado === 'servido') {
                    stateClasses += ' servido';
                }
            }
            
            const itemHtml = `
                <div class="cart-item ${stateClasses}" data-sku="${item.sku}">
                    <div class="row align-items-center">
                        <div class="col-3">
                            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                        </div>
                        <div class="col-6">
                            <div class="cart-item-info">
                                <h6>${item.name}</h6>
                                <p class="text-muted small mb-1">${item.description}</p>
                                <div class="cart-item-price">${SanbornsUtils.formatPrice(item.price)} c/u</div>
                                ${!isEditable ? '<small class="text-warning"><i class="fas fa-lock"></i> ' + this.getEstadoLabel(item.estado) + '</small>' : ''}
                            </div>
                        </div>
                        <div class="col-3">
                            <div class="quantity-controls">
                                <button class="quantity-btn ${buttonClass}" style="${buttonStyle}" ${isEditable ? `onclick="CartManager.updateQuantity('${item.sku}', ${item.quantity - 1})"` : ''}>
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="quantity-display">${item.quantity}</span>
                                <button class="quantity-btn ${buttonClass}" style="${buttonStyle}" ${isEditable ? `onclick="CartManager.updateQuantity('${item.sku}', ${item.quantity + 1})"` : ''}>
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <div class="text-center mt-2">
                                <strong>${SanbornsUtils.formatPrice(item.total)}</strong>
                            </div>
                            <div class="text-center mt-1">
                                <button class="btn btn-sm btn-outline-danger ${buttonClass}" style="${buttonStyle}" ${isEditable ? `onclick="CartManager.removeProduct('${item.sku}')"` : ''}>
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $container.append(itemHtml);
        });

        // Animar entrada de items
        $('.cart-item').addClass('animate-fadeInLeft');
    },

    /**
     * Renderiza vista de lista (ticket)
     */
    renderCartList() {
        const $container = $('#ticket-products');
        const $ticketInfo = $('.ticket-info');
        
        // Actualizar información del ticket
        const now = new Date();
        const fecha = now.toLocaleDateString('es-MX') + ' ' + now.toLocaleTimeString('es-MX', {hour: '2-digit', minute: '2-digit'});
        $('#ticket-fecha').text(fecha);
        
        // Limpiar contenedor
        $container.empty();

        // Renderizar productos
        this.cart.items.forEach(item => {
            // Determinar si los botones deben estar habilitados
            const isEditable = item.estado === 'nuevo';
            const buttonClass = isEditable ? '' : 'disabled opacity-50';
            const buttonStyle = isEditable ? '' : 'pointer-events: none; cursor: not-allowed;';
            
            // Determinar clases de estado
            let stateClasses = '';
            if (!isEditable) {
                stateClasses = 'item-locked';
                if (item.estado === 'enviado_cocina') {
                    stateClasses += ' enCocina';
                } else if (item.estado === 'servido') {
                    stateClasses += ' servido';
                }
            }
            
            const productRow = `
                <div class="product-row row align-items-center ${stateClasses}" data-sku="${item.sku}">
                    <div class="col-1 small">${item.quantity}</div>
                    <div class="col-6 small">
                        ${item.name}
                        ${!isEditable ? '<br><small class="text-warning"><i class="fas fa-lock"></i> ' + this.getEstadoLabel(item.estado) + '</small>' : ''}
                    </div>
                    <div class="col-3 text-end small">$${item.total.toFixed(2)}</div>
                    <div class="col-2 text-center">
                        <button class="ticket-action-btn btn-add-more ${buttonClass}" style="${buttonStyle}" data-sku="${item.sku}" title="Agregar más" ${!isEditable ? 'disabled' : ''}>
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="ticket-action-btn btn-remove ${buttonClass}" style="${buttonStyle}" data-sku="${item.sku}" title="Quitar/Eliminar" ${!isEditable ? 'disabled' : ''}>
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            $container.append(productRow);
        });

        // Actualizar totales del ticket
        $('#ticket-subtotal').text(this.cart.subtotal.toFixed(2));
        $('#ticket-impuestos').text(this.cart.tax.toFixed(2));
        $('#ticket-total').text(this.cart.total.toFixed(2));

        // Bind eventos para botones del ticket
        this.bindTicketEvents();
    },

    /**
     * Bind eventos para botones del ticket
     */
    bindTicketEvents() {
        // Remover eventos previos
        $(document).off('click', '.btn-add-more');
        $(document).off('click', '.btn-remove');
        
        // Botón agregar más - solo para productos editables
        $(document).on('click', '.btn-add-more:not(.disabled)', (e) => {
            const sku = $(e.currentTarget).data('sku');
            this.handleAddMoreClick(sku);
        });
        
        // Botón quitar/eliminar - solo para productos editables
        $(document).on('click', '.btn-remove:not(.disabled)', (e) => {
            const sku = $(e.currentTarget).data('sku');
            this.handleRemoveClick(sku);
        });
    },

    /**
     * Actualiza resumen del carrito
     */
    updateCartSummary() {
        $('#subtotal').text(SanbornsUtils.formatPrice(this.cart.subtotal).replace('$', ''));
        $('#impuestos').text(SanbornsUtils.formatPrice(this.cart.tax).replace('$', ''));
        $('#total').text(SanbornsUtils.formatPrice(this.cart.total).replace('$', ''));
    },

    /* ==========================================================================
       Modal de Producto
       ========================================================================== */
    
    /**
     * Cambia cantidad en modal
     * @param {number} delta - Cambio (+1 o -1)
     */
    changeModalQuantity(delta) {
        const $quantityInput = $('#productQuantity');
        let currentQuantity = parseInt($quantityInput.val()) || 1;
        
        currentQuantity += delta;
        
        if (currentQuantity < 1) currentQuantity = 1;
        if (currentQuantity > 10) currentQuantity = 10;
        
        $quantityInput.val(currentQuantity);
        this.updateModalPrice();
    },

    /**
     * Actualiza precio en modal
     */
    updateModalPrice() {
        const quantity = parseInt($('#productQuantity').val()) || 1;
        const unitPrice = parseFloat($('#productPrice').text()) || 0;
        const total = unitPrice * quantity;
        
        $('#addToCartPrice').text(SanbornsUtils.formatPrice(total).replace('$', ''));
    },

    /**
     * Agrega producto actual del modal
     */
    addCurrentProduct() {
        const modal = $('#productModal');
        const productData = modal.data('product');
        const quantity = parseInt($('#productQuantity').val()) || 1;
        
        if (!productData) {
            SanbornsUtils.showToast('Error: No hay producto seleccionado', 'error');
            return;
        }

        if (this.addProduct(productData, quantity)) {
            // Cerrar modal y resetear
            modal.modal('hide');
            $('#productQuantity').val(1);
            
            // Animar botón de éxito
            const $addBtn = $('#addToCartBtn');
            SanbornsUtils.pulseSuccess($addBtn);
        }
    },

    /* ==========================================================================
       Proceso de Orden
       ========================================================================== */
    
    /**
     * Procesa la orden
     */
    async processOrder() {
        if (this.cart.items.length === 0) {
            SanbornsUtils.showToast('El carrito está vacío', 'warning');
            return;
        }

        // Verificar si hay productos nuevos para ordenar
        if (!this.hasNewProducts()) {
            SanbornsUtils.showToast('No hay productos nuevos para ordenar', 'warning');
            return;
        }

        const $ordenBtn = $('#ordenar-btn');
        SanbornsUtils.showLoading($ordenBtn, 'Enviando...');

        try {
            // Simular envío a servidor
            await this.sendOrder();
            
            // Marcar productos como enviados a cocina
            this.markProductsAsSent();
            
            SanbornsUtils.showToast('¡Orden enviada a cocina!', 'success');
            SanbornsUtils.hideLoading($ordenBtn);
            
            // Cambiar botones a estado "servida"
            this.showServedState();
            
        } catch (error) {
            SanbornsUtils.showToast('Error al enviar orden', 'error');
            SanbornsUtils.hideLoading($ordenBtn);
            SanbornsUtils.log('Error enviando orden', 'error', error);
        }
    },

    /**
     * Simula envío de orden
     */
    async sendOrder() {
        return new Promise((resolve) => {
            setTimeout(() => {
                SanbornsUtils.log('Orden enviada', 'info', this.cart);
                resolve();
            }, 2000);
        });
    },

    /**
     * Muestra estado de mesa servida
     */
    showServedState() {
        const $cartSummary = $('#cart-summary .d-grid');
        
        // Verificar si hay productos en cocina
        const hasProductsInKitchen = this.cart.items.some(item => item.estado === 'enviado_cocina');
        
        if (hasProductsInKitchen) {
            // Mostrar mensaje de orden enviada a cocina
            $cartSummary.html(`
                <div class="alert alert-success text-center mb-3" id="order-sent-alert">
                    <i class="fas fa-check-circle me-2"></i>
                    <strong>¡Orden enviada a cocina!</strong>
                    <br><small>Te avisaremos cuando esté lista</small>
                </div>
                <button class="btn btn-warning btn-lg mb-2" id="pagar-btn">
                    <i class="fas fa-credit-card me-2"></i>Pagar Cuenta
                </button>
                <button class="btn btn-outline-danger btn-lg" onclick="showSection('menu')">
                    <span class="menu-icon-mask me-2"></span>Agregar Más Productos
                </button>
            `);
        } else {
            // No hay productos en cocina, pero SÍ mostrar botón de pagar si hay productos servidos
            const hasServedProducts = this.cart.items.some(item => item.estado === 'servido');
            
            if (hasServedProducts) {
                $cartSummary.html(`
                    <button class="btn btn-warning btn-lg mb-2" id="pagar-btn">
                        <i class="fas fa-credit-card me-2"></i>Pagar Cuenta
                    </button>
                    <button class="btn btn-outline-danger btn-lg" onclick="showSection('menu')">
                        <span class="menu-icon-mask me-2"></span>Agregar Más Productos
                    </button>
                `);
            }
        }

        // Bind evento de pagar
        $('#pagar-btn').on('click', () => this.processPayment());
    },

    /**
     * Muestra el botón "Pagar" en la sección Cuenta
     */
    showPayButton() {
        const $payContainer = $('#pay-button-container');
        $payContainer.removeClass('d-none');
        
        // Bind evento si no existe
        if (!$('#pagar-btn').data('bound')) {
            $('#pagar-btn').on('click', () => this.processPay());
            $('#pagar-btn').data('bound', true);
        }
    },

    /**
     * Procesa el pago
     */
    async processPay() {
        // Verificar que hay items para pagar
        const payableItems = this.cart.items.filter(item => 
            item.estado === 'enviado_cocina' || item.estado === 'servido'
        );
        
        if (payableItems.length === 0) {
            SanbornsUtils.showToast('No hay productos que pagar', 'warning');
            return;
        }

        const $pagarBtn = $('#pagar-btn');
        SanbornsUtils.showLoading($pagarBtn, 'Procesando...');

        try {
            // Simular procesamiento de pago
            await SanbornsUtils.delay(2000);
            
            // Mostrar confirmación
            const result = await Swal.fire({
                title: '💳 Procesar Pago',
                html: `
                    <div class="text-start">
                        <p><strong>Total a pagar:</strong> ${SanbornsUtils.formatPrice(this.cart.total)}</p>
                        <p class="text-muted">¿Confirmas el pago de tu cuenta?</p>
                    </div>
                `,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, pagar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#28a745'
            });

            if (result.isConfirmed) {
                // Marcar items como pagados
                this.markItemsAsPaid();
                
                SanbornsUtils.showToast('¡Pago procesado exitosamente!', 'success');
                
                // Opcional: Navegar de vuelta al menú
                setTimeout(() => {
                    showSection('menu');
                }, 1500);
            }
            
        } catch (error) {
            SanbornsUtils.showToast('Error procesando el pago', 'error');
            SanbornsUtils.log('Error en pago:', 'error', error);
        } finally {
            SanbornsUtils.hideLoading($pagarBtn);
        }
    },

    /**
     * Marca items como pagados
     */
    markItemsAsPaid() {
        this.cart.items.forEach(item => {
            if (item.estado === 'enviado_cocina' || item.estado === 'servido') {
                item.estado = 'pagado';
            }
        });
        
        // Actualizar storage
        this.saveCart();
        
        // Actualizar UI
        this.updateUI();
        
        SanbornsUtils.log('Items marcados como pagados');
    },

    /* ==========================================================================
       Utilidades
       ========================================================================== */
    
    /**
     * Vacía el carrito
     */
    clearCart() {
        this.cart = {
            items: [],
            subtotal: 0,
            tax: 0,
            total: 0,
            timestamp: new Date().toISOString()
        };
        
        this.saveCart();
        this.updateUI();
        SanbornsUtils.showToast('Carrito vaciado', 'info');
    },

    /**
     * Obtiene datos del carrito
     * @returns {Object} - Datos del carrito
     */
    getCartData() {
        return { ...this.cart };
    },

    /**
     * Maneja el click en botón de eliminar con lógica de cantidad
     * @param {string} sku - SKU del producto
     */
    handleRemoveClick(sku) {
        const item = this.cart.items.find(item => item.sku === sku);
        if (!item) return;

        // Verificar si el producto se puede editar
        if (item.estado !== 'nuevo') {
            SanbornsUtils.showToast('No se puede modificar producto ya enviado a cocina', 'warning');
            return;
        }

        // Si tiene más de 1, solo restar
        if (item.quantity > 1) {
            this.updateQuantity(sku, item.quantity - 1);
            SanbornsUtils.showToast(`Cantidad reducida: ${item.name}`, 'info');
        } else {
            // Si queda 1, mostrar modal de confirmación
            this.showDeleteConfirmation(item);
        }
    },

    /**
     * Muestra modal de confirmación para eliminar producto
     * @param {Object} item - Item del carrito
     */
    showDeleteConfirmation(item) {
        $('#deleteProductName').text(item.name);
        
        // Remover eventos anteriores y agregar nuevo
        $('#confirmDeleteBtn').off('click').on('click', () => {
            this.removeProduct(item.sku);
            $('#deleteConfirmModal').modal('hide');
            SanbornsUtils.showToast(`${item.name} eliminado del carrito`, 'success');
        });
        
        $('#deleteConfirmModal').modal('show');
    },

    /**
     * Maneja el click en botón de agregar más
     * @param {string} sku - SKU del producto
     */
    handleAddMoreClick(sku) {
        const item = this.cart.items.find(item => item.sku === sku);
        if (!item) return;

        // Verificar si el producto se puede editar
        if (item.estado !== 'nuevo') {
            SanbornsUtils.showToast('No se puede modificar producto ya enviado a cocina', 'warning');
            return;
        }

        // Por ahora, simplemente incrementar la cantidad
        if (item.quantity < 10) {
            this.updateQuantity(sku, item.quantity + 1);
            SanbornsUtils.showToast(`Cantidad aumentada: ${item.name}`, 'success');
        } else {
            SanbornsUtils.showToast('Cantidad máxima alcanzada (10)', 'warning');
        }
    },

    /**
     * Busca el producto original en el menú cargado
     * @param {string} sku - SKU del producto
     * @returns {Object|null} - Producto encontrado o null
     */
    findOriginalProduct(sku) {
        // Implementación temporal - buscar en los datos del carrito
        const cartItem = this.cart.items.find(item => item.sku === sku);
        if (!cartItem) return null;
        
        // Crear objeto producto desde el item del carrito
        return {
            sku: cartItem.sku,
            orderPrductName: cartItem.name,
            description: cartItem.description,
            price: cartItem.price,
            image: cartItem.image
        };
    },

    /**
     * Abre el modal de producto con cantidad inicial
     * @param {Object} product - Producto original
     * @param {number} currentQuantity - Cantidad actual en carrito
     */
    openProductModal(product, currentQuantity = 1) {
        // Implementación temporal hasta que MenuManager esté disponible
        SanbornsUtils.showToast('Modal de producto no disponible aún', 'info');
    },

    /* ==========================================================================
       Estados y Validaciones
       ========================================================================== */
    
    /**
     * Obtiene el label del estado del producto
     * @param {string} estado - Estado del producto
     * @returns {string} - Label del estado
     */
    getEstadoLabel(estado) {
        const estados = {
            'nuevo': 'Nuevo',
            'enviado_cocina': 'En Cocina',
            'servido': 'Servido',
            'pagado': 'Pagado'
        };
        return estados[estado] || 'Desconocido';
    },

    /**
     * Verifica si hay productos nuevos en el carrito
     * @returns {boolean} - True si hay productos nuevos
     */
    hasNewProducts() {
        return this.cart.items.some(item => item.estado === 'nuevo');
    },

    /**
     * Cambia el estado de todos los productos nuevos a enviado_cocina
     */
    markProductsAsSent() {
        this.cart.items.forEach(item => {
            if (item.estado === 'nuevo') {
                item.estado = 'enviado_cocina';
            }
        });
        this.saveCart();
        this.updateUI();
    },

    /**
     * Cambia el estado de todos los productos enviados a servido
     */
    markProductsAsServed() {
        this.cart.items.forEach(item => {
            if (item.estado === 'enviado_cocina') {
                item.estado = 'servido';
            }
        });
        this.saveCart();
        this.updateUI();
        
        // Verificar si debe ocultar el mensaje de cocina
        this.checkAndHideKitchenMessage();
    },

    /**
     * Obtiene contadores por estado
     * @returns {Object} - Contadores por estado
     */
    getStatusCounts() {
        const counts = {
            nuevo: 0,
            enviado_cocina: 0,
            servido: 0
        };
        
        this.cart.items.forEach(item => {
            if (counts.hasOwnProperty(item.estado)) {
                counts[item.estado] += item.quantity;
            }
        });
        
        return counts;
    },

    /* ==========================================================================
       Actualización del Botón Ordenar
       ========================================================================== */
    
    /**
     * Actualiza la visibilidad y estado del botón ordenar
     */
    updateOrderButton() {
        const $ordenBtn = $('#ordenar-btn');
        const hasNewProducts = this.hasNewProducts();
        
        if (hasNewProducts) {
            $ordenBtn.show().prop('disabled', false);
        } else {
            $ordenBtn.hide();
        }
    },

    /* ==========================================================================
       Debug y Testing
       ========================================================================== */
    
    /**
     * Función de testing para simular diferentes estados
     * Solo para desarrollo/debug
     */
    simulateStates() {
        if (this.cart.items.length === 0) {
            SanbornsUtils.showToast('Agrega productos primero para simular estados', 'warning');
            return;
        }

        // Simular diferentes estados en los productos existentes
        this.cart.items.forEach((item, index) => {
            if (index === 0) {
                item.estado = 'nuevo';
            } else if (index === 1) {
                item.estado = 'enviado_cocina';
            } else if (index === 2) {
                item.estado = 'servido';
            }
        });

        this.saveCart();
        this.updateUI();
        
        // Verificar si debe ocultar el mensaje de cocina
        this.checkAndHideKitchenMessage();
        
        SanbornsUtils.showToast('Estados simulados para testing', 'info');
        console.log('Estados actuales:', this.getStatusCounts());
    },

    /**
     * Reset de todos los productos a estado nuevo
     * Solo para desarrollo/debug
     */
    resetAllToNew() {
        this.cart.items.forEach(item => {
            item.estado = 'nuevo';
        });
        
        this.saveCart();
        this.updateUI();
        SanbornsUtils.showToast('Todos los productos reseteados a nuevo', 'info');
    },

    /**
     * Verifica si debe ocultar el mensaje de "orden enviada a cocina"
     */
    checkAndHideKitchenMessage() {
        const hasProductsInKitchen = this.cart.items.some(item => item.estado === 'enviado_cocina');
        const $orderAlert = $('#order-sent-alert');
        
        if (!hasProductsInKitchen && $orderAlert.length) {
            // Fadeout muy lento (3 segundos)
            $orderAlert.fadeOut(3000, function() {
                $(this).remove();
                // Después del fadeout, asegurar que el botón de pagar siga visible
                const hasServedProducts = CartManager.cart.items.some(item => item.estado === 'servido');
                if (hasServedProducts && !$('#pagar-btn').length) {
                    // Re-mostrar solo los botones sin el mensaje
                    CartManager.showServedState();
                }
            });
        }
    },

    // Hacer estas funciones disponibles en consola para debug
    debug: {
        simulateStates: function() { CartManager.simulateStates(); },
        resetAllToNew: function() { CartManager.resetAllToNew(); },
        getStatusCounts: function() { return CartManager.getStatusCounts(); },
        markAsSent: function() { CartManager.markProductsAsSent(); },
        markAsServed: function() { CartManager.markProductsAsServed(); }
    }
};

// Hacer debug disponible globalmente
window.CartDebug = CartManager.debug;

// Hacer disponible globalmente
window.CartManager = CartManager;
