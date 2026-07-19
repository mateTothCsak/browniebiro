'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { signOut, displayName, initials } from '@/lib/auth';

interface ProfileViewProps {
  user: User | null;
  onLogin: () => void;
  isMobile: boolean;
}

export default function ProfileView({ user, onLogin, isMobile }: ProfileViewProps) {
  const [stats, setStats] = useState<{ reviews: number; places: number } | null>(null);

  useEffect(() => {
    if (!user) return; // stats aren't rendered while logged out
    let cancelled = false;
    const supabase = createClient();
    supabase
      .from('reviews')
      .select('restaurant_id')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (cancelled || !data) return;
        setStats({ reviews: data.length, places: new Set(data.map((d) => d.restaurant_id)).size });
      }, () => { /* ignore stats fetch errors — the profile still renders */ });
    return () => { cancelled = true; };
  }, [user]);

  if (!user) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, background: 'var(--bb-cream)', padding: 32 }}>
        <div style={{ fontSize: 48 }}>🍫</div>
        <div style={{ fontFamily: 'var(--font-fraunces, serif)', fontStyle: 'italic', fontSize: 22, fontWeight: 600, color: 'var(--bb-cocoa)' }}>
          Lépj be a profilodhoz
        </div>
        <div style={{ fontSize: 14, color: 'var(--bb-cocoa-2)', textAlign: 'center', maxWidth: 340 }}>
          A belépés után tudsz brownie-kat értékelni, és itt látod a saját értékeléseidet.
        </div>
        <button onClick={onLogin} className="bb-btn bb-btn-primary" style={{ marginTop: 8 }}>
          Belépés Google-fiókkal
        </button>
      </div>
    );
  }

  const name = displayName(user);
  const memberSince = new Date(user.created_at).getFullYear();

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bb-cream)' }}>
      {/* Header band */}
      <div style={{ background: 'var(--bb-cocoa)', padding: isMobile ? '20px 16px' : '32px 48px', display: 'flex', alignItems: 'center', gap: isMobile ? 14 : 24, flexWrap: 'wrap' }}>
        <div className="bb-avatar" style={{ width: 64, height: 64, fontSize: 22, background: 'var(--bb-amber)', color: 'var(--bb-cocoa)', flexShrink: 0 }}>
          {initials(name)}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-fraunces, serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 24, color: 'var(--bb-paper)', marginBottom: 4 }}>
            {name}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,250,240,0.65)' }}>Tag {memberSince} óta</div>
        </div>
        <div style={{ marginLeft: isMobile ? 0 : 'auto', width: isMobile ? '100%' : 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          {[
            { label: String(stats?.reviews ?? '–'), sub: 'értékelés' },
            { label: String(stats?.places ?? '–'), sub: 'helyszín' },
          ].map((s) => (
            <div key={s.sub} style={{ textAlign: 'center', background: 'rgba(255,250,240,0.10)', padding: '12px 20px', borderRadius: 14 }}>
              <div style={{ fontFamily: 'var(--font-fraunces, serif)', fontWeight: 700, fontSize: 22, color: 'var(--bb-amber)' }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,250,240,0.65)' }}>{s.sub}</div>
            </div>
          ))}
          <button
            onClick={signOut}
            style={{
              background: 'transparent', border: '1px solid rgba(255,250,240,0.35)',
              color: 'var(--bb-paper)', padding: '9px 16px', borderRadius: 999,
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            Kijelentkezés
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: isMobile ? '28px 16px' : '32px 48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'var(--bb-cocoa-2)', textAlign: 'center' }}>
        {stats && stats.reviews > 0 ? (
          <>
            <div style={{ fontSize: 48 }}>🏅</div>
            <div style={{ fontFamily: 'var(--font-fraunces, serif)', fontStyle: 'italic', fontSize: 20, color: 'var(--bb-cocoa)', fontWeight: 600 }}>
              Eddig {stats.reviews} értékelést adtál le {stats.places} helyszínen
            </div>
            <div style={{ fontSize: 14 }}>Így tovább, bíró! 🍫</div>
          </>
        ) : (
          <>
            <div style={{ fontSize: 48 }}>🍫</div>
            <div style={{ fontFamily: 'var(--font-fraunces, serif)', fontStyle: 'italic', fontSize: 20, color: 'var(--bb-cocoa)', fontWeight: 600 }}>Még nincs értékelésed</div>
            <div style={{ fontSize: 14 }}>Látogass meg egy helyszínt és értékeld a brownie-t!</div>
          </>
        )}
      </div>
    </div>
  );
}
