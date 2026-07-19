'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import Modal from './Modal';
import Icon from './Icon';

interface ShareModalProps {
  url: string;
  title: string;
  heading?: string;
  subtitle?: string;
  onClose: () => void;
}

export default function ShareModal({ url, title, heading = 'Megosztás', subtitle, onClose }: ShareModalProps) {
  const [qr, setQr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  // Safe: ShareModal only mounts client-side (after a click), never during SSR.
  const canShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  useEffect(() => {
    QRCode.toDataURL(url, { width: 220, margin: 1, color: { dark: '#3a241a', light: '#fffaf0' } })
      .then(setQr)
      .catch(() => setQr(null));
  }, [url]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard blocked — the QR / share button still work */ }
  };

  const nativeShare = async () => {
    try { await navigator.share({ title, url }); } catch { /* user cancelled */ }
  };

  const prettyUrl = url.replace(/^https?:\/\//, '');

  return (
    <Modal onClose={onClose} maxWidth={360}>
      <div style={{ padding: '18px 20px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontFamily: 'var(--font-fraunces, serif)', fontStyle: 'italic', fontSize: 20, fontWeight: 600, color: 'var(--bb-cocoa)' }}>
            {heading}
          </h3>
          <button
            onClick={onClose}
            aria-label="Bezárás"
            style={{ background: 'var(--bb-paper)', border: '1px solid var(--bb-line)', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        {subtitle && (
          <div style={{ fontSize: 13, color: 'var(--bb-cocoa-2)', textAlign: 'center', marginTop: -4 }}>{subtitle}</div>
        )}

        {qr && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={qr} alt="QR kód" width={200} height={200} style={{ borderRadius: 14, border: '1px solid var(--bb-line)' }} />
        )}

        <div style={{ fontSize: 12, color: 'var(--bb-cocoa-2)', wordBreak: 'break-all', textAlign: 'center' }}>{prettyUrl}</div>

        <div style={{ display: 'flex', gap: 8, width: '100%' }}>
          <button onClick={copy} className="bb-btn bb-btn-ghost" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Icon name={copied ? 'check' : 'edit'} size={15} color="currentColor" />
            {copied ? 'Másolva!' : 'Link másolása'}
          </button>
          {canShare && (
            <button onClick={nativeShare} className="bb-btn bb-btn-primary" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Icon name="share" size={15} color="currentColor" />
              Megosztás
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
