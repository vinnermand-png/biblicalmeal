import type { RecipeContentProductionStatus, RecipeEditorialReviewStatus } from '../recipe-content/types';
import type { RecipePublicationStatus } from '../recipe-research/types';

/** V3C.29 — Cookbook Production System.
 * Cookbook records organize existing recipe content; they never own or upgrade recipes.
 */
export type CookbookProductionStatus = 'not-started' | 'in-production' | 'editorial-review' | 'approved' | 'published';

export interface CookbookSection {
  id: string;
  cookbookId: string;
  title: string;
  order: number;
  description?: string;
}

export interface CookbookRecipeInclusion {
  cookbookId: string;
  sectionId: string;
  recipeContentId: string;
  order: number;
  productionStatus: RecipeContentProductionStatus;
  editorialReviewStatus: RecipeEditorialReviewStatus;
  publicationStatus: RecipePublicationStatus;
  productionReady: boolean;
  notes?: string;
}

export interface CookbookRecord {
  id: string;
  title: string;
  slug: string;
  description: string;
  productionStatus: CookbookProductionStatus;
  publicationStatus: RecipePublicationStatus;
  publicationEligible: boolean;
  sectionIds: readonly string[];
  recipeContentIds: readonly string[];
}
