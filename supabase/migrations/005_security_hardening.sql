-- ─────────────────────────────────────────────────────────────
-- BrownieBíró — security hardening (from supabase linter)
-- Applied to the live project 2026-06-10 via MCP.
-- ─────────────────────────────────────────────────────────────

-- restaurant_stats was SECURITY DEFINER by default (linter ERROR): it ran with
-- the owner's permissions, bypassing RLS of the querying user. The underlying
-- tables are public-read anyway, but invoker semantics are the safe default.
alter view public.restaurant_stats set (security_invoker = on);

-- handle_new_user() is a trigger function; nobody should call it over the API.
revoke execute on function public.handle_new_user() from anon, authenticated, public;
