/**
 * V3C.44A — Cookbook Structure & Front Matter
 *
 * Canonical blueprint for the BiblicalMeal Cookbook.
 * This is the single source of truth for cookbook structure.
 *
 * Existing systems reused:
 * - RecipeClassification from recipe-research/types.ts
 * - RecipeContentRecord from recipe-content/types.ts
 * - CookbookRecord from cookbook-production/types.ts
 * - Food Universe categories from food-universe.ts
 * - Source citations from source-citations.ts
 * - Authority records from authority/records.ts
 *
 * This file does NOT duplicate:
 * - Recipe schema ownership
 * - Citation ownership
 * - Source ownership
 * - Publication gate ownership
 */

/**
 * Canonical cookbook identifier.
 * This links to the existing cookbook-production records.
 */
export const COOKBOOK_ID = 'biblicalmeal-cookbook-v1' as const;

/**
 * Canonical working title for the cookbook.
 */
export const COOKBOOK_TITLE =
  'Biblical Meals: Recipes Inspired by the Foods of the Bible' as const;

/**
 * Target recipe count for the first edition.
 */
export const TARGET_RECIPE_COUNT = 30 as const;

/**
 * Recipe count per chapter target.
 */
export const RECIPES_PER_CHAPTER = 5 as const;

/**
 * Chapter definition type.
 */
export interface CookbookChapter {
  id: string;
  title: string;
  order: number;
  description: string;
  /** Food Universe categories that belong to this chapter. */
  foodCategories: readonly string[];
  /** Target recipe count for this chapter. */
  targetRecipes: number;
}

/**
 * Canonical chapter definitions for the cookbook.
 * Maps to Food Universe categories for recipe assignment.
 */
export const COOKBOOK_CHAPTERS: readonly CookbookChapter[] = [
  {
    id: 'grains-breads',
    title: 'Grains & Breads',
    order: 1,
    description:
      'The foundation of the ancient table: breads, flatbreads, and grain preparations that sustained communities across the biblical world.',
    foodCategories: ['grains-staples'],
    targetRecipes: RECIPES_PER_CHAPTER,
  },
  {
    id: 'legumes-one-pot-meals',
    title: 'Legumes & One-Pot Meals',
    order: 2,
    description:
      'Hearty, sustaining dishes built around lentils, beans, and simple one-pot preparations that echo domestic cooking in the ancient Near East.',
    foodCategories: ['legumes-vegetables'],
    targetRecipes: RECIPES_PER_CHAPTER,
  },
  {
    id: 'fruits-preserves',
    title: 'Fruits & Preserves',
    order: 3,
    description:
      'The natural sweetness of the biblical landscape: figs, dates, pomegranates, and honey — enjoyed fresh, dried, or preserved.',
    foodCategories: ['fruits-plants', 'sweet-foods'],
    targetRecipes: RECIPES_PER_CHAPTER,
  },
  {
    id: 'fish-seafood',
    title: 'Fish & Seafood',
    order: 4,
    description:
      'From the Sea of Galilee to the Mediterranean coast: fish and seafood preparations rooted in the fishing traditions of the biblical world.',
    foodCategories: ['animal-foods'],
    targetRecipes: RECIPES_PER_CHAPTER,
  },
  {
    id: 'herbs-oils-seasonings',
    title: 'Herbs, Oils & Seasonings',
    order: 5,
    description:
      'The flavors that transformed simple ingredients: olive oil, herbs, spices, and the seasonings that shaped biblical cuisine.',
    foodCategories: ['herbs-spices', 'oils', 'flavourings-other'],
    targetRecipes: RECIPES_PER_CHAPTER,
  },
  {
    id: 'feasts-gatherings',
    title: 'Feasts & Gatherings',
    order: 6,
    description:
      'Celebratory meals and communal gatherings: Passover, harvest feasts, and the shared tables that built community.',
    foodCategories: ['beverages'],
    targetRecipes: RECIPES_PER_CHAPTER,
  },
] as const;

/**
 * Front matter component type.
 */
export interface FrontMatterComponent {
  id: string;
  title: string;
  order: number;
  description: string;
  /** Whether this component reuses existing canonical content. */
  existingContentSource?: string;
  /** Approximate page count for planning. */
  approximatePages: number;
}

/**
 * Canonical front matter structure.
 */
export const FRONT_MATTER: readonly FrontMatterComponent[] = [
  {
    id: 'title-page',
    title: 'Title Page',
    order: 1,
    description: 'Book title, subtitle, and author attribution.',
    approximatePages: 1,
  },
  {
    id: 'copyright-disclaimer',
    title: 'Copyright & Disclaimer',
    order: 2,
    description: 'Copyright notice and recipe classification disclaimer.',
    approximatePages: 1,
  },
  {
    id: 'introduction',
    title: 'Introduction',
    order: 3,
    description:
      'Why BiblicalMeal exists and what this cookbook offers: honest, evidence-aware recipes inspired by the foods of the Bible.',
    approximatePages: 3,
  },
  {
    id: 'methodology',
    title: 'How BiblicalMeal Researches Food',
    order: 4,
    description:
      'Our editorial methodology: scripture, history, and modern cooking — kept visibly separate.',
    existingContentSource: 'src/content/articles/how-we-research.mdx',
    approximatePages: 3,
  },
  {
    id: 'how-to-use',
    title: 'How to Use This Cookbook',
    order: 5,
    description:
      'A guide to recipe symbols, evidence notes, and cross-references within the cookbook.',
    approximatePages: 2,
  },
  {
    id: 'classification-guide',
    title: 'Recipe Classification Guide',
    order: 6,
    description:
      'Understanding the four recipe classifications: inspired, researched, reconstructed, and historically-informed.',
    approximatePages: 2,
  },
] as const;

/**
 * Back matter component type.
 */
export interface BackMatterComponent {
  id: string;
  title: string;
  order: number;
  description: string;
  /** Whether this is auto-generated from canonical data. */
  autoGenerated: boolean;
  /** Data source for auto-generation. */
  dataSource?: string;
}

/**
 * Canonical back matter structure.
 */
export const BACK_MATTER: readonly BackMatterComponent[] = [
  {
    id: 'sources-bibliography',
    title: 'Sources & Bibliography',
    order: 1,
    description:
      'Complete list of sources, references, and scholarly works cited throughout the cookbook.',
    autoGenerated: true,
    dataSource: 'source-citations.ts, authority/records.ts',
  },
  {
    id: 'recipe-index',
    title: 'Recipe Index',
    order: 2,
    description: 'Alphabetical index of all recipes with page references.',
    autoGenerated: true,
    dataSource: 'recipe-content/records.ts',
  },
  {
    id: 'ingredient-index',
    title: 'Ingredient Index',
    order: 3,
    description: 'Index of ingredients by name with recipe cross-references.',
    autoGenerated: true,
    dataSource: 'food-universe.ts, recipe-content/records.ts',
  },
  {
    id: 'scripture-index',
    title: 'Scripture Index',
    order: 4,
    description:
      'Index of all Scripture references with recipe cross-references.',
    autoGenerated: true,
    dataSource: 'recipe-research/records.ts',
  },
  {
    id: 'acknowledgments',
    title: 'Acknowledgments',
    order: 5,
    description: 'Credits and acknowledgments for contributors and sources.',
    autoGenerated: false,
  },
] as const;

/**
 * Get a chapter by its ID.
 */
export function getChapterById(id: string): CookbookChapter | undefined {
  return COOKBOOK_CHAPTERS.find((chapter) => chapter.id === id);
}

/**
 * Get a chapter by its order.
 */
export function getChapterByOrder(order: number): CookbookChapter | undefined {
  return COOKBOOK_CHAPTERS.find((chapter) => chapter.order === order);
}

/**
 * Get all chapter IDs in order.
 */
export function getChapterIds(): readonly string[] {
  return COOKBOOK_CHAPTERS.map((chapter) => chapter.id);
}

/**
 * Get the total target recipe count across all chapters.
 */
export function getTotalTargetRecipeCount(): number {
  return COOKBOOK_CHAPTERS.reduce(
    (sum, chapter) => sum + chapter.targetRecipes,
    0,
  );
}
