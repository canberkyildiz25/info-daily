import { getPostsByCategory, CATEGORIES } from '@/lib/posts';
import PageHead from '@/components/PageHead';
import CategoryPostGrid from '@/components/CategoryPostGrid';
import { getCoverImageUrl } from '@/lib/pexels';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return CATEGORIES.map(cat => ({ slug: cat.slug }));
}

const SITE_URL = 'https://www.infodaily.net';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find(c => c.slug === slug);
  if (!cat) return {};
  const title = `${cat.label} Articles – InfoDaily`;
  const description = `${cat.description}. Browse all ${cat.label} articles on InfoDaily.`;
  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/category/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${SITE_URL}/category/${slug}`,
      siteName: 'InfoDaily',
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/opengraph-image`],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = CATEGORIES.find(c => c.slug === slug);
  if (!cat) notFound();

  const rawPosts = getPostsByCategory(slug);
  const posts = await Promise.all(
    rawPosts.map(async post => {
      const hasValidImage = post.coverImage &&
        !post.coverImage.startsWith('/images/') &&
        !post.coverImage.includes('source.unsplash.com');
      return {
        ...post,
        coverImage: hasValidImage
          ? post.coverImage
          : await getCoverImageUrl(`${post.title} ${post.category}`, post.slug) || post.coverImage,
      };
    })
  );

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: `${cat.label} Articles – InfoDaily`,
              description: cat.description,
              url: `${SITE_URL}/category/${slug}`,
              publisher: { '@type': 'Organization', name: 'InfoDaily', url: SITE_URL },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                { '@type': 'ListItem', position: 2, name: cat.label, item: `${SITE_URL}/category/${slug}` },
              ],
            },
          ]),
        }}
      />
      <PageHead label="Section" title={cat.label} intro={cat.description + '.'}>
        <p className="type-label mt-6 text-[var(--text-muted)] tabular-nums">{posts.length} guides</p>
      </PageHead>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10">
        {posts.length === 0 ? (
          <p className="text-[var(--text-muted)] py-20">No guides here yet.</p>
        ) : (
          <CategoryPostGrid posts={posts} />
        )}
      </div>
    </div>
  );
}
