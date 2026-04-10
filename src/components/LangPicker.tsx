'use client';

import { useState, useEffect } from 'react';

export const LANGUAGES = [
  { code: 'en', label: 'English'   },
  { code: 'tr', label: 'Türkçe'    },
  { code: 'es', label: 'Español'   },
  { code: 'fr', label: 'Français'  },
  { code: 'de', label: 'Deutsch'   },
  { code: 'pt', label: 'Português' },
  { code: 'it', label: 'Italiano'  },
  { code: 'ar', label: 'العربية'   },
  { code: 'zh-CN', label: '中文'   },
  { code: 'ja', label: '日本語'    },
];

declare global {
  interface Window {
    doGTranslate?: (lang: string) => void;
    google?: unknown;
  }
}

function googleTranslate(targetLang: string) {
  if (targetLang === 'en') {
    // Restore original
    const iframe = document.querySelector<HTMLIFrameElement>('.goog-te-banner-frame');
    if (iframe) {
      const btn = iframe.contentDocument?.querySelector<HTMLElement>('.goog-close-link');
      btn?.click();
    }
    // Alternative: reload without translate cookie
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + location.hostname;
    window.location.reload();
    return;
  }

  // Use Google's internal translate trigger
  const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
  if (select) {
    select.value = targetLang;
    select.dispatchEvent(new Event('change'));
  }
}

export default function LangPicker() {
  const [lang, setLangState] = useState('en');
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find(l => l.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    const stored = localStorage.getItem('lang');
    if (stored) setLangState(stored);
  }, []);

  const setLang = (code: string) => {
    setLangState(code);
    localStorage.setItem('lang', code);
    setOpen(false);
    googleTranslate(code);
  };

  return (
    <div className="relative">
      {/* Hidden Google Translate element */}
      <div id="google_translate_element" className="hidden" />

      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-500 transition-all text-sm bg-white dark:bg-slate-800"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span className="text-xs font-medium">{current.code.toUpperCase()}</span>
        <svg className="w-3 h-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden w-36 max-h-72 overflow-y-auto">
            {LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                  lang === l.code
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                <span className="text-xs font-mono font-bold opacity-50 w-6">{l.code.slice(0,2).toUpperCase()}</span>
                <span>{l.label}</span>
                {lang === l.code && <span className="ml-auto text-blue-500">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
