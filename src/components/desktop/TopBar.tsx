'use client';

import BrandMark from '@/components/ui/BrandMark';
import Icon from '@/components/ui/Icon';
import type { ActiveView } from '@/types';

interface TopBarProps {
  activeView: ActiveView;
  onViewChange: (v: ActiveView) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const NAV: { id: ActiveView; icon: string; label: string }[] = [
  { id: 'map',         icon: 'map',    label: 'Térkép' },
  { id: 'leaderboard', icon: 'trophy', label: 'Toplista' },
  { id: 'profile',     icon: 'user',   label: 'Profil' },
];

export default function TopBar({ activeView, onViewChange, searchQuery, onSearchChange }: TopBarProps) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '14px 28px',
      background: 'var(--bb-paper)',
      borderBottom: '1px solid var(--bb-line)',
      flexShrink: 0,
      gap: 24,
      zIndex: 10,
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <BrandMark size={28} color="var(--bb-brick)" />
        <h1 style={{
          margin: 0,
          fontFamily: 'var(--font-fraunces, serif)',
          fontStyle: 'italic',
          fontWeight: 600,
          fontSize: 22,
          letterSpacing: '-0.01em',
          color: 'var(--bb-cocoa)',
        }}>
          BrownieBíró
        </h1>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', gap: 4 }}>
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            style={{
              background: activeView === item.id ? 'var(--bb-ink)' : 'transparent',
              color: activeView === item.id ? 'var(--bb-paper)' : 'var(--bb-cocoa-2)',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 999,
              fontWeight: 600,
              fontSize: 13,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              transition: 'background 120ms ease, color 120ms ease',
            }}
          >
            <Icon
              name={item.icon}
              size={15}
              color={activeView === item.id ? 'var(--bb-paper)' : 'var(--bb-cocoa-2)'}
            />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Search */}
      <div style={{ flex: 1, maxWidth: 420, position: 'relative' }}>
        <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', display: 'flex', pointerEvents: 'none' }}>
          <Icon name="search" size={15} color="var(--bb-cocoa-2)" />
        </span>
        <input
          className="bb-input"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Keress várost vagy helyszínt…"
          style={{
            paddingLeft: 36,
            paddingTop: 9,
            paddingBottom: 9,
            borderRadius: 999,
            background: 'var(--bb-cream)',
          }}
        />
      </div>

      {/* Avatar */}
      <div className="bb-avatar" style={{ background: 'var(--bb-cocoa)', color: 'var(--bb-amber)', cursor: 'pointer' }}>
        BD
      </div>
    </header>
  );
}
