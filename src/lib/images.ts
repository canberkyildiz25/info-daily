/* Pexels adresleri içerikte 940 piksel genişlikle kayıtlı: kart için
   yeterli, tam genişlikte bir kapak için bulanık. Aynı fotoğrafın daha
   geniş sürümünü istiyoruz; next/image oradan cihaza uygun boyutu
   üretiyor. Pexels dışı adresler olduğu gibi döner. */
export function widePexels(url: string, width = 2400): string {
  if (!url || !url.includes('images.pexels.com')) return url;
  try {
    const u = new URL(url);
    u.searchParams.delete('h');
    u.searchParams.set('w', String(width));
    return u.toString();
  } catch {
    return url;
  }
}
