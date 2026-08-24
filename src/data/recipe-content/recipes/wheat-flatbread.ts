import { RECIPE_RESEARCH_RECORDS } from '../../recipe-research/records';
import type { RecipeContentRecord } from '../types';

const researchById = new Map(
  RECIPE_RESEARCH_RECORDS.map((record) => [record.id, record]),
);

const wheatResearch = researchById.get('recipe-wheat-flatbread');
if (!wheatResearch) {
  throw new Error(
    'V3C.44C wheat flatbread content requires the canonical V3C.44B research record.',
  );
}

/**
 * V3C.44C — Wheat Flatbread recipe content.
 *
 * This recipe is classified as scripture-inspired-preparation.
 * It draws on wheat being one of the seven species (Deuteronomy 8:8)
 * while presenting the preparation as a modern kitchen creation.
 *
 * Evidence boundaries:
 * - Wheat as food: directly attested (Deuteronomy 8:8)
 * - Flatbread tradition: inferred from ancient Near Eastern practices
 * - Flour type, proportions, method: modern adaptation
 */
export const WHEAT_FLATBREAD_CONTENT: RecipeContentRecord = {
  id: 'recipe-content-wheat-flatbread',
  recipeResearchId: wheatResearch.id,
  title: 'Wheat Flatbread — A Scripture-Inspired Preparation',
  slug: 'wheat-flatbread',
  metaDescription:
    'A simple wheat flatbread recipe inspired by the biblical attestation of wheat as one of the seven species of Israel (Deuteronomy 8:8) and the ancient tradition of flatbread preparation.',
  classification: wheatResearch.classification,
  introduction:
    'Wheat is the first species named in Deuteronomy 8:8: "A land of wheat, and barley, and vines, and fig trees, and pomegranates." Wheat bread was the premium bread of the ancient Near East — finer and more valued than barley bread. Flatbread (Hebrew: uggah) was the most common bread form, simple rounds of dough cooked on heated stones or in clay ovens. This recipe honors that ancient tradition as a modern kitchen creation.',
  historicalContext: wheatResearch.historicalContext,
  uncertaintyDisclosure: wheatResearch.reconstructionDisclosure,
  ingredients: [
    {
      foodId: 'wheat',
      label: 'Plain flour (or bread flour)',
      quantity: '2 cups (250 g)',
      provenance: 'directly-attested',
      evidenceLayer: 'directly-attested',
      disclosure:
        'Wheat is explicitly attested as a bread grain in Deuteronomy 8:8. The specific flour type and quantity are modern choices.',
    },
    {
      label: 'Salt',
      quantity: '1/2 tsp',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure: 'Salt quantity is a modern kitchen choice.',
    },
    {
      label: 'Warm water',
      quantity: '3/4 cup (180 ml)',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Water quantity is a modern kitchen choice. The biblical text does not provide proportions.',
    },
    {
      label: 'Olive oil',
      quantity: '2 tbsp, plus extra for brushing',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Olive oil is attested in the biblical period (Deuteronomy 8:8) but its use in this specific bread recipe is a modern adaptation.',
    },
  ],
  preparationSteps: [
    {
      order: 1,
      instruction:
        'Combine the flour and salt in a bowl. Make a well in the centre and pour in the warm water and olive oil. Stir until a soft dough forms.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'The mixing method is a modern kitchen technique. The biblical text does not describe bread-making processes.',
    },
    {
      order: 2,
      instruction:
        'Turn the dough onto a lightly floured surface and knead for 5-6 minutes, until smooth. The dough should be soft but not sticky — add a little more flour if needed.',
      evidenceLayer: 'practical-adaptation',
      disclosure: 'Kneading technique is a modern bread-making practice.',
    },
    {
      order: 3,
      instruction:
        'Divide the dough into 8 equal pieces. Roll each piece into a ball, then flatten with a rolling pin into thin rounds, about 15 cm (6 inches) across and 3 mm thick.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'The size and thickness are modern choices. Ancient flatbreads likely varied in shape and size.',
    },
    {
      order: 4,
      instruction:
        'Heat a dry frying pan or skillet over medium-high heat. Cook each flatbread for 1-2 minutes per side, until puffed and lightly charred in spots. Brush with a little olive oil if desired.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Modern skillet cooking is used here. Ancient flatbreads were likely cooked on heated stones, in clay ovens, or over open fire.',
    },
    {
      order: 5,
      instruction:
        'Stack the cooked flatbreads and cover with a clean cloth to keep them soft. Serve warm.',
      evidenceLayer: 'practical-adaptation',
      disclosure: 'Serving method is a modern kitchen practice.',
    },
  ],
  servings: '8 flatbreads',
  timingGuidance:
    'Preparation: 15 minutes. Cooking: 15-20 minutes. Total: approximately 30-35 minutes.',
  servingGuidance:
    'Serve warm with olive oil, alongside stews, or with dips. The soft, pliable texture makes these flatbreads versatile — use them to scoop up food, wrap fillings, or tear and share at the table.',
  editorialNotes: [
    'This recipe is classified as scripture-inspired-preparation — a modern kitchen creation inspired by the attested use of wheat for bread.',
    'Wheat is named as one of the seven species in Deuteronomy 8:8. The biblical text confirms wheat was used for bread but does not provide a specific recipe.',
    'Flatbread (Hebrew: uggah) was the most common bread form in the ancient Near East. The simple flour-and-water preparation is consistent with historical bread-making.',
    'This recipe does not use leavening, making it similar to the unleavened bread tradition (Exodus 12) — though it is not presented as Passover matzah.',
  ],
  relatedFoodIds: [...wheatResearch.foodIds],
  productionStatus: 'draft',
  editorialReviewStatus: 'not-started',
  publicationStatus: wheatResearch.publicationStatus,
  publicationEligible: false,
};
