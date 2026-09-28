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
    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-14">

      {/* Back link */}
      <Link
        href={backHref}
        className="type-label inline-flex items-center gap-2 min-h-11 text-[var(--text-muted)] hover:text-[var(--text-base)] transition-colors mb-4 group"
      >
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Videos
      </Link>

      {/* Channel badge */}
      {p.channel && (
        <p className="type-label text-[var(--accent)] mb-3">{p.channel}</p>
      )}

      {/* Title */}
      {p.title && (
        <h1 className="type-display type-display-l max-w-[24ch] text-[var(--text-base)] mb-8">
          {p.title}
        </h1>
      )}

      {/* YouTube embed — responsive 16:9 */}
      <div className="relative w-full aspect-video overflow-hidden bg-black mb-4">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
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
      <div className="pt-6 border-t border-[var(--border)]">
        <p className="type-label text-[var(--text-muted)] mb-2">Browse more videos</p>
        <div className="flex flex-wrap gap-x-6">
          {['technology', 'science', 'health', 'finance', 'food', 'travel'].map(cat => (
            <Link
              key={cat}
              href={`/videos?cat=${cat}`}
              className="inline-flex items-center min-h-11 text-[0.9375rem] font-medium text-[var(--text-base)] underline decoration-[var(--border)] underline-offset-[6px] hover:decoration-[var(--accent)] transition-colors capitalize"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
