'use client';

import type { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';

/** Starts the Google OAuth flow, returning to the current page afterwards. */
export function signInWithGoogle() {
  const supabase = createClient();
  const next = window.location.pathname + window.location.search;
  void supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });
}

export function signOut() {
  const supabase = createClient();
  void supabase.auth.signOut();
}

export function displayName(user: User): string {
  return (
    (user.user_metadata?.full_name as string | undefined) ??
    user.email?.split('@')[0] ??
    'Brownie Bíró'
  );
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
