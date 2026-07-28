/* Thailand trip map — service worker.
   Purpose: make the Esri map tiles available offline. We ONLY intercept tile
   requests (server.arcgisonline.com). The app HTML/JS and Firestore are left
   untouched, so the app still updates normally (no stale-shell problem). */
const TILE_CACHE = 'thai-tiles-v1';
const TILE_HOST = 'server.arcgisonline.com';

self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });

self.addEventListener('fetch', event => {
  const url = event.request.url;
  if (event.request.method !== 'GET' || url.indexOf(TILE_HOST) === -1) return; // let everything else pass through
  event.respondWith((async () => {
    const cache = await caches.open(TILE_CACHE);
    const hit = await cache.match(event.request);
    if (hit) return hit;                       // offline-first for tiles
    try {
      const resp = await fetch(event.request);
      if (resp && (resp.ok || resp.type === 'opaque')) cache.put(event.request, resp.clone());
      return resp;
    } catch (err) {
      const any = await cache.match(event.request, { ignoreVary: true });
      if (any) return any;
      throw err;
    }
  })());
});
