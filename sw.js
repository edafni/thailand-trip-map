/* Service worker for מסלול תאילנד 2026 — offline app shell + map tiles.
   Trip data itself is already stored in localStorage, so it's available
   offline; live Firestore calls are left to the network (never cached). */
const CACHE = 'thai-trip-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Let live Firestore/Firebase data go straight to the network (don't cache).
  if (/firestore|firebaseio|firebase-settings|googleapis\.com/.test(url.host + url.pathname)) return;

  // HTML: network-first so updates land, fall back to cache when offline.
  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith(
      fetch(req)
        .then((r) => { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); return r; })
        .catch(() => caches.match(req).then((m) => m || caches.match('./index.html')))
    );
    return;
  }

  // Everything else (map tiles, CDN scripts, icons): cache-first, then network (and cache it).
  e.respondWith(
    caches.match(req).then((m) =>
      m || fetch(req).then((r) => {
        if (r && r.status === 200) { const cp = r.clone(); caches.open(CACHE).then((c) => c.put(req, cp)); }
        return r;
      }).catch(() => m)
    )
  );
});
