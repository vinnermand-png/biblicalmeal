import { RECIPE_RESEARCH_RECORDS } from '../recipe-research/records';
import type { RecipeContentRecord } from './types';
import { GRILLED_FISH_CONTENT } from './recipes/grilled-fish';
import { BARLEY_BREAD_CONTENT } from './recipes/barley-bread';
import { WHEAT_FLATBREAD_CONTENT } from './recipes/wheat-flatbread';

const researchById = new Map(
  RECIPE_RESEARCH_RECORDS.map((record) => [record.id, record]),
);

const lentilResearch = researchById.get('recipe-lentil-pottage');
const breadResearch = researchById.get('recipe-unleavened-bread');

if (!lentilResearch || !breadResearch) {
  throw new Error(
    'V3C.18 recipe content seeds require the canonical V3C.17 research records.',
  );
}

/**
 * V3C.18 + V3C.44C — Recipe Content Records.
 *
 * The V3C.17 → V3C.18 pipeline is preserved: research records own evidence
 * and reconstruction; content records own practical quantities and steps.
 *
 * V3C.44C Wave 1 adds three scripture-inspired-preparation recipes
 * (Grilled Fish, Barley Bread, Wheat Flatbread) alongside the original
 * two historically-informed-reconstruction drafts.
 *
 * All records are intentionally draft and non-public. The practical
 * quantities and timings are modern kitchen choices, not recovered ancient
 * measurements or exact biblical preparation instructions.
 */
export const RECIPE_CONTENT_RECORDS: readonly RecipeContentRecord[] = [
  // ─── V3C.18 ORIGINAL SEEDS ──────────────────────────────────────────
  {
    id: 'recipe-content-lentil-pottage',
    recipeResearchId: lentilResearch.id,
    title: 'Lentil Pottage: A Historically Informed Reconstruction',
    slug: 'lentil-pottage-reconstruction',
    metaDescription:
      'An internal, evidence-aware lentil pottage reconstruction draft that separates biblical food context from modern cooking choices.',
    classification: lentilResearch.classification,
    introduction:
      'This draft turns the V3C.17 reconstruction concept into a practical modern-kitchen draft while keeping unresolved historical details explicit.',
    historicalContext: lentilResearch.historicalContext,
    uncertaintyDisclosure: lentilResearch.reconstructionDisclosure,
    ingredients: [
      {
        foodId: 'lentils-entity',
        label: 'Lentils',
        quantity: '1 cup',
        provenance: 'directly-attested',
        evidenceLayer: 'directly-attested',
        disclosure:
          'Lentils are the only canonical food ingredient carried directly from the current research record. The 1-cup quantity is a modern practical adaptation, not a verified ancient measurement.',
      },
      {
        label: 'Water',
        quantity: '3 cups',
        provenance: 'modern-substitution',
        evidenceLayer: 'practical-adaptation',
        disclosure:
          'Water quantity is a modern kitchen choice included for a workable draft and is not claimed as a recovered historical ratio.',
      },
    ],
    preparationSteps: [
      {
        order: 1,
        instruction:
          'Rinse the lentils and combine them with the measured water in a modern saucepan.',
        evidenceLayer: 'practical-adaptation',
        disclosure:
          'The vessel and exact water ratio are modern production choices; the V3C.17 record does not establish one exact historical method.',
      },
      {
        order: 2,
        instruction:
          'Bring to a gentle simmer, then cook until the lentils are soft enough to form a thick, spoonable preparation.',
        evidenceLayer: 'practical-adaptation',
        disclosure:
          'Texture and cooking endpoint are practical reconstruction choices rather than historically verified instructions.',
      },
    ],
    servings: '2 modern servings',
    timingGuidance:
      'Approximately 25-35 minutes in a modern kitchen; timing is an adaptation, not historical evidence.',
    servingGuidance:
      'Serve as a simple modern reconstruction draft without claiming that the exact ancient preparation is known.',
    editorialNotes: [
      'Do not add onions, spices, oil or other ingredients unless a later research record maps their evidence to this specific reconstruction.',
      'Keep modern quantity, timing and vessel choices visibly separated from the historical basis.',
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
    slug: 'unleavened-bread-reconstruction',
    metaDescription:
      'An internal, evidence-aware unleavened bread draft that does not claim one exact biblical formula or ancient cooking method.',
    classification: breadResearch.classification,
    introduction:
      'This draft provides a practical content-production example without claiming that one exact biblical recipe, flour ratio or cooking method is known.',
    historicalContext: breadResearch.historicalContext,
    uncertaintyDisclosure: breadResearch.reconstructionDisclosure,
    ingredients: [
      {
        foodId: 'unleavened-bread-entity',
        label: 'Unleavened bread basis',
        provenance: 'directly-attested',
        evidenceLayer: 'directly-attested',
        disclosure:
          'The canonical research record supports the unleavened-bread concept, but not one exact ingredient formula for this draft.',
      },
      {
        label: 'Modern flour',
        quantity: '2 cups',
        provenance: 'modern-substitution',
        evidenceLayer: 'practical-adaptation',
        disclosure:
          'Flour choice and quantity are modern kitchen adaptations and are not presented as a verified biblical or ancient formula.',
      },
      {
        label: 'Water',
        quantity: '1/2 cup, added gradually',
        provenance: 'modern-substitution',
        evidenceLayer: 'practical-adaptation',
        disclosure:
          'Water ratio is a practical dough-making choice rather than historically verified evidence.',
      },
    ],
    preparationSteps: [
      {
        order: 1,
        instruction:
          'Mix the modern flour with water gradually until a workable unleavened dough forms.',
        evidenceLayer: 'practical-adaptation',
        disclosure:
          'This is a modern preparation method selected for reproducibility, not a claim of one exact ancient technique.',
      },
      {
        order: 2,
        instruction:
          'Divide, flatten, and cook the dough in a modern dry skillet until cooked through.',
        evidenceLayer: 'practical-adaptation',
        disclosure:
          'Shape, vessel and cooking method remain modern reconstruction choices because the current research record does not establish one exact method.',
      },
    ],
    servings: '4 small modern flatbreads',
    timingGuidance:
      'Approximately 20 minutes plus brief resting time; modern adaptation only.',
    servingGuidance:
      'Use this only as a transparent modern reconstruction draft, not as a claim that an exact biblical bread recipe has been recovered.',
    editorialNotes: [
      'The record must not be upgraded to a historically attested recipe without research that supports the selected flour and cooking method.',
      'Keep the distinction between the attested unleavened-bread concept and the modern formula visible to reviewers and future readers.',
    ],
    relatedFoodIds: [...breadResearch.foodIds],
    productionStatus: 'draft',
    editorialReviewStatus: 'not-started',
    publicationStatus: breadResearch.publicationStatus,
    publicationEligible: false,
  },

  // ─── V3C.44C WAVE 1 — SCRIPTURE-INSPIRED PREPARATIONS ──────────────
  GRILLED_FISH_CONTENT,
  BARLEY_BREAD_CONTENT,
  WHEAT_FLATBREAD_CONTENT,
];
