import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import readingTime from 'reading-time';
import { CATEGORIES } from './categories';

export { CATEGORIES } from './categories';

const postsDirectory = path.join(process.cwd(), 'content/posts');

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
  author: string;
  coverImage: string;
  readingTime: string;
  tags: string[];
  content?: string;
  noInlineImages?: boolean;
  imagePosition?: string;
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
        author: data.author || 'Editorial Team',
        coverImage: data.coverImage || `/images/${category.slug}-default.jpg`,
        readingTime: stats.text,
        tags: data.tags || [],
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
    author: data.author || 'Editorial Team',
    coverImage: data.coverImage || `/images/${category}-default.jpg`,
    readingTime: stats.text,
    tags: data.tags || [],
    content: htmlContent,
    noInlineImages: data.noInlineImages ?? false,
    imagePosition: data.imagePosition,
  };
}
