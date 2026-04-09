import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about InfoDaily — your trusted source for health, finance, technology, and life tips.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-black text-gray-900 mb-6">About InfoDaily</h1>
      <div className="prose prose-lg prose-gray max-w-none">
        <p>
          InfoDaily is a knowledge-first content platform dedicated to helping people live healthier, wealthier, and more productive lives. We publish thoroughly researched articles across five core categories: Health & Wellness, Personal Finance, Technology, Life Hacks, and Travel.
        </p>
        <h2>Our Mission</h2>
        <p>
          Our mission is simple: make expert-level knowledge accessible to everyone. Whether you want to lower your blood pressure naturally, start investing with $1,000, or plan a budget trip to Southeast Asia — we&apos;ve got you covered with accurate, actionable, and jargon-free content.
        </p>
        <h2>Our Editorial Standards</h2>
        <p>
          Every article on InfoDaily is written or reviewed by subject-matter experts. We cite scientific studies, government sources, and recognized industry experts. We never accept payment to endorse products or write biased reviews.
        </p>
        <h2>Contact Us</h2>
        <p>
          Have a question, feedback, or want to contribute? Visit our <a href="/contact" className="text-blue-600 hover:underline">Contact page</a>.
        </p>
      </div>
    </div>
  );
}
