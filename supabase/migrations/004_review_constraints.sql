-- ─────────────────────────────────────────────────────────────
-- BrownieBíró — review constraints
-- Run after 003_seed_restaurants.sql.
-- ─────────────────────────────────────────────────────────────

-- One review per user per restaurant per day, enforced in the DB.
-- The app shows a friendly message on unique violation (code 23505).
-- The timezone-qualified expression is immutable, so it can be indexed;
-- a bare created_at::date cast cannot.
create unique index if not exists reviews_one_per_day
  on public.reviews (restaurant_id, user_id, ((created_at at time zone 'Europe/Budapest')::date));

-- FK from reviews to profiles so PostgREST can embed the reviewer's
-- display name when fetching reviews (profiles(display_name)).
-- Safe: the on_auth_user_created trigger guarantees a profile exists
-- for every user before they can post.
alter table public.reviews
  add constraint reviews_user_id_profiles_fkey
  foreign key (user_id) references public.profiles (id) on delete cascade;
