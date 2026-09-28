import { getAllPosts } from '@/lib/posts';
import PageHead from '@/components/PageHead';
import SectionHead from '@/components/SectionHead';
import { CATEGORIES } from '@/lib/categories';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Articles — InfoDaily',
  description: 'Every technology and gaming guide on InfoDaily, newest first.',
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
    <div>
      <PageHead
        label="Index"
        title="All guides"
        intro="Every technology and gaming guide on InfoDaily, newest first."
      >
        <nav aria-label="Jump to section" className="mt-8 flex flex-wrap gap-x-8">
          {categoriesWithPosts.map(cat => (
            <Link
              key={cat.slug}
              href={`#${cat.slug}`}
              className="text-[0.9375rem] font-medium text-[var(--text-base)] underline decoration-[var(--border)] underline-offset-[6px] hover:decoration-[var(--accent)] transition-colors"
            >
              {cat.label} <span className="text-[var(--text-muted)] tabular-nums">{cat.posts.length}</span>
            </Link>
          ))}
        </nav>
      </PageHead>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10 space-y-20 sm:space-y-28">
        {categoriesWithPosts.map(cat => (
          <section key={cat.slug} id={cat.slug} aria-labelledby={`h-${cat.slug}`} className="scroll-mt-20">
            <SectionHead
              id={`h-${cat.slug}`}
              title={cat.label}
              meta={`${cat.posts.length} guides`}
              href={`/category/${cat.slug}`}
              linkLabel={`${cat.label} page`}
            />
            <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {cat.posts.map(post => (
                <ArticleCard key={`${post.category}-${post.slug}`} post={post} featured />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
