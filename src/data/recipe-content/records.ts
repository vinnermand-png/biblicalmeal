import { RECIPE_RESEARCH_RECORDS } from '../recipe-research/records';
import type { RecipeContentRecord } from './types';

const researchById = new Map(
  RECIPE_RESEARCH_RECORDS.map((record) => [record.id, record]),
);

const lentilResearch = researchById.get('recipe-lentil-pottage');
const breadResearch = researchById.get('recipe-unleavened-bread');

if (!lentilResearch || !breadResearch) {
  throw new Error('V3C.18 recipe content seeds require the canonical V3C.17 research records.');
}

/**
 * Minimal editorial seed set. These are intentionally draft/non-public and do
 * not upgrade the incomplete V3C.17 research records. Quantities and methods
 * are explicit modern production choices, not claims of exact ancient practice.
 */
export const RECIPE_CONTENT_RECORDS: readonly RecipeContentRecord[] = [
  {
    id: 'recipe-content-lentil-pottage',
    recipeResearchId: lentilResearch.id,
    title: 'Lentil Pottage: A Historically Informed Reconstruction',
    classification: lentilResearch.classification,
    introduction:
      'This draft turns the V3C.17 reconstruction concept into a structured editorial recipe while preserving the unresolved historical details.',
    historicalContext: lentilResearch.historicalContext,
    uncertaintyDisclosure: lentilResearch.reconstructionDisclosure,
    ingredients: lentilResearch.ingredients.map((ingredient) => ({
      ...ingredient,
      disclosure:
        ingredient.disclosure ??
        'Any quantity added in a later editorial revision must be identified as a reconstruction choice rather than a verified historical measurement.',
    })),
    preparationSteps: [
      {
        order: 1,
        instruction: 'Draft preparation method intentionally withheld until the research record can support a disclosed reconstruction choice.',
        evidenceLayer: 'practical-adaptation',
        disclosure:
          'The V3C.17 record does not establish one exact historical preparation method.',
      },
    ],
    editorialNotes: [
      'Keep exact proportions, additional ingredients and cooking method visibly unresolved until supported by recorded research.',
    ],
    relatedFoodIds: [...lentilResearch.foodIds],
    productionStatus: 'draft',
    editorialReviewStatus: 'not-started',
    publicationStatus: lentilResearch.publicationStatus,
    publicationEligible: false,
  },
  {
    id: 'recipe-content-unleavened-bread',
    recipeResearchId: breadResearch.id,
    title: 'Unleavened Bread: An Evidence-Aware Reconstruction',
    classification: breadResearch.classification,
    introduction:
      'This draft provides a content-production shell for a later reconstruction without claiming that one exact biblical recipe is known.',
    historicalContext: breadResearch.historicalContext,
    uncertaintyDisclosure: breadResearch.reconstructionDisclosure,
    ingredients: breadResearch.ingredients.map((ingredient) => ({
      ...ingredient,
      disclosure:
        ingredient.disclosure ??
        'Any flour, water or quantity choice requires an explicit distinction between evidence and modern practical adaptation.',
    })),
    preparationSteps: [
      {
        order: 1,
        instruction: 'No exact preparation method is asserted by this production seed.',
        evidenceLayer: 'practical-adaptation',
        disclosure:
          'A later cooking method must be disclosed as inferred or practically adapted unless direct evidence is recorded.',
      },
    ],
    editorialNotes: [
      'Do not convert this content shell into a claim of one historically verified recipe without additional research.',
    ],
    relatedFoodIds: [...breadResearch.foodIds],
    productionStatus: 'draft',
    editorialReviewStatus: 'not-started',
    publicationStatus: breadResearch.publicationStatus,
    publicationEligible: false,
  },
];
