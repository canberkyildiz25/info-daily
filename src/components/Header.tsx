'use client';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { CATEGORIES } from '@/lib/categories';
import { useTheme, THEMES } from './ThemeProvider';
import SearchBar from './SearchBar';
import { useFont, FONTS } from './FontProvider';

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

function FontPicker() {
  const { font, setFont } = useFont();
  const [open, setOpen] = useState(false);
  const current = FONTS.find(f => f.id === font) ?? FONTS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-500 transition-all text-sm bg-white dark:bg-slate-800"
        title="Font"
      >
        <span className="text-xs font-bold tracking-tight leading-none" style={{ fontFamily: 'Georgia, serif' }}>Aa</span>
        <span className="hidden sm:inline text-xs font-medium">{current.label}</span>
        <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden w-40">
            {FONTS.map(f => (
              <button
                key={f.id}
                onClick={() => { setFont(f.id); setOpen(false); }}
                style={{ fontFamily: `var(${f.variable}), ${f.serif ? 'serif' : 'sans-serif'}` }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  font === f.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                <span>{f.label}</span>
                <span className="text-xs opacity-50">{f.serif ? 'Serif' : 'Sans'}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CategoryNav() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? 200 : -200, behavior: 'smooth' });
  };

  return (
    <div className="hidden md:flex items-center border-t border-[var(--border)] gap-1 relative">
      {/* Left fade + arrow */}
      <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-[var(--bg-header)] to-transparent z-10 pointer-events-none" />
      <button
        onClick={() => scroll('left')}
        className="relative z-20 shrink-0 p-1 rounded-full text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Scroll left"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Tab-style scrollable nav */}
      <div
        ref={scrollRef}
        className="flex items-end overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {CATEGORIES.map(cat => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            onClick={() => setActiveSlug(cat.slug)}
            className={`
              group relative flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap
              transition-colors duration-150
              ${activeSlug === cat.slug
                ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]'
                : 'text-gray-500 dark:text-slate-400 hover:text-[var(--text-base)] border-b-2 border-transparent hover:border-gray-300 dark:hover:border-slate-600'
              }
            `}
          >
            <span className="text-sm leading-none">{cat.icon}</span>
            <span>{cat.label}</span>
          </Link>
        ))}
      </div>

      {/* Right arrow + fade */}
      <button
        onClick={() => scroll('right')}
        className="relative z-20 shrink-0 p-1 rounded-full text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
        aria-label="Scroll right"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-[var(--bg-header)] to-transparent z-10 pointer-events-none" />
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme } = useTheme();

  return (
    <header className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-md border-b border-gray-200/60 dark:border-slate-700/60 sticky top-0 z-50 shadow-sm">
      <div className="header-top-strip" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Row 1: Logo + nav + tools */}
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Left: logo + nav links */}
          <div className="flex items-center gap-6 min-w-0">
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover:scale-105">
                <rect width="32" height="32" rx="6" fill="#1a3fa8"/>
                <circle cx="16" cy="10" r="2.5" fill="white"/>
                <rect x="13" y="15" width="6" height="9" rx="2" fill="white"/>
              </svg>
              <span className="leading-none tracking-tight">
                <span className="font-black text-[1.2rem]" style={{ fontFamily: 'Georgia, serif', color: 'var(--accent)' }}>Info</span>
                <span className="font-black text-[1.2rem] text-gray-900 dark:text-white">Daily</span>
                <span className="text-xs font-normal text-gray-400 dark:text-slate-500 ml-0.5">.net</span>
              </span>
            </Link>

            {/* Divider */}
            <div className="hidden md:block w-px h-5 bg-gray-200 dark:bg-slate-700" />

            {/* Desktop nav links */}
            <nav className="hidden md:flex items-center gap-0.5">
              <Link href="/" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                </span>
                News
              </Link>
              <Link href="/articles" className="px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                Articles
              </Link>
              <Link href="/videos" className="px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                Videos
              </Link>
              <Link href="/authors" className="px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                Authors
              </Link>
              <Link href="/about" className="px-3 py-1.5 rounded-lg text-sm font-semibold text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                About
              </Link>
            </nav>
          </div>

          {/* Right: tools */}
          <div className="flex items-center gap-2 shrink-0">
            <SearchBar />
            <div className="hidden sm:flex items-center gap-2">
              <FontPicker />
            </div>
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

        {/* Row 2: Category pills */}
        <CategoryNav />
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-slate-700 px-4 py-3 space-y-3">
          {/* Font tool */}
          <div className="flex gap-2 items-center">
            <FontPicker />
          </div>
          {/* Quick nav links */}
          <div className="flex gap-2 flex-wrap">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
              onClick={() => setMenuOpen(false)}
            >
              🔴 News
            </Link>
            <Link
              href="/articles"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
              onClick={() => setMenuOpen(false)}
            >
              📄 Articles
            </Link>
            <Link
              href="/videos"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
              onClick={() => setMenuOpen(false)}
            >
              📺 Videos
            </Link>
            <Link
              href="/authors"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-600"
              onClick={() => setMenuOpen(false)}
            >
              ✍️ Authors
            </Link>
            <Link
              href="/about"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-600"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
          </div>
          {/* Categories */}
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
