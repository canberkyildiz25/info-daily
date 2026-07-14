'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

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
    cover: '/games/covers/snake.svg',
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
    cover: '/games/covers/memory.svg',
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
    cover: '/games/covers/2048.svg',
  },
  {
    id: 'tictactoe',
    title: 'Tic Tac Toe',
    description: 'Beat the CPU at classic X and O.',
    icon: '❌',
    color: 'from-blue-900/60 to-blue-800/40',
    border: 'border-blue-700/40',
    accent: 'text-blue-400',
    src: '/games/tictactoe.html',
    cover: '/games/covers/tictactoe.svg',
  },
  {
    id: 'breakout',
    title: 'Breakout',
    description: 'Smash bricks with a bouncing ball.',
    icon: '🧱',
    color: 'from-cyan-900/60 to-cyan-800/40',
    border: 'border-cyan-700/40',
    accent: 'text-cyan-400',
    src: '/games/breakout.html',
    cover: '/games/covers/breakout.svg',
  },
];

function GameModal({ game, onClose }: { game: typeof GAMES[0]; onClose: () => void }) {
  useEffect(() => {
    // Push a history entry so the back button closes the modal instead of leaving the page
    history.pushState({ game: game.id }, '');
    const onPop = () => onClose();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { history.back(); } };
    window.addEventListener('popstate', onPop);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('popstate', onPop);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, game.id]);

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
            Play browser games instantly — no download needed.
          </p>
        </div>

        {/* Browser Games */}
        <section className="mb-14">
          <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-5 flex items-center gap-2">
            <span className="w-4 h-px bg-[var(--accent)] inline-block" />
            Play Now
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {GAMES.map(game => (
              <button
                key={game.id}
                onClick={() => setActiveGame(game)}
                className={`group relative rounded-2xl border ${game.border} bg-gradient-to-br ${game.color} overflow-hidden text-left hover:scale-[1.02] active:scale-[0.99] transition-transform duration-200 cursor-pointer`}
              >
                <div className="relative h-36 w-full">
                  <Image
                    src={game.cover}
                    alt={game.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6">
                  <h3 className={`text-xl font-black ${game.accent} mb-1`}>{game.title}</h3>
                  <p className="text-sm text-white/60 mb-5">{game.description}</p>
                  <span className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors uppercase tracking-wide">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Play
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
