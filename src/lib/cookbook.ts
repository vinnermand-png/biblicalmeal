/**
 * V3C.45B — Cookbook Helper Functions
 *
 * Derives chapter-to-recipe mapping and navigation from canonical data.
 * No duplicate registries. No manual relationship definitions.
 */

import { COOKBOOK_CHAPTERS } from '../data/cookbook/structure';
import { COOKBOOK_RECIPE_INCLUSIONS } from '../data/cookbook-production/records';
import { RECIPE_CONTENT_RECORDS } from '../data/recipe-content/records';
import type { RecipeContentRecord } from '../data/recipe-content/types';

const recipeContentById = new Map(RECIPE_CONTENT_RECORDS.map((r) => [r.id, r]));

/**
 * Mapping from cookbook section IDs to chapter IDs.
 * Derived from the canonical cookbook production records.
 */
const SECTION_TO_CHAPTER: Record<string, string> = {
  'cookbook-section-simple-preparations': 'legumes-one-pot-meals',
  'cookbook-section-breads-and-grains': 'grains-breads',
  'cookbook-section-seafood-preparations': 'fish-seafood',
  'cookbook-section-fruits-and-preserves': 'fruits-preserves',
  'cookbook-section-herbs-oils-seasonings': 'herbs-oils-seasonings',
  'cookbook-section-feasts-and-gatherings': 'feasts-gatherings',
};

/**
 * Get all recipes for a given chapter ID, ordered by their inclusion order.
 */
export function getRecipesForChapter(
  chapterId: string,
): (RecipeContentRecord & { inclusionOrder: number })[] {
  const recipes: (RecipeContentRecord & { inclusionOrder: number })[] = [];

  for (const inclusion of COOKBOOK_RECIPE_INCLUSIONS) {
    const mappedChapterId = SECTION_TO_CHAPTER[inclusion.sectionId];
    if (mappedChapterId !== chapterId) continue;

    const recipe = recipeContentById.get(inclusion.recipeContentId);
    if (!recipe) continue;

    recipes.push({ ...recipe, inclusionOrder: inclusion.order });
  }

  recipes.sort((a, b) => a.inclusionOrder - b.inclusionOrder);
  return recipes;
}

/**
 * Get a chapter by its order number (1-6).
 */
export function getChapterByOrder(
  order: number,
): (typeof COOKBOOK_CHAPTERS)[number] | undefined {
  return COOKBOOK_CHAPTERS.find((c) => c.order === order);
}

/**
 * Get the previous chapter (lower order) or null.
 */
export function getPreviousChapter(
  currentOrder: number,
): (typeof COOKBOOK_CHAPTERS)[number] | null {
  return COOKBOOK_CHAPTERS.find((c) => c.order === currentOrder - 1) ?? null;
}

/**
 * Get the next chapter (higher order) or null.
 */
export function getNextChapter(
  currentOrder: number,
): (typeof COOKBOOK_CHAPTERS)[number] | null {
  return COOKBOOK_CHAPTERS.find((c) => c.order === currentOrder + 1) ?? null;
}

/**
 * Get a recipe by its slug.
 */
export function getRecipeBySlug(slug: string): RecipeContentRecord | undefined {
  return RECIPE_CONTENT_RECORDS.find((r) => r.slug === slug);
}

/**
 * Get the chapter ID for a given recipe.
 */
export function getChapterForRecipe(recipeId: string): string | undefined {
  const inclusion = COOKBOOK_RECIPE_INCLUSIONS.find(
    (i) => i.recipeContentId === recipeId,
  );
  if (!inclusion) return undefined;
  return SECTION_TO_CHAPTER[inclusion.sectionId];
}

/**
 * Get the previous recipe in the same chapter, or null.
 */
export function getPreviousRecipe(
  recipeId: string,
): RecipeContentRecord | null {
  const chapterId = getChapterForRecipe(recipeId);
  if (!chapterId) return null;

  const recipes = getRecipesForChapter(chapterId);
  const currentIndex = recipes.findIndex((r) => r.id === recipeId);
  if (currentIndex <= 0) return null;

  return recipes[currentIndex - 1];
}

/**
 * Get the next recipe in the same chapter, or null.
 */
export function getNextRecipe(recipeId: string): RecipeContentRecord | null {
  const chapterId = getChapterForRecipe(recipeId);
  if (!chapterId) return null;

  const recipes = getRecipesForChapter(chapterId);
  const currentIndex = recipes.findIndex((r) => r.id === recipeId);
  if (currentIndex < 0 || currentIndex >= recipes.length - 1) return null;

  return recipes[currentIndex + 1];
}

/**
 * Get the recipe count for a chapter.
 */
export function getRecipeCountForChapter(chapterId: string): number {
  return getRecipesForChapter(chapterId).length;
}

/**
 * Get all chapter IDs in order.
 */
export function getAllChapterIds(): string[] {
  return COOKBOOK_CHAPTERS.map((c) => c.id);
}

/**
 * Art kind mapping for chapters based on their food categories.
 */
const CHAPTER_ART_MAP: Record<string, string> = {
  'grains-breads': 'barley',
  'legumes-one-pot-meals': 'lentils',
  'fruits-preserves': 'honey',
  'fish-seafood': 'galilee',
  'herbs-oils-seasonings': 'olives',
  'feasts-gatherings': 'still-life',
};

/**
 * Get the art kind for a chapter.
 */
export function getChapterArt(chapterId: string): string {
  return CHAPTER_ART_MAP[chapterId] ?? 'still-life';
}

/**
 * Get the art kind for a recipe based on its classification.
 */
export function getRecipeArt(
  classification: string,
): 'stew' | 'barley' | 'still-life' {
  if (classification === 'historically-informed-reconstruction') return 'stew';
  if (classification === 'scripture-inspired-preparation') return 'barley';
  return 'still-life';
}

/**
 * Classification display labels.
 */
export const CLASSIFICATION_LABELS: Record<string, string> = {
  'historically-attested-preparation': 'Historically attested',
  'historically-informed-reconstruction': 'Reconstruction',
  'scripture-inspired-preparation': 'Scripture-inspired',
  'modern-adaptation': 'Modern adaptation',
};

/**
 * Classification chip variants.
 */
export const CLASSIFICATION_VARIANTS: Record<string, 'inspired' | 'review'> = {
  'historically-attested-preparation': 'inspired',
  'historically-informed-reconstruction': 'review',
  'scripture-inspired-preparation': 'inspired',
  'modern-adaptation': 'inspired',
};
