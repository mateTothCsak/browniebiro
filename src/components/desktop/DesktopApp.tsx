'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { Restaurant, ActiveView } from '@/types';
import TopBar from './TopBar';
import RestaurantSidebar from './RestaurantSidebar';
import RestaurantDetail from './RestaurantDetail';
import SubmitReview from './SubmitReview';

const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), { ssr: false });

interface DesktopAppProps {
  restaurants: Restaurant[];
}

export default function DesktopApp({ restaurants }: DesktopAppProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeView, setActiveView] = useState<ActiveView>('map');
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') ?? '');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(() => {
    const focusId = searchParams.get('focus');
    return focusId ? (restaurants.find((r) => r.id === focusId) ?? null) : null;
  });
  const [showSubmitReview, setShowSubmitReview] = useState(false);

  // Sync search query to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) params.set('q', searchQuery); else params.delete('q');
    if (selectedRestaurant) params.set('focus', selectedRestaurant.id); else params.delete('focus');
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [searchQuery, selectedRestaurant]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return restaurants
      .filter((r) => !q || r.name.toLowerCase().includes(q) || r.city.toLowerCase().includes(q))
      .sort((a, b) => b.score - a.score || b.reviews - a.reviews);
  }, [restaurants, searchQuery]);

  const handleSelect = useCallback((r: Restaurant) => {
    setSelectedRestaurant(r);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedRestaurant(null);
    setShowSubmitReview(false);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <TopBar
        activeView={activeView}
        onViewChange={setActiveView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {activeView === 'map' && (
          <>
            <RestaurantSidebar
              restaurants={filtered}
              selectedId={selectedRestaurant?.id ?? null}
              onSelect={handleSelect}
              totalCount={restaurants.length}
            />

            {/* Map area */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <LeafletMap
                restaurants={filtered}
                selectedId={selectedRestaurant?.id ?? null}
                onSelect={handleSelect}
              />

              {/* Legend */}
              <div style={{
                position: 'absolute', top: 16, right: 16,
                background: 'var(--bb-paper)',
                borderRadius: 12,
                border: '1px solid var(--bb-line)',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                boxShadow: 'var(--bb-shadow)',
                zIndex: 10,
                fontSize: 11,
              }}>
                <div style={{ fontWeight: 700, color: 'var(--bb-cocoa)', fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>
                  Pontszám
                </div>
                {[
                  { label: '4.7+', color: 'var(--bb-leaf-deep)' },
                  { label: '4.4–4.6', color: 'var(--bb-brick)' },
                  { label: '4.0–4.3', color: 'var(--bb-amber)' },
                  { label: '< 4.0', color: 'var(--bb-pecan)' },
                ].map((l) => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--bb-cocoa-2)' }}>
                    <span style={{ width: 9, height: 9, borderRadius: 999, background: l.color, flexShrink: 0 }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeView === 'leaderboard' && (
          <LeaderboardPlaceholder restaurants={restaurants} onSelect={handleSelect} />
        )}

        {activeView === 'profile' && (
          <ProfilePlaceholder />
        )}
      </div>

      {/* Restaurant detail modal */}
      {selectedRestaurant && !showSubmitReview && (
        <RestaurantDetail
          restaurant={selectedRestaurant}
          onClose={handleClose}
          onSubmitReview={() => setShowSubmitReview(true)}
        />
      )}

      {/* Footer */}
      <footer style={{
        padding: '8px 28px',
        background: 'var(--bb-paper)',
        borderTop: '1px solid var(--bb-line)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 11,
        color: 'var(--bb-cocoa-2)',
        flexShrink: 0,
      }}>
        <span>Nem hivatalos rajongói oldal · független értékelések</span>
        <Link href="/impresszum" style={{ color: 'var(--bb-cocoa-2)', textDecoration: 'none', fontWeight: 600 }}>
          Impresszum
        </Link>
      </footer>

      {/* Submit review */}
      {showSubmitReview && selectedRestaurant && (
        <SubmitReview
          restaurant={selectedRestaurant}
          onClose={() => setShowSubmitReview(false)}
          onSuccess={() => { setShowSubmitReview(false); setSelectedRestaurant(null); }}
        />
      )}
    </div>
  );
}

function LeaderboardPlaceholder({ restaurants, onSelect }: { restaurants: Restaurant[]; onSelect: (r: Restaurant) => void }) {
  const top10 = [...restaurants].sort((a, b) => b.score - a.score || b.reviews - a.reviews).slice(0, 10);
  const [first, second, third, ...rest] = top10;

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '32px 48px', background: 'var(--bb-cream)' }}>
      <h2 style={{ fontFamily: 'var(--font-fraunces, serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 32, color: 'var(--bb-cocoa)', margin: '0 0 28px' }}>
        Toplista
      </h2>

      {/* Podium */}
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginBottom: 24, justifyContent: 'center' }}>
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
                minWidth: 140,
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

function ProfilePlaceholder() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bb-cream)' }}>
      {/* Header band */}
      <div style={{ background: 'var(--bb-cocoa)', padding: '32px 48px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <div className="bb-avatar" style={{ width: 64, height: 64, fontSize: 22, background: 'var(--bb-amber)', color: 'var(--bb-cocoa)' }}>BD</div>
        <div>
          <div style={{ fontFamily: 'var(--font-fraunces, serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 24, color: 'var(--bb-paper)', marginBottom: 4 }}>
            Brownie Díjazó
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,250,240,0.65)' }}>Tag 2026 óta · Budapest</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          {[{ label: '0', sub: 'értékelés' }, { label: '0', sub: 'helyszín' }, { label: '0', sub: 'kedvelés' }].map((s) => (
            <div key={s.sub} style={{ textAlign: 'center', background: 'rgba(255,250,240,0.10)', padding: '12px 20px', borderRadius: 14 }}>
              <div style={{ fontFamily: 'var(--font-fraunces, serif)', fontWeight: 700, fontSize: 22, color: 'var(--bb-amber)' }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,250,240,0.65)' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '32px 48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'var(--bb-cocoa-2)' }}>
        <div style={{ fontSize: 48 }}>🍫</div>
        <div style={{ fontFamily: 'var(--font-fraunces, serif)', fontStyle: 'italic', fontSize: 20, color: 'var(--bb-cocoa)', fontWeight: 600 }}>Még nincs értékelésed</div>
        <div style={{ fontSize: 14 }}>Látogass meg egy helyszínt és értékeld a brownie-t!</div>
      </div>
    </div>
  );
}

