# Roadmap

Open and planned work, roughly in priority order. Shipped items move to `CHANGELOG.md`.

## Next up
- **Photo uploads for reviews** — let a user attach a photo of their brownie and show it
  to others. Needs: a Supabase Storage bucket (`review-photos`) with RLS/storage policies,
  upload UI in SubmitReview step 3 (currently stubbed out), store the URL in
  `reviews.photo_url`, and render photos in the RestaurantDetail review list.

## Backlog
- **Mobile responsive layout** (< 720px) — friends will mostly use phones; the sidebar,
  top nav and map all break at phone width today.
- **Review likes** — DB table + RLS already exist; no UI yet.
