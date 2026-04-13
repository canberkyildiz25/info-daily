import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';

interface Topic {
  title: string;
  category: string;
  slug: string;
  exists: boolean;
}

function titleToSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function getTopics(): Topic[] {
  const filePath = path.join(process.cwd(), 'daily-topics.txt');
  if (!fs.existsSync(filePath)) return [];

  const lines = fs.readFileSync(filePath, 'utf8').split('\n');
  const topics: Topic[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const parts = trimmed.split('|');
    if (parts.length < 2) continue;

    const title = parts[0].trim();
    const category = parts[1].trim().toLowerCase();
    const slug = titleToSlug(title);
    const articlePath = path.join(process.cwd(), 'content', 'posts', category, `${slug}.md`);
    const exists = fs.existsSync(articlePath);

    topics.push({ title, category, slug, exists });
  }

  return topics;
}

const CAT_ICONS: Record<string, string> = {
  health: '🏥', finance: '💰', technology: '💻', 'life-hacks': '⚡',
  travel: '✈️', food: '🍽️', business: '💼', science: '🔬',
  relationships: '❤️', entertainment: '🎬',
};

const CAT_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  health:        { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800', dot: 'bg-emerald-500' },
  finance:       { bg: 'bg-amber-50 dark:bg-amber-950/40',    text: 'text-amber-700 dark:text-amber-300',    border: 'border-amber-200 dark:border-amber-800',    dot: 'bg-amber-500' },
  technology:    { bg: 'bg-blue-50 dark:bg-blue-950/40',      text: 'text-blue-700 dark:text-blue-300',      border: 'border-blue-200 dark:border-blue-800',      dot: 'bg-blue-500' },
  'life-hacks':  { bg: 'bg-violet-50 dark:bg-violet-950/40',  text: 'text-violet-700 dark:text-violet-300',  border: 'border-violet-200 dark:border-violet-800',  dot: 'bg-violet-500' },
  travel:        { bg: 'bg-sky-50 dark:bg-sky-950/40',        text: 'text-sky-700 dark:text-sky-300',        border: 'border-sky-200 dark:border-sky-800',        dot: 'bg-sky-500' },
  food:          { bg: 'bg-orange-50 dark:bg-orange-950/40',  text: 'text-orange-700 dark:text-orange-300',  border: 'border-orange-200 dark:border-orange-800',  dot: 'bg-orange-500' },
  business:      { bg: 'bg-slate-50 dark:bg-slate-800/60',    text: 'text-slate-700 dark:text-slate-300',    border: 'border-slate-200 dark:border-slate-700',    dot: 'bg-slate-500' },
  science:       { bg: 'bg-teal-50 dark:bg-teal-950/40',      text: 'text-teal-700 dark:text-teal-300',      border: 'border-teal-200 dark:border-teal-800',      dot: 'bg-teal-500' },
  relationships: { bg: 'bg-rose-50 dark:bg-rose-950/40',      text: 'text-rose-700 dark:text-rose-300',      border: 'border-rose-200 dark:border-rose-800',      dot: 'bg-rose-500' },
  entertainment: { bg: 'bg-purple-50 dark:bg-purple-950/40',  text: 'text-purple-700 dark:text-purple-300',  border: 'border-purple-200 dark:border-purple-800',  dot: 'bg-purple-500' },
};

export default function TrendingTopics() {
  const topics = getTopics();
  if (topics.length === 0) return null;

  return (
    <section className="mb-8">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-3">
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

      {/* Topic cards */}
      <div className="flex flex-wrap gap-2">
        {topics.map((topic, i) => {
          const colors = CAT_COLORS[topic.category] ?? CAT_COLORS.technology;
          const icon = CAT_ICONS[topic.category] ?? '📰';

          const card = (
            <div
              className={`group flex items-start gap-2 px-3 py-2 rounded-xl border ${colors.bg} ${colors.border} max-w-xs animate-fade-in-up`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Blinking live dot */}
              <span className="relative flex h-2 w-2 mt-1.5 flex-shrink-0">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${colors.dot} opacity-60`} style={{ animationDuration: `${1.5 + i * 0.3}s` }} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${colors.dot}`} />
              </span>
              <div className="min-w-0">
                <div className={`text-xs font-semibold mb-0.5 ${colors.text} flex items-center gap-1`}>
                  <span>{icon}</span>
                  <span className="capitalize">{topic.category}</span>
                </div>
                <p className={`text-xs font-medium text-gray-800 dark:text-slate-200 leading-snug line-clamp-2 ${topic.exists ? 'group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors' : ''}`}>
                  {topic.title}
                </p>
              </div>
            </div>
          );

          if (topic.exists) {
            return (
              <Link key={i} href={`/${topic.category}/${topic.slug}`} className="block">
                {card}
              </Link>
            );
          }

          return <div key={i}>{card}</div>;
        })}
      </div>
    </section>
  );
}
