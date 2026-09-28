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
       kenara oturur. z-consent onay bandını her şeyin üstünde tutar.
       Her sayfada sahne yüzeyinde: koyu anasayfanın ortasında yüzen beyaz,
       yuvarlak köşeli bir kutu sayfanın geri kalanıyla hiçbir şey
       paylaşmıyordu. Artık kenardan kenara ince bir şerit. */
    <div
      data-surface="stage"
      className="dark fixed left-0 right-0 border-t border-[var(--border)] bottom-[calc(var(--bottom-nav-h)+env(safe-area-inset-bottom,0px))] md:bottom-0"
      style={{ zIndex: 'var(--z-consent)' }}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

          {/* Cookie consent section */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              We use cookies to improve your experience and show relevant content. See our{' '}
              <Link href="/privacy-policy" className="text-[var(--text-base)] underline decoration-[var(--accent)] underline-offset-4 hover:text-[var(--accent)]">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          {/* Bülten kayıt formu buradan çıkarıldı. İki gerekçe: bir yasal
              onay kutusunun içine e-posta toplamak onayın ne için verildiğini
              bulanıklaştırıyor, ve aynı form zaten footer'da duruyordu — yani
              kaybedilen bir şey yok. Bu kutu artık tek bir iş yapıyor.

              Butonlar min-h-11 (44px): eskiden 37 piksellerdi. */}
          <div className="flex gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={decline}
              className="flex-1 sm:flex-none min-h-11 px-5 text-sm font-semibold text-[var(--text-base)] border border-[var(--border)] hover:border-[var(--text-muted)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Decline
            </button>
            <button
              onClick={accept}
              className="flex-1 sm:flex-none min-h-11 px-5 text-sm font-semibold text-[var(--bg-base)] bg-[var(--text-base)] hover:bg-[var(--accent)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Accept
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
