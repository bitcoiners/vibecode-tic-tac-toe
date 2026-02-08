// public/service-worker.js
// PWA Service Worker: Offline support and asset caching

const CACHE_VERSION = 'v1';
const CACHE_NAME = `tic-tac-toe-${CACHE_VERSION}`;

// Assets to cache on install
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/gameEngine.js',
  '/src/client/gameClient.js',
  '/src/gameSync.js',
  '/src/client/gameLobby.js',
];

// ═══════════════════════════════════════════════════════════
// INSTALL: Cache assets for offline use
// ═══════════════════════════════════════════════════════════
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching assets for offline support');
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        // Some assets might not exist; continue anyway
        console.warn('[SW] Some assets failed to cache:', err);
      });
    })
  );
});

// ═══════════════════════════════════════════════════════════
// ACTIVATE: Clean up old cache versions
// ═══════════════════════════════════════════════════════════
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// ═══════════════════════════════════════════════════════════
// FETCH: Network-first strategy for real-time, cache fallback
// ═══════════════════════════════════════════════════════════
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Strategy 1: Network-first for API calls (WebSocket fallback)
  if (url.pathname.startsWith('/socket.io')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Don't cache streaming responses
          return response;
        })
        .catch(() => {
          // Network unavailable; return offline placeholder
          return new Response(
            JSON.stringify({ error: 'Offline - waiting for connection' }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/json' },
            }
          );
        })
    );
    return;
  }

  // Strategy 2: Stale-while-revalidate for dynamic content
  if (request.method === 'GET' && !url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((response) => {
          // Update cache with fresh response
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        });

        // Return cached response immediately, fetch in background
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Strategy 3: Default network-first for everything else
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200 && request.method === 'GET') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed; try cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // No cache and no network; return offline page
          if (request.destination === 'document') {
            return caches.match('/index.html');
          }
          return new Response('Offline - resource not available', {
            status: 503,
            statusText: 'Service Unavailable',
          });
        });
      })
  );
});

// ═══════════════════════════════════════════════════════════
// MESSAGE: Handle post messages from client
// ═══════════════════════════════════════════════════════════
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
