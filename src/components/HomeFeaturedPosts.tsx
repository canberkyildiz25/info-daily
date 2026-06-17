'use client';
import ArticleCard from './ArticleCard';
import type { Post } from '@/lib/posts';
import { CATEGORIES } from '@/lib/categories';
import Link from 'next/link';

const CAT_GRADIENTS: Record<string, string> = {
  health: 'from-emerald-500 to-teal-600',
  finance: 'from-amber-500 to-orange-500',
  technology: 'from-blue-500 to-indigo-600',
  'life-hacks': 'from-violet-500 to-purple-600',
  travel: 'from-sky-400 to-cyan-500',
  food: 'from-orange-400 to-red-500',
  business: 'from-slate-500 to-slate-700',
  science: 'from-teal-500 to-emerald-600',
  relationships: 'from-rose-400 to-pink-600',
  entertainment: 'from-purple-500 to-fuchsia-600',
};

export default function HomeFeaturedPosts({ posts }: { posts: Post[] }) {
  const categoriesWithPosts = CATEGORIES
    .map(cat => ({
      ...cat,
      posts: posts.filter(p => p.category === cat.slug).slice(0, 3),
    }))
    .filter(c => c.posts.length > 0);

  return (
    <div className="space-y-12">
      {categoriesWithPosts.map((cat, idx) => {
        const grad = CAT_GRADIENTS[cat.slug] ?? 'from-blue-500 to-indigo-600';
        return (
          <section key={cat.slug}>
            {/* Section header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="text-xl leading-none">{cat.icon}</span>
                  <h2 className="text-base font-black text-[var(--text-base)] tracking-tight uppercase" style={{ letterSpacing: '0.08em' }}>{cat.label}</h2>
                </div>
                <div className={`h-[2px] w-10 rounded-full bg-gradient-to-r ${grad}`} />
              </div>
              <Link
                href={`/category/${cat.slug}`}
                className="text-xs font-bold text-[var(--accent)] hover:underline flex items-center gap-1 tracking-wide uppercase"
                style={{ letterSpacing: '0.06em' }}
              >
                See all <span>→</span>
              </Link>
            </div>

            {/* 3-column grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cat.posts.map((post, i) => (
                <div
                  key={`${post.category}-${post.slug}`}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${(idx * 3 + i) * 40}ms` }}
                >
                  <ArticleCard post={post} featured imagePriority={idx === 0 && i < 3} />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
