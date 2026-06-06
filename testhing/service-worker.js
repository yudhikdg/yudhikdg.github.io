// Nama cache untuk menyimpan data offline
const CACHE_NAME = 'yudhik-dg-pwa-v1';
const ASSETS_TO_CACHE = [
  '/testhing/',
  '/testhing/index.html',
  '/testhing/styles/bootstrap.css',
  '/testhing/scripts/custom.js',
  '/testhing/_manifest.json'
];

// Proses Install (Menyimpan file ke memori HP pengunjung)
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Proses Fetch (Memanggil file dari memori saat offline)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Proses Activate (Menghapus memori cache versi lama)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});