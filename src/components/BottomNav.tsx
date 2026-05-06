'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { CATEGORIES } from '@/lib/categories';

export default function BottomNav() {
  const pathname = usePathname();
  const [showCats, setShowCats] = useState(false);
  const isHome = pathname === '/';

  return (
    <>
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-200 dark:border-slate-700 bottom-nav-safe">
        <div className="flex items-center justify-around h-16 px-2">

          {/* Home */}
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 px-5 py-2 rounded-xl transition-colors ${
              isHome ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-slate-400'
            }`}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill={isHome ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isHome ? 0 : 1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-semibold">Home</span>
          </Link>

          {/* Categories */}
          <button
            onClick={() => setShowCats(true)}
            className="flex flex-col items-center gap-1 px-5 py-2 rounded-xl text-gray-500 dark:text-slate-400 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span className="text-[10px] font-semibold">Categories</span>
          </button>

          {/* Search — scrolls to top so the sticky header search is reachable */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex flex-col items-center gap-1 px-5 py-2 rounded-xl text-gray-500 dark:text-slate-400 transition-colors"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-[10px] font-semibold">Search</span>
          </button>

        </div>
      </nav>

      {/* Categories bottom sheet */}
      {showCats && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowCats(false)}
          />
          <div className="relative bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl p-6 bottom-sheet-safe">
            <div className="w-10 h-1 bg-gray-200 dark:bg-slate-700 rounded-full mx-auto mb-5" />
            <h3 className="font-bold text-gray-900 dark:text-slate-100 text-base mb-4">Browse Categories</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {CATEGORIES.map(cat => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={() => setShowCats(false)}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-sm font-medium leading-snug">{cat.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
