import { useEffect, useRef, useState } from 'react';

interface NavLink {
  label: string;
  href: string;
}

interface Props {
  links: readonly NavLink[];
  dark?: boolean;
}

export default function MobileMenu({ links, dark = false }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) setOpen(false);
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      const focusable = menuRef.current?.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])');
      focusable?.[0]?.focus();
    } else {
      previousFocusRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open || !menuRef.current) return;
    const menu = menuRef.current;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(menu.querySelectorAll<HTMLElement>('a, button, [tabindex]:not([tabindex="-1"])'));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    };
    menu.addEventListener('keydown', handleKeyDown);
    return () => menu.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <div className="bm-mobile-menu lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Close menu' : 'Open menu'}
        className={`bm-mobile-menu__trigger ${dark && !open ? 'bm-mobile-menu__trigger--light' : ''}`}
      >
        <span className="bm-mobile-menu__label">{open ? 'Close' : 'Menu'}</span>
        <span className="bm-mobile-menu__icon" aria-hidden="true">
          <i></i><i></i>
        </span>
      </button>

      {open && (
        <nav
          ref={menuRef}
          id="mobile-nav"
          aria-label="Mobile navigation"
          role="dialog"
          aria-modal="true"
          className="bm-mobile-menu__panel"
        >
          <div className="bm-mobile-menu__eyebrow">BiblicalMeal</div>
          <ul className="bm-mobile-menu__links">
            {links.map((link, index) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setOpen(false)}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {link.label}
                  <b aria-hidden="true">→</b>
                </a>
              </li>
            ))}
          </ul>
          <a href="/#newsletter" onClick={() => setOpen(false)} className="bm-mobile-menu__cta">
            Join the biblical table <span aria-hidden="true">→</span>
          </a>
        </nav>
      )}

      <style>{`
        .bm-mobile-menu__trigger{display:inline-flex;align-items:center;gap:.75rem;height:2.9rem;padding:0 .85rem;border:1px solid rgba(73,55,32,.16);background:rgba(247,242,233,.22);color:#242118;font-family:var(--font-sans,Arial,sans-serif);font-size:.53rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;transition:background .2s ease,border-color .2s ease,color .2s ease}
        .bm-mobile-menu__trigger--light{border-color:rgba(244,238,224,.22);background:rgba(9,15,9,.12);color:#f4eee0}
        .bm-mobile-menu__trigger:hover{border-color:#c49a57;background:rgba(196,154,87,.12)}
        .bm-mobile-menu__icon{display:grid;gap:4px;width:1.2rem}
        .bm-mobile-menu__icon i{display:block;width:100%;height:1px;background:currentColor}
        .bm-mobile-menu__panel{position:fixed;inset:0;z-index:80;display:flex;min-height:100dvh;flex-direction:column;overflow-y:auto;padding:1.5rem 1.5rem 2rem;background:linear-gradient(145deg,#0b110b 0%,#111a10 55%,#182012 100%);color:#f4eee0}
        .bm-mobile-menu__eyebrow{padding-bottom:1.4rem;border-bottom:1px solid rgba(201,167,106,.22);color:#c9a76a;font-family:var(--font-sans,Arial,sans-serif);font-size:.58rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase}
        .bm-mobile-menu__links{margin:2.2rem 0 2rem;padding:0;list-style:none}
        .bm-mobile-menu__links li{border-bottom:1px solid rgba(244,238,224,.12)}
        .bm-mobile-menu__links a{display:grid;grid-template-columns:2.25rem 1fr auto;align-items:center;gap:.5rem;padding:1.1rem 0;color:#f2ebdf;font-family:var(--font-display,Georgia,serif);font-size:clamp(1.65rem,7vw,2.25rem);line-height:1.05;text-decoration:none}
        .bm-mobile-menu__links a span{color:#a98651;font-family:var(--font-sans,Arial,sans-serif);font-size:.55rem;font-weight:700;letter-spacing:.12em}
        .bm-mobile-menu__links a b{color:#c49a57;font-family:var(--font-sans,Arial,sans-serif);font-size:1rem;font-weight:400}
        .bm-mobile-menu__cta{display:flex;align-items:center;justify-content:space-between;gap:1rem;margin-top:auto;padding:1.05rem 1.1rem;border:1px solid rgba(225,195,137,.42);background:rgba(196,154,87,.14);color:#f4e6c9;font-family:var(--font-sans,Arial,sans-serif);font-size:.58rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;text-decoration:none}
        @media (min-width:640px){.bm-mobile-menu__panel{padding:2rem 2.5rem 2.5rem}.bm-mobile-menu__links{max-width:38rem}.bm-mobile-menu__cta{max-width:24rem}}
        @media (prefers-reduced-motion:reduce){.bm-mobile-menu__trigger{transition:none}}
      `}</style>
    </div>
  );
}
