'use client';

import { useState } from 'react';
import Modal from './Modal';
import Icon from './Icon';

interface ShareCardModalProps {
  reviewId: string;
  restaurantName: string;
  onClose: () => void;
}

export default function ShareCardModal({ reviewId, restaurantName, onClose }: ShareCardModalProps) {
  const [busy, setBusy] = useState(false);
  const cardUrl = `${window.location.origin}/api/card?review=${reviewId}`;

  const download = (blob: Blob) => {
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u;
    a.download = 'brownie-ertekeles.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(u), 1000);
  };

  const shareImage = async () => {
    setBusy(true);
    try {
      const blob = await (await fetch(cardUrl)).blob();
      const file = new File([blob], 'brownie-ertekeles.png', { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'BrownieBíró', text: `${restaurantName} — az értékelésem a BrownieBírón 🍫` });
      } else {
        download(blob);
      }
    } catch { /* user cancelled or network — nothing to do */ }
    setBusy(false);
  };

  const downloadImage = async () => {
    setBusy(true);
    try { download(await (await fetch(cardUrl)).blob()); } catch { /* ignore */ }
    setBusy(false);
  };

  return (
    <Modal onClose={onClose} maxWidth={460}>
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-fraunces, serif)', fontStyle: 'italic', fontSize: 20, fontWeight: 600, color: 'var(--bb-cocoa)' }}>
            Oszd meg az értékelésed
          </h3>
          <button onClick={onClose} aria-label="Bezárás" style={{ background: 'var(--bb-paper)', border: '1px solid var(--bb-line)', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Icon name="x" size={16} />
          </button>
        </div>

        {/* Live preview of the generated card */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cardUrl} alt="Értékelés kártya" style={{ width: '100%', borderRadius: 12, border: '1px solid var(--bb-line)', display: 'block', background: 'var(--bb-cream-2)' }} />

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={shareImage} disabled={busy} className="bb-btn bb-btn-primary" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: busy ? 0.6 : 1 }}>
            <Icon name="share" size={15} color="currentColor" /> {busy ? 'Kép…' : 'Megosztás'}
          </button>
          <button onClick={downloadImage} disabled={busy} className="bb-btn bb-btn-ghost" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, opacity: busy ? 0.6 : 1 }}>
            <Icon name="check" size={15} color="currentColor" /> Letöltés
          </button>
        </div>
      </div>
    </Modal>
  );
}
