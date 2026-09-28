import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import { CATEGORIES } from '@/lib/categories';
import Link from 'next/link';
import { getAllPosts, getCitedDomains } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'About InfoDaily – Our Mission, Editorial Standards & Team',
  description: 'Learn how InfoDaily approaches practical guides, source-led explainers, corrections, and editorial transparency.',
  alternates: { canonical: 'https://www.infodaily.net/about' },
  openGraph: {
    title: 'About InfoDaily – Our Mission, Editorial Standards & Team',
    description: 'Learn how InfoDaily approaches practical guides, source-led explainers, corrections, and editorial transparency.',
    url: 'https://www.infodaily.net/about',
    type: 'website',
  },
};

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'InfoDaily',
  url: 'https://www.infodaily.net',
  logo: {
    '@type': 'ImageObject',
    url: 'https://www.infodaily.net/logo.svg',
  },
  description: 'InfoDaily is an independent digital publication covering technology and gaming, with research-backed editorial standards.',
  foundingDate: '2025',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'editorial',
    url: 'https://www.infodaily.net/contact',
  },
  sameAs: [],
  publishingPrinciples: 'https://www.infodaily.net/about',
  ethicsPolicy: 'https://www.infodaily.net/about',
  correctionsPolicy: 'https://www.infodaily.net/about',
};

const WEBPAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About InfoDaily',
  url: 'https://www.infodaily.net/about',
  description: 'What InfoDaily covers, how a guide is researched and written, the sources we cite most, and how to report an error.',
  publisher: {
    '@type': 'Organization',
    name: 'InfoDaily',
    url: 'https://www.infodaily.net',
  },
};

export default function AboutPage() {
  const posts = getAllPosts();
  const articleCount = posts.length;
  const countOf = (slug: string) => posts.filter(p => p.category === slug).length;
  const cited = getCitedDomains(12);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_SCHEMA) }} />

      {/* Dört eşit kutulu "güven şeridi" kaldırıldı: biri elle yazılmış
          "11 Subject areas covered" idi — site iki bölüme indiğinden beri
          yanlış. Sayılar arşivden okunuyor, tek satırda. */}
      <PageHead
        label="About"
        title="About InfoDaily"
        intro="Guides for the hardware and software you already own — and straight answers on whether the new stuff is worth buying."
      >
        <p className="type-label mt-6 text-[var(--text-muted)] tabular-nums">
          {articleCount} guides · {CATEGORIES.length} sections · free to read
        </p>
      </PageHead>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="article-body reading prose prose-lg max-w-[42rem]">
          <h2>What InfoDaily is</h2>
          <p>
            InfoDaily is a guide publication about consumer technology and gaming. Most of what we write is about the phones, laptops, consoles, routers and software people already own: how to set them up, keep them secure, make them faster and get more years out of them. When new hardware comes out, we write about it from the same angle — what actually changed, and whether it is worth buying.
          </p>

          <h2>What we cover</h2>
          <ul>
            <li><Link href="/category/technology">Technology</Link> — devices, software, security and privacy settings, and the AI tools now built into all three. {countOf('technology')} guides.</li>
            <li><Link href="/category/gaming">Gaming</Link> — hardware, setups and accessories, platform and price changes, and games worth your time. {countOf('gaming')} guides.</li>
          </ul>

          <h2>How a guide is written</h2>
          <p>
            Most of our guides are research, not lab testing. We work from the manufacturer&rsquo;s own specification sheet and support documentation, from independent reviewers who measured the thing themselves, and from standards bodies and security agencies where a claim depends on them. Each source is linked where it is used.
          </p>
          <p>
            When we have not handled a device ourselves, the guide says so in plain words, and every measurement is attributed to whoever took it. Where two accounts disagree — the spec sheet and a reviewer, or two reviewers — we show both rather than pick the more flattering one.
          </p>
          <p>
            Every guide shows the date it was published, and an updated date when its substance changes. We revise a guide when a price, a setting or a recommendation in it stops being true, rather than re-dating a page that has not changed.
          </p>

          <h2>The sources we cite most</h2>
          <p>
            Counted from the links inside our {articleCount} guides, not written by hand. The list changes when the guides do.
          </p>
          <ul>
            {cited.map(c => (
              <li key={c.domain}>
                <strong>{c.domain}</strong> — cited in {c.guides} guide{c.guides === 1 ? '' : 's'}
              </li>
            ))}
          </ul>

          <h2>Who writes it</h2>
          <p>
            Guides are published under the <strong>InfoDaily Editorial Team</strong> byline. We do not invent personal profiles or credentials to look more authoritative. <Link href="/authors">More about the editorial desk</Link>.
          </p>

          <h2>Corrections</h2>
          <p>
            If you spot an error — a wrong spec, a price that has changed, a setting that has moved, a broken link — tell us through the <Link href="/contact">contact page</Link>. We check every report and correct confirmed errors in the guide itself.
          </p>

          <h2>Advertising</h2>
          <p>
            InfoDaily is supported by display advertising through Google AdSense. Ads are served automatically; we do not choose which ones appear, and advertisers have no say in what we write. If a commercial relationship ever affects a recommendation, the guide will say so.
          </p>

          <h2>Contact</h2>
          <p>
            For corrections, questions or partnership enquiries, use the <Link href="/contact">contact page</Link>. We read every message and reply to most within two business days.
          </p>
        </div>
      </div>
    </>
  );
}
