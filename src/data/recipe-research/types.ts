import type { FoodEvidenceStatus } from '../food-universe';

/**
 * V3C.17 — Recipe Research & Reconstruction System
 *
 * Recipe research records are intentionally separate from public recipe
 * content. Historical authority, reconstruction work and publication are
 * separate axes so uncertainty cannot silently become certainty.
 */

export type RecipeClassification =
  | 'historically-attested-preparation'
  | 'historically-informed-reconstruction'
  | 'scripture-inspired-preparation'
  | 'modern-adaptation';

export type RecipeEvidenceLayer =
  | 'directly-attested'
  | 'inferred'
  | 'practical-adaptation'
  | 'unresolved';

export type RecipeIngredientProvenance =
  | 'directly-attested'
  | 'historically-inferred'
  | 'optional-reconstruction-choice'
  | 'modern-substitution';

export type RecipeResearchStatus = 'not-started' | 'in-progress' | 'complete';
export type RecipeReconstructionStatus =
  | 'not-started'
  | 'in-progress'
  | 'ready';
export type RecipePublicationStatus = 'not-eligible' | 'eligible' | 'public';

export interface RecipeIngredient {
  foodId: string;
  provenance: RecipeIngredientProvenance;
  disclosure?: string;
}

export interface RecipeEvidenceEntry {
  layer: RecipeEvidenceLayer;
  statement: string;
  sourceIds?: string[];
  disclosure?: string;
}

export interface RecipeResearchRecord {
  id: string;
  name: string;
  foodIds: string[];
  historicalContext?: string;
  classification: RecipeClassification;
  evidence: RecipeEvidenceEntry[];
  ingredients: RecipeIngredient[];
  researchStatus: RecipeResearchStatus;
  reconstructionStatus: RecipeReconstructionStatus;
  publicationStatus: RecipePublicationStatus;
  unresolvedQuestions: string[];
  reconstructionDisclosure: string;
  scriptureRelationship?: string;
  /** Existing Food Universe evidence is retained, never upgraded here. */
  foodEvidence?: Record<string, FoodEvidenceStatus>;
}
