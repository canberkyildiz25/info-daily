import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';
import SubscribeForm from './SubscribeForm';

export default function Footer() {
  return (
    <footer className="site-footer mt-16 border-t">
      <div className="h-[3px] bg-gradient-to-r from-[var(--accent,#1a3fa8)] via-[#b8860b] to-[var(--accent,#1a3fa8)]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="mb-3 leading-none">
              <span className="font-black text-xl text-blue-400" style={{ fontFamily: 'Georgia, serif' }}>Info</span>
              <span className="font-black text-xl text-white">Daily</span>
              <span className="text-sm font-normal text-slate-500">.net</span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your daily source of knowledge across health, finance, technology, life hacks, and travel.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Categories</h4>
            <ul className="space-y-2">
              {CATEGORIES.map(cat => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {cat.icon} {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SubscribeForm />
            <div className="mt-6">
            <h4 className="text-white font-semibold mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/authors" className="text-sm text-gray-400 hover:text-white transition-colors">Our Authors</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} InfoDaily. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
