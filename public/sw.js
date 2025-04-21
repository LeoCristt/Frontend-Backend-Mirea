const CACHE_NAME = 'notes-app-v1';
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/Home.module.css', 
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/screenshots/screenshot-wide.png',
  '/screenshots/screenshot-mobile.png',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});
