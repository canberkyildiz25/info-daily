import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

interface Props {
  searchParams: Promise<{
    title?: string;
    desc?: string;
    img?: string;
    src?: string;
    url?: string;
    at?: string;
  }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const p = await searchParams;
  return {
    title: p.title ? `${p.title} — InfoDaily` : 'News — InfoDaily',
    description: p.desc ?? 'Breaking news and top stories on InfoDaily.',
    openGraph: p.img ? { images: [p.img] } : undefined,
  };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs} hours ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

export default async function NewsPage({ searchParams }: Props) {
  const p = await searchParams;

  if (!p.title) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-[var(--text-muted)]">No article found.</p>
        <Link href="/" className="mt-4 inline-block text-[var(--accent)] font-bold hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const publishedAt = p.at ? timeAgo(p.at) : null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Back link */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-8 group">
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to News
      </Link>

      {/* Source + time */}
      <div className="flex items-center gap-3 mb-4">
        {p.src && (
          <span className="text-xs font-black uppercase tracking-widest text-[var(--accent)] bg-[var(--accent-light)] px-2.5 py-1 rounded-full">
            {p.src}
          </span>
        )}
        {publishedAt && (
          <span className="text-xs text-[var(--text-muted)]">{publishedAt}</span>
        )}
        <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase tracking-widest ml-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
          Live News
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--text-base)] leading-tight mb-6" style={{ fontFamily: 'Georgia, serif' }}>
        {p.title}
      </h1>

      {/* Hero image */}
      {p.img && (
        <div className="relative w-full rounded-2xl overflow-hidden mb-8" style={{ height: '400px' }}>
          <Image
            src={p.img}
            alt={p.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            unoptimized
            priority
          />
        </div>
      )}

      {/* Description */}
      {p.desc && (
        <div className="prose prose-lg max-w-none text-[var(--text-base)] mb-10">
          <p className="text-lg leading-relaxed text-[var(--text-muted)]">{p.desc}</p>
        </div>
      )}

      {/* Read original CTA */}
      {p.url && (
        <div className="border border-[var(--border)] rounded-2xl p-6 bg-[var(--bg-card)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[var(--text-base)] mb-1">Continue reading the full story</p>
            <p className="text-xs text-[var(--text-muted)]">
              This article was originally published by <strong>{p.src ?? 'the source'}</strong>.
            </p>
          </div>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-[var(--accent)] text-white text-sm font-black px-5 py-3 rounded-xl hover:opacity-90 transition-opacity uppercase tracking-wide"
          >
            Read Full Story
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}

      {/* Related articles */}
      <div className="mt-12 pt-8 border-t border-[var(--border)]">
        <p className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-4">More from InfoDaily</p>
        <div className="flex flex-wrap gap-3">
          {['health', 'technology', 'finance', 'travel', 'food'].map(cat => (
            <Link
              key={cat}
              href={`/category/${cat}`}
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
