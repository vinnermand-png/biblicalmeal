import { RECIPE_RESEARCH_RECORDS } from '../../recipe-research/records';
import type { RecipeContentRecord } from '../types';

const researchById = new Map(
  RECIPE_RESEARCH_RECORDS.map((record) => [record.id, record]),
);

const bitterHerbsResearch = researchById.get('recipe-bitter-herbs');
if (!bitterHerbsResearch) {
  throw new Error(
    'V3C.44G bitter herbs content requires the canonical research record.',
  );
}

/**
 * V3C.44G — Bitter Herbs recipe content.
 *
 * This recipe is classified as scripture-inspired-preparation.
 * Bitter herbs (Hebrew: marorim) are commanded as part of the
 * Passover meal in Exodus 12:8. The biblical text explicitly
 * commands "bitter herbs" but does not identify the specific plant
 * or plants. The Hebrew word marorim is a category term for bitter
 * plants, not a specific botanical identification.
 *
 * CRITICAL: This recipe does NOT assert any single plant as
 * "the biblical bitter herb." It presents a selection of available
 * bitter greens as a modern interpretation of the biblical command,
 * with the historical plant identification remaining genuinely
 * uncertain.
 *
 * The Mishnah (Pesachim 2:6) lists specific plants, but these
 * represent post-biblical rabbinical tradition, not proof of the
 * original identification. This recipe clearly distinguishes the
 * biblical text from later tradition.
 *
 * Evidence boundaries:
 * - Bitter herbs commanded: directly attested (Exodus 12:8, Numbers 9:11)
 * - marorim as category: inferred
 * - Specific plant identification: unresolved
 * - Modern serving preparation: practical adaptation
 *
 * Research status remains 'in-progress' per V3C.44G lifecycle rule.
 */
export const BITTER_HERBS_CONTENT: RecipeContentRecord = {
  id: 'recipe-content-bitter-herbs',
  recipeResearchId: bitterHerbsResearch.id,
  title: 'Bitter Herbs — A Passover-Inspired Preparation',
  slug: 'bitter-herbs',
  metaDescription:
    'A modern preparation of bitter greens inspired by the Passover command in Exodus 12:8, acknowledging the genuine uncertainty about which specific plants the biblical text intended.',
  classification: bitterHerbsResearch.classification,
  introduction:
    'Bitter herbs (Hebrew: marorim) are commanded as part of the Passover meal in Exodus 12:8: "And they shall eat the flesh in that night, roast with fire, and unleavened bread; and with bitter herbs they shall eat it." The Hebrew word marorim is a category term for bitter plants — not a specific botanical identification. No single plant is definitively established by the biblical text as "the" bitter herb. This recipe presents a selection of available bitter greens as a modern interpretation of the biblical command, honouring the Passover tradition while acknowledging the genuine uncertainty about plant identification.',
  historicalContext: bitterHerbsResearch.historicalContext,
  uncertaintyDisclosure: bitterHerbsResearch.reconstructionDisclosure,
  ingredients: [
    {
      foodId: 'bitter-herbs',
      label:
        'Mixed bitter greens (such as endive, dandelion greens, and arugula)',
      quantity: '200 g (about 4 cups, loosely packed)',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'The specific bitter greens are a modern choice. The biblical text commands "bitter herbs" (marorim) as a category but does not identify the specific plant or plants. Any selection of bitter greens is a modern interpretation, not a claim about the original Passover bitter herbs.',
    },
    {
      label: 'Extra-virgin olive oil',
      quantity: '2 tbsp',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Olive oil is a modern dressing choice. Olive oil is attested in the biblical period (Deuteronomy 8:8) but its use as a dressing for bitter herbs is a modern adaptation.',
    },
    {
      label: 'Fresh lemon juice',
      quantity: '1 tbsp',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Lemon is a modern dressing choice. Citrus was not common in the ancient Near East, so this is explicitly a modern adaptation.',
    },
    {
      label: 'Salt',
      quantity: 'Pinch',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Salt is a modern seasoning choice. Salt was widely available in the ancient Near East, but the exact quantity is a practical adaptation.',
    },
  ],
  preparationSteps: [
    {
      order: 1,
      instruction:
        'Wash the bitter greens thoroughly under cold running water. Remove any tough stems or wilted leaves. Pat dry with a clean towel or use a salad spinner.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Washing and preparation are modern kitchen steps. The biblical text provides no preparation instructions for the bitter herbs.',
    },
    {
      order: 2,
      instruction:
        'Tear or chop the greens into bite-sized pieces. If using endive, separate the leaves. If using dandelion greens or arugula, roughly chop them.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Cutting and portioning are modern preparation choices. The biblical text does not describe how the bitter herbs were prepared for serving.',
    },
    {
      order: 3,
      instruction:
        'Arrange the bitter greens on a serving plate or in a shallow bowl. Drizzle with olive oil and lemon juice. Sprinkle with a pinch of salt and toss gently to coat.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'The dressing (olive oil, lemon, salt) is a modern serving choice. The biblical text does not describe how the bitter herbs were seasoned or served.',
    },
    {
      order: 4,
      instruction:
        'Serve immediately alongside unleavened bread and other Passover foods, in keeping with the command in Exodus 12:8.',
      evidenceLayer: 'inferred',
      disclosure:
        'The serving context (alongside Passover foods) is inferred from the biblical command in Exodus 12:8. The specific combination of foods on a modern table is a practical adaptation.',
    },
  ],
  servings: '4 servings as a side',
  timingGuidance: 'Preparation: 10 minutes. Total: approximately 10 minutes.',
  servingGuidance:
    'Serve as part of a Passover meal alongside unleavened bread, roasted meat, and other traditional foods. The bitterness of the greens is a reminder of the Passover story — the bitterness of slavery in Egypt.',
  editorialNotes: [
    'This recipe is classified as scripture-inspired-preparation — a modern kitchen creation honouring the Passover command for bitter herbs (Exodus 12:8).',
    'CRITICAL: This recipe does NOT assert any single plant as "the biblical bitter herb." The Hebrew word marorim is a category term for bitter plants. The specific plant identification remains genuinely uncertain.',
    'The Mishnah (Pesachim 2:6) lists specific plants — including chicory, endive, and others — but these represent post-biblical rabbinical tradition, not proof of the original identification. This recipe does not treat the Mishnaic list as direct biblical evidence.',
    'Any selection of bitter greens is a modern interpretation of the biblical command. The recipe presents available bitter greens as a practical modern choice, not a historical reconstruction.',
    'The Passover context requires careful, respectful treatment. This recipe treats the bitter herbs as a food/cultural preparation, not a theological claim.',
    'Research status remains in-progress. The unresolved questions (specific plant, Mishnah relationship, single vs. mixture, broader tradition, modern seder relation) are documented in the canonical research record.',
  ],
  relatedFoodIds: [...bitterHerbsResearch.foodIds],
  productionStatus: 'draft',
  editorialReviewStatus: 'not-started',
  publicationStatus: bitterHerbsResearch.publicationStatus,
  publicationEligible: false,
};
