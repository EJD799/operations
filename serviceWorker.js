const CACHE_NAME = 'operations_cache_v1';
const urlsToCache = [
  "/operations/",
  "/operations/backspace_icon.svg",
  "/operations/bulma.min.css",
  "/operations/chart.js",
  "/operations/checkmark_icon.svg",
  "/operations/dailyrandom.js",
  "/operations/game.js",
  "/operations/icon.png",
  "/operations/index.html",
  "/operations/manifest.json",
  "/operations/reload_icon.svg",
  "/operations/serviceWorker.js",
  "/operations/settings_icon.svg",
  "/operations/share_icon.svg",
  "/operations/stats_icon.svg"
];

// Install event: Caching static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event: Cleaning up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: Intercepting network requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No cache hit - fetch from network
        return fetch(event.request)
          .then((networkResponse) => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            // Clone the response as it can only be consumed once
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            return networkResponse;
          })
          .catch(() => {
            // Handle offline fallback for specific routes if needed
            // e.g., return an offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html'); // Assuming you have an offline.html
            }
          });
      })
  );
});
