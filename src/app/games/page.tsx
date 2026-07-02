'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface NewsArticle {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: { name: string };
  content: string | null;
}

const GAMES = [
  {
    id: 'snake',
    title: 'Snake',
    description: 'Classic snake — eat, grow, survive.',
    icon: '🐍',
    color: 'from-green-900/60 to-green-800/40',
    border: 'border-green-700/40',
    accent: 'text-green-400',
    src: '/games/snake.html',
  },
  {
    id: 'memory',
    title: 'Memory',
    description: 'Flip cards and match pairs.',
    icon: '🃏',
    color: 'from-violet-900/60 to-violet-800/40',
    border: 'border-violet-700/40',
    accent: 'text-violet-400',
    src: '/games/memory.html',
  },
  {
    id: '2048',
    title: '2048',
    description: 'Slide tiles, reach 2048.',
    icon: '🔢',
    color: 'from-orange-900/60 to-orange-800/40',
    border: 'border-orange-700/40',
    accent: 'text-orange-400',
    src: '/games/2048.html',
  },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function newsLink(a: NewsArticle): string {
  const p = new URLSearchParams({
    title: a.title,
    ...(a.description ? { desc: a.description } : {}),
    ...(a.urlToImage ? { img: a.urlToImage } : {}),
    ...(a.content ? { ct: a.content } : {}),
    src: a.source.name,
    url: a.url,
    at: a.publishedAt,
  });
  return `/news?${p.toString()}`;
}

function GameModal({ game, onClose }: { game: typeof GAMES[0]; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/95">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">{game.icon}</span>
          <span className="font-black text-white text-sm tracking-wide">{game.title}</span>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Close
        </button>
      </div>
      {/* Game iframe */}
      <iframe
        src={game.src}
        className="flex-1 w-full border-0"
        title={game.title}
        allow="autoplay"
      />
    </div>
  );
}

export default function GamesPage() {
  const [activeGame, setActiveGame] = useState<typeof GAMES[0] | null>(null);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gaming-news')
      .then(r => r.json())
      .then((data: NewsArticle[]) => setNews(data))
      .catch(() => setNews([]))
      .finally(() => setNewsLoading(false));
  }, []);

  return (
    <>
      {activeGame && <GameModal game={activeGame} onClose={() => setActiveGame(null)} />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">🎮</span>
            <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-base)] tracking-tight">Games</h1>
          </div>
          <p className="text-[var(--text-muted)] text-base max-w-xl">
            Play browser games instantly — no download needed. Plus the latest gaming news.
          </p>
        </div>

        {/* Browser Games */}
        <section className="mb-14">
          <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-5 flex items-center gap-2">
            <span className="w-4 h-px bg-[var(--accent)] inline-block" />
            Play Now
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {GAMES.map(game => (
              <button
                key={game.id}
                onClick={() => setActiveGame(game)}
                className={`group relative rounded-2xl border ${game.border} bg-gradient-to-br ${game.color} p-6 text-left hover:scale-[1.02] active:scale-[0.99] transition-transform duration-200 cursor-pointer`}
              >
                <div className="text-4xl mb-4">{game.icon}</div>
                <h3 className={`text-xl font-black ${game.accent} mb-1`}>{game.title}</h3>
                <p className="text-sm text-white/60 mb-5">{game.description}</p>
                <span className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors uppercase tracking-wide">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Play
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Gaming News */}
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-5 flex items-center gap-2">
            <span className="w-4 h-px bg-[var(--accent)] inline-block" />
            Gaming News
          </h2>

          {newsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden animate-pulse">
                  <div className="h-44 bg-[var(--border)]" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-[var(--border)] rounded w-3/4" />
                    <div className="h-3 bg-[var(--border)] rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : news.length === 0 ? (
            <p className="text-[var(--text-muted)] text-sm">No gaming news available right now.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {news.map((article, i) => (
                <Link key={i} href={newsLink(article)} className="group block rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden hover:border-[var(--accent)]/40 transition-colors">
                  <div className="relative h-44 bg-[var(--border)]">
                    {article.urlToImage ? (
                      <Image
                        src={article.urlToImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, 33vw"
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-800/60 to-purple-900/60 flex items-center justify-center text-4xl">🎮</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                      {article.source.name}
                    </span>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-[var(--text-base)] leading-snug line-clamp-2 mb-2 group-hover:text-[var(--accent)] transition-colors">
                      {article.title}
                    </h3>
                    <span className="text-xs text-[var(--text-muted)]">{timeAgo(article.publishedAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
