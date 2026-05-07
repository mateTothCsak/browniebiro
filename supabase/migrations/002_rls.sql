-- ─────────────────────────────────────────────────────────────
-- BrownieBíró — Row Level Security policies
-- Run after 001_schema.sql.
-- ─────────────────────────────────────────────────────────────

alter table public.profiles      enable row level security;
alter table public.restaurants   enable row level security;
alter table public.reviews       enable row level security;
alter table public.review_likes  enable row level security;

-- ── profiles ─────────────────────────────────────────────────
-- Anyone can read profiles (display name, avatar shown on reviews)
create policy "profiles: public read"
  on public.profiles for select
  using (true);

-- Only the owner can update their own profile
create policy "profiles: owner update"
  on public.profiles for update
  using      (auth.uid() = id)
  with check (auth.uid() = id);

-- ── restaurants ──────────────────────────────────────────────
-- Public read, no public write (restaurants added by admin via
-- the Supabase dashboard or the seed script)
create policy "restaurants: public read"
  on public.restaurants for select
  using (true);

-- ── reviews ──────────────────────────────────────────────────
-- Anyone can read all reviews
create policy "reviews: public read"
  on public.reviews for select
  using (true);

-- Authenticated users can post a review (user_id must match their own)
create policy "reviews: authenticated insert"
  on public.reviews for insert
  with check (auth.uid() = user_id);

-- Owners can edit their own review text/tags/photo after posting
create policy "reviews: owner update"
  on public.reviews for update
  using      (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Owners can delete their own review
create policy "reviews: owner delete"
  on public.reviews for delete
  using (auth.uid() = user_id);

-- ── review_likes ─────────────────────────────────────────────
-- Anyone can read likes (needed to count them on review cards)
create policy "review_likes: public read"
  on public.review_likes for select
  using (true);

-- Authenticated users can like a review
create policy "review_likes: authenticated insert"
  on public.review_likes for insert
  with check (auth.uid() = user_id);

-- Owners can unlike (delete their own like)
create policy "review_likes: owner delete"
  on public.review_likes for delete
  using (auth.uid() = user_id);
