/* ==========================================================================
   Service Worker - Sanborns WebApp PWA
   Versión: 1.2.3-beta
   ========================================================================== */

const CACHE_NAME = 'sanborns-app-v1.3.0-beta';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/main.css',
  './assets/css/retro-animations.css',
  './assets/css/mobile-navbar.css',
  './assets/css/drawer-menu.css',
  './assets/js/app.js',
  './assets/js/cart.js',
  './assets/js/menu.js',
  './assets/js/utils.js',
  './assets/js/mobile-navbar.js',
  './assets/js/drawer-menu.js',
  './assets/js/constants.js',
  './assets/js/services/data-service.js',
  './mock.json',
  './db.json',
  './assets/images/sanbornsWhite.svg',
  './assets/images/menuIcon.svg',
  './assets/images/waiter.svg',
  './assets/images/check.svg',
  // Bootstrap y jQuery desde CDN se manejarán dinámicamente
];

/* ==========================================================================
   Evento: Install
   ========================================================================== */
self.addEventListener('install', function (event) {
  console.log('🔧 Service Worker: Instalando...');

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        console.log('📦 Service Worker: Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .then(function () {
        console.log('✅ Service Worker: Archivos cacheados');
        return self.skipWaiting();
      })
  );
});

/* ==========================================================================
   Evento: Activate
   ========================================================================== */
self.addEventListener('activate', function (event) {
  console.log('🚀 Service Worker: Activando...');

  event.waitUntil(
    caches
      .keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            if (cacheName !== CACHE_NAME) {
              console.log(
                '🗑️ Service Worker: Eliminando cache antiguo',
                cacheName
              );
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(function () {
        console.log('✅ Service Worker: Activado');
        return self.clients.claim();
      })
  );
});

/* ==========================================================================
   Evento: Fetch
   ========================================================================== */
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }

      return fetch(event.request).then(function (response) {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response para cache
        var responseToCache = response.clone();

        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

/* ==========================================================================
   Evento: Message
   ========================================================================== */
self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
