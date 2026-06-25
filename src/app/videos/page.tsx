import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getVideos, VIDEO_CATEGORIES } from '@/lib/videos';

export const metadata: Metadata = {
  title: 'Videos — InfoDaily',
  description: 'Watch curated educational and informational videos across technology, science, health, finance, food, and travel.',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1)  return 'today';
  if (days < 7)  return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

interface Props {
  searchParams: Promise<{ cat?: string }>;
}

export default async function VideosPage({ searchParams }: Props) {
  const { cat } = await searchParams;
  const activeCategory = cat && cat !== 'all' ? cat : 'all';
  const videos = await getVideos(activeCategory === 'all' ? undefined : activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Page header */}
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)] mb-1">Watch & Learn</p>
        <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-base)] leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
          Curated Videos
        </h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">
          Latest from top educational channels — updated hourly.
        </p>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1 mb-8">
        {VIDEO_CATEGORIES.map(c => (
          <Link
            key={c.id}
            href={c.id === 'all' ? '/videos' : `/videos?cat=${c.id}`}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-colors border ${
              activeCategory === c.id
                ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
            }`}
          >
            {c.label}
          </Link>
        ))}
      </div>

      {/* Video grid */}
      {videos.length === 0 ? (
        <div className="text-center py-20 text-[var(--text-muted)]">
          <p className="text-4xl mb-4">📺</p>
          <p className="font-semibold">No videos found.</p>
          <p className="text-sm mt-1">Try another category or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {videos.map(video => (
            <Link
              key={video.id}
              href={`/videos/${video.id}?title=${encodeURIComponent(video.title)}&channel=${encodeURIComponent(video.channelName)}&cat=${video.category}`}
              className="group block bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden hover:border-[var(--accent)] hover:shadow-lg transition-all"
            >
              {/* Thumbnail */}
              <div className="relative w-full overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized
                />
                {/* Play overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                {/* Duration badge placeholder */}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  ▶ YouTube
                </div>
              </div>

              {/* Card body */}
              <div className="p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)]">{video.channelName}</span>
                  <span className="text-[var(--border)]">·</span>
                  <span className="text-[10px] text-[var(--text-muted)]">{timeAgo(video.publishedAt)}</span>
                </div>
                <h3 className="text-sm font-bold text-[var(--text-base)] group-hover:text-[var(--accent)] leading-snug line-clamp-2 transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                  {video.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
