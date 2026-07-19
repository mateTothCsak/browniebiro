'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import Stars from '@/components/ui/Stars';
import Icon from '@/components/ui/Icon';
import Modal from '@/components/ui/Modal';
import ShareModal from '@/components/ui/ShareModal';
import type { Restaurant, Review } from '@/types';
import { createClient } from '@/utils/supabase/client';
import { initials, signInWithGoogle } from '@/lib/auth';
import { isHot } from '@/lib/data';

interface RestaurantDetailProps {
  restaurant: Restaurant;
  live: boolean;
  user: User | null;
  onClose: () => void;
  onSubmitReview: () => void;
}

interface ReviewRow {
  id: string;
  avg_score: number;
  body: string;
  visit_date: string;
  photo_url: string | null;
  review_likes: { count: number }[] | null;
  profiles: { display_name: string | null } | null;
}

export default function RestaurantDetail({ restaurant: r, live, user, onClose, onSubmitReview }: RestaurantDetailProps) {
  // null = loading
  const [reviews, setReviews] = useState<Review[] | null>(live ? null : []);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    if (!live) return;
    let cancelled = false;
    const supabase = createClient();
    (async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, avg_score, body, visit_date, photo_url, review_likes(count), profiles(display_name)')
        .eq('restaurant_id', r.id)
        .order('created_at', { ascending: false })
        .limit(50);
      if (cancelled) return;
      if (error || !data) { setReviews([]); return; }
      const rows = data as unknown as ReviewRow[];

      // Which of these reviews has the current user already liked?
      let likedSet = new Set<string>();
      if (user && rows.length) {
        const { data: mine } = await supabase
          .from('review_likes')
          .select('review_id')
          .eq('user_id', user.id)
          .in('review_id', rows.map((row) => row.id));
        if (cancelled) return;
        likedSet = new Set((mine ?? []).map((m) => m.review_id as string));
      }

      setReviews(rows.map((row) => {
        const author = row.profiles?.display_name ?? 'Vendég';
        return {
          id: row.id,
          author,
          avatar: initials(author),
          score: Math.round(Number(row.avg_score)),
          date: row.visit_date,
          body: row.body,
          likes: row.review_likes?.[0]?.count ?? 0,
          liked: likedSet.has(row.id),
          photo_url: row.photo_url,
        };
      }));
    })();
    return () => { cancelled = true; };
  }, [r.id, live, user]);

  const toggleLike = async (rev: Review) => {
    if (!user) { signInWithGoogle(); return; }
    const nowLiked = !rev.liked;
    // optimistic update
    setReviews((prev) => prev?.map((x) =>
      x.id === rev.id ? { ...x, liked: nowLiked, likes: x.likes + (nowLiked ? 1 : -1) } : x) ?? prev);
    const supabase = createClient();
    const { error } = nowLiked
      ? await supabase.from('review_likes').insert({ review_id: rev.id, user_id: user.id })
      : await supabase.from('review_likes').delete().eq('review_id', rev.id).eq('user_id', user.id);
    if (error) {
      // revert on failure
      setReviews((prev) => prev?.map((x) =>
        x.id === rev.id ? { ...x, liked: rev.liked, likes: rev.likes } : x) ?? prev);
    }
  };

  const distribution = [5, 4, 3, 2, 1].map((n) => ({
    n,
    count: (reviews ?? []).filter((rev) => rev.score === n).length,
  }));
  const total = distribution.reduce((s, d) => s + d.count, 0);

  const axes = [
    { label: 'Íz',      value: r.taste_avg ?? 0,     color: 'var(--bb-brick)' },
    { label: 'Textúra', value: r.texture_avg ?? 0,   color: 'var(--bb-amber)' },
    { label: 'Fagyi',   value: r.ice_cream_avg ?? 0, color: 'var(--bb-leaf)' },
  ];

  return (
    <>
    <Modal onClose={onClose}>
        {/* Nav row */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px 8px', gap: 10, flexShrink: 0 }}>
          <button
            onClick={onClose}
            aria-label="Vissza"
            style={{
              background: 'var(--bb-paper)', border: '1px solid var(--bb-line)',
              width: 38, height: 38, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Icon name="arrow-left" size={18} />
          </button>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => setShareOpen(true)}
            aria-label="Megosztás"
            style={{
              background: 'var(--bb-paper)', border: '1px solid var(--bb-line)',
              width: 38, height: 38, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <Icon name="share" size={17} />
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px 24px' }}>
          {/* Tag chips */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
            <span className="bb-chip brick"><Icon name="pin" size={11} /> {r.city}</span>
            {r.district && <span className="bb-chip">{r.district}</span>}
            {isHot(r.score, r.reviews) && <span className="bb-chip amber"><Icon name="flame" size={11} /> Forró</span>}
            {r.reviews >= 100 && <span className="bb-chip leaf"><Icon name="check" size={11} /> Népszerű</span>}
          </div>

          {/* Name */}
          <h2 style={{
            fontFamily: 'var(--font-fraunces, serif)',
            fontStyle: 'italic',
            fontWeight: 600,
            fontSize: 26,
            margin: '4px 0 14px',
            letterSpacing: '-0.01em',
            color: 'var(--bb-cocoa)',
          }}>
            {r.name}
          </h2>

          {/* Score block / empty state */}
          {r.reviews === 0 ? (
            <div style={{
              padding: '24px 16px',
              background: 'var(--bb-paper)',
              borderRadius: 18,
              border: '1px solid var(--bb-line)',
              marginBottom: 14,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>🍫</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--bb-cocoa)', marginBottom: 2 }}>
                Még nincs értékelés
              </div>
              <div style={{ fontSize: 13, color: 'var(--bb-cocoa-2)' }}>
                Legyél te az első, aki pontozza ezt a brownie-t!
              </div>
            </div>
          ) : (
            <div style={{
              padding: 16,
              background: 'var(--bb-paper)',
              borderRadius: 18,
              border: '1px solid var(--bb-line)',
              marginBottom: 14,
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 18, alignItems: 'center' }}>
                {/* Headline score */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-fraunces, serif)', fontWeight: 700, fontSize: 44, lineHeight: 1, color: 'var(--bb-cocoa)' }}>
                    {r.score.toFixed(1)}
                  </div>
                  <Stars value={r.score} size="lg" />
                  <div style={{ fontSize: 11, color: 'var(--bb-cocoa-2)', marginTop: 4 }}>
                    {r.reviews} értékelés
                  </div>
                </div>

                {/* Distribution */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {distribution.map((d) => (
                    <div key={d.n} style={{ display: 'grid', gridTemplateColumns: '18px 1fr 28px', gap: 6, alignItems: 'center', fontSize: 11, color: 'var(--bb-cocoa-2)' }}>
                      <span>{d.n}★</span>
                      <div style={{ height: 6, background: 'var(--bb-cream-2)', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ width: `${total ? (d.count / total) * 100 : 0}%`, height: '100%', background: d.n >= 4 ? 'var(--bb-amber)' : 'var(--bb-cocoa-2)', borderRadius: 999 }} />
                      </div>
                      <span style={{ textAlign: 'right' }}>{d.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3-axis breakdown */}
              <div style={{ borderTop: '1px solid var(--bb-line)', marginTop: 14, paddingTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {axes.map((a) => (
                  <div key={a.label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: 'var(--bb-cocoa-2)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700, marginBottom: 4 }}>{a.label}</div>
                    <div style={{ fontFamily: 'var(--font-fraunces, serif)', fontWeight: 700, fontSize: 18, color: 'var(--bb-cocoa)', marginBottom: 4 }}>{a.value.toFixed(1)}</div>
                    <div style={{ height: 4, background: 'var(--bb-cream-2)', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{ width: `${(a.value / 5) * 100}%`, height: '100%', background: a.color, borderRadius: 999 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={onSubmitReview}
            disabled={!live}
            className="bb-btn bb-btn-primary"
            style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 22, opacity: live ? 1 : 0.5 }}
          >
            <Icon name="edit" size={16} color="currentColor" /> Értékeld a brownie-t
          </button>

          {/* Reviews */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-fraunces, serif)', fontStyle: 'italic', fontSize: 18, fontWeight: 600, color: 'var(--bb-cocoa)' }}>
              Vélemények
            </h3>
            <span style={{ fontSize: 12, color: 'var(--bb-cocoa-2)' }}>Legújabb</span>
          </div>

          {reviews === null ? (
            <div style={{ padding: '24px 0', textAlign: 'center', fontSize: 13, color: 'var(--bb-cocoa-2)' }}>
              Vélemények betöltése…
            </div>
          ) : reviews.length === 0 ? (
            <div style={{ padding: '20px 0 8px', textAlign: 'center', fontSize: 13, color: 'var(--bb-cocoa-2)' }}>
              Még senki sem írt véleményt erről a helyszínről.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {reviews.map((rev) => (
                <div key={rev.id} className="bb-card" style={{ padding: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div className="bb-avatar">{rev.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--bb-cocoa)' }}>{rev.author}</div>
                      <div style={{ fontSize: 11, color: 'var(--bb-cocoa-2)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Icon name="calendar" size={10} /> {rev.date}
                      </div>
                    </div>
                    <Stars value={rev.score} />
                  </div>

                  {rev.body.trim() && (
                    <p style={{ fontSize: 13, lineHeight: 1.5, margin: '0 0 8px', color: 'var(--bb-cocoa)' }}>{rev.body}</p>
                  )}

                  {rev.photo_url && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={rev.photo_url}
                      alt="Brownie fotó"
                      style={{ width: '100%', maxHeight: 260, objectFit: 'cover', borderRadius: 12, marginBottom: 8, display: 'block' }}
                    />
                  )}

                  {/* Like */}
                  <button
                    onClick={() => toggleLike(rev)}
                    aria-pressed={rev.liked}
                    aria-label={rev.liked ? 'Kedvelés visszavonása' : 'Kedvelem'}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'transparent', border: 'none', padding: '2px 0', cursor: 'pointer',
                      color: rev.liked ? 'var(--bb-brick)' : 'var(--bb-cocoa-2)',
                      fontWeight: 700, fontSize: 12,
                    }}
                  >
                    <Icon name="heart" size={15} color={rev.liked ? 'var(--bb-brick)' : 'var(--bb-cocoa-2)'} />
                    {rev.likes > 0 ? rev.likes : 'Tetszik'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {shareOpen && (
        <ShareModal
          url={`${window.location.origin}/?focus=${r.slug ?? r.id}`}
          title={`${r.name} · BrownieBíró`}
          heading="Oszd meg ezt a helyet"
          subtitle="Küldd el a barátaidnak, vagy olvassák be a QR-kódot."
          onClose={() => setShareOpen(false)}
        />
      )}
    </>
  );
}
