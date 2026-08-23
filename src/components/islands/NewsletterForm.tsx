import { useState } from 'react';

type Status = 'idle' | 'error' | 'success';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  if (status === 'success') {
    return (
      <div
        role="status"
        className="rounded-xl border border-olive/40 bg-olive/10 px-6 py-5 text-center"
      >
        <p className="font-display text-h3 text-olive-dark">
          Thank you — you&rsquo;re on the list.
        </p>
        <p className="mt-2 text-caption text-ink-muted">
          Demo form: email delivery will be connected in a later phase.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!EMAIL_PATTERN.test(email.trim())) {
          setStatus('error');
          return;
        }
        setStatus('success');
      }}
      noValidate
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === 'error') setStatus('idle');
          }}
          aria-invalid={status === 'error'}
          aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
          className="w-full flex-1 rounded-full border border-line bg-surface px-5 py-3 text-body text-ink placeholder:text-ink-muted/60 focus:border-olive"
        />
        <button
          type="submit"
          className="rounded-full bg-terracotta px-7 py-3 font-medium text-cream shadow-sm transition-all duration-200 hover:-translate-y-px hover:bg-terracotta-dark"
        >
          Subscribe
        </button>
      </div>
      <p
        id="newsletter-error"
        aria-live="polite"
        className={
          status === 'error'
            ? 'mt-3 px-2 text-caption text-terracotta-dark'
            : 'sr-only'
        }
      >
        {status === 'error' ? 'Please enter a valid email address.' : '\u00A0'}
      </p>
    </form>
  );
}
