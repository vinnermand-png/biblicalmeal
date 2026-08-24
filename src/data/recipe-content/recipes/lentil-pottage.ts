import { RECIPE_RESEARCH_RECORDS } from '../../recipe-research/records';
import type { RecipeContentRecord } from '../types';

const researchById = new Map(
  RECIPE_RESEARCH_RECORDS.map((record) => [record.id, record]),
);

const lentilResearch = researchById.get('recipe-lentil-pottage');
if (!lentilResearch) {
  throw new Error(
    'V3C.44D lentil pottage content requires the canonical research record.',
  );
}

/**
 * V3C.44D — Lentil Pottage recipe content (upgraded from V3C.18 seed).
 *
 * This recipe is classified as historically-informed-reconstruction.
 * Genesis 25:29-34 explicitly names lentils as the primary ingredient
 * and describes a thick, stewed preparation. Beyond lentils, the biblical
 * text provides no specific ingredients, quantities, or cooking instructions.
 *
 * Research status remains 'in-progress' per V3C.44D lifecycle rule.
 * Content production and research-state progression are separate concerns.
 *
 * Evidence boundaries:
 * - Lentils: directly attested (Genesis 25:29-34)
 * - Thick stewed preparation (nazid): inferred from Hebrew word
 * - Additional ingredients: modern adaptation
 * - Quantities and proportions: modern adaptation
 */
export const LENTIL_POTTAGE_CONTENT: RecipeContentRecord = {
  id: 'recipe-content-lentil-pottage',
  recipeResearchId: lentilResearch.id,
  title: 'Lentil Pottage — A Historically Informed Reconstruction',
  slug: 'lentil-pottage',
  metaDescription:
    'A historically informed reconstruction of lentil pottage, drawing on the Genesis 25:29-34 account of Jacob cooking "a pottage of lentiles" and the archaeological evidence for ancient lentil cultivation.',
  classification: lentilResearch.classification,
  introduction:
    'Lentil pottage (Hebrew: nazid) is one of the earliest recorded cooked dishes in the Hebrew Bible. Genesis 25:29-34 describes Jacob cooking "a pottage of lentiles" which Esau exchanged for his birthright. The passage establishes that lentil stew was a recognized, everyday domestic preparation in the patriarchal period. This recipe is a historically informed reconstruction — it preserves the biblical concept of a thick lentil stew while acknowledging that only lentils are explicitly named in the text. All additional ingredients are modern practical choices.',
  historicalContext: lentilResearch.historicalContext,
  uncertaintyDisclosure: lentilResearch.reconstructionDisclosure,
  ingredients: [
    {
      foodId: 'lentils-entity',
      label: 'Brown or green lentils, rinsed',
      quantity: '1 cup (200 g)',
      provenance: 'directly-attested',
      evidenceLayer: 'directly-attested',
      disclosure:
        'Lentils are the only ingredient directly attested in Genesis 25:29-34. The quantity is a modern practical choice.',
    },
    {
      label: 'Water',
      quantity: '3 cups (750 ml)',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Water quantity is a modern kitchen choice. The biblical text provides no proportions.',
    },
    {
      label: 'Olive oil',
      quantity: '2 tbsp',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Olive oil is a modern cooking choice. Olive oil was available in the ancient Near East, but its use in this specific recipe is a practical adaptation.',
    },
    {
      label: 'Onion, finely diced',
      quantity: '1 medium',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Onion is a modern addition for flavour. The Genesis text does not mention onions or any other ingredient besides lentils.',
    },
    {
      label: 'Garlic cloves, minced',
      quantity: '2',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Garlic is a modern addition for flavour. The Genesis text does not mention garlic.',
    },
    {
      label: 'Ground cumin',
      quantity: '1/2 tsp',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Cumin is a modern seasoning choice. Cumin is attested in the ancient Near East, but its use in this recipe is a practical adaptation.',
    },
    {
      label: 'Salt',
      quantity: '1 tsp',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure: 'Salt quantity is a modern kitchen choice.',
    },
    {
      label: 'Black pepper',
      quantity: '1/4 tsp',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Black pepper is a modern seasoning choice not attested in the Genesis context.',
    },
  ],
  preparationSteps: [
    {
      order: 1,
      instruction:
        'Heat the olive oil in a heavy pot over medium heat. Add the onion and cook, stirring occasionally, until softened — about 5 minutes.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'The cooking vessel, oil, and onion are modern choices. The biblical text does not describe the preparation method.',
    },
    {
      order: 2,
      instruction:
        'Add the garlic and cumin. Cook for one minute, until fragrant.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Garlic and cumin are modern additions. The Genesis text mentions only lentils.',
    },
    {
      order: 3,
      instruction:
        'Add the rinsed lentils and water. Bring to a boil, then reduce to a gentle simmer.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'The water quantity and simmering method are modern kitchen choices.',
    },
    {
      order: 4,
      instruction:
        'Simmer uncovered for 25-35 minutes, stirring occasionally, until the lentils are soft and the mixture has thickened into a spoonable pottage. Add a little more water if it becomes too dense.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'The cooking time and texture are modern adaptations. The Hebrew word "nazid" suggests a thick, stewed preparation.',
    },
    {
      order: 5,
      instruction: 'Season with salt and pepper. Taste and adjust seasoning.',
      evidenceLayer: 'practical-adaptation',
      disclosure: 'Seasoning is a modern kitchen choice.',
    },
    {
      order: 6,
      instruction:
        'Serve warm in bowls. The pottage should be thick and spoonable — more like a thick stew than a thin soup.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Serving method is a modern kitchen practice. The texture expectation is informed by the Hebrew word "nazid."',
    },
  ],
  servings: '4',
  timingGuidance:
    'Preparation: 10 minutes. Cooking: 25-35 minutes. Total: approximately 40 minutes.',
  servingGuidance:
    'Serve warm with bread for dipping — a combination that echoes the ancient practice of eating pottage with bread. The thick, hearty texture is consistent with the biblical description of "nazid."',
  editorialNotes: [
    'This recipe is classified as historically-informed-reconstruction. Genesis 25:29-34 explicitly names lentils as the primary ingredient and describes a thick, stewed preparation. Beyond lentils, the biblical text provides no specific ingredients, quantities, or cooking instructions.',
    'Only lentils are directly attested by the biblical passage. All other ingredients (onion, garlic, cumin, salt, pepper) are modern additions chosen for flavour.',
    'The Hebrew word "nazid" (pottage) suggests a thick, stewed preparation. The adjective "adom" (red) applied to Jacob\'s pottage likely refers to the reddish-brown colour of cooked lentils.',
    'Archaeological evidence from Neolithic Galilee sites confirms lentil cultivation in the region as early as the pre-Pottery Neolithic B period (c. 8000-6000 BCE).',
    'Research status remains in-progress. The unresolved questions (additional ingredients, cooking vessel/method, "adom" meaning) are about modern adaptation choices, not missing historical evidence.',
  ],
  relatedFoodIds: [...lentilResearch.foodIds],
  productionStatus: 'draft',
  editorialReviewStatus: 'not-started',
  publicationStatus: lentilResearch.publicationStatus,
  publicationEligible: false,
};
