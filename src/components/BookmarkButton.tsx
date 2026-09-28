'use client';

import { useEffect, useState } from 'react';

interface BookmarkButtonProps {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
}

export interface BookmarkedArticle {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  savedAt: string;
}

export function getBookmarks(): BookmarkedArticle[] {
  try {
    return JSON.parse(localStorage.getItem('bookmarks') || '[]');
  } catch {
    return [];
  }
}

export default function BookmarkButton({ slug, category, title, excerpt, date }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(getBookmarks().some(b => b.slug === slug));
  }, [slug]);

  const toggle = () => {
    const bookmarks = getBookmarks();
    if (saved) {
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks.filter(b => b.slug !== slug)));
      setSaved(false);
    } else {
      const updated = [{ slug, category, title, excerpt, date, savedAt: new Date().toISOString() }, ...bookmarks];
      localStorage.setItem('bookmarks', JSON.stringify(updated));
      setSaved(true);
    }
  };

  return (
    <button
      onClick={toggle}
      title={saved ? 'Remove bookmark' : 'Save article'}
      aria-pressed={saved}
      className={`inline-flex items-center gap-2 min-h-11 px-4 border text-[0.8125rem] font-semibold active:scale-[0.97] transition-[border-color,color,transform] duration-150 ${
        saved
          ? 'border-[var(--accent)] text-[var(--accent)]'
          : 'border-[var(--border)] text-[var(--text-base)] hover:border-[var(--text-muted)]'
      }`}
    >
      <svg className="w-3.5 h-3.5" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24" aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
      </svg>
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
