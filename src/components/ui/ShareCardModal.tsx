'use client';

import { useState } from 'react';
import Modal from './Modal';
import Icon from './Icon';

interface ShareCardModalProps {
  reviewId: string;
  onClose: () => void;
}

export default function ShareCardModal({ reviewId, onClose }: ShareCardModalProps) {
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

        {/* Live preview of the generated card (portrait — cap height so the
            buttons stay visible on small screens). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cardUrl} alt="Értékelés kártya" style={{ width: '100%', maxHeight: '56vh', objectFit: 'contain', borderRadius: 12, border: '1px solid var(--bb-line)', display: 'block', background: 'var(--bb-cream-2)' }} />

        <button onClick={downloadImage} disabled={busy} className="bb-btn bb-btn-primary" style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 7, opacity: busy ? 0.6 : 1 }}>
          <Icon name="download" size={16} color="currentColor" /> {busy ? 'Kép előkészítése…' : 'Kép letöltése'}
        </button>
        <div style={{ fontSize: 12, color: 'var(--bb-cocoa-2)', textAlign: 'center', marginTop: -4 }}>
          Töltsd le a képet, és oszd meg a barátaiddal!
        </div>
      </div>
    </Modal>
  );
}
