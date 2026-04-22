import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about InfoDaily — who we are, our editorial standards, and the team behind our daily articles on health, finance, technology, and life.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3">About InfoDaily</h1>
      <p className="text-gray-500 dark:text-gray-400 text-lg mb-10">Independent, research-backed articles on the topics that matter most in daily life.</p>

      <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
        <p>
          InfoDaily was founded with a straightforward goal: give everyday readers the same quality of information that professionals rely on — without the jargon, the paywalls, or the advertising spin. We cover ten subject areas where bad or oversimplified advice has real consequences: health, personal finance, technology, life skills, travel, food, business, science, relationships, and entertainment.
        </p>

        <h2>What We Publish</h2>
        <p>
          Every article on InfoDaily is either a deep-dive guide, a research summary, or a practical how-to. We do not publish opinion columns, sponsored content, or press releases disguised as editorial. If an article makes a factual claim, that claim is sourced — from peer-reviewed research, government data, or named subject-matter experts.
        </p>
        <p>
          We update older articles when the underlying evidence changes. Publication dates and update dates are shown on every post so readers can judge freshness for themselves.
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
          InfoDaily articles are written by a team of independent contributors with professional backgrounds in their respective fields — including registered dietitians, certified financial planners, software engineers, and journalists with beats in science and technology. Author bios are published on each article so readers can evaluate credentials directly.
        </p>
        <p>
          We do not publish anonymous content. Every article carries a named author.
        </p>

        <h2>Corrections Policy</h2>
        <p>
          We take accuracy seriously. If you spot an error — a wrong statistic, a broken link, or a claim that no longer reflects current evidence — please use our <a href="/contact" className="text-blue-600 hover:underline">Contact page</a> to let us know. We review correction requests within 48 hours and publish a note at the top of any corrected article.
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
          For editorial inquiries, corrections, or partnership questions, please visit our <a href="/contact" className="text-blue-600 hover:underline">Contact page</a>. We read every message and respond to most within two business days.
        </p>
      </div>
    </div>
  );
}
