'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark class="bg-yellow-200 dark:bg-yellow-700 rounded px-0.5">$1</mark>');
}

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<PostMeta[]>([]);
  const [results, setResults] = useState<PostMeta[]>([]);
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

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
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
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
      {/* Search button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-400 dark:text-slate-500 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-500 transition-all text-sm bg-white dark:bg-slate-800"
        aria-label="Search"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <span className="hidden sm:inline text-xs">Search</span>
        <kbd className="hidden sm:inline text-[10px] bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded border border-gray-200 dark:border-slate-600 font-mono">⌘K</kbd>
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 px-4" onClick={close}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div
            className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-slate-700">
              <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Search articles..."
                className="flex-1 bg-transparent text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 outline-none text-base"
              />
              {query && (
                <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600 dark:hover:text-slate-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <kbd className="text-[10px] text-gray-400 bg-gray-100 dark:bg-slate-800 px-1.5 py-1 rounded border border-gray-200 dark:border-slate-700 font-mono">ESC</kbd>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <ul className="max-h-96 overflow-y-auto py-2">
                {results.map((post, i) => {
                  const cat = CATEGORIES.find(c => c.slug === post.category);
                  return (
                    <li key={`${post.category}-${post.slug}`}>
                      <Link
                        href={`/${post.category}/${post.slug}`}
                        onClick={close}
                        className={`flex items-start gap-3 px-4 py-3 transition-colors ${i === selected ? 'bg-blue-50 dark:bg-slate-800' : 'hover:bg-gray-50 dark:hover:bg-slate-800/60'}`}
                      >
                        <span className="text-xl mt-0.5 flex-shrink-0">{cat?.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-semibold text-gray-900 dark:text-slate-100 leading-snug"
                            dangerouslySetInnerHTML={{ __html: highlight(post.title, query) }}
                          />
                          <p
                            className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 line-clamp-1"
                            dangerouslySetInnerHTML={{ __html: highlight(post.excerpt, query) }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-400 dark:text-slate-500 flex-shrink-0 mt-1">{post.readingTime}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Empty state */}
            {query && results.length === 0 && (
              <div className="py-10 text-center text-gray-400 dark:text-slate-500 text-sm">
                No results for &quot;{query}&quot;
              </div>
            )}

            {/* Hint */}
            {!query && (
              <div className="py-8 text-center text-gray-400 dark:text-slate-500 text-sm">
                Start typing to search {index.length > 0 ? `${index.length} articles` : 'articles'}...
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
