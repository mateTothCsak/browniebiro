'use client';

import { useState } from 'react';
import type { User } from '@supabase/supabase-js';
import Icon from '@/components/ui/Icon';
import type { ActiveView } from '@/types';
import { signOut, displayName, initials } from '@/lib/auth';

interface TopBarProps {
  activeView: ActiveView;
  onViewChange: (v: ActiveView) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  user: User | null;
  onLogin: () => void;
  isMobile?: boolean;
}

const NAV: { id: ActiveView; icon: string; label: string }[] = [
  { id: 'map',         icon: 'map',    label: 'Térkép' },
  { id: 'leaderboard', icon: 'trophy', label: 'Toplista' },
  { id: 'profile',     icon: 'user',   label: 'Profil' },
];

export default function TopBar({ activeView, onViewChange, searchQuery, onSearchChange, user, onLogin, isMobile = false }: TopBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const brandEl = (
    <div
      onClick={() => onViewChange('map')}
      role="button"
      aria-label="Főoldal"
      style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0, cursor: 'pointer' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo-judge.png" alt="BrownieBíró logó" width={isMobile ? 34 : 40} height={isMobile ? 34 : 40} style={{ flexShrink: 0, display: 'block' }} />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h1 style={{
          margin: 0,
          fontFamily: 'var(--font-fraunces, serif)',
          fontStyle: 'italic',
          fontWeight: 600,
          fontSize: isMobile ? 19 : 22,
          letterSpacing: '-0.01em',
          color: 'var(--bb-cocoa)',
          lineHeight: 1.1,
        }}>
          BrownieBíró
        </h1>
        <div style={{ fontSize: isMobile ? 10 : 11, fontWeight: 600, color: 'var(--bb-cocoa-2)' }}>
          A legjobb Burger King brownie nyomában
        </div>
      </div>
    </div>
  );

  const navEl = (
    <nav style={{ display: 'flex', gap: 4, flex: isMobile ? 1 : 'none' }}>
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
            justifyContent: 'center',
            gap: 6,
            cursor: 'pointer',
            flex: isMobile ? 1 : 'none',
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
  );

  const searchEl = (
    <div style={{ flex: isMobile ? 'none' : 1, width: isMobile ? '100%' : undefined, maxWidth: isMobile ? undefined : 420, position: 'relative' }}>
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
  );

  const authEl = user ? (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setMenuOpen((o) => !o)}
        aria-label="Profil menü"
        style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
      >
        <div className="bb-avatar" style={{ background: 'var(--bb-cocoa)', color: 'var(--bb-amber)' }}>
          {initials(displayName(user))}
        </div>
      </button>

      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 25 }}
        />
      )}
      {menuOpen && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 10px)',
          background: 'var(--bb-paper)',
          border: '1px solid var(--bb-line)',
          borderRadius: 14,
          boxShadow: 'var(--bb-shadow-lg)',
          padding: 8,
          minWidth: 200,
          zIndex: 30,
        }}>
          <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--bb-line)', marginBottom: 6 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--bb-cocoa)' }}>{displayName(user)}</div>
            <div style={{ fontSize: 11, color: 'var(--bb-cocoa-2)', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.email}</div>
          </div>
          <button
            onClick={() => { setMenuOpen(false); onViewChange('profile'); }}
            style={{
              width: '100%', textAlign: 'left',
              background: 'transparent', border: 'none',
              padding: '8px 10px', borderRadius: 10,
              fontSize: 13, fontWeight: 600, color: 'var(--bb-cocoa)',
              cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
          >
            <Icon name="user" size={15} color="var(--bb-cocoa-2)" />
            Profilom
          </button>
          <button
            onClick={() => { setMenuOpen(false); signOut(); }}
            style={{
              width: '100%', textAlign: 'left',
              background: 'transparent', border: 'none',
              padding: '8px 10px', borderRadius: 10,
              fontSize: 13, fontWeight: 600, color: 'var(--bb-brick)',
              cursor: 'pointer',
            }}
          >
            Kijelentkezés
          </button>
        </div>
      )}
    </div>
  ) : (
    <button
      onClick={onLogin}
      className="bb-btn bb-btn-primary"
      style={{ flexShrink: 0, padding: '9px 18px', borderRadius: 999, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 7 }}
    >
      <Icon name="user" size={14} color="currentColor" />
      Belépés
    </button>
  );

  if (isMobile) {
    return (
      <header style={{
        display: 'flex', flexDirection: 'column',
        padding: '10px 14px', gap: 10,
        background: 'var(--bb-paper)',
        borderBottom: '1px solid var(--bb-line)',
        flexShrink: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          {brandEl}
          {authEl}
        </div>
        {searchEl}
        {navEl}
      </header>
    );
  }

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
      {brandEl}
      {navEl}
      {searchEl}
      {authEl}
    </header>
  );
}
