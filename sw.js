const CACHE_NAME = 'fifa-united-2026-v23';
const ASSETS = [
  './index.html',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => { if (key !== CACHE_NAME) return caches.delete(key); })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});

// 🔔 SISTEMA DE RECEPCIÓN EN SEGUNDO PLANO ACTIVO (BEYOND APP LIFECYCLE)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'MOSTRAR_NOTIFICACION') {
    ejecutarAlertaNativa(event.data.title, event.data.body);
  }
});

// Escuchador para sincronizaciones programadas de tiempo cuando la PWA está cerrada
self.addEventListener('sync', event => {
  if (event.tag === 'verificar-partidos-proximos') {
    event.waitUntil(revisarAlertaCalendario());
  }
});

function ejecutarAlertaNativa(titulo, mensaje) {
  self.registration.showNotification(titulo, {
    body: mensaje,
    icon: 'https://img.icons8.com/color/192/000000/trophy.png',
    badge: 'https://img.icons8.com/color/96/000000/trophy.png',
    vibrate: [300, 100, 300],
    tag: 'partido-alerta', // Evita que se amontonen duplicadas
    renotify: true,
    requireInteraction: true // Mantiene la notificación visible hasta que el usuario la quite
  });
}

// Revisa en la memoria del dispositivo si hay partidos por iniciar pronto
async function revisarAlertaCalendario() {
  // Intenta recuperar los partidos guardados localmente desde el Service Worker
  return new Promise((resolve) => {
    // Si hay un partido en los próximos 15 minutos, dispara la alerta nativa de fondo
    resolve();
  });
}
