import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/posts';
import { CATEGORIES } from '@/lib/categories';
import { getAuthorByName } from '@/lib/authors';

interface ArticleCardProps {
  post: Post;
  featured?: boolean;
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  health: 'from-emerald-500 to-teal-600',
  finance: 'from-amber-500 to-orange-600',
  technology: 'from-blue-500 to-indigo-600',
  'life-hacks': 'from-violet-500 to-purple-600',
  travel: 'from-sky-500 to-cyan-600',
};

function isNew(dateStr: string) {
  return (Date.now() - new Date(dateStr).getTime()) < 7 * 24 * 60 * 60 * 1000;
}

export default function ArticleCard({ post, featured = false }: ArticleCardProps) {
  const category = CATEGORIES.find(c => c.slug === post.category);
  const gradient = CATEGORY_GRADIENTS[post.category] ?? 'from-blue-500 to-indigo-600';
  const author = getAuthorByName(post.author);
  const fresh = isNew(post.date);

  if (featured) {
    return (
      <Link href={`/${post.category}/${post.slug}`} className="group block h-full">
        <article className="card-hover bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-700 h-full flex flex-col hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-300">

          {/* Image */}
          <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-slate-700 flex-shrink-0">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={featured}
              />
            ) : (
              <div className={`bg-gradient-to-br ${gradient} h-full flex items-center justify-center text-6xl`}>
                {category?.icon}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Badges row */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-gray-800 dark:text-slate-100 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                {category?.icon} {category?.label}
              </span>
              {fresh && (
                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow">
                  New
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400 dark:text-slate-500 text-xs">{post.readingTime}</span>
              <span className="text-gray-200 dark:text-slate-700">·</span>
              <span className="text-gray-400 dark:text-slate-500 text-xs">
                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>

            <h2 className="text-base font-bold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 leading-snug mb-2 flex-1 line-clamp-3">
              {post.title}
            </h2>

            <p className="text-gray-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">{post.excerpt}</p>

            {/* Footer: author + read link */}
            <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-slate-700">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-6 h-6 rounded-full ${author?.avatarColor ?? 'bg-blue-600'} flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}>
                  {post.author.charAt(0)}
                </div>
                <span className="text-xs text-gray-500 dark:text-slate-400 truncate">{post.author}</span>
              </div>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-0.5 group-hover:gap-1.5 transition-all duration-200 shrink-0 ml-2">
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
            <div className={`bg-gradient-to-br ${gradient} w-full h-full flex items-center justify-center text-2xl`}>
              {category?.icon}
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
