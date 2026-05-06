import { getPostsByCategory, CATEGORIES } from '@/lib/posts';
import CategoryPostGrid from '@/components/CategoryPostGrid';
import AdBanner from '@/components/AdBanner';
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
      images: [{ url: `${SITE_URL}/og-image.png`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/og-image.png`],
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      {/* Top Ad */}
      <div className="mb-8">
        <AdBanner slot="1155480823" format="horizontal" />
      </div>

      {/* Category header */}
      <div className="mb-8 pb-6 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">{cat.icon}</span>
          <h1 className="text-3xl font-black text-gray-900 dark:text-slate-100">{cat.label}</h1>
        </div>
        <p className="text-gray-500 dark:text-slate-400 text-lg">{cat.description}</p>
        <p className="text-sm text-gray-400 dark:text-slate-500 mt-1">{posts.length} articles</p>
      </div>

      {/* Articles grid + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {posts.length === 0 ? (
            <p className="text-gray-500 dark:text-slate-400 text-center py-20">No articles yet. Check back soon!</p>
          ) : (
            <CategoryPostGrid posts={posts} />
          )}
        </div>

        <aside className="space-y-6">
          <AdBanner slot="1155480823" format="rectangle" />

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 dark:text-slate-100 mb-4">Other Categories</h3>
            <div className="space-y-1">
              {CATEGORIES.filter(c => c.slug !== slug).map(c => (
                <a
                  key={c.slug}
                  href={`/category/${c.slug}`}
                  className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-700 text-sm text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                >
                  {c.icon} {c.label}
                </a>
              ))}
            </div>
          </div>

          <AdBanner slot="1155480823" format="vertical" />
        </aside>
      </div>
    </div>
  );
}
