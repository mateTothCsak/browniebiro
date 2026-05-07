'use client';

import Stars from '@/components/ui/Stars';
import Icon from '@/components/ui/Icon';
import type { Restaurant } from '@/types';

interface RestaurantSidebarProps {
  restaurants: Restaurant[];
  selectedId: string | null;
  onSelect: (r: Restaurant) => void;
  totalCount: number;
}

export default function RestaurantSidebar({ restaurants, selectedId, onSelect, totalCount }: RestaurantSidebarProps) {
  return (
    <aside style={{
      width: 380,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--bb-paper)',
      borderRight: '1px solid var(--bb-line)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--bb-line)', flexShrink: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--bb-cocoa-2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
          {totalCount} helyszín
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h2 style={{
            margin: 0,
            fontFamily: 'var(--font-fraunces, serif)',
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: 20,
            color: 'var(--bb-cocoa)',
          }}>
            Magyarország
          </h2>
          <span style={{ fontSize: 12, color: 'var(--bb-cocoa-2)', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Icon name="filter" size={12} />
            Pontszám szerint
          </span>
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {restaurants.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--bb-cocoa-2)' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🔎</div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Nincs találat</div>
            <div style={{ fontSize: 13 }}>Próbálj egy másik várost vagy nevet.</div>
          </div>
        ) : (
          restaurants.map((r) => (
            <SidebarItem
              key={r.id}
              restaurant={r}
              isSelected={r.id === selectedId}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </aside>
  );
}

function SidebarItem({ restaurant: r, isSelected, onSelect }: {
  restaurant: Restaurant;
  isSelected: boolean;
  onSelect: (r: Restaurant) => void;
}) {
  return (
    <div
      onClick={() => onSelect(r)}
      style={{
        display: 'grid',
        gridTemplateColumns: '56px 1fr auto',
        gap: 12,
        alignItems: 'center',
        padding: '10px 12px',
        borderRadius: 14,
        background: isSelected ? 'var(--bb-cream-2)' : 'var(--bb-cream)',
        border: `1px solid ${isSelected ? 'var(--bb-line-strong)' : 'var(--bb-line)'}`,
        cursor: 'pointer',
        transition: 'background 120ms ease',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--bb-cream-2)';
      }}
      onMouseLeave={(e) => {
        if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'var(--bb-cream)';
      }}
    >
      {/* Thumbnail placeholder */}
      <div className="bb-photo-ph" style={{ width: 56, height: 56, fontSize: 8, borderRadius: 10, flexShrink: 0 }}>
        foto
      </div>

      {/* Info */}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--bb-cocoa)', marginBottom: 3 }}>
          {r.name}
        </div>
        <div style={{ fontSize: 12, color: 'var(--bb-cocoa-2)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Stars value={r.score} />
          <span>{r.score.toFixed(1)}</span>
          <span>· {r.reviews} értékelés</span>
        </div>
        {r.district && (
          <div style={{ fontSize: 11, color: 'var(--bb-cocoa-2)', marginTop: 2 }}>{r.district}</div>
        )}
      </div>

      {/* Score pill */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
        <span className="score-pill">{r.score.toFixed(1)}</span>
      </div>
    </div>
  );
}
