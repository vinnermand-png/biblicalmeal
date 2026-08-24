import { describe, expect, it } from 'vitest';
import { generateBookOrder } from './cookbook-book-order';

/**
 * V3C.45D — Book Viewer Tests
 *
 * Tests the preview boundary, page model, and viewer integrity.
 */

/** The canonical preview page IDs (must match BookViewer.astro). */
const PREVIEW_PAGE_IDS = [
  'title-page',
  'introduction',
  'classification-guide',
  'grains-breads',
  'recipe-content-unleavened-bread',
  'recipe-content-barley-bread',
  'recipe-content-wheat-flatbread',
  'legumes-one-pot-meals',
  'recipe-content-lentil-pottage',
];

describe('V3C.45D book viewer preview boundary', () => {
  const bookOrder = generateBookOrder();

  it('preview pages are a subset of the full book order', () => {
    const allIds = new Set(bookOrder.map((p) => p.id));
    for (const id of PREVIEW_PAGE_IDS) {
      expect(allIds.has(id)).toBe(true);
    }
  });

  it('preview pages maintain book order sequence', () => {
    const orderMap = new Map(bookOrder.map((p) => [p.id, p.order]));
    for (let i = 1; i < PREVIEW_PAGE_IDS.length; i++) {
      const prevOrder = orderMap.get(PREVIEW_PAGE_IDS[i - 1]) ?? 0;
      const currOrder = orderMap.get(PREVIEW_PAGE_IDS[i]) ?? 0;
      expect(currOrder).toBeGreaterThan(prevOrder);
    }
  });

  it('preview includes exactly 9 pages', () => {
    expect(PREVIEW_PAGE_IDS).toHaveLength(9);
  });

  it('preview includes front matter, chapters, and recipes', () => {
    const bookOrderMap = new Map(bookOrder.map((p) => [p.id, p.kind]));
    const kinds = PREVIEW_PAGE_IDS.map((id) => bookOrderMap.get(id));
    expect(kinds).toContain('front-matter');
    expect(kinds).toContain('chapter');
    expect(kinds).toContain('recipe');
  });

  it('preview does NOT include back matter pages', () => {
    const bookOrderMap = new Map(bookOrder.map((p) => [p.id, p.kind]));
    for (const id of PREVIEW_PAGE_IDS) {
      expect(bookOrderMap.get(id)).not.toBe('back-matter');
    }
  });

  it('preview stops before the complete book', () => {
    expect(PREVIEW_PAGE_IDS.length).toBeLessThan(bookOrder.length);
  });

  it('the complete book has more pages than preview', () => {
    expect(bookOrder.length).toBeGreaterThan(PREVIEW_PAGE_IDS.length);
  });

  it('preview includes at least 2 chapter openers', () => {
    const bookOrderMap = new Map(bookOrder.map((p) => [p.id, p.kind]));
    const chapterCount = PREVIEW_PAGE_IDS.filter(
      (id) => bookOrderMap.get(id) === 'chapter',
    ).length;
    expect(chapterCount).toBeGreaterThanOrEqual(2);
  });

  it('preview includes at least 3 complete recipes', () => {
    const bookOrderMap = new Map(bookOrder.map((p) => [p.id, p.kind]));
    const recipeCount = PREVIEW_PAGE_IDS.filter(
      (id) => bookOrderMap.get(id) === 'recipe',
    ).length;
    expect(recipeCount).toBeGreaterThanOrEqual(3);
  });
});

describe('V3C.45D viewer component integrity', () => {
  it('preview page IDs are unique', () => {
    expect(new Set(PREVIEW_PAGE_IDS).size).toBe(PREVIEW_PAGE_IDS.length);
  });

  it('preview page IDs are non-empty strings', () => {
    for (const id of PREVIEW_PAGE_IDS) {
      expect(id.length).toBeGreaterThan(0);
      expect(typeof id).toBe('string');
    }
  });
});
