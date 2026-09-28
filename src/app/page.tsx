/* Hallmark · macrostructure: Marquee Hero → index · genre: editorial
 * surface: stage (design.md § Surfaces) · theme: custom (tuned), petrol anchor
 * type: Archivo 800 @ wdth 75 display · Archivo UI · Source Serif 4 reading
 * nav: N9 edge-aligned, transparent over the lead · footer: Ft5 statement
 * enrichment: the lead guide's own cover photograph; real review videos from
 *   the channels already curated on /videos — nothing generated
 * motion: hero settle + staggered text rise on load, scroll-linked parallax on
 *   the lead photo, one-shot reveals on the bands, card image scale on hover.
 *   All transform/opacity, all gated on prefers-reduced-motion.
 * pre-emit critique: P5 H5 E4 S5 R4 V5
 *
 * Previous run was Ecosystem Index (rails of evenly sized cards under a short
 * positioning line). This one lets the featured guide own the first screen,
 * then turns into an index whose bands each have a different shape, so the
 * page does not read as the same rail repeated.
 */
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getAllPosts, CATEGORIES } from '@/lib/posts';
import type { Post } from '@/lib/posts';
import ArticleCard, { formatCardDate } from '@/components/ArticleCard';
import Reveal from '@/components/Reveal';
import SectionHead from '@/components/SectionHead';
import VideoBand from '@/components/VideoBand';
import { getVideos } from '@/lib/videos';
import { widePexels } from '@/lib/images';
import { keepHyphenated } from '@/lib/typeset';

export const metadata: Metadata = {
  alternates: { canonical: 'https://www.infodaily.net' },
};

/* "iPhone Duo: What Apple Confirms…" → üst satır "iPhone Duo", altı spot.
   İki nokta yoksa ya da ilk parça uzunsa başlık tek parça kalır. Metin
   bölünmüyor, yalnızca iki satıra diziliyor: iki nokta ekran okuyucular
   için görünmez olarak yerinde. */
function splitTitle(title: string): [string, string | null] {
  const i = title.indexOf(': ');
  if (i < 1 || i > 36) return [title, null];
  return [title.slice(0, i), title.slice(i + 2)];
}

const stagger = (i: number) => ({ '--i': i } as React.CSSProperties);

function LeadStory({ post }: { post: Post }) {
  const [kicker, deck] = splitTitle(post.title);
  const cat = CATEGORIES.find(c => c.slug === post.category);
  const href = `/${post.category}/${post.slug}`;

  return (
    <section
      aria-labelledby="lead-title"
      className="relative isolate flex items-end overflow-hidden min-h-[calc(92svh-var(--bottom-nav-h))] md:min-h-[92svh]"
    >
      {post.coverImage && (
        /* İki katman, iki ayrı transform: dıştaki kaydırmaya bağlı kayma,
           içteki açılıştaki yerine oturma. Aynı elemanda çakışırlardı. */
        <div aria-hidden className="hero-parallax absolute inset-x-0 top-0 h-[116%] -z-20">
          <div className="hero-media absolute inset-0">
            <Image
              src={widePexels(post.coverImage)}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: post.imagePosition ?? 'center' }}
            />
          </div>
        </div>
      )}
      {/* Okunurluk perdesi, üç katman. Metin sol altta durduğu için koyuluk
          orada yoğunlaşıyor (eliptik degrade, sol alt köşeden); fotoğrafın
          sağ ve orta kısmı açık kalıyor. Önceki tam genişlikteki perde koyu
          bir fotoğrafı neredeyse siyaha çeviriyordu. Üstte başlık için ince
          bir şerit, altta bir sonraki bölüme dikişsiz geçiş. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_100%_115%_at_0%_100%,rgb(6_15_17/0.9)_0%,rgb(6_15_17/0.7)_40%,rgb(6_15_17/0)_80%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgb(6_15_17/0.55)_0%,rgb(6_15_17/0)_20%,rgb(6_15_17/0)_82%,var(--bg-base)_100%)]"
      />

      <div className="w-full max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10 pt-40 pb-10 sm:pb-16">
        <p className="hero-rise type-label text-[var(--text-muted)]" style={stagger(0)}>
          <Link href={`/category/${post.category}`} className="text-[var(--accent)] hover:underline">{cat?.label}</Link>
          <span aria-hidden> · </span>
          <time dateTime={post.date}>{formatCardDate(post.date)}</time>
          <span className="hidden min-[380px]:inline"><span aria-hidden> · </span>{post.readingTime}</span>
        </p>

        <h2 id="lead-title" className="mt-5">
          <Link href={href} className="group block">
            <span className="hero-mask">
              <span
                className={`hero-line card-title type-display ${kicker.length <= 16 ? 'type-display-hero' : 'type-display-xl max-w-[16ch]'} text-[var(--text-base)]`}
                style={stagger(1)}
              >
                {keepHyphenated(kicker)}
              </span>
            </span>
            {deck && (
              <>
                <span className="sr-only">: </span>
                <span
                  className="hero-rise type-balance block mt-5 max-w-[26ch] text-[clamp(1.375rem,2.6vw,2.25rem)] font-semibold [font-stretch:87.5%] leading-[1.1] tracking-[-0.01em] text-[var(--text-base)]"
                  style={stagger(3)}
                >
                  {keepHyphenated(deck)}
                </span>
              </>
            )}
          </Link>
        </h2>

        <div className="hero-rise mt-8 flex flex-wrap items-center gap-x-6 gap-y-3" style={stagger(5)}>
          <Link
            href={href}
            className="inline-flex items-center gap-3 h-12 px-6 bg-[var(--text-base)] text-[var(--bg-base)] text-[0.9375rem] font-semibold hover:bg-[var(--accent)] active:scale-[0.97] transition-[background-color,transform] duration-150 ease-[var(--ease-out)]"
          >
            Read the guide
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
              <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="square" />
            </svg>
          </Link>
          <p className="hidden md:block max-w-[52ch] text-[0.9375rem] leading-relaxed text-[var(--text-muted)] line-clamp-2">
            {post.excerpt}
          </p>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const allPosts = getAllPosts();
  const lead = allPosts.find(p => p.featured) ?? allPosts[0];
  if (!lead) return null;
  const rest = allPosts.filter(p => p !== lead);

  /* Teknoloji kanallarının (MKBHD, Linus Tech Tips, Fireship) son
     videoları. Altı saatte bir tazeleniyor. YouTube yanıt vermezse bant
     hiç çizilmiyor. */
  const videos = (await getVideos('technology', 21600).catch(() => [])).slice(0, 5);

  /* Aynı yazı iki bantta görünmesin: gösterilenler buraya düşer. */
  const shown = new Set<string>([lead.slug]);
  const take = (pool: Post[], n: number) => {
    const out = pool.filter(p => !shown.has(p.slug)).slice(0, n);
    out.forEach(p => shown.add(p.slug));
    return out;
  };

  const [latestLead, ...latestList] = take(rest, 5);
  const bands = CATEGORIES.map(cat => {
    const all = allPosts.filter(p => p.category === cat.slug);
    return { cat, total: all.length, posts: take(all, 4) };
  });

  return (
    <div data-surface="stage" className="dark">
      <h1 className="sr-only">InfoDaily — practical guides for the technology and games you already own</h1>

      <LeadStory post={lead} />

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10">

        {/* Latest — one large, a quiet list beside it. */}
        {latestLead && (
          <section aria-labelledby="latest" className="pt-16 sm:pt-24">
            <Reveal>
              <SectionHead id="latest" title="Latest" meta={`${allPosts.length} guides`} href="/articles" linkLabel="All guides" />
            </Reveal>
            <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
              <Reveal><ArticleCard post={latestLead} featured size="l" /></Reveal>
              <div className="border-t border-[var(--border)] lg:border-t-0 lg:-mt-4 lg:sticky lg:top-20 lg:self-start">
                {latestList.map((p, i) => (
                  <Reveal key={p.slug} delay={120 + i * 60}><ArticleCard post={p} /></Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Watch — other people's reviews, credited, played in place. */}
        {videos.length > 0 && (
          <section aria-labelledby="watch" className="pt-20 sm:pt-28">
            <Reveal>
              <SectionHead id="watch" title="Watch" meta="Reviews from the channels we follow" href="/videos" linkLabel="All videos" />
            </Reveal>
            <Reveal delay={80}><VideoBand videos={videos} /></Reveal>
          </section>
        )}

        {/* Category bands. The first is a four-up grid; the second mirrors
            the Latest band so the rhythm changes on the way down. */}
        {bands.map(({ cat, total, posts }, i) => {
          if (posts.length === 0) return null;
          const id = `band-${cat.slug}`;
          const head = (
            <Reveal>
              <SectionHead
                id={id}
                title={cat.label}
                meta={`${total} guides`}
                href={`/category/${cat.slug}`}
                linkLabel={`All ${cat.label.toLowerCase()}`}
              />
            </Reveal>
          );
          if (i % 2 === 0) {
            return (
              <section key={cat.slug} aria-labelledby={id} className="pt-20 sm:pt-28">
                {head}
                <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                  {posts.map((p, j) => (
                    <Reveal key={p.slug} delay={j * 70}><ArticleCard post={p} featured /></Reveal>
                  ))}
                </div>
              </section>
            );
          }
          const [big, ...list] = posts;
          return (
            <section key={cat.slug} aria-labelledby={id} className="pt-20 sm:pt-28">
              {head}
              <div className="grid gap-x-12 gap-y-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
                <div className="order-2 lg:order-1 border-t border-[var(--border)] lg:border-t-0 lg:-mt-4 lg:sticky lg:top-20 lg:self-start">
                  {list.map((p, j) => (
                    <Reveal key={p.slug} delay={120 + j * 60}><ArticleCard post={p} /></Reveal>
                  ))}
                </div>
                <Reveal className="order-1 lg:order-2">
                  <ArticleCard post={big} featured size="l" />
                </Reveal>
              </div>
            </section>
          );
        })}

      </div>
    </div>
  );
}
