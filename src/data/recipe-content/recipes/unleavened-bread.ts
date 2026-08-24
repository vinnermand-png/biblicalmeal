import { RECIPE_RESEARCH_RECORDS } from '../../recipe-research/records';
import type { RecipeContentRecord } from '../types';

const researchById = new Map(
  RECIPE_RESEARCH_RECORDS.map((record) => [record.id, record]),
);

const breadResearch = researchById.get('recipe-unleavened-bread');
if (!breadResearch) {
  throw new Error(
    'V3C.44D unleavened bread content requires the canonical research record.',
  );
}

/**
 * V3C.44D — Unleavened Bread recipe content (upgraded from V3C.18 seed).
 *
 * This recipe is classified as historically-informed-reconstruction.
 * The biblical command (Exodus 12:8, Deuteronomy 16:3) provides clear
 * instructions about the concept — bread without leavening — but does
 * not specify exact flour, quantities, or preparation methods.
 *
 * Research status remains 'in-progress' per V3C.44D lifecycle rule.
 * Content production and research-state progression are separate concerns.
 *
 * Evidence boundaries:
 * - Unleavened bread concept: directly attested (Exodus 12:8)
 * - Flour type: unresolved
 * - Cooking method: inferred from archaeological evidence
 * - Quantities and proportions: modern adaptation
 */
export const UNLEAVENED_BREAD_CONTENT: RecipeContentRecord = {
  id: 'recipe-content-unleavened-bread',
  recipeResearchId: breadResearch.id,
  title: 'Unleavened Bread — A Historically Informed Reconstruction',
  slug: 'unleavened-bread',
  metaDescription:
    'A historically informed reconstruction of unleavened bread, drawing on the explicit biblical command in Exodus 12:8 and the archaeological evidence for ancient Near Eastern flatbread preparation.',
  classification: breadResearch.classification,
  introduction:
    'Unleavened bread (Hebrew: matzah) is one of the most explicitly commanded foods in the Hebrew Bible. Exodus 12:8 requires it alongside the Passover lamb: "And they shall eat the flesh in that night, roast with fire, and unleavened bread; and with bitter herbs they shall eat it." Deuteronomy 16:3 reinforces the command during the Feast of Unleavened Bread. This recipe is a historically informed reconstruction — it preserves the biblical concept of bread made without leavening while acknowledging that the exact flour, quantities, and cooking method are not specified in the text.',
  historicalContext: breadResearch.historicalContext,
  uncertaintyDisclosure: breadResearch.reconstructionDisclosure,
  ingredients: [
    {
      foodId: 'unleavened-bread-entity',
      label: 'Plain flour (wheat)',
      quantity: '2 cups (250 g)',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'The biblical text does not specify the flour type. Wheat flour is used here as a modern practical choice. Barley flour or mixed grain would also be historically plausible, but the original Passover preparation does not specify.',
    },
    {
      label: 'Warm water',
      quantity: '3/4 cup (180 ml)',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Water quantity is a modern kitchen choice. The biblical text provides no proportions.',
    },
    {
      label: 'Salt',
      quantity: '1/2 tsp',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Salt is a modern seasoning choice. Salt was available in the ancient Near East, but its use in this specific recipe is a practical adaptation.',
    },
    {
      label: 'Olive oil',
      quantity: '1 tbsp',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Olive oil is a modern addition for moisture and flavour. Olive oil is attested in the biblical period, but its use in this bread is a practical adaptation.',
    },
  ],
  preparationSteps: [
    {
      order: 1,
      instruction:
        'Combine the flour and salt in a bowl. Make a well in the centre and pour in the warm water and olive oil. Stir until a shaggy dough forms.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'The mixing method is a modern kitchen technique. The biblical text does not describe bread-making processes.',
    },
    {
      order: 2,
      instruction:
        'Turn the dough onto a lightly floured surface and knead for 5-6 minutes, until smooth. The dough should be firm but pliable — not sticky.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Kneading technique is a modern bread-making practice. Ancient unleavened bread was likely prepared more simply.',
    },
    {
      order: 3,
      instruction:
        'Divide the dough into 4 equal pieces. Roll each into a ball, then flatten into thin rounds, about 15 cm (6 inches) across and 3-4 mm thick.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'The size and thickness are modern choices. Ancient unleavened breads likely varied in shape and size.',
    },
    {
      order: 4,
      instruction:
        'Heat a dry frying pan or skillet over medium-high heat. Cook each flatbread for 1-2 minutes per side, until lightly charred in spots and cooked through. Do not add oil to the pan.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Modern skillet cooking is used here. Archaeological evidence suggests ancient unleavened bread was cooked on heated stones or in clay ovens.',
    },
    {
      order: 5,
      instruction:
        'Stack the cooked flatbreads and cover with a clean cloth to keep them soft. Serve warm.',
      evidenceLayer: 'practical-adaptation',
      disclosure: 'Serving method is a modern kitchen practice.',
    },
  ],
  servings: '4 flatbreads',
  timingGuidance:
    'Preparation: 10 minutes. Cooking: 8-10 minutes. Total: approximately 20 minutes.',
  servingGuidance:
    'Serve warm alongside stews, soups, or dips. The absence of leavening gives these flatbreads a dense, chewy texture — this is historically consistent with the biblical description of unleavened bread.',
  editorialNotes: [
    'This recipe is classified as historically-informed-reconstruction. The biblical command (Exodus 12:8, Deuteronomy 16:3) provides clear instructions about the concept — bread without leavening — but does not specify exact flour, quantities, or preparation methods.',
    'The flour choice (wheat) is a modern practical decision. The original Passover preparation may have used wheat, barley, or mixed grain — this remains unresolved.',
    'The absence of leavening is the defining characteristic. This recipe contains no yeast, baking powder, or other leavening agent.',
    'Archaeological evidence confirms that flat, unleavened bread was commonly prepared on heated stones or in clay ovens across the ancient Near East.',
    'Research status remains in-progress. The unresolved questions (flour type, cooking method, cultural requirements) are about modern adaptation choices, not missing historical evidence.',
  ],
  relatedFoodIds: [...breadResearch.foodIds],
  productionStatus: 'draft',
  editorialReviewStatus: 'not-started',
  publicationStatus: breadResearch.publicationStatus,
  publicationEligible: false,
};
