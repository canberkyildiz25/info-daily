'use client';
/* Anasayfanın "Watch" bandı: büyük bir oynatıcı ve yanında sıra.
 *
 * Oynatıcı tıklanana kadar yalnızca bir küçük resim — YouTube'un iframe'i
 * sayfa açılışında yüklenseydi her ziyaretçiye yarım megabaytın üstünde
 * betik ve çerez indirirdi. Tıklayınca youtube-nocookie gömmesi yerine
 * geçiyor. Sıradaki bir videoya basmak onu büyük oynatıcıya alıyor.
 *
 * Videolar sitenin değil: kanal adı her birinin üstünde yazıyor. */
import { useState } from 'react';
import type { VideoItem } from '@/lib/videos';

function ago(date: string) {
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
  if (days < 1) return 'Today';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

/* maxresdefault her videoda yok; yoksa YouTube 120 piksellik gri bir yer
   tutucu döndürüyor. hqdefault her zaman var, 4:3 ve üstü altı siyah
   bantlı — 16:9 kapta object-cover o bantları tam kırpıyor. */
function Thumb({ id, alt, priority = false, className = '' }: { id: string; alt: string; priority?: boolean; className?: string }) {
  const [src, setSrc] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={e => {
        if ((e.currentTarget as HTMLImageElement).naturalWidth <= 120) setSrc(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
      }}
      onError={() => setSrc(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
      className={`absolute inset-0 w-full h-full object-cover ${className}`}
    />
  );
}

export default function VideoBand({ videos }: { videos: VideoItem[] }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const current = videos[active];
  if (!current) return null;

  const choose = (i: number) => {
    setActive(i);
    setPlaying(true);
  };

  return (
    <div className="grid gap-x-12 gap-y-8 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
      <div className="min-w-0">
        <div className="relative aspect-video overflow-hidden bg-black">
          {playing ? (
            <iframe
              key={current.id}
              src={`https://www.youtube-nocookie.com/embed/${current.id}?autoplay=1&rel=0`}
              title={current.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          ) : (
            <button
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 w-full h-full text-left"
              aria-label={`Play: ${current.title}`}
            >
              <span className="card-media absolute inset-0">
                <Thumb id={current.id} alt="" />
              </span>
              <span aria-hidden className="absolute inset-0 bg-[linear-gradient(to_top,rgb(6_15_17/0.85),rgb(6_15_17/0)_55%)]" />
              <span className="absolute left-5 bottom-5 sm:left-8 sm:bottom-8 flex items-center gap-4">
                <span className="play-disc inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[var(--text-base)] text-[var(--bg-base)]">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden className="ml-1">
                    <path d="M7 4.5v15l13-7.5z" />
                  </svg>
                </span>
                <span className="type-label text-[var(--text-base)]">Play · {current.channelName}</span>
              </span>
            </button>
          )}
        </div>
        <p className="type-label mt-4 text-[var(--text-muted)]">
          <span className="text-[var(--accent)]">{current.channelName}</span>
          <span aria-hidden> · </span>
          {ago(current.publishedAt)}
        </p>
        <h3 className="type-display type-display-m mt-2 text-[var(--text-base)]">{current.title}</h3>
      </div>

      <ol className="border-t border-[var(--border)] lg:border-t-0 lg:-mt-4" aria-label="Up next">
        {videos.map((v, i) => i === active ? null : (
          <li key={v.id} className="border-b border-[var(--border)]">
            <button onClick={() => choose(i)} className="group flex w-full gap-4 py-4 text-left">
              <span className="card-media relative w-32 shrink-0 aspect-video overflow-hidden bg-black">
                <Thumb id={v.id} alt="" />
              </span>
              <span className="min-w-0">
                <span className="type-label block text-[var(--text-muted)]">
                  <span className="text-[var(--accent)]">{v.channelName}</span> · {ago(v.publishedAt)}
                </span>
                <span className="card-title mt-1 block text-[0.9375rem] font-semibold leading-snug text-[var(--text-base)] line-clamp-3">
                  {v.title}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
