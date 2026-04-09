import { getAllPosts, CATEGORIES } from '@/lib/posts';
import ArticleCard from '@/components/ArticleCard';
import { AdPlaceholder } from '@/components/AdBanner';
import Link from 'next/link';

export default function HomePage() {
  const allPosts = getAllPosts();
  const featuredPosts = allPosts.slice(0, 6);
  const latestPosts = allPosts.slice(6, 14);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Top Banner Ad */}
      <div className="mb-8">
        <AdPlaceholder label="Advertisement – 728×90" height={90} />
      </div>

      {/* Hero */}
      <section className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-slate-100 mb-2">
          Knowledge for Every Day
        </h1>
        <p className="text-gray-500 dark:text-slate-400 text-lg">
          Health, money, tech, and life tips — all in one place.
        </p>
      </section>

      {/* Featured Articles */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-5">Featured Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredPosts.map(post => (
            <ArticleCard key={`${post.category}-${post.slug}`} post={post} featured />
          ))}
        </div>
      </section>

      {/* Mid Ad */}
      <div className="mb-10">
        <AdPlaceholder label="Advertisement – 336×280" height={280} />
      </div>

      {/* Latest + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-4">Latest Articles</h2>
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-4">
            {latestPosts.map(post => (
              <ArticleCard key={`${post.category}-${post.slug}`} post={post} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <AdPlaceholder label="Advertisement – 300×250" height={250} />

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 dark:text-slate-100 mb-4">Browse by Category</h3>
            <div className="space-y-1">
              {CATEGORIES.map(cat => {
                const count = allPosts.filter(p => p.category === cat.slug).length;
                return (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 group transition-colors"
                  >
                    <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium">
                      {cat.icon} {cat.label}
                    </span>
                    <span className="text-xs text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 px-2 py-0.5 rounded-full">{count}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          <AdPlaceholder label="Advertisement – 300×600" height={300} />
        </aside>
      </div>
    </div>
  );
}
