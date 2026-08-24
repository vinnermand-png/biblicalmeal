/**
 * V3C.45C — Cookbook Index Generation
 *
 * Deterministic index generation from canonical data.
 * No duplicate registries. No manual maintenance.
 */

import { RECIPE_CONTENT_RECORDS } from '../data/recipe-content/records';
import { COOKBOOK_RECIPE_INCLUSIONS } from '../data/cookbook-production/records';
import { RECIPE_RESEARCH_RECORDS } from '../data/recipe-research/records';
import { COOKBOOK_CHAPTERS } from '../data/cookbook/structure';

/** Map section IDs to chapter IDs. */
const SECTION_TO_CHAPTER: Record<string, string> = {
  'cookbook-section-simple-preparations': 'legumes-one-pot-meals',
  'cookbook-section-breads-and-grains': 'grains-breads',
  'cookbook-section-seafood-preparations': 'fish-seafood',
  'cookbook-section-fruits-and-preserves': 'fruits-preserves',
  'cookbook-section-herbs-oils-seasonings': 'herbs-oils-seasonings',
  'cookbook-section-feasts-and-gatherings': 'feasts-gatherings',
};

const recipeContentById = new Map(RECIPE_CONTENT_RECORDS.map((r) => [r.id, r]));

// ─── Recipe Index ────────────────────────────────────────────────

export interface RecipeIndexEntry {
  title: string;
  slug: string;
  classification: string;
  chapterTitle: string;
  chapterOrder: number;
  route: string;
}

/**
 * Generate an alphabetical recipe index for the cookbook.
 * All 9 recipes must appear exactly once.
 */
export function generateRecipeIndex(): RecipeIndexEntry[] {
  const entries: RecipeIndexEntry[] = [];

  for (const inclusion of COOKBOOK_RECIPE_INCLUSIONS) {
    const recipe = recipeContentById.get(inclusion.recipeContentId);
    if (!recipe) continue;

    const chapterId = SECTION_TO_CHAPTER[inclusion.sectionId];
    const chapter = COOKBOOK_CHAPTERS.find((c) => c.id === chapterId);

    entries.push({
      title: recipe.title,
      slug: recipe.slug,
      classification: recipe.classification,
      chapterTitle: chapter?.title ?? 'Unknown Chapter',
      chapterOrder: chapter?.order ?? 0,
      route: `/cookbook/recipes/${recipe.slug}/`,
    });
  }

  return entries.sort((a, b) => a.title.localeCompare(b.title));
}

// ─── Ingredient Index ────────────────────────────────────────────

export interface IngredientIndexEntry {
  label: string;
  recipes: { title: string; route: string }[];
}

/**
 * Generate an alphabetical ingredient index from recipe content.
 * Each unique ingredient maps to the recipes that use it.
 */
export function generateIngredientIndex(): IngredientIndexEntry[] {
  const ingredientMap = new Map<string, { title: string; route: string }[]>();

  for (const inclusion of COOKBOOK_RECIPE_INCLUSIONS) {
    const recipe = recipeContentById.get(inclusion.recipeContentId);
    if (!recipe) continue;

    for (const ingredient of recipe.ingredients) {
      const key = ingredient.label.toLowerCase();
      const existing = ingredientMap.get(key) ?? [];
      existing.push({
        title: recipe.title,
        route: `/cookbook/recipes/${recipe.slug}/`,
      });
      ingredientMap.set(key, existing);
    }
  }

  return Array.from(ingredientMap.entries())
    .map(([label, recipes]) => ({
      label,
      // Deduplicate recipes
      recipes: recipes.filter(
        (r, i, arr) => arr.findIndex((x) => x.route === r.route) === i,
      ),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

// ─── Scripture Index ─────────────────────────────────────────────

export interface ScriptureIndexEntry {
  reference: string;
  book: string;
  chapter: number;
  verse?: number;
  recipes: { title: string; route: string }[];
}

/** Canonical biblical book order for sorting. */
const BOOK_ORDER: Record<string, number> = {
  genesis: 1,
  exodus: 2,
  leviticus: 3,
  numbers: 4,
  deuteronomy: 5,
  joshua: 6,
  judges: 7,
  ruth: 8,
  '1 samuel': 9,
  '2 samuel': 10,
  '1 kings': 11,
  '2 kings': 12,
  '1 chronicles': 13,
  '2 chronicles': 14,
  ezra: 15,
  nehemiah: 16,
  esther: 17,
  job: 18,
  psalms: 19,
  proverbs: 20,
  ecclesiastes: 21,
  'song of solomon': 22,
  isaiah: 23,
  jeremiah: 24,
  lamentations: 25,
  ezekiel: 26,
  daniel: 27,
  hosea: 28,
  joel: 29,
  amos: 30,
  obadiah: 31,
  jonah: 32,
  micah: 33,
  nahum: 34,
  habakkuk: 35,
  zephaniah: 36,
  haggai: 37,
  zechariah: 38,
  malachi: 39,
  matthew: 40,
  mark: 41,
  luke: 42,
  john: 43,
  acts: 44,
  romans: 45,
  '1 corinthians': 46,
  '2 corinthians': 47,
  galatians: 48,
  ephesians: 49,
  philippians: 50,
  colossians: 51,
  '1 thessalonians': 52,
  '2 thessalonians': 53,
  '1 timothy': 54,
  '2 timothy': 55,
  titus: 56,
  philemon: 57,
  hebrews: 58,
  james: 59,
  '1 peter': 60,
  '2 peter': 61,
  '1 john': 62,
  '2 john': 63,
  '3 john': 64,
  jude: 65,
  revelation: 66,
};

/**
 * Parse a scripture reference like "Exodus 12:8" or "John 6:9, 13".
 * Returns the primary book, chapter, and optional verse.
 */
function parseScriptureReference(ref: string): {
  book: string;
  chapter: number;
  verse?: number;
  raw: string;
} | null {
  // Match patterns like "Genesis 25:29", "Deuteronomy 8:8", "John 6:9, 13"
  const match = ref.match(/^(\d?\s*[A-Za-z]+)\s+(\d+):(\d+)/);
  if (!match) {
    // Try chapter-only references
    const chapterMatch = ref.match(/^(\d?\s*[A-Za-z]+)\s+(\d+)/);
    if (chapterMatch) {
      return {
        book: chapterMatch[1].trim().toLowerCase(),
        chapter: Number(chapterMatch[2]),
        raw: ref.trim(),
      };
    }
    return null;
  }

  return {
    book: match[1].trim().toLowerCase(),
    chapter: Number(match[2]),
    verse: Number(match[3]),
    raw: ref.trim(),
  };
}

/**
 * Generate a scripture index from canonical recipe research records.
 * Sorts in canonical biblical book order.
 */
export function generateScriptureIndex(): ScriptureIndexEntry[] {
  const refMap = new Map<
    string,
    {
      reference: string;
      book: string;
      chapter: number;
      verse?: number;
      recipes: { title: string; route: string }[];
    }
  >();

  for (const research of RECIPE_RESEARCH_RECORDS) {
    const recipe = recipeContentById.get(
      `recipe-content-${research.id.replace('recipe-', '')}`,
    );
    if (!recipe) continue;

    const scriptureRel = research.scriptureRelationship;
    if (!scriptureRel) continue;

    // Extract individual references — look for patterns like "Book Chapter:Verse"
    const refs = scriptureRel.match(/\d?\s*[A-Za-z]+\s+\d+:\d+/g) ?? [];

    for (const ref of refs) {
      const parsed = parseScriptureReference(ref);
      if (!parsed) continue;

      const key = `${parsed.book}:${parsed.chapter}:${parsed.verse ?? 0}`;
      const existing = refMap.get(key);
      if (existing) {
        const alreadyHas = existing.recipes.some(
          (r) => r.route === `/cookbook/recipes/${recipe.slug}/`,
        );
        if (!alreadyHas) {
          existing.recipes.push({
            title: recipe.title,
            route: `/cookbook/recipes/${recipe.slug}/`,
          });
        }
      } else {
        refMap.set(key, {
          reference: parsed.raw,
          book: parsed.book,
          chapter: parsed.chapter,
          verse: parsed.verse,
          recipes: [
            {
              title: recipe.title,
              route: `/cookbook/recipes/${recipe.slug}/`,
            },
          ],
        });
      }
    }
  }

  return Array.from(refMap.values()).sort((a, b) => {
    const aOrder = BOOK_ORDER[a.book] ?? 999;
    const bOrder = BOOK_ORDER[b.book] ?? 999;
    if (aOrder !== bOrder) return aOrder - bOrder;
    if (a.chapter !== b.chapter) return a.chapter - b.chapter;
    return (a.verse ?? 0) - (b.verse ?? 0);
  });
}
