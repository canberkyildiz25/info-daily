'use client';
import { useState } from 'react';
import ArticleCard from './ArticleCard';
import type { Post } from '@/lib/posts';

const PAGE_SIZE = 12;

export default function CategoryPostGrid({ posts }: { posts: Post[] }) {
  const [count, setCount] = useState(PAGE_SIZE);
  const visible = posts.slice(0, count);
  const remaining = posts.length - count;

  return (
    <div>
      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map(post => (
          <ArticleCard key={`${post.category}-${post.slug}`} post={post} featured />
        ))}
      </div>

      {remaining > 0 && (
        <div className="mt-16 pt-6 border-t border-[var(--border)] flex flex-wrap items-center justify-between gap-4">
          <span className="type-label text-[var(--text-muted)] tabular-nums">
            Showing {visible.length} of {posts.length}
          </span>
          <button
            onClick={() => setCount(c => c + PAGE_SIZE)}
            className="inline-flex items-center gap-3 h-12 px-6 bg-[var(--text-base)] text-[var(--bg-base)] text-[0.9375rem] font-semibold hover:bg-[var(--accent)] active:scale-[0.97] transition-[background-color,transform] duration-150"
          >
            Show {Math.min(PAGE_SIZE, remaining)} more
          </button>
        </div>
      )}
    </div>
  );
}
