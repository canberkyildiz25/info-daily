import type { Metadata } from 'next';
import PageHead from '@/components/PageHead';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the InfoDaily team for questions, corrections, or partnership inquiries.',
  alternates: { canonical: 'https://www.infodaily.net/contact' },
};

export default function ContactPage() {
  return (
    <div>
      <PageHead
        label="Contact"
        title="Write to us"
        intro="A question, feedback, or an error in one of our guides? We read every message and respond within two business days."
      >
        <p className="mt-6 text-[0.9375rem] text-[var(--text-muted)]">
          Or email{' '}
          <a href="mailto:contact@infodaily.net" className="text-[var(--text-base)] underline decoration-[var(--accent)] underline-offset-4 hover:text-[var(--accent)]">
            contact@infodaily.net
          </a>
        </p>
      </PageHead>
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="max-w-[42rem]">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
