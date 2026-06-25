import Link from 'next/link';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ title?: string; channel?: string; cat?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const p = await searchParams;
  return {
    title: p.title ? `${p.title} — InfoDaily Videos` : 'Watch — InfoDaily Videos',
    description: p.channel ? `Watch on InfoDaily: ${p.title} by ${p.channel}` : undefined,
  };
}

export default async function VideoPlayerPage({ params, searchParams }: Props) {
  const { id } = await params;
  const p = await searchParams;

  const backHref = p.cat && p.cat !== 'all' ? `/videos?cat=${p.cat}` : '/videos';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Back link */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-6 group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Videos
      </Link>

      {/* Channel badge */}
      {p.channel && (
        <p className="text-xs font-black uppercase tracking-widest text-[var(--accent)] mb-3">{p.channel}</p>
      )}

      {/* Title */}
      {p.title && (
        <h1
          className="text-xl sm:text-2xl lg:text-3xl font-black text-[var(--text-base)] leading-tight mb-6"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {p.title}
        </h1>
      )}

      {/* YouTube embed — responsive 16:9 */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl bg-black mb-6" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
          title={p.title ?? 'Video'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>

      {/* Open on YouTube link */}
      <div className="flex items-center justify-between mb-10">
        <p className="text-xs text-[var(--text-muted)]">
          Video provided by <strong>{p.channel ?? 'YouTube'}</strong> via YouTube.
        </p>
        <a
          href={`https://www.youtube.com/watch?v=${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] hover:underline"
        >
          Open on YouTube
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>

      {/* Browse more */}
      <div className="pt-8 border-t border-[var(--border)]">
        <p className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-4">Browse more videos</p>
        <div className="flex flex-wrap gap-3">
          {['technology', 'science', 'health', 'finance', 'food', 'travel'].map(cat => (
            <Link
              key={cat}
              href={`/videos?cat=${cat}`}
              className="px-4 py-2 rounded-full border border-[var(--border)] text-sm font-semibold text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors capitalize"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
