import { getAllPosts } from '@/lib/posts';
import HomeFeaturedPosts from '@/components/HomeFeaturedPosts';
import TrendingSidebar from '@/components/TrendingSidebar';
import BreakingNewsTicker from '@/components/BreakingNewsTicker';
import { getBreakingNews, getTopHeadlines, timeAgo } from '@/lib/news';
import type { NewsArticle } from '@/lib/news';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: 'https://www.infodaily.net' },
};

function NewsCard({ article, large = false }: { article: NewsArticle; large?: boolean }) {
  if (large) {
    return (
      <a href={article.url} target="_blank" rel="noopener noreferrer" className="group block">
        <div className="relative rounded-2xl overflow-hidden" style={{ height: '420px' }}>
          {article.urlToImage ? (
            <Image
              src={article.urlToImage}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
              unoptimized
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full animate-pulse">
              ● Live
            </span>
            <span className="bg-black/40 backdrop-blur-sm text-white/80 text-[10px] px-2.5 py-1 rounded-full">
              {article.source.name}
            </span>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h2 className="text-white text-xl sm:text-2xl lg:text-3xl font-black leading-tight mb-3 group-hover:text-white/90 transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
              {article.title}
            </h2>
            {article.description && (
              <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-4 max-w-xl">
                {article.description}
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-xs">{timeAgo(article.publishedAt)}</span>
              <span className="bg-white text-gray-900 text-xs font-black px-4 py-2 rounded-full group-hover:bg-white/90 transition-colors uppercase tracking-wide">
                Read →
              </span>
            </div>
          </div>
        </div>
      </a>
    );
  }

  return (
    <a href={article.url} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 py-3.5 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-card-hover)] -mx-3 px-3 rounded-xl transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-wider">{article.source.name}</span>
          <span className="text-[var(--border)]">·</span>
          <span className="text-[var(--text-muted)] text-[11px]">{timeAgo(article.publishedAt)}</span>
        </div>
        <h3 className="text-sm font-bold text-[var(--text-base)] group-hover:text-[var(--accent)] leading-snug line-clamp-2 transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
          {article.title}
        </h3>
      </div>
      {article.urlToImage && (
        <div className="relative w-16 h-14 rounded-lg overflow-hidden flex-shrink-0">
          <Image src={article.urlToImage} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="64px" unoptimized />
        </div>
      )}
    </a>
  );
}

export default async function HomePage() {
  const allPosts = getAllPosts();

  // Fetch news + articles in parallel
  const [breakingNews, topHeadlines] = await Promise.all([
    getBreakingNews(8),
    getTopHeadlines(12),
  ]);

  const featuredPosts = allPosts.slice(1);
  const heroNews = topHeadlines[0] ?? null;
  const sideNews = topHeadlines.slice(1, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* Breaking news ticker */}
      <BreakingNewsTicker articles={breakingNews} />

      {/* Page header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)] mb-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-base)] leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Today&rsquo;s Top Stories
          </h1>
        </div>
        <Link href="/articles" className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] hover:underline uppercase tracking-wide">
          Expert Articles →
        </Link>
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: main content (2/3) */}
        <div className="lg:col-span-2 space-y-8">

          {/* Live news hero */}
          {heroNews && (
            <section>
              <NewsCard article={heroNews} large />
            </section>
          )}

          {/* More top stories — compact list */}
          {sideNews.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-base)]">More Top Stories</h2>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-3 py-1">
                {sideNews.map((article, i) => (
                  <NewsCard key={i} article={article} />
                ))}
              </div>
            </section>
          )}

          {/* Expert Articles section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <h2 className="text-xs font-black uppercase tracking-widest text-[var(--text-base)]">Expert Articles</h2>
                <div className="h-px w-24 bg-[var(--border)]" />
              </div>
              <Link href="/articles" className="text-xs font-bold text-[var(--accent)] hover:underline uppercase tracking-wide">
                See all →
              </Link>
            </div>
            <HomeFeaturedPosts posts={featuredPosts} />
          </section>
        </div>

        {/* Right: sidebar (1/3) */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <TrendingSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
