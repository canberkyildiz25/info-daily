/* design.md § Cards
 *
 * Kart dört şeyden ibaret: görsel, küçük büyük harf etiket (kategori ·
 * tarih), sıkışık manşet, ve bütün kartı kaplayan bağlantı.
 *
 * Eskiden: yuvarlak köşeli, gölgeli, üzerine gelince yukarı zıplayan bir
 * kutu; fotoğrafın üstünde buzlu cam bir kategori hapı ve "New" hapı;
 * altta her kartta tekrar eden yazar rozeti, yazar adı ve "Read →". Kırk
 * sekiz kartta kırk sekiz kez aynı yazar ve aynı ok — okura hiçbir şey
 * söylemeyen, sayfayı yalnızca kalabalıklaştıran tekrar.
 */
import Link from 'next/link';
import Image from 'next/image';
import CategoryIcon from './CategoryIcon';
import type { Post } from '@/lib/posts';
import { CATEGORIES } from '@/lib/categories';
import { keepHyphenated } from '@/lib/typeset';
import { widePexels } from '@/lib/images';

interface ArticleCardProps {
  post: Post;
  featured?: boolean;
  imagePriority?: boolean;
  /* 'l' — dizinin başındaki öne çıkan yazı: daha büyük manşet, özet görünür. */
  size?: 'm' | 'l';
  headingLevel?: 'h2' | 'h3';
}

/* Kapak görseli olmayan yazılar için yedek zemin: düz renk, ikon. */
const CATEGORY_TINT: Record<string, string> = {
  technology: 'bg-accent-800',
  gaming: 'bg-accent-900',
};

export function formatCardDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function Media({ post, priority, sizes, wide = false, className = '' }: { post: Post; priority: boolean; sizes: string; wide?: boolean; className?: string }) {
  const tint = CATEGORY_TINT[post.category] ?? 'bg-accent-800';
  return (
    <div className={`card-media relative overflow-hidden bg-[var(--bg-card-hover)] ${className}`}>
      {post.coverImage ? (
        <Image
          src={wide ? widePexels(post.coverImage, 1600) : post.coverImage}
          alt=""
          fill
          className="object-cover"
          sizes={sizes}
          fetchPriority={priority ? 'high' : 'auto'}
          loading={priority ? 'eager' : 'lazy'}
        />
      ) : (
        <div className={`${tint} h-full flex items-center justify-center`}>
          <CategoryIcon slug={post.category} size={40} className="text-white/50" />
        </div>
      )}
    </div>
  );
}

export default function ArticleCard({
  post,
  featured = false,
  imagePriority = false,
  size = 'm',
  headingLevel = 'h3',
}: ArticleCardProps) {
  const category = CATEGORIES.find(c => c.slug === post.category);
  const Heading = headingLevel;
  const href = `/${post.category}/${post.slug}`;

  if (featured) {
    const large = size === 'l';
    return (
      <Link href={href} className="group block min-w-0">
        <article>
          <Media
            post={post}
            priority={imagePriority}
            wide={large}
            className={large ? 'aspect-[16/10]' : 'aspect-[4/3]'}
            sizes={large ? '(max-width: 768px) 100vw, 60vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'}
          />
          <p className="type-label mt-4 text-[var(--text-muted)]">
            <span className="text-[var(--accent)]">{category?.label}</span>
            <span aria-hidden> · </span>
            <time dateTime={post.date}>{formatCardDate(post.date)}</time>
          </p>
          <Heading
            className={`card-title type-display mt-2 text-[var(--text-base)] ${
              large ? 'type-display-l' : 'text-[1.5rem] leading-[1.02]'
            }`}
          >
            {keepHyphenated(post.title)}
          </Heading>
          {large && post.excerpt && (
            <p className="mt-3 max-w-[60ch] text-[var(--text-muted)] leading-relaxed">{post.excerpt}</p>
          )}
        </article>
      </Link>
    );
  }

  return (
    <Link href={href} className="group block min-w-0">
      <article className="flex gap-4 py-4 border-b border-[var(--border)]">
        <Media post={post} priority={false} sizes="96px" className="w-24 aspect-[4/3] shrink-0" />
        <div className="min-w-0">
          <p className="type-label text-[var(--text-muted)]">
            <span className="text-[var(--accent)]">{category?.label}</span>
            <span aria-hidden> · </span>
            <time dateTime={post.date}>{formatCardDate(post.date)}</time>
          </p>
          <Heading className="card-title mt-1 font-semibold text-[0.9375rem] leading-snug text-[var(--text-base)] line-clamp-3">
            {post.title}
          </Heading>
        </div>
      </article>
    </Link>
  );
}
