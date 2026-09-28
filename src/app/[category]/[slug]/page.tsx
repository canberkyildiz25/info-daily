import { getPost, getAllPosts, CATEGORIES, extractHeadings } from '@/lib/posts';
import { InArticleAd, MultiplexAd, SidebarAd } from '@/components/AdBanner';
import AuthorBadge from '@/components/AuthorBadge';
import TableOfContents from '@/components/TableOfContents';
import ArticleHeroImage from '@/components/ArticleHeroImage';
import { getCoverImageUrl } from '@/lib/pexels';
import { widePexels } from '@/lib/images';
import { keepHyphenated } from '@/lib/typeset';
import { injectInlineImages } from '@/lib/injectImages';
import RelatedArticles from '@/components/RelatedArticles';
import InternalLinks from '@/components/InternalLinks';
import ReadingProgress from '@/components/ReadingProgress';
import ShareButtons from '@/components/ShareButtons';
import BookmarkButton from '@/components/BookmarkButton';
import ArticleEngagement from '@/components/ArticleEngagement';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { authorNameToSlug } from '@/lib/authors';
import { extractFaqFromHtml, buildFaqJsonLd } from '@/lib/faq';
import { injectInternalLinks } from '@/lib/injectInternalLinks';

export const revalidate = 86400; // ISR: regenerate each article page after 24h
export const dynamicParams = true; // Allow non-pre-rendered articles to be generated on demand

export async function generateStaticParams() {
  // Only pre-render the 20 most recent articles at build time.
  // Older pages are generated on first request and cached via ISR.
  const posts = getAllPosts().slice(0, 20);
  return posts.map(post => ({ category: post.category, slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await getPost(category, slug);
  if (!post) return {};

  const hasFrontmatterImage = post.coverImage &&
    !post.coverImage.startsWith('/images/') &&
    !post.coverImage.includes('source.unsplash.com') &&
    !post.coverImage.includes('picsum.photos');
  const ogImage = hasFrontmatterImage
    ? post.coverImage
    : (await getCoverImageUrl(`${post.title} ${category}`, post.slug).catch(() => null)) ?? post.coverImage;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: post.canonicalUrl ?? `https://www.infodaily.net/${category}/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updatedAt ?? post.date,
      authors: [post.author],
      url: `https://www.infodaily.net/${category}/${slug}`,
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 675, alt: post.title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

/* Kapak görseli çözülemezse kullanılan yedek zemin. ArticleCard'daki
   eşiyle aynı sorunu taşıyordu: beş kategoriden dördü artık yok, ve
   teknoloji mavi-indigo degradesiyle çiziliyordu — üretilmiş arayüzün
   en tanınan imzası. Düz renk, sitenin kendi vurgu değişkeninden. */
const CATEGORY_TINT: Record<string, string> = {
  technology: 'bg-[var(--accent)]',
  gaming: 'bg-[var(--text-base)]',
};

export default async function ArticlePage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const post = await getPost(category, slug);
  if (!post) notFound();

  const cat = CATEGORIES.find(c => c.slug === category);
  const tint = CATEGORY_TINT[category] ?? 'bg-[var(--accent)]';

  // Use frontmatter coverImage if valid, otherwise fetch from Pexels
  const hasFrontmatterImage = post.coverImage &&
    !post.coverImage.startsWith('/images/') &&
    !post.coverImage.includes('source.unsplash.com');
  const coverImage = hasFrontmatterImage
    ? post.coverImage
    : (await getCoverImageUrl(`${post.title} ${category}`, post.slug).catch(() => null)) ?? post.coverImage;

  // Inject inline images after every 2nd section heading (skipped if noInlineImages: true)
  const contentWithImages = post.noInlineImages
    ? (post.content || '')
    : await injectInlineImages(post.content || '', post.title, category).catch(() => post.content || '');

  // Inject internal links every 3 paragraphs
  const contentWithLinks = injectInternalLinks(contentWithImages, post.slug, category, post.tags);

  // Extract FAQ schema from article headings ending with "?"
  const faqJsonLd = buildFaqJsonLd(extractFaqFromHtml(contentWithLinks));

  const headings = extractHeadings(contentWithLinks);

  const published = new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const updated = post.updatedAt && post.updatedAt !== post.date
    ? new Date(post.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  /* Hallmark · macrostructure: Long Document · design.md § Macrostructure
     Tek okuma sütunu (42rem, ~70 karakter), serif gövde, manşet sıkışık
     görüntü yüzünde. Kenar boşluklarında yalnızca gezinme — içindekiler
     solda — ve 1400 pikselin üstünde sağda tek bir reklam yuvası. Eskiden
     sağ kenar çubuğunda kategori listesi kutusu da vardı; başlıktaki
     menüyle aynı iki bağlantıyı tekrar ediyordu. */
  return (
    <div>
      <ReadingProgress />
      <ArticleEngagement category={category} slug={slug} />

      <header className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10 pt-10 sm:pt-16">
        <nav aria-label="Breadcrumb" className="type-label text-[var(--text-muted)] flex flex-wrap items-center gap-x-2">
          <Link href="/" className="hover:text-[var(--text-base)] transition-colors">Home</Link>
          <span aria-hidden>/</span>
          <Link href={`/category/${category}`} className="text-[var(--accent)] hover:text-[var(--text-base)] transition-colors">{cat?.label}</Link>
        </nav>

        <h1 className="type-display type-display-l mt-6 max-w-[22ch] text-[var(--text-base)]">
          {keepHyphenated(post.title)}
        </h1>

        <p className="reading mt-6 max-w-[40rem] text-[1.25rem] sm:text-[1.375rem] leading-[1.5] text-[var(--text-muted)]">
          {post.excerpt}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[var(--border)]">
          <div className="flex items-center gap-3 min-w-0">
            <AuthorBadge name={post.author} size={36} />
            <div className="min-w-0">
              <Link
                href={`/author/${authorNameToSlug(post.author)}`}
                className="text-[0.9375rem] font-semibold text-[var(--text-base)] hover:text-[var(--accent)] transition-colors"
              >
                {post.author}
              </Link>
              <p className="type-label text-[var(--text-muted)]">
                <time dateTime={post.date}>{published}</time>
                {updated && <> · Updated <time dateTime={post.updatedAt}>{updated}</time></>}
                {' · '}{post.readingTime}
              </p>
            </div>
          </div>
          <BookmarkButton
            slug={post.slug}
            category={post.category}
            title={post.title}
            excerpt={post.excerpt}
            date={post.date}
          />
        </div>
      </header>

      <div className="max-w-[90rem] mx-auto sm:px-6 lg:px-10 mt-8 sm:mt-10">
        <ArticleHeroImage
          src={coverImage ? widePexels(coverImage) : coverImage}
          alt={post.title}
          tint={tint}
          categorySlug={cat?.slug}
          objectPosition={post.imagePosition}
        />
        {post.coverCaption && (
          <p className="mt-3 px-4 sm:px-0 text-sm text-[var(--text-muted)]">{post.coverCaption}</p>
        )}
      </div>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10 mt-12 sm:mt-16 grid gap-x-12 lg:grid-cols-[14rem_minmax(0,42rem)] lg:justify-center min-[1400px]:grid-cols-[minmax(0,1fr)_42rem_minmax(0,1fr)]">
        <aside className="hidden lg:block" aria-label="In this guide">
          <div className="sticky top-24">
            <TableOfContents headings={headings} />
          </div>
        </aside>

        <article className="min-w-0">
          {headings.length >= 2 && (
            <details className="lg:hidden mb-10 border-y border-[var(--border)] group/toc">
              <summary className="flex items-center justify-between min-h-12 cursor-pointer list-none type-label text-[var(--text-muted)]">
                In this guide
                <span aria-hidden className="text-lg leading-none transition-transform group-open/toc:rotate-45">+</span>
              </summary>
              <div className="pb-4"><TableOfContents headings={headings} bare /></div>
            </details>
          )}

          <div
            className="article-body reading prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: contentWithLinks }}
          />

          <InArticleAd />

          <div className="mt-8">
            <MultiplexAd />
          </div>

          <InternalLinks
            currentSlug={post.slug}
            currentCategory={post.category}
            currentTags={post.tags}
          />

          {/* JSON-LD Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Article',
                headline: post.title,
                description: post.excerpt,
                image: coverImage ? {
                  '@type': 'ImageObject',
                  url: coverImage,
                  width: 1200,
                  height: 675,
                } : undefined,
                datePublished: post.date,
                dateModified: post.updatedAt ?? post.date,
                /* Person değil Organization: yazan bir birey değil, editör masası.
                   Person olarak işaretlemek arama motoruna bir kişi varmış gibi
                   bildirir ve sayfadaki imzayla çelişir. jobTitle/knowsAbout da
                   kaldırıldı — o alanlar sahte kimliklerden geliyordu. */
                author: {
                  '@type': 'Organization',
                  name: post.author,
                  url: 'https://www.infodaily.net/authors',
                },
                publisher: {
                  '@type': 'Organization',
                  name: 'InfoDaily',
                  url: 'https://www.infodaily.net',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://www.infodaily.net/logo.svg',
                  },
                },
                mainEntityOfPage: {
                  '@type': 'WebPage',
                  '@id': `https://www.infodaily.net/${category}/${slug}`,
                },
                keywords: post.tags.join(', '),
                articleSection: cat?.label,
                inLanguage: 'en-US',
                isAccessibleForFree: true,
              }),
            }}
          />
          {/* Breadcrumb JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.infodaily.net' },
                  { '@type': 'ListItem', position: 2, name: cat?.label, item: `https://www.infodaily.net/category/${category}` },
                  { '@type': 'ListItem', position: 3, name: post.title, item: `https://www.infodaily.net/${category}/${slug}` },
                ],
              }),
            }}
          />

          {/* FAQ JSON-LD */}
          {faqJsonLd && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />
          )}

          <ShareButtons
            title={post.title}
            url={`https://www.infodaily.net/${category}/${slug}`}
            category={category}
          />

          {post.tags.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1" aria-label="Topics">
              {post.tags.map(tag => (
                <li key={tag} className="type-label text-[var(--text-muted)]">{tag}</li>
              ))}
            </ul>
          )}
        </article>

        <aside className="hidden min-[1400px]:block" aria-label="Advertisement">
          <div className="sticky top-24 ml-auto max-w-[300px]">
            <SidebarAd />
          </div>
        </aside>
      </div>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10">
        <RelatedArticles
          currentSlug={post.slug}
          currentCategory={post.category}
          currentTags={post.tags}
        />
      </div>
    </div>
  );
}
