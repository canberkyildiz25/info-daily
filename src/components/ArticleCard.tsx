import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/posts';
import { CATEGORIES } from '@/lib/categories';

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

export default function ArticleCard({ post, featured = false }: ArticleCardProps) {
  const category = CATEGORIES.find(c => c.slug === post.category);
  const gradient = CATEGORY_GRADIENTS[post.category] ?? 'from-blue-500 to-indigo-600';

  if (featured) {
    return (
      <Link href={`/${post.category}/${post.slug}`} className="group block h-full">
        <article className="card-hover bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-slate-700 h-full flex flex-col">
          <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-slate-700 flex-shrink-0">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={featured}
              />
            ) : (
              <div className={`bg-gradient-to-br ${gradient} h-full flex items-center justify-center text-6xl`}>
                {category?.icon}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            {/* Category pill on image */}
            <span className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-gray-800 dark:text-slate-100 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              {category?.icon} {category?.label}
            </span>
          </div>
          <div className="p-5 flex flex-col flex-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-400 dark:text-slate-500 text-xs">{post.readingTime}</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 leading-snug mb-2 flex-1">
              {post.title}
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xs text-gray-400 dark:text-slate-500">
                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
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
      <article className="flex gap-4 py-4 border-b border-gray-100 dark:border-slate-700 last:border-0 hover:bg-blue-50/50 dark:hover:bg-slate-800/60 -mx-2 px-2 rounded-xl transition-all duration-200">
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
          <span className="text-xs text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-1 inline-block">
            Read more →
          </span>
        </div>
      </article>
    </Link>
  );
}
