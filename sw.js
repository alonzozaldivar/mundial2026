// 📑 CACHÉ OFICIAL V30 - Sincronizado para limpiar errores de referencia previos
const CACHE_NAME = 'fifa-united-2026-v40';
const ASSETS = [
  './index.html',
  './manifest.json'
];

// Instalar el Service Worker y almacenar en caché los archivos esenciales
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('SW: Guardando archivos base en caché...');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activar el SW y purgar de forma estricta cualquier caché vieja de las pruebas de segundo plano
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('SW: Eliminando caché antigua obsoleta:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia Offline-First estándar: Servir desde la caché local para máxima velocidad
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      return cachedResponse || fetch(e.request);
    })
  );
});
