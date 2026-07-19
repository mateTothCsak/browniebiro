'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { Restaurant, ActiveView } from '@/types';
import { useUser } from '@/hooks/useUser';
import { useIsMobile } from '@/hooks/useIsMobile';
import { signInWithGoogle } from '@/lib/auth';
import TopBar from './TopBar';
import RestaurantSidebar from './RestaurantSidebar';
import RestaurantDetail from './RestaurantDetail';
import SubmitReview from './SubmitReview';
import Leaderboard from './Leaderboard';
import ProfileView from './ProfileView';

const LeafletMap = dynamic(() => import('@/components/map/LeafletMap'), { ssr: false });

interface AppShellProps {
  restaurants: Restaurant[];
  live: boolean;
}

const keyOf = (r: Restaurant) => r.slug ?? r.id;

export default function AppShell({ restaurants, live }: AppShellProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useUser();
  const isMobile = useIsMobile();

  const [activeView, setActiveView] = useState<ActiveView>('map');
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('q') ?? '');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(() => {
    const focusId = searchParams.get('focus');
    return focusId ? (restaurants.find((r) => keyOf(r) === focusId) ?? null) : null;
  });
  const [showSubmitReview, setShowSubmitReview] = useState(false);

  // Sync search query to URL. history.replaceState instead of router.replace:
  // the page is force-dynamic, so router.replace would re-render the server
  // component (and re-query the DB) on every keystroke.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (searchQuery) params.set('q', searchQuery); else params.delete('q');
    if (selectedRestaurant) params.set('focus', keyOf(selectedRestaurant)); else params.delete('focus');
    const qs = params.toString();
    window.history.replaceState(null, '', qs ? `?${qs}` : window.location.pathname);
  }, [searchQuery, selectedRestaurant]);

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', overflow: 'hidden' }}>
      <TopBar
        activeView={activeView}
        onViewChange={setActiveView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        user={user}
        onLogin={signInWithGoogle}
        isMobile={isMobile}
      />

      {!live && (
        <div style={{
          background: 'var(--bb-amber)', color: 'var(--bb-cocoa)',
          fontSize: 12, fontWeight: 600, textAlign: 'center', padding: '6px 12px', flexShrink: 0,
        }}>
          Demó adatok — az adatbázis jelenleg nem elérhető, az értékelések beküldése nem működik.
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row', overflow: 'hidden' }}>
        {activeView === 'map' && (isMobile ? (
          <>
            {/* Mobile: map on top, list scrolls below */}
            <div style={{ height: '42vh', position: 'relative', flexShrink: 0, overflow: 'hidden', isolation: 'isolate' }}>
              <LeafletMap
                restaurants={filtered}
                selectedId={selectedRestaurant?.id ?? null}
                onSelect={handleSelect}
              />
            </div>
            <RestaurantSidebar
              restaurants={filtered}
              selectedId={selectedRestaurant?.id ?? null}
              onSelect={handleSelect}
              totalCount={restaurants.length}
              isMobile
            />
          </>
        ) : (
          <>
            <RestaurantSidebar
              restaurants={filtered}
              selectedId={selectedRestaurant?.id ?? null}
              onSelect={handleSelect}
              totalCount={restaurants.length}
            />

            {/* Map area — `isolation: isolate` traps Leaflet's high internal
                z-indexes in their own stacking context, so map layers can't
                paint over the modal/backdrop overlays (which sit above it). */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', isolation: 'isolate' }}>
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
                  Jelmagyarázat
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--bb-cocoa-2)' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brownie.png" width={16} height={16} alt="" style={{ flexShrink: 0 }} />
                  Brownie-helyszín
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: 'var(--bb-cocoa-2)' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--bb-brick)', border: '1.5px solid var(--bb-paper)', flexShrink: 0 }} />
                  Már van értékelés
                </div>
              </div>
            </div>
          </>
        ))}

        {activeView === 'leaderboard' && (
          <Leaderboard restaurants={restaurants} onSelect={handleSelect} isMobile={isMobile} />
        )}

        {activeView === 'profile' && (
          <ProfileView user={user} onLogin={signInWithGoogle} isMobile={isMobile} />
        )}
      </div>

      {/* Restaurant detail modal */}
      {selectedRestaurant && !showSubmitReview && (
        <RestaurantDetail
          restaurant={selectedRestaurant}
          live={live}
          user={user}
          onClose={handleClose}
          onSubmitReview={handleStartReview}
        />
      )}

      {/* Footer */}
      <footer style={{
        padding: isMobile ? '6px 14px' : '8px 28px',
        background: 'var(--bb-paper)',
        borderTop: '1px solid var(--bb-line)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        fontSize: isMobile ? 10 : 11,
        color: 'var(--bb-cocoa-2)',
        flexShrink: 0,
      }}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {isMobile ? 'Nem hivatalos rajongói oldal' : 'Nem hivatalos rajongói oldal · független értékelések'}
        </span>
        <Link href="/impresszum" style={{ color: 'var(--bb-cocoa-2)', textDecoration: 'none', fontWeight: 600, flexShrink: 0 }}>
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

