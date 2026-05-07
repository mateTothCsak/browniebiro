<!-- BEGIN:nextjs-agent-rules -->
# Next.js version note
This project runs Next.js 16. If something doesn't match your training data, check
`node_modules/next/dist/docs/` — the in-repo docs are authoritative.
<!-- END:nextjs-agent-rules -->

# Agent rules — BrownieBíró

## Security — hard rules
- **Never write real credentials to any file that could be committed.**
  `.env.local` is gitignored. `.env.local.example` contains only placeholder values.
- Before committing, run `git diff --staged` and scan for anything matching
  `supabase.co`, `sb_publishable_`, or `eyJ` (JWT prefix).
- If you find a secret in staged files, unstage immediately: `git reset HEAD <file>`.

## Before writing code
1. Read `CLAUDE.md` in full — it has the architecture map, design token list, and
   the DB schema rationale you need to make correct decisions.
2. Run `npx tsc --noEmit` to establish a clean baseline. Fix any pre-existing errors
   before adding new code.
3. For any Supabase query, prefer `restaurant_stats` view over raw `reviews` table
   for anything score-related.

## Supabase client — which one to use
| Context | Import |
|---|---|
| Server Component / Route Handler | `@/utils/supabase/server` → `createClient()` |
| Client Component (`'use client'`) | `@/utils/supabase/client` → `createClient()` |
| Next.js Middleware | `@/utils/supabase/middleware` → `createClient(request)` |

Never import the server client inside a `'use client'` component.

## Leaflet rules
- `LeafletMap` must stay a `'use client'` component.
- Always import it with `dynamic(() => import(...), { ssr: false })`.
- Never import `leaflet` at module level in a Server Component — it reads `window`.

## Adding a new screen or route
1. New pages go in `src/app/<route>/page.tsx` (Server Component by default).
2. If the page needs client state, extract the interactive part to a component in
   `src/components/` marked `'use client'` and import it from the page.
3. Wrap with `<Suspense>` if it uses `useSearchParams()`.

## Design tokens
Use CSS variables (`var(--bb-brick)`) for all brand colors, not Tailwind color classes.
Tailwind is used for layout only (`flex`, `grid`, `overflow`, `h-full`, etc.).

## Commit hygiene
- `npm run build` must pass before committing any significant change.
- Commit message format: imperative mood, short subject, then a blank line and bullets.
- Never commit `.env.local`, `.next/`, `node_modules/`.
