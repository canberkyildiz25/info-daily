import { getAllPosts } from '@/lib/posts';
import { CATEGORIES } from '@/lib/categories';
import HomeFeaturedPosts from '@/components/HomeFeaturedPosts';
import TrendingTopics from '@/components/TrendingTopics';
import { getCoverImageUrl } from '@/lib/pexels';
import { getAuthorByName } from '@/lib/authors';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: 'https://www.infodaily.net' },
};

export default async function HomePage() {
  const allPosts = getAllPosts();

  // Only fetch Pexels images for hero + featured (7 posts) to keep the page fast
  const heroAndFeatured = allPosts.slice(0, 7);
  const upgraded = await Promise.all(
    heroAndFeatured.map(async post => {
      const hasValidImage = post.coverImage &&
        !post.coverImage.startsWith('/images/') &&
        !post.coverImage.includes('source.unsplash.com');
      return {
        ...post,
        coverImage: hasValidImage
          ? post.coverImage
          : await getCoverImageUrl(`${post.title} ${post.category}`, post.slug) || post.coverImage,
      };
    })
  );

  const todayPost = upgraded[0];
  // All posts except hero: first 6 have Pexels-upgraded images, rest use frontmatter images
  const featuredPosts = [...upgraded.slice(1), ...allPosts.slice(7)];
  const todayCat = CATEGORIES.find(c => c.slug === todayPost?.category);
  const todayAuthor = todayPost ? getAuthorByName(todayPost.author) : undefined;
  const todayAvatarColor = todayAuthor?.avatarColor ?? 'bg-blue-600';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Hero */}
      <section className="mb-8">
        <h1 className="animate-fade-in-up text-3xl sm:text-4xl font-black text-gray-900 dark:text-slate-100 mb-2">
          Knowledge for Every Day
        </h1>
        <p className="animate-fade-in-up delay-150 text-gray-500 dark:text-slate-400 text-lg mb-5">
          Expert articles on health, finance, technology, travel, food, science, and more — all in one place.
        </p>
        <div className="animate-fade-in-up flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-400 dark:text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
            <strong className="text-gray-700 dark:text-slate-300">{allPosts.length}+</strong> articles
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            <strong className="text-gray-700 dark:text-slate-300">18</strong> expert authors
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />
            <strong className="text-gray-700 dark:text-slate-300">{CATEGORIES.length}</strong> topics
          </span>
          <Link href="/authors" className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-semibold hover:underline ml-auto">
            Meet our authors →
          </Link>
        </div>
      </section>

      {/* Trending Topics */}
      <TrendingTopics />

      {/* Article of the Day */}
      {todayPost && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="animate-scale-in bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md shadow-blue-500/30" style={{ animation: 'scaleIn 0.4s cubic-bezier(.22,1,.36,1) both, pulse-glow 2.5s ease-in-out 0.5s infinite' }}>
              ✦ Article of the Day
            </span>
            <span className="text-xs text-gray-400 dark:text-slate-500">
              {new Date(todayPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <Link href={`/${todayPost.category}/${todayPost.slug}`} className="group block">
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image */}
                <div className="relative h-56 md:h-72 overflow-hidden">
                  {todayPost.coverImage ? (
                    <Image
                      src={todayPost.coverImage}
                      alt={todayPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-blue-500 to-indigo-600">
                      {todayCat?.icon}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">
                      {todayCat?.icon} {todayCat?.label}
                    </span>
                    <span className="text-gray-400 dark:text-slate-500 text-xs">{todayPost.readingTime}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight mb-3">
                    {todayPost.title}
                  </h2>
                  <p className="text-gray-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-5">
                    {todayPost.excerpt}
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={todayAuthor?.avatar ?? `https://i.pravatar.cc/300?u=infodaily-${todayPost.author.toLowerCase().replace(/\s+/g, '-')}`}
                      alt={todayPost.author}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      fetchPriority="low"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{todayPost.author}</span>
                    <span className="ml-auto text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:underline">
                      Read article →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Featured Articles */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-5">Featured Articles</h2>
        <HomeFeaturedPosts posts={featuredPosts} />
      </section>

    </div>
  );
}
