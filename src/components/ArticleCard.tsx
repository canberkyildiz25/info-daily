import Link from 'next/link';
import Image from 'next/image';
import { Post, CATEGORIES } from '@/lib/posts';

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
      <Link href={`/${post.category}/${post.slug}`} className="group block">
        <article className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg dark:shadow-slate-900/50 transition-all duration-300 border border-gray-100 dark:border-slate-700 h-full">
          <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-slate-700">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={featured}
              />
            ) : (
              <div className={`bg-gradient-to-br ${gradient} h-full flex items-center justify-center text-6xl`}>
                {category?.icon}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full">
                {category?.label}
              </span>
              <span className="text-gray-400 dark:text-slate-500 text-xs">{post.readingTime}</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug mb-2">
              {post.title}
            </h2>
            <p className="text-gray-500 dark:text-slate-400 text-sm line-clamp-2">{post.excerpt}</p>
            <div className="mt-4 text-xs text-gray-400 dark:text-slate-500">
              {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/${post.category}/${post.slug}`} className="group block">
      <article className="flex gap-4 py-4 border-b border-gray-100 dark:border-slate-700 last:border-0 hover:bg-gray-50 dark:hover:bg-slate-800/50 -mx-2 px-2 rounded-lg transition-colors">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-slate-700">
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
          <h3 className="font-semibold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm leading-snug line-clamp-2">
            {post.title}
          </h3>
        </div>
      </article>
    </Link>
  );
}
