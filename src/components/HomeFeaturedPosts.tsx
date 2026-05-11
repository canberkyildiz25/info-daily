'use client';
import { useState } from 'react';
import ArticleCard from './ArticleCard';
import type { Post } from '@/lib/posts';
import { CATEGORIES } from '@/lib/categories';

const PAGE_SIZE = 9;

export default function HomeFeaturedPosts({ posts }: { posts: Post[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [count, setCount] = useState(PAGE_SIZE);

  const filtered = activeCategory === 'all'
    ? posts
    : posts.filter(p => p.category === activeCategory);

  const visible = filtered.slice(0, count);
  const remaining = filtered.length - count;

  function handleTab(slug: string) {
    setActiveCategory(slug);
    setCount(PAGE_SIZE);
  }

  // Only show categories that have at least one post in the list
  const activeCats = CATEGORIES.filter(c => posts.some(p => p.category === c.slug));

  return (
    <div>
      {/* Category tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1 mb-5">
        <button
          onClick={() => handleTab('all')}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
            activeCategory === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
          }`}
        >
          All
        </button>
        {activeCats.map(cat => (
          <button
            key={cat.slug}
            onClick={() => handleTab(cat.slug)}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
              activeCategory === cat.slug
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-slate-300 border border-gray-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
            }`}
          >
            <span className="text-sm leading-none">{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visible.map((post, i) => (
          <div
            key={`${post.category}-${post.slug}`}
            className="animate-fade-in-up"
            style={{ animationDelay: `${Math.min(i % PAGE_SIZE, 8) * 60}ms` }}
          >
            <ArticleCard post={post} featured />
          </div>
        ))}
      </div>

      {/* Load more — only shown when there are more */}
      {remaining > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setCount(c => c + PAGE_SIZE)}
            className="flex items-center gap-2 px-7 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 text-gray-700 dark:text-slate-300 font-semibold rounded-full text-sm transition-all duration-200 hover:shadow-md"
          >
            Show {Math.min(remaining, PAGE_SIZE)} more
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
