/* Bant başlığı: üstte ince çizgi, sıkışık yüzde başlık, küçük etiket,
   sağda altı çizili bağlantı. Anasayfada, dizin sayfalarında ve makale
   altındaki "Read next"te aynı. */
import Link from 'next/link';

export default function SectionHead({ id, title, meta, href, linkLabel }: {
  id: string;
  title: string;
  meta?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-end gap-x-6 gap-y-3 pt-6 border-t border-[var(--border)] mb-10">
      <h2 id={id} className="type-display type-display-l text-[var(--text-base)]">{title}</h2>
      {meta && <span className="type-label text-[var(--text-muted)] pb-1.5 tabular-nums">{meta}</span>}
      {href && linkLabel && (
        <Link
          href={href}
          className="ml-auto pb-1 text-[0.9375rem] font-medium text-[var(--text-base)] underline decoration-[var(--accent)] decoration-2 underline-offset-[6px] hover:text-[var(--accent)] transition-colors whitespace-nowrap"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
