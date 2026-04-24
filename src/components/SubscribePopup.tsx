'use client';

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'subscribe_popup_dismissed';
const DELAY_MS = 10 * 60 * 1000; // 10 minutes

export default function SubscribePopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }

    const timer = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
    setVisible(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        try { localStorage.setItem(STORAGE_KEY, '1'); } catch {}
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={dismiss} />

      {/* Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {status === 'success' ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">You're in!</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Check your inbox for a welcome email. We'll send you the best articles every day.</p>
            <button onClick={dismiss} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm">
              Continue Reading
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="text-3xl mb-3">📬</div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Enjoying InfoDaily?
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Get the best articles delivered to your inbox — every day, no spam.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm"
              >
                {status === 'loading' ? 'Subscribing…' : 'Subscribe — It\'s Free'}
              </button>
            </form>

            {status === 'error' && (
              <p className="text-red-500 text-xs mt-2 text-center">{errorMsg}</p>
            )}

            <button
              onClick={dismiss}
              className="mt-4 w-full text-center text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              No thanks, I'll pass
            </button>
          </>
        )}
      </div>
    </div>
  );
}
