import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About InfoDaily – Our Mission, Editorial Standards & Team',
  description: 'InfoDaily publishes research-backed articles on health, finance, technology, and life. Learn about our editorial process, contributor standards, and corrections policy.',
  alternates: { canonical: 'https://www.infodaily.net/about' },
  openGraph: {
    title: 'About InfoDaily – Our Mission, Editorial Standards & Team',
    description: 'InfoDaily publishes research-backed articles on health, finance, technology, and life. Learn about our editorial process, contributor standards, and corrections policy.',
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
    url: 'https://www.infodaily.net/logo.png',
    width: 200,
    height: 60,
  },
  description: 'InfoDaily is an independent digital publication covering health, personal finance, technology, travel, food, science, relationships, business, and entertainment with research-backed editorial standards.',
  foundingDate: '2025',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'editorial',
    url: 'https://www.infodaily.net/contact',
  },
  sameAs: [],
  publishingPrinciples: 'https://www.infodaily.net/about',
  diversityPolicy: 'https://www.infodaily.net/about',
  ethicsPolicy: 'https://www.infodaily.net/about',
  correctionsPolicy: 'https://www.infodaily.net/about',
};

const WEBPAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About InfoDaily',
  url: 'https://www.infodaily.net/about',
  description: 'Learn about InfoDaily — who we are, our editorial standards, and the team behind our daily articles.',
  publisher: {
    '@type': 'Organization',
    name: 'InfoDaily',
    url: 'https://www.infodaily.net',
  },
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_SCHEMA) }} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3">About InfoDaily</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-10">Independent, research-backed articles on the topics that matter most in daily life.</p>

        {/* Trust signals bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 not-prose">
          {[
            { number: '10+', label: 'Subject areas covered' },
            { number: '200+', label: 'Articles published' },
            { number: '15+', label: 'Expert contributors' },
            { number: '100%', label: 'No sponsored content' },
          ].map(({ number, label }) => (
            <div key={label} className="bg-blue-50 dark:bg-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{number}</div>
              <div className="text-xs text-gray-600 dark:text-slate-400 mt-1">{label}</div>
            </div>
          ))}
        </div>

        <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
          <h2>Our Mission</h2>
          <p>
            InfoDaily was founded with a straightforward goal: give everyday readers the same quality of information that professionals rely on — without the jargon, the paywalls, or the advertising spin. We cover ten subject areas where bad or oversimplified advice has real consequences: health, personal finance, technology, life skills, travel, food, business, science, relationships, and entertainment.
          </p>

          <h2>What We Publish</h2>
          <p>
            Every article on InfoDaily is either a deep-dive guide, a research summary, or a practical how-to. We do not publish opinion columns, sponsored content, or press releases disguised as editorial. If an article makes a factual claim, that claim is sourced — from peer-reviewed research, government data, or named subject-matter experts.
          </p>
          <p>
            Every article includes a <strong>Sources &amp; References</strong> section linking to the primary research and authoritative institutions behind the claims we make. We update older articles when the underlying evidence changes. Publication dates and update dates are shown on every post so readers can judge freshness for themselves.
          </p>

          <h2>Our Editorial Process</h2>
          <p>Each article goes through three stages before it is published:</p>
          <ol>
            <li><strong>Research and outlining</strong> — claims are identified and source material is collected before writing begins.</li>
            <li><strong>Drafting and fact-checking</strong> — every statistic, study reference, and named recommendation is verified against the original source.</li>
            <li><strong>Editorial review</strong> — a second editor checks for accuracy, tone, and readability before the article goes live.</li>
          </ol>
          <p>
            We do not accept payment for coverage, rankings, or recommendations. Advertiser relationships (display advertising) are kept entirely separate from editorial decisions.
          </p>

          <h2>Our Contributors</h2>
          <p>
            InfoDaily articles are written by a team of independent contributors with professional backgrounds in their respective fields — including registered dietitians, certified financial planners, certified strength and conditioning specialists, molecular biologists, clinical psychologists, and journalists with beats in science and technology.
          </p>
          <p>
            Author bios are published on each article so readers can evaluate credentials directly. We do not publish anonymous content. Every article carries a named author with a verified professional background.
          </p>
          <p>
            <Link href="/authors" className="text-blue-600 hover:underline font-medium">Meet our full editorial team →</Link>
          </p>

          <h2>How We Source Our Information</h2>
          <p>We prioritize the following types of sources, in order of preference:</p>
          <ol>
            <li><strong>Peer-reviewed journals</strong> — PubMed, Nature, Science, JAMA, NEJM, and other indexed publications</li>
            <li><strong>Government and institutional data</strong> — NIH, CDC, WHO, FDA, U.S. Bureau of Labor Statistics, Federal Reserve</li>
            <li><strong>Academic institutions</strong> — Harvard Health, Mayo Clinic, Stanford, MIT</li>
            <li><strong>Professional associations</strong> — APA, AMA, AHA, Academy of Nutrition and Dietetics</li>
          </ol>
          <p>We link directly to the source in every article so you can verify the information yourself.</p>

          <h2>Corrections Policy</h2>
          <p>
            We take accuracy seriously. If you spot an error — a wrong statistic, a broken link, or a claim that no longer reflects current evidence — please use our <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link> to let us know. We review correction requests within 48 hours and publish a note at the top of any corrected article.
          </p>

          <h2>Advertising</h2>
          <p>
            InfoDaily is supported by display advertising through Google AdSense. Ads are served automatically based on page content and reader interest. We do not control which specific ads appear, and advertisers have no influence over our editorial content.
          </p>
          <p>
            We do not use affiliate links or earn commissions from product recommendations unless explicitly disclosed in the article.
          </p>

          <h2>Contact Us</h2>
          <p>
            For editorial inquiries, corrections, or partnership questions, please visit our <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link>. We read every message and respond to most within two business days.
          </p>
        </div>
      </div>
    </>
  );
}
