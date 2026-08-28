import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

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
  const articleCount = getAllPosts().length;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBPAGE_SCHEMA) }} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3">About InfoDaily</h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-10">Practical guides and timely explainers for everyday decisions.</p>

        {/* Trust signals bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 not-prose">
          {[
            { number: '11', label: 'Subject areas covered' },
            { number: String(articleCount), label: 'Articles published' },
            { number: 'Open', label: 'Sources linked where relevant' },
            { number: 'Free', label: 'Access for every reader' },
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
            InfoDaily exists to make useful information easier to understand. We cover health, personal finance, technology, life skills, travel, food, business, science, relationships, entertainment, and gaming — subjects where clear context can make a real difference to daily decisions.
          </p>

          <h2>What We Publish</h2>
          <p>
            InfoDaily publishes deep-dive guides, research explainers, practical how-tos, and clearly labelled news briefs. We aim to distinguish reported facts from general guidance, and we link to primary or authoritative material when it is relevant to the reader’s next step.
          </p>
          <p>
            Publication dates are visible on every post, and substantial updates are labelled so readers can judge freshness. Articles that depend on research, official guidance, or data should include a <strong>Sources &amp; References</strong> section; if a source is missing or no longer works, readers can report it through our contact page.
          </p>

          <h2>Our Editorial Process</h2>
          <p>Our editorial workflow prioritizes three things:</p>
          <ol>
            <li><strong>Clear scope</strong> — a guide should tell readers what it can and cannot answer.</li>
            <li><strong>Useful attribution</strong> — source material should be linked when it supports a factual or high-stakes claim.</li>
            <li><strong>Plain-language updates</strong> — we aim to revise dated guidance rather than make an old page look new without meaningful changes.</li>
          </ol>
          <p>
            Editorial pages are written for readers first. Display advertising, where shown, is visually separated from the surrounding editorial content.
          </p>

          <h2>Authorship and Accountability</h2>
          <p>
            InfoDaily articles are published under the <strong>InfoDaily Editorial Team</strong> byline. We do not present unverifiable personal credentials as a signal of expertise.
          </p>
          <p>
            For health, finance, legal, or other high-stakes questions, our articles are general information only. Readers should use the original sources and seek qualified professional advice for decisions specific to their circumstances.
          </p>
          <p>
            <Link href="/authors" className="text-blue-600 hover:underline font-medium">Read about the editorial desk →</Link>
          </p>

          <h2>How We Source Our Information</h2>
          <p>When we cite sources, we prioritize the following types of material:</p>
          <ol>
            <li><strong>Peer-reviewed journals</strong> — PubMed, Nature, Science, JAMA, NEJM, and other indexed publications</li>
            <li><strong>Government and institutional data</strong> — NIH, CDC, WHO, FDA, U.S. Bureau of Labor Statistics, Federal Reserve</li>
            <li><strong>Academic institutions</strong> — Harvard Health, Mayo Clinic, Stanford, MIT</li>
            <li><strong>Professional associations</strong> — APA, AMA, AHA, Academy of Nutrition and Dietetics</li>
          </ol>
          <p>We aim to link directly to the material that informed a claim so readers can verify it for themselves.</p>

          <h2>Corrections Policy</h2>
          <p>
            If you spot an error — a wrong statistic, a broken link, or a claim that no longer reflects current evidence — please use our <Link href="/contact" className="text-blue-600 hover:underline">Contact page</Link> to let us know. We review reports and correct material issues when they are confirmed.
          </p>

          <h2>Advertising</h2>
          <p>
            InfoDaily is supported by display advertising through Google AdSense. Ads are served automatically based on page content and reader interest. We do not control which specific ads appear, and advertisers have no influence over our editorial content.
          </p>
          <p>
            If a commercial relationship materially affects a recommendation, it should be disclosed clearly in the article.
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
