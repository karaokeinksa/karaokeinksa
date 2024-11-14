const cacheName = 'karaoke-inksa-v1';
const assetsToCache = [
  '/',
  '/index.html',

  '/images/192x192.png',
  '/images/512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assetsToCache).catch(error => {
        console.error('Erro ao adicionar ao cache:', error);
      });
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(error => {
        console.error('Erro ao buscar recurso:', error);
        // Retorne um recurso padrão ou responda com algo adequado.
        return caches.match('/offline.html'); // Ou retorne uma página offline padrão
      });
    })
  );
});
