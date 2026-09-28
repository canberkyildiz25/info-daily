import { AUTHORS, getAuthorBySlug } from '@/lib/authors';
import { getPostsByAuthor } from '@/lib/posts';
import ArticleCard from '@/components/ArticleCard';
import { permanentRedirect } from 'next/navigation';
import PageHead from '@/components/PageHead';
import SectionHead from '@/components/SectionHead';
import type { Metadata } from 'next';

const SITE_URL = 'https://www.infodaily.net';

export function generateStaticParams() {
  return AUTHORS.map(a => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) return { robots: { index: false, follow: true } };
  const title = `${author.name} – ${author.title} | InfoDaily`;
  return {
    title,
    description: author.bio,
    alternates: { canonical: `${SITE_URL}/author/${slug}` },
    openGraph: {
      title,
      description: author.bio,
      type: 'website',
      url: `${SITE_URL}/author/${slug}`,
      siteName: 'InfoDaily',
    },
  };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const author = getAuthorBySlug(slug);
  if (!author) permanentRedirect('/authors');

  const allPosts = getPostsByAuthor(author.name);
  /* Her yazı için Pexels'ten yeni görsel istenip yazının kendi kapağının
     önüne geçiriliyordu — 24 API çağrısı ve anasayfadakinden farklı
     fotoğraflar. Kapaklar artık içerikte, olduğu gibi kullanılıyor. */
  const posts = allPosts.slice(0, 24);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: author.name,
    jobTitle: author.title,
    description: author.longBio || author.bio,
    url: `${SITE_URL}/author/${slug}`,
    logo: `${SITE_URL}/logo.svg`,
    knowsAbout: author.expertise,
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHead label="Editorial" labelHref="/authors" title={author.name} intro={author.title}>
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,42rem)_minmax(0,1fr)]">
          <p className="reading text-[1.1875rem] leading-[1.7] text-[var(--text-base)]">
            {author.longBio || author.bio}
          </p>
          {author.expertise && author.expertise.length > 0 && (
            <div>
              <p className="type-label text-[var(--text-muted)] mb-3">Covers</p>
              <ul className="space-y-1.5">
                {author.expertise.map(tag => (
                  <li key={tag} className="text-[0.9375rem] text-[var(--text-base)]">{tag}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </PageHead>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10">
        <SectionHead id="guides" title="Guides" meta={`${allPosts.length} in the archive`} />
        {posts.length === 0 ? (
          <p className="text-[var(--text-muted)] py-20">No guides yet.</p>
        ) : (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map(post => (
              <ArticleCard key={`${post.category}-${post.slug}`} post={post} featured />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
