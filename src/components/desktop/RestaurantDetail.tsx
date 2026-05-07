'use client';

import { useEffect } from 'react';
import Stars from '@/components/ui/Stars';
import Icon from '@/components/ui/Icon';
import type { Restaurant, Review } from '@/types';
import { MOCK_REVIEWS } from '@/lib/data';

interface RestaurantDetailProps {
  restaurant: Restaurant;
  onClose: () => void;
  onSubmitReview: () => void;
}

export default function RestaurantDetail({ restaurant: r, onClose, onSubmitReview }: RestaurantDetailProps) {
  const reviews: Review[] = MOCK_REVIEWS[r.id] ?? [
    { id: 'default-1', author: 'Vendég', avatar: 'V', score: Math.round(r.score), date: '2026-04-15', body: 'Egész jó volt, érdemes kipróbálni!', tags: ['friss'], likes: 5 },
  ];

  const distribution = [5, 4, 3, 2, 1].map((n) => ({
    n,
    count: reviews.filter((rev) => rev.score === n).length +
      (n === Math.round(r.score) ? Math.floor(r.reviews * 0.4) : Math.floor(r.reviews * 0.1)),
  }));
  const total = distribution.reduce((s, d) => s + d.count, 0);

  const axes = [
    { label: 'Íz',      value: Math.min(5, r.score + 0.2), color: 'var(--bb-brick)' },
    { label: 'Textúra', value: Math.max(1, r.score - 0.1), color: 'var(--bb-amber)' },
    { label: 'Fagyi',   value: Math.max(1, r.score - 0.4), color: 'var(--bb-leaf)' },
  ];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(26,20,16,0.45)',
          backdropFilter: 'blur(2px)',
          zIndex: 40,
          animation: 'bb-fade 200ms ease both',
        }}
      />

      {/* Modal */}
      <div
        className="bb-rise"
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: 480,
          maxHeight: '90vh',
          background: 'var(--bb-cream)',
          borderRadius: 'var(--bb-radius-xl)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 50,
          boxShadow: 'var(--bb-shadow-lg)',
        }}
      >
        {/* Nav row */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px 8px', gap: 10, flexShrink: 0 }}>
          <button
            onClick={onClose}
            aria-label="Vissza"
            style={{
              background: 'var(--bb-paper)', border: '1px solid var(--bb-line)',
              width: 38, height: 38, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon name="arrow-left" size={18} />
          </button>
          <div style={{ flex: 1 }} />
          <button
            aria-label="Kedvencekhez"
            style={{
              background: 'var(--bb-paper)', border: '1px solid var(--bb-line)',
              width: 38, height: 38, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon name="heart" size={16} />
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 24px' }}>
          {/* Hero */}
          <div className="bb-photo-ph" style={{ height: 160, marginBottom: 14, borderRadius: 18 }}>
            {r.name} · brownie photo
          </div>

          {/* Tag chips */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <span className="bb-chip brick"><Icon name="pin" size={11} /> {r.city}</span>
            {r.district && <span className="bb-chip">{r.district}</span>}
            {r.score >= 4.5 && <span className="bb-chip amber"><Icon name="flame" size={11} /> Forró</span>}
            {r.reviews >= 100 && <span className="bb-chip leaf"><Icon name="check" size={11} /> Népszerű</span>}
          </div>

          {/* Name */}
          <h2 style={{
            fontFamily: 'var(--font-fraunces, serif)',
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: 26,
            margin: '4px 0 14px',
            letterSpacing: '-0.01em',
            color: 'var(--bb-cocoa)',
          }}>
            {r.name}
          </h2>

          {/* Score block */}
          <div style={{
            padding: 16,
            background: 'var(--bb-paper)',
            borderRadius: 18,
            border: '1px solid var(--bb-line)',
            marginBottom: 14,
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 18, alignItems: 'center' }}>
              {/* Headline score */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-fraunces, serif)', fontWeight: 700, fontSize: 44, lineHeight: 1, color: 'var(--bb-cocoa)' }}>
                  {r.score.toFixed(1)}
                </div>
                <Stars value={r.score} size="lg" />
                <div style={{ fontSize: 11, color: 'var(--bb-cocoa-2)', marginTop: 4 }}>
                  {r.reviews} értékelés
                </div>
              </div>

              {/* Distribution */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {distribution.map((d) => (
                  <div key={d.n} style={{ display: 'grid', gridTemplateColumns: '18px 1fr 28px', gap: 6, alignItems: 'center', fontSize: 11, color: 'var(--bb-cocoa-2)' }}>
                    <span>{d.n}★</span>
                    <div style={{ height: 6, background: 'var(--bb-cream-2)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: `${total ? (d.count / total) * 100 : 0}%`, height: '100%', background: d.n >= 4 ? 'var(--bb-amber)' : 'var(--bb-cocoa-2)', borderRadius: 999 }} />
                    </div>
                    <span style={{ textAlign: 'right' }}>{d.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3-axis breakdown */}
            <div style={{ borderTop: '1px solid var(--bb-line)', marginTop: 14, paddingTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              {axes.map((a) => (
                <div key={a.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, color: 'var(--bb-cocoa-2)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 4 }}>{a.label}</div>
                  <div style={{ fontFamily: 'var(--font-fraunces, serif)', fontWeight: 700, fontSize: 18, color: 'var(--bb-cocoa)', marginBottom: 4 }}>{a.value.toFixed(1)}</div>
                  <div style={{ height: 4, background: 'var(--bb-cream-2)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: `${(a.value / 5) * 100}%`, height: '100%', background: a.color, borderRadius: 999 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onSubmitReview}
            className="bb-btn bb-btn-primary"
            style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 22 }}
          >
            <Icon name="edit" size={16} color="currentColor" /> Értékeld a brownie-t
          </button>

          {/* Reviews */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-fraunces, serif)', fontStyle: 'italic', fontSize: 18, fontWeight: 600, color: 'var(--bb-cocoa)' }}>
              Vélemények
            </h3>
            <span style={{ fontSize: 12, color: 'var(--bb-cocoa-2)' }}>Legújabb</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {reviews.map((rev) => (
              <div key={rev.id} className="bb-card" style={{ padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div className="bb-avatar">{rev.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--bb-cocoa)' }}>{rev.author}</div>
                    <div style={{ fontSize: 11, color: 'var(--bb-cocoa-2)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Icon name="calendar" size={10} /> {rev.date}
                    </div>
                  </div>
                  <Stars value={rev.score} />
                </div>

                <p style={{ fontSize: 13, lineHeight: 1.5, margin: '0 0 8px', color: 'var(--bb-cocoa)' }}>{rev.body}</p>

                {rev.hasPhoto && (
                  <div className="bb-photo-ph" style={{ height: 80, marginBottom: 8, fontSize: 9, borderRadius: 10 }}>review photo</div>
                )}

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  {rev.tags.map((t) => (
                    <span key={t} className="bb-chip" style={{ fontSize: 10, padding: '3px 8px' }}>#{t}</span>
                  ))}
                  <span style={{ flex: 1 }} />
                  <span style={{ fontSize: 11, color: 'var(--bb-cocoa-2)', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                    <Icon name="heart" size={11} /> {rev.likes}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
