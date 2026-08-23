import { describe, expect, it } from 'vitest';
import { PUBLIC_FOOD_CONTENT } from '../data/content/public';
import { internalLinksFor } from './internal-links';

describe('V3C.9 canonical internal links', () => {
  const figs = PUBLIC_FOOD_CONTENT.find(
    (item) => item.canonicalTargetId === 'figs',
  )!;
  const dates = PUBLIC_FOOD_CONTENT.find(
    (item) => item.canonicalTargetId === 'dates',
  )!;

  it('links published public content through canonical URLs', () => {
    expect(internalLinksFor(figs, PUBLIC_FOOD_CONTENT)).toContainEqual(
      expect.objectContaining({ id: dates.id, href: dates.canonicalPath }),
    );
    expect(internalLinksFor(dates, PUBLIC_FOOD_CONTENT)).toContainEqual(
      expect.objectContaining({ id: figs.id, href: figs.canonicalPath }),
    );
  });

  it('does not link a page to itself and deduplicates canonical URLs', () => {
    const links = internalLinksFor(figs, PUBLIC_FOOD_CONTENT);
    expect(links.some((link) => link.id === figs.id)).toBe(false);
    expect(new Set(links.map((link) => link.href)).size).toBe(links.length);
  });

  it('excludes draft-only and unpublished content from public linking', () => {
    const draftOnly = {
      ...figs,
      id: 'content-olives-test',
      canonicalTargetId: 'olives',
      canonicalPath: '/ingredients/olives/',
      publicationStatus: 'draft' as const,
      workflowStatus: 'research-in-progress' as const,
      seo: { ...figs.seo, indexable: false },
    };

    expect(internalLinksFor(figs, [figs, dates, draftOnly])).not.toContainEqual(
      expect.objectContaining({ id: draftOnly.id }),
    );
    expect(internalLinksFor(draftOnly, [figs, dates])).toEqual([]);
  });

  it('keeps V3C.7 and V3C.8 public inputs intact', () => {
    expect(PUBLIC_FOOD_CONTENT.map((item) => item.canonicalTargetId).sort()).toEqual([
      'dates',
      'figs',
    ]);
    expect(PUBLIC_FOOD_CONTENT.every((item) => item.seo.schemaEligible)).toBe(true);
  });
});
