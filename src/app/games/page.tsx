'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import PageHead from '@/components/PageHead';

const GAMES = [
  {
    id: 'snake',
    title: 'Snake',
    description: 'Classic snake — eat, grow, survive.',
    src: '/games/snake.html',
    cover: '/games/covers/snake.svg',
  },
  {
    id: 'memory',
    title: 'Memory',
    description: 'Flip cards and match pairs.',
    src: '/games/memory.html',
    cover: '/games/covers/memory.svg',
  },
  {
    id: '2048',
    title: '2048',
    description: 'Slide tiles, reach 2048.',
    src: '/games/2048.html',
    cover: '/games/covers/2048.svg',
  },
  {
    id: 'tictactoe',
    title: 'Tic Tac Toe',
    description: 'Beat the CPU at classic X and O.',
    src: '/games/tictactoe.html',
    cover: '/games/covers/tictactoe.svg',
  },
  {
    id: 'breakout',
    title: 'Breakout',
    description: 'Smash bricks with a bouncing ball.',
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
    <div data-surface="stage" className="dark fixed inset-0 z-[var(--z-overlay)] flex flex-col bg-[var(--bg-base)]" role="dialog" aria-modal="true" aria-label={game.title}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
        <span className="type-display text-xl text-white">{game.title}</span>
        <button
          onClick={onClose}
          className="flex items-center gap-2 min-h-11 px-3 -mr-3 text-sm font-medium text-white/70 hover:text-white transition-colors"
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

      <PageHead
        label="Play"
        title="Games"
        intro="Small browser games that run right here. No download, no account."
      />

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 pt-10 border-t border-[var(--border)]">
          {GAMES.map(game => (
            <button
              key={game.id}
              onClick={() => setActiveGame(game)}
              className="group block text-left min-w-0"
            >
              <span className="card-media relative block aspect-[16/10] overflow-hidden bg-[var(--bg-card-hover)]">
                <Image
                  src={game.cover}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </span>
              <span className="type-label mt-4 block text-[var(--accent)]">Play in browser</span>
              <span className="card-title type-display type-display-m mt-1 block text-[var(--text-base)]">{game.title}</span>
              <span className="mt-2 block text-[var(--text-muted)]">{game.description}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
