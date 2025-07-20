const CACHE_NAME = 'ciclovolt-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/admin.html',
  '/game.html',
  '/admin.css',
  '/admin.js',
  '/game.css',
  '/game.js',
  '/manifest.json',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png'
];

// Install SW
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch from cache or network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
