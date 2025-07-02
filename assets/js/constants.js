/* ==========================================================================
   App Constants - Configuración Global Centralizada
   Variables globales para toda la aplicación CheckIt
   ========================================================================== */

const AppConstants = {
    
    /* ==========================================================================
       Información de la Aplicación
       ========================================================================== */
    APP: {
        NAME: "CheckIt",
        VERSION: "1.3.0-beta",
        DESCRIPTION: "Menú digital interactivo para restaurantes",
        AUTHOR: "CheckIt Team",
        COMMIT_DATE: new Date().toISOString().split('T')[0] // YYYY-MM-DD
    },
    
    /* ==========================================================================
       URLs y Endpoints
       ========================================================================== */
    API: {
        BASE_URL: "./",
        DB_JSON: "./db.json",
        MOCK_JSON: "./mock.json"
    },
    
    /* ==========================================================================
       Configuraciones por Defecto
       ========================================================================== */
    DEFAULTS: {
        MESA_NUMERO: 201,
        PERSONAS: 2,
        MESERO: "JOSE LUIS BAENA LOPEZ",
        SCROLL_THRESHOLD: 50,
        ANIMATION_MS: 300,
        NAVBAR_HEIGHT: 60,
        SANBORNS_RED: "#dc3545"
    },
    
    /* ==========================================================================
       LocalStorage Keys
       ========================================================================== */
    STORAGE: {
        CART: "sanborns-cart",
        VIEW_PREFERENCE: "sanborns-view-preference", 
        USER_PREFERENCES: "sanborns-user-preferences",
        LAST_VISIT: "sanborns-last-visit",
        SESSION: "sanborns-session",
        DRAWER_CATEGORY_SORT: "drawer-category-sort-order"
    },
    
    /* ==========================================================================
       Debug & Logging
       ========================================================================== */
    DEBUG: {
        ENABLED: true,
        PREFIX: "🏪 CheckIt:"
    }
};

// Export para uso global
window.AppConstants = AppConstants;

// Helper methods
AppConstants.getFullVersion = () => `${AppConstants.APP.NAME} v${AppConstants.APP.VERSION}`;
AppConstants.getBuildInfo = () => `${AppConstants.APP.VERSION} (${AppConstants.APP.COMMIT_DATE})`;

/* ==========================================================================
   Log inicial
   ========================================================================== */
console.log(`${AppConstants.DEBUG.PREFIX} Constants loaded - ${AppConstants.getFullVersion()}`);
