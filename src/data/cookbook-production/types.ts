import type { RecipeContentProductionStatus, RecipeEditorialReviewStatus } from '../recipe-content/types';
import type { RecipePublicationStatus } from '../recipe-research/types';

/** V3C.29 — Cookbook Production System.
 * Cookbook records organize existing recipe content; they never own or upgrade recipes.
 */
export type CookbookProductionStatus = 'not-started' | 'in-production' | 'editorial-review' | 'approved' | 'published';
export type CookbookPublicationStatus = 'draft' | 'published';

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
  /** Mirrors the canonical V3C.18 recipe content lifecycle. */
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
  /** Cookbook packaging state; recipe publication remains owned by canonical recipe content. */
  publicationStatus: CookbookPublicationStatus;
  publicationEligible: boolean;
  sectionIds: readonly string[];
  recipeContentIds: readonly string[];
}
