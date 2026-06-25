import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';
import Anthropic from '@anthropic-ai/sdk';

interface Props {
  searchParams: Promise<{
    title?: string;
    desc?: string;
    img?: string;
    src?: string;
    url?: string;
    at?: string;
    ct?: string; // truncated content from NewsAPI
  }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const p = await searchParams;
  return {
    title: p.title ? `${p.title} — InfoDaily` : 'News — InfoDaily',
    description: p.desc ?? 'Breaking news and top stories on InfoDaily.',
    openGraph: p.img ? { images: [p.img] } : undefined,
  };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins} minutes ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs} hours ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

function stripNewsApiTruncation(content: string): string {
  // NewsAPI truncates content with "[+XXXX chars]" — remove that suffix
  return content.replace(/\s*\[\+\d+ chars\]$/, '').trim();
}

const expandNewsArticle = unstable_cache(
  async (title: string, description: string, truncatedContent: string | null, source: string): Promise<string> => {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return '';

    const client = new Anthropic({ apiKey });
    const context = [
      description,
      truncatedContent ? stripNewsApiTruncation(truncatedContent) : null,
    ].filter(Boolean).join('\n\n');

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1200,
      messages: [{
        role: 'user',
        content: `You are a professional news journalist. Based on the headline and summary below, write a comprehensive news article of 450–650 words.

Headline: ${title}
Source: ${source}
Known information: ${context}

Guidelines:
- Journalistic, factual, third-person style
- Strong opening paragraph (the most important fact first)
- 4–5 body paragraphs that expand context, background, and implications
- Do NOT fabricate specific quotes, names, or statistics not implied by the summary
- Do NOT include the headline as a heading — start directly with the article body
- Plain paragraphs only, no markdown headers or bullet points`,
      }],
    });

    return (message.content[0] as { text: string }).text;
  },
  ['news-expand-v1'],
  { revalidate: 86400 } // cache 24 hours per article
);

export default async function NewsPage({ searchParams }: Props) {
  const p = await searchParams;

  if (!p.title) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-[var(--text-muted)]">No article found.</p>
        <Link href="/" className="mt-4 inline-block text-[var(--accent)] font-bold hover:underline">← Back to Home</Link>
      </div>
    );
  }

  const publishedAt = p.at ? timeAgo(p.at) : null;

  // Expand the article with AI (cached per title)
  const expandedContent = await expandNewsArticle(
    p.title,
    p.desc ?? '',
    p.ct ?? null,
    p.src ?? 'the source'
  );

  const paragraphs = expandedContent
    ? expandedContent.split('\n\n').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Back link */}
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-8 group">
        <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to News
      </Link>

      {/* Source + time */}
      <div className="flex items-center gap-3 mb-4">
        {p.src && (
          <span className="text-xs font-black uppercase tracking-widest text-[var(--accent)] bg-[var(--accent-light)] px-2.5 py-1 rounded-full">
            {p.src}
          </span>
        )}
        {publishedAt && (
          <span className="text-xs text-[var(--text-muted)]">{publishedAt}</span>
        )}
        <span className="flex items-center gap-1 text-[10px] font-bold text-red-500 uppercase tracking-widest ml-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse inline-block" />
          Live News
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[var(--text-base)] leading-tight mb-6" style={{ fontFamily: 'Georgia, serif' }}>
        {p.title}
      </h1>

      {/* Hero image */}
      {p.img && (
        <div className="relative w-full rounded-2xl overflow-hidden mb-8" style={{ height: '400px' }}>
          <Image
            src={p.img}
            alt={p.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            unoptimized
            priority
          />
        </div>
      )}

      {/* AI-expanded article body */}
      {paragraphs.length > 0 ? (
        <div className="prose prose-lg max-w-none mb-10">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-base sm:text-lg leading-relaxed text-[var(--text-base)] mb-5">
              {para}
            </p>
          ))}
        </div>
      ) : p.desc ? (
        <div className="prose prose-lg max-w-none mb-10">
          <p className="text-lg leading-relaxed text-[var(--text-muted)]">{p.desc}</p>
        </div>
      ) : null}

      {/* AI disclosure */}
      <p className="text-[11px] text-[var(--text-muted)] italic mb-8 border-l-2 border-[var(--border)] pl-3">
        This summary was expanded by AI based on the original article headline and description. For the full, authoritative story visit the source below.
      </p>

      {/* Read original CTA */}
      {p.url && (
        <div className="border border-[var(--border)] rounded-2xl p-6 bg-[var(--bg-card)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-[var(--text-base)] mb-1">Read the original story</p>
            <p className="text-xs text-[var(--text-muted)]">
              Originally published by <strong>{p.src ?? 'the source'}</strong>.
            </p>
          </div>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 bg-[var(--accent)] text-white text-sm font-black px-5 py-3 rounded-xl hover:opacity-90 transition-opacity uppercase tracking-wide"
          >
            Full Story
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      )}

      {/* Related categories */}
      <div className="mt-12 pt-8 border-t border-[var(--border)]">
        <p className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-4">More from InfoDaily</p>
        <div className="flex flex-wrap gap-3">
          {['health', 'technology', 'finance', 'travel', 'food'].map(cat => (
            <Link
              key={cat}
              href={`/category/${cat}`}
              className="px-4 py-2 rounded-full border border-[var(--border)] text-sm font-semibold text-[var(--text-muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors capitalize"
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
