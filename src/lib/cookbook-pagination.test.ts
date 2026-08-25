/**
 * V3C.45D — Cookbook Pagination Tests
 *
 * Tests for the physical page generation system.
 */

import { describe, it, expect } from 'vitest';
import {
  generatePhysicalPages,
  generatePreviewPhysicalPages,
  getPreviousPhysicalPage,
  getNextPhysicalPage,
} from './cookbook-pagination';
import { generateBookOrder } from './cookbook-book-order';

describe('cookbook-pagination', () => {
  describe('generatePhysicalPages', () => {
    it('expands logical pages into physical pages', () => {
      const bookPages = generateBookOrder();
      const physical = generatePhysicalPages(bookPages);
      // Should have more physical pages than logical (recipes expand)
      expect(physical.length).toBeGreaterThan(bookPages.length);
    });

    it('each physical page has a unique id', () => {
      const bookPages = generateBookOrder();
      const physical = generatePhysicalPages(bookPages);
      const ids = physical.map((p) => p.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('physical pages have sequential indices', () => {
      const bookPages = generateBookOrder();
      const physical = generatePhysicalPages(bookPages);
      physical.forEach((p, i) => {
        expect(p.index).toBe(i);
      });
    });

    it('recipe pages expand to multiple physical pages', () => {
      const bookPages = generateBookOrder();
      const recipePages = bookPages.filter((bp) => bp.kind === 'recipe');
      const physical = generatePhysicalPages(bookPages);

      for (const recipePage of recipePages) {
        const recipePhysicals = physical.filter(
          (p) => p.bookPageId === recipePage.id,
        );
        expect(recipePhysicals.length).toBeGreaterThanOrEqual(2);
      }
    });

    it('recipe hero page type exists for each recipe', () => {
      const bookPages = generateBookOrder();
      const physical = generatePhysicalPages(bookPages);
      const recipePages = bookPages.filter((bp) => bp.kind === 'recipe');

      for (const recipePage of recipePages) {
        const hero = physical.find(
          (p) => p.bookPageId === recipePage.id && p.type === 'recipe-hero',
        );
        expect(hero).toBeDefined();
      }
    });

    it('recipe cooking page type exists for each recipe', () => {
      const bookPages = generateBookOrder();
      const physical = generatePhysicalPages(bookPages);
      const recipePages = bookPages.filter((bp) => bp.kind === 'recipe');

      for (const recipePage of recipePages) {
        const cooking = physical.find(
          (p) => p.bookPageId === recipePage.id && p.type === 'recipe-cooking',
        );
        expect(cooking).toBeDefined();
      }
    });

    it('chapter pages produce one physical page each', () => {
      const bookPages = generateBookOrder();
      const chapterPages = bookPages.filter((bp) => bp.kind === 'chapter');
      const physical = generatePhysicalPages(bookPages);

      for (const chapterPage of chapterPages) {
        const chapterPhysicals = physical.filter(
          (p) => p.bookPageId === chapterPage.id,
        );
        expect(chapterPhysicals.length).toBe(1);
        expect(chapterPhysicals[0].type).toBe('chapter-opener');
      }
    });

    it('front matter pages produce one physical page each', () => {
      const bookPages = generateBookOrder();
      const frontMatterPages = bookPages.filter(
        (bp) => bp.kind === 'front-matter',
      );
      const physical = generatePhysicalPages(bookPages);

      for (const fmPage of frontMatterPages) {
        const fmPhysicals = physical.filter((p) => p.bookPageId === fmPage.id);
        expect(fmPhysicals.length).toBe(1);
        expect(fmPhysicals[0].type).toBe('front-matter');
      }
    });

    it('back matter pages produce one physical page each', () => {
      const bookPages = generateBookOrder();
      const backMatterPages = bookPages.filter(
        (bp) => bp.kind === 'back-matter',
      );
      const physical = generatePhysicalPages(backMatterPages);

      for (const bmPage of backMatterPages) {
        const bmPhysicals = physical.filter((p) => p.bookPageId === bmPage.id);
        expect(bmPhysicals.length).toBe(1);
        expect(bmPhysicals[0].type).toBe('back-matter');
      }
    });

    it('section page numbers are correct for recipes', () => {
      const bookPages = generateBookOrder();
      const physical = generatePhysicalPages(bookPages);
      const recipePage = bookPages.find(
        (bp) => bp.id === 'recipe-content-unleavened-bread',
      );
      expect(recipePage).toBeDefined();

      const recipePhysicals = physical
        .filter((p) => p.bookPageId === recipePage!.id)
        .sort((a, b) => a.sectionPage - b.sectionPage);

      expect(recipePhysicals.length).toBeGreaterThanOrEqual(2);
      expect(recipePhysicals[0].sectionPage).toBe(1);
      expect(recipePhysicals[0].sectionTotal).toBe(recipePhysicals.length);
      recipePhysicals.forEach((p, i) => {
        expect(p.sectionPage).toBe(i + 1);
        expect(p.sectionTotal).toBe(recipePhysicals.length);
      });
    });
  });

  describe('generatePreviewPhysicalPages', () => {
    it('generates preview physical pages from preview book pages', () => {
      const bookPages = generateBookOrder();
      const previewBookPages = bookPages.slice(0, 9); // first 9 logical pages
      const preview = generatePreviewPhysicalPages(previewBookPages);
      expect(preview.length).toBeGreaterThan(9);
    });

    it('preview pages have sequential indices starting at 0', () => {
      const bookPages = generateBookOrder();
      const previewBookPages = bookPages.slice(0, 9);
      const preview = generatePreviewPhysicalPages(previewBookPages);
      expect(preview[0].index).toBe(0);
      expect(preview[preview.length - 1].index).toBe(preview.length - 1);
    });
  });

  describe('getPreviousPhysicalPage / getNextPhysicalPage', () => {
    it('returns null for first page previous', () => {
      const bookPages = generateBookOrder();
      const physical = generatePhysicalPages(bookPages);
      expect(getPreviousPhysicalPage(physical, 0)).toBeNull();
    });

    it('returns null for last page next', () => {
      const bookPages = generateBookOrder();
      const physical = generatePhysicalPages(bookPages);
      expect(getNextPhysicalPage(physical, physical.length - 1)).toBeNull();
    });

    it('returns correct previous and next', () => {
      const bookPages = generateBookOrder();
      const physical = generatePhysicalPages(bookPages);
      const prev = getPreviousPhysicalPage(physical, 3);
      const next = getNextPhysicalPage(physical, 3);
      expect(prev?.index).toBe(2);
      expect(next?.index).toBe(4);
    });
  });

  describe('deterministic output', () => {
    it('produces the same physical pages on every call', () => {
      const bookPages = generateBookOrder();
      const first = generatePhysicalPages(bookPages);
      const second = generatePhysicalPages(bookPages);
      expect(first).toEqual(second);
    });
  });
});
