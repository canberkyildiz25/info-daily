/* Hallmark · macrostructure: Ecosystem Index · genre: editorial
 * tone: editorial-utilitarian · theme: project palette preserved (paper #f8f7f4 · ink #0d1117 · accent #1a3fa8 ink-blue)
 * nav: existing Header component (untouched) · footer: existing Footer component (untouched)
 * enrichment: none — typography and the posts' own cover images
 * motion: none beyond the hover transitions already in ArticleCard (motion-cut project)
 * pre-emit critique: P5 H5 E4 S5 R5 V4
 *
 * Was: a news-aggregator front page. A breaking-news ticker, a hero card and a
 * "More Top Stories" list, all of it other publishers' headlines pulled from
 * NewsAPI, with the site's own guides pushed below them. Every one of those
 * headlines linked to /news, which took the other publisher's summary and had
 * an LLM write a 450-650 word article from it.
 *
 * Ecosystem Index instead: rails that surface the site's own 49 guides, because
 * browsing them is the only thing this page should be for.
 */
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllPosts, CATEGORIES } from '@/lib/posts';
import type { Post } from '@/lib/posts';
import ArticleCard from '@/components/ArticleCard';

export const metadata: Metadata = {
  alternates: { canonical: 'https://www.infodaily.net' },
};

/* Rail band. The count is read off the archive, never written by hand —
   a number typed into a heading is a number that goes stale silently. */
function RailHead({ title, href, count, linkLabel }: { title: string; href: string; count: number; linkLabel: string }) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-5 pb-2 border-b border-[var(--border)]">
      <h2
        className="text-lg sm:text-xl font-bold text-[var(--text-base)] tracking-tight"
        style={{ fontFamily: 'var(--font-serif)' }}
      >
        {title}
      </h2>
      <span className="text-xs text-[var(--text-muted)] tabular-nums">{count}</span>
      <Link
        href={href}
        className="ml-auto text-xs font-semibold text-[var(--accent)] hover:underline whitespace-nowrap"
      >
        {linkLabel} <span aria-hidden>→</span>
      </Link>
    </div>
  );
}

function Rail({ title, href, linkLabel, posts, total, lead = false }: {
  title: string;
  href: string;
  linkLabel: string;
  posts: Post[];
  total: number;
  lead?: boolean;
}) {
  if (posts.length === 0) return null;
  return (
    <section className="mb-14">
      <RailHead title={title} href={href} count={total} linkLabel={linkLabel} />
      {/* minmax(0,1fr) rather than a bare 1fr: the tracks carry images, and a
          bare 1fr lets a wide image push the track past the viewport. */}
      <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(min(100%,17rem),1fr))]">
        {posts.map((post, i) => (
          <ArticleCard key={`${post.category}/${post.slug}`} post={post} featured imagePriority={lead && i === 0} />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const allPosts = getAllPosts();

  const byCategory = (slug: string) => allPosts.filter((p) => p.category === slug);
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

      {/* Positioning, not a display hero. Ecosystem Index opens with a short
          statement of what is on the page, then gets out of the way. */}
      <header className="mb-12 max-w-2xl">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent)] mb-3">
          {today}
        </p>
        <p
          className="text-xl sm:text-2xl leading-snug text-[var(--text-base)] [overflow-wrap:anywhere]"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Guides for the hardware and software you already own.
        </p>
        <p className="mt-3 text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
          How to make it faster, keep it secure, and get more years out of it.
          Written up once, kept current, and sourced where a claim needs a source.
        </p>
      </header>

      <Rail
        title="Latest"
        href="/articles"
        linkLabel="All guides"
        posts={allPosts.slice(0, 6)}
        total={allPosts.length}
        lead
      />

      {CATEGORIES.map((cat) => {
        const posts = byCategory(cat.slug);
        return (
          <Rail
            key={cat.slug}
            title={cat.label}
            href={`/category/${cat.slug}`}
            linkLabel={`All ${cat.label.toLowerCase()}`}
            posts={posts.slice(0, 6)}
            total={posts.length}
          />
        );
      })}
    </div>
  );
}
