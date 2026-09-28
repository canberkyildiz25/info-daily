'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';

interface PostMeta {
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  tags: string[];
  readingTime: string;
}

function highlight(text: string, query: string): string {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark class="bg-accent-100 text-inherit dark:bg-accent-900">$1</mark>');
}

/* Arama. Düğme artık yalnızca ikon — "Search" yazısı ve ⌘K rozeti
   başlıktaki en kalabalık kontroldü. Katman body'ye portal ediliyor:
   başlığın içinde kaldığında, başlığa ileride bir transform ya da
   backdrop-filter verilirse `fixed inset-0` başlığın kutusuna hapsolur. */
export default function SearchBar({ stage = false }: { stage?: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<PostMeta[]>([]);
  const [results, setResults] = useState<PostMeta[]>([]);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Load index once
  useEffect(() => {
    if (open && index.length === 0) {
      fetch('/api/search-index')
        .then(r => r.json())
        .then((data: PostMeta[]) => setIndex(data))
        .catch(() => {});
    }
  }, [open, index.length]);

  // Filter results
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    const filtered = index
      .filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      )
      .slice(0, 8);
    setResults(filtered);
    setSelected(0);
  }, [query, index]);

  // Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    /* Alt menüdeki Search düğmesi bu olayı yolluyor. Eskiden yalnızca
       sayfayı en üste kaydırıyordu, aramayı açmıyordu. */
    const openFromElsewhere = () => setOpen(true);
    window.addEventListener('keydown', handler);
    window.addEventListener('infodaily:search', openFromElsewhere);
    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('infodaily:search', openFromElsewhere);
    };
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else setQuery('');
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && results[selected]) {
      window.location.href = `/${results[selected].category}/${results[selected].slug}`;
      close();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-11 h-11 justify-center text-[var(--text-base)] hover:text-[var(--accent)] transition-colors"
        aria-label="Search guides"
        title="Search (Ctrl K)"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.5 15.5 21 21" strokeLinecap="square" />
        </svg>
      </button>

      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[12vh] px-4" onClick={close}>
          <div className="absolute inset-0 bg-black/60" />

          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search guides"
            data-surface={stage ? 'stage' : undefined}
            className={`${stage ? 'dark ' : ''}relative w-full max-w-2xl bg-[var(--bg-base)] text-[var(--text-base)] border border-[var(--border)] overflow-hidden`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 border-b border-[var(--border)]">
              <svg width="20" height="20" className="text-[var(--text-muted)] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden>
                <circle cx="10.5" cy="10.5" r="6.5" />
                <path d="M15.5 15.5 21 21" strokeLinecap="square" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Search guides"
                aria-label="Search guides"
                className="flex-1 min-w-0 h-16 bg-transparent text-[var(--text-base)] placeholder:text-[var(--text-muted)] outline-none text-lg"
              />
              <button
                onClick={close}
                className="inline-flex items-center min-h-11 type-label text-[var(--text-muted)] hover:text-[var(--text-base)]"
              >
                Esc
              </button>
            </div>

            {results.length > 0 && (
              <ul className="max-h-[60vh] overflow-y-auto">
                {results.map((post, i) => {
                  const cat = CATEGORIES.find(c => c.slug === post.category);
                  return (
                    <li key={`${post.category}-${post.slug}`} className="border-b border-[var(--border)] last:border-0">
                      <Link
                        href={`/${post.category}/${post.slug}`}
                        onClick={close}
                        className={`block px-5 py-4 transition-colors ${i === selected ? 'bg-[var(--bg-card-hover)]' : 'hover:bg-[var(--bg-card-hover)]'}`}
                      >
                        <span className="type-label text-[var(--accent)]">{cat?.label}</span>
                        <p
                          className="mt-1 text-[0.9375rem] font-semibold leading-snug"
                          dangerouslySetInnerHTML={{ __html: highlight(post.title, query) }}
                        />
                        <p
                          className="text-sm text-[var(--text-muted)] mt-0.5 line-clamp-1"
                          dangerouslySetInnerHTML={{ __html: highlight(post.excerpt, query) }}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}

            {query && results.length === 0 && (
              <p className="px-5 py-10 text-[var(--text-muted)] text-sm">
                Nothing matches &ldquo;{query}&rdquo;. Try a device or a brand name.
              </p>
            )}

            {!query && (
              <p className="px-5 py-6 text-[var(--text-muted)] text-sm">
                {index.length > 0 ? `${index.length} guides.` : 'Loading guides…'} Search by device, brand or problem.
              </p>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
