'use client';

import { useEffect, useState } from 'react';
import type { Restaurant } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { initials } from '@/lib/auth';
import Stars from '@/components/ui/Stars';
import Icon from '@/components/ui/Icon';

interface LeaderboardProps {
  restaurants: Restaurant[];
  onSelect: (r: Restaurant) => void;
  isMobile: boolean;
}

interface TopReview {
  id: string;
  restaurantId: string;
  restaurantName: string;
  author: string;
  score: number;
  body: string;
  likes: number;
}

interface TopReviewRow {
  id: string;
  restaurant_id: string;
  avg_score: number;
  body: string;
  review_likes: { count: number }[] | null;
  profiles: { display_name: string | null } | null;
  restaurants: { name: string } | null;
}

export default function Leaderboard({ restaurants, onSelect, isMobile }: LeaderboardProps) {
  const [topReviews, setTopReviews] = useState<TopReview[] | null>(null);

  // Most-liked community reviews. Fetched client-side and sorted here — fine at
  // hobby scale; a DB view/RPC ordered by like count would be better if it grows.
  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();
    supabase
      .from('reviews')
      .select('id, restaurant_id, avg_score, body, review_likes(count), profiles(display_name), restaurants(name)')
      .limit(200)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error || !data) { setTopReviews([]); return; }
        const mapped = (data as unknown as TopReviewRow[])
          .map((row) => ({
            id: row.id,
            restaurantId: row.restaurant_id,
            restaurantName: row.restaurants?.name ?? 'Ismeretlen helyszín',
            author: row.profiles?.display_name ?? 'Vendég',
            score: Math.round(Number(row.avg_score)),
            body: row.body,
            likes: row.review_likes?.[0]?.count ?? 0,
          }))
          .filter((r) => r.likes > 0)
          .sort((a, b) => b.likes - a.likes)
          .slice(0, 5);
        setTopReviews(mapped);
      }, () => { if (!cancelled) setTopReviews([]); });
    return () => { cancelled = true; };
  }, []);

  const rated = restaurants.filter((r) => r.reviews > 0);
  const top10 = [...rated].sort((a, b) => b.score - a.score || b.reviews - a.reviews).slice(0, 10);
  const [first, second, third, ...rest] = top10;

  const openReview = (rev: TopReview) => {
    const r = restaurants.find((x) => x.id === rev.restaurantId);
    if (r) onSelect(r);
  };

  if (rated.length === 0) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, background: 'var(--bb-cream)', color: 'var(--bb-cocoa-2)', padding: 32 }}>
        <div style={{ fontSize: 48 }}>🏆</div>
        <div style={{ fontFamily: 'var(--font-fraunces, serif)', fontStyle: 'italic', fontSize: 22, fontWeight: 600, color: 'var(--bb-cocoa)' }}>
          Még üres a toplista
        </div>
        <div style={{ fontSize: 14, textAlign: 'center', maxWidth: 380 }}>
          Egyetlen brownie sincs még pontozva. Válassz egy helyszínt a térképen, és legyél te az első bíró! 🍫
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '20px 14px' : '32px 48px', background: 'var(--bb-cream)' }}>
      <h2 style={{ fontFamily: 'var(--font-fraunces, serif)', fontStyle: 'italic', fontWeight: 600, fontSize: isMobile ? 24 : 32, color: 'var(--bb-cocoa)', margin: '0 0 24px' }}>
        Toplista
      </h2>

      {/* Podium */}
      <div style={{ display: 'flex', gap: isMobile ? 8 : 16, alignItems: 'flex-end', marginBottom: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
        {[second, first, third].map((r, idx) => {
          const place = idx === 0 ? 2 : idx === 1 ? 1 : 3;
          const isFirst = place === 1;
          const colors = ['#e0d4b8', 'var(--bb-amber)', '#d9a06b'];
          return r ? (
            <div
              key={r.id}
              onClick={() => onSelect(r)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                padding: '20px 24px',
                background: 'var(--bb-paper)',
                borderRadius: 'var(--bb-radius-l)',
                border: '1px solid var(--bb-line)',
                cursor: 'pointer',
                transform: isFirst ? 'translateY(-12px)' : 'none',
                boxShadow: isFirst ? 'var(--bb-shadow-lg)' : 'var(--bb-shadow)',
                minWidth: isMobile ? 92 : 140,
                textAlign: 'center',
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: colors[idx], display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-fraunces, serif)', fontWeight: 700, fontSize: 18 }}>
                {place}
              </div>
              <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--bb-cocoa)' }}>{r.name}</div>
              <div style={{ fontSize: 12, color: 'var(--bb-cocoa-2)' }}>{r.city}</div>
              <span className="score-pill">{r.score.toFixed(1)}</span>
            </div>
          ) : null;
        })}
      </div>

      {/* Ranks 4–10 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 600, margin: '0 auto' }}>
        {rest.map((r, i) => (
          <div
            key={r.id}
            onClick={() => onSelect(r)}
            className="lb-row"
            style={{ cursor: 'pointer' }}
          >
            <div className="lb-rank">{i + 4}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--bb-cocoa)' }}>{r.name}</div>
              <div style={{ fontSize: 12, color: 'var(--bb-cocoa-2)' }}>{r.city} · {r.reviews} értékelés</div>
            </div>
            <span className="score-pill">{r.score.toFixed(1)}</span>
          </div>
        ))}
      </div>

      {/* Most-liked community reviews (only shown once reviews have likes) */}
      {topReviews && topReviews.length > 0 && (
        <div style={{ maxWidth: 600, margin: '36px auto 0' }}>
          <h3 style={{ fontFamily: 'var(--font-fraunces, serif)', fontStyle: 'italic', fontWeight: 600, fontSize: isMobile ? 20 : 24, color: 'var(--bb-cocoa)', margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="heart" size={18} color="var(--bb-brick)" /> Legnépszerűbb vélemények
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topReviews.map((rev) => (
              <div
                key={rev.id}
                onClick={() => openReview(rev)}
                className="bb-card"
                style={{ padding: 14, cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div className="bb-avatar">{initials(rev.author)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--bb-cocoa)' }}>{rev.author}</div>
                    <div style={{ fontSize: 11, color: 'var(--bb-cocoa-2)' }}>{rev.restaurantName}</div>
                  </div>
                  <Stars value={rev.score} />
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.5, margin: '0 0 8px', color: 'var(--bb-cocoa)' }}>{rev.body}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--bb-brick)', fontWeight: 700, fontSize: 12 }}>
                  <Icon name="heart" size={14} color="var(--bb-brick)" /> {rev.likes}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p style={{ textAlign: 'center', marginTop: 32, fontSize: 11, color: 'var(--bb-cocoa-2)' }}>
        Nem hivatalos rajongói oldal · független értékelések
      </p>
    </div>
  );
}
