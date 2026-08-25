/**
 * V3C.45D — Book Pagination
 *
 * Splits logical BookPage sections into physical 8:10 book pages.
 * Dense content (recipes) flows across multiple pages.
 * No internal scrolling — content paginates instead.
 *
 * Data flow:
 *   BookPage[] (logical)
 *     → generatePhysicalPages()
 *       → PhysicalPage[] (actual book pages)
 *         → BookReader renders each
 */

import type { BookPage } from './cookbook-book-order';
import { RECIPE_CONTENT_RECORDS } from '../data/recipe-content/records';
import { COOKBOOK_CHAPTERS } from '../data/cookbook/structure';

/** The kind of content on a physical book page. */
export type PhysicalPageType =
  | 'front-matter'
  | 'chapter-opener'
  | 'recipe-hero'
  | 'recipe-cooking'
  | 'recipe-evidence'
  | 'recipe-closing'
  | 'back-matter'
  | 'preview-boundary';

/** A single physical book page — the unit the reader renders. */
export interface PhysicalPage {
  /** Unique ID for this physical page. */
  id: string;
  /** Physical page index (0-based) in the reader. */
  index: number;
  /** What kind of content is on this page. */
  type: PhysicalPageType;
  /** The logical BookPage this belongs to. */
  bookPageId: string;
  /** Display title for this page (for aria-labels, counter). */
  title: string;
  /** Parent chapter title if this is a recipe sub-page. */
  chapterTitle?: string;
  /** Recipe classification if applicable. */
  classification?: string;
  /** Section page number (e.g. page 2 of 4 for a recipe). */
  sectionPage: number;
  /** Total pages for this logical section. */
  sectionTotal: number;
}

const recipeContentById = new Map(RECIPE_CONTENT_RECORDS.map((r) => [r.id, r]));

/** How many physical pages a recipe needs. */
function countRecipePages(recipeId: string): number {
  const recipe = recipeContentById.get(recipeId);
  if (!recipe) return 1;

  let pages = 1; // hero always
  pages += 1; // ingredients + method always
  if (
    recipe.editorialNotes.length > 0 ||
    recipe.historicalContext ||
    recipe.servingGuidance
  ) {
    pages += 1; // evidence/context page
  }
  if (recipe.uncertaintyDisclosure) {
    pages += 1; // closing page
  }
  return pages;
}

/**
 * Generate the physical pages for the entire book preview.
 * Returns a flat array of PhysicalPage objects ready for rendering.
 */
export function generatePhysicalPages(bookPages: BookPage[]): PhysicalPage[] {
  const physical: PhysicalPage[] = [];
  let index = 0;

  for (const bp of bookPages) {
    const pages = splitBookPage(bp);
    for (const p of pages) {
      physical.push({ ...p, index: index++ });
    }
  }

  return physical;
}

/**
 * Generate only the preview physical pages.
 */
export function generatePreviewPhysicalPages(
  previewBookPages: BookPage[],
): PhysicalPage[] {
  return generatePhysicalPages(previewBookPages);
}

/** Split a logical BookPage into one or more physical pages. */
function splitBookPage(bp: BookPage): Omit<PhysicalPage, 'index'>[] {
  switch (bp.kind) {
    case 'front-matter':
      return splitFrontMatter(bp);
    case 'chapter':
      return splitChapter(bp);
    case 'recipe':
      return splitRecipe(bp);
    case 'back-matter':
      return splitBackMatter(bp);
    default:
      return [
        {
          id: bp.id,
          type: 'front-matter',
          bookPageId: bp.id,
          title: bp.title,
          sectionPage: 1,
          sectionTotal: 1,
        },
      ];
  }
}

function splitFrontMatter(bp: BookPage): Omit<PhysicalPage, 'index'>[] {
  // Front matter pages are designed to fit on one physical page.
  return [
    {
      id: bp.id,
      type: 'front-matter',
      bookPageId: bp.id,
      title: bp.title,
      sectionPage: 1,
      sectionTotal: 1,
    },
  ];
}

function splitChapter(bp: BookPage): Omit<PhysicalPage, 'index'>[] {
  return [
    {
      id: bp.id,
      type: 'chapter-opener',
      bookPageId: bp.id,
      title: bp.title,
      sectionPage: 1,
      sectionTotal: 1,
    },
  ];
}

function splitRecipe(bp: BookPage): Omit<PhysicalPage, 'index'>[] {
  const recipe = recipeContentById.get(bp.id);
  if (!recipe) {
    return [
      {
        id: bp.id,
        type: 'recipe-hero',
        bookPageId: bp.id,
        title: bp.title,
        sectionPage: 1,
        sectionTotal: 1,
      },
    ];
  }

  const chapter = bp.chapterId
    ? COOKBOOK_CHAPTERS.find((c) => c.id === bp.chapterId)
    : undefined;
  const chapterTitle = chapter?.title;
  const total = countRecipePages(bp.id);
  let sectionPage = 0;

  const pages: Omit<PhysicalPage, 'index'>[] = [];

  // Page 1: Hero — title, classification, introduction
  pages.push({
    id: `${bp.id}--hero`,
    type: 'recipe-hero',
    bookPageId: bp.id,
    title: recipe.title,
    chapterTitle,
    classification: recipe.classification,
    sectionPage: ++sectionPage,
    sectionTotal: total,
  });

  // Page 2: Ingredients + Method
  pages.push({
    id: `${bp.id}--cooking`,
    type: 'recipe-cooking',
    bookPageId: bp.id,
    title: `${recipe.title} — Recipe`,
    chapterTitle,
    classification: recipe.classification,
    sectionPage: ++sectionPage,
    sectionTotal: total,
  });

  // Page 3: Evidence + Context (if content exists)
  if (
    recipe.editorialNotes.length > 0 ||
    recipe.historicalContext ||
    recipe.servingGuidance
  ) {
    pages.push({
      id: `${bp.id}--evidence`,
      type: 'recipe-evidence',
      bookPageId: bp.id,
      title: `${recipe.title} — Evidence`,
      chapterTitle,
      classification: recipe.classification,
      sectionPage: ++sectionPage,
      sectionTotal: total,
    });
  }

  // Page 4: Uncertainty + Sources (if content exists)
  if (recipe.uncertaintyDisclosure) {
    pages.push({
      id: `${bp.id}--closing`,
      type: 'recipe-closing',
      bookPageId: bp.id,
      title: `${recipe.title} — Notes`,
      chapterTitle,
      classification: recipe.classification,
      sectionPage: ++sectionPage,
      sectionTotal: total,
    });
  }

  return pages;
}

function splitBackMatter(bp: BookPage): Omit<PhysicalPage, 'index'>[] {
  return [
    {
      id: bp.id,
      type: 'back-matter',
      bookPageId: bp.id,
      title: bp.title,
      sectionPage: 1,
      sectionTotal: 1,
    },
  ];
}

/** Get a physical page by its ID. */
export function getPhysicalPageById(
  pages: PhysicalPage[],
  id: string,
): PhysicalPage | undefined {
  return pages.find((p) => p.id === id);
}

/** Get the previous physical page or null. */
export function getPreviousPhysicalPage(
  pages: PhysicalPage[],
  currentIndex: number,
): PhysicalPage | null {
  return currentIndex > 0 ? pages[currentIndex - 1] : null;
}

/** Get the next physical page or null. */
export function getNextPhysicalPage(
  pages: PhysicalPage[],
  currentIndex: number,
): PhysicalPage | null {
  return currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;
}
