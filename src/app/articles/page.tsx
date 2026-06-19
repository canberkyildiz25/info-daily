import { getAllPosts } from '@/lib/posts';
import { CATEGORIES } from '@/lib/categories';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles — InfoDaily',
  description: 'Expert articles on health, finance, technology, travel, food, science, and more.',
  alternates: { canonical: 'https://www.infodaily.net/articles' },
};

export default function ArticlesPage() {
  const allPosts = getAllPosts();

  const categoriesWithPosts = CATEGORIES
    .map(cat => ({
      ...cat,
      posts: allPosts.filter(p => p.category === cat.slug),
    }))
    .filter(c => c.posts.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Page header */}
      <div className="mb-8 pb-6 border-b border-[var(--border)]">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)] mb-2">Expert Knowledge</p>
        <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-base)] mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          In-Depth Articles
        </h1>
        <p className="text-[var(--text-muted)] max-w-xl leading-relaxed">
          Long-form, research-backed articles on health, finance, technology, and more — written by our expert authors.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          {categoriesWithPosts.map(cat => (
            <Link
              key={cat.slug}
              href={`#${cat.slug}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              {cat.icon} {cat.label}
              <span className="ml-1 text-[10px] opacity-60">{cat.posts.length}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Articles by category */}
      <div className="space-y-12">
        {categoriesWithPosts.map(cat => (
          <section key={cat.slug} id={cat.slug}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{cat.icon}</span>
                <h2 className="text-base font-black text-[var(--text-base)] uppercase tracking-widest">{cat.label}</h2>
                <span className="text-xs text-[var(--text-muted)] font-medium">{cat.posts.length} articles</span>
              </div>
              <Link
                href={`/category/${cat.slug}`}
                className="text-xs font-bold text-[var(--accent)] hover:underline uppercase tracking-wide"
              >
                See all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cat.posts.slice(0, 6).map(post => (
                <ArticleCard key={`${post.category}-${post.slug}`} post={post} featured />
              ))}
            </div>
            {cat.posts.length > 6 && (
              <div className="mt-4 text-center">
                <Link
                  href={`/category/${cat.slug}`}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-[var(--border)] text-sm font-semibold text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                >
                  View all {cat.posts.length} {cat.label} articles →
                </Link>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
