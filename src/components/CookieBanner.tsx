'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const CONSENT_KEY = 'cookie_consent';

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

  if (!visible) return null;

  return (
    /* Mobilde alt menünün üstünden başlar, masaüstünde (menü gizlendiğinde)
       kenara oturur. z-consent onay bandını her şeyin üstünde tutar. */
    <div
      className="fixed left-0 right-0 p-3 sm:p-4 bottom-[calc(var(--bottom-nav-h)+env(safe-area-inset-bottom,0px))] md:bottom-0"
      style={{ zIndex: 'var(--z-consent)' }}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <div className="max-w-5xl mx-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 px-5 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

          {/* Cookie consent section */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
              We use cookies to improve your experience and show relevant content. See our{' '}
              <Link href="/privacy-policy" className="text-accent-600 dark:text-accent-400 underline hover:no-underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-10 bg-gray-200 dark:bg-slate-600 shrink-0" />

          {/* Bülten kayıt formu buradan çıkarıldı. İki gerekçe: bir yasal
              onay kutusunun içine e-posta toplamak onayın ne için verildiğini
              bulanıklaştırıyor, ve aynı form zaten footer'da duruyordu — yani
              kaybedilen bir şey yok. Bu kutu artık tek bir iş yapıyor.

              Butonlar min-h-11 (44px): eskiden 37 piksellerdi. */}
          <div className="flex gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={decline}
              className="flex-1 sm:flex-none min-h-11 px-4 text-sm text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white border border-gray-200 dark:border-slate-600 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
            >
              Decline
            </button>
            <button
              onClick={accept}
              className="flex-1 sm:flex-none min-h-11 px-5 text-sm font-semibold text-white bg-accent-600 hover:bg-accent-700 rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600"
            >
              Accept
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
