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
      </div>

      {/* 2-column layout: left sidebar | main content */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">

        {/* ── Left: Category Sidebar ── */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-3 px-2">Categories</p>

            {/* All articles link */}
            <a
              href="#top"
              className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[var(--bg-card)] border border-transparent hover:border-[var(--border)] transition-all text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--accent)]"
            >
              <span className="flex items-center gap-2">
                <span className="text-base">📰</span>
                <span>All Articles</span>
              </span>
              <span className="text-[10px] font-normal text-[var(--border)]">{allPosts.length}</span>
            </a>

            <div className="h-px bg-[var(--border)] my-2" />

            {categoriesWithPosts.map(cat => (
              <a
                key={cat.slug}
                href={`#${cat.slug}`}
                className="group flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[var(--bg-card)] border border-transparent hover:border-[var(--border)] transition-all text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--accent)]"
              >
                <span className="flex items-center gap-2">
                  <span className="text-base leading-none">{cat.icon}</span>
                  <span>{cat.label}</span>
                </span>
                <span className="text-[10px] font-normal text-[var(--border)] group-hover:text-[var(--text-muted)]">
                  {cat.posts.length}
                </span>
              </a>
            ))}

            <div className="h-px bg-[var(--border)] my-2" />

            <Link
              href="/"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
            >
              <span className="text-base">📡</span>
              <span>Live News →</span>
            </Link>
          </div>
        </aside>

        {/* ── Main: Articles by category ── */}
        <div>
          {/* Mobile: category pill row */}
          <div className="lg:hidden flex flex-wrap gap-2 mb-6">
            {categoriesWithPosts.map(cat => (
              <a
                key={cat.slug}
                href={`#${cat.slug}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
              >
                {cat.icon} {cat.label}
                <span className="ml-1 text-[10px] opacity-60">{cat.posts.length}</span>
              </a>
            ))}
          </div>

          <div className="space-y-12" id="top">
            {categoriesWithPosts.map(cat => (
              <section key={cat.slug} id={cat.slug} className="scroll-mt-24">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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

      </div>
    </div>
  );
}
