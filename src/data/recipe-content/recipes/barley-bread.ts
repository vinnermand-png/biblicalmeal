import { RECIPE_RESEARCH_RECORDS } from '../../recipe-research/records';
import type { RecipeContentRecord } from '../types';

const researchById = new Map(
  RECIPE_RESEARCH_RECORDS.map((record) => [record.id, record]),
);

const barleyResearch = researchById.get('recipe-barley-bread');
if (!barleyResearch) {
  throw new Error(
    'V3C.44C barley bread content requires the canonical V3C.44B research record.',
  );
}

/**
 * V3C.44C — Barley Bread recipe content.
 *
 * This recipe is classified as scripture-inspired-preparation.
 * It draws on barley being one of the seven species (Deuteronomy 8:8)
 * and barley loaves in John 6:9, while presenting the preparation as
 * a modern kitchen creation.
 *
 * Evidence boundaries:
 * - Barley as bread grain: directly attested (Deuteronomy 8:8, John 6:9)
 * - Bread-making method: inferred from ancient Near Eastern practices
 * - Flour type, proportions, leavening: modern adaptation
 */
export const BARLEY_BREAD_CONTENT: RecipeContentRecord = {
  id: 'recipe-content-barley-bread',
  recipeResearchId: barleyResearch.id,
  title: 'Barley Bread — A Scripture-Inspired Preparation',
  slug: 'barley-bread',
  metaDescription:
    'A modern barley bread recipe inspired by the biblical attestation of barley as one of the seven species of Israel (Deuteronomy 8:8) and barley loaves in John 6:9.',
  classification: barleyResearch.classification,
  introduction:
    'Barley is one of the seven species of the Land of Israel, named alongside wheat, vines, figs, pomegranates, olive oil, and honey in Deuteronomy 8:8. Barley loaves appear in the feeding of the five thousand (John 6:9), where a boy offers five barley loaves and two small fishes. This recipe honors the ancient tradition of barley bread as a modern kitchen creation.',
  historicalContext: barleyResearch.historicalContext,
  uncertaintyDisclosure: barleyResearch.reconstructionDisclosure,
  ingredients: [
    {
      foodId: 'barley',
      label: 'Barley flour (whole grain or hulled)',
      quantity: '2 cups (240 g)',
      provenance: 'directly-attested',
      evidenceLayer: 'directly-attested',
      disclosure:
        'Barley is explicitly attested as a bread grain in Deuteronomy 8:8 and John 6:9. The specific flour type and quantity are modern choices.',
    },
    {
      label: 'All-purpose flour',
      quantity: '1/2 cup (60 g)',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Adding wheat flour is a modern practical choice to improve the bread texture. The biblical text does not specify flour blending.',
    },
    {
      label: 'Active dry yeast',
      quantity: '1 tsp',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Yeast is a modern convenience. Whether barley breads in the biblical period were leavened or unleavened is not specified in the text.',
    },
    {
      label: 'Warm water',
      quantity: '1 cup (240 ml)',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Water quantity is a modern kitchen choice. The biblical text does not provide proportions.',
    },
    {
      label: 'Honey',
      quantity: '1 tbsp',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Honey adds a subtle sweetness and helps feed the yeast. Honey is attested in the biblical period (Deuteronomy 8:8), but its use in this bread recipe is a modern adaptation.',
    },
    {
      label: 'Salt',
      quantity: '1 tsp',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure: 'Salt quantity is a modern kitchen choice.',
    },
    {
      label: 'Olive oil',
      quantity: '2 tbsp',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Olive oil is a modern addition for moisture. Olive oil is attested in the biblical period (Deuteronomy 8:8), but its use in this bread is a practical adaptation.',
    },
  ],
  preparationSteps: [
    {
      order: 1,
      instruction:
        'Combine the warm water, honey and yeast in a bowl. Let stand for 5 minutes until slightly foamy.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'This yeast activation method is a modern kitchen technique. The biblical text does not describe bread-making processes.',
    },
    {
      order: 2,
      instruction:
        'In a large bowl, mix the barley flour, all-purpose flour and salt. Add the yeast mixture and olive oil. Stir until a shaggy dough forms.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'The flour combination and mixing method are modern choices. The specific flour types and ratios are not specified in the biblical text.',
    },
    {
      order: 3,
      instruction:
        'Turn the dough onto a lightly floured surface and knead for 8-10 minutes, until smooth and elastic. Barley flour produces a denser dough than wheat — this is normal.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Kneading technique is a modern bread-making practice. The texture expectations are modern kitchen standards.',
    },
    {
      order: 4,
      instruction:
        'Place the dough in a lightly oiled bowl, cover with a damp cloth, and let rise in a warm spot for about 1 hour, until doubled in size.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Rising time is a modern convenience using commercial yeast. Whether ancient barley breads were leavened is not specified.',
    },
    {
      order: 5,
      instruction:
        'Preheat the oven to 190°C (375°F). Shape the dough into a round loaf or divide into 6-8 smaller rolls. Place on a lined baking tray.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Oven temperature and shaping are modern adaptations. Ancient bread was likely cooked on heated stones or in clay ovens.',
    },
    {
      order: 6,
      instruction:
        'Bake for 25-30 minutes, until the bread is golden brown and sounds hollow when tapped on the bottom. Let cool slightly before serving.',
      evidenceLayer: 'practical-adaptation',
      disclosure: 'Baking time and method are modern kitchen adaptations.',
    },
  ],
  servings: '6-8 rolls or 1 round loaf',
  timingGuidance:
    'Preparation: 15 minutes. Rising: 1 hour. Baking: 25-30 minutes. Total: approximately 1 hour 45 minutes.',
  servingGuidance:
    'Serve warm with olive oil for dipping, or alongside stews and soups. The dense, nutty flavor of barley bread pairs well with the hearty preparations of the ancient Near East.',
  editorialNotes: [
    'This recipe is classified as scripture-inspired-preparation — a modern kitchen creation inspired by the attested use of barley for bread.',
    'Barley is named as one of the seven species in Deuteronomy 8:8 and barley loaves appear in John 6:9. The biblical text confirms barley bread existed but does not provide a recipe.',
    'The modern commercial "Ezekiel bread" is a separate product that draws on Ezekiel 4:9 — a different passage with different ingredients.',
    'Barley flour produces a denser, coarser bread than wheat. This is historically consistent — barley bread was the bread of common people.',
  ],
  relatedFoodIds: [...barleyResearch.foodIds],
  productionStatus: 'draft',
  editorialReviewStatus: 'not-started',
  publicationStatus: barleyResearch.publicationStatus,
  publicationEligible: false,
};
