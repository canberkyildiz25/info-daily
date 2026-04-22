'use client';

import { useForm, ValidationError } from '@formspree/react';

export default function ContactForm() {
  const [state, handleSubmit] = useForm('xqewynvz');

  if (state.succeeded) {
    return (
      <div className="rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-8 text-center">
        <div className="text-3xl mb-3">✓</div>
        <h2 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-1">Message sent!</h2>
        <p className="text-green-700 dark:text-green-400 text-sm">Thanks for reaching out. We'll get back to you within two business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Your name"
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <ValidationError field="name" prefix="Name" errors={state.errors} className="text-red-500 text-xs mt-1" />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="your@email.com"
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        />
        <ValidationError field="email" prefix="Email" errors={state.errors} className="text-red-500 text-xs mt-1" />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
        <select
          id="subject"
          name="subject"
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
        >
          <option value="general">General question</option>
          <option value="correction">Article correction</option>
          <option value="partnership">Partnership inquiry</option>
          <option value="contribute">Contribute an article</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder="Your message..."
          className="w-full px-4 py-2.5 border border-gray-300 dark:border-slate-600 dark:bg-slate-800 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
        />
        <ValidationError field="message" prefix="Message" errors={state.errors} className="text-red-500 text-xs mt-1" />
      </div>

      {state.errors && !state.succeeded && (
        <ValidationError errors={state.errors} className="text-red-500 text-sm" />
      )}

      <button
        type="submit"
        disabled={state.submitting}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {state.submitting ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
