'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import type { Restaurant, ActiveView } from '@/types';
import { useUser } from '@/hooks/useUser';
import { signInWithGoogle, signOut, displayName, initials } from '@/lib/auth';
import { createClient } from '@/utils/supabase/client';
import TopBar from './TopBar';
import RestaurantSidebar from './RestaurantSidebar';
import RestaurantDetail from './RestaurantDetail';
import SubmitReview from './SubmitReview';

const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), { ssr: false });

interface DesktopAppProps {
  restaurants: Restaurant[];
  live: boolean;
}

const keyOf = (r: Restaurant) => r.slug ?? r.id;

export default function DesktopApp({ restaurants, live }: DesktopAppProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useUser();

  const [activeView, setActiveView] = useState<ActiveView>('map');
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') ?? '');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(() => {
    const focusId = searchParams.get('focus');
    return focusId ? (restaurants.find((r) => keyOf(r) === focusId) ?? null) : null;
  });
  const [showSubmitReview, setShowSubmitReview] = useState(false);

  // Sync search query to URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery) params.set('q', searchQuery); else params.delete('q');
    if (selectedRestaurant) params.set('focus', keyOf(selectedRestaurant)); else params.delete('focus');
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [searchQuery, selectedRestaurant]); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return restaurants
      .filter((r) => !q || r.name.toLowerCase().includes(q) || r.city.toLowerCase().includes(q))
      .sort((a, b) => b.score - a.score || b.reviews - a.reviews || a.name.localeCompare(b.name, 'hu'));
  }, [restaurants, searchQuery]);

  const handleSelect = useCallback((r: Restaurant) => {
    setSelectedRestaurant(r);
  }, []);

  const handleClose = useCallback(() => {
    setSelectedRestaurant(null);
    setShowSubmitReview(false);
  }, []);

  // Not logged in → review CTA starts the Google login instead
  const handleStartReview = useCallback(() => {
    if (!user) {
      signInWithGoogle();
      return;
    }
    setShowSubmitReview(true);
  }, [user]);

  const handleReviewSuccess = useCallback(() => {
    setShowSubmitReview(false);
    setSelectedRestaurant(null);
    router.refresh(); // re-fetch restaurant_stats so the new score shows up
  }, [router]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <TopBar
        activeView={activeView}
        onViewChange={setActiveView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        user={user}
        onLogin={signInWithGoogle}
      />

      {!live && (
        <div style={{
          background: 'var(--bb-amber)', color: 'var(--bb-cocoa)',
          fontSize: 12, fontWeight: 600, textAlign: 'center', padding: '6px 12px', flexShrink: 0,
        }}>
          Demó adatok — az adatbázis jelenleg nem elérhető, az értékelések beküldése nem működik.
        </div>
      )}

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
                  { label: 'Nincs még értékelés', color: 'var(--bb-cocoa-2)' },
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
          <Leaderboard restaurants={restaurants} onSelect={handleSelect} />
        )}

        {activeView === 'profile' && (
          <ProfileView user={user} onLogin={signInWithGoogle} />
        )}
      </div>

      {/* Restaurant detail modal */}
      {selectedRestaurant && !showSubmitReview && (
        <RestaurantDetail
          restaurant={selectedRestaurant}
          live={live}
          onClose={handleClose}
          onSubmitReview={handleStartReview}
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
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
}

function Leaderboard({ restaurants, onSelect }: { restaurants: Restaurant[]; onSelect: (r: Restaurant) => void }) {
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

function ProfileView({ user, onLogin }: { user: User | null; onLogin: () => void }) {
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
      });
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
      <div style={{ background: 'var(--bb-cocoa)', padding: '32px 48px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <div className="bb-avatar" style={{ width: 64, height: 64, fontSize: 22, background: 'var(--bb-amber)', color: 'var(--bb-cocoa)' }}>
          {initials(name)}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-fraunces, serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 24, color: 'var(--bb-paper)', marginBottom: 4 }}>
            {name}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,250,240,0.65)' }}>Tag {memberSince} óta</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
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
      <div style={{ flex: 1, padding: '32px 48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'var(--bb-cocoa-2)' }}>
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
