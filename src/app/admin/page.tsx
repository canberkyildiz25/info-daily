'use client';
import { useState } from 'react';

const CATEGORIES = [
  { slug: 'health', label: '🏥 Health & Wellness' },
  { slug: 'finance', label: '💰 Personal Finance' },
  { slug: 'technology', label: '💻 Technology' },
  { slug: 'life-hacks', label: '⚡ Life Hacks' },
  { slug: 'travel', label: '✈️ Travel' },
  { slug: 'food', label: '🍽️ Food & Recipes' },
  { slug: 'business', label: '💼 Business & Career' },
  { slug: 'science', label: '🔬 Science & Nature' },
  { slug: 'relationships', label: '❤️ Relationships' },
];

// Quick-generate suggestions per category
const SUGGESTIONS: Record<string, string[]> = {
  health: ['10 Signs You Need More Sleep', 'How to Lower Cortisol Naturally', 'Best Vitamins for Energy'],
  finance: ['How to Build an Emergency Fund', '7 Money Habits of Millionaires', 'Best High-Yield Savings Accounts 2025'],
  technology: ['How to Use AI to Boost Productivity', 'Best Password Managers 2025', 'How to Speed Up Your Wi-Fi'],
  'life-hacks': ['How to Stop Procrastinating for Good', '10 Morning Habits That Change Everything', 'How to Learn Any Skill Fast'],
  travel: ['How to Travel Cheap in Europe', 'Best Travel Credit Cards 2025', '10 Things to Know Before Visiting Japan'],
  food: ['Easy High-Protein Meals for Busy People', '10 Foods That Boost Your Immune System', 'How to Meal Prep for the Week'],
  business: ['How to Start Freelancing in 2025', '10 Habits of Highly Productive Entrepreneurs', 'How to Network Like a Pro'],
  science: ['How Your Brain Changes When You Exercise', 'Why You Dream: The Science Explained', '10 Amazing Facts About the Universe'],
  relationships: ['How to Set Healthy Boundaries', '10 Ways to Improve Communication in Any Relationship', 'How to Make Friends as an Adult'],
};

interface Result {
  success: boolean;
  title: string;
  url?: string;
  path?: string;
  error?: string;
}

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [authed, setAuthed] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('health');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [batchText, setBatchText] = useState('');
  const [tab, setTab] = useState<'single' | 'batch' | 'auto'>('single');
  const [autoCount, setAutoCount] = useState(2);
  const [calendarStats, setCalendarStats] = useState<{ total: number; done: number; remaining: number } | null>(null);

  async function callGenerate(t: string, cat: string): Promise<Result> {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': secret,
      },
      body: JSON.stringify({ title: t, category: cat }),
    });
    const data = await res.json();
    return { success: res.ok, title: t, ...data };
  }

  async function handleSingle(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    const result = await callGenerate(title.trim(), category);
    setResults(prev => [result, ...prev]);
    if (result.success) setTitle('');
    setLoading(false);
  }

  async function handleAuto(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`/api/cron/generate?count=${autoCount}`, {
      headers: { authorization: `Bearer ${secret}` },
    });
    const data = await res.json();
    if (data.calendar) setCalendarStats(data.calendar);
    const newResults = (data.generated || []).map((g: { title: string; url?: string; path?: string }) => ({
      success: true, ...g,
    }));
    const failed = (data.skipped || []).map((s: string) => ({ success: false, title: s, error: s }));
    setResults(prev => [...newResults, ...failed, ...prev]);
    setLoading(false);
  }

  async function handleBatch(e: React.FormEvent) {
    e.preventDefault();
    const lines = batchText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('#') && l.includes('|'));

    if (lines.length === 0) return;
    setLoading(true);

    for (const line of lines) {
      const [t, cat] = line.split('|').map(s => s.trim());
      if (!t || !cat) continue;
      const result = await callGenerate(t, cat);
      setResults(prev => [result, ...prev]);
    }
    setLoading(false);
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 w-full max-w-sm border border-gray-100 dark:border-slate-700">
          <h1 className="text-2xl font-black text-gray-900 dark:text-slate-100 mb-1">Admin Panel</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">Enter the admin secret to continue</p>
          <form onSubmit={e => { e.preventDefault(); setAuthed(true); }}>
            <input
              type="password"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              placeholder="Admin secret..."
              className="w-full border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              autoFocus
            />
            <button
              type="submit"
              disabled={!secret}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-50"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-slate-100">Article Generator</h1>
          <p className="text-gray-500 dark:text-slate-400 text-sm mt-1">Powered by Claude claude-opus-4-6</p>
        </div>
        <button
          onClick={() => setAuthed(false)}
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-slate-800 rounded-xl p-1 mb-6 w-fit">
        {(['single', 'batch', 'auto'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t
                ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 shadow-sm'
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
            }`}
          >
            {t === 'single' ? 'Single Article' : t === 'batch' ? 'Batch Generate' : '🤖 Auto (Calendar)'}
          </button>
        ))}
      </div>

      {tab === 'single' ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 mb-6">
          <form onSubmit={handleSingle} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Article Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. 10 Ways to Save Money Every Month"
                className="w-full border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {CATEGORIES.map(c => (
                  <option key={c.slug} value={c.slug}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Suggestions */}
            <div>
              <p className="text-xs text-gray-400 dark:text-slate-500 mb-2">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {(SUGGESTIONS[category] || []).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTitle(s)}
                    className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating... (30-60s)
                </>
              ) : (
                '✨ Generate Article'
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 mb-6">
          <form onSubmit={handleBatch} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                Article List <span className="font-normal text-gray-400">(one per line: title | category)</span>
              </label>
              <textarea
                value={batchText}
                onChange={e => setBatchText(e.target.value)}
                rows={8}
                placeholder={`How to Start Investing | finance\n10 Foods That Boost Energy | health\nBest Laptops for Students 2025 | technology\nHow to Meal Prep for the Week | food`}
                className="w-full border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-slate-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !batchText.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating batch...
                </>
              ) : (
                '🚀 Generate All'
              )}
            </button>
          </form>
        </div>
      )}

      {tab === 'auto' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6 mb-6">
          {calendarStats && (
            <div className="flex gap-4 mb-6">
              {[
                { label: 'Total', value: calendarStats.total, color: 'text-gray-700 dark:text-slate-300' },
                { label: 'Done', value: calendarStats.done, color: 'text-green-600 dark:text-green-400' },
                { label: 'Remaining', value: calendarStats.remaining, color: 'text-blue-600 dark:text-blue-400' },
              ].map(s => (
                <div key={s.label} className="flex-1 bg-gray-50 dark:bg-slate-700 rounded-xl p-4 text-center">
                  <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleAuto} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">
                Articles to generate now
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setAutoCount(n)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors border ${
                      autoCount === n
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300 border-gray-200 dark:border-slate-600 hover:border-blue-400'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 dark:text-slate-500 mt-2">
                Articles are picked from the content calendar in order. Already-generated ones are skipped automatically.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating {autoCount} article{autoCount > 1 ? 's' : ''}...
                </>
              ) : (
                `🤖 Generate Next ${autoCount} Article${autoCount > 1 ? 's' : ''}`
              )}
            </button>
          </form>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-600 dark:text-slate-400 uppercase tracking-wider">Results</h2>
          {results.map((r, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-4 rounded-xl border ${
                r.success
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
              }`}
            >
              <span className="text-lg flex-shrink-0">{r.success ? '✅' : '❌'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-slate-100 truncate">{r.title}</p>
                {r.success ? (
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs text-gray-500 dark:text-slate-400">{r.path}</p>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View →
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">{r.error}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
