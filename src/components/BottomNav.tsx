'use client';
/* Mobil alt menü. Renkler artık tema değişkenlerinden geliyor — eskiden
   beyaz/slate sabitti, yani koyu anasayfanın altında beyaz bir şerit
   duruyordu. Anasayfada sahnenin parçası.

   Search eskiden sayfayı en üste kaydırıyordu, aramayı açmıyordu. Şimdi
   SearchBar'a bir olay yolluyor. */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import CategoryIcon from './CategoryIcon';
import { CATEGORIES } from '@/lib/categories';

function Tab({ href, label, active, children }: { href: string; label: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`relative flex-1 flex flex-col items-center justify-center gap-1 h-16 transition-colors ${
        active ? 'text-[var(--text-base)]' : 'text-[var(--text-muted)]'
      }`}
    >
      {active && <span className="absolute top-0 inset-x-5 h-0.5 bg-[var(--accent)]" aria-hidden />}
      {children}
      <span className="text-[11px] font-medium">{label}</span>
    </Link>
  );
}

const ICON = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, 'aria-hidden': true } as const;

export default function BottomNav() {
  const pathname = usePathname() ?? '/';
  const [showCats, setShowCats] = useState(false);
  const stage = pathname === '/';

  return (
    <>
      <nav
        aria-label="Quick"
        data-surface={stage ? 'stage' : undefined}
        className={`${stage ? 'dark ' : ''}md:hidden fixed bottom-0 inset-x-0 z-[var(--z-nav)] bg-[var(--bg-base)] border-t border-[var(--border)] bottom-nav-safe`}
      >
        <div className="flex items-stretch">
          <Tab href="/" label="Home" active={stage}>
            <svg {...ICON}><path d="M4 10.5 12 4l8 6.5V20h-5.5v-6h-5v6H4z" strokeLinejoin="round" /></svg>
          </Tab>

          <button
            onClick={() => setShowCats(true)}
            aria-haspopup="dialog"
            className="flex-1 flex flex-col items-center justify-center gap-1 h-16 text-[var(--text-muted)]"
          >
            <svg {...ICON}><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" /></svg>
            <span className="text-[11px] font-medium">Sections</span>
          </button>

          <Tab href="/videos" label="Videos" active={pathname.startsWith('/videos')}>
            <svg {...ICON}><path d="M3 6h13v12H3zM16 10l5-3v10l-5-3" strokeLinejoin="round" /></svg>
          </Tab>

          <Tab href="/games" label="Games" active={pathname.startsWith('/games')}>
            <svg {...ICON}><path d="M6 8h12a3 3 0 0 1 3 3v3a3 3 0 0 1-5.2 2L14 14h-4l-1.8 2A3 3 0 0 1 3 14v-3a3 3 0 0 1 3-3zM8 10v3M6.5 11.5h3M15.5 11h.01M17.5 13h.01" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Tab>

          <button
            onClick={() => window.dispatchEvent(new Event('infodaily:search'))}
            className="flex-1 flex flex-col items-center justify-center gap-1 h-16 text-[var(--text-muted)]"
          >
            <svg {...ICON}><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" /></svg>
            <span className="text-[11px] font-medium">Search</span>
          </button>
        </div>
      </nav>

      {showCats && (
        <div className="md:hidden fixed inset-0 z-[var(--z-overlay)] flex flex-col justify-end" role="dialog" aria-modal="true" aria-label="Sections">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowCats(false)} />
          <div
            data-surface={stage ? 'stage' : undefined}
            className={`${stage ? 'dark ' : ''}relative bg-[var(--bg-base)] text-[var(--text-base)] border-t border-[var(--border)] px-5 pt-5 bottom-sheet-safe`}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="type-label text-[var(--text-muted)]">Sections</h2>
              <button
                onClick={() => setShowCats(false)}
                className="-mr-3 w-11 h-11 inline-flex items-center justify-center"
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                  <path d="M5 5l14 14M19 5L5 19" strokeLinecap="square" />
                </svg>
              </button>
            </div>
            <ul>
              {CATEGORIES.map(cat => (
                <li key={cat.slug} className="border-b border-[var(--border)]">
                  <Link
                    href={`/category/${cat.slug}`}
                    onClick={() => setShowCats(false)}
                    className="flex items-center justify-between py-4"
                  >
                    <span className="type-display type-display-m">{cat.label}</span>
                    <CategoryIcon slug={cat.slug} size={20} className="text-[var(--accent)]" />
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/articles" onClick={() => setShowCats(false)} className="flex items-center py-4">
                  <span className="type-display type-display-m">All guides</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
