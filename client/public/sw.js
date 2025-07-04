// Movie Masala Service Worker
const CACHE_NAME = 'movie-masala-v10';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', function(event) {
  // Skip waiting to activate immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control immediately
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  // Only handle supported schemes (http/https) and skip browser extension requests
  if (!event.request.url.startsWith('http://') && 
      !event.request.url.startsWith('https://')) {
    return;
  }

  // Skip caching for extension requests or non-GET requests
  if (event.request.method !== 'GET' ||
      event.request.url.includes('chrome-extension') ||
      event.request.url.includes('moz-extension') ||
      event.request.url.includes('safari-extension')) {
    return;
  }

  event.respondWith(
    // For HTML requests, always try network first to get latest updates
    fetch(event.request).then(function(response) {
      // If network succeeds, update cache and return response
      if (response.status === 200) {
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(function(cache) {
          cache.put(event.request, responseClone);
        });
      }
      return response;
    }).catch(function() {
      // If network fails, fall back to cache
      return caches.match(event.request);
    })
  );
});