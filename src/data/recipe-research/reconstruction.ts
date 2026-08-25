import {
  CANONICAL_FOOD_UNIVERSE,
  type CanonicalFoodRecord,
} from '../food-universe-registry';
import type { WorkflowStatus } from '../../lib/workflow';

/**
 * V3C.17 canonical recipe research and reconstruction model.
 *
 * This module does not assert that any reconstructed recipe is historically
 * exact. It keeps evidence, inference, reconstruction and modern adaptation
 * separate so future recipe content cannot silently promote uncertainty.
 */
export const RECIPE_EVIDENCE_CLASSIFICATIONS = [
  'DIRECT_TEXTUAL',
  'INDIRECT_TEXTUAL',
  'HISTORICAL',
  'ARCHAEOLOGICAL',
  'CULINARY',
  'SCHOLARLY_INTERPRETATION',
  'INFERENCE',
  'MODERN_ADAPTATION',
] as const;

export type RecipeEvidenceClassification =
  (typeof RECIPE_EVIDENCE_CLASSIFICATIONS)[number];

export const RECONSTRUCTION_CONFIDENCE_LEVELS = [
  'HIGH',
  'MODERATE',
  'LIMITED',
  'SPECULATIVE',
] as const;

export type ReconstructionConfidence =
  (typeof RECONSTRUCTION_CONFIDENCE_LEVELS)[number];

export const RECONSTRUCTION_CONFIDENCE_DEFINITIONS: Readonly<
  Record<ReconstructionConfidence, string>
> = {
  HIGH: 'Multiple relevant evidence sources support the reconstruction components; exact historical preparation may still contain bounded reconstruction.',
  MODERATE:
    'Historical context is well supported, but the exact recipe form is partly reconstructed.',
  LIMITED:
    'Important evidence gaps remain and the reconstruction should foreground uncertainty.',
  SPECULATIVE:
    'The reconstruction relies primarily on explicit inference and must never be presented as an authentic historical recipe.',
};

export const RECIPE_RECONSTRUCTION_STAGES = [
  'candidate',
  'research-required',
  'research-in-progress',
  'evidence-mapped',
  'reconstruction-ready',
  'reconstruction-draft',
  'editorial-review',
  'approved-for-production',
  'published',
  'rejected',
] as const;

export type RecipeReconstructionStage =
  (typeof RECIPE_RECONSTRUCTION_STAGES)[number];

export type RecipeComponentKind =
  | 'ingredient'
  | 'quantity'
  | 'preparation-method'
  | 'cooking-method'
  | 'vessel-equipment-context'
  | 'sequence'
  | 'timing'
  | 'substitution';

export type RecipeComponentReconstructionStatus =
  'historically-supported' | 'reconstructed' | 'modern-adaptation' | 'unknown';

export interface RecipeEvidenceLink {
  classification: RecipeEvidenceClassification;
  /** Existing research/authority/citation record ID when one exists. */
  researchRecordId?: string;
  authorityRecordId?: string;
  citationId?: string;
  note?: string;
}

export interface RecipeComponent {
  kind: RecipeComponentKind;
  label: string;
  value?: string;
  canonicalFoodId?: string;
  evidence: RecipeEvidenceLink[];
  confidence: ReconstructionConfidence;
  reconstructionStatus: RecipeComponentReconstructionStatus;
  note?: string;
}

export interface RecipeDisclosure {
  historicalBasis: string;
  reconstruction: string;
  uncertainty: string[];
  modernAdaptations: string[];
  required: boolean;
}

export interface RecipeResearchRecord {
  id: string;
  workingTitle: string;
  recipeType: string;
  primaryHistoricalPeriod: string;
  geographicCulturalContext: string;
  canonicalFoodIds: string[];
  biblicalPassages: string[];
  researchRecordIds: string[];
  historicalPreparationEvidence: RecipeEvidenceLink[];
  archaeologicalEvidence: RecipeEvidenceLink[];
  culinaryEvidence: RecipeEvidenceLink[];
  evidenceGaps: string[];
  reconstructionNotes: string[];
  explicitAssumptions: string[];
  modernSubstitutions: string[];
  components: RecipeComponent[];
  confidence: ReconstructionConfidence;
  disclosure: RecipeDisclosure;
  stage: RecipeReconstructionStage;
  /** Reuses the repository-wide editorial lifecycle. */
  workflowStatus: WorkflowStatus;
  internalOnly: boolean;
  publicationEligible: boolean;
}

const WORKFLOW_BY_RECONSTRUCTION_STAGE: Readonly<
  Partial<Record<RecipeReconstructionStage, WorkflowStatus>>
> = {
  'research-required': 'research-needed',
  'research-in-progress': 'research-in-progress',
  'evidence-mapped': 'research-complete',
  'reconstruction-ready': 'research-complete',
  'reconstruction-draft': 'draft',
  'editorial-review': 'editorial-review',
  'approved-for-production': 'approved',
  published: 'approved',
};

export function canonicalFoodById(id: string): CanonicalFoodRecord | undefined {
  return CANONICAL_FOOD_UNIVERSE.find((food) => food.id === id);
}

export function stageMatchesWorkflow(record: RecipeResearchRecord): boolean {
  const expected = WORKFLOW_BY_RECONSTRUCTION_STAGE[record.stage];
  return expected === undefined || expected === record.workflowStatus;
}

export function requiresExplicitDisclosure(
  record: RecipeResearchRecord,
): boolean {
  return (
    record.confidence === 'LIMITED' ||
    record.confidence === 'SPECULATIVE' ||
    record.evidenceGaps.length > 0 ||
    record.components.some(
      (component) =>
        component.reconstructionStatus !== 'historically-supported' ||
        component.evidence.some(
          (evidence) =>
            evidence.classification === 'INFERENCE' ||
            evidence.classification === 'MODERN_ADAPTATION',
        ),
    )
  );
}

export function validateRecipeResearchRecord(
  record: RecipeResearchRecord,
): string[] {
  const errors: string[] = [];

  if (!record.id.trim())
    errors.push('Recipe research record requires a canonical ID.');
  if (
    new Set(record.canonicalFoodIds).size !== record.canonicalFoodIds.length
  ) {
    errors.push('Canonical food IDs must not contain duplicates.');
  }
  for (const foodId of record.canonicalFoodIds) {
    if (!canonicalFoodById(foodId)) {
      errors.push(`Unknown canonical food ID: ${foodId}.`);
    }
  }
  for (const component of record.components) {
    if (
      component.canonicalFoodId &&
      !canonicalFoodById(component.canonicalFoodId)
    ) {
      errors.push(`Unknown component food ID: ${component.canonicalFoodId}.`);
    }
    if (
      component.reconstructionStatus === 'historically-supported' &&
      component.evidence.some(
        (evidence) =>
          evidence.classification === 'INFERENCE' ||
          evidence.classification === 'MODERN_ADAPTATION',
      )
    ) {
      errors.push(
        `${component.label} cannot be historically-supported when its evidence is inference or modern adaptation.`,
      );
    }
  }
  if (requiresExplicitDisclosure(record) && !record.disclosure.required) {
    errors.push(
      'Disclosure is required when reconstruction uncertainty or adaptation exists.',
    );
  }
  if (record.stage === 'published' && !record.publicationEligible) {
    errors.push('Published recipes must pass publication eligibility.');
  }
  if (record.stage === 'published' && record.workflowStatus !== 'approved') {
    errors.push('Published recipes must reuse the approved workflow gate.');
  }
  if (!stageMatchesWorkflow(record)) {
    errors.push(
      'Recipe reconstruction stage does not match the canonical workflow gate.',
    );
  }
  if (record.confidence === 'SPECULATIVE' && record.publicationEligible) {
    errors.push(
      'Speculative reconstructions are not publication-eligible as historical recipes.',
    );
  }
  return errors;
}

/**
 * Internal architecture fixture only. It intentionally contains no claimed
 * historical recipe, no source citation and is not production-ready.
 */
export const INTERNAL_RECIPE_RESEARCH_FIXTURES: RecipeResearchRecord[] = [
  {
    id: 'fixture-barley-reconstruction',
    workingTitle: 'Internal barley reconstruction fixture',
    recipeType: 'internal architecture fixture',
    primaryHistoricalPeriod: 'Unspecified; research not complete',
    geographicCulturalContext: 'Unspecified; research not complete',
    canonicalFoodIds: ['barley'],
    biblicalPassages: [],
    researchRecordIds: [],
    historicalPreparationEvidence: [],
    archaeologicalEvidence: [],
    culinaryEvidence: [],
    evidenceGaps: ['Exact original preparation is unknown.'],
    reconstructionNotes: [
      'Fixture exists only to exercise evidence and disclosure architecture.',
    ],
    explicitAssumptions: ['No historical preparation method is asserted.'],
    modernSubstitutions: [],
    components: [
      {
        kind: 'ingredient',
        label: 'Barley',
        canonicalFoodId: 'barley',
        evidence: [
          { classification: 'INFERENCE', note: 'No production claim.' },
        ],
        confidence: 'SPECULATIVE',
        reconstructionStatus: 'reconstructed',
      },
    ],
    confidence: 'SPECULATIVE',
    disclosure: {
      historicalBasis: 'Not established by this fixture.',
      reconstruction: 'No recipe is reconstructed by this fixture.',
      uncertainty: ['Exact original preparation is unknown.'],
      modernAdaptations: [],
      required: true,
    },
    stage: 'candidate',
    workflowStatus: 'research-needed',
    internalOnly: true,
    publicationEligible: false,
  },
];
