'use client';

import { useEffect, useState } from 'react';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      data-surface="stage"
      /* Mobilde alt menünün üstünde duruyor; eskiden bottom-6'daydı ve
         alt menünün arkasında kalıyordu. Yuvarlak, gölgeli, dolgun vurgu
         renkli düğme sitenin geri kalanıyla konuşmuyordu. */
      className="dark fixed right-4 sm:right-6 bottom-[calc(var(--bottom-nav-h)+env(safe-area-inset-bottom,0px)+1rem)] md:bottom-6 z-[var(--z-float)] w-11 h-11 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-base)] hover:border-[var(--text-muted)] active:scale-[0.97] transition-[border-color,transform] duration-150 ease-[var(--ease-out)] flex items-center justify-center"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
        <path d="M12 19V5M6 11l6-6 6 6" strokeLinecap="square" />
      </svg>
    </button>
  );
}
