/**
 * V3C.45C — Book Reading Order
 *
 * Generates the deterministic reading order for the BiblicalMeal cookbook
 * from canonical data sources. No duplicate registries.
 *
 * Data flow:
 *   COOKBOOK_CHAPTERS + COOKBOOK_RECIPE_INCLUSIONS + FRONT_MATTER + BACK_MATTER
 *     → BookPage[]
 *       → renderers (web, PDF, EPUB)
 */

import {
  COOKBOOK_CHAPTERS,
  FRONT_MATTER,
  BACK_MATTER,
} from '../data/cookbook/structure';
import { COOKBOOK_RECIPE_INCLUSIONS } from '../data/cookbook-production/records';
import { RECIPE_CONTENT_RECORDS } from '../data/recipe-content/records';

export type BookPageKind =
  'front-matter' | 'chapter' | 'recipe' | 'back-matter';

export interface BookPage {
  order: number;
  kind: BookPageKind;
  id: string;
  title: string;
  /** Web route if publicly rendered. */
  route?: string;
  /** Parent chapter for recipe pages. */
  chapterId?: string;
}

/** Map section IDs to chapter IDs. Reused from cookbook.ts logic. */
const SECTION_TO_CHAPTER: Record<string, string> = {
  'cookbook-section-simple-preparations': 'legumes-one-pot-meals',
  'cookbook-section-breads-and-grains': 'grains-breads',
  'cookbook-section-seafood-preparations': 'fish-seafood',
  'cookbook-section-fruits-and-preserves': 'fruits-preserves',
  'cookbook-section-herbs-oils-seasonings': 'herbs-oils-seasonings',
  'cookbook-section-feasts-and-gatherings': 'feasts-gatherings',
};

/** Front matter routes by ID. */
const FRONT_MATTER_ROUTES: Record<string, string> = {
  'title-page': '/cookbook/title/',
  'copyright-disclaimer': '/cookbook/copyright/',
  introduction: '/cookbook/introduction/',
  methodology: '/cookbook/methodology/',
  'how-to-use': '/cookbook/how-to-use/',
  'classification-guide': '/cookbook/classification/',
};

/** Back matter routes by ID. */
const BACK_MATTER_ROUTES: Record<string, string> = {
  'sources-bibliography': '/cookbook/sources/',
  'recipe-index': '/cookbook/index-recipes/',
  'ingredient-index': '/cookbook/index-ingredients/',
  'scripture-index': '/cookbook/index-scripture/',
  acknowledgments: '/cookbook/acknowledgments/',
};

const recipeContentById = new Map(RECIPE_CONTENT_RECORDS.map((r) => [r.id, r]));

/**
 * Generate the complete deterministic book reading order.
 * Always returns the same result for the same canonical data.
 */
export function generateBookOrder(): BookPage[] {
  const pages: BookPage[] = [];
  let order = 1;

  // Front matter (skip 'cover' — handled by landing page)
  for (const item of FRONT_MATTER) {
    if (
      item.id === 'title-page' ||
      item.id === 'copyright-disclaimer' ||
      item.id === 'introduction' ||
      item.id === 'methodology' ||
      item.id === 'how-to-use' ||
      item.id === 'classification-guide'
    ) {
      pages.push({
        order: order++,
        kind: 'front-matter',
        id: item.id,
        title: item.title,
        route: FRONT_MATTER_ROUTES[item.id],
      });
    }
  }

  // Chapters and recipes
  for (const chapter of COOKBOOK_CHAPTERS) {
    pages.push({
      order: order++,
      kind: 'chapter',
      id: chapter.id,
      title: chapter.title,
      route: `/cookbook/chapters/${chapter.order}/`,
    });

    // Recipes in this chapter
    const chapterRecipes = COOKBOOK_RECIPE_INCLUSIONS.filter((inc) => {
      const mapped = SECTION_TO_CHAPTER[inc.sectionId];
      return mapped === chapter.id;
    }).sort((a, b) => a.order - b.order);

    for (const inclusion of chapterRecipes) {
      const recipe = recipeContentById.get(inclusion.recipeContentId);
      if (!recipe) continue;

      pages.push({
        order: order++,
        kind: 'recipe',
        id: recipe.id,
        title: recipe.title,
        route: `/cookbook/recipes/${recipe.slug}/`,
        chapterId: chapter.id,
      });
    }
  }

  // Back matter
  for (const item of BACK_MATTER) {
    pages.push({
      order: order++,
      kind: 'back-matter',
      id: item.id,
      title: item.title,
      route: BACK_MATTER_ROUTES[item.id],
    });
  }

  return pages;
}

/** Get a book page by its ID. */
export function getBookPageById(id: string): BookPage | undefined {
  return generateBookOrder().find((p) => p.id === id);
}

/** Get the previous page in reading order. */
export function getPreviousPage(currentId: string): BookPage | null {
  const pages = generateBookOrder();
  const idx = pages.findIndex((p) => p.id === currentId);
  return idx > 0 ? pages[idx - 1] : null;
}

/** Get the next page in reading order. */
export function getNextPage(currentId: string): BookPage | null {
  const pages = generateBookOrder();
  const idx = pages.findIndex((p) => p.id === currentId);
  return idx >= 0 && idx < pages.length - 1 ? pages[idx + 1] : null;
}
