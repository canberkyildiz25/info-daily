import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'InfoDaily terms of service — the rules and conditions for using our website.',
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Terms of Service</h1>
      <p className="text-gray-400 text-sm mb-8">Last updated: April 2026</p>
      <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
        <p>
          Welcome to InfoDaily. By accessing or using our website at <strong>infodaily.net</strong>, you agree to be bound by these Terms of Service. Please read them carefully. If you do not agree to these terms, please do not use the site.
        </p>

        <h2>1. Use of the Site</h2>
        <p>
          InfoDaily provides informational articles on health, finance, technology, lifestyle, travel, food, business, science, relationships, and entertainment. The content on this site is intended for general informational purposes only and does not constitute professional advice of any kind.
        </p>
        <p>
          You may use this site for personal, non-commercial purposes. You may not:
        </p>
        <ul>
          <li>Reproduce, distribute, or republish any content from this site without written permission</li>
          <li>Use automated tools (scrapers, bots) to collect content from this site</li>
          <li>Use the site in any way that violates applicable local, national, or international law</li>
          <li>Attempt to gain unauthorized access to any part of the site or its infrastructure</li>
        </ul>

        <h2>2. Informational Content — Not Professional Advice</h2>
        <p>
          Content published on InfoDaily is for general information only. It is not a substitute for professional medical, financial, legal, or other advice. Always consult a qualified professional before making decisions that affect your health, finances, or legal situation.
        </p>
        <p>
          InfoDaily makes no warranties about the completeness, accuracy, or suitability of any information on the site. We are not liable for any decisions made based on content published here.
        </p>

        <h2>3. Intellectual Property</h2>
        <p>
          All content on InfoDaily — including articles, graphics, logos, and site design — is the property of InfoDaily or its contributors and is protected by applicable copyright law. You may share links to our articles and quote short excerpts (with attribution and a link back to the original), but full reproduction is not permitted without prior written consent.
        </p>

        <h2>4. Third-Party Links and Advertising</h2>
        <p>
          InfoDaily may contain links to third-party websites for reference or additional reading. We are not responsible for the content, accuracy, or practices of any third-party site. Inclusion of a link does not constitute endorsement.
        </p>
        <p>
          We display advertisements through Google AdSense. These ads are served by Google and governed by Google's own privacy and advertising policies. InfoDaily does not control the specific ads served and is not responsible for their content.
        </p>

        <h2>5. User-Submitted Content</h2>
        <p>
          If you submit content through our contact form or other channels (such as a correction, tip, or contribution), you grant InfoDaily a non-exclusive, royalty-free license to use, publish, and modify that content. We will not publish your personal information without your consent.
        </p>

        <h2>6. Disclaimer of Warranties</h2>
        <p>
          This site is provided "as is" without warranties of any kind, express or implied. We do not warrant that the site will be uninterrupted, error-free, or free of viruses or other harmful components.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, InfoDaily and its contributors shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of — or inability to use — this site or its content.
        </p>

        <h2>8. Changes to These Terms</h2>
        <p>
          We reserve the right to update these Terms of Service at any time. Changes will be reflected by updating the date at the top of this page. Continued use of the site after changes are posted constitutes acceptance of the revised terms.
        </p>

        <h2>9. Governing Law</h2>
        <p>
          These terms are governed by and construed in accordance with applicable law. Any disputes arising from use of this site will be subject to the jurisdiction of the relevant courts.
        </p>

        <h2>10. Contact</h2>
        <p>
          If you have questions about these terms, please reach out through our <a href="/contact" className="text-blue-600 hover:underline">Contact page</a>.
        </p>
      </div>
    </div>
  );
}
