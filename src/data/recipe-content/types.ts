import type {
  RecipeClassification,
  RecipeEvidenceLayer,
  RecipeIngredientProvenance,
  RecipePublicationStatus,
} from '../recipe-research/types';

/**
 * V3C.18 — Recipe Content Production
 *
 * Editorial recipe content is derived from V3C.17 research records without
 * upgrading research, reconstruction or publication state. This layer records
 * practical quantities and steps as editorial production choices and keeps the
 * underlying evidence boundaries visible.
 */

export type RecipeContentProductionStatus =
  'not-started' | 'draft' | 'produced';
export type RecipeEditorialReviewStatus =
  'not-started' | 'in-review' | 'approved';

export interface RecipeContentIngredient {
  /** Optional when a modern kitchen necessity is not itself a canonical food concept. */
  foodId?: string;
  label: string;
  quantity?: string;
  provenance: RecipeIngredientProvenance;
  evidenceLayer: RecipeEvidenceLayer;
  disclosure?: string;
}

export interface RecipePreparationStep {
  order: number;
  instruction: string;
  evidenceLayer: 'inferred' | 'practical-adaptation';
  disclosure?: string;
}

export interface RecipeContentRecord {
  id: string;
  recipeResearchId: string;
  title: string;
  slug: string;
  metaDescription: string;
  classification: RecipeClassification;
  introduction: string;
  historicalContext?: string;
  uncertaintyDisclosure: string;
  ingredients: RecipeContentIngredient[];
  preparationSteps: RecipePreparationStep[];
  servings?: string;
  timingGuidance?: string;
  servingGuidance?: string;
  editorialNotes: string[];
  relatedFoodIds: string[];
  productionStatus: RecipeContentProductionStatus;
  editorialReviewStatus: RecipeEditorialReviewStatus;
  publicationStatus: RecipePublicationStatus;
  publicationEligible: boolean;
}
