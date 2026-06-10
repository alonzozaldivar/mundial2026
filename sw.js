const CACHE_NAME = 'fifa-united-2026-v15';
const ASSETS = [
  './index.html',
  './manifest.json'
];

// Instalar el Service Worker y almacenar archivos base en caché
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activar y limpiar cachés antiguas
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estrategia de red: Intentar cargar de internet, si falla usar caché
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      if (cachedResponse) {
        fetch(e.request).then(networkResponse => {
          if (networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }
      return fetch(e.request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, responseToCache);
        });
        return networkResponse;
      }).catch(() => {});
    })
  );
});

// ESCUCHAR EVENTOS DE NOTIFICACIÓN DESDE LA APP
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'MOSTRAR_NOTIFICACION') {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: 'https://img.icons8.com/color/192/000000/trophy.png',
      vibrate: [200, 100, 200],
      badge: 'https://img.icons8.com/color/96/000000/trophy.png'
    });
  }
});
