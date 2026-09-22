import Link from 'next/link';
import CategoryIcon from './CategoryIcon';
import AuthorBadge from './AuthorBadge';
import Image from 'next/image';
import type { Post } from '@/lib/posts';
import { CATEGORIES } from '@/lib/categories';

interface ArticleCardProps {
  post: Post;
  featured?: boolean;
  imagePriority?: boolean;
}

/* Kapak görseli olmayan yazılar için yedek zemin. Eski hâli beş kategori
   sayıyordu — dördü artık yok — ve teknolojiyi mavi-indigo degradesiyle
   çiziyordu, ki bu degrade üretilmiş arayüzün en tanınan imzalarından biri.
   Yerine sitenin kendi vurgu rengi geldi, düz renk olarak. */
const CATEGORY_TINT: Record<string, string> = {
  technology: 'bg-[var(--accent)]',
  gaming: 'bg-[var(--text-base)]',
};

function isNew(dateStr: string) {
  return (Date.now() - new Date(dateStr).getTime()) < 7 * 24 * 60 * 60 * 1000;
}

export default function ArticleCard({ post, featured = false, imagePriority = false }: ArticleCardProps) {
  const category = CATEGORIES.find(c => c.slug === post.category);
  const tint = CATEGORY_TINT[post.category] ?? 'bg-[var(--accent)]';
  const fresh = isNew(post.date);

  if (featured) {
    return (
      <Link href={`/${post.category}/${post.slug}`} className="group block h-full">
        <article className="premium-card card-hover h-full flex flex-col">

          {/* Image */}
          <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-slate-700 flex-shrink-0">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                fetchPriority={imagePriority ? 'high' : 'auto'}
                loading={imagePriority ? 'eager' : 'lazy'}
              />
            ) : (
              <div className={`${tint} h-full flex items-center justify-center`}>
                {category ? <CategoryIcon slug={category.slug} size={56} className="text-white/70" /> : null}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            {/* Badges row */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-gray-800 dark:text-slate-100 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm tracking-wide">
                {category ? <CategoryIcon slug={category.slug} size={13} /> : null} {category?.label}
              </span>
              {fresh && (
                <span className="bg-[var(--accent)] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shadow">
                  New
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-[var(--text-muted)] text-xs font-medium">{post.readingTime}</span>
              <span className="text-[var(--text-muted)]" aria-hidden>·</span>
              <span className="text-[var(--text-muted)] text-xs">
                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>

            <h2 className="text-[0.95rem] font-bold text-[var(--text-base)] group-hover:text-[var(--accent)] transition-colors duration-200 leading-snug mb-2.5 flex-1 line-clamp-3" style={{ fontFamily: 'var(--font-serif)' }}>
              {post.title}
            </h2>

            <p className="text-[var(--text-muted)] text-sm line-clamp-2 mb-4 leading-relaxed">{post.excerpt}</p>

            {/* Footer: author + read link */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-[var(--border)]">
              <div className="flex items-center gap-2 min-w-0">
                <AuthorBadge name={post.author} size={24} />
                <span className="text-xs text-[var(--text-muted)] truncate font-medium">{post.author}</span>
              </div>
              <span className="text-xs font-bold text-[var(--accent)] flex items-center gap-1 group-hover:gap-2 transition-all duration-200 shrink-0 ml-2 tracking-wide">
                Read <span className="group-hover:translate-x-0.5 transition-transform duration-200 inline-block">→</span>
              </span>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/${post.category}/${post.slug}`} className="group block">
      <article className="flex gap-4 py-3.5 border-b border-gray-100 dark:border-slate-700 last:border-0 hover:bg-blue-50/50 dark:hover:bg-slate-800/60 -mx-2 px-2 rounded-xl transition-all duration-200">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-slate-700 group-hover:scale-105 transition-transform duration-300">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className={`${tint} w-full h-full flex items-center justify-center text-2xl`}>
              {category ? <CategoryIcon slug={category.slug} size={16} /> : null}
            </div>
          )}
          {fresh && (
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-blue-500 rounded-full border border-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-blue-600 dark:text-blue-400 text-xs font-semibold">{category?.label}</span>
            <span className="text-gray-300 dark:text-slate-600">·</span>
            <span className="text-gray-400 dark:text-slate-500 text-xs">{post.readingTime}</span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 text-sm leading-snug line-clamp-2">
            {post.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400 dark:text-slate-500">{post.author}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
