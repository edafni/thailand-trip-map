# Trip Planner

A multi-user, cloud-synced trip-planning web app — the productized version of the
personal [Thailand trip map](https://github.com/edafni/thailand-trip-map). Any
signed-in user can create and manage their **own** private trips: an interactive
map of saved places, hotels & bookings, weather, filters, and more.

Everything runs from a single self-contained `index.html` (Leaflet map + Firebase
for auth and per-user cloud storage). No build step.

## What makes this the "product" version

| | Personal app | This product |
|---|---|---|
| Trips | One hardcoded Thailand trip | Each user creates their own trips |
| Users | Anyone with the link edits the same data | Sign-in required; data private per account |
| Data path | `trips/thailand-2026/…` (public) | `users/{uid}/trips/{tripId}/…` (owner-only) |
| Plans | — | Free (1 trip) / Pro (unlimited) with a paywall |

## Feature highlights (inherited from the original app)

- 🗺️ Interactive map with saved places, category & location filters, "near me"
- 📍 Add places via Google Maps links (resolves short links & Plus Codes)
- 📑 Tabs: Map / Attractions / Bookings / Destinations / Info / About
- 🏨 Hotels & bookings with paid status and Waze navigation
- ⭐ Must-see stars, favorites, visited toggle
- 🌦️ Live weather forecasts · 🎨 dark/light themes · ⏱️ trip countdown

## Setup

This app needs a Firebase project. See **[MONETIZATION.md](./MONETIZATION.md)** for
the full, step-by-step setup including auth, security rules, and payments. In short:

1. Create a Firebase project and paste its config into `FIREBASE_CONFIG` in `index.html`.
2. Enable **Authentication → Google** sign-in.
3. Create a **Firestore** database and publish the rules from `firestore.rules`.
4. (To charge money) create a Stripe **Payment Link** and paste it into
   `STRIPE_PAYMENT_LINK` in `index.html`.

## Run locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Status

This is the **foundation** for a paid product: auth, per-user data isolation,
multiple trips, and paywall gating all work. The remaining productization steps
(per-trip itinerary content, secure server-side entitlement, full English UI) are
tracked in [MONETIZATION.md](./MONETIZATION.md).
