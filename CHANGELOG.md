# Changelog

Notable changes to BrownieBíró, newest first. Dates in Europe/Budapest.

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
