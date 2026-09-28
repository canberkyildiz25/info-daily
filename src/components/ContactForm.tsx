'use client';

import { useForm, ValidationError } from '@formspree/react';

export default function ContactForm() {
  const [state, handleSubmit] = useForm('xqewynvz');

  if (state.succeeded) {
    return (
      <div role="status" className="border-l-2 border-[var(--accent)] pl-5 py-2">
        <h2 className="type-display type-display-m text-[var(--text-base)] mb-2">Message sent</h2>
        <p className="text-[var(--text-muted)]">Thanks for reaching out. We'll get back to you within two business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="type-label block text-[var(--text-muted)] mb-2">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="Your name"
          className="w-full min-h-12 px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-base)] placeholder:text-[var(--text-muted)] text-[0.9375rem] focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--accent)]"
        />
        <ValidationError field="name" prefix="Name" errors={state.errors} className="text-[var(--danger)] text-sm mt-1" />
      </div>

      <div>
        <label htmlFor="email" className="type-label block text-[var(--text-muted)] mb-2">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="your@email.com"
          className="w-full min-h-12 px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-base)] placeholder:text-[var(--text-muted)] text-[0.9375rem] focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--accent)]"
        />
        <ValidationError field="email" prefix="Email" errors={state.errors} className="text-[var(--danger)] text-sm mt-1" />
      </div>

      <div>
        <label htmlFor="subject" className="type-label block text-[var(--text-muted)] mb-2">Subject</label>
        <select
          id="subject"
          name="subject"
          className="w-full min-h-12 px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-base)] placeholder:text-[var(--text-muted)] text-[0.9375rem] focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          <option value="general">General question</option>
          <option value="correction">Article correction</option>
          <option value="partnership">Partnership inquiry</option>
          <option value="contribute">Contribute an article</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="type-label block text-[var(--text-muted)] mb-2">Message</label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          placeholder="Your message..."
          className="w-full min-h-12 px-4 py-3 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-base)] placeholder:text-[var(--text-muted)] text-[0.9375rem] focus:outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--accent)] resize-none"
        />
        <ValidationError field="message" prefix="Message" errors={state.errors} className="text-[var(--danger)] text-sm mt-1" />
      </div>

      {state.errors && !state.succeeded && (
        <ValidationError errors={state.errors} className="text-[var(--danger)] text-sm" />
      )}

      <button
        type="submit"
        disabled={state.submitting}
        className="inline-flex items-center justify-center h-12 px-8 bg-[var(--text-base)] text-[var(--bg-base)] text-[0.9375rem] font-semibold hover:bg-[var(--accent)] active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed transition-[background-color,transform] duration-150"
      >
        {state.submitting ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
