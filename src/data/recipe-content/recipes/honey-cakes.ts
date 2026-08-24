import { RECIPE_RESEARCH_RECORDS } from '../../recipe-research/records';
import type { RecipeContentRecord } from '../types';

const researchById = new Map(
  RECIPE_RESEARCH_RECORDS.map((record) => [record.id, record]),
);

const honeyResearch = researchById.get('recipe-honey-cakes');
if (!honeyResearch) {
  throw new Error(
    'V3C.44G honey cakes content requires the canonical research record.',
  );
}

/**
 * V3C.44G — Honey Cakes recipe content.
 *
 * This recipe is classified as scripture-inspired-preparation.
 * Honey is one of the seven species of Israel (Deuteronomy 8:8)
 * and appears in food preparation contexts (Exodus 16:31, 2 Sam 6:19).
 * This recipe is a modern kitchen creation that uses honey as a
 * sweetener in a baked grain preparation — a modern interpretation
 * of the biblical attestation of honey and baked goods.
 *
 * CRITICAL: The Hebrew words translated as "cake" (uggoth, ishshah)
 * refer to baked grain preparations — flatbreads, round cakes, or
 * baked goods — NOT modern pastry cakes. This recipe is a modern
 * creation using honey in a baked preparation. It does not replicate
 * a specific biblical cake form.
 *
 * Evidence boundaries:
 * - Honey as food: directly attested (Deut 8:8)
 * - Honey in food preparation: directly attested (Exod 16:31)
 * - Cakes as food item: directly attested (2 Sam 6:19)
 * - Honey + grain combination: inferred
 * - Specific recipe: modern adaptation
 *
 * Research status remains 'in-progress' per V3C.44G lifecycle rule.
 */
export const HONEY_CAKES_CONTENT: RecipeContentRecord = {
  id: 'recipe-content-honey-cakes',
  recipeResearchId: honeyResearch.id,
  title: 'Honey Cakes — A Scripture-Inspired Preparation',
  slug: 'honey-cakes',
  metaDescription:
    'A modern honey cake recipe inspired by the biblical attestation of honey as one of the seven species of Israel, with honey referenced in food preparation contexts throughout the Hebrew Bible.',
  classification: honeyResearch.classification,
  introduction:
    'Honey is one of the seven species of the Land of Israel (Deuteronomy 8:8) and appears throughout the biblical text as both a food and a symbol of abundance. Exodus 16:31 compares manna to "wafers made with honey," and 2 Samuel 6:19 records David distributing "a cake of bread" among the people. The Hebrew word for "cake" (uggoth/ishshah) refers to baked grain preparations — not modern pastry cakes. This recipe is a modern kitchen creation that uses honey as a sweetener in a baked grain preparation, honouring the biblical attestation of honey without claiming to replicate an ancient preparation.',
  historicalContext: honeyResearch.historicalContext,
  uncertaintyDisclosure: honeyResearch.reconstructionDisclosure,
  ingredients: [
    {
      foodId: 'honey-entity',
      label: 'Honey',
      quantity: '1/2 cup (170 g)',
      provenance: 'directly-attested',
      evidenceLayer: 'directly-attested',
      disclosure:
        'Honey is explicitly named as one of the seven species in Deuteronomy 8:8. Whether "honey" (dvash) in the biblical text refers to bee honey, date syrup, or both is a longstanding scholarly question. The choice of bee honey here is a modern practical decision.',
    },
    {
      label: 'Plain flour (all-purpose)',
      quantity: '2 cups (250 g)',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Flour type and quantity are modern kitchen choices. The biblical text does not specify a grain base for sweet baked preparations.',
    },
    {
      label: 'Olive oil',
      quantity: '1/4 cup (60 ml)',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Olive oil is a modern fat choice. Olive oil is attested in the biblical period (Deuteronomy 8:8) but its use in this specific recipe is a modern adaptation.',
    },
    {
      label: 'Eggs',
      quantity: '2 large',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Eggs are a modern binding and leavening ingredient. Eggs are attested in the biblical period but are not mentioned in connection with honey cakes.',
    },
    {
      label: 'Baking powder',
      quantity: '1 tsp',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Baking powder is a modern leavening agent. Whether the biblical "cakes" were leavened or unleavened is not specified.',
    },
    {
      label: 'Salt',
      quantity: '1/4 tsp',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Salt is a modern seasoning choice. Salt was widely available in the ancient Near East, but the exact quantity is a practical adaptation.',
    },
    {
      label: 'Ground cinnamon',
      quantity: '1 tsp',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Cinnamon is a modern flavouring choice. Cinnamon is mentioned in the Bible (Exodus 30:23) as a spice, but its use in this specific recipe is a modern adaptation.',
    },
  ],
  preparationSteps: [
    {
      order: 1,
      instruction:
        'Preheat the oven to 175°C (350°F). Grease a square baking tin (20 cm / 8 inches) with olive oil or line with baking paper.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Oven temperature and tin size are modern kitchen choices. Ancient baked preparations were likely cooked in clay ovens or on heated stones.',
    },
    {
      order: 2,
      instruction:
        'In a large bowl, whisk together the honey, olive oil and eggs until smooth. The mixture should be thick and glossy.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'This mixing method is a modern kitchen technique. The combination of honey and oil in a baked preparation is inspired by the biblical attestation of both ingredients.',
    },
    {
      order: 3,
      instruction:
        'Sift the flour, baking powder, salt and cinnamon into the wet ingredients. Fold gently until just combined — do not overmix.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'The dry ingredient combination and mixing technique are modern choices. The biblical text provides no recipe instructions.',
    },
    {
      order: 4,
      instruction:
        'Pour the batter into the prepared tin and spread evenly. Bake for 25-30 minutes, until golden on top and a skewer inserted in the centre comes out clean.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Baking time and method are modern kitchen adaptations. The golden colour and skewer test are modern doneness indicators.',
    },
    {
      order: 5,
      instruction:
        'Let cool in the tin for 10 minutes, then turn out onto a wire rack. Serve warm or at room temperature, drizzled with a little extra honey if desired.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Cooling method and serving suggestion are modern choices. The extra honey drizzle is a modern presentation choice.',
    },
  ],
  servings: '9-12 small cakes',
  timingGuidance:
    'Preparation: 10 minutes. Baking: 25-30 minutes. Cooling: 10 minutes. Total: approximately 50 minutes.',
  servingGuidance:
    'Serve as a snack or light dessert. These honey cakes are best enjoyed fresh on the day of baking. They pair well with tea or alongside fresh fruit.',
  editorialNotes: [
    'This recipe is classified as scripture-inspired-preparation — a modern kitchen creation using honey, one of the seven species of Israel (Deuteronomy 8:8), as a sweetener in a baked grain preparation.',
    'CRITICAL: The Hebrew words translated as "cake" (uggoth, ishshah) refer to baked grain preparations — flatbreads, round cakes, or baked goods — NOT modern pastry cakes. This recipe is a modern creation. It does not replicate a specific biblical cake form.',
    'Honey is explicitly named in Deuteronomy 8:8 and used in food preparation contexts (Exodus 16:31). Whether "honey" (dvash) refers to bee honey or date syrup is unresolved in the scholarship.',
    'The specific recipe (proportions, ingredients, method) is a modern adaptation. No "honey cake recipe" exists in the biblical text.',
    'Research status remains in-progress. The unresolved questions (honey identification, cake form, combination evidence, grain base, modern relation) are documented in the canonical research record.',
  ],
  relatedFoodIds: [...honeyResearch.foodIds],
  productionStatus: 'draft',
  editorialReviewStatus: 'not-started',
  publicationStatus: honeyResearch.publicationStatus,
  publicationEligible: false,
};
