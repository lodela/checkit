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
      drawerLinksContainer: '#drawer-menu-links',
      categoryFilterInput: '#category-filter-input',
      categoryFilterClear: '#category-filter-clear',
      categorySortBtn: '#category-sort-btn',
      resetBtn: '#reset-btn',
      appVersionText: '#app-version-text',
    },
    classes: {
      open: 'open',
      loading: 'drawer-loading',
      sortDesc: 'desc',
    },
    animations: {
      scrollBehavior: 'smooth',
      scrollOffset: -80, // Offset para compensar navbar fijo
    },
    storage: {
      sortOrder: 'drawer-category-sort-order',
    },
  },

  /* ==========================================================================
       Estado
       ========================================================================== */
  state: {
    isOpen: false,
    isLoading: false,
    categories: [],
    filteredCategories: [],
    filterText: '',
    sortOrder: 'asc', // 'asc' o 'desc'
  },

  /* ==========================================================================
       Inicialización
       ========================================================================== */

  /**
   * 🚀 Inicializa el sistema de drawer menu
   */
  init() {
    SanbornsUtils.log('Inicializando DrawerMenu...', 'info');

    this.loadSortOrder();
    this.bindEvents();
    this.bindCategoryLinks(); // Configurar delegación de eventos una sola vez

    // Escuchar cuando MenuManager cargue los datos
    $(document).on('menu:loaded', () => {
      this.loadCategoriesFromMenuManager();
    });

    // Si MenuManager ya tiene datos, cargarlos inmediatamente
    if (window.MenuManager && window.MenuManager.menuData) {
      this.loadCategoriesFromMenuManager();
    }
  },

  /**
   * 🔗 Vincula eventos del drawer
   */
  bindEvents() {
    const {
      hamburgerBtn,
      drawer,
      drawerOverlay,
      drawerClose,
      categoryFilterInput,
      categoryFilterClear,
      categorySortBtn,
      resetBtn,
      appVersionText,
    } = this.config.selectors;

    // Limpiar eventos previos para evitar duplicados
    $(hamburgerBtn).off('click.drawer');
    $(drawerClose).off('click.drawer');
    $(drawerOverlay).off('click.drawer');
    $(document).off('keydown.drawer');
    $(categoryFilterInput).off('input.drawer keyup.drawer');
    $(categoryFilterClear).off('click.drawer');
    $(categorySortBtn).off('click.drawer');
    $(resetBtn).off('click.drawer');

    // Toggle drawer
    $(hamburgerBtn).on('click.drawer', e => {
      e.preventDefault();
      e.stopPropagation();
      this.toggle();
    });

    // Cerrar drawer
    $(drawerClose).on('click.drawer', e => {
      e.preventDefault();
      e.stopPropagation();
      this.close();
    });

    $(drawerOverlay).on('click.drawer', e => {
      e.preventDefault();
      e.stopPropagation();
      this.close();
    });

    // Cerrar con ESC
    $(document).on('keydown.drawer', e => {
      if (e.key === 'Escape' && this.state.isOpen) {
        e.preventDefault();
        this.close();
      }
    });

    // Filtro de categorías
    $(categoryFilterInput).on('input.drawer keyup.drawer', e => {
      this.handleFilterInput(e);
    });

    // Limpiar filtro
    $(categoryFilterClear).on('click.drawer', e => {
      e.preventDefault();
      this.clearFilter();
    });

    // Sorting de categorías
    $(categorySortBtn).on('click.drawer', e => {
      e.preventDefault();
      this.toggleSort();
    });

    // Reset button - Limpiar filtros y resetear estado
    $(resetBtn).on('click.drawer', e => {
      e.preventDefault();
      this.resetAll();
    });

    // Inicializar versión de la app
    this.updateAppVersion(appVersionText);

    // Prevenir propagación en contenido del drawer
    $('.drawer-content')
      .off('click.drawer')
      .on('click.drawer', e => {
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
    SanbornsUtils.log(
      `Toggle drawer - Estado actual: ${this.state.isOpen ? 'abierto' : 'cerrado'}`,
      'info'
    );

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

    // Resetear filtros y scroll
    this.resetFiltersOnOpen();

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
      // No mostrar loading, solo cambiar estado

      // Obtener datos del menú via DataService
      const menuData = await DataService.getMenuData();

      SanbornsUtils.log('Datos del menú obtenidos:', 'debug', menuData);

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

      // Inicializar filtrado con todas las categorías
      this.filterAndRenderCategories();

      SanbornsUtils.log(
        `${this.state.categories.length} categorías cargadas en drawer`,
        'success'
      );
    } catch (error) {
      SanbornsUtils.log(
        `Error cargando categorías: ${error.message}`,
        'error',
        error
      );
      this.showEmptyState('Error al cargar categorías');
    } finally {
      this.state.isLoading = false;
    }
  },

  /**
   * 🎯 Extrae categorías del objeto de menú
   */
  extractCategories(menuData) {
    try {
      if (!menuData || typeof menuData !== 'object') {
        SanbornsUtils.log(
          'MenuData inválido para extraer categorías',
          'warning'
        );
        return [];
      }

      SanbornsUtils.log('Tipo de menuData:', 'debug', typeof menuData);
      SanbornsUtils.log('Keys de menuData:', 'debug', Object.keys(menuData));

      const categories = [];

      if (menuData.categories && Array.isArray(menuData.categories)) {
        // Si ya está en formato de array
        categories.push(...menuData.categories);
      } else if (typeof menuData === 'object') {
        // Si está en formato de objeto (como el mock.json)
        Object.keys(menuData).forEach(categoryKey => {
          const category = menuData[categoryKey];
          if (
            category &&
            typeof category === 'object' &&
            categoryKey.trim() !== ''
          ) {
            categories.push(categoryKey); // Solo el nombre como string
          }
        });
      }

      SanbornsUtils.log(
        `Categorías extraídas: ${categories.length}`,
        'info',
        categories.slice(0, 5)
      );
      return categories.filter(cat => cat && cat.trim() !== '');
    } catch (error) {
      SanbornsUtils.log(
        `Error extrayendo categorías: ${error.message}`,
        'error',
        error
      );
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
      Postres: 'fas fa-ice-cream',
      Ensaladas: 'fas fa-leaf',
      Sopas: 'fas fa-bowl-hot',
      'Platos fuertes': 'fas fa-drumstick-bite',
      Bebidas: 'fas fa-wine-glass',
      Antojitos: 'fas fa-pepper-hot',
    };

    return iconMap[categoryName] || 'fas fa-utensils';
  },

  /* ==========================================================================
       Renderizado
       ========================================================================== */

  /**
   * 🎨 Renderiza los links de categorías
   */
  renderCategoryLinks(categories = null) {
    const container = $(this.config.selectors.drawerLinksContainer);
    const categoriesToRender = categories || this.state.categories;

    if (!categoriesToRender.length) {
      const message = this.state.filterText
        ? 'No se encontraron categorías'
        : 'No hay categorías disponibles';

      container.html(`
                <div class="text-center p-4">
                    <i class="fas fa-${this.state.filterText ? 'search' : 'exclamation-triangle'} text-warning mb-2" style="font-size: 24px;"></i>
                    <p class="text-muted mb-0">${message}</p>
                    ${this.state.filterText ? '<small class="text-muted">Intenta con otro término</small>' : ''}
                </div>
            `);
      return;
    }

    const linksHtml = categoriesToRender
      .map(category => {
        // Si las categorías son strings simples, crear objeto temporal
        const categoryName =
          typeof category === 'string' ? category : category.name;
        const categoryIcon = this.getCategoryIcon(categoryName);

        return `
                <a href="#" class="drawer-menu-link" data-category="${categoryName}">
                    <i class="${categoryIcon}"></i>
                    <span class="drawer-menu-link-text">${categoryName}</span>
                    <i class="fas fa-chevron-right drawer-menu-link-arrow"></i>
                </a>
            `;
      })
      .join('');

    container.html(linksHtml);

    // Ya no necesitamos bindCategoryLinks() aquí porque usamos delegación de eventos
  },

  /**
   * 🔗 Vincula eventos de los links de categorías
   */
  bindCategoryLinks() {
    // Usar delegación de eventos para que funcione con contenido dinámico
    const container = $(this.config.selectors.drawerLinksContainer);

    // Limpiar eventos previos del contenedor
    container.off('click.categoryLink');

    // Usar delegación para que funcione con elementos creados dinámicamente
    container.on('click.categoryLink', '.drawer-menu-link', e => {
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
    SanbornsUtils.log(
      `Filtrando categoría vía search: ${categoryName}`,
      'info'
    );

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

      // Scroll suave al menú con offset de 10px
      this.smoothScrollToMenu();

      SanbornsUtils.log(`Búsqueda activada para: ${categoryName}`, 'success');
    } else {
      SanbornsUtils.log(
        'Search input no encontrado, usando scroll fallback',
        'warning'
      );
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
        block: 'start',
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
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
      const elementTop =
        categoryElement.offsetTop + this.config.animations.scrollOffset;

      // Scroll suave como "porro smooth" 😎
      window.scrollTo({
        top: Math.max(0, elementTop),
        behavior: this.config.animations.scrollBehavior,
      });

      // Efectito visual temporal
      this.highlightCategory(categoryElement);

      SanbornsUtils.log(`Scroll realizado a: ${categoryName}`, 'success');
    } else {
      SanbornsUtils.log(
        `No se encontró la sección: ${categoryName}`,
        'warning'
      );

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
      `h3:contains("${categoryName}")`,
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
    const categoryElements = document.querySelectorAll(
      '.category-section, .menu-category'
    );
    for (const element of categoryElements) {
      const titleElement = element.querySelector('h1, h2, h3, h4, h5, h6');
      if (
        titleElement &&
        titleElement.textContent
          .trim()
          .toLowerCase()
          .includes(categoryName.toLowerCase())
      ) {
        return element;
      }
    }

    // Última búsqueda: todos los headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    for (const heading of headings) {
      if (
        heading.textContent
          .trim()
          .toLowerCase()
          .includes(categoryName.toLowerCase())
      ) {
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
    const mainContent = document.querySelector(
      'main, .main-content, #main-content, .container-fluid'
    );
    if (mainContent) {
      mainContent.scrollIntoView({
        behavior: this.config.animations.scrollBehavior,
        block: 'start',
      });
    }
  },

  /* ==========================================================================
       Filtro y Sorting de Categorías
       ========================================================================== */

  /**
   * 📂 Cargar orden de sorting desde localStorage
   */
  loadSortOrder() {
    const saved = localStorage.getItem(this.config.storage.sortOrder);
    this.state.sortOrder = saved || 'asc';
    this.updateSortButton();
  },

  /**
   * 💾 Guardar orden de sorting en localStorage
   */
  saveSortOrder() {
    localStorage.setItem(this.config.storage.sortOrder, this.state.sortOrder);
  },

  /**
   * 🔍 Manejar input del filtro
   */
  handleFilterInput(e) {
    const input = e.target.value.toLowerCase().trim();
    this.state.filterText = input;

    // Mostrar/ocultar botón de limpiar
    const clearBtn = $(this.config.selectors.categoryFilterClear);
    if (input) {
      clearBtn.removeClass('d-none');
    } else {
      clearBtn.addClass('d-none');
    }

    this.filterAndRenderCategories();

    SanbornsUtils.log(`Filtrando categorías: "${input}"`, 'info');
  },

  /**
   * 🧹 Limpiar filtro
   */
  clearFilter() {
    $(this.config.selectors.categoryFilterInput).val('');
    $(this.config.selectors.categoryFilterClear).addClass('d-none');
    this.state.filterText = '';
    this.filterAndRenderCategories();

    SanbornsUtils.log('Filtro de categorías limpiado', 'info');
  },

  /**
   * ↕️ Toggle sorting order
   */
  toggleSort() {
    this.state.sortOrder = this.state.sortOrder === 'asc' ? 'desc' : 'asc';
    this.updateSortButton();
    this.saveSortOrder();
    this.filterAndRenderCategories();

    SanbornsUtils.log(
      `Orden de categorías cambiado a: ${this.state.sortOrder}`,
      'info'
    );
  },

  /**
   * 🎨 Actualizar botón de sorting
   */
  updateSortButton() {
    const btn = $(this.config.selectors.categorySortBtn);
    const icon = btn.find('i');

    if (this.state.sortOrder === 'desc') {
      btn.addClass(this.config.classes.sortDesc);
      icon.removeClass('fa-sort-alpha-up').addClass('fa-sort-alpha-down');
      btn.attr('title', 'Ordenar Z → A');
    } else {
      btn.removeClass(this.config.classes.sortDesc);
      icon.removeClass('fa-sort-alpha-down').addClass('fa-sort-alpha-up');
      btn.attr('title', 'Ordenar A → Z');
    }
  },

  /**
   * 🔄 Filtrar y renderizar categorías
   */
  filterAndRenderCategories() {
    // Filtrar categorías
    let filtered = this.state.categories;

    if (this.state.filterText) {
      filtered = this.state.categories.filter(category =>
        category.toLowerCase().includes(this.state.filterText)
      );
    }

    // Ordenar categorías
    filtered.sort((a, b) => {
      if (this.state.sortOrder === 'asc') {
        return a.localeCompare(b, 'es', { sensitivity: 'base' });
      } else {
        return b.localeCompare(a, 'es', { sensitivity: 'base' });
      }
    });

    this.state.filteredCategories = filtered;
    this.renderCategoryLinks(filtered);

    SanbornsUtils.log(
      `Categorías filtradas: ${filtered.length}/${this.state.categories.length}`,
      'info'
    );
  },

  /**
   * 🔄 Resetear filtros y scroll al abrir drawer
   */
  resetFiltersOnOpen() {
    // Limpiar filtro de categorías
    this.clearFilter();

    // Scroll del drawer a top
    const drawerBody = $(this.config.selectors.drawer).find('.drawer-body');
    drawerBody.scrollTop(0);

    // Scroll del menu principal a top
    $('html, body').animate({ scrollTop: 0 }, 300);

    SanbornsUtils.log('Filtros y scroll reseteados al abrir drawer', 'info');
  },

  /**
   * 📜 Scroll suave al seleccionar categoría
   */
  smoothScrollToMenu() {
    const offset = 10; // 10px antes del top como solicitado
    $('html, body').animate(
      {
        scrollTop: offset,
      },
      400
    );

    SanbornsUtils.log('Scroll suave al menú ejecutado', 'info');
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
      isLoading: this.state.isLoading,
    };
  },

  /**
   * 📋 Mostrar estado vacío o de error
   */
  showEmptyState(message = 'No hay categorías disponibles') {
    const container = $(this.config.selectors.drawerLinksContainer);
    container.html(`
            <div class="text-center p-4">
                <i class="fas fa-exclamation-triangle text-warning mb-2" style="font-size: 24px;"></i>
                <p class="text-muted mb-0">${message}</p>
            </div>
        `);
  },

  /**
   * 🔄 Cargar categorías desde MenuManager (más eficiente)
   */
  loadCategoriesFromMenuManager() {
    try {
      if (!window.MenuManager || !window.MenuManager.menuData) {
        SanbornsUtils.log('MenuManager no disponible aún', 'warning');
        return;
      }

      // Extraer categorías desde MenuManager
      const menuData = window.MenuManager.menuData;
      this.state.categories = Object.keys(menuData).filter(
        key =>
          key &&
          key.trim() !== '' &&
          menuData[key] &&
          typeof menuData[key] === 'object'
      );

      SanbornsUtils.log(
        `${this.state.categories.length} categorías cargadas desde MenuManager`,
        'success'
      );

      // Inicializar filtrado con todas las categorías
      this.filterAndRenderCategories();
    } catch (error) {
      SanbornsUtils.log(
        `Error cargando categorías desde MenuManager: ${error.message}`,
        'error',
        error
      );
      this.showEmptyState('Error al cargar categorías');
    }
  },

  /* ==========================================================================
       Utilidades del Footer
       ========================================================================== */

  /**
   * 🔄 Resetea todos los filtros y estado del drawer
   */
  resetAll() {
    try {
      // Limpiar filtro de texto
      this.clearFilter();

      // Resetear order ASC
      this.state.sortOrder = 'asc';
      this.saveSortOrder();
      this.updateSortButton();

      // Limpiar filtro del menú principal si existe
      if (
        window.MenuManager &&
        typeof window.MenuManager.clearSearch === 'function'
      ) {
        window.MenuManager.clearSearch();
      }

      // Re-renderizar categorías
      this.filterAndRenderCategories();

      SanbornsUtils.log('Drawer reseteado correctamente', 'success');

      // Mostrar feedback visual
      const resetBtn = $(this.config.selectors.resetBtn);
      const originalText = resetBtn.html();
      resetBtn
        .html('<i class="fas fa-check"></i> Listo')
        .prop('disabled', true);

      setTimeout(() => {
        resetBtn.html(originalText).prop('disabled', false);
      }, 1000);
    } catch (error) {
      SanbornsUtils.log(
        `Error al resetear drawer: ${error.message}`,
        'error',
        error
      );
    }
  },

  /**
   * 📱 Actualiza la versión de la app en el footer
   */
  updateAppVersion(selector) {
    try {
      const version = window.AppConstants?.APP?.VERSION || 'v1.3.0-beta';
      $(selector).text(version);
      SanbornsUtils.log(`Versión actualizada: ${version}`, 'success');
    } catch (error) {
      SanbornsUtils.log(
        `Error actualizando versión: ${error.message}`,
        'error',
        error
      );
    }
  },
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
