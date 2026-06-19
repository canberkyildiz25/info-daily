'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import type { NewsArticle } from '@/lib/news';

function newsLink(article: NewsArticle): string {
  const p = new URLSearchParams({
    title: article.title,
    ...(article.description ? { desc: article.description } : {}),
    ...(article.urlToImage   ? { img: article.urlToImage }   : {}),
    src: article.source.name,
    url: article.url,
    at: article.publishedAt,
  });
  return `/news?${p.toString()}`;
}

export default function BreakingNewsTicker({ articles }: { articles: NewsArticle[] }) {
  const [paused, setPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  if (!articles.length) return null;

  return (
    <div
      className="flex items-center gap-0 bg-[var(--accent)] text-white overflow-hidden rounded-xl mb-6 select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Label */}
      <div className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-black/20 font-black text-xs uppercase tracking-widest z-10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
        Breaking
      </div>

      {/* Scrolling track */}
      <div className="flex-1 overflow-hidden relative">
        <div
          ref={trackRef}
          className="flex gap-0 whitespace-nowrap"
          style={{
            animation: paused ? 'none' : 'ticker 40s linear infinite',
          }}
        >
          {/* Duplicate for seamless loop */}
          {[...articles, ...articles].map((a, i) => (
            <Link
              key={i}
              href={newsLink(a)}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium hover:text-white/80 transition-colors border-r border-white/20 last:border-0 shrink-0"
            >
              <span className="text-white/50 text-xs font-bold">{a.source.name}</span>
              <span className="text-white">{a.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
