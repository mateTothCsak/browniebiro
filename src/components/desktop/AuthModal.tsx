'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/Icon';
import { signInWithEmail, signUpWithEmail } from '@/lib/auth';

interface AuthModalProps {
  onClose: () => void;
}

type Mode = 'login' | 'signup';

function friendlyError(message: string): string {
  if (message.includes('Invalid login credentials')) return 'Hibás email-cím vagy jelszó.';
  if (message.includes('already registered')) return 'Ezzel az email-címmel már regisztráltak. Lépj be!';
  if (message.includes('Password should be')) return 'A jelszó legyen legalább 6 karakter.';
  if (message.includes('valid email')) return 'Adj meg egy érvényes email-címet.';
  if (message.includes('rate limit')) return 'Túl sok próbálkozás — várj egy kicsit, majd próbáld újra.';
  return 'Nem sikerült — próbáld újra később.';
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmSent, setConfirmSent] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const canSubmit = email.includes('@') && password.length >= 6 && !busy;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setBusy(true);
    setError(null);

    if (mode === 'login') {
      const { error: err } = await signInWithEmail(email, password);
      setBusy(false);
      if (err) { setError(friendlyError(err.message)); return; }
      onClose(); // useUser picks up the session via onAuthStateChange
    } else {
      const { data, error: err } = await signUpWithEmail(email, password, name.trim());
      setBusy(false);
      if (err) { setError(friendlyError(err.message)); return; }
      if (data.session) {
        onClose(); // email confirmation disabled — logged in immediately
      } else {
        setConfirmSent(true); // confirmation required — tell them to check their inbox
      }
    }
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
          width: '100%', maxWidth: 400,
          background: 'var(--bb-cream)',
          borderRadius: 'var(--bb-radius-xl)',
          padding: '20px 22px 24px',
          zIndex: 50,
          boxShadow: 'var(--bb-shadow-lg)',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ flex: 1, margin: 0, fontFamily: 'var(--font-fraunces, serif)', fontStyle: 'italic', fontSize: 22, fontWeight: 600, color: 'var(--bb-cocoa)' }}>
            {mode === 'login' ? 'Belépés' : 'Regisztráció'}
          </h3>
          <button
            onClick={onClose}
            aria-label="Bezárás"
            style={{
              background: 'var(--bb-paper)', border: '1px solid var(--bb-line)',
              width: 34, height: 34, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <Icon name="x" size={16} />
          </button>
        </div>

        {confirmSent ? (
          <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>📬</div>
            <div style={{ fontWeight: 700, color: 'var(--bb-cocoa)', marginBottom: 4 }}>Nézd meg a postaládád!</div>
            <div style={{ fontSize: 13, color: 'var(--bb-cocoa-2)', lineHeight: 1.5 }}>
              Küldtünk egy megerősítő linket a(z) <strong>{email}</strong> címre.
              Kattints rá, és már bírálhatsz is.
            </div>
          </div>
        ) : (
          <>
            {mode === 'signup' && (
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--bb-cocoa-2)', display: 'block', marginBottom: 6 }}>
                  Név (ez jelenik meg az értékeléseidnél)
                </label>
                <input
                  className="bb-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Pl. Brownie Béla"
                  autoComplete="name"
                />
              </div>
            )}

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--bb-cocoa-2)', display: 'block', marginBottom: 6 }}>
                Email
              </label>
              <input
                className="bb-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="te@email.hu"
                autoComplete="email"
              />
            </div>

            <div style={{ marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--bb-cocoa-2)', display: 'block', marginBottom: 6 }}>
                Jelszó
              </label>
              <input
                className="bb-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                placeholder="Legalább 6 karakter"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {error && (
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--bb-brick)', margin: '10px 0 0', textAlign: 'center' }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="bb-btn bb-btn-primary"
              style={{ width: '100%', marginTop: 16, opacity: canSubmit ? 1 : 0.45 }}
            >
              {busy ? 'Egy pillanat…' : mode === 'login' ? 'Belépés' : 'Regisztráció'}
            </button>

            <div style={{ textAlign: 'center', marginTop: 14, fontSize: 13, color: 'var(--bb-cocoa-2)' }}>
              {mode === 'login' ? (
                <>Még nincs fiókod?{' '}
                  <button onClick={() => { setMode('signup'); setError(null); }} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--bb-brick)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    Regisztrálj!
                  </button>
                </>
              ) : (
                <>Van már fiókod?{' '}
                  <button onClick={() => { setMode('login'); setError(null); }} style={{ background: 'none', border: 'none', padding: 0, color: 'var(--bb-brick)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    Lépj be!
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
