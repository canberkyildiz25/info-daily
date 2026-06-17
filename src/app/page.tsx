import { getAllPosts } from '@/lib/posts';
import { CATEGORIES } from '@/lib/categories';
import HomeFeaturedPosts from '@/components/HomeFeaturedPosts';
import TrendingTopics from '@/components/TrendingTopics';
import { getCoverImageUrl } from '@/lib/pexels';
import { getAuthorByName, authorNameToSlug } from '@/lib/authors';
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
      <section className="mb-10 pt-2 border-b border-[var(--border)] pb-8">
        <p className="animate-fade-in text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)] mb-3">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <h1 className="animate-fade-in-up text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-base)] mb-3 leading-[1.1]" style={{ fontFamily: 'Georgia, serif' }}>
          Knowledge for Every Day
        </h1>
        <p className="animate-fade-in-up delay-150 text-[var(--text-muted)] text-base mb-6 max-w-2xl leading-relaxed">
          Expert articles on health, finance, technology, travel, food, science, and more — curated daily for curious minds.
        </p>
        <div className="animate-fade-in-up delay-200 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] inline-block" />
            <strong className="text-[var(--text-base)]">{allPosts.length}+</strong> articles
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            <strong className="text-[var(--text-base)]">18</strong> expert authors
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block" />
            <strong className="text-[var(--text-base)]">{CATEGORIES.length}</strong> topics
          </span>
          <Link href="/authors" className="flex items-center gap-1 text-[var(--accent)] font-bold hover:underline ml-auto text-xs uppercase tracking-wide">
            Meet our authors →
          </Link>
        </div>
      </section>

      {/* Trending Topics */}
      <TrendingTopics />

      {/* Article of the Day */}
      {todayPost && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] inline-block" />
              <span className="text-xs font-black uppercase tracking-[0.16em] text-[var(--text-base)]">Article of the Day</span>
            </div>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <Link href={`/${todayPost.category}/${todayPost.slug}`} className="group block">
            <div className="premium-card card-hover overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image */}
                <div className="relative h-56 md:h-72 overflow-hidden bg-gray-100 dark:bg-slate-700">
                  {todayPost.coverImage ? (
                    <Image
                      src={todayPost.coverImage}
                      alt={todayPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-blue-500 to-indigo-600">
                      {todayCat?.icon}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col justify-center bg-[var(--bg-card)]">
                  <div className="flex items-center gap-2.5 mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] border border-[var(--accent)] px-2.5 py-0.5 rounded">
                      {todayCat?.icon} {todayCat?.label}
                    </span>
                    <span className="text-[var(--text-muted)] text-xs">{todayPost.readingTime}</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-black text-[var(--text-base)] group-hover:text-[var(--accent)] transition-colors leading-snug mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                    {todayPost.title}
                  </h2>
                  <p className="text-[var(--text-muted)] leading-relaxed line-clamp-3 mb-6 text-sm">
                    {todayPost.excerpt}
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
                    <img
                      src={todayAuthor?.avatar ?? `https://i.pravatar.cc/300?u=infodaily-${authorNameToSlug(todayPost.author)}`}
                      alt={todayPost.author}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      fetchPriority="low"
                    />
                    <span className="text-sm font-semibold text-[var(--text-base)]">{todayPost.author}</span>
                    <span className="ml-auto text-xs font-black text-[var(--accent)] group-hover:underline uppercase tracking-wide">
                      Read →
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
        <div className="flex items-center gap-3 mb-7">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] inline-block" />
            <h2 className="text-xs font-black uppercase tracking-[0.16em] text-[var(--text-base)]">Featured Articles</h2>
          </div>
          <div className="flex-1 h-px bg-[var(--border)]" />
        </div>
        <HomeFeaturedPosts posts={featuredPosts} />
      </section>

    </div>
  );
}
