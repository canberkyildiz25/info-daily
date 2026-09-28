import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getVideos, VIDEO_CATEGORIES } from '@/lib/videos';
import PageHead from '@/components/PageHead';

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
    <div>
      <PageHead
        label="Watch"
        title="Videos"
        intro="The latest from channels we read ourselves. Refreshed every hour; each video credits its channel and plays from YouTube."
      >
        <nav aria-label="Filter by topic" className="mt-8 flex gap-x-6 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {VIDEO_CATEGORIES.map(c => {
            const active = activeCategory === c.id;
            return (
              <Link
                key={c.id}
                href={c.id === 'all' ? '/videos' : `/videos?cat=${c.id}`}
                aria-current={active ? 'page' : undefined}
                className={`relative shrink-0 text-[0.9375rem] font-medium whitespace-nowrap transition-colors ${
                  active ? 'text-[var(--text-base)]' : 'text-[var(--text-muted)] hover:text-[var(--text-base)]'
                }`}
              >
                {c.label}
                {active && <span aria-hidden className="absolute left-0 right-0 bottom-2 h-0.5 bg-[var(--accent)]" />}
              </Link>
            );
          })}
        </nav>
      </PageHead>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10">
        {videos.length === 0 ? (
          <p className="py-20 text-[var(--text-muted)] border-t border-[var(--border)]">
            No videos came back from YouTube just now. Try another topic, or check again in a few minutes.
          </p>
        ) : (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-10 border-t border-[var(--border)]">
            {videos.map(video => (
              <Link
                key={video.id}
                href={`/videos/${video.id}?title=${encodeURIComponent(video.title)}&channel=${encodeURIComponent(video.channelName)}&cat=${video.category}`}
                className="group block min-w-0"
              >
                <div className="card-media relative aspect-video overflow-hidden bg-black">
                  <Image
                    src={video.thumbnail}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized
                  />
                  <span aria-hidden className="play-disc absolute left-3 bottom-3 inline-flex items-center justify-center w-11 h-11 rounded-full bg-[var(--text-base)] text-[var(--bg-base)]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5"><path d="M7 4.5v15l13-7.5z" /></svg>
                  </span>
                </div>
                <p className="type-label mt-4 text-[var(--text-muted)]">
                  <span className="text-[var(--accent)]">{video.channelName}</span> · {timeAgo(video.publishedAt)}
                </p>
                <h2 className="card-title mt-1 text-[0.9375rem] font-semibold leading-snug text-[var(--text-base)] line-clamp-2">
                  {video.title}
                </h2>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
