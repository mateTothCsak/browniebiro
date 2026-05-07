-- ─────────────────────────────────────────────────────────────
-- BrownieBíró — core schema
-- Run this first. Creates tables, view, indexes, and the
-- auto-profile trigger.
-- ─────────────────────────────────────────────────────────────

-- ── profiles ─────────────────────────────────────────────────
-- Extends auth.users. Created automatically on signup via trigger.
create table public.profiles (
  id           uuid primary key references auth.users on delete cascade,
  display_name text,
  avatar_url   text,
  city         text,
  created_at   timestamptz default now()
);

-- ── restaurants ──────────────────────────────────────────────
create table public.restaurants (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,          -- URL key: /etterem/{slug}
  name        text not null,
  city        text not null,
  district    text,                          -- null for countryside locations
  lat         double precision not null,
  lng         double precision not null,
  address     text,
  hours_json  jsonb,                         -- e.g. {"mon":"10-22","tue":"10-22",...}
  created_at  timestamptz default now()
);

-- ── reviews ──────────────────────────────────────────────────
-- No unique(restaurant_id, user_id) — multiple visits allowed.
-- Only the most recent review per user per restaurant counts
-- toward the restaurant score (enforced in the view below).
-- App-level rate limit: 1 submission per user per restaurant per day.
create table public.reviews (
  id              uuid primary key default gen_random_uuid(),
  restaurant_id   uuid not null references public.restaurants on delete cascade,
  user_id         uuid not null references auth.users on delete cascade,
  taste           smallint not null check (taste between 1 and 5),
  texture         smallint not null check (texture between 1 and 5),
  ice_cream       smallint not null check (ice_cream between 1 and 5),
  -- Computed average of the three axes, stored for query performance
  avg_score       numeric(2,1) generated always as (
                    round((taste + texture + ice_cream)::numeric / 3, 1)
                  ) stored,
  body            text not null check (char_length(body) >= 10),
  visit_date      date not null,
  photo_url       text,                      -- Supabase Storage URL
  tags            text[] not null default '{}',
  created_at      timestamptz default now()
);

-- ── review_likes ─────────────────────────────────────────────
create table public.review_likes (
  user_id     uuid not null references auth.users on delete cascade,
  review_id   uuid not null references public.reviews on delete cascade,
  created_at  timestamptz default now(),
  primary key (user_id, review_id)
);

-- ── indexes ──────────────────────────────────────────────────
-- Powers the DISTINCT ON in restaurant_stats
create index reviews_restaurant_user_created
  on public.reviews (restaurant_id, user_id, created_at desc);

-- Powers the profile page (user's full review history)
create index reviews_user_created
  on public.reviews (user_id, created_at desc);

-- Powers the like count join on reviews
create index review_likes_review_id
  on public.review_likes (review_id);

-- ── restaurant_stats view ────────────────────────────────────
-- For each restaurant, only the LATEST review per user counts
-- toward the score. reviewer_count = unique people who reviewed.
create view public.restaurant_stats as
with latest_per_user as (
  select distinct on (restaurant_id, user_id)
    id, restaurant_id, user_id,
    avg_score, taste, texture, ice_cream
  from public.reviews
  order by restaurant_id, user_id, created_at desc
)
select
  r.id,
  r.slug,
  r.name,
  r.city,
  r.district,
  r.lat,
  r.lng,
  coalesce(round(avg(l.avg_score), 1), 0)::numeric(2,1)  as score,
  coalesce(round(avg(l.taste),     1), 0)::numeric(2,1)  as taste_avg,
  coalesce(round(avg(l.texture),   1), 0)::numeric(2,1)  as texture_avg,
  coalesce(round(avg(l.ice_cream), 1), 0)::numeric(2,1)  as ice_cream_avg,
  count(l.id)::integer                                    as reviewer_count
from public.restaurants r
left join latest_per_user l on l.restaurant_id = r.id
group by r.id, r.slug, r.name, r.city, r.district, r.lat, r.lng;

-- Grant anon + authenticated access to the view
grant select on public.restaurant_stats to anon, authenticated;

-- ── auto-profile trigger ─────────────────────────────────────
-- Creates a profile row the moment a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
