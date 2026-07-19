# Changelog

Notable changes to BrownieBíró, newest first. Dates in Europe/Budapest.

## 2026-07-19 — Cleanup refactor (no behavior change)

Code-review pass to keep the codebase from drifting into spaghetti:
- Renamed `components/desktop/` → `components/app/` and `DesktopApp` → `AppShell`
  (the folder handled mobile too, so the name lied).
- Split `Leaderboard` and `ProfileView` out of the 400-line shell into their own files.
- Extracted a single `components/ui/Modal` primitive; `RestaurantDetail` and
  `SubmitReview` now share it instead of each re-implementing the overlay (the exact
  duplication behind the earlier off-screen-modal bug).
- Deleted dead code: `lib/supabase/client.ts` shim, `scoreClass()`/`ScoreClass`,
  `.bb-photo-ph` CSS.
- Hardened: review photo extension now derives from MIME type, not the filename;
  `ProfileView` stats fetch has an error guard.

## 2026-07-19 — Photos, likes, mobile

### Added
- **Review photo uploads** — optional photo in SubmitReview step 3 (preview + remove),
  uploaded to the new `review-photos` Storage bucket (public read; users write/delete only
  in their own `{uid}/` folder), URL stored in `reviews.photo_url` and shown in the
  detail review list. Migration 006 creates the bucket + storage policies.
- **Review likes** — heart button + count on each review in the detail view; optimistic
  toggle backed by `review_likes` (RLS already existed, no DB change).
- **Mobile layout** (≤760px) via a `useIsMobile` hook: TopBar stacks into brand+auth /
  search / segmented-nav rows; the map view puts the map on top with the list scrolling
  below; leaderboard/profile paddings and the podium adapt so nothing overflows.

### Changed
- New, slightly simpler brownie artwork (`public/brownie.png`).

## 2026-07-19 — First deploy + launch-polish pass

**Shipped to production (Vercel).** First public deploy of the site.

### Fixed
- **Modal never appeared on click** — the restaurant detail & submit-review modals
  were centered with an inline `transform: translate(-50%,-50%)` that the `bb-rise`
  animation's own `transform` overwrote, throwing the panel off-screen. Re-centered
  with a flex overlay so the animation no longer fights positioning.
- **Map painted over the modal** — Leaflet's high internal z-indexes escaped into
  the page's root stacking context and covered the modal/backdrop. Fixed by wrapping
  the map area in its own stacking context (`isolation: isolate`).
- Success toast in SubmitReview had the same transform collision; re-centered via a
  flex wrapper.

### Changed (design)
- **Map pins**: dropped the "Új" text pills. Every place is now a brownie icon
  (Google-Maps style — pins are places, ratings shown on click). Places with reviews
  get a small brick dot badge.
- **Sidebar tiles**: removed the dead "FOTO" placeholder. The tile now shows the
  average score once a place is rated, and the brownie icon until then.
- **Detail hero**: replaced the "brownie photo" placeholder with a cocoa gradient +
  brownie illustration.
- Map legend updated to match the new pins.
- Real brownie artwork: added `public/brownie.png` (AI-generated, background removed),
  used on pins, sidebar tiles, hero and legend via the shared `BrowniePinIcon`.

### Dev
- `allowedDevOrigins: ['172.21.96.1']` in `next.config.ts` so the WSL host IP can load
  dev resources (affects `next dev` only).
