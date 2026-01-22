/* ==========================================================================
   Menu Manager - Gestión del menú con jQuery
   ========================================================================== */

const MenuManager = {
  /* ==========================================================================
       Estado del Menú
       ========================================================================== */
  menuData: {},
  filteredData: {},
  currentSearch: '',

  /* ==========================================================================
       Inicialización
       ========================================================================== */

  init() {
    this.loadMenuData();
    this.bindEvents();
    this.updateClearButton(); // Inicializar estado del botón
    SanbornsUtils.log('MenuManager inicializado');
  },

  /**
   * Carga datos del menú usando DataService
   */
  async loadMenuData() {
    try {
      SanbornsUtils.log('Cargando datos del menú...');

      // Usar DataService para obtener datos
      this.menuData = await DataService.getMenuData();
      this.filteredData = { ...this.menuData };

      this.renderMenu();
      SanbornsUtils.log('Menú cargado exitosamente', 'info', {
        categorias: Object.keys(this.menuData).length,
        productos: this.getTotalProducts(),
      });

      // Disparar evento para que otros componentes sepan que el menú está listo
      $(document).trigger('menu:loaded', this.menuData);
    } catch (error) {
      SanbornsUtils.log('Error cargando menú', 'error', error);
      SanbornsUtils.showToast('Error cargando el menú', 'error');
      this.showErrorState();
    }
  },

  /* ==========================================================================
       Event Handlers
       ========================================================================== */

  bindEvents() {
    // Búsqueda
    $('#search-input').on('input', e => {
      this.currentSearch = e.target.value.toLowerCase().trim();
      this.updateClearButton();
      this.filterMenu();
    });

    // Limpiar búsqueda al hacer clic en el icono
    $('.search-icon').on('click', () => {
      this.clearSearch();
    });

    // Botón limpiar búsqueda (X)
    $('#clear-search-btn').on('click', () => {
      this.clearSearch();
    });
  },

  /* ==========================================================================
       Renderizado del Menú
       ========================================================================== */

  /**
   * Renderiza todo el menú
   */
  renderMenu() {
    const $container = $('#menu-container');
    $container.empty();

    if (Object.keys(this.filteredData).length === 0) {
      this.showEmptyState();
      return;
    }

    Object.entries(this.filteredData).forEach(
      ([categoryName, products], index) => {
        // Solo mostrar categorías que tengan productos
        if (Object.keys(products).length > 0) {
          const categoryHtml = this.renderCategory(
            categoryName,
            products,
            index
          );
          $container.append(categoryHtml);
        }
      }
    );

    // Animar entrada de categorías
    $('.category-section').each((index, element) => {
      setTimeout(() => {
        $(element).addClass('animate-fadeInUp');
      }, index * 100);
    });

    // Bind eventos de productos después del render
    this.bindProductEvents();
  },

  /**
   * Renderiza una categoría
   * @param {string} categoryName - Nombre de la categoría
   * @param {Object} products - Productos de la categoría
   * @param {number} index - Índice de la categoría
   * @returns {string} - HTML de la categoría
   */
  renderCategory(categoryName, products, index) {
    const productCards = Object.entries(products)
      .map(([sku, product]) => this.renderProductCard(sku, product))
      .join('');

    return `
            <div class="category-section" data-category="${categoryName}">
                <h2 class="category-title">${categoryName}</h2>
                <div class="row">
                    ${productCards}
                </div>
            </div>
        `;
  },

  /**
   * Renderiza una tarjeta de producto
   * @param {string} sku - SKU del producto
   * @param {Object} product - Datos del producto
   * @returns {string} - HTML de la tarjeta
   */
  renderProductCard(sku, product) {
    const discountBadge = product.discount
      ? `<div class="discount-badge">-${product.discount}%</div>`
      : '';

    const originalPrice = product.discount
      ? `<span class="price-original">${SanbornsUtils.formatPrice(product.price)}</span>`
      : '';

    const currentPrice = product.discount
      ? SanbornsUtils.formatPrice(product.price * (1 - product.discount / 100))
      : SanbornsUtils.formatPrice(product.price);

    const imageUrl = product.image || 'assets/images/no-image.jpg';
    const description =
      SanbornsUtils.cleanText(product.description) ||
      'Sin descripción disponible';
    const productName =
      SanbornsUtils.cleanText(product.orderPrductName) || 'Producto sin nombre';

    return `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="product-card retro-hover" data-sku="${sku}">
                    ${discountBadge}
                    <div class="d-flex">
                        <div class="flex-shrink-0 p-3 product-card-image-container">
                            <img src="${imageUrl}" 
                                 alt="${productName}" 
                                 class="product-image"
                                 onerror="this.src='assets/images/no-image.jpg'">
                        </div>
                        <div class="product-info">
                            <h5 class="product-name">${productName}</h5>
                            <p class="product-description">${description}</p>
                            <div class="product-price">
                                <span class="price-current">${currentPrice}</span>
                                ${originalPrice}
                            </div>
                        </div>
                    </div>
                    <button class="add-to-cart-btn retro-button-hover" 
                            data-sku="${sku}"
                            title="Agregar al carrito">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        `;
  },

  /* ==========================================================================
       Event Handlers de Productos
       ========================================================================== */

  /**
   * Bind eventos de productos
   */
  bindProductEvents() {
    // Click en tarjeta de producto
    $('.product-card').on('click', e => {
      // Evitar que se abra el modal si se hace clic en el botón agregar
      if ($(e.target).closest('.add-to-cart-btn').length) return;

      const sku = $(e.currentTarget).data('sku');
      this.showProductModal(sku);
    });

    // Click en botón agregar al carrito
    $('.add-to-cart-btn').on('click', e => {
      e.stopPropagation();
      const sku = $(e.currentTarget).data('sku');
      this.quickAddToCart(sku);
    });
  },

  /**
   * Muestra modal de producto
   * @param {string} sku - SKU del producto
   */
  showProductModal(sku) {
    const product = this.findProductBySku(sku);
    if (!product) {
      SanbornsUtils.showToast('Producto no encontrado', 'error');
      return;
    }

    // Preparar datos del modal
    const modal = $('#productModal');
    const imageUrl = product.image || 'assets/images/no-image.jpg';
    const currentPrice = product.discount
      ? product.price * (1 - product.discount / 100)
      : product.price;

    // Llenar modal
    $('#productModalTitle').text(product.orderPrductName);
    $('#productModalImage')
      .attr('src', imageUrl)
      .attr('alt', product.orderPrductName);
    $('#productModalDescription').text(
      product.description || 'Sin descripción disponible'
    );
    $('#productPrice').text(currentPrice.toFixed(2));
    $('#productQuantity').val(1);

    // Actualizar precio inicial
    CartManager.updateModalPrice();

    // Guardar datos del producto en el modal
    modal.data('product', {
      sku: sku,
      orderPrductName: product.orderPrductName,
      description: product.description,
      price: currentPrice,
      image: product.image,
    });

    // Mostrar modal con animación
    modal.modal('show');
    modal.find('.modal-dialog').addClass('animate-zoomIn');
  },

  /**
   * Agregar rápidamente al carrito (sin modal)
   * @param {string} sku - SKU del producto
   */
  quickAddToCart(sku) {
    const product = this.findProductBySku(sku);
    if (!product) {
      SanbornsUtils.showToast('Producto no encontrado', 'error');
      return;
    }

    const currentPrice = product.discount
      ? product.price * (1 - product.discount / 100)
      : product.price;

    const productData = {
      sku: sku,
      orderPrductName: product.orderPrductName,
      description: product.description,
      price: currentPrice,
      image: product.image,
    };

    if (CartManager.addProduct(productData, 1)) {
      // Animar botón
      const $button = $(`.add-to-cart-btn[data-sku="${sku}"]`);
      SanbornsUtils.bounceButton($button);
    }
  },

  /* ==========================================================================
       Búsqueda y Filtrado
       ========================================================================== */

  /**
   * Filtra el menú según la búsqueda
   */
  filterMenu() {
    if (!this.currentSearch) {
      this.filteredData = { ...this.menuData };
    } else {
      this.filteredData = {};

      Object.entries(this.menuData).forEach(([categoryName, products]) => {
        const filteredProducts = {};

        // Filtrar por nombre de categoría
        const categoryMatches = categoryName
          .toLowerCase()
          .includes(this.currentSearch);

        Object.entries(products).forEach(([sku, product]) => {
          const productName = (product.orderPrductName || '').toLowerCase();
          const productDesc = (product.description || '').toLowerCase();

          // Incluir si coincide categoría, nombre o descripción
          if (
            categoryMatches ||
            productName.includes(this.currentSearch) ||
            productDesc.includes(this.currentSearch)
          ) {
            filteredProducts[sku] = product;
          }
        });

        if (Object.keys(filteredProducts).length > 0) {
          this.filteredData[categoryName] = filteredProducts;
        }
      });
    }

    this.renderMenu();

    // Mostrar resultado de búsqueda
    if (this.currentSearch) {
      const totalResults = this.getTotalProducts(this.filteredData);
      if (totalResults === 0) {
        SanbornsUtils.showToast(
          `No se encontraron productos para "${this.currentSearch}"`,
          'warning'
        );
      } else {
        SanbornsUtils.log(
          `Búsqueda: "${this.currentSearch}" - ${totalResults} resultados`
        );
      }
    }
  },

  /* ==========================================================================
       Estados Especiales
       ========================================================================== */

  /**
   * Muestra estado vacío
   */
  showEmptyState() {
    const $container = $('#menu-container');
    $container.html(`
            <div class="text-center py-5">
                <i class="fas fa-search text-muted" style="font-size: 4rem;"></i>
                <h4 class="mt-3 text-muted">No se encontraron productos</h4>
                <p class="text-muted">
                    ${
                      this.currentSearch
                        ? `Intenta con otra búsqueda diferente a "${this.currentSearch}"`
                        : 'No hay productos disponibles en este momento'
                    }
                </p>
                ${
                  this.currentSearch
                    ? '<button class="btn btn-outline-danger" onclick="MenuManager.clearSearch()">Limpiar Búsqueda</button>'
                    : ''
                }
            </div>
        `);
  },

  /**
   * Muestra estado de error
   */
  showErrorState() {
    const $container = $('#menu-container');
    $container.html(`
            <div class="text-center py-5">
                <i class="fas fa-exclamation-triangle text-warning" style="font-size: 4rem;"></i>
                <h4 class="mt-3 text-warning">Error al cargar el menú</h4>
                <p class="text-muted">
                    Hubo un problema cargando los productos. Por favor, intenta de nuevo.
                </p>
                <button class="btn btn-danger" onclick="MenuManager.loadMenuData()">
                    <i class="fas fa-sync-alt me-2"></i>Reintentar
                </button>
            </div>
        `);
  },

  /* ==========================================================================
       Utilidades
       ========================================================================== */

  /**
   * Busca producto por SKU
   * @param {string} sku - SKU a buscar
   * @returns {Object|null} - Producto encontrado o null
   */
  findProductBySku(sku) {
    for (const [categoryName, products] of Object.entries(this.menuData)) {
      if (products[sku]) {
        return products[sku];
      }
    }
    return null;
  },

  /**
   * Obtiene total de productos
   * @param {Object} data - Datos a contar (opcional, usa menuData por defecto)
   * @returns {number} - Total de productos
   */
  getTotalProducts(data = this.menuData) {
    return Object.values(data).reduce((total, products) => {
      return total + Object.keys(products).length;
    }, 0);
  },

  /**
   * Limpia la búsqueda
   */
  clearSearch() {
    $('#search-input').val('');
    this.currentSearch = '';
    this.updateClearButton();
    this.filterMenu();

    // Scroll suave al top
    this.scrollToTop();

    // SanbornsUtils.showToast('Búsqueda limpiada', 'info');
  },

  /**
   * Actualiza la visibilidad del botón limpiar
   */
  updateClearButton() {
    const $clearBtn = $('#clear-search-btn');
    const $searchInput = $('#search-input');

    if (this.currentSearch) {
      $clearBtn.removeClass('d-none');
      $searchInput.css('padding-right', '3rem'); // Espacio para el botón
    } else {
      $clearBtn.addClass('d-none');
      $searchInput.css('padding-right', '1rem'); // Padding normal
    }
  },

  /**
   * ⬆️ Scroll suave al top del contenido del menú
   */
  scrollToTop() {
    const $menuSection = $('#menu-section');
    if ($menuSection.length) {
      $menuSection[0].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    } else {
      // Fallback
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  },

  /**
   * Scroll a categoría específica
   * @param {string} categoryName - Nombre de la categoría
   */
  scrollToCategory(categoryName) {
    const $category = $(`.category-section[data-category="${categoryName}"]`);
    if ($category.length) {
      SanbornsUtils.scrollToElement($category, 100);
    }
  },
};

// Hacer disponible globalmente
window.MenuManager = MenuManager;
