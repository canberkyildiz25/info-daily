import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import readingTime from 'reading-time';
import { CATEGORIES } from './categories';
import { normalizeAuthorName } from './authors';

export { CATEGORIES } from './categories';

const postsDirectory = path.join(process.cwd(), 'content/posts');

/* Kapak görseli olmayan yazı için görsel üretilmez.
   Burada Lorem Picsum vardı: slug'dan bir sayı türetip
   picsum.photos/seed/N adresinden rastgele bir fotoğraf çekiyordu.
   Rastgele kelimesi tam anlamıyla — içerikle hiçbir bağı yok. Bir
   teknoloji sitesinin anasayfasında kaktüs ve otoyol fotoğrafları bu
   yüzden çıkıyordu.

   Alakasız bir fotoğraf, fotoğrafsızlıktan kötüdür: okura yanlış bilgi
   verir ve siteyi otomatik üretilmiş gösterir. Boş dönüyoruz; ArticleCard
   görsel yoksa kategori rengini ve ikonunu çiziyor, ki o en azından
   doğru şeyi söylüyor. */
function defaultCover(): string {
  return '';
}

function slugify(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function addHeadingIds(html: string): string {
  return html.replace(/<h([23])([^>]*)>(.*?)<\/h\1>/gi, (_, level, attrs, inner) => {
    if (/id="/.test(attrs)) return _;
    const id = slugify(inner);
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });
}

export interface Heading { id: string; text: string; level: number; }

export function extractHeadings(html: string): Heading[] {
  return [...html.matchAll(/<h([23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[23]>/gi)].map(m => ({
    level: parseInt(m[1]),
    id: m[2],
    text: m[3].replace(/<[^>]+>/g, ''),
  }));
}

export interface Post {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  updatedAt?: string;
  canonicalUrl?: string;
  author: string;
  coverImage: string;
  readingTime: string;
  tags: string[];
  content?: string;
  noInlineImages?: boolean;
  imagePosition?: string;
  /* Kapak fotoğrafı yazının konusunu birebir göstermiyorsa bunu söyleyen
     kısa alt yazı — örneğin henüz basın görseli olmayan yeni bir cihaz
     için eski bir modelin fotoğrafı kullanıldığında. */
  coverCaption?: string;
  /* Anasayfanın açılışını bu yazı alır. Birden fazla varsa en yenisi.
     Hiçbiri yoksa en yeni yazı. */
  featured?: boolean;
}

export function getAllPosts(): Post[] {
  const posts: Post[] = [];

  for (const category of CATEGORIES) {
    const categoryDir = path.join(postsDirectory, category.slug);
    if (!fs.existsSync(categoryDir)) continue;

    const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.md'));

    for (const file of files) {
      const slug = file.replace(/\.md$/, '');
      const fullPath = path.join(categoryDir, file);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const stats = readingTime(content);

      posts.push({
        slug,
        category: category.slug,
        title: data.title,
        excerpt: data.excerpt,
        date: data.date,
        updatedAt: data.updatedAt,
        canonicalUrl: data.canonicalUrl,
        author: normalizeAuthorName(data.author),
        coverImage: data.coverImage || defaultCover(),
        readingTime: stats.text,
        tags: data.tags || [],
        featured: data.featured === true,
        imagePosition: data.imagePosition,
      });
    }
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter(p => p.category === category);
}

export function getPostsByAuthor(authorName: string): Post[] {
  return getAllPosts().filter(p => p.author === authorName);
}

export async function getPost(category: string, slug: string): Promise<Post | null> {
  const fullPath = path.join(postsDirectory, category, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const stats = readingTime(content);

  const processedContent = await remark().use(remarkHtml).process(content);
  const htmlContent = addHeadingIds(processedContent.toString());

  return {
    slug,
    category,
    title: data.title,
    excerpt: data.excerpt,
    date: data.date,
    updatedAt: data.updatedAt,
    canonicalUrl: data.canonicalUrl,
    author: normalizeAuthorName(data.author),
    coverImage: data.coverImage || defaultCover(),
    readingTime: stats.text,
    tags: data.tags || [],
    content: htmlContent,
    noInlineImages: data.noInlineImages ?? false,
    imagePosition: data.imagePosition,
    coverCaption: data.coverCaption,
  };
}

/* Yazıların gövdesinde bağlantı verilen alan adları.
   Hakkında sayfasındaki "en çok atıf yaptığımız kaynaklar" listesi elle
   yazılmıyor, buradan okunuyor: yazılar değiştikçe liste de değişiyor ve
   sayfa hiçbir zaman içerikte olmayan bir kaynağı iddia etmiyor. Sıralama
   bağlantı sayısına değil, kaç ayrı yazıda geçtiğine göre — tek bir yazıda
   yirmi kez anılan bir kaynak listeyi domine etmesin. */
export function getCitedDomains(limit = 12): { domain: string; guides: number }[] {
  const guides = new Map<string, Set<string>>();
  for (const category of CATEGORIES) {
    const dir = path.join(postsDirectory, category.slug);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir).filter(f => f.endsWith('.md'))) {
      const { content } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
      for (const m of content.matchAll(/https?:\/\/[^\s)"'<>\]]+/g)) {
        let host: string;
        try { host = new URL(m[0]).hostname.replace(/^www\./, ''); } catch { continue; }
        if (/pexels|unsplash|infodaily/.test(host)) continue;
        if (!guides.has(host)) guides.set(host, new Set());
        guides.get(host)!.add(file);
      }
    }
  }
  return [...guides.entries()]
    .map(([domain, set]) => ({ domain, guides: set.size }))
    .sort((a, b) => b.guides - a.guides || a.domain.localeCompare(b.domain))
    .slice(0, limit);
}
