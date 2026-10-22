// Service worker YUDHIK DG — cache cangkang aplikasi untuk mode offline.
// Sengaja TIDAK meng-cache thumbnail YouTube/gambar eksternal agar tetap ringan.
// Setiap ubah CSS/JS di masa depan: naikkan nomor CACHE_VERSION di bawah.

const CACHE_VERSION = 'yudhik-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/transparent/app.min.css',
  './assets/plugins/superbox/superbox.min.css',
  './assets/plugins/lity/dist/lity.min.css',
  './assets/js/app.min.js',
  './assets/js/theme/transparent.min.js',
  './assets/plugins/superbox/jquery.superbox.min.js',
  './assets/plugins/lity/dist/lity.min.js',
  './assets/js/demo/profile.demo.js',
  './assets/page/about.html',
  './assets/page/gallery.html',
  './assets/page/timeline.html',
  './app/icons/icon-192x192.png',
  './app/icons/icon-512x512.png'
];

// Pasang: simpan cangkang aplikasi
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      Promise.all(
        SHELL.map((url) =>
          fetch(url, { cache: 'reload' })
            .then((res) => (res.ok ? cache.put(url, res) : undefined))
            .catch(() => undefined)
        )
      )
    ).then(() => self.skipWaiting())
  );
});

// Aktifkan: buang cache versi lama
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Ambil: cache-first untuk same-origin GET, jaringan untuk sisanya
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // thumbnail YouTube dkk: langsung jaringan

  event.respondWith(
    caches.match(req, { ignoreSearch: false }).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy));
        }
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
