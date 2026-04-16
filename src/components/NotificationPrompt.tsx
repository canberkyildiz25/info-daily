'use client';
import { useEffect, useState } from 'react';

type PromptState = 'idle' | 'visible' | 'loading' | 'granted' | 'denied' | 'dismissed';

async function registerAndSubscribe(): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;

  const reg = await navigator.serviceWorker.ready;
  const existing = await reg.pushManager.getSubscription();
  if (existing) return true;

  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
  });

  const res = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription: sub.toJSON() }),
  });
  return res.ok;
}

function urlBase64ToUint8Array(base64String: string): ArrayBuffer {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr.buffer;
}

export default function NotificationPrompt() {
  const [state, setState] = useState<PromptState>('idle');

  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return;
    if (Notification.permission === 'granted' || Notification.permission === 'denied') return;
    if (localStorage.getItem('push-dismissed')) return;

    // Register service worker
    navigator.serviceWorker.register('/sw.js').catch(() => {});

    // Show prompt after 4 seconds
    const t = setTimeout(() => setState('visible'), 4000);
    return () => clearTimeout(t);
  }, []);

  const handleAllow = async () => {
    setState('loading');
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await registerAndSubscribe();
      setState('granted');
      setTimeout(() => setState('idle'), 3000);
    } else {
      setState('denied');
      localStorage.setItem('push-dismissed', '1');
      setTimeout(() => setState('idle'), 2500);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('push-dismissed', '1');
    setState('idle');
  };

  if (state === 'idle') return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-sm animate-fade-in-up">
      {(state === 'visible' || state === 'loading') && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 p-4 flex items-start gap-3">
          {/* Icon */}
          <div className="shrink-0 w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-xl">
            🔔
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">
              Stay in the know
            </p>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              Get notified when a new article drops — no spam, just good reads.
            </p>

            {/* Buttons */}
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleAllow}
                disabled={state === 'loading'}
                className="flex-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold transition-colors"
              >
                {state === 'loading' ? 'Enabling…' : 'Allow notifications'}
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              >
                Not now
              </button>
            </div>
          </div>

          {/* Close */}
          <button
            onClick={handleDismiss}
            className="shrink-0 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Success */}
      {state === 'granted' && (
        <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3">
          <span className="text-xl">✅</span>
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            You&apos;re in! We&apos;ll notify you of new articles.
          </p>
        </div>
      )}

      {/* Denied */}
      {state === 'denied' && (
        <div className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3">
          <span className="text-xl">🔕</span>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            No worries — you can always enable from browser settings.
          </p>
        </div>
      )}
    </div>
  );
}
