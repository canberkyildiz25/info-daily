/* Yazar rozeti.
 *
 * Eskiden burada `/logo.svg` vardı — sitenin tam logosu, "InfoDaily.net"
 * yazısıyla birlikte, 24 veya 40 pikselik bir daireye sıkıştırılıyordu.
 * Sonuç okunmuyordu; küçük boyutta gri bir lekeye dönüyordu.
 *
 * Yerine monogram geldi. Gerekçesi sadece görsel değil: site bir editör
 * masası adına yayın yapıyor, kişi adına değil. Yuvarlak bir portre yuvası
 * orada bir insan varmış gibi okunur; harf rozeti ise ne olduğunu olduğu
 * gibi söyler. Author tipinde zaten kullanılmayan bir `avatarColor` alanı
 * duruyordu — artık işe yarıyor.
 */
import { getAuthorByName } from '@/lib/authors';

interface Props {
  name: string;
  size?: number;
  className?: string;
}

/* İlk iki kelimenin baş harfi: "InfoDaily Editorial Team" → "IE".
   Tek kelimelik bir ad gelirse ilk iki harfini alır. */
function monogram(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export default function AuthorBadge({ name, size = 40, className = '' }: Props) {
  const author = getAuthorByName(name);
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full shrink-0 font-bold text-white select-none ${author?.avatarColor ?? 'bg-[var(--accent)]'} ${className}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
      aria-hidden="true"
    >
      {monogram(name)}
    </span>
  );
}
