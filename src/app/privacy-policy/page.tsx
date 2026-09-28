import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'InfoDaily privacy policy — how we collect, use, and protect your data.',
  alternates: { canonical: 'https://www.infodaily.net/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  return (
    <div>
      <PageHead label="Legal" title="Privacy Policy" size="l">
        <p className="type-label mt-6 text-[var(--text-muted)]">Last updated: April 2026</p>
      </PageHead>
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10">
      <div className="article-body reading prose prose-lg max-w-[42rem]">
        <p>
          InfoDaily (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This policy explains what information we collect, how we use it, and your rights.
        </p>

        <h2>Information We Collect</h2>
        <p>We may collect the following types of information:</p>
        <ul>
          <li><strong>Usage data:</strong> Pages visited, time spent on pages, browser type, device type, and IP address — collected automatically via analytics tools.</li>
          <li><strong>Cookies:</strong> Small text files stored on your device to improve user experience and serve relevant advertisements.</li>
          <li><strong>Contact form data:</strong> If you contact us, we collect your name and email address to respond to your inquiry.</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>To improve our website content and user experience</li>
          <li>To serve personalized advertisements through Google AdSense</li>
          <li>To analyze traffic patterns and optimize site performance</li>
          <li>To respond to your inquiries</li>
        </ul>

        <h2>Google AdSense and Third-Party Advertising</h2>
        <p>
          We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to this website or other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-accent-600 hover:underline" rel="noopener noreferrer" target="_blank">Google Ad Settings</a>.
        </p>

        <h2>Cookies</h2>
        <p>
          By using our website, you consent to the use of cookies. You can disable cookies in your browser settings, but this may affect site functionality.
        </p>

        <h2>Data Sharing</h2>
        <p>
          We do not sell your personal data. We may share anonymized, aggregated data with analytics providers. We comply with all applicable data protection laws.
        </p>

        <h2>Your Rights</h2>
        <p>You have the right to access, correct, or delete any personal data we hold about you. Contact us at the email below to exercise these rights.</p>

        <h2>Contact</h2>
        <p>
          If you have questions about this privacy policy, please contact us through our <a href="/contact" className="text-accent-600 hover:underline">Contact page</a>.
        </p>
      </div>
      </div>
    </div>
  );
}
