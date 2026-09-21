/* Site teknolojiye odaklandı. Dokuz kategori daha vardı — sağlık, finans,
   seyahat, yemek, ilişkiler, eğlence, iş, bilim, yaşam — ve hepsi kaldırıldı.
   Bir teknoloji yayınının bunlar hakkında söyleyecek sahici bir şeyi yoktu,
   Google da 90 gün boyunca hiçbirine tek gösterim vermedi.

   Emoji ikon alanı daha önce kaldırılmıştı: emoji bir ikon seti değil — her
   platformda başka çizilir, optik ağırlıkları tutmaz, currentColor almaz.
   Kategori ikonları components/CategoryIcon.tsx içinde SVG olarak duruyor. */
export const CATEGORIES = [
  { slug: 'technology', label: 'Technology', description: 'Devices, software, security, and how to get more out of both' },
  { slug: 'gaming', label: 'Gaming', description: 'Hardware guides, setups, and games worth your time' },
];
