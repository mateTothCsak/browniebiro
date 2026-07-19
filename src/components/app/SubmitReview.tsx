'use client';

import { useState, useEffect, type ChangeEvent } from 'react';
import type { Restaurant } from '@/types';
import { BROWNIE_TAGS } from '@/lib/data';
import { createClient } from '@/utils/supabase/client';
import Icon from '@/components/ui/Icon';
import Stars from '@/components/ui/Stars';
import Modal from '@/components/ui/Modal';

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
  const [error, setError] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const allRated = taste > 0 && texture > 0 && iceCream > 0;
  const avgScore = allRated ? ((taste + texture + iceCream) / 3) : 0;
  const toggleTag = (t: string) =>
    setTags((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);

  // Revoke the preview object URL when it changes / unmounts
  useEffect(() => {
    return () => { if (photoPreview) URL.revokeObjectURL(photoPreview); };
  }, [photoPreview]);

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) { setError('A kép legfeljebb 5 MB lehet.'); return; }
    setError(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
  };

  const clearPhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSubmitting(false);
      setError('A beküldéshez be kell jelentkezned.');
      return;
    }

    // Upload the photo first (if any) so we can store its URL on the review
    let photo_url: string | null = null;
    if (photoFile) {
      const ext = ({ 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' } as Record<string, string>)[photoFile.type] ?? 'jpg';
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('review-photos')
        .upload(path, photoFile, { contentType: photoFile.type, upsert: false });
      if (upErr) {
        setSubmitting(false);
        setError('A fotó feltöltése nem sikerült. Próbáld újra, vagy küldd be fotó nélkül.');
        return;
      }
      photo_url = supabase.storage.from('review-photos').getPublicUrl(path).data.publicUrl;
    }

    const { error: insertError } = await supabase.from('reviews').insert({
      restaurant_id: restaurant.id,
      user_id: user.id,
      taste,
      texture,
      ice_cream: iceCream,
      body: body.trim(),
      visit_date: visitDate,
      tags,
      photo_url,
    });

    setSubmitting(false);
    if (insertError) {
      setError(
        insertError.code === '23505'
          ? 'Ma már értékelted ezt a helyszínt — gyere vissza holnap! 🍫'
          : 'Nem sikerült beküldeni az értékelést. Próbáld újra később.',
      );
      return;
    }

    setShowSuccess(true);
    setTimeout(() => { setShowSuccess(false); onSuccess(); }, 2000);
  };

  return (
    <>
      <Modal onClose={onClose} maxHeight="92vh">
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
                Összegzés
              </h3>
              <p style={{ fontSize: 13, color: 'var(--bb-cocoa-2)', margin: '0 0 16px', lineHeight: 1.5 }}>
                Nézd át az értékelésed, aztán küldd be.
              </p>

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

              {/* Photo (optional) */}
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--bb-cocoa-2)', marginBottom: 8 }}>
                  Fotó a brownie-ról (opcionális)
                </div>
                {photoPreview ? (
                  <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--bb-line)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photoPreview} alt="Előnézet" style={{ width: '100%', maxHeight: 220, objectFit: 'cover', display: 'block' }} />
                    <button
                      onClick={clearPhoto}
                      aria-label="Fotó eltávolítása"
                      style={{
                        position: 'absolute', top: 8, right: 8,
                        width: 30, height: 30, borderRadius: '50%',
                        background: 'rgba(26,20,16,0.6)', color: 'var(--bb-paper)',
                        border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <Icon name="x" size={16} color="currentColor" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="review-photo"
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                      padding: '22px 16px', borderRadius: 14,
                      border: '1.5px dashed var(--bb-line-strong)',
                      background: 'var(--bb-paper)', color: 'var(--bb-cocoa-2)',
                      cursor: 'pointer', fontSize: 13, fontWeight: 600, textAlign: 'center',
                    }}
                  >
                    <Icon name="camera" size={22} color="var(--bb-cocoa-2)" />
                    Fotó hozzáadása
                    <span style={{ fontSize: 11, fontWeight: 500 }}>JPG, PNG vagy WEBP · max 5 MB</span>
                    <input id="review-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhoto} style={{ display: 'none' }} />
                  </label>
                )}
              </div>
            </>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ padding: '10px 18px 0', fontSize: 13, fontWeight: 600, color: 'var(--bb-brick)', textAlign: 'center', flexShrink: 0 }}>
            {error}
          </div>
        )}

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
      </Modal>

      {/* Toast — outer div does the horizontal centering via flex so the
          inner pill's bb-rise transform doesn't fight a translateX. */}
      {showSuccess && (
        <div style={{
          position: 'fixed', bottom: 32, left: 0, right: 0,
          display: 'flex', justifyContent: 'center',
          zIndex: 60, pointerEvents: 'none',
        }}>
          <div className="bb-rise" style={{
            background: 'var(--bb-cocoa)', color: 'var(--bb-paper)',
            padding: '12px 24px', borderRadius: 999,
            fontWeight: 600, fontSize: 14,
            boxShadow: 'var(--bb-shadow-lg)',
            whiteSpace: 'nowrap',
          }}>
            Köszönjük az értékelést! 🍫
          </div>
        </div>
      )}
    </>
  );
}
