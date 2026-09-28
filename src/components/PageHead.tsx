/* Liste ve bilgi sayfalarının başlığı — design.md § Macrostructure,
   Index-First. Küçük bir etiket, sıkışık yüzde büyük başlık, bir satırlık
   giriş. Sayfalar arasında aynı: bir sayfadan ötekine geçince yalnızca
   içerik değişiyor. */
import Link from 'next/link';

export default function PageHead({
  label,
  labelHref,
  title,
  intro,
  children,
  size = 'xl',
}: {
  label?: string;
  labelHref?: string;
  title: string;
  intro?: React.ReactNode;
  children?: React.ReactNode;
  size?: 'xl' | 'l';
}) {
  return (
    <header className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-20 pb-10 sm:pb-14">
      {label && (
        labelHref
          ? <Link href={labelHref} className="type-label text-[var(--accent)] hover:text-[var(--text-base)] transition-colors">{label}</Link>
          : <p className="type-label text-[var(--accent)]">{label}</p>
      )}
      <h1 className={`type-display ${size === 'xl' ? 'type-display-xl' : 'type-display-l'} mt-4 max-w-[18ch] text-[var(--text-base)]`}>
        {title}
      </h1>
      {intro && (
        <p className="mt-6 max-w-[52ch] text-lg sm:text-xl leading-relaxed text-[var(--text-muted)]">{intro}</p>
      )}
      {children}
    </header>
  );
}
