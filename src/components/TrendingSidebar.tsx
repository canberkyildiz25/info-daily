import { getAllPosts } from '@/lib/posts';
import { CATEGORIES } from '@/lib/categories';
import { getCoverImageUrl } from '@/lib/pexels';
import Link from 'next/link';
import CardImage from '@/components/CardImage';

const CAT_COLORS: Record<string, string> = {
  health:        'text-emerald-600 dark:text-emerald-400',
  finance:       'text-amber-600 dark:text-amber-400',
  technology:    'text-blue-600 dark:text-blue-400',
  'life-hacks':  'text-violet-600 dark:text-violet-400',
  travel:        'text-sky-600 dark:text-sky-400',
  food:          'text-orange-600 dark:text-orange-400',
  business:      'text-slate-600 dark:text-slate-400',
  science:       'text-teal-600 dark:text-teal-400',
  relationships: 'text-rose-600 dark:text-rose-400',
  entertainment: 'text-purple-600 dark:text-purple-400',
};

export default async function TrendingSidebar() {
  const allPosts = getAllPosts();

  // Pick 1 recent post per category (up to 6)
  const seen = new Set<string>();
  const trendingPosts = allPosts.filter(p => {
    if (seen.has(p.category)) return false;
    seen.add(p.category);
    return true;
  }).slice(0, 6);

  // Upgrade images
  const withImages = await Promise.all(
    trendingPosts.map(async post => {
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

  // Trending categories with post counts
  const catStats = CATEGORIES.map(cat => ({
    ...cat,
    count: allPosts.filter(p => p.category === cat.slug).length,
  })).sort((a, b) => b.count - a.count).slice(0, 5);

  return (
    <aside className="space-y-8">

      {/* Trending News */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
            <h2 className="text-sm font-black uppercase tracking-widest text-[var(--text-base)]">Trending</h2>
          </div>
          <Link href="/" className="text-xs font-bold text-[var(--accent)] hover:underline flex items-center gap-0.5">
            See all →
          </Link>
        </div>

        <div className="divide-y divide-[var(--border)]">
          {withImages.map((post, i) => {
            const cat = CATEGORIES.find(c => c.slug === post.category);
            const color = CAT_COLORS[post.category] ?? 'text-blue-600 dark:text-blue-400';
            return (
              <Link key={post.slug} href={`/${post.category}/${post.slug}`} className="group flex items-start gap-3 px-5 py-3.5 hover:bg-[var(--bg-card-hover)] transition-colors">
                {/* Number */}
                <span className="text-xl font-black text-[var(--border)] group-hover:text-[var(--accent)] transition-colors shrink-0 w-5 leading-tight mt-0.5">
                  {i + 1}
                </span>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${color}`}>
                    {cat?.icon} {cat?.label}
                  </span>
                  <p className="text-sm font-semibold text-[var(--text-base)] group-hover:text-[var(--accent)] transition-colors leading-snug line-clamp-2 mt-0.5" style={{ fontFamily: 'Georgia, serif' }}>
                    {post.title}
                  </p>
                  <span className="text-[11px] text-[var(--text-muted)] mt-1 block">{post.readingTime}</span>
                </div>

                {/* Thumbnail */}
                <div className="relative w-16 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--bg-card-hover)]">
                  <CardImage
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="64px"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Trending Sections */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-black uppercase tracking-widest text-[var(--text-base)]">Top Sections</h2>
          <Link href="/" className="text-xs font-bold text-[var(--accent)] hover:underline">
            See all →
          </Link>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {catStats.map((cat, i) => {
            const color = CAT_COLORS[cat.slug] ?? 'text-blue-600 dark:text-blue-400';
            return (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="group flex items-center gap-3 px-5 py-3 hover:bg-[var(--bg-card-hover)] transition-colors"
              >
                <span className="text-lg leading-none">{cat.icon}</span>
                <span className={`flex-1 text-sm font-semibold ${color} group-hover:underline`}>{cat.label}</span>
                <span className="text-xs text-[var(--text-muted)] font-medium">{cat.count} articles</span>
                <svg className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-[var(--accent)] rounded-2xl p-5 text-white">
        <h3 className="font-black text-base mb-1" style={{ fontFamily: 'Georgia, serif' }}>Stay in the loop</h3>
        <p className="text-white/80 text-xs mb-4 leading-relaxed">Get the best stories delivered to your inbox every week.</p>
        <Link
          href="#subscribe"
          className="block text-center bg-white text-[var(--accent)] text-xs font-black uppercase tracking-widest py-2.5 rounded-xl hover:bg-white/90 transition-colors"
        >
          Subscribe Free →
        </Link>
      </div>

    </aside>
  );
}
