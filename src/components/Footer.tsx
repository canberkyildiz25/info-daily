/* Sitenin ne olduğunu söyleyen tek bir cümle, bir satır bağlantı, bülten,
 * yasal satır. Her zaman sahne yüzeyinde: iki yüzeyli sistemde altbilgi
 * için üçüncü bir koyu gri icat etmeye gerek yok. */
import Link from 'next/link';
import SubscribeForm from './SubscribeForm';

const LINKS = [
  { href: '/category/technology', label: 'Technology' },
  { href: '/category/gaming', label: 'Gaming' },
  { href: '/articles', label: 'All guides' },
  { href: '/videos', label: 'Videos' },
  { href: '/about', label: 'About' },
  { href: '/authors', label: 'Editorial standards' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer
      data-surface="stage"
      className="dark mt-24 border-t border-[var(--border)] pb-[calc(var(--bottom-nav-h)+env(safe-area-inset-bottom,0px))] md:pb-0"
    >
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div>
            <p className="type-display type-display-l max-w-[18ch] text-[var(--text-base)]">
              Guides for the hardware and software you already own.
            </p>
            <nav aria-label="Footer" className="mt-10">
              <ul className="flex flex-wrap gap-x-7">
                {LINKS.map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-[0.9375rem] text-[var(--text-muted)] hover:text-[var(--text-base)] transition-colors whitespace-nowrap">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div className="lg:pt-3">
            <SubscribeForm />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-7 gap-y-1 py-6 border-t border-[var(--border)] text-sm text-[var(--text-muted)]">
          <span className="type-display text-lg text-[var(--text-base)] mr-auto">InfoDaily</span>
          <Link href="/privacy-policy" className="inline-flex items-center min-h-11 hover:text-[var(--text-base)] transition-colors">Privacy</Link>
          <Link href="/terms" className="inline-flex items-center min-h-11 hover:text-[var(--text-base)] transition-colors">Terms</Link>
          <span className="tabular-nums">© {new Date().getFullYear()} InfoDaily</span>
        </div>
      </div>
    </footer>
  );
}
