/**
 * V3C.45C — Book Publication Metadata
 *
 * Canonical metadata for the BiblicalMeal digital cookbook.
 * Reusable by future PDF/EPUB generation.
 *
 * Does NOT duplicate:
 * - Recipe schema ownership
 * - Chapter definition ownership (structure.ts)
 * - Citation/authority ownership
 */

export interface BookMetadata {
  title: string;
  subtitle: string;
  edition: string;
  publisher: string;
  language: string;
  description: string;
  publicationYear: string;
  copyright: string;
  identifier: string;
  /** Reserved for future use — not invented. */
  isbn: string | null;
}

export const BOOK_METADATA: BookMetadata = {
  title: 'Biblical Meals',
  subtitle: 'Recipes Inspired by the Foods of the Bible',
  edition: 'First Edition',
  publisher: 'BiblicalMeal',
  language: 'en',
  description:
    'Evidence-aware recipes inspired by the foods of the Bible, with transparent historical framing and modern adaptations.',
  publicationYear: '2026',
  copyright: '\u00a9 2026 BiblicalMeal. All rights reserved.',
  identifier: 'biblicalmeal-cookbook-v1',
  isbn: null,
};
