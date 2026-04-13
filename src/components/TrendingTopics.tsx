import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';
import { getCoverImageUrl } from '@/lib/pexels';

interface Topic {
  title: string;
  category: string;
  slug: string;
  exists: boolean;
  image: string;
}

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function getRawTopics() {
  const filePath = path.join(process.cwd(), 'daily-topics.txt');
  if (!fs.existsSync(filePath)) return [];

  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('#'))
    .map(line => {
      const parts = line.split('|');
      if (parts.length < 2) return null;
      const title = parts[0].trim();
      const category = parts[1].trim().toLowerCase();
      const slug = titleToSlug(title);
      const articlePath = path.join(process.cwd(), 'content', 'posts', category, `${slug}.md`);
      return { title, category, slug, exists: fs.existsSync(articlePath) };
    })
    .filter(Boolean) as { title: string; category: string; slug: string; exists: boolean }[];
}

const CAT_ICONS: Record<string, string> = {
  health: '🏥', finance: '💰', technology: '💻', 'life-hacks': '⚡',
  travel: '✈️', food: '🍽️', business: '💼', science: '🔬',
  relationships: '❤️', entertainment: '🎬',
};

const CAT_DOT: Record<string, string> = {
  health: 'bg-emerald-500', finance: 'bg-amber-500', technology: 'bg-blue-500',
  'life-hacks': 'bg-violet-500', travel: 'bg-sky-500', food: 'bg-orange-500',
  business: 'bg-slate-500', science: 'bg-teal-500', relationships: 'bg-rose-500',
  entertainment: 'bg-purple-500',
};

const CAT_BADGE: Record<string, string> = {
  health: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300',
  finance: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300',
  technology: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
  'life-hacks': 'bg-violet-100 dark:bg-violet-900/60 text-violet-700 dark:text-violet-300',
  travel: 'bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300',
  food: 'bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300',
  business: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
  science: 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300',
  relationships: 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300',
  entertainment: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
};

export default async function TrendingTopics() {
  const raw = getRawTopics();
  if (raw.length === 0) return null;

  const topics: Topic[] = await Promise.all(
    raw.map(async t => ({
      ...t,
      image: await getCoverImageUrl(`${t.title} ${t.category}`, t.slug),
    }))
  );

  return (
    <section className="mb-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
        </span>
        <span className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">
          Trending Today
        </span>
        <span className="text-xs text-gray-300 dark:text-slate-600">
          {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
        </span>
      </div>

      {/* 4-column grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {topics.map((topic, i) => {
          const dot = CAT_DOT[topic.category] ?? 'bg-blue-500';
          const badge = CAT_BADGE[topic.category] ?? CAT_BADGE.technology;
          const icon = CAT_ICONS[topic.category] ?? '📰';

          const card = (
            <div
              className="group relative animate-fade-in-up bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 card-hover cursor-pointer"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Square image */}
              <div className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-slate-700">
                <Image
                  src={topic.image}
                  alt={topic.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Blinking live dot */}
                <span className="absolute top-2.5 right-2.5 relative flex h-2.5 w-2.5">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dot} opacity-70`}
                        style={{ animationDuration: `${1.4 + i * 0.25}s` }} />
                  <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${dot}`} />
                </span>

                {/* Category badge on image */}
                <span className={`absolute top-2.5 left-2.5 text-xs font-semibold px-2 py-0.5 rounded-full ${badge}`}>
                  {icon} {topic.category}
                </span>
              </div>

              {/* Title below image */}
              <div className="p-3">
                <p className="text-xs font-semibold text-gray-900 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                  {topic.title}
                </p>
              </div>
            </div>
          );

          const href = topic.exists
            ? `/${topic.category}/${topic.slug}`
            : `/category/${topic.category}`;

          return (
            <Link key={i} href={href}>
              {card}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
