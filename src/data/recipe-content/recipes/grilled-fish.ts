import { RECIPE_RESEARCH_RECORDS } from '../../recipe-research/records';
import type { RecipeContentRecord } from '../types';

const researchById = new Map(
  RECIPE_RESEARCH_RECORDS.map((record) => [record.id, record]),
);

const fishResearch = researchById.get('recipe-grilled-fish');
if (!fishResearch) {
  throw new Error(
    'V3C.44C grilled fish content requires the canonical V3C.44B research record.',
  );
}

/**
 * V3C.44C — Grilled Fish recipe content.
 *
 * This recipe is classified as scripture-inspired-preparation.
 * It draws on the explicitly attested fish consumption in Luke 24:42-43
 * while presenting the preparation as a modern kitchen creation.
 *
 * Evidence boundaries:
 * - Fish consumption: directly attested (Luke 24:42-43)
 * - Grilling/broiling method: inferred from Greek "optos"
 * - Fish species: unresolved (modern choice)
 * - Seasonings: modern adaptation
 */
export const GRILLED_FISH_CONTENT: RecipeContentRecord = {
  id: 'recipe-content-grilled-fish',
  recipeResearchId: fishResearch.id,
  title: 'Grilled Fish — A Scripture-Inspired Preparation',
  slug: 'grilled-fish',
  metaDescription:
    'A modern grilled fish recipe inspired by the biblical attestation of fish consumption in Luke 24:42-43, where the risen Jesus eats broiled fish with his disciples.',
  classification: fishResearch.classification,
  introduction:
    'Fish is one of the most explicitly attested foods in the Gospel narratives. Luke 24:42-43 records the risen Jesus eating broiled fish with his disciples — the most direct explicit eating reference for Jesus in the Gospels. This recipe honors that ancient tradition as a modern kitchen creation, not a historical reconstruction.',
  historicalContext: fishResearch.historicalContext,
  uncertaintyDisclosure: fishResearch.reconstructionDisclosure,
  ingredients: [
    {
      foodId: 'fish-entity',
      label: 'Whole fish or fillets (such as tilapia, sea bass, or trout)',
      quantity: '4 pieces (about 170 g each)',
      provenance: 'directly-attested',
      evidenceLayer: 'directly-attested',
      disclosure:
        'Fish consumption is explicitly attested in Luke 24:42-43. The specific species is a modern choice — archaeological evidence suggests tilapia, carp, and sardines were common in the Sea of Galilee.',
    },
    {
      label: 'Olive oil',
      quantity: '2 tbsp',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Olive oil is a modern seasoning choice. Olive oil production is attested in the biblical period, but its use for grilling fish in this specific way is a modern adaptation.',
    },
    {
      label: 'Salt',
      quantity: '1 tsp',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Salt quantity is a modern kitchen choice. Salt was widely available in the ancient Near East, but the exact seasoning approach for this recipe is a practical adaptation.',
    },
    {
      label: 'Ground cumin',
      quantity: '1/2 tsp',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Cumin is a modern seasoning choice. Cumin is mentioned in the Bible (Isaiah 28:25-27), but its use in this specific recipe is a modern adaptation.',
    },
    {
      label: 'Fresh lemon',
      quantity: '1, cut into wedges',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Lemon is a modern serving choice. Citrus was not common in the ancient Near East, so this is explicitly a modern adaptation.',
    },
    {
      label: 'Fresh parsley, chopped',
      quantity: 'Small handful',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Fresh parsley is a modern garnish choice for presentation and is not part of the biblical evidence.',
    },
  ],
  preparationSteps: [
    {
      order: 1,
      instruction:
        'Pat the fish dry with paper towels. Rub with olive oil, then season with salt and cumin on both sides.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'This preparation method is a modern kitchen choice. The Greek word "optos" in Luke 24:42 suggests roasted or cooked over fire, but the specific technique is not detailed in the text.',
    },
    {
      order: 2,
      instruction:
        'Preheat a grill or grill pan to medium-high heat. If using a charcoal grill, the coals should be glowing with a thin layer of ash.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Modern grill equipment is used here. The ancient preparation likely involved open fire or heated stones, but the exact method is not specified in the biblical text.',
    },
    {
      order: 3,
      instruction:
        'Place the fish on the grill. Cook for 4-5 minutes per side, until the flesh is opaque and flakes easily with a fork. Avoid moving the fish too early — let it release naturally from the grates.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Cooking times and techniques are modern adaptations. The biblical text does not provide specific cooking instructions.',
    },
    {
      order: 4,
      instruction:
        'Transfer the fish to a serving platter. Squeeze fresh lemon juice over the top and garnish with chopped parsley.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Lemon and parsley are modern serving choices. The Luke 24 passage mentions honey alongside the fish but does not describe additional seasonings.',
    },
  ],
  servings: '4',
  timingGuidance:
    'Preparation: 10 minutes. Cooking: 8-10 minutes. Total: approximately 20 minutes.',
  servingGuidance:
    'Serve immediately while warm. This recipe pairs well with simple bread and fresh vegetables — a combination that echoes the everyday meals of the biblical world.',
  editorialNotes: [
    'This recipe is classified as scripture-inspired-preparation — a modern kitchen creation that draws on the explicitly attested fish consumption in Luke 24:42-43.',
    'The recipe does not claim to replicate the specific fish preparation that Jesus ate. It honors the ancient tradition while using modern ingredients and methods.',
    'The Greek word "optos" (Luke 24:42) suggests roasted or cooked over fire, which is consistent with the grilling approach used here.',
    'Do not present this as a historical reconstruction — it is a modern preparation inspired by biblical food traditions.',
  ],
  relatedFoodIds: [...fishResearch.foodIds],
  productionStatus: 'draft',
  editorialReviewStatus: 'not-started',
  publicationStatus: fishResearch.publicationStatus,
  publicationEligible: false,
};
