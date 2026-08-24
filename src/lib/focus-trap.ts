import { useEffect, useRef, useCallback } from 'react';

/**
 * Reusable focus trap hook for dialogs and modals.
 *
 * - Traps keyboard focus within the container when active
 * - Moves focus into the container on activation
 * - Restores focus to the previously focused element on deactivation
 * - Supports Tab and Shift+Tab navigation
 * - Returns a ref to attach to the container element
 */
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    );
  }, []);

  useEffect(() => {
    if (!isActive) return;

    // Store the currently focused element before trap activates
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Find focusable elements within the container
    const focusable = getFocusableElements();
    if (focusable.length === 0) return;

    // Focus the first focusable element
    focusable[0]?.focus();

    // Handle Tab key for focus trapping
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const currentFocusable = getFocusableElements();
      if (currentFocusable.length === 0) return;

      const first = currentFocusable[0];
      const last = currentFocusable[currentFocusable.length - 1];

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

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to the previously focused element
      previousFocusRef.current?.focus();
    };
  }, [isActive, getFocusableElements]);

  return containerRef;
}
