'use client';

import { useState, useRef, useEffect } from 'react';

export default function LangPicker() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-slate-400 hover:border-blue-400 dark:hover:border-blue-500 transition-all text-sm bg-white dark:bg-slate-800"
        aria-label="Translate page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span className="hidden sm:inline text-xs font-medium">Translate</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-lg p-4 w-64">
          <p className="text-xs font-semibold text-gray-700 dark:text-slate-200 mb-1">Read in your language</p>
          <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed mb-3">
            Your browser can translate this page automatically. Look for the translate icon in your address bar, or right-click the page.
          </p>
          <div className="flex flex-col gap-1.5 text-xs text-gray-400 dark:text-slate-500">
            <span>🌐 <strong>Chrome / Edge:</strong> translate icon in address bar</span>
            <span>🍎 <strong>Safari:</strong> View → Translation</span>
            <span>🦊 <strong>Firefox:</strong> add-on or address bar icon</span>
          </div>
        </div>
      )}
    </div>
  );
}
