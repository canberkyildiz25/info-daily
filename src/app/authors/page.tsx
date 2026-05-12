import { AUTHORS } from '@/lib/authors';
import { getPostsByAuthor } from '@/lib/posts';
import Link from 'next/link';
import type { Metadata } from 'next';

const SITE_URL = 'https://www.infodaily.net';

export const metadata: Metadata = {
  title: 'Meet Our Authors | InfoDaily',
  description:
    'InfoDaily is written by a team of expert writers, researchers, and specialists across health, finance, technology, travel, and more.',
  alternates: { canonical: `${SITE_URL}/authors` },
  openGraph: {
    title: 'Meet Our Authors | InfoDaily',
    description:
      'InfoDaily is written by a team of expert writers, researchers, and specialists across health, finance, technology, travel, and more.',
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 dark:text-slate-500 mb-8">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-600 dark:text-slate-400">Authors</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-slate-100 mb-3">
          Meet Our Authors
        </h1>
        <p className="text-gray-500 dark:text-slate-400 max-w-2xl text-lg">
          InfoDaily is written by a diverse team of journalists, researchers, and subject-matter experts. Every article is crafted to be accurate, practical, and genuinely useful.
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-12">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-5 text-center">
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{AUTHORS.length}</div>
          <div className="text-sm text-gray-500 dark:text-slate-400 mt-1">Expert Writers</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-5 text-center">
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            {authorsWithCounts.reduce((sum, a) => sum + a.articleCount, 0)}
          </div>
          <div className="text-sm text-gray-500 dark:text-slate-400 mt-1">Articles Published</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-5 text-center">
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">10+</div>
          <div className="text-sm text-gray-500 dark:text-slate-400 mt-1">Topics Covered</div>
        </div>
      </div>

      {/* Author grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {authorsWithCounts.map(author => (
          <Link
            key={author.slug}
            href={`/author/${author.slug}`}
            className="group bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-200 p-6 flex flex-col"
          >
            {/* Avatar + name */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={author.avatar}
                alt={author.name}
                className="w-14 h-14 rounded-full object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <h2 className="text-base font-bold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight truncate">
                  {author.name}
                </h2>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5 truncate">
                  {author.title}
                </p>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed line-clamp-3 flex-1 mb-4">
              {author.bio}
            </p>

            {/* Expertise tags */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {author.expertise.slice(0, 2).map(tag => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
              <span className="text-xs text-gray-400 dark:text-slate-500">
                {author.articleCount} article{author.articleCount !== 1 ? 's' : ''}
              </span>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                View profile →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
