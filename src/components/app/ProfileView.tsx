'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import { signOut, displayName, initials } from '@/lib/auth';
import Stars from '@/components/ui/Stars';
import Icon from '@/components/ui/Icon';
import ShareModal from '@/components/ui/ShareModal';
import ShareCardModal from '@/components/ui/ShareCardModal';

interface ProfileViewProps {
  user: User | null;
  onLogin: () => void;
  isMobile: boolean;
  onOpenRestaurant?: (restaurantId: string) => void;
}

interface MyReview {
  id: string;
  restaurantId: string;
  name: string;
  city: string;
  district: string;
  score: number;
  avgScore: number;
  date: string;
  body: string;
  photo_url: string | null;
}

interface ReviewRow {
  id: string;
  restaurant_id: string;
  avg_score: number;
  body: string;
  visit_date: string;
  photo_url: string | null;
  restaurants: { name: string; city: string; district: string | null } | null;
}

export default function ProfileView({ user, onLogin, isMobile, onOpenRestaurant }: ProfileViewProps) {
  const [reviews, setReviews] = useState<MyReview[] | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareCard, setShareCard] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const supabase = createClient();
    supabase
      .from('reviews')
      .select('id, restaurant_id, avg_score, body, visit_date, photo_url, restaurants(name, city, district)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) { setReviews([]); return; }
        setReviews((data as unknown as ReviewRow[]).map((row) => ({
          id: row.id,
          restaurantId: row.restaurant_id,
          name: row.restaurants?.name ?? 'Ismeretlen helyszín',
          city: row.restaurants?.city ?? '',
          district: row.restaurants?.district ?? '',
          score: Math.round(Number(row.avg_score)),
          avgScore: Number(row.avg_score),
          date: row.visit_date,
          body: row.body,
          photo_url: row.photo_url,
        })));
      }, () => { if (!cancelled) setReviews([]); });
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
  const reviewCount = reviews?.length ?? null;
  const placeCount = reviews ? new Set(reviews.map((r) => r.restaurantId)).size : null;

  return (
    <>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bb-cream)', overflow: 'hidden' }}>
      {/* Header band */}
      <div style={{ background: 'var(--bb-cocoa)', padding: isMobile ? '20px 16px' : '32px 48px', display: 'flex', alignItems: 'center', gap: isMobile ? 14 : 24, flexWrap: 'wrap', flexShrink: 0 }}>
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
            { label: reviewCount ?? '–', sub: 'értékelés' },
            { label: placeCount ?? '–', sub: 'helyszín' },
          ].map((s) => (
            <div key={s.sub} style={{ textAlign: 'center', background: 'rgba(255,250,240,0.10)', padding: '12px 20px', borderRadius: 14 }}>
              <div style={{ fontFamily: 'var(--font-fraunces, serif)', fontWeight: 700, fontSize: 22, color: 'var(--bb-amber)' }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,250,240,0.65)' }}>{s.sub}</div>
            </div>
          ))}
          <button
            onClick={() => setShareOpen(true)}
            style={{
              background: 'var(--bb-amber)', border: 'none',
              color: 'var(--bb-cocoa)', padding: '9px 16px', borderRadius: 999,
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}
          >
            <Icon name="share" size={14} color="var(--bb-cocoa)" /> Oszd meg
          </button>
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

      {/* Content — the user's reviews */}
      <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '20px 16px' : '28px 48px' }}>
        {reviews === null ? (
          <div style={{ textAlign: 'center', padding: '40px 0', fontSize: 14, color: 'var(--bb-cocoa-2)' }}>
            Értékeléseid betöltése…
          </div>
        ) : reviews.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '48px 16px', textAlign: 'center', color: 'var(--bb-cocoa-2)' }}>
            <div style={{ fontSize: 48 }}>🍫</div>
            <div style={{ fontFamily: 'var(--font-fraunces, serif)', fontStyle: 'italic', fontSize: 20, color: 'var(--bb-cocoa)', fontWeight: 600 }}>Még nincs értékelésed</div>
            <div style={{ fontSize: 14 }}>Látogass meg egy helyszínt és értékeld a brownie-t!</div>
          </div>
        ) : (
          <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h3 style={{ margin: '0 0 2px', fontFamily: 'var(--font-fraunces, serif)', fontStyle: 'italic', fontSize: 20, fontWeight: 600, color: 'var(--bb-cocoa)' }}>
              Értékeléseid
            </h3>
            {reviews.map((rev) => (
              <div
                key={rev.id}
                onClick={() => onOpenRestaurant?.(rev.restaurantId)}
                className="bb-card"
                style={{ padding: 14, cursor: onOpenRestaurant ? 'pointer' : 'default' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--bb-cocoa)' }}>{rev.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--bb-cocoa-2)', display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
                      <span>{rev.city}{rev.district ? ` · ${rev.district}` : ''}</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                        <Icon name="calendar" size={10} /> {rev.date}
                      </span>
                    </div>
                  </div>
                  <span className="score-pill" style={{ flexShrink: 0 }}>{rev.avgScore.toFixed(1)}</span>
                </div>

                <div style={{ marginBottom: 8 }}><Stars value={rev.score} /></div>

                {rev.photo_url && (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={rev.photo_url}
                    alt="Brownie fotó"
                    style={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 12, marginBottom: 8, display: 'block' }}
                  />
                )}

                {rev.body.trim() && (
                  <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0, color: 'var(--bb-cocoa)' }}>{rev.body}</p>
                )}

                <div style={{ marginTop: 10 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setShareCard({ id: rev.id, name: rev.name }); }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--bb-brick)', fontWeight: 700, fontSize: 12 }}
                  >
                    <Icon name="share" size={13} color="var(--bb-brick)" /> Oszd meg az értékelést
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {shareOpen && (
      <ShareModal
        url={`${window.location.origin}/`}
        title="BrownieBíró — értékeld a brownie-kat!"
        heading="Hívd meg a barátaidat"
        subtitle="Oszd meg a BrownieBírót, hogy ők is értékelhessenek."
        onClose={() => setShareOpen(false)}
      />
    )}
    {shareCard && (
      <ShareCardModal
        reviewId={shareCard.id}
        restaurantName={shareCard.name}
        onClose={() => setShareCard(null)}
      />
    )}
    </>
  );
}
