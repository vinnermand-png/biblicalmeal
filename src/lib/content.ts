/**
 * Pure content helpers. Must stay free of `astro:content` imports so they
 * remain unit-testable under Vitest.
 */

/**
 * Draft-visibility strategy:
 * - Dev server (`astro dev`) always shows draft/in-review entries as
 *   development previews, clearly badged.
 * - Production builds hide them: listing and detail routes are generated
 *   exclusively from `published` entries.
 * - Opt-in preview builds: set PUBLIC_SHOW_DRAFTS=true to include drafts.
 */
export function draftsPreview(): boolean {
  return (
    import.meta.env.DEV === true ||
    import.meta.env.PUBLIC_SHOW_DRAFTS === 'true'
  );
}

export function isVisible(status: string | undefined): boolean {
  return status === 'published' || draftsPreview();
}

/** Which honesty chip (if any) an entry should display. */
export function statusChip(
  status: string | undefined,
): 'draft' | 'review' | null {
  if (status === 'draft') return 'draft';
  if (status === 'in-review') return 'review';
  return null;
}

/** Estimated reading time in minutes (≈200 wpm), minimum 1. */
export function readingTime(text: string | undefined | null): number {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/** Minutes → ISO 8601 duration (e.g. 45 → "PT45M"). */
export function minutesToISO(minutes: number): string {
  return `PT${minutes}M`;
}

/** Long-form English date, e.g. "August 23, 2026". */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
