'use client';
/* Eskiden başlık yaklaşık on iki kontrol taşıyordu: altı metin bağlantısı,
 * arama, yazı tipi seçici, tema seçici, mobil menü, ve altında kaydırma
 * oklarıyla ikinci bir kategori satırı — sayfadaki en yoğun şey. Şimdi
 * logo solda; iki kategori, Articles, arama ve menü sağda. Geri kalan her
 * şey (About, Videos, Games, Editorial, tema, okuma yazı tipi) menüde.
 *
 * Anasayfada başlık sahnenin parçası: koyu, ve sayfanın en üstündeyken
 * açılış görselinin üstünde saydam. */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import ThemeIcon from './ThemeIcon';
import SearchBar from './SearchBar';
import { useTheme, THEMES } from './ThemeProvider';
import { useFont, FONTS } from './FontProvider';

const PRIMARY = [
  { href: '/category/technology', label: 'Technology', match: ['/category/technology', '/technology/'] },
  { href: '/category/gaming',     label: 'Gaming',     match: ['/category/gaming', '/gaming/'] },
  { href: '/articles',            label: 'Articles',   match: ['/articles'] },
];

const MORE = [
  { href: '/videos',  label: 'Videos' },
  { href: '/games',   label: 'Games' },
];

const ABOUT = [
  { href: '/about',   label: 'About InfoDaily' },
  { href: '/authors', label: 'Editorial standards' },
  { href: '/contact', label: 'Contact' },
];

function isActive(pathname: string, match: string[]) {
  return match.some(m => pathname.startsWith(m));
}

function Wordmark() {
  return (
    <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="InfoDaily — home">
      <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden className="shrink-0">
        <rect width="32" height="32" rx="3" className="fill-accent-600" />
        <circle cx="16" cy="10" r="2.5" fill="white" />
        <rect x="13" y="15" width="6" height="9" rx="1" fill="white" />
      </svg>
      <span className="type-display text-[1.5rem] leading-none text-[var(--text-base)]">InfoDaily</span>
    </Link>
  );
}

function MenuPanel({ open, onClose, stage }: { open: boolean; onClose: () => void; stage: boolean }) {
  const { theme, setTheme } = useTheme();
  const { font, setFont } = useFont();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      prev?.focus();
    };
  }, [open, onClose]);

  return (
    <div
      className="group fixed inset-0 z-[var(--z-overlay)] data-[open=false]:pointer-events-none"
      data-open={open}
      inert={!open}
    >
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-300 opacity-0 group-data-[open=true]:opacity-100"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        data-surface={stage ? 'stage' : undefined}
        className={`${stage ? 'dark ' : ''}absolute right-0 top-0 h-full w-full sm:w-[26rem] overflow-y-auto bg-[var(--bg-base)] text-[var(--text-base)] border-l border-[var(--border)]
          translate-x-full group-data-[open=true]:translate-x-0 transition-transform duration-500 ease-[var(--ease-drawer)] motion-reduce:transition-none`}
      >
        <div className="flex items-center justify-between h-16 px-5 sm:px-8 border-b border-[var(--border)]">
          <span className="type-label text-[var(--text-muted)]">Menu</span>
          <button
            ref={closeRef}
            onClick={onClose}
            className="-mr-3 w-11 h-11 inline-flex items-center justify-center text-[var(--text-base)] hover:text-[var(--accent)] transition-colors"
            aria-label="Close menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
              <path d="M5 5l14 14M19 5L5 19" strokeLinecap="square" />
            </svg>
          </button>
        </div>

        <nav className="px-5 sm:px-8 pt-6 pb-8" aria-label="Sections">
          <ul>
            {[...PRIMARY, ...MORE].map(item => (
              <li key={item.href} className="border-b border-[var(--border)]">
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="type-display type-display-m flex w-full py-3 hover:text-[var(--accent)] transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-6 space-y-0.5">
            {ABOUT.map(item => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className="text-[0.9375rem] text-[var(--text-muted)] hover:text-[var(--text-base)] transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="px-5 sm:px-8 py-8 border-t border-[var(--border)] space-y-8">
          <fieldset>
            <legend className="type-label text-[var(--text-muted)] mb-3">Article text</legend>
            <div className="grid grid-cols-2 border border-[var(--border)]">
              {FONTS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setFont(f.id)}
                  aria-pressed={font === f.id}
                  className={`min-h-11 inline-flex items-center justify-center text-[0.9375rem] transition-colors ${
                    font === f.id
                      ? 'bg-[var(--text-base)] text-[var(--bg-base)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-base)]'
                  }`}
                  style={{ fontFamily: `var(${f.variable})` }}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-[var(--text-muted)]">Changes the body text of guides. Menus stay as they are.</p>
          </fieldset>

          <fieldset>
            <legend className="type-label text-[var(--text-muted)] mb-3">Reading theme</legend>
            <div className="grid grid-cols-2 gap-x-4">
              {THEMES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  aria-pressed={theme === t.id}
                  className={`flex items-center gap-2.5 min-h-11 text-[0.9375rem] border-b transition-colors ${
                    theme === t.id
                      ? 'text-[var(--text-base)] border-[var(--accent)]'
                      : 'text-[var(--text-muted)] border-[var(--border)] hover:text-[var(--text-base)]'
                  }`}
                >
                  <ThemeIcon id={t.id} size={16} />
                  {t.label}
                </button>
              ))}
            </div>
            {stage && (
              <p className="mt-2 text-xs text-[var(--text-muted)]">The front page is always dark. Your theme applies to guides and lists.</p>
            )}
          </fieldset>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname() ?? '/';
  const stage = pathname === '/';
  const [menuOpen, setMenuOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [mounted, setMounted] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (!stage) return;
    const onScroll = () => setAtTop(window.scrollY < 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [stage]);

  return (
    <>
      <header
        data-surface={stage ? 'stage' : undefined}
        data-at-top={stage ? String(atTop) : undefined}
        className={`site-header ${stage ? 'dark fixed' : 'sticky'} inset-x-0 top-0 z-[var(--z-nav)]`}
      >
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
          <Wordmark />

          <div className="flex items-center gap-1 sm:gap-2">
            <nav className="hidden md:flex items-center gap-7 mr-4" aria-label="Primary">
              {PRIMARY.map(item => {
                const active = isActive(pathname, item.match);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`relative text-[0.9375rem] font-medium transition-colors ${
                      active ? 'text-[var(--text-base)]' : 'text-[var(--text-muted)] hover:text-[var(--text-base)]'
                    }`}
                  >
                    {item.label}
                    {active && <span className="absolute left-0 right-0 bottom-2.5 h-0.5 bg-[var(--accent)]" aria-hidden />}
                  </Link>
                );
              })}
            </nav>

            <SearchBar stage={stage} />

            <button
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-haspopup="dialog"
              className="gap-2 h-11 pl-3 -mr-2 pr-2 text-[var(--text-base)] hover:text-[var(--accent)] transition-colors"
            >
              <span className="hidden sm:inline text-[0.9375rem] font-medium">Menu</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden>
                <path d="M3 8h18M3 16h18" strokeLinecap="square" />
              </svg>
              <span className="sr-only sm:hidden">Menu</span>
            </button>
          </div>
        </div>
      </header>
      {mounted && createPortal(
        <MenuPanel open={menuOpen} onClose={closeMenu} stage={stage} />,
        document.body,
      )}
    </>
  );
}
