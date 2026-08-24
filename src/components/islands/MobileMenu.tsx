import { useEffect, useRef, useState } from 'react';

interface NavLink {
  label: string;
  href: string;
}

interface Props {
  links: readonly NavLink[];
}

export default function MobileMenu({ links }: Props) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // V3C.39: Handle Escape key to close menu
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [open]);

  // V3C.39: Body scroll locking when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // V3C.39: Focus management when menu opens/closes
  useEffect(() => {
    if (open) {
      // Store current focus for restoration
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Find focusable elements in menu
      const menu = menuRef.current;
      if (menu) {
        const focusable = menu.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])',
        );
        // Focus first link
        focusable[0]?.focus();
      }
    } else {
      // Restore focus to trigger button when menu closes
      previousFocusRef.current?.focus();
    }
  }, [open]);

  // V3C.39: Focus trap when menu is open
  useEffect(() => {
    if (!open) return;

    const menu = menuRef.current;
    if (!menu) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = Array.from(
        menu.querySelectorAll<HTMLElement>(
          'a, button, [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        // Shift+Tab: If at first element, wrap to last
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        // Tab: If at last element, wrap to first
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    menu.addEventListener('keydown', handleKeyDown);
    return () => menu.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Close menu' : 'Open menu'}
        className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-olive/10"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          className="h-6 w-6"
          aria-hidden="true"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open && (
        <nav
          ref={menuRef}
          id="mobile-nav"
          aria-label="Mobile navigation"
          role="dialog"
          aria-modal="true"
          className="fixed inset-x-0 top-16 z-40 border-b border-line bg-background px-5 pt-2 pb-8 shadow-lg"
        >
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line/70 py-4 font-display text-xl text-ink transition-colors hover:text-terracotta-dark"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="/#newsletter"
            onClick={() => setOpen(false)}
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-terracotta px-5 py-3 font-medium text-cream transition-colors hover:bg-terracotta-dark"
          >
            Newsletter
          </a>
        </nav>
      )}
    </div>
  );
}
