import { getPostsByCategory, CATEGORIES } from '@/lib/posts';
import ArticleCard from '@/components/ArticleCard';
import { AdPlaceholder } from '@/components/AdBanner';
import { getCoverImageUrl } from '@/lib/pexels';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return CATEGORIES.map(cat => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find(c => c.slug === slug);
  if (!cat) return {};
  return {
    title: `${cat.label} Articles`,
    description: cat.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = CATEGORIES.find(c => c.slug === slug);
  if (!cat) notFound();

  const rawPosts = getPostsByCategory(slug);
  const posts = await Promise.all(
    rawPosts.map(async post => ({
      ...post,
      coverImage: await getCoverImageUrl(`${post.title} ${post.category}`, post.slug) || post.coverImage,
    }))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Ad */}
      <div className="mb-8">
        <AdPlaceholder label="Advertisement – 728×90" height={90} />
      </div>

      {/* Category header */}
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{cat.icon}</span>
          <h1 className="text-3xl font-black text-gray-900 dark:text-slate-100">{cat.label}</h1>
        </div>
        <p className="text-gray-500 dark:text-slate-400 text-lg">{cat.description}</p>
        <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">{posts.length} articles</p>
      </div>

      {/* Articles grid + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {posts.length === 0 ? (
            <p className="text-gray-500 dark:text-slate-400 text-center py-20">No articles yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {posts.map(post => (
                <ArticleCard key={post.slug} post={post} featured />
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <AdPlaceholder label="Advertisement – 300×250" height={250} />

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 dark:text-slate-100 mb-4">Other Categories</h3>
            <div className="space-y-1">
              {CATEGORIES.filter(c => c.slug !== slug).map(c => (
                <a
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 text-sm text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  {c.icon} {c.label}
                </a>
              ))}
            </div>
          </div>

          <AdPlaceholder label="Advertisement – 300×600" height={300} />
        </aside>
      </div>
    </div>
  );
}
