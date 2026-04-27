import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the InfoDaily team for questions, corrections, or partnership inquiries.',
  alternates: { canonical: 'https://www.infodaily.net/contact' },
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Contact Us</h1>
      <p className="text-gray-500 dark:text-gray-400 text-lg mb-2">
        Have a question, feedback, or spotted an error in one of our articles? We read every message and respond within two business days.
      </p>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-10">
        You can also reach us directly at{' '}
        <a href="mailto:contact@infodaily.net" className="text-blue-600 hover:underline">
          contact@infodaily.net
        </a>
      </p>
      <ContactForm />
    </div>
  );
}
