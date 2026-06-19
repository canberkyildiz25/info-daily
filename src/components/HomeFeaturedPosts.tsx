import ArticleCard from './ArticleCard';
import type { Post } from '@/lib/posts';
import { CATEGORIES } from '@/lib/categories';
import Link from 'next/link';
import Image from 'next/image';
import { getAuthorByName, authorNameToSlug } from '@/lib/authors';

const CAT_GRADIENTS: Record<string, string> = {
  health: 'from-emerald-500 to-teal-600',
  finance: 'from-amber-500 to-orange-500',
  technology: 'from-blue-500 to-indigo-600',
  'life-hacks': 'from-violet-500 to-purple-600',
  travel: 'from-sky-400 to-cyan-500',
  food: 'from-orange-400 to-red-500',
  business: 'from-slate-500 to-slate-700',
  science: 'from-teal-500 to-emerald-600',
  relationships: 'from-rose-400 to-pink-600',
  entertainment: 'from-purple-500 to-fuchsia-600',
};

const CAT_ACCENT: Record<string, string> = {
  health: 'text-emerald-600 dark:text-emerald-400 border-emerald-500',
  finance: 'text-amber-600 dark:text-amber-400 border-amber-500',
  technology: 'text-blue-600 dark:text-blue-400 border-blue-500',
  'life-hacks': 'text-violet-600 dark:text-violet-400 border-violet-500',
  travel: 'text-sky-600 dark:text-sky-400 border-sky-500',
  food: 'text-orange-600 dark:text-orange-400 border-orange-500',
  business: 'text-slate-600 dark:text-slate-400 border-slate-500',
  science: 'text-teal-600 dark:text-teal-400 border-teal-500',
  relationships: 'text-rose-600 dark:text-rose-400 border-rose-500',
  entertainment: 'text-purple-600 dark:text-purple-400 border-purple-500',
};

function HorizontalArticleRow({ post, index }: { post: Post; index: number }) {
  const cat = CATEGORIES.find(c => c.slug === post.category);
  const author = getAuthorByName(post.author);
  const accent = CAT_ACCENT[post.category] ?? 'text-blue-600 dark:text-blue-400 border-blue-500';
  const grad = CAT_GRADIENTS[post.category] ?? 'from-blue-500 to-indigo-600';
  const isNew = (Date.now() - new Date(post.date).getTime()) < 7 * 24 * 60 * 60 * 1000;

  return (
    <Link href={`/${post.category}/${post.slug}`} className="group block">
      <article className="flex gap-4 py-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-card-hover)] -mx-3 px-3 rounded-xl transition-colors duration-200">

        {/* Rank number */}
        <span className="text-2xl font-black text-[var(--border)] group-hover:text-[var(--accent)] transition-colors shrink-0 w-6 leading-none mt-1">
          {index + 1}
        </span>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${accent.split(' ')[0]} ${accent.split(' ')[1]}`}>
              {cat?.icon} {cat?.label}
            </span>
            <span className="text-[var(--border)]">·</span>
            <span className="text-[var(--text-muted)] text-[11px]">{post.readingTime}</span>
            {isNew && (
              <span className="bg-[var(--accent)] text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest">
                New
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-[var(--text-base)] group-hover:text-[var(--accent)] transition-colors leading-snug line-clamp-2 mb-1.5" style={{ fontFamily: 'Georgia, serif' }}>
            {post.title}
          </h3>
          <div className="flex items-center gap-2">
            <Image
              src={author?.avatar ?? `https://i.pravatar.cc/300?u=infodaily-${authorNameToSlug(post.author)}`}
              alt={post.author}
              width={18}
              height={18}
              className="rounded-full object-cover"
            />
            <span className="text-[11px] text-[var(--text-muted)] font-medium">{post.author}</span>
          </div>
        </div>

        {/* Thumbnail */}
        <div className="relative w-20 h-16 sm:w-24 sm:h-18 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--bg-card-hover)]">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="96px"
            />
          ) : (
            <div className={`bg-gradient-to-br ${grad} w-full h-full flex items-center justify-center text-2xl`}>
              {cat?.icon}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

export default function HomeFeaturedPosts({ posts }: { posts: Post[] }) {
  const categoriesWithPosts = CATEGORIES
    .map(cat => ({
      ...cat,
      posts: posts.filter(p => p.category === cat.slug).slice(0, 4),
    }))
    .filter(c => c.posts.length > 0);

  return (
    <div className="space-y-10">
      {categoriesWithPosts.map((cat, idx) => {
        const grad = CAT_GRADIENTS[cat.slug] ?? 'from-blue-500 to-indigo-600';
        const accent = CAT_ACCENT[cat.slug] ?? 'text-blue-600 dark:text-blue-400 border-blue-500';
        const [featuredPost, ...restPosts] = cat.posts;

        return (
          <section key={cat.slug}>
            {/* Section header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className={`w-0.5 h-5 rounded-full bg-gradient-to-b ${grad}`} />
                <span className="text-lg leading-none">{cat.icon}</span>
                <h2 className={`text-sm font-black uppercase tracking-widest ${accent.split(' ')[0]} ${accent.split(' ')[1]}`}>
                  {cat.label}
                </h2>
              </div>
              <Link
                href={`/category/${cat.slug}`}
                className="text-xs font-bold text-[var(--accent)] hover:underline flex items-center gap-1 uppercase tracking-wide"
              >
                See all →
              </Link>
            </div>

            {cat.posts.length === 1 ? (
              /* Single post: full card */
              <div className="animate-fade-in-up">
                <ArticleCard post={featuredPost} featured imagePriority={idx === 0} />
              </div>
            ) : (
              /* Multiple posts: featured card on top + horizontal list below */
              <div className="space-y-0">
                {/* Featured card (first post) */}
                <div className="mb-4 animate-fade-in-up">
                  <ArticleCard post={featuredPost} featured imagePriority={idx === 0} />
                </div>

                {/* Horizontal list (remaining posts) */}
                <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl px-3 py-1">
                  {restPosts.map((post, i) => (
                    <HorizontalArticleRow
                      key={`${post.category}-${post.slug}`}
                      post={post}
                      index={i + 1}
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
