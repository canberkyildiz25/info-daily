import { AUTHORS } from '@/lib/authors';
import { getPostsByAuthor } from '@/lib/posts';
import Link from 'next/link';
import PageHead from '@/components/PageHead';
import AuthorBadge from '@/components/AuthorBadge';
import { CATEGORIES } from '@/lib/categories';
import type { Metadata } from 'next';

const SITE_URL = 'https://www.infodaily.net';

export const metadata: Metadata = {
  title: 'InfoDaily Editorial Team | Standards & Coverage',
  description:
    'Meet the InfoDaily editorial desk and learn how we approach practical guides, source-led explainers, and updates.',
  alternates: { canonical: `${SITE_URL}/authors` },
  openGraph: {
    title: 'InfoDaily Editorial Team | Standards & Coverage',
    description:
      'Meet the InfoDaily editorial desk and learn how we approach practical guides, source-led explainers, and updates.',
    url: `${SITE_URL}/authors`,
    siteName: 'InfoDaily',
    type: 'website',
  },
};

export default function AuthorsPage() {
  const authorsWithCounts = AUTHORS.map(author => ({
    ...author,
    articleCount: getPostsByAuthor(author.name).length,
  })).sort((a, b) => b.articleCount - a.articleCount);

  const total = authorsWithCounts.reduce((sum, a) => sum + a.articleCount, 0);

  /* Buradaki üç kutulu sayaç şeridinden biri elle yazılmış "11 Topics
     covered" idi; site iki bölüme indiğinden beri yanlıştı. Sayılar artık
     arşivden okunuyor ve tek satır. */
  return (
    <div>
      <PageHead
        label="Editorial"
        title="Who writes InfoDaily"
        intro="We publish practical guides and timely explainers under one accountable editorial byline. Here is who that is, what we cover, and what to expect from every article."
      >
        <p className="type-label mt-6 text-[var(--text-muted)] tabular-nums">
          {total} guides · {CATEGORIES.length} sections · {AUTHORS.length === 1 ? 'one editorial desk' : `${AUTHORS.length} bylines`}
        </p>
      </PageHead>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10">
        <ul className="border-t border-[var(--border)]">
          {authorsWithCounts.map(author => (
            <li key={author.slug} className="border-b border-[var(--border)]">
              <Link
                href={`/author/${author.slug}`}
                className="group grid gap-6 py-10 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start"
              >
                <AuthorBadge name={author.name} size={56} />
                <div className="min-w-0">
                  <h2 className="card-title type-display type-display-m text-[var(--text-base)]">{author.name}</h2>
                  <p className="type-label mt-2 text-[var(--accent)]">{author.title}</p>
                  <p className="mt-4 max-w-[60ch] text-[var(--text-muted)] leading-relaxed">{author.bio}</p>
                </div>
                <span className="type-label text-[var(--text-muted)] tabular-nums sm:pt-2">
                  {author.articleCount} guide{author.articleCount !== 1 ? 's' : ''}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
