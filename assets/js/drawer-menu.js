/* ==========================================================================
   Mobile Drawer Menu - Sistema de navegación lateral
   ========================================================================== */

const DrawerMenu = {
    
    /* ==========================================================================
       Configuración
       ========================================================================== */
    config: {
        selectors: {
            hamburgerBtn: '#hamburger-btn',
            drawer: '#mobile-drawer',
            drawerOverlay: '#drawer-overlay',
            drawerClose: '#drawer-close',
            drawerLinksContainer: '#drawer-menu-links'
        },
        classes: {
            open: 'open',
            loading: 'drawer-loading'
        },
        animations: {
            scrollBehavior: 'smooth',
            scrollOffset: -80 // Offset para compensar navbar fijo
        }
    },

    /* ==========================================================================
       Estado
       ========================================================================== */
    state: {
        isOpen: false,
        isLoading: false,
        categories: []
    },

    /* ==========================================================================
       Inicialización
       ========================================================================== */
    
    /**
     * 🚀 Inicializa el sistema de drawer menu
     */
    init() {
        SanbornsUtils.log('Inicializando DrawerMenu...', 'info');
        
        this.bindEvents();
        this.loadCategories();
    },

    /**
     * 🔗 Vincula eventos del drawer
     */
    bindEvents() {
        const { hamburgerBtn, drawer, drawerOverlay, drawerClose } = this.config.selectors;
        
        // Limpiar eventos previos para evitar duplicados
        $(hamburgerBtn).off('click.drawer');
        $(drawerClose).off('click.drawer');
        $(drawerOverlay).off('click.drawer');
        $(document).off('keydown.drawer');
        
        // Toggle drawer
        $(hamburgerBtn).on('click.drawer', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        });

        // Cerrar drawer
        $(drawerClose).on('click.drawer', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.close();
        });
        
        $(drawerOverlay).on('click.drawer', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.close();
        });

        // Cerrar con ESC
        $(document).on('keydown.drawer', (e) => {
            if (e.key === 'Escape' && this.state.isOpen) {
                e.preventDefault();
                this.close();
            }
        });

        // Prevenir propagación en contenido del drawer
        $('.drawer-content').off('click.drawer').on('click.drawer', (e) => {
            e.stopPropagation();
        });

        SanbornsUtils.log('Eventos del drawer vinculados', 'success');
    },

    /* ==========================================================================
       Control del Drawer
       ========================================================================== */

    /**
     * 🔄 Toggle del drawer
     */
    toggle() {
        SanbornsUtils.log(`Toggle drawer - Estado actual: ${this.state.isOpen ? 'abierto' : 'cerrado'}`, 'info');
        
        if (this.state.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    /**
     * 📖 Abre el drawer
     */
    open() {
        if (this.state.isOpen) {
            SanbornsUtils.log('Drawer ya está abierto', 'warning');
            return;
        }

        this.state.isOpen = true;
        const $drawer = $(this.config.selectors.drawer);
        
        $drawer.addClass(this.config.classes.open);
        
        // Prevenir scroll del body
        $('body').css('overflow', 'hidden');
        
        SanbornsUtils.log('Drawer abierto', 'info');
    },

    /**
     * 📕 Cierra el drawer
     */
    close() {
        if (!this.state.isOpen) {
            SanbornsUtils.log('Drawer ya está cerrado', 'warning');
            return;
        }

        this.state.isOpen = false;
        const $drawer = $(this.config.selectors.drawer);
        
        $drawer.removeClass(this.config.classes.open);
        
        // Restaurar scroll del body
        $('body').css('overflow', '');
        
        SanbornsUtils.log('Drawer cerrado', 'info');
    },

    /* ==========================================================================
       Gestión de Categorías
       ========================================================================== */

    /**
     * 📋 Carga las categorías del menú
     */
    async loadCategories() {
        if (this.state.isLoading) return;

        try {
            this.state.isLoading = true;
            this.showLoading();

            // Obtener datos del menú via DataService
            const menuData = await DataService.getMenuData();
            
            if (!menuData) {
                throw new Error('No se pudieron obtener datos del menú');
            }

            // Extraer categorías disponibles
            this.state.categories = this.extractCategories(menuData);
            
            if (!this.state.categories || this.state.categories.length === 0) {
                SanbornsUtils.log('No se encontraron categorías válidas', 'warning');
                this.showEmptyState();
                return;
            }
            
            // Renderizar links de categorías
            this.renderCategoryLinks();
            
            SanbornsUtils.log(`${this.state.categories.length} categorías cargadas en drawer`, 'success');

        } catch (error) {
            SanbornsUtils.log(`Error cargando categorías: ${error.message}`, 'error');
            this.showError();
        } finally {
            this.state.isLoading = false;
        }
    },

    /**
     * 🎯 Extrae categorías del objeto de menú
     */
    extractCategories(menuData) {
        const categories = [];
        
        try {
            if (!menuData || typeof menuData !== 'object') {
                SanbornsUtils.log('MenuData inválido para extraer categorías', 'warning');
                return [];
            }

            if (menuData.categories && Array.isArray(menuData.categories)) {
                // Si ya está en formato de array
                categories.push(...menuData.categories);
            } else if (typeof menuData === 'object') {
                // Si está en formato de objeto (como el mock.json)
                Object.keys(menuData).forEach(categoryKey => {
                    const category = menuData[categoryKey];
                    if (category && typeof category === 'object' && categoryKey.trim() !== '') {
                        categories.push({
                            id: categoryKey,
                            name: categoryKey,
                            icon: this.getCategoryIcon(categoryKey),
                            ...category
                        });
                    }
                });
            }

            SanbornsUtils.log(`Categorías extraídas: ${categories.length}`, 'info');
            return categories.filter(cat => cat.name && cat.name.trim() !== '');
            
        } catch (error) {
            SanbornsUtils.log(`Error extrayendo categorías: ${error.message}`, 'error');
            return [];
        }
    },

    /**
     * 🎨 Obtiene icono para categoría
     */
    getCategoryIcon(categoryName) {
        const iconMap = {
            'Hot cakes y waffles': 'fas fa-stroopwafel',
            'Jugos y frutas': 'fas fa-glass-whiskey',
            'Paquetes desayunos': 'fas fa-boxes',
            'Café y té': 'fas fa-coffee',
            'Especialidades de la casa': 'fas fa-star',
            'Postres': 'fas fa-ice-cream',
            'Ensaladas': 'fas fa-leaf',
            'Sopas': 'fas fa-bowl-hot',
            'Platos fuertes': 'fas fa-drumstick-bite',
            'Bebidas': 'fas fa-wine-glass',
            'Antojitos': 'fas fa-pepper-hot'
        };

        return iconMap[categoryName] || 'fas fa-utensils';
    },

    /* ==========================================================================
       Renderizado
       ========================================================================== */

    /**
     * 🎨 Renderiza los links de categorías
     */
    renderCategoryLinks() {
        const container = $(this.config.selectors.drawerLinksContainer);
        
        if (!this.state.categories.length) {
            container.html(`
                <div class="text-center p-4">
                    <i class="fas fa-exclamation-triangle text-warning mb-2" style="font-size: 24px;"></i>
                    <p class="text-muted mb-0">No hay categorías disponibles</p>
                </div>
            `);
            return;
        }

        const linksHtml = this.state.categories.map(category => `
            <a href="#" class="drawer-menu-link" data-category="${category.id || category.name}">
                <i class="${category.icon}"></i>
                <span class="drawer-menu-link-text">${category.name}</span>
                <i class="fas fa-chevron-right drawer-menu-link-arrow"></i>
            </a>
        `).join('');

        container.html(linksHtml);

        // Vincular eventos de click en links
        this.bindCategoryLinks();
    },

    /**
     * 🔗 Vincula eventos de los links de categorías
     */
    bindCategoryLinks() {
        // Limpiar eventos previos
        $('.drawer-menu-link').off('click.categoryLink');
        
        $('.drawer-menu-link').on('click.categoryLink', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const categoryName = $(e.currentTarget).data('category');
            this.navigateToCategory(categoryName);
        });
    },

    /**
     * 🧭 Navega a una categoría específica (usa search input)
     */
    navigateToCategory(categoryName) {
        SanbornsUtils.log(`Filtrando categoría vía search: ${categoryName}`, 'info');
        
        // Cerrar drawer primero
        this.close();

        // Esperar a que se cierre el drawer antes de aplicar filtro
        setTimeout(() => {
            this.applyCategoryToSearch(categoryName);
        }, 400); // Tiempo de la animación del drawer
    },

    /**
     * 🔍 Aplica filtro de categoría usando el search input existente
     */
    applyCategoryToSearch(categoryName) {
        const $searchInput = $('#search-input');
        
        if ($searchInput.length) {
            // Poner el nombre de la categoría en el search input
            $searchInput.val(categoryName);
            
            // Trigger el evento input para activar el filtro
            $searchInput.trigger('input');
            
            // Scroll al top
            this.scrollToTop();
            
            SanbornsUtils.log(`Búsqueda activada para: ${categoryName}`, 'success');
        } else {
            SanbornsUtils.log('Search input no encontrado, usando scroll fallback', 'warning');
            this.scrollToCategory(categoryName);
        }
    },

    /**
     * ⬆️ Scroll suave al top
     */
    scrollToTop() {
        const $menuSection = $('#menu-section');
        if ($menuSection.length) {
            $menuSection[0].scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        } else {
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
        }
    },

    /**
     * 📜 Hace scroll suave a la categoría
     */
    scrollToCategory(categoryName) {
        // Buscar el elemento de la categoría en el DOM
        const categoryElement = this.findCategoryElement(categoryName);
        
        if (categoryElement) {
            const elementTop = categoryElement.offsetTop + this.config.animations.scrollOffset;
            
            // Scroll suave como "porro smooth" 😎
            window.scrollTo({
                top: Math.max(0, elementTop),
                behavior: this.config.animations.scrollBehavior
            });
            
            // Efectito visual temporal
            this.highlightCategory(categoryElement);
            
            SanbornsUtils.log(`Scroll realizado a: ${categoryName}`, 'success');
        } else {
            SanbornsUtils.log(`No se encontró la sección: ${categoryName}`, 'warning');
            
            // Fallback: ir al top del contenido principal
            this.scrollToMainContent();
        }
    },

    /**
     * 🔍 Encuentra el elemento DOM de la categoría
     */
    findCategoryElement(categoryName) {
        // Estrategias de búsqueda por prioridad
        const selectors = [
            // Selector principal usado en menu.js
            `[data-category="${categoryName}"]`,
            // Variaciones de ID
            `#${categoryName.toLowerCase().replace(/\s+/g, '-')}`,
            `#category-${categoryName.toLowerCase().replace(/\s+/g, '-')}`,
            // Clases de categoría
            `.category-section:has(h2:contains("${categoryName}"))`,
            `.menu-category:has(h2:contains("${categoryName}"))`,
            // Headers directo
            `h2.category-title:contains("${categoryName}")`,
            `h2:contains("${categoryName}")`,
            `h3:contains("${categoryName}")`
        ];

        // Buscar por selectores
        for (const selector of selectors) {
            try {
                const element = document.querySelector(selector);
                if (element) {
                    // Si encontramos un h2, buscar su contenedor padre
                    return element.tagName.toLowerCase().startsWith('h') 
                        ? element.closest('.category-section') || element 
                        : element;
                }
            } catch (e) {
                // Continuar si el selector no es válido
                continue;
            }
        }

        // Búsqueda manual por texto contenido
        const categoryElements = document.querySelectorAll('.category-section, .menu-category');
        for (const element of categoryElements) {
            const titleElement = element.querySelector('h1, h2, h3, h4, h5, h6');
            if (titleElement && titleElement.textContent.trim().toLowerCase().includes(categoryName.toLowerCase())) {
                return element;
            }
        }

        // Última búsqueda: todos los headings
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        for (const heading of headings) {
            if (heading.textContent.trim().toLowerCase().includes(categoryName.toLowerCase())) {
                return heading.closest('.category-section') || heading;
            }
        }

        return null;
    },

    /**
     * ✨ Resalta visualmente la categoría
     */
    highlightCategory(element) {
        const $element = $(element);
        
        // Añadir clase de resaltado temporal
        $element.addClass('category-highlight');
        
        setTimeout(() => {
            $element.removeClass('category-highlight');
        }, 2000);
    },

    /**
     * 🏠 Scroll al contenido principal como fallback
     */
    scrollToMainContent() {
        const mainContent = document.querySelector('main, .main-content, #main-content, .container-fluid');
        if (mainContent) {
            mainContent.scrollIntoView({ 
                behavior: this.config.animations.scrollBehavior,
                block: 'start'
            });
        }
    },

    /* ==========================================================================
       Estados de UI
       ========================================================================== */

    /**
     * 📭 Muestra estado vacío
     */
    showEmptyState() {
        const container = $(this.config.selectors.drawerLinksContainer);
        container.html(`
            <div class="text-center p-4">
                <i class="fas fa-utensils text-muted mb-2" style="font-size: 24px;"></i>
                <p class="text-muted mb-0">No hay categorías disponibles en este momento</p>
            </div>
        `);
    },

    /**
     * ⏳ Muestra estado de carga
     */
    showLoading() {
        const container = $(this.config.selectors.drawerLinksContainer);
        container.html(`
            <div class="drawer-loading">
                <div class="spinner-border spinner-border-sm" role="status">
                    <span class="visually-hidden">Cargando categorías...</span>
                </div>
                <p class="text-muted mt-2 mb-0">Cargando categorías...</p>
            </div>
        `);
    },

    /**
     * ❌ Muestra estado de error
     */
    showError() {
        const container = $(this.config.selectors.drawerLinksContainer);
        container.html(`
            <div class="text-center p-4">
                <i class="fas fa-exclamation-triangle text-danger mb-2" style="font-size: 24px;"></i>
                <p class="text-muted mb-2">Error cargando categorías</p>
                <button class="btn btn-sm btn-outline-primary" onclick="DrawerMenu.loadCategories()">
                    <i class="fas fa-redo me-1"></i>Reintentar
                </button>
            </div>
        `);
    },

    /* ==========================================================================
       Limpieza y Mantenimiento
       ========================================================================== */

    /**
     * 🧹 Limpia eventos y estado
     */
    cleanup() {
        // Limpiar eventos con namespaces
        const { hamburgerBtn, drawerClose, drawerOverlay } = this.config.selectors;
        
        $(hamburgerBtn).off('.drawer');
        $(drawerClose).off('.drawer');
        $(drawerOverlay).off('.drawer');
        $(document).off('.drawer');
        $('.drawer-content').off('.drawer');
        $('.drawer-menu-link').off('.categoryLink');
        
        // Resetear estado
        this.state.isOpen = false;
        this.state.isLoading = false;
        
        // Restaurar scroll
        $('body').css('overflow', '');
        
        SanbornsUtils.log('DrawerMenu limpiado', 'info');
    },

    /**
     * 🔄 Reinicializa el drawer
     */
    reinit() {
        this.cleanup();
        this.init();
    },

    /* ==========================================================================
       Utilidades
       ========================================================================== */

    /**
     * 🔄 Recargar categorías
     */
    reload() {
        this.state.categories = [];
        this.loadCategories();
    },

    /**
     * 📊 Obtener estadísticas
     */
    getStats() {
        return {
            isOpen: this.state.isOpen,
            categoriesCount: this.state.categories.length,
            isLoading: this.state.isLoading
        };
    }
};

/* ==========================================================================
   Auto-inicialización
   ========================================================================== */

// Inicializar cuando el DOM esté listo (solo una vez)
$(document).ready(() => {
    // Evitar múltiples inicializaciones
    if (!window.DrawerMenu._initialized) {
        DrawerMenu.init();
        window.DrawerMenu._initialized = true;
    }
});

// Exportar para uso global
window.DrawerMenu = DrawerMenu;
