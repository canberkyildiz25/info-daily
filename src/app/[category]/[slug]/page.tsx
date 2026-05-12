import { getPost, getAllPosts, CATEGORIES, extractHeadings } from '@/lib/posts';
import TableOfContents from '@/components/TableOfContents';
import AdBanner, { InArticleAd, MultiplexAd } from '@/components/AdBanner';
import ArticleHeroImage from '@/components/ArticleHeroImage';
import { getCoverImageUrl } from '@/lib/pexels';
import { injectInlineImages } from '@/lib/injectImages';
import RelatedArticles from '@/components/RelatedArticles';
import InternalLinks from '@/components/InternalLinks';
import ReadingProgress from '@/components/ReadingProgress';
import ShareButtons from '@/components/ShareButtons';
import BookmarkButton from '@/components/BookmarkButton';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { authorNameToSlug, getAuthorByName } from '@/lib/authors';
import { extractFaqFromHtml, buildFaqJsonLd } from '@/lib/faq';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => ({ category: post.category, slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const { category, slug } = await params;
  const post = await getPost(category, slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `https://www.infodaily.net/${category}/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      url: `https://www.infodaily.net/${category}/${slug}`,
      ...(post.coverImage ? { images: [{ url: post.coverImage, width: 1200, height: 675, alt: post.title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      ...(post.coverImage ? { images: [post.coverImage] } : {}),
    },
  };
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  health: 'from-emerald-500 to-teal-600',
  finance: 'from-amber-500 to-orange-600',
  technology: 'from-blue-500 to-indigo-600',
  'life-hacks': 'from-violet-500 to-purple-600',
  travel: 'from-sky-500 to-cyan-600',
};

export default async function ArticlePage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const post = await getPost(category, slug);
  if (!post) notFound();

  const cat = CATEGORIES.find(c => c.slug === category);
  const gradient = CATEGORY_GRADIENTS[category] ?? 'from-blue-500 to-indigo-600';
  const postAuthor = getAuthorByName(post.author);
  const avatarColor = postAuthor?.avatarColor ?? 'bg-blue-600';

  // Use frontmatter coverImage if valid, otherwise fetch from Pexels
  const hasFrontmatterImage = post.coverImage &&
    !post.coverImage.startsWith('/images/') &&
    !post.coverImage.includes('source.unsplash.com');
  const coverImage = hasFrontmatterImage
    ? post.coverImage
    : await getCoverImageUrl(`${post.title} ${category}`, post.slug) || post.coverImage;

  // Inject inline images after every 2nd section heading (skipped if noInlineImages: true)
  const contentWithImages = post.noInlineImages
    ? (post.content || '')
    : await injectInlineImages(post.content || '', post.title, category);

  // Extract FAQ schema from article headings ending with "?"
  const faqJsonLd = buildFaqJsonLd(extractFaqFromHtml(contentWithImages));

  const headings = extractHeadings(contentWithImages);

  // Split content after 2nd </p> to inject in-article ad (Google recommendation)
  const splitContent = (() => {
    let count = 0;
    let splitIndex = -1;
    let from = 0;
    while (count < 2) {
      const idx = contentWithImages.indexOf('</p>', from);
      if (idx === -1) break;
      count++;
      if (count === 2) splitIndex = idx + '</p>'.length;
      from = idx + 4;
    }
    if (splitIndex === -1) return { first: contentWithImages, second: '' };
    return {
      first: contentWithImages.slice(0, splitIndex),
      second: contentWithImages.slice(splitIndex),
    };
  })();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ReadingProgress />
      {/* Top Ad */}
      <div className="mb-8">
        <AdBanner slot="1155480823" format="horizontal" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Article */}
        <article className="lg:col-span-2">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 dark:text-slate-500 mb-6">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/category/${category}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{cat?.label}</Link>
            <span>/</span>
            <span className="text-gray-600 dark:text-slate-400 truncate max-w-xs">{post.title}</span>
          </nav>

          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Link
                href={`/category/${category}`}
                className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-semibold px-3 py-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors"
              >
                {cat?.icon} {cat?.label}
              </Link>
              <span className="text-gray-300 dark:text-slate-600">·</span>
              <span className="text-gray-400 dark:text-slate-500 text-sm">{post.readingTime}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-slate-100 leading-tight mb-4">
              {post.title}
            </h1>

            <p className="text-xl text-gray-500 dark:text-slate-400 leading-relaxed mb-6">{post.excerpt}</p>

            <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <img
                  src={postAuthor?.avatar ?? `https://i.pravatar.cc/300?u=infodaily-${authorNameToSlug(post.author)}`}
                  alt={post.author}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <Link
                    href={`/author/${authorNameToSlug(post.author)}`}
                    className="text-sm font-semibold text-gray-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {post.author}
                  </Link>
                  <p className="text-xs text-gray-400 dark:text-slate-500">
                    {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
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

          {/* Cover image / hero */}
          <ArticleHeroImage
            src={coverImage}
            alt={post.title}
            gradient={gradient}
            icon={cat?.icon}
            objectPosition={post.imagePosition}
          />

          {/* Content — first part (2 paragraphs) */}
          <div
            className="prose prose-lg prose-gray dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-slate-100 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-slate-100"
            dangerouslySetInnerHTML={{ __html: splitContent.first }}
          />

          {/* In-article ad after 2nd paragraph */}
          {splitContent.second && (
            <div className="my-6 not-prose">
              <InArticleAd />
            </div>
          )}

          {/* Content — second part */}
          {splitContent.second && (
            <div
              className="prose prose-lg prose-gray dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-slate-100 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-slate-100"
              dangerouslySetInnerHTML={{ __html: splitContent.second }}
            />
          )}

          {/* Internal links */}
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
                '@type': 'NewsArticle',
                headline: post.title,
                description: post.excerpt,
                image: coverImage ? {
                  '@type': 'ImageObject',
                  url: coverImage,
                  width: 1200,
                  height: 675,
                } : undefined,
                datePublished: post.date,
                dateModified: post.date,
                author: {
                  '@type': 'Person',
                  name: post.author,
                  url: `https://www.infodaily.net/author/${authorNameToSlug(post.author)}`,
                },
                publisher: {
                  '@type': 'Organization',
                  name: 'InfoDaily',
                  url: 'https://www.infodaily.net',
                  logo: {
                    '@type': 'ImageObject',
                    url: 'https://www.infodaily.net/logo.png',
                    width: 200,
                    height: 60,
                  },
                },
                mainEntityOfPage: {
                  '@type': 'WebPage',
                  '@id': `https://www.infodaily.net/${category}/${slug}`,
                },
                keywords: post.tags.join(', '),
                articleSection: cat?.label,
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

          {/* Share buttons */}
          <ShareButtons
            title={post.title}
            url={`https://www.infodaily.net/${category}/${slug}`}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-slate-700">
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 text-xs font-medium px-3 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Multiplex ad before related articles */}
          <div className="mt-8 not-prose">
            <MultiplexAd />
          </div>

          {/* Related articles */}
          <RelatedArticles
            currentSlug={post.slug}
            currentCategory={post.category}
            currentTags={post.tags}
          />

          {/* Bottom ad */}
          <div className="mt-8">
            <AdBanner slot="1155480823" format="horizontal" />
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="sticky top-24 space-y-6">
            <TableOfContents headings={headings} />
            <AdBanner slot="1155480823" format="rectangle" />
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 dark:text-slate-100 mb-4">Browse Categories</h3>
            <div className="space-y-1">
              {CATEGORIES.map(c => (
                <Link
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 text-sm text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  {c.icon} {c.label}
                </Link>
              ))}
            </div>
          </div>

          <AdBanner slot="1155480823" format="vertical" />
        </aside>
      </div>
    </div>
  );
}
