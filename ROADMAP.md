# Roadmap

Open and planned work, roughly in priority order. Shipped items move to `CHANGELOG.md`.

## Next up
- **"Share your rating" prompt on submit success** — after posting a review, offer the
  ShareCardModal for the just-created review (needs the insert to return its id). The
  highest-intent moment to share; the card infra (`/api/card`, `ShareCardModal`) is done.
- **Per-review link previews** — a `/r/[id]` page whose OG image is that review's
  `/api/card?review=id`, so a shared review link previews the specific card (the generic
  brand card is already the site-wide OG).

## Backlog
- **Custom domain** (`browniebiro.hu`) — buy + point DNS at Vercel; update Supabase Site
  URL / redirect allowlist + Google OAuth JS origins. Share links auto-use the new origin.
- **Delete your own review** — RLS already allows owner-delete; needs a small trash button.
- **Map pin legibility** — the detailed brownie can muddy at ~36px when pins cluster.
- Rename `middleware.ts` → `proxy.ts` (Next 16 deprecation).
- Full mascot art for empty states / loading (the judge logo is done; a body pose could
  reuse the earlier full-body generation).
