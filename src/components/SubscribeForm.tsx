'use client';

import { useState } from 'react';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('success');
        setMessage('You\'re subscribed! Check your inbox for a welcome email.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
    }
  }

  return (
    <div>
      <h2 className="type-label text-[var(--text-muted)] mb-2">Newsletter</h2>
      <p className="text-[0.9375rem] text-[var(--text-base)] mb-4">New guides in your inbox.</p>

      {status === 'success' ? (
        <p role="status" className="text-sm text-[var(--accent)]">{message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex border border-[var(--border)] focus-within:border-[var(--text-muted)] transition-colors">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            required
            /* min-w-0: flex-1 tek başına yetmiyor. Bir flex öğesinin varsayılan
               asgari genişliği içeriğine göre belirlenir, o yüzden input
               kendini kaptan daha geniş tutup Subscribe butonunu dışarı
               itiyordu — 768px'te sayfa 35px yatay kayıyordu.
               focus-visible halkası da geri geldi: focus:outline-none tek
               başına bırakılmış, yerine sadece kenarlık rengi konmuştu, ki o
               klavyeyle gezen için yeterli bir işaret değil. */
            className="flex-1 min-w-0 h-12 px-4 bg-transparent text-[var(--text-base)] placeholder:text-[var(--text-muted)] text-[0.9375rem] focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--accent)]"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="h-12 px-5 bg-[var(--text-base)] text-[var(--bg-base)] hover:bg-[var(--accent)] text-[0.9375rem] font-semibold transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {status === 'loading' ? 'Sending…' : 'Subscribe'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p role="alert" className="text-[var(--danger)] text-sm mt-2">{message}</p>
      )}
    </div>
  );
}
