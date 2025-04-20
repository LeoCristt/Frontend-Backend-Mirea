self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll([
        "/",
        "/manifest.json",
        "/icons/icon-192.png",
        "/icons/icon-512.png",
        "/screenshots/screenshot-wide.png",
        "/screenshots/screenshot-mobile.png",
        "/favicon.ico"
      ]);
    })
  );
});

  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });