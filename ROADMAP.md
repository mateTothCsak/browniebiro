# Roadmap

Open and planned work, roughly in priority order. Shipped items move to `CHANGELOG.md`.

## Next up
- **Shareable review card image** — generate a branded PNG summarising a review (score,
  restaurant, 3-axis breakdown, 🔥 if hot, reviewer, URL) via Next.js `ImageResponse`
  (`next/og`). Share the image file (Web Share on mobile / download on desktop) from the
  profile review cards and the submit-success screen. Reuse the same image as the Open
  Graph link-preview so pasted links show the card too.

## Backlog
- **Custom domain** (`browniebiro.hu`) — buy + point DNS at Vercel; update Supabase Site
  URL / redirect allowlist + Google OAuth JS origins. Share links auto-use the new origin.
- **Delete your own review** — RLS already allows owner-delete; needs a small trash button.
- **Map pin legibility** — the detailed brownie can muddy at ~36px when pins cluster.
- Rename `middleware.ts` → `proxy.ts` (Next 16 deprecation).
- Full mascot art for empty states / loading (the judge logo is done; a body pose could
  reuse the earlier full-body generation).
