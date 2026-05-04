import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, CATEGORIES, type Post } from '@/lib/posts';
import { getCoverImageUrl } from '@/lib/pexels';

interface Props {
  currentSlug: string;
  currentCategory: string;
  currentTags: string[];
}

function scorePost(post: Post, category: string, tags: string[]): number {
  let score = 0;
  if (post.category === category) score += 3;
  const matchingTags = post.tags.filter(t => tags.includes(t)).length;
  score += matchingTags;
  return score;
}

export default async function RelatedArticles({ currentSlug, currentCategory, currentTags }: Props) {
  const all = getAllPosts().filter(p => p.slug !== currentSlug);
  const totalInCategory = all.filter(p => p.category === currentCategory).length + 1;

  const scored = all
    .map(p => ({ post: p, score: scorePost(p, currentCategory, currentTags) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ post }) => post);

  // Fallback: same category if not enough
  if (scored.length < 3) {
    const extra = all
      .filter(p => p.category === currentCategory && !scored.find(s => s.slug === p.slug))
      .slice(0, 3 - scored.length);
    scored.push(...extra);
  }

  if (scored.length === 0) return null;

  // Fetch Pexels images
  const withImages = await Promise.all(
    scored.map(async post => ({
      ...post,
      coverImage: await getCoverImageUrl(`${post.title} ${post.category}`, post.slug) || post.coverImage,
    }))
  );

  const currentCat = CATEGORIES.find(c => c.slug === currentCategory);

  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-extrabold text-gray-900 dark:text-slate-100">
          You might also like
        </h2>
        <Link
          href={`/category/${currentCategory}`}
          className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          {currentCat?.icon} Browse all {totalInCategory} {currentCat?.label} articles →
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {withImages.map(post => {
          const cat = CATEGORIES.find(c => c.slug === post.category);
          return (
            <Link
              key={`${post.category}-${post.slug}`}
              href={`/${post.category}/${post.slug}`}
              className="group block bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-36 bg-gray-100 dark:bg-slate-700 overflow-hidden">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">
                    {cat?.icon}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-4">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {cat?.icon} {cat?.label}
                </span>
                <h3 className="mt-1 text-sm font-bold text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                  {post.title}
                </h3>
                <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">{post.readingTime}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
