'use client';

import { useState, useCallback, useEffect } from 'react';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'it', label: 'Italiano', flag: '🇮🇹' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
];

interface Props {
  slug: string;
  originalTitle: string;
  originalExcerpt: string;
  originalContent: string;
}

interface Translated {
  title: string;
  excerpt: string;
  content: string;
}

function getInitialLang(): string {
  if (typeof window === 'undefined') return 'en';
  try {
    const stored = localStorage.getItem('lang');
    if (stored) return stored;
    const cookieLang = document.cookie.split(';').map(c => c.trim())
      .find(c => c.startsWith('lang='))?.split('=')[1];
    if (cookieLang) return cookieLang;
  } catch {
    // Storage blocked by browser tracking prevention
  }
  return 'en';
}

export default function ArticleTranslator({ slug, originalTitle, originalExcerpt, originalContent }: Props) {
  const [currentLang, setCurrentLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [translations, setTranslations] = useState<Record<string, Translated>>({});

  const translate = useCallback(async (lang: string) => {
    if (lang === 'en' || translations[lang]) {
      setCurrentLang(lang);
      return;
    }

    // Check localStorage cache
    const cacheKey = `translate_${slug}_${lang}`;
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setTranslations(prev => ({ ...prev, [lang]: JSON.parse(cached) }));
        setCurrentLang(lang);
        return;
      }
    } catch {}

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: originalContent,
          title: originalTitle,
          excerpt: originalExcerpt,
          targetLang: lang,
        }),
      });

      if (!res.ok) throw new Error('Translation failed');

      const data: Translated = await res.json();
      setTranslations(prev => ({ ...prev, [lang]: data }));
      setCurrentLang(lang);

      // Save to localStorage cache
      try {
        localStorage.setItem(cacheKey, JSON.stringify(data));
      } catch {}
    } catch {
      setError('Translation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [slug, originalTitle, originalExcerpt, originalContent, translations]);

  // Auto-translate on mount if lang != 'en'
  useEffect(() => {
    const lang = getInitialLang();
    if (lang !== 'en') translate(lang);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync with header lang picker
  useEffect(() => {
    const handler = (e: Event) => {
      const lang = (e as CustomEvent<string>).detail;
      translate(lang);
    };
    window.addEventListener('langchange', handler);
    return () => window.removeEventListener('langchange', handler);
  }, [translate]);

  const current: Translated | null = currentLang === 'en'
    ? { title: originalTitle, excerpt: originalExcerpt, content: originalContent }
    : translations[currentLang] ?? null;

  return (
    <>
      {/* Language Picker */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mr-1">
          Read in:
        </span>
        {LANGUAGES.map(lang => (
          <button
            key={lang.code}
            onClick={() => translate(lang.code)}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              currentLang === lang.code
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400'
            } disabled:opacity-50`}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 py-6 text-gray-500 dark:text-slate-400">
          <span className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin flex-shrink-0" />
          <span className="text-sm">Translating article... (~15 seconds)</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Translated Title & Excerpt */}
      {current && currentLang !== 'en' && !loading && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-slate-100 leading-tight mb-2">
            {current.title}
          </h1>
          <p className="text-gray-500 dark:text-slate-400 text-base leading-relaxed">{current.excerpt}</p>
        </div>
      )}

      {/* Article Content — always show something */}
      <div
        className="prose prose-lg prose-gray dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-slate-100 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-slate-100"
        dangerouslySetInnerHTML={{ __html: current?.content ?? originalContent }}
      />
    </>
  );
}
