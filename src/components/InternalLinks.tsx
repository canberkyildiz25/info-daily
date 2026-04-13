import Link from 'next/link';
import { getAllPosts, CATEGORIES } from '@/lib/posts';

interface Props {
  currentSlug: string;
  currentCategory: string;
  currentTags: string[];
}

export default function InternalLinks({ currentSlug, currentCategory, currentTags }: Props) {
  const all = getAllPosts().filter(p => p.slug !== currentSlug);

  // Score: same category + matching tags
  const scored = all
    .map(p => {
      let score = p.category === currentCategory ? 2 : 0;
      score += p.tags.filter(t => currentTags.includes(t)).length;
      return { post: p, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(({ post }) => post);

  if (scored.length < 2) return null;

  return (
    <aside className="my-8 p-5 bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 rounded-2xl">
      <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-3">
        Related Reading
      </p>
      <ul className="space-y-2">
        {scored.map(post => {
          const cat = CATEGORIES.find(c => c.slug === post.category);
          return (
            <li key={post.slug} className="flex items-start gap-2">
              <span className="mt-0.5 text-blue-400 dark:text-blue-500 flex-shrink-0">→</span>
              <Link
                href={`/${post.category}/${post.slug}`}
                className="text-sm text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors leading-snug"
              >
                {post.title}
                <span className="ml-1 text-xs text-gray-400 dark:text-slate-500 font-normal">
                  {cat?.icon}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
