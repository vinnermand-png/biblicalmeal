import type { RecipeContentProductionStatus, RecipeEditorialReviewStatus } from '../recipe-content/types';
import type { RecipePublicationStatus } from '../recipe-research/types';

/** V3C.21 — Trust Pages & Editorial Transparency. */
export type TransparencyArea =
  | 'research-methodology'
  | 'historical-evidence-standards'
  | 'uncertainty-and-limitations'
  | 'sources-and-citations'
  | 'recipe-reconstruction'
  | 'scripture-context'
  | 'editorial-and-publication';

export type TransparencyEvidenceState =
  | 'supported'
  | 'partially-supported'
  | 'inferred'
  | 'editorial-explanation'
  | 'unresolved';

export type HistoricalRepresentation =
  | 'directly-attested'
  | 'historically-informed-reconstruction'
  | 'editorial-methodology'
  | 'not-applicable';

export interface TransparencyRecord {
  id: string;
  title: string;
  area: TransparencyArea;
  purpose: string;
  summary: string;
  applicableSystems: string[];
  evidenceState: TransparencyEvidenceState;
  historicalRepresentation: HistoricalRepresentation;
  uncertaintyDisclosure: string;
  editorialGuidance: string[];
  researchDossierIds: string[];
  sourceIds: string[];
  authorityIds: string[];
  citationIds: string[];
  articleContentIds: string[];
  recipeResearchIds: string[];
  recipeContentIds: string[];
  foodIds: string[];
  seoTargetIds: string[];
  scripturePolicyRuleIds: string[];
  productionStatus: RecipeContentProductionStatus;
  editorialReviewStatus: RecipeEditorialReviewStatus;
  publicationStatus: RecipePublicationStatus;
  publicationEligible: boolean;
  publicReleased: boolean;
}
