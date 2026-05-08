'use client';
import { useState } from 'react';
import ArticleCard from './ArticleCard';
import type { Post } from '@/lib/posts';

const PAGE_SIZE = 6;

export default function HomeFeaturedPosts({ posts }: { posts: Post[] }) {
  const [count, setCount] = useState(PAGE_SIZE);
  const visible = posts.slice(0, count);
  const remaining = posts.length - count;

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visible.map((post, i) => (
          <div
            key={`${post.category}-${post.slug}`}
            className="animate-fade-in-up"
            style={{ animationDelay: `${Math.min(i, 5) * 80}ms` }}
          >
            <ArticleCard post={post} featured />
          </div>
        ))}
      </div>

      {remaining > 0 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setCount(c => c + PAGE_SIZE)}
            className="flex items-center gap-2 px-7 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-full text-sm transition-all duration-200 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5"
          >
            Load More
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{remaining} more articles</span>
          </button>
        </div>
      )}
    </div>
  );
}
