'use client';

import { useEffect, useState } from 'react';
import type { Heading } from '@/lib/posts';

/* İçindekiler. Kutusuz: kenar boşluğunda duran ince bir liste, okunan
   bölümün yanında vurgu renginde bir çizgi. `bare` — mobilde açılır
   bloğun içinde, başlıksız. */
export default function TableOfContents({ headings, bare = false }: { headings: Heading[]; bare?: boolean }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-20% 0% -70% 0%', threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <div>
      {!bare && <p className="type-label text-[var(--text-muted)] mb-4">In this guide</p>}
      <ol className="border-l border-[var(--border)]">
        {headings.map(({ id, text, level }) => {
          const active = activeId === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  history.replaceState(null, '', `#${id}`);
                  setActiveId(id);
                }}
                aria-current={active ? 'location' : undefined}
                className={`relative block py-1.5 text-[0.875rem] leading-snug transition-colors ${level === 3 ? 'pl-7' : 'pl-4'} ${
                  active ? 'text-[var(--text-base)] font-medium' : 'text-[var(--text-muted)] hover:text-[var(--text-base)]'
                }`}
              >
                {active && <span aria-hidden className="absolute -left-px top-1.5 bottom-1.5 w-0.5 bg-[var(--accent)]" />}
                {text}
              </a>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
