import type {
  RecipeContentProductionStatus,
  RecipeEditorialReviewStatus,
} from '../recipe-content/types';
import type { RecipePublicationStatus } from '../recipe-research/types';

/** V3C.19 — Article & Question Content Expansion. */
export type ArticleContentType =
  | 'article'
  | 'question'
  | 'answer'
  | 'explainer'
  | 'comparison'
  | 'historical-context'
  | 'scripture-context'
  | 'practical-guide';

export type ArticleEvidenceState =
  | 'supported'
  | 'partially-supported'
  | 'inferred'
  | 'practical-editorial-explanation'
  | 'unresolved';

export type ArticleClaimStrength =
  | 'supported'
  | 'partially-supported'
  | 'inferred'
  | 'editorial'
  | 'unresolved';

export interface ArticleContentRecord {
  id: string;
  title: string;
  contentType: ArticleContentType;
  purpose: string;
  seoTargetId?: string;
  researchDossierIds: string[];
  foodIds: string[];
  relatedContentIds: string[];
  scriptureContext: string[];
  summary: string;
  uncertaintyDisclosure: string;
  keyPoints: string[];
  evidenceState: ArticleEvidenceState;
  claimStrength: ArticleClaimStrength;
  questionText?: string;
  answerContent?: string;
  editorialNotes: string[];
  productionStatus: RecipeContentProductionStatus;
  editorialReviewStatus: RecipeEditorialReviewStatus;
  publicationStatus: RecipePublicationStatus;
  publicationEligible: boolean;
}
