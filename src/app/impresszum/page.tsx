import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Impresszum — BrownieBíró',
};

export default function ImpresszumPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bb-cream)', padding: '48px 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* Back link */}
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--bb-cocoa-2)', textDecoration: 'none', marginBottom: 32 }}>
          ← Vissza a térképre
        </Link>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-judge.png" alt="BrownieBíró logó" width={48} height={48} style={{ display: 'block' }} />
          <div>
            <h1 style={{ fontFamily: 'var(--font-fraunces, serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 32, margin: 0, color: 'var(--bb-cocoa)' }}>
              BrownieBíró
            </h1>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--bb-cocoa-2)' }}>Impresszum</p>
          </div>
        </div>

        <div className="bb-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>

          <Section title="A weboldalról">
            <p>
              A BrownieBíró egy <strong>nem hivatalos Burger King brownie rajongói oldal</strong>, amely nem áll
              kapcsolatban a Burger King<sup>®</sup>-gel vagy annak üzemeltetőivel, és nem képviseli azok
              érdekeit. A „Burger King” név és logó a jogtulajdonosok védjegye. Az itt megjelenő értékelések
              kizárólag a felhasználók független véleményét tükrözik.
            </p>
            <p>
              Az oldal célja, hogy segítse a látogatókat a legjobb Burger King brownie megtalálásában
              Magyarország Burger King éttermeiben.
            </p>
          </Section>

          <div style={{ height: 1, background: 'var(--bb-line)' }} />

          <Section title="Üzemeltető">
            <p>
              Az oldalt magánszemélyként üzemeltetem, nem kereskedelmi céllal.
            </p>
            <p>
              Kapcsolat: <a href="mailto:tothcsakmate@gmail.com" style={{ color: 'var(--bb-brick)' }}>tothcsakmate@gmail.com</a>
            </p>
          </Section>

          <div style={{ height: 1, background: 'var(--bb-line)' }} />

          <Section title="Szerzői jog és tartalom">
            <p>
              A felhasználók által beküldött értékelések szerzői joga az értékelőt illeti.
              A beküldéssel a felhasználó engedélyt ad az oldal üzemeltetőjének az értékelés
              megjelenítésére a BrownieBíró platformon.
            </p>
            <p>
              Jogtalanul feltöltött tartalmak eltávolítását az üzemeltetőnél
              lehet kérni az e-mail-címen.
            </p>
          </Section>

          <div style={{ height: 1, background: 'var(--bb-line)' }} />

          <Section title="Felelősségkizárás">
            <p>
              Az oldal üzemeltetője nem vállal felelősséget a megjelenített információk
              pontosságáért, teljességéért vagy az esetleges változásokért (pl. éttermi nyitvatartás,
              termék elérhetőség).
            </p>
          </Section>

          <div style={{ height: 1, background: 'var(--bb-line)' }} />

          <Section title="Adatvédelem">
            <p>
              Az oldal regisztrációhoz e-mail-cím megadása szükséges. Az adatkezelés az
              Európai Unió általános adatvédelmi rendeletének (GDPR) megfelelően történik.
            </p>
            <p>
              Sütik (cookie-k): az oldal Supabase munkamenet-sütiket használ a bejelentkezés
              fenntartásához. Harmadik féltől származó analitikai sütit nem alkalmazunk.
            </p>
          </Section>

        </div>

        <p style={{ textAlign: 'center', marginTop: 32, fontSize: 11, color: 'var(--bb-cocoa-2)' }}>
          Nem hivatalos Burger King brownie rajongói oldal · független értékelések · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-fraunces, serif)', fontStyle: 'italic', fontWeight: 600, fontSize: 18, margin: '0 0 10px', color: 'var(--bb-cocoa)' }}>
        {title}
      </h2>
      <div style={{ fontSize: 14, color: 'var(--bb-cocoa)', lineHeight: 1.65 }}>
        {children}
      </div>
    </div>
  );
}
