'use client';

import { useState, useEffect } from 'react';
import type { Restaurant } from '@/types';
import { BROWNIE_TAGS } from '@/lib/data';
import Icon from '@/components/ui/Icon';
import Stars from '@/components/ui/Stars';

interface SubmitReviewProps {
  restaurant: Restaurant;
  onClose: () => void;
  onSuccess: () => void;
}

interface AxisRowProps {
  label: string;
  hint: string;
  value: number;
  onChange: (n: number) => void;
}

function AxisRow({ label, hint, value, onChange }: AxisRowProps) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--bb-cocoa)' }}>{label}</div>
          <div style={{ fontSize: 11, color: 'var(--bb-cocoa-2)' }}>{hint}</div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--bb-cocoa-2)', minWidth: 24, textAlign: 'right' }}>
          {value > 0 ? `${value}/5` : '—'}
        </div>
      </div>
      <div style={{
        display: 'flex', gap: 4, padding: '12px 16px',
        background: 'var(--bb-paper)', borderRadius: 14,
        border: '1px solid var(--bb-line)',
        justifyContent: 'space-between',
      }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            style={{ background: 'transparent', border: 'none', padding: 2, cursor: 'pointer', lineHeight: 0 }}
          >
            <svg
              viewBox="0 0 24 24"
              width="32"
              height="32"
              style={{
                fill: n <= value ? 'var(--bb-amber)' : 'rgba(58,36,26,0.15)',
                transition: 'transform 120ms ease, fill 80ms ease',
                transform: n <= value ? 'scale(1)' : 'scale(0.88)',
              }}
            >
              <path d="M12 2.5l2.92 6.05 6.58.94-4.78 4.55 1.16 6.46L12 17.6l-5.88 2.9 1.16-6.46L2.5 9.49l6.58-.94L12 2.5z" />
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SubmitReview({ restaurant, onClose, onSuccess }: SubmitReviewProps) {
  const [step, setStep] = useState(1);
  const [taste, setTaste] = useState(0);
  const [texture, setTexture] = useState(0);
  const [iceCream, setIceCream] = useState(0);
  const [visitDate, setVisitDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [body, setBody] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const allRated = taste > 0 && texture > 0 && iceCream > 0;
  const avgScore = allRated ? ((taste + texture + iceCream) / 3) : 0;
  const toggleTag = (t: string) =>
    setTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSubmit = async () => {
    setSubmitting(true);
    // TODO: POST to Supabase once wired up
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    setShowSuccess(true);
    setTimeout(() => { setShowSuccess(false); onSuccess(); }, 2400);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(26,20,16,0.45)',
          backdropFilter: 'blur(2px)',
          zIndex: 40,
          animation: 'bb-fade 200ms ease both',
        }}
      />

      {/* Modal */}
      <div
        className="bb-rise"
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%', maxWidth: 480, maxHeight: '92vh',
          background: 'var(--bb-cream)',
          borderRadius: 'var(--bb-radius-xl)',
          overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          zIndex: 50,
          boxShadow: 'var(--bb-shadow-lg)',
        }}
      >
        {/* Header */}
        <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <button
              onClick={onClose}
              style={{
                background: 'var(--bb-paper)', border: '1px solid var(--bb-line)',
                width: 38, height: 38, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Icon name="x" size={18} />
            </button>
            <div style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 14, color: 'var(--bb-cocoa)' }}>
              Új értékelés · {step}/3
            </div>
            <div style={{ width: 38 }} />
          </div>

          {/* Progress bar */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  flex: 1, height: 3, borderRadius: 999,
                  background: s <= step ? 'var(--bb-brick)' : 'var(--bb-line)',
                  transition: 'background 300ms ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 24px' }}>

          {/* Step 1: Rate */}
          {step === 1 && (
            <>
              <h3 style={{ fontFamily: 'var(--font-fraunces, serif)', fontStyle: 'italic', fontSize: 22, fontWeight: 600, margin: '0 0 4px', color: 'var(--bb-cocoa)' }}>
                Mit gondoltál róla?
              </h3>
              <p style={{ fontSize: 13, color: 'var(--bb-cocoa-2)', margin: '0 0 20px', lineHeight: 1.5 }}>
                Értékeld három szempont szerint. Az átlag adja a végső pontot.
              </p>

              <AxisRow label="Íz"              hint="Mennyire volt csokis és kiegyensúlyozott?" value={taste}    onChange={setTaste} />
              <AxisRow label="Textúra"         hint="Szaftos vagy száraz? Megfelelő állag?"      value={texture}  onChange={setTexture} />
              <AxisRow label="Fagyi vízessége" hint="Frissen vagy elolvadva érkezett?"           value={iceCream} onChange={setIceCream} />

              {allRated && (
                <div style={{
                  background: 'var(--bb-cocoa)',
                  color: 'var(--bb-paper)',
                  borderRadius: 14,
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 16,
                  animation: 'bb-rise 300ms cubic-bezier(.2,.8,.2,1) both',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Átlag pontszám</span>
                  <span style={{ fontFamily: 'var(--font-fraunces, serif)', fontWeight: 700, fontSize: 24, color: 'var(--bb-amber)' }}>
                    {avgScore.toFixed(1)}
                  </span>
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--bb-cocoa-2)', display: 'block', marginBottom: 6 }}>
                  Mikor jártál ott?
                </label>
                <input
                  type="date"
                  className="bb-input"
                  value={visitDate}
                  max={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setVisitDate(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Step 2: Describe */}
          {step === 2 && (
            <>
              <h3 style={{ fontFamily: 'var(--font-fraunces, serif)', fontStyle: 'italic', fontSize: 22, fontWeight: 600, margin: '0 0 4px', color: 'var(--bb-cocoa)' }}>
                Mesélj róla
              </h3>
              <p style={{ fontSize: 13, color: 'var(--bb-cocoa-2)', margin: '0 0 16px', lineHeight: 1.5 }}>
                Milyen volt? Friss? Szaftos? Az állaga?
              </p>

              <div style={{ position: 'relative', marginBottom: 8 }}>
                <textarea
                  className="bb-textarea"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Pl. Kívül kissé ropogós, belül szaftos…"
                  style={{ minHeight: 112 }}
                />
              </div>
              <div style={{ fontSize: 11, color: body.length < 10 ? 'var(--bb-brick)' : 'var(--bb-cocoa-2)', textAlign: 'right', marginBottom: 16 }}>
                {body.length}/10 minimum
              </div>

              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--bb-cocoa-2)', marginBottom: 8 }}>Jelölők</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {BROWNIE_TAGS.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleTag(t)}
                    className={`bb-tag${tags.includes(t) ? ' active' : ''}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 3: Photo + summary */}
          {step === 3 && (
            <>
              <h3 style={{ fontFamily: 'var(--font-fraunces, serif)', fontStyle: 'italic', fontSize: 22, fontWeight: 600, margin: '0 0 4px', color: 'var(--bb-cocoa)' }}>
                Adj hozzá egy fotót
              </h3>
              <p style={{ fontSize: 13, color: 'var(--bb-cocoa-2)', margin: '0 0 16px', lineHeight: 1.5 }}>
                Opcionális — de a fotós értékeléseket 3× annyian olvassák.
              </p>

              {/* Upload area */}
              <div
                className="bb-photo-ph"
                style={{ height: 180, borderRadius: 18, marginBottom: 20, cursor: 'pointer', flexDirection: 'column', gap: 8 }}
              >
                <Icon name="camera" size={28} color="var(--bb-cocoa-2)" />
                <span>Koppints a fotó hozzáadásához</span>
              </div>

              {/* Summary card */}
              <div className="bb-card" style={{ padding: 16, marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontFamily: 'var(--font-fraunces, serif)', fontWeight: 700, fontSize: 28, color: 'var(--bb-cocoa)' }}>
                    {avgScore.toFixed(1)}
                  </span>
                  <Stars value={avgScore} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--bb-cocoa-2)', marginBottom: 10 }}>
                  Íz {taste}/5 · Textúra {texture}/5 · Fagyi {iceCream}/5
                </div>
                <p style={{ fontSize: 13, color: 'var(--bb-cocoa)', lineHeight: 1.5, margin: '0 0 10px' }}>{body}</p>
                {tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {tags.map((t) => <span key={t} className="bb-chip" style={{ fontSize: 11 }}>#{t}</span>)}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer actions */}
        <div style={{ padding: '12px 18px 20px', borderTop: '1px solid var(--bb-line)', display: 'flex', gap: 10, flexShrink: 0 }}>
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} className="bb-btn bb-btn-ghost" style={{ flex: 1 }}>
              Vissza
            </button>
          )}
          {step < 3 && (
            <button
              onClick={() => setStep(step + 1)}
              className="bb-btn bb-btn-primary"
              disabled={step === 1 ? !allRated : body.length < 10}
              style={{ flex: 2, opacity: (step === 1 ? !allRated : body.length < 10) ? 0.45 : 1 }}
            >
              Tovább
            </button>
          )}
          {step === 3 && (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bb-btn bb-btn-primary"
              style={{ flex: 2, opacity: submitting ? 0.7 : 1 }}
            >
              {submitting ? 'Beküldés…' : 'Beküldés'}
            </button>
          )}
        </div>
      </div>

      {/* Toast */}
      {showSuccess && (
        <div style={{
          position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--bb-cocoa)', color: 'var(--bb-paper)',
          padding: '12px 24px', borderRadius: 999,
          fontWeight: 600, fontSize: 14,
          boxShadow: 'var(--bb-shadow-lg)',
          zIndex: 60,
          animation: 'bb-rise 320ms cubic-bezier(.2,.8,.2,1) both',
          whiteSpace: 'nowrap',
        }}>
          Köszönjük az értékelést! 🍫
        </div>
      )}
    </>
  );
}
