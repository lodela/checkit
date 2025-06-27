/* ==========================================================================
   Utils - Funciones de utilidad estilo 90's con jQuery
   ========================================================================== */

const SanbornsUtils = {
    
    /* ==========================================================================
       Configuración Global
       ========================================================================== */
    config: {
        apiUrl: 'http://localhost:3001',
        mesaId: 205,
        animationSpeed: 300,
        currency: 'MXN',
        taxRate: 0.16
    },

    /* ==========================================================================
       Formateo de Datos
       ========================================================================== */
    
    /**
     * Formatea precio a moneda mexicana
     * @param {number} price - Precio a formatear
     * @returns {string} - Precio formateado
     */
    formatPrice(price) {
        if (typeof price !== 'number' || isNaN(price)) return '$0.00';
        return `$${price.toFixed(2)}`;
    },

    /**
     * Formatea número para mostrar
     * @param {number} num - Número a formatear
     * @returns {string} - Número formateado
     */
    formatNumber(num) {
        if (typeof num !== 'number' || isNaN(num)) return '0';
        return num.toLocaleString('es-MX');
    },

    /**
     * Limpia texto para mostrar
     * @param {string} text - Texto a limpiar
     * @returns {string} - Texto limpio
     */
    cleanText(text) {
        if (!text) return '';
        return text.toString().trim();
    },

    /* ==========================================================================
       Animaciones jQuery Retro
       ========================================================================== */
    
    /**
     * Fade in con efecto retro
     * @param {jQuery} $element - Elemento jQuery
     * @param {number} duration - Duración en ms
     * @param {function} callback - Callback opcional
     */
    fadeInRetro($element, duration = 300, callback = null) {
        $element
            .css({
                opacity: 0,
                transform: 'translateY(20px)'
            })
            .animate({
                opacity: 1
            }, duration)
            .css({
                transform: 'translateY(0)',
                transition: `transform ${duration}ms ease`
            });
        
        if (callback) setTimeout(callback, duration);
    },

    /**
     * Slide down retro
     * @param {jQuery} $element - Elemento jQuery
     * @param {number} duration - Duración en ms
     */
    slideDownRetro($element, duration = 300) {
        $element
            .css('overflow', 'hidden')
            .slideDown(duration)
            .addClass('animate-fadeInUp');
    },

    /**
     * Bounce efecto para botones
     * @param {jQuery} $element - Elemento jQuery
     */
    bounceButton($element) {
        $element
            .addClass('animate-bounceIn')
            .one('animationend', function() {
                $(this).removeClass('animate-bounceIn');
            });
    },

    /**
     * Shake para errores
     * @param {jQuery} $element - Elemento jQuery
     */
    shakeError($element) {
        $element
            .addClass('animate-shake error-state')
            .one('animationend', function() {
                $(this).removeClass('animate-shake error-state');
            });
    },

    /**
     * Pulse para éxito
     * @param {jQuery} $element - Elemento jQuery
     */
    pulseSuccess($element) {
        $element.addClass('success-state');
        setTimeout(() => {
            $element.removeClass('success-state');
        }, 600);
    },

    /* ==========================================================================
       Notificaciones Toast Retro
       ========================================================================== */
    
    /**
     * Muestra notificación toast
     * @param {string} message - Mensaje
     * @param {string} type - Tipo: success, error, warning, info
     * @param {number} duration - Duración en ms
     */
    showToast(message, type = 'info', duration = 3000) {
        const toastId = `toast-${Date.now()}`;
        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle', 
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        const colorMap = {
            success: 'success',
            error: 'danger',
            warning: 'warning', 
            info: 'primary'
        };

        const toastHtml = `
            <div id="${toastId}" class="toast align-items-center text-white bg-${colorMap[type]} border-0 position-fixed" style="top: 20px; right: 20px; z-index: 9999;">
                <div class="d-flex">
                    <div class="toast-body">
                        <i class="${iconMap[type]} me-2"></i>
                        ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;

        $('body').append(toastHtml);
        const $toast = $(`#${toastId}`);
        
        // Mostrar con animación
        $toast
            .addClass('animate-slideInBottom')
            .fadeIn(300);

        // Auto-hide
        setTimeout(() => {
            $toast
                .addClass('animate-slideOutBottom')
                .fadeOut(300, function() {
                    $(this).remove();
                });
        }, duration);
    },

    /* ==========================================================================
       Loading States
       ========================================================================== */
    
    /**
     * Muestra loading en elemento
     * @param {jQuery} $element - Elemento jQuery
     * @param {string} text - Texto opcional
     */
    showLoading($element, text = 'Cargando...') {
        const originalContent = $element.html();
        $element.data('original-content', originalContent);
        
        $element.html(`
            <span class="loading-state">
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                ${text}
            </span>
        `).prop('disabled', true);
    },

    /**
     * Oculta loading de elemento
     * @param {jQuery} $element - Elemento jQuery
     */
    hideLoading($element) {
        const originalContent = $element.data('original-content');
        if (originalContent) {
            $element.html(originalContent).prop('disabled', false);
        }
    },

    /* ==========================================================================
       Local Storage Helpers
       ========================================================================== */
    
    /**
     * Guarda en localStorage
     * @param {string} key - Clave
     * @param {*} data - Datos a guardar
     */
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },

    /**
     * Obtiene de localStorage
     * @param {string} key - Clave
     * @param {*} defaultValue - Valor por defecto
     * @returns {*} - Datos obtenidos
     */
    getFromStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return defaultValue;
        }
    },

    /**
     * Elimina de localStorage
     * @param {string} key - Clave
     */
    removeFromStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    },

    /* ==========================================================================
       Validaciones
       ========================================================================== */
    
    /**
     * Valida que un número esté en rango
     * @param {number} value - Valor a validar
     * @param {number} min - Mínimo
     * @param {number} max - Máximo
     * @returns {boolean} - Es válido
     */
    isValidRange(value, min = 1, max = 10) {
        return typeof value === 'number' && value >= min && value <= max;
    },

    /**
     * Valida SKU
     * @param {string} sku - SKU a validar
     * @returns {boolean} - Es válido
     */
    isValidSku(sku) {
        return typeof sku === 'string' && /^sku\d+$/.test(sku);
    },

    /* ==========================================================================
       Helpers de DOM
       ========================================================================== */
    
    /**
     * Scroll suave a elemento
     * @param {string} selector - Selector del elemento
     * @param {number} offset - Offset en píxeles
     */
    scrollToElement(selector, offset = 0) {
        const $element = $(selector);
        if ($element.length) {
            $('html, body').animate({
                scrollTop: $element.offset().top - offset
            }, 500);
        }
    },

    /**
     * Actualiza contador visual
     * @param {jQuery} $counter - Elemento contador
     * @param {number} newValue - Nuevo valor
     */
    updateCounter($counter, newValue) {
        const currentValue = parseInt($counter.text()) || 0;
        
        if (newValue === 0) {
            $counter.addClass('d-none');
            return;
        }

        $counter.removeClass('d-none');
        
        // Animación de contador
        $({ count: currentValue }).animate(
            { count: newValue },
            {
                duration: 300,
                step: function() {
                    $counter.text(Math.floor(this.count));
                },
                complete: function() {
                    $counter.text(newValue);
                    if (newValue > currentValue) {
                        SanbornsUtils.bounceButton($counter);
                    }
                }
            }
        );
    },

    /* ==========================================================================
       Debug Helpers
       ========================================================================== */
    
    /**
     * Log con estilo para debug
     * @param {string} message - Mensaje
     * @param {string} type - Tipo: info, warn, error
     * @param {*} data - Datos adicionales
     */
    log(message, type = 'info', data = null) {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[Sanborns ${timestamp}]`;
        
        switch (type) {
            case 'warn':
                console.warn(prefix, message, data);
                break;
            case 'error':
                console.error(prefix, message, data);
                break;
            default:
                console.log(prefix, message, data);
        }
    },

    /* ==========================================================================
       Configuración de Menús por Horario - Loading Screen Dinámico
       ========================================================================== */
    
    /**
     * 🕐 Configuración de horarios y menús contextuales
     * Esta configuración permite mostrar botones dinámicos en el loading screen
     * según el horario actual del día y la disponibilidad de nodos en el mock.json
     */
    menuScheduleConfig: {
        // 🔧 Configuración de desarrollador
        enabled: true,                    // true: activar menús por horario | false: mostrar menú general
        fallbackToGeneralMenu: true,      // true: si no existe el nodo, mostrar menú general
        debugMode: true,                  // true: logs de debug | false: modo silencioso
        
        // ⏰ Definición de horarios (formato 24hrs)
        schedules: {
            desayunos: {
                startHour: 6,             // 06:00 AM
                endHour: 14,              // 02:00 PM (hasta las 2:00 PM)
                enabled: true,            // Activar/desactivar este horario
                buttonText: "Desayuno Sanborns",  // Texto del botón
                menuNode: "Paquetes desayunos",        // Nodo en mock.json
                description: "Desayunos tradicionales que te harán madrugar con ganas"
            },
            comidas: {
                startHour: 14,            // 02:00 PM
                endHour: 17,              // 05:00 PM
                enabled: false,           // ⚠️ Deshabilitado hasta tener productos
                buttonText: "Comidas Sanborns",
                menuNode: "Comidas principales",       // Nodo que aún no existe
                description: "Platillos fuertes para el hambre del mediodía"
            },
            cenas: {
                startHour: 17,            // 05:00 PM
                endHour: 23,              // 11:00 PM
                enabled: false,           // ⚠️ Deshabilitado hasta tener productos
                buttonText: "Cenas Sanborns",
                menuNode: "Cenas y antojitos",         // Nodo que aún no existe
                description: "Cenas perfectas para cerrar el día con sabor"
            }
        }
    },

    /**
     * 🕐 Obtiene el horario actual según la hora del sistema
     * @returns {string|null} - Nombre del horario actual o null si no hay coincidencia
     */
    getCurrentSchedule() {
        const config = this.menuScheduleConfig;
        
        if (!config.enabled) {
            if (config.debugMode) {
                this.log('Menús por horario deshabilitados - mostrando menú general');
            }
            return null;
        }

        const currentHour = new Date().getHours();
        
        for (const [scheduleName, schedule] of Object.entries(config.schedules)) {
            if (!schedule.enabled) continue;
            
            // Verificar si la hora actual está en el rango
            if (currentHour >= schedule.startHour && currentHour < schedule.endHour) {
                if (config.debugMode) {
                    this.log(`Horario detectado: ${scheduleName} (${currentHour}:xx)`, 'info', schedule);
                }
                return scheduleName;
            }
        }

        if (config.debugMode) {
            this.log(`Ningún horario activo para las ${currentHour}:xx - usando menú general`);
        }
        return null;
    },

    /**
     * 🎯 Verifica si existe el nodo del menú en los datos cargados
     * @param {string} menuNode - Nombre del nodo a verificar
     * @param {Object} menuData - Datos del menú (mock.json)
     * @returns {boolean} - true si existe el nodo
     */
    menuNodeExists(menuNode, menuData) {
        if (!menuData || !menuNode) return false;
        
        const exists = menuData.hasOwnProperty(menuNode) && 
                      Object.keys(menuData[menuNode]).length > 0;
        
        if (this.menuScheduleConfig.debugMode) {
            this.log(`Verificando nodo "${menuNode}": ${exists ? '✅ existe' : '❌ no existe'}`);
        }
        
        return exists;
    },

    /**
     * 🚀 Genera botones dinámicos para el loading screen
     * @param {Object} menuData - Datos del menú cargado
     * @returns {Array} - Array de objetos con configuración de botones
     */
    generateScheduleButtons(menuData) {
        const config = this.menuScheduleConfig;
        const currentSchedule = this.getCurrentSchedule();
        const buttons = [];

        if (!config.enabled || !currentSchedule) {
            // Sin horarios activos - mostrar botón general
            buttons.push({
                type: 'general',
                text: 'al menú completo',
                action: 'showGeneralMenu',
                className: 'holaMundo',
                icon: '🍽️'
            });
            return buttons;
        }

        const schedule = config.schedules[currentSchedule];
        
        // Verificar si existe el nodo del menú
        if (this.menuNodeExists(schedule.menuNode, menuData)) {
            // Botón del horario específico
            buttons.push({
                type: 'schedule',
                schedule: currentSchedule,
                text: schedule.buttonText,
                action: 'scrollToMenuSection',
                target: schedule.menuNode,
                className: '',
                icon: this.getScheduleIcon(currentSchedule),
                description: schedule.description
            });
        }

        // Siempre agregar opción del menú general
        buttons.push({
            type: 'general',
            text: 'al menú completo',
            action: 'showGeneralMenu',
            className: 'btn-outline-light',
            icon: '📋'
        });

        return buttons;
    },

    /**
     * 🎨 Obtiene el ícono correspondiente al horario
     * @param {string} scheduleName - Nombre del horario
     * @returns {string} - HTML del ícono (SVG o emoji)
     */
    getScheduleIcon(scheduleName) {
        const icons = {
            desayunos: '<span class="breakfast-icon-mask"></span>',
            comidas: '☀️', 
            cenas: '🌙'
        };
        return icons[scheduleName] || '🍽️';
    },

    /**
     * 🎯 Maneja la navegación a sección específica del menú
     * @param {string} menuNode - Nodo del menú al que navegar
     */
    navigateToMenuSection(menuNode) {
        const config = this.menuScheduleConfig;
        
        if (config.debugMode) {
            this.log(`Navegando a sección: ${menuNode}`);
        }

        // Primero cambiar a la sección de menú
        if (window.SanbornsApp && typeof window.SanbornsApp.showSection === 'function') {
            window.SanbornsApp.showSection('menu');
        }

        // Luego hacer scroll a la categoría específica
        setTimeout(() => {
            // Buscar el elemento con data-category
            const categorySelector = `[data-category="${menuNode}"], .category-${menuNode.toLowerCase().replace(/\s+/g, '-')}`;
            
            if ($(categorySelector).length > 0) {
                this.scrollToElement(categorySelector, 100);
                this.showToast(`Mostrando: ${menuNode}`, 'success', 2000);
            } else {
                // Fallback: mostrar menú general
                this.showToast('Mostrando menú completo', 'info', 2000);
                if (config.debugMode) {
                    this.log(`Elemento ${categorySelector} no encontrado - usando fallback`);
                }
            }
        }, 500);
    },

    /**
     * 🔄 Aplica lógica de fallback para menús
     * Muestra el menú general cuando no existe el nodo específico
     */
    applyMenuFallback() {
        const config = this.menuScheduleConfig;
        
        if (config.fallbackToGeneralMenu) {
            if (config.debugMode) {
                this.log('Aplicando fallback - mostrando menú general completo');
            }
            
            // Navegar a la sección de menú sin scroll específico
            if (window.SanbornsApp && typeof window.SanbornsApp.showSection === 'function') {
                window.SanbornsApp.showSection('menu');
            }
            
            this.showToast('Mostrando menú completo', 'info', 2000);
        }
    }

};

// Hacer disponible globalmente
window.SanbornsUtils = SanbornsUtils;
