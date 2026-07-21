# Monetization — plan, what's built, and what's left

This repo turns the personal Thailand trip map into a **product other people can
pay for**. This document explains the business model, exactly what has been
implemented, what you must configure, and the honest gaps that remain before you
can safely charge money.

## The model

**Freemium SaaS.** Free users get 1 trip. Paying (Pro) users get unlimited trips
(and this is where you'd later add collaborators, offline export, etc.).

- Free plan → `FREE_TRIP_LIMIT` trips (default **1**)
- Pro plan → unlimited, unlocked by setting the user's `tier` to `"pro"`

Everything is keyed to a signed-in account, so each customer's data is private.

## What's already built (in `index.html`)

- **Authentication gate** — the app is hidden behind Google sign-in. Nobody sees
  or edits data without an account.
- **Per-user data isolation** — storage moved from one shared public document
  (`trips/thailand-2026/…`) to **owner-only** paths (`users/{uid}/trips/{tripId}/…`).
- **Multiple trips per user** — a trip picker to create, open, rename-by-creation,
  and delete trips; new trips can start blank or from a Thailand sample template.
- **Paywall** — free users who hit the trip limit see an upgrade panel with a
  Stripe button. Trip creation is blocked past the limit.
- **Security rules** — `firestore.rules` locks every user to their own data and
  prevents clients from self-granting `tier: "pro"`.

## What YOU must configure

1. **Firebase Auth** — Console → Authentication → Sign-in method → enable **Google**.
   Add your domain under Authentication → Settings → Authorized domains.
2. **Firestore rules** — Console → Firestore → Rules → paste `firestore.rules` → Publish.
3. **Stripe (to actually collect money)**
   - Create a Product + Price in Stripe, then a **Payment Link** for it.
   - Paste that URL into `STRIPE_PAYMENT_LINK` near the top of `index.html`.
   - This lets users *pay*. It does **not** yet auto-upgrade them (see gap #1).

## Honest gaps before this earns money safely

1. **Entitlement is not yet automatic.** After someone pays via the Payment Link,
   nothing flips their account to Pro. Two options:
   - **Manual (fine for first customers):** set `tier: "pro"` on their
     `users/{uid}` document in the Firebase console when payment comes in.
   - **Automated (do this before scaling):** add a Stripe **webhook** handled by a
     Firebase **Cloud Function** (Blaze plan) that uses the Admin SDK to set
     `tier: "pro"` on payment, and `"free"` on cancellation/refund. The security
     rules already forbid clients from setting `tier` themselves, so the webhook is
     the trusted path. This is the single most important next step.

2. **Itinerary content is still Thailand-shaped.** Places, bookings, and hotel
   paid-state are fully per-trip and private. The **create funnel** now also
   captures the itinerary skeleton — trip name, start/end dates, and destinations
   (each added by pasting a Google Maps link) — and the app renders regions, the
   location filter, the map destination pins, the date countdown, and the weather
   from that per-trip data. A user planning Japan no longer sees Thailand.
   Users can also add **dated stays (hotels)** inside a trip — an in-trip editor
   captures name, destination, exact location (paste a Maps link), check-in/out,
   and cost; stays sync live per-trip, show as cards + map pins, and are
   **auto-connected into a route** (a leg over ~300 km is drawn as a flight, else
   a drive). **Still to do here:** let users hand-pick each transport leg's type,
   and add standalone flights not tied to two stays.

3. **UI is Hebrew/RTL only.** A global paid product needs at least English. The
   sign-in gate is isolated, so this can be added incrementally.

4. **Abuse & cost controls.** Add Firebase App Check, rate limits, and storage caps
   before opening sign-ups widely (booking image uploads can grow storage costs).

## Suggested order of work

1. Configure Firebase Auth + publish security rules → **app is a real multi-user product.**
2. Add Stripe Payment Link + manual entitlement → **you can take money today.**
3. Add the Stripe webhook Cloud Function → **payments auto-upgrade accounts.**
4. Make the itinerary per-trip → **genuinely usable for any destination.**
5. Add English UI → **sell internationally.**

## Reality check

Steps 1–2 make it *possible* to charge. Whether it *earns* depends on demand —
validate that strangers want this (publish it, watch sign-ups) before investing in
steps 3–5.
