'use client';

import type { Restaurant } from '@/types';

interface LeaderboardProps {
  restaurants: Restaurant[];
  onSelect: (r: Restaurant) => void;
  isMobile: boolean;
}

export default function Leaderboard({ restaurants, onSelect, isMobile }: LeaderboardProps) {
  const rated = restaurants.filter((r) => r.reviews > 0);
  const top10 = [...rated].sort((a, b) => b.score - a.score || b.reviews - a.reviews).slice(0, 10);
  const [first, second, third, ...rest] = top10;

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

      <p style={{ textAlign: 'center', marginTop: 32, fontSize: 11, color: 'var(--bb-cocoa-2)' }}>
        Nem hivatalos rajongói oldal · független értékelések
      </p>
    </div>
  );
}
