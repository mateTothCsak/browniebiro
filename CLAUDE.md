# BrownieBíró — Claude Code Instructions

## Project overview
Hungarian brownie rating site for Burger King locations. Users browse a map, read reviews,
and submit 3-axis ratings (taste, texture, ice-cream meltiness). Independent fan project,
not affiliated with any restaurant chain.

## CRITICAL: Never commit secrets
`.env.local` is gitignored. **Never add real credentials to any committed file.**
Use `.env.local.example` (committed, no real values) as the template.
If you suspect a secret was accidentally staged, run `git reset HEAD <file>` immediately.

## Tech stack
- **Framework:** Next.js 16 (App Router, `src/` directory layout)
- **Styling:** Tailwind CSS v4 + custom BB design tokens (CSS variables)
- **Database:** Supabase (PostgreSQL) — see `supabase/migrations/`
- **Auth:** Supabase Auth (email + Google OAuth)
- **Map:** Leaflet + react-leaflet (dynamically imported — Leaflet requires browser APIs)
- **Hosting:** Vercel

## Environment variables (all required)
```
NEXT_PUBLIC_SUPABASE_URL          # Supabase project URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY  # Supabase publishable (anon) key
```
Both go in `.env.local` locally and in Vercel project settings for production.

## Common commands
```bash
npm run dev        # Start dev server at http://localhost:3000
npm run build      # Production build (run before committing major changes)
npx tsc --noEmit   # Type check without building
```

## Architecture
```
src/
  app/                    # Next.js App Router pages (server components by default)
    page.tsx              # Home — wraps DesktopApp in Suspense
    impresszum/page.tsx   # Impresszum (legally required for HU sites)
    globals.css           # BB design tokens + Tailwind import
    layout.tsx            # Root layout: Fraunces + Figtree fonts, lang="hu"
  components/
    desktop/              # Desktop layout (client components)
      DesktopApp.tsx      # Main shell — state, URL sync, modal orchestration
      TopBar.tsx          # Navigation bar
      RestaurantSidebar.tsx
      RestaurantDetail.tsx  # Modal: score breakdown + reviews
      SubmitReview.tsx    # 3-step review submission modal
    map/
      LeafletMap.tsx      # 'use client', dynamically imported (ssr: false)
    ui/
      Icon.tsx            # SVG icons (server-safe)
      Stars.tsx           # Star rating display (server-safe)
      BrandMark.tsx       # Brand SVG (server-safe)
  lib/
    data.ts               # Static seed data + scoreClass helper
  utils/
    supabase/
      client.ts           # Browser-side Supabase client (use in 'use client' components)
      server.ts           # Server-side Supabase client (use in Server Components)
      middleware.ts       # Middleware Supabase client helper
  middleware.ts           # Next.js middleware — refreshes auth sessions
  types/
    index.ts              # Shared TypeScript types
supabase/
  migrations/             # SQL files — run in order in Supabase SQL Editor
    001_schema.sql        # Tables, view, indexes, auto-profile trigger
    002_rls.sql           # Row Level Security policies
    003_seed_restaurants.sql  # 22 Hungarian BK locations
```

## Server vs Client components
- **Default is Server.** Only add `'use client'` when you need: state, effects, browser APIs,
  event handlers, or Leaflet.
- **Leaflet must be dynamically imported** with `ssr: false` — it reads `window` on load.
- Use `@/utils/supabase/server` in Server Components, `@/utils/supabase/client` in Client
  Components.

## Design system — BB tokens
All colors and spacing come from CSS custom properties in `globals.css`. **Do not use
Tailwind color classes for brand colors** — use the variables directly:

| Token | Value | Usage |
|---|---|---|
| `--bb-cream` | `#faf3e7` | App background |
| `--bb-paper` | `#fffaf0` | Card backgrounds |
| `--bb-brick` | `#d62a08` | Primary CTAs, active nav |
| `--bb-amber` | `#f29406` | Stars, accent numbers |
| `--bb-cocoa` | `#3a241a` | Primary text |
| `--bb-cocoa-2` | `#5b3a26` | Secondary text |
| `--bb-line` | `rgba(58,36,26,0.12)` | Borders |

Tailwind IS used for layout utilities (`flex`, `h-full`, `overflow-hidden`, etc.).

## Database schema
Key rule: **multiple reviews per user per restaurant are allowed** — only the most recent
one counts toward the restaurant score (enforced in the `restaurant_stats` view via
`DISTINCT ON (restaurant_id, user_id) ORDER BY created_at DESC`).

Tables: `restaurants`, `reviews`, `review_likes`, `profiles`
View: `restaurant_stats` — use this for map pins and leaderboard, not raw `reviews`.

## Conventions
- Hungarian UI copy — all visible text is in Hungarian
- Disclaimers: every page must show "Nem hivatalos rajongói oldal · független értékelések"
- One review per user per restaurant per day (app-level rate limit — not yet implemented)
- Photo uploads go to Supabase Storage, return a URL stored in `reviews.photo_url`
- The `scoreClass()` helper in `lib/data.ts` converts a score to a CSS pin class

## What's done / what's next
**Done:** Desktop layout, map + sidebar, restaurant detail modal, 3-step submit review UI,
leaderboard, profile placeholder, Impresszum, URL state sync, DB migrations, RLS policies.

**TODO:**
- Wire submit review to Supabase (currently fires a fake 800ms delay)
- Auth UI (sign up / log in modal)
- Mobile responsive layout (< 720px)
- Real photos via Supabase Storage
- Supabase auth session handling (middleware is wired, UI is not)
