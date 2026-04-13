'use client';
import Link from 'next/link';
import { useState } from 'react';
import { CATEGORIES } from '@/lib/categories';
import { useTheme, THEMES } from './ThemeProvider';
import SearchBar from './SearchBar';
import LangPicker from './LangPicker';

const CAT_COLORS: Record<string, string> = {
  health:        'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border-emerald-200 dark:border-emerald-800',
  finance:       'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 border-amber-200 dark:border-amber-800',
  technology:    'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800',
  'life-hacks':  'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/50 border-violet-200 dark:border-violet-800',
  travel:        'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/50 border-sky-200 dark:border-sky-800',
  food:          'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/50 border-orange-200 dark:border-orange-800',
  business:      'bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-600',
  science:       'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/50 border-teal-200 dark:border-teal-800',
  relationships:  'bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 border-rose-200 dark:border-rose-800',
  entertainment:  'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 border-purple-200 dark:border-purple-800',
};

function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const current = THEMES.find(t => t.id === theme) ?? THEMES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-500 transition-all text-sm bg-white dark:bg-slate-800"
      >
        <span>{current.icon}</span>
        <span className="hidden sm:inline text-xs font-medium">{current.label}</span>
        <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden w-36">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setOpen(false); }}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                  theme === t.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
                {theme === t.id && <span className="ml-auto text-blue-500">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <header className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200/60 dark:border-slate-700/60 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Row 1: Logo + toggle */}
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            {/* Logo mark */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="32" height="32" rx="8" fill="#2563eb"/>
              <rect x="7" y="7" width="7" height="3" rx="1.5" fill="white"/>
              <rect x="7" y="22" width="7" height="3" rx="1.5" fill="white"/>
              <rect x="10" y="10" width="3" height="12" rx="1.5" fill="white"/>
              <rect x="17" y="7" width="8" height="3" rx="1.5" fill="#93c5fd"/>
              <rect x="17" y="13" width="6" height="2.5" rx="1.25" fill="#93c5fd"/>
              <rect x="17" y="19" width="8" height="3" rx="1.5" fill="#93c5fd"/>
            </svg>
            <span className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight">
              Info<span className="text-blue-600 dark:text-blue-400">Daily</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <SearchBar />
            <LangPicker />
            <ThemePicker />
            <button
              className="md:hidden p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Row 2: Category tabs */}
        <nav className="hidden md:flex overflow-x-auto scrollbar-none border-t border-gray-100 dark:border-slate-800">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className={`group flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 border-transparent transition-all
                text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white
                ${CAT_COLORS[cat.slug].includes('emerald') ? 'hover:border-emerald-500' :
                  CAT_COLORS[cat.slug].includes('amber') ? 'hover:border-amber-500' :
                  CAT_COLORS[cat.slug].includes('blue') ? 'hover:border-blue-500' :
                  CAT_COLORS[cat.slug].includes('violet') ? 'hover:border-violet-500' :
                  CAT_COLORS[cat.slug].includes('sky') ? 'hover:border-sky-500' :
                  CAT_COLORS[cat.slug].includes('orange') ? 'hover:border-orange-500' :
                  CAT_COLORS[cat.slug].includes('slate') ? 'hover:border-slate-500' :
                  CAT_COLORS[cat.slug].includes('teal') ? 'hover:border-teal-500' :
                  CAT_COLORS[cat.slug].includes('purple') ? 'hover:border-purple-500' :
                  'hover:border-rose-500'}`}
            >
              <span className="text-sm">{cat.icon}</span>
              <span>{cat.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-slate-700 px-4 py-3">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${CAT_COLORS[cat.slug]}`}
                onClick={() => setMenuOpen(false)}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
