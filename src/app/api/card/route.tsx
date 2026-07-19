import { ImageResponse } from 'next/og';

// Branded review "card" image — shareable to chats/stories and reusable as an
// Open Graph preview. GET /api/card?review=<uuid>
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const id = searchParams.get('review');

  // Fetch the review (public read) straight from PostgREST — no auth needed.
  interface CardReview {
    avg_score: number; taste: number; texture: number; ice_cream: number; body: string | null;
    restaurants: { name: string; city: string } | null;
    profiles: { display_name: string | null } | null;
  }
  let review: CardReview | null = null;
  if (id) {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const select = 'avg_score,taste,texture,ice_cream,body,restaurants(name,city),profiles(display_name)';
    const res = await fetch(`${base}/rest/v1/reviews?id=eq.${id}&select=${select}`, {
      headers: { apikey: key ?? '', Authorization: `Bearer ${key ?? ''}` },
    }).catch(() => null);
    if (res?.ok) { review = (await res.json())[0] ?? null; }
  }

  // Inline the logo so Satori always has it.
  const logoRes = await fetch(`${origin}/logo-judge.png`).catch(() => null);
  const logo = logoRes?.ok
    ? `data:image/png;base64,${Buffer.from(await logoRes.arrayBuffer()).toString('base64')}`
    : null;

  // No review → a generic brand card (used as the site's Open Graph preview).
  if (!review) {
    return new ImageResponse(
      (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#faf3e7', color: '#3a241a', padding: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} width={132} height={132} alt="" />
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: 76, fontWeight: 800, fontStyle: 'italic' }}>BrownieBíró</div>
              <div style={{ display: 'flex', fontSize: 34, color: '#5b3a26' }}>Hol a legjobb brownie az országban?</div>
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: 27, color: '#5b3a26', marginTop: 44 }}>
            Értékeld és fedezd fel Magyarország legjobb brownie-jait · browniebiro.hu
          </div>
        </div>
      ),
      { width: 1200, height: 630 },
    );
  }

  const score = review ? Number(review.avg_score) : 0;
  const scoreInt = Math.round(score);
  const name = review?.restaurants?.name ?? 'BrownieBíró';
  const city = review?.restaurants?.city ?? 'Magyarország';
  const author = review?.profiles?.display_name ?? 'Vendég';
  const hot = score >= 4.5;
  const body = (review?.body ?? '').trim();
  const snippet = body.length > 58 ? body.slice(0, 58).trimEnd() + '…' : body;

  const axes: [string, number, string][] = [
    ['Íz', review?.taste ?? 0, '#d62a08'],
    ['Textúra', review?.texture ?? 0, '#f29406'],
    ['Fagyi', review?.ice_cream ?? 0, '#7a9e4f'],
  ];

  const Star = ({ on }: { on: boolean }) => (
    <svg width="52" height="52" viewBox="0 0 24 24">
      <path
        d="M12 2.5l2.92 6.05 6.58.94-4.78 4.55 1.16 6.46L12 17.6l-5.88 2.9 1.16-6.46L2.5 9.49l6.58-.94L12 2.5z"
        fill={on ? '#f29406' : 'rgba(58,36,26,0.15)'}
      />
    </svg>
  );

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#faf3e7', padding: 56, color: '#3a241a' }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} width={64} height={64} alt="" />
          ) : null}
          <div style={{ display: 'flex', fontSize: 36, fontWeight: 700, fontStyle: 'italic' }}>BrownieBíró</div>
        </div>

        {/* Middle */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <div style={{ display: 'flex', fontSize: 28, color: '#5b3a26', marginBottom: 4 }}>{city}</div>
          <div style={{ display: 'flex', fontSize: 60, fontWeight: 800, letterSpacing: -1 }}>{name}</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 14 }}>
            <div style={{ display: 'flex', fontSize: 104, fontWeight: 800, lineHeight: 1 }}>{score.toFixed(1)}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {[1, 2, 3, 4, 5].map((n) => <Star key={n} on={n <= scoreInt} />)}
              </div>
              {hot ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 30, fontWeight: 700, color: '#d62a08' }}>
                  <svg width="34" height="34" viewBox="0 0 24 24"><path d="M12 2s6 4 6 10a6 6 0 11-12 0c0-2 1-4 2-5 0 2 1 3 2 3 0-3 2-6 2-8z" fill="#d62a08" /></svg>
                  Forró
                </div>
              ) : null}
            </div>
          </div>

          {snippet ? (
            <div style={{ display: 'flex', fontSize: 27, color: '#3a241a', marginTop: 16, fontStyle: 'italic' }}>“{snippet}”</div>
          ) : null}

          <div style={{ display: 'flex', gap: 16, marginTop: 22 }}>
            {axes.map(([label, val, color]) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 8, background: '#fffaf0', border: '1px solid rgba(58,36,26,0.12)', borderRadius: 18, padding: '16px 22px', width: 316 }}>
                <div style={{ display: 'flex', fontSize: 20, color: '#5b3a26', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700 }}>{label}</div>
                <div style={{ display: 'flex', fontSize: 42, fontWeight: 800 }}>{Number(val).toFixed(1)}</div>
                <div style={{ display: 'flex', width: '100%', height: 8, background: 'rgba(58,36,26,0.1)', borderRadius: 99 }}>
                  <div style={{ display: 'flex', width: `${(Number(val) / 5) * 100}%`, height: 8, background: color, borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 700 }}>— {author}</div>
          <div style={{ display: 'flex', fontSize: 26, color: '#5b3a26' }}>browniebiro.hu</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
