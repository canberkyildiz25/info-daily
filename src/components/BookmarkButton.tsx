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
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
        saved
          ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400'
          : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-500 dark:text-slate-400 hover:border-blue-300 dark:hover:border-blue-600'
      }`}
    >
      <svg className="w-3.5 h-3.5" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
      </svg>
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
