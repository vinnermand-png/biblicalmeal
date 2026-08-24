import { RECIPE_RESEARCH_RECORDS } from '../../recipe-research/records';
import type { RecipeContentRecord } from '../types';

const researchById = new Map(
  RECIPE_RESEARCH_RECORDS.map((record) => [record.id, record]),
);

const ezekielResearch = researchById.get('recipe-ezekiel-bread');
if (!ezekielResearch) {
  throw new Error(
    'V3C.44E Ezekiel bread content requires the canonical research record.',
  );
}

/**
 * V3C.44E — Ezekiel Bread recipe content.
 *
 * This recipe is classified as historically-informed-reconstruction.
 * Ezekiel 4:9 explicitly names five ingredients but provides no
 * proportions, quantities, or cooking instructions. The passage
 * describes a siege/emergency bread — a deliberate act of prophetic
 * symbolism, not a daily recipe.
 *
 * Research status remains 'in-progress' per V3C.44E lifecycle rule.
 * Content production and research-state progression are separate concerns.
 *
 * CRITICAL: This recipe does NOT represent the modern commercial
 * "Ezekiel bread" product as historical evidence. The commercial product
 * is a modern interpretation, not a historical reconstruction.
 *
 * Evidence boundaries:
 * - Five ingredients: directly attested in Ezekiel 4:9 (KJV)
 * - Siege/emergency context: inferred from surrounding passage
 * - Proportions, cooking method: modern adaptation
 * - Translation questions: documented as unresolved
 */
export const EZEKIEL_BREAD_CONTENT: RecipeContentRecord = {
  id: 'recipe-content-ezekiel-bread',
  recipeResearchId: ezekielResearch.id,
  title: 'Ezekiel Bread — A Historically Informed Reconstruction',
  slug: 'ezekiel-bread',
  metaDescription:
    'A historically informed reconstruction of the multi-grain bread described in Ezekiel 4:9, drawing on the explicit biblical text and acknowledging the siege/prophetic context of the passage.',
  classification: ezekielResearch.classification,
  introduction:
    'Ezekiel 4:9 describes a bread made from a mixture of grains and legumes: wheat, barley, beans (or lentils depending on translation), spelt (or vetch), and millet. The passage places this bread in a prophetic and siege context — God instructs Ezekiel to prepare it as a sign-act representing the bread the Israelites would eat during the siege of Jerusalem. This is not a daily bread recipe but a deliberate, symbolically loaded emergency food. This recipe is a historically informed reconstruction — it preserves the multi-grain concept from Ezekiel 4:9 while acknowledging that the passage provides no proportions, quantities, or cooking instructions.',
  historicalContext: ezekielResearch.historicalContext,
  uncertaintyDisclosure: ezekielResearch.reconstructionDisclosure,
  ingredients: [
    {
      foodId: 'wheat',
      label: 'Wheat flour',
      quantity: '1/2 cup (60 g)',
      provenance: 'directly-attested',
      evidenceLayer: 'directly-attested',
      disclosure:
        'Wheat is explicitly named in Ezekiel 4:9 (KJV). The quantity and flour type are modern choices.',
    },
    {
      foodId: 'barley',
      label: 'Barley flour',
      quantity: '1/2 cup (60 g)',
      provenance: 'directly-attested',
      evidenceLayer: 'directly-attested',
      disclosure:
        'Barley is explicitly named in Ezekiel 4:9 (KJV). The quantity and flour type are modern choices.',
    },
    {
      foodId: 'beans',
      label: 'Cooked lentils (mashed)',
      quantity: '1/2 cup (100 g)',
      provenance: 'historically-inferred',
      evidenceLayer: 'inferred',
      disclosure:
        'KJV translates the Hebrew "pol" as "beans." Other translations may read "lentils." The identification is inferred from translation. Cooked lentils are used here as a practical modern interpretation of the ingredient.',
    },
    {
      foodId: 'spelt',
      label: 'Spelt flour',
      quantity: '1/4 cup (30 g)',
      provenance: 'historically-inferred',
      evidenceLayer: 'inferred',
      disclosure:
        'KJV translates "kussemeth" as "fitches" (a type of spelt or vetch). The exact plant identification remains debated among translators. Spelt flour is used here as a practical modern interpretation.',
    },
    {
      foodId: 'millet',
      label: 'Millet flour',
      quantity: '1/4 cup (30 g)',
      provenance: 'directly-attested',
      evidenceLayer: 'directly-attested',
      disclosure:
        'Millet is explicitly named in Ezekiel 4:9 (KJV). The quantity and flour type are modern choices.',
    },
    {
      label: 'Warm water',
      quantity: '1 cup (240 ml)',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Water quantity is a modern kitchen choice. The biblical text provides no proportions.',
    },
    {
      label: 'Active dry yeast',
      quantity: '1 tsp',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Yeast is a modern convenience for leavening. Whether the Ezekiel 4:9 bread was leavened or unleavened is not specified in the text.',
    },
    {
      label: 'Honey',
      quantity: '1 tbsp',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Honey is a modern addition for flavour and to feed the yeast. Honey is attested in the biblical period (Deuteronomy 8:8) but is not mentioned in Ezekiel 4:9.',
    },
    {
      label: 'Salt',
      quantity: '1/2 tsp',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Salt is a modern seasoning choice. Salt is not mentioned in Ezekiel 4:9.',
    },
    {
      label: 'Olive oil',
      quantity: '2 tbsp',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Olive oil is a modern addition for moisture. Olive oil is attested in the biblical period but is not mentioned in Ezekiel 4:9.',
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
        'In a large bowl, combine the wheat flour, barley flour, spelt flour and millet flour. Add the yeast mixture, olive oil, salt, and mashed cooked lentils. Stir until a shaggy dough forms.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'The flour combination, quantities, and mixing method are modern choices. The biblical text instructs to "put them in one vessel" but provides no specific method.',
    },
    {
      order: 3,
      instruction:
        'Turn the dough onto a lightly floured surface and knead for 8-10 minutes, until smooth and elastic. The multi-grain dough will be denser than pure wheat dough — this is expected.',
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
        'Rising time is a modern convenience using commercial yeast. Whether the Ezekiel 4:9 bread was leavened is not specified.',
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
        'Bake for 30-35 minutes, until the bread is golden brown and sounds hollow when tapped on the bottom. Let cool slightly before serving.',
      evidenceLayer: 'practical-adaptation',
      disclosure: 'Baking time and method are modern kitchen adaptations.',
    },
  ],
  servings: '6-8 rolls or 1 round loaf',
  timingGuidance:
    'Preparation: 15 minutes. Rising: 1 hour. Baking: 30-35 minutes. Total: approximately 1 hour 50 minutes.',
  servingGuidance:
    "Serve warm with olive oil or alongside stews. The dense, multi-grain texture is consistent with the passage's description of emergency bread — a deliberate contrast to normal, refined bread.",
  editorialNotes: [
    'This recipe is classified as historically-informed-reconstruction. Ezekiel 4:9 explicitly names five ingredients but provides no proportions, quantities, or cooking instructions.',
    'CRITICAL: This recipe does NOT represent the modern commercial "Ezekiel bread" product as historical evidence. The commercial product (popularized by Food for Life) is a modern interpretation, not a historical reconstruction. Any biblical-era version would have been vastly different — likely a coarse, dense flatbread rather than a sliced loaf.',
    'The passage describes a siege/emergency bread — a deliberate act of prophetic symbolism, not a daily recipe. Ezekiel 4:10-15 describes eating it by weight and with impure water, reinforcing the emergency context.',
    'The translation of "beans" (Hebrew: pol) and "fitches/vetch" (Hebrew: kussemeth) varies between translations. KJV uses "beans" and "fitches"; some modern translations use "lentils" and "spelt." This recipe uses the KJV interpretation.',
    'All proportions, cooking methods, and equipment are modern practical choices. The biblical text provides none of these details.',
    'Research status remains in-progress. The unresolved questions (translation choice, proportions, cooking method, siege context, modern product relationship) are documented in the canonical research record.',
  ],
  relatedFoodIds: [...ezekielResearch.foodIds],
  productionStatus: 'draft',
  editorialReviewStatus: 'not-started',
  publicationStatus: ezekielResearch.publicationStatus,
  publicationEligible: false,
};
