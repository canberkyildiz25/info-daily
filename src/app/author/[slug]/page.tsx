import { AUTHORS, getAuthorBySlug } from '@/lib/authors';
import { getPostsByAuthor, CATEGORIES } from '@/lib/posts';
import { getCoverImageUrl } from '@/lib/pexels';
import ArticleCard from '@/components/ArticleCard';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

const SITE_URL = 'https://www.infodaily.net';

export function generateStaticParams() {
  return AUTHORS.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return {};
  const title = `${author.name} – ${author.title} | InfoDaily`;
  return {
    title,
    description: author.bio,
    alternates: { canonical: `${SITE_URL}/author/${slug}` },
    openGraph: {
      title,
      description: author.bio,
      type: 'profile',
      url: `${SITE_URL}/author/${slug}`,
      siteName: 'InfoDaily',
    },
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) notFound();

  const rawPosts = getPostsByAuthor(author.name);
  const posts = await Promise.all(
    rawPosts.map(async post => ({
      ...post,
      coverImage: await getCoverImageUrl(`${post.title} ${post.category}`, post.slug) || post.coverImage,
    }))
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.title,
    description: author.bio,
    url: `${SITE_URL}/author/${slug}`,
    worksFor: { '@type': 'Organization', name: 'InfoDaily', url: SITE_URL },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 dark:text-slate-500 mb-8">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
        <span>/</span>
        <span className="text-gray-600 dark:text-slate-400">Authors</span>
        <span>/</span>
        <span className="text-gray-600 dark:text-slate-400">{author.name}</span>
      </nav>

      {/* Author profile */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-8 mb-10">
        <div className="flex items-start gap-6">
          <div className={`w-20 h-20 rounded-full ${author.avatarColor} flex items-center justify-center text-white font-black text-3xl flex-shrink-0`}>
            {author.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-gray-900 dark:text-slate-100 mb-1">{author.name}</h1>
            <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm mb-3">{author.title}</p>
            <p className="text-gray-500 dark:text-slate-400 leading-relaxed">{author.bio}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 text-xs font-medium px-3 py-1 rounded-full">
                {author.specialty}
              </span>
              <span className="text-gray-400 dark:text-slate-500 text-sm">
                {posts.length} article{posts.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Articles */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-5">
        Articles by {author.name}
      </h2>

      {posts.length === 0 ? (
        <p className="text-gray-500 dark:text-slate-400 text-center py-20">No articles yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map(post => (
            <ArticleCard key={`${post.category}-${post.slug}`} post={post} featured />
          ))}
        </div>
      )}
    </div>
  );
}
