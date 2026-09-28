import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

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
    <aside className="mt-12 border-l-2 border-[var(--accent)] pl-5 sm:pl-6">
      <p className="type-label text-[var(--text-muted)] mb-3">Related reading</p>
      <ul className="space-y-1">
        {scored.map(post => (
          <li key={post.slug}>
            <Link
              href={`/${post.category}/${post.slug}`}
              className="inline-block py-1.5 text-[0.9375rem] font-medium leading-snug text-[var(--text-base)] underline decoration-[var(--border)] underline-offset-4 hover:decoration-[var(--accent)] transition-colors"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
