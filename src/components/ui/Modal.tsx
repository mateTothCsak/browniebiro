'use client';

import { useEffect, type ReactNode } from 'react';

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
  maxWidth?: number;
  maxHeight?: string;
}

/**
 * Centered modal overlay. Centers via flexbox (NOT a transform) so the panel's
 * `bb-rise` entrance animation can't clobber the positioning — the bug that
 * previously threw the detail/submit panels off-screen. Closes on backdrop
 * click and Escape.
 */
export default function Modal({ onClose, children, maxWidth = 480, maxHeight = '90vh' }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 40,
        background: 'rgba(26,20,16,0.45)',
        backdropFilter: 'blur(2px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        animation: 'bb-fade 200ms ease both',
      }}
    >
      <div
        className="bb-rise"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth,
          maxHeight,
          background: 'var(--bb-cream)',
          borderRadius: 'var(--bb-radius-xl)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--bb-shadow-lg)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
