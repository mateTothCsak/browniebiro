import { ImageResponse } from 'next/og';

// Branded review "card" image — shareable to chats/stories and reusable as an
// Open Graph preview. GET /api/card?review=<uuid>
export async function GET(request: Request) {
  const reqUrl = new URL(request.url);
  const { searchParams, origin } = reqUrl;
  const host = reqUrl.host.replace(/^www\./, ''); // current site's domain
  const id = searchParams.get('review');

  interface CardReview {
    avg_score: number; taste: number; texture: number; ice_cream: number;
    body: string | null; photo_url: string | null;
    restaurants: { name: string; city: string } | null;
    profiles: { display_name: string | null } | null;
  }
  let review: CardReview | null = null;
  if (id) {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const select = 'avg_score,taste,texture,ice_cream,body,photo_url,restaurants(name,city),profiles(display_name)';
    const res = await fetch(`${base}/rest/v1/reviews?id=eq.${id}&select=${select}`, {
      headers: { apikey: key ?? '', Authorization: `Bearer ${key ?? ''}` },
    }).catch(() => null);
    if (res?.ok) { review = (await res.json())[0] ?? null; }
  }

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
              <div style={{ display: 'flex', fontSize: 34, color: '#5b3a26' }}>Hol a legjobb Burger King brownie?</div>
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: 27, color: '#5b3a26', marginTop: 44 }}>
            Nem hivatalos Burger King brownie rajongói oldal · {host}
          </div>
        </div>
      ),
      { width: 1200, height: 630 },
    );
  }

  // Inline the review photo (Satori is happiest with jpg/png data URLs).
  let photo: string | null = null;
  if (review.photo_url) {
    const pr = await fetch(review.photo_url).catch(() => null);
    const ct = pr?.headers.get('content-type') || '';
    if (pr?.ok && (ct.includes('jpeg') || ct.includes('png'))) {
      photo = `data:${ct};base64,${Buffer.from(await pr.arrayBuffer()).toString('base64')}`;
    }
  }

  const score = Number(review.avg_score);
  const scoreInt = Math.round(score);
  const name = review.restaurants?.name ?? 'BrownieBíró';
  const city = review.restaurants?.city ?? 'Magyarország';
  const author = review.profiles?.display_name ?? 'Vendég';
  const hot = score >= 4.5;
  const body = (review.body ?? '').trim();

  const axes: [string, number, string][] = [
    ['Íz', review.taste, '#d62a08'],
    ['Textúra', review.texture, '#f29406'],
    ['Fagyi', review.ice_cream, '#7a9e4f'],
  ];

  // Grow the card height to fit the full text + photo (portrait, 1080 wide).
  const W = 1080;
  const textLines = body ? Math.ceil(body.length / 40) : 0;
  const textH = body ? textLines * 46 + 10 : 0;
  const H = 56            // top pad
    + 84                  // header
    + (photo ? 600 + 28 : 0)
    + 40                  // city
    + 74                  // name
    + 120                 // score row
    + 132                 // axes
    + (body ? textH + 24 : 0)
    + 58                  // footer
    + 56;                 // bottom pad

  const Star = ({ on }: { on: boolean }) => (
    <svg width="52" height="52" viewBox="0 0 24 24">
      <path d="M12 2.5l2.92 6.05 6.58.94-4.78 4.55 1.16 6.46L12 17.6l-5.88 2.9 1.16-6.46L2.5 9.49l6.58-.94L12 2.5z" fill={on ? '#f29406' : 'rgba(58,36,26,0.15)'} />
    </svg>
  );

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#faf3e7', color: '#3a241a', padding: 56 }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} width={60} height={60} alt="" />
          ) : null}
          <div style={{ display: 'flex', fontSize: 34, fontWeight: 700, fontStyle: 'italic' }}>BrownieBíró</div>
        </div>

        {/* Photo */}
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} width={W - 112} height={600} style={{ objectFit: 'cover', borderRadius: 24, marginBottom: 28 }} alt="" />
        ) : null}

        {/* Place */}
        <div style={{ display: 'flex', fontSize: 28, color: '#5b3a26' }}>{city}</div>
        <div style={{ display: 'flex', fontSize: 58, fontWeight: 800, letterSpacing: -1, marginBottom: 12 }}>{name}</div>

        {/* Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginBottom: 22 }}>
          <div style={{ display: 'flex', fontSize: 92, fontWeight: 800, lineHeight: 1 }}>{score.toFixed(1)}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', gap: 4 }}>{[1, 2, 3, 4, 5].map((n) => <Star key={n} on={n <= scoreInt} />)}</div>
            {hot ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 30, fontWeight: 700, color: '#d62a08' }}>
                <svg width="34" height="34" viewBox="0 0 24 24"><path d="M12 2s6 4 6 10a6 6 0 11-12 0c0-2 1-4 2-5 0 2 1 3 2 3 0-3 2-6 2-8z" fill="#d62a08" /></svg>
                Forró
              </div>
            ) : null}
          </div>
        </div>

        {/* Axes */}
        <div style={{ display: 'flex', gap: 14, marginBottom: body ? 24 : 0 }}>
          {axes.map(([label, val, color]) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: 8, background: '#fffaf0', border: '1px solid rgba(58,36,26,0.12)', borderRadius: 18, padding: '16px 20px', width: (W - 112 - 28) / 3 }}>
              <div style={{ display: 'flex', fontSize: 20, color: '#5b3a26', letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700 }}>{label}</div>
              <div style={{ display: 'flex', fontSize: 40, fontWeight: 800 }}>{Number(val).toFixed(1)}</div>
              <div style={{ display: 'flex', width: '100%', height: 8, background: 'rgba(58,36,26,0.1)', borderRadius: 99 }}>
                <div style={{ display: 'flex', width: `${(Number(val) / 5) * 100}%`, height: 8, background: color, borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Full text */}
        {body ? (
          <div style={{ display: 'flex', fontSize: 32, lineHeight: 1.4, color: '#3a241a', fontStyle: 'italic' }}>“{body}”</div>
        ) : null}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 24 }}>
          <div style={{ display: 'flex', fontSize: 28, fontWeight: 700 }}>— {author}</div>
          <div style={{ display: 'flex', fontSize: 26, color: '#5b3a26' }}>{host}</div>
        </div>
      </div>
    ),
    { width: W, height: H },
  );
}
