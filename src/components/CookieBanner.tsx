'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'cookie_consent';
const SUBSCRIBE_KEY = 'subscribe_popup_dismissed';

declare global {
  interface Window { gtag?: (...args: unknown[]) => void; }
}

function applyConsent(granted: boolean) {
  window.gtag?.('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
  });
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
    } catch {}
  }, []);

  function accept() {
    try { localStorage.setItem(CONSENT_KEY, 'accepted'); } catch {}
    applyConsent(true);
    setVisible(false);
  }

  function decline() {
    try { localStorage.setItem(CONSENT_KEY, 'declined'); } catch {}
    applyConsent(false);
    setVisible(false);
  }

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email || subStatus === 'loading') return;
    setSubStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubStatus('success');
        try { localStorage.setItem(SUBSCRIBE_KEY, '1'); } catch {}
      } else {
        setSubStatus('error');
      }
    } catch {
      setSubStatus('error');
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4">
      <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 px-5 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

          {/* Cookie consent section */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
              We use cookies to improve your experience and show relevant content. See our{' '}
              <Link href="/privacy-policy" className="text-blue-600 dark:text-blue-400 underline hover:no-underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-10 bg-gray-200 dark:bg-slate-600 shrink-0" />

          {/* Subscribe section */}
          <div className="w-full sm:w-auto shrink-0">
            {subStatus === 'success' ? (
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                ✓ Subscribed!
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-44 px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={subStatus === 'loading'}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm whitespace-nowrap"
                >
                  {subStatus === 'loading' ? '…' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-10 bg-gray-200 dark:bg-slate-600 shrink-0" />

          {/* Cookie buttons */}
          <div className="flex gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={decline}
              className="flex-1 sm:flex-none px-4 py-2 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-slate-600 rounded-xl transition-colors"
            >
              Decline
            </button>
            <button
              onClick={accept}
              className="flex-1 sm:flex-none px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
            >
              Accept
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
