/* remark-html özel karakterleri varlık olarak yazıyor: "&" → "&#x26;".
   HTML'in içinde sorun değil, ama metin oradan çekilip düz metin olarak
   kullanılınca varlık olduğu gibi görünüyor: İçindekiler'de "Sources
   &#x26; References", FAQ verisinde Google'a giden aynı karakterler,
   başlık kimliklerinde "x26". Metne çevirmeden önce çözüyoruz. */
const NAMED: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

export function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isNaN(n) ? match : String.fromCodePoint(n);
    }
    return NAMED[code.toLowerCase()] ?? match;
  });
}
