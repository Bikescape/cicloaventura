const BASE_URL = self.location.pathname.replace(/\/[^\/]*$/, '/'); // Detecta carpeta base

const CACHE_NAME = 'cicloaventura-v1';
const urlsToCache = [
  `${BASE_URL}index.html`,
  `${BASE_URL}admin.html`,
  `${BASE_URL}game.html`,
  `${BASE_URL}admin.js`,
  `${BASE_URL}game.js`,
  `${BASE_URL}admin.css`,
  `${BASE_URL}game.css`,
  `${BASE_URL}manifest.json`,
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm',
  'https://unpkg.com/leaflet/dist/leaflet.css',
  'https://unpkg.com/leaflet/dist/leaflet.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    }).catch(err => {
      console.error("🚨 Fallo en addAll:", err);
    })
  );
});


// Fetch from cache or network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
