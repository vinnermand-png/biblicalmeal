import { describe, expect, it } from 'vitest';
import {
  generateBookOrder,
  getBookPageById,
  getPreviousPage,
  getNextPage,
} from './cookbook-book-order';
import {
  generateRecipeIndex,
  generateIngredientIndex,
  generateScriptureIndex,
} from './cookbook-indexes';

describe('V3C.45C book reading order', () => {
  const order = generateBookOrder();

  it('generates a non-empty reading order', () => {
    expect(order.length).toBeGreaterThan(0);
  });

  it('starts with front matter', () => {
    expect(order[0].kind).toBe('front-matter');
    expect(order[0].id).toBe('title-page');
  });

  it('ends with back matter', () => {
    expect(order[order.length - 1].kind).toBe('back-matter');
    expect(order[order.length - 1].id).toBe('acknowledgments');
  });

  it('has strictly increasing order numbers', () => {
    const orders = order.map((p) => p.order);
    for (let i = 1; i < orders.length; i++) {
      expect(orders[i]).toBeGreaterThan(orders[i - 1]);
    }
  });

  it('contains all six chapters', () => {
    const chapters = order.filter((p) => p.kind === 'chapter');
    expect(chapters).toHaveLength(6);
  });

  it('contains all 9 recipes', () => {
    const recipes = order.filter((p) => p.kind === 'recipe');
    expect(recipes).toHaveLength(9);
  });

  it('contains 6 front matter pages', () => {
    const fm = order.filter((p) => p.kind === 'front-matter');
    expect(fm).toHaveLength(6);
  });

  it('contains 5 back matter pages', () => {
    const bm = order.filter((p) => p.kind === 'back-matter');
    expect(bm).toHaveLength(5);
  });

  it('chapters appear before their recipes', () => {
    const chapterOrders = new Map<string, number>();
    for (const p of order) {
      if (p.kind === 'chapter') chapterOrders.set(p.id, p.order);
    }

    for (const p of order) {
      if (p.kind === 'recipe' && p.chapterId) {
        const chapterOrder = chapterOrders.get(p.chapterId);
        expect(chapterOrder).toBeDefined();
        expect(p.order).toBeGreaterThan(chapterOrder!);
      }
    }
  });

  it('front matter appears before body', () => {
    const lastFM = order.filter((p) => p.kind === 'front-matter').pop();
    const firstChapter = order.find((p) => p.kind === 'chapter');
    expect(lastFM!.order).toBeLessThan(firstChapter!.order);
  });

  it('back matter appears after body', () => {
    const lastRecipe = order.filter((p) => p.kind === 'recipe').pop();
    const firstBM = order.find((p) => p.kind === 'back-matter');
    expect(firstBM!.order).toBeGreaterThan(lastRecipe!.order);
  });

  it('can look up page by ID', () => {
    const page = getBookPageById('title-page');
    expect(page).toBeDefined();
    expect(page?.kind).toBe('front-matter');
  });

  it('returns undefined for unknown ID', () => {
    expect(getBookPageById('nonexistent')).toBeUndefined();
  });

  it('returns null for previous page of first item', () => {
    expect(getPreviousPage('title-page')).toBeNull();
  });

  it('returns null for next page of last item', () => {
    expect(getNextPage('acknowledgments')).toBeNull();
  });

  it('is deterministic', () => {
    const second = generateBookOrder();
    expect(second.length).toBe(order.length);
    for (let i = 0; i < order.length; i++) {
      expect(second[i].id).toBe(order[i].id);
      expect(second[i].order).toBe(order[i].order);
    }
  });
});

describe('V3C.45C recipe index', () => {
  const index = generateRecipeIndex();

  it('returns exactly 9 recipes', () => {
    expect(index).toHaveLength(9);
  });

  it('is sorted alphabetically by title', () => {
    const titles = index.map((e) => e.title);
    const sorted = [...titles].sort((a, b) => a.localeCompare(b));
    expect(titles).toEqual(sorted);
  });

  it('each entry has required fields', () => {
    for (const entry of index) {
      expect(entry.title).toBeTruthy();
      expect(entry.slug).toBeTruthy();
      expect(entry.classification).toBeTruthy();
      expect(entry.chapterTitle).toBeTruthy();
      expect(entry.route).toBeTruthy();
    }
  });

  it('all recipes have valid routes', () => {
    for (const entry of index) {
      expect(entry.route).toMatch(/^\/cookbook\/recipes\/[\w-]+\/$/);
    }
  });
});

describe('V3C.45C ingredient index', () => {
  const index = generateIngredientIndex();

  it('returns a non-empty index', () => {
    expect(index.length).toBeGreaterThan(0);
  });

  it('is sorted alphabetically', () => {
    const labels = index.map((e) => e.label);
    const sorted = [...labels].sort((a, b) => a.localeCompare(b));
    expect(labels).toEqual(sorted);
  });

  it('each ingredient has at least one recipe', () => {
    for (const entry of index) {
      expect(entry.recipes.length).toBeGreaterThan(0);
    }
  });

  it('no duplicate recipes per ingredient', () => {
    for (const entry of index) {
      const routes = entry.recipes.map((r) => r.route);
      expect(new Set(routes).size).toBe(routes.length);
    }
  });
});

describe('V3C.45C scripture index', () => {
  const index = generateScriptureIndex();

  it('returns a non-empty index', () => {
    expect(index.length).toBeGreaterThan(0);
  });

  it('each entry has book and chapter', () => {
    for (const entry of index) {
      expect(entry.book).toBeTruthy();
      expect(entry.chapter).toBeGreaterThan(0);
    }
  });

  it('each entry has at least one recipe', () => {
    for (const entry of index) {
      expect(entry.recipes.length).toBeGreaterThan(0);
    }
  });
});
