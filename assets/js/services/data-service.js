/* ==========================================================================
   DataService - Servicio centralizado de datos para Sanborns WebApp
   ========================================================================== */

const DataService = {
    
    /* ==========================================================================
       Configuración
       ========================================================================== */
    config: {
        // Entorno actual: 'mock' | 'development' | 'production'
        environment: 'mock',
        
        // URLs de endpoints por entorno
        endpoints: {
            mock: {
                // GitHub Pages sirve desde subdominio, ajustar rutas
                menu: './mock.json'
            },
            development: {
                menu: 'http://localhost:3001/api/menu',
                orders: 'http://localhost:3001/api/orders'
            },
            production: {
                // GitHub Pages production (si usas API externa)
                menu: 'https://api.sanborns.com/menu',
                orders: 'https://api.sanborns.com/orders'
            },
            github_pages: {
                // Configuración específica para GitHub Pages
                menu: './mock.json'
            }
        },
        
        // Headers por defecto
        defaultHeaders: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        
        // Timeout para requests (ms)
        timeout: 10000
    },

    // Cache simple en memoria
    cache: new Map(),
    cacheTimeout: 5 * 60 * 1000, // 5 minutos

    /* ==========================================================================
       Métodos Principales
       ========================================================================== */

    /**
     * 🍽️ Obtiene datos del menú
     * @returns {Promise<Object>} - Datos del menú en formato original
     */
    async getMenuData() {
        const cacheKey = 'menu_data';
        const cached = this.getCached(cacheKey);
        
        if (cached) {
            SanbornsUtils.log('Menú obtenido desde cache', 'info');
            return cached;
        }

        try {
            const endpoint = this.config.endpoints[this.config.environment].menu;
            
            if (!endpoint) {
                throw new Error('Endpoint de menú no configurado');
            }

            SanbornsUtils.log(`Cargando menú desde: ${endpoint}`, 'info');
            
            const data = await this.request(endpoint);
            
            // Validar estructura básica
            if (!this.validateMenuData(data)) {
                throw new Error('Estructura de datos de menú inválida');
            }

            this.setCached(cacheKey, data);
            
            SanbornsUtils.log('Menú cargado exitosamente', 'info', {
                categorias: Object.keys(data).length,
                productos: this.countTotalProducts(data)
            });

            return data;
            
        } catch (error) {
            SanbornsUtils.log('Error al cargar menú', 'error', error);
            throw error;
        }
    },

    /* ==========================================================================
       Utilidades de Request
       ========================================================================== */

    /**
     * 🌐 Wrapper para fetch con configuración centralizada
     */
    async request(url, options = {}) {
        const config = {
            ...options,
            headers: {
                ...this.config.defaultHeaders,
                ...(options.headers || {})
            },
            signal: AbortSignal.timeout(this.config.timeout)
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            SanbornsUtils.log(`Request failed: ${error.message}`, 'error');
            throw error;
        }
    },

    /* ==========================================================================
       Cache Management
       ========================================================================== */

    /**
     * 📦 Obtiene datos del cache
     */
    getCached(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        this.cache.delete(key);
        return null;
    },

    /**
     * 💾 Guarda datos en cache
     */
    setCached(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    },

    /**
     * 🗑️ Limpia cache
     */
    clearCache() {
        this.cache.clear();
        SanbornsUtils.log('Cache limpiado', 'info');
    },

    /* ==========================================================================
       Validaciones
       ========================================================================== */

    /**
     * ✅ Valida estructura básica de datos del menú
     * Compatible con formato actual: {categoria: {sku: {orderPrductName, price, etc}}}
     */
    validateMenuData(data) {
        if (!data || typeof data !== 'object') {
            return false;
        }

        // Validar que tenga al menos una categoría
        const categories = Object.keys(data);
        if (categories.length === 0) {
            return false;
        }

        // Validar estructura de categorías
        for (const category of categories) {
            const products = data[category];
            if (!products || typeof products !== 'object') {
                return false;
            }

            // Validar que cada categoría tenga al menos un producto
            const skus = Object.keys(products);
            if (skus.length === 0) {
                continue; // Categoría vacía es válida
            }

            // Validar estructura de productos
            for (const sku of skus) {
                const product = products[sku];
                if (!product || typeof product !== 'object') {
                    return false;
                }

                // Validar campos mínimos requeridos
                if (!product.orderPrductName || typeof product.price !== 'number') {
                    return false;
                }
            }
        }

        return true;
    },

    /**
     * 🔢 Cuenta productos totales en el menú
     */
    countTotalProducts(data) {
        return Object.values(data).reduce((total, products) => {
            return total + Object.keys(products).length;
        }, 0);
    },

    /* ==========================================================================
       Configuración Dinámica
       ========================================================================== */

    /**
     * ⚙️ Configura entorno de trabajo
     */
    setEnvironment(env) {
        if (this.config.endpoints[env]) {
            this.config.environment = env;
            this.clearCache(); // Limpiar cache al cambiar entorno
            SanbornsUtils.log(`Entorno cambiado a: ${env}`, 'info');
        } else {
            throw new Error(`Entorno no válido: ${env}`);
        }
    },

    /**
     * 🔧 Configura endpoints personalizados
     */
    configureEndpoints(endpoints) {
        this.config.endpoints[this.config.environment] = {
            ...this.config.endpoints[this.config.environment],
            ...endpoints
        };
        SanbornsUtils.log('Endpoints actualizados', 'info', endpoints);
    },

    /* ==========================================================================
       Auto-detección de Entorno
       ========================================================================== */

    /**
     * 🔍 Detecta automáticamente el entorno según la URL
     */
    detectEnvironment() {
        const hostname = window.location.hostname;
        const protocol = window.location.protocol;
        
        // GitHub Pages detection
        if (hostname.includes('.github.io')) {
            this.setEnvironment('github_pages');
            SanbornsUtils.log('🌍 Entorno detectado: GitHub Pages', 'info');
            return 'github_pages';
        }
        
        // Local development
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            this.setEnvironment('mock');
            SanbornsUtils.log('💻 Entorno detectado: Desarrollo local', 'info');
            return 'mock';
        }
        
        // Production with HTTPS
        if (protocol === 'https:') {
            this.setEnvironment('production');
            SanbornsUtils.log('🚀 Entorno detectado: Producción', 'info');
            return 'production';
        }
        
        // Default to mock
        SanbornsUtils.log('❓ Entorno no detectado, usando mock', 'warn');
        return 'mock';
    },

    /**
     * 🔧 Configura endpoints personalizados
     */
    configureEndpoints(endpoints) {
        this.config.endpoints[this.config.environment] = {
            ...this.config.endpoints[this.config.environment],
            ...endpoints
        };
        SanbornsUtils.log('Endpoints actualizados', 'info', endpoints);
    },

    /* ==========================================================================
       Métodos Futuros (Preparados para API real)
       ========================================================================== */

    /**
     * 🛒 Guarda orden (preparado para API)
     */
    async saveOrder(orderData) {
        try {
            if (this.config.environment === 'mock') {
                // Simulación con localStorage
                const orders = JSON.parse(localStorage.getItem('sanborns_orders') || '[]');
                const order = {
                    id: Date.now().toString(),
                    timestamp: new Date().toISOString(),
                    mesa: orderData.mesa || '01',
                    ...orderData
                };
                orders.push(order);
                localStorage.setItem('sanborns_orders', JSON.stringify(orders));
                
                SanbornsUtils.log('Orden guardada localmente', 'info', order);
                return order;
            } else {
                // Production: endpoint real
                const endpoint = this.config.endpoints[this.config.environment].orders;
                return await this.request(endpoint, {
                    method: 'POST',
                    body: JSON.stringify(orderData)
                });
            }
        } catch (error) {
            SanbornsUtils.log('Error guardando orden', 'error', error);
            throw error;
        }
    }
};

// 🌟 Hacer disponible globalmente
window.DataService = DataService;

// 🔍 Auto-detectar entorno al cargar
document.addEventListener('DOMContentLoaded', () => {
    DataService.detectEnvironment();
});
