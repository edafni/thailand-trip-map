# מסלול תאילנד 2026 — Thailand Trip Map

An interactive, single-page (Hebrew / RTL) web app for planning a 2026 Thailand
trip. The whole app is one self-contained `index.html` using a Leaflet map and
Firebase for shared, real-time cloud sync.

## Features

- 🗺️ **Interactive map** of Thailand with saved places, category & location
  filters, "near me" and "⭐ must-see only" filters
- 📍 **Add places** via Google Maps links (resolves short links & Plus Codes),
  plus 60+ pre-loaded spots
- 📑 **Tabbed navigation:** Map / Attractions / Destinations / Info
- ☁️ **Firebase cloud sync** for shared editing, with a local-mode fallback when
  offline
- 🏨 **Hotels & bookings** — paid status, booking uploads, Waze navigation links
- ⭐ **Shared "must-see" stars** + favorites, and a visited toggle
- 🌦️ **Live weather** — forecast card in the Info tab and a 5-day forecast strip
  on each destination card
- 📸 **Instagram** attraction links
- 🎨 **Dark / light themes** with accent-tinted background and English (Latin)
  map labels
- ⏱️ **Trip countdown**, plus an Info tab with emergency numbers, currency & phrases
- 🔒 **Admin mode** with a type-to-confirm ("123") delete safeguard
- 🟢 **Header online / offline indicator**

## Getting started

Everything lives in a single file — no build step required.

```bash
# open directly in a browser
open index.html

# or serve locally
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Tech stack

- **Leaflet** — interactive map tiles & markers
- **Firebase / Firestore** — real-time shared editing and cloud sync
- **Vanilla HTML / CSS / JS** — no framework, no build tooling
