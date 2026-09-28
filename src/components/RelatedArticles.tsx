import ArticleCard from './ArticleCard';
import SectionHead from './SectionHead';
import { getAllPosts, CATEGORIES, type Post } from '@/lib/posts';

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

export default function RelatedArticles({ currentSlug, currentCategory, currentTags }: Props) {
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

  /* Burada her ilgili yazı için Pexels'ten yeni bir görsel isteniyordu ve
     yazının kendi kapağının önüne geçiyordu — yani aynı yazı anasayfada bir
     fotoğrafla, makale altında başka bir fotoğrafla görünüyordu. Her
     yazının kapağı artık kendi içeriğine göre seçilmiş durumda. */
  const currentCat = CATEGORIES.find(c => c.slug === currentCategory);

  return (
    <section aria-labelledby="related" className="mt-24">
      <SectionHead
        id="related"
        title="Read next"
        href={`/category/${currentCategory}`}
        linkLabel={`All ${totalInCategory} ${currentCat?.label.toLowerCase()} guides`}
      />
      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-3">
        {scored.map(post => (
          <ArticleCard key={`${post.category}-${post.slug}`} post={post} featured />
        ))}
      </div>
    </section>
  );
}
