'use client';
import { useState } from 'react';
import ArticleCard from './ArticleCard';
import type { Post } from '@/lib/posts';

const PAGE_SIZE = 8;

export default function HomeLatestPosts({ posts }: { posts: Post[] }) {
  const [count, setCount] = useState(PAGE_SIZE);
  const visible = posts.slice(0, count);
  const remaining = posts.length - count;

  return (
    <div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-4">
        {visible.map((post, i) => (
          <div
            key={`${post.category}-${post.slug}`}
            className="animate-slide-right"
            style={{ animationDelay: `${Math.min(i, 4) * 60}ms` }}
          >
            <ArticleCard post={post} />
          </div>
        ))}
      </div>

      {remaining > 0 && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setCount(c => c + PAGE_SIZE)}
            className="flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-full text-sm transition-all duration-200 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5"
          >
            Load More
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{remaining} more</span>
          </button>
        </div>
      )}
    </div>
  );
}
