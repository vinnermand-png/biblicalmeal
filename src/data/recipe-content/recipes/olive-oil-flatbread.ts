import { RECIPE_RESEARCH_RECORDS } from '../../recipe-research/records';
import type { RecipeContentRecord } from '../types';

const researchById = new Map(
  RECIPE_RESEARCH_RECORDS.map((record) => [record.id, record]),
);

const oliveOilResearch = researchById.get('recipe-olive-oil-flatbread');
if (!oliveOilResearch) {
  throw new Error(
    'V3C.44G olive oil flatbread content requires the canonical research record.',
  );
}

/**
 * V3C.44G — Olive Oil Flatbread recipe content.
 *
 * This recipe is classified as scripture-inspired-preparation.
 * Olive oil is one of the seven species of Israel (Deuteronomy 8:8)
 * and is explicitly used in grain preparations (Leviticus 2:4-7,
 * Exodus 29:2-3). Flatbread was the most common bread form in the
 * ancient Near East. This recipe is a modern kitchen creation using
 * attested biblical ingredients and preparation concepts.
 *
 * Evidence boundaries:
 * - Olive oil: directly attested (Deut 8:8, Lev 2:4-7, Exod 29:2-3)
 * - Flatbread concept: inferred from general ancient Near Eastern context
 * - Specific recipe: modern adaptation
 *
 * Research status remains 'in-progress' per V3C.44G lifecycle rule.
 */
export const OLIVE_OIL_FLATBREAD_CONTENT: RecipeContentRecord = {
  id: 'recipe-content-olive-oil-flatbread',
  recipeResearchId: oliveOilResearch.id,
  title: 'Olive Oil Flatbread — A Scripture-Inspired Preparation',
  slug: 'olive-oil-flatbread',
  metaDescription:
    'A modern flatbread recipe inspired by the biblical attestation of olive oil as one of the seven species of Israel, with oil used in grain preparations described in Leviticus 2 and Exodus 29.',
  classification: oliveOilResearch.classification,
  introduction:
    'Olive oil is one of the seven species of the Land of Israel (Deuteronomy 8:8) and was the primary cooking fat of the biblical world. The biblical text explicitly describes oil used in grain preparations: Leviticus 2:4-7 details offerings "mingled with oil" cooked in ovens and pans, and Exodus 29:2-3 specifies unleavened cakes "tempered with oil." Flatbread was the most common bread form in the ancient Near East — simple rounds of dough cooked on heated stones or in clay ovens. This recipe is a modern kitchen creation that honors the biblical attestation of olive oil and flatbread without claiming to replicate an ancient preparation.',
  historicalContext: oliveOilResearch.historicalContext,
  uncertaintyDisclosure: oliveOilResearch.reconstructionDisclosure,
  ingredients: [
    {
      foodId: 'olive-oil',
      label: 'Extra-virgin olive oil',
      quantity: '3 tbsp (45 ml)',
      provenance: 'directly-attested',
      evidenceLayer: 'directly-attested',
      disclosure:
        'Olive oil is explicitly named as one of the seven species in Deuteronomy 8:8 and is used in grain preparations in Leviticus 2:4-7 and Exodus 29:2-3. The quantity is a modern choice.',
    },
    {
      label: 'Plain flour (all-purpose)',
      quantity: '2 cups (250 g)',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Flour type and quantity are modern kitchen choices. The biblical text does not specify a flour for flatbread, though wheat and barley were the primary grains available.',
    },
    {
      label: 'Warm water',
      quantity: '3/4 cup (180 ml)',
      provenance: 'modern-substitution',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Water quantity is a modern kitchen choice. The biblical text provides no proportions for flatbread.',
    },
    {
      label: 'Salt',
      quantity: '1/2 tsp',
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
        'In a large bowl, combine the flour and salt. Make a well in the centre and pour in the olive oil and warm water. Stir with a fork until a shaggy dough forms.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'This mixing method is a modern kitchen technique. The biblical text describes oil used with grain preparations (Leviticus 2:4-7) but provides no specific mixing instructions.',
    },
    {
      order: 2,
      instruction:
        'Turn the dough onto a lightly floured surface and knead for 5-7 minutes, until smooth and pliable. The dough should be soft but not sticky — add a little more flour or water if needed.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Kneading technique is a modern bread-making practice. The texture expectations are modern kitchen standards.',
    },
    {
      order: 3,
      instruction:
        'Divide the dough into 6-8 equal pieces. Roll each piece into a ball, then use a rolling pin to flatten into rounds about 15 cm (6 inches) across and 3 mm thick.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Portion size and shaping are modern choices. Ancient flatbreads varied widely in size and thickness.',
    },
    {
      order: 4,
      instruction:
        'Heat a dry skillet or frying pan over medium-high heat. Cook each flatbread for 1-2 minutes per side, until golden spots appear and the bread is cooked through. Brush lightly with olive oil immediately after cooking.',
      evidenceLayer: 'practical-adaptation',
      disclosure:
        'Skillet cooking is a modern adaptation. Ancient flatbreads were likely cooked on heated stones, in clay ovens, or over open fire. The oil brushing is a modern finishing choice.',
    },
  ],
  servings: '6-8 flatbreads',
  timingGuidance:
    'Preparation: 10 minutes. Resting: 5 minutes. Cooking: 15-20 minutes. Total: approximately 30 minutes.',
  servingGuidance:
    'Serve warm alongside stews, dips, or grilled meats. Olive oil flatbread pairs naturally with the other recipes in this cookbook — it is a versatile staple that echoes the everyday bread of the biblical world.',
  editorialNotes: [
    'This recipe is classified as scripture-inspired-preparation — a modern kitchen creation using olive oil, one of the seven species of Israel (Deuteronomy 8:8), in a flatbread preparation.',
    'Olive oil is explicitly used in grain preparations in Leviticus 2:4-7 and Exodus 29:2-3, providing a strong biblical basis for combining oil with bread.',
    'The specific recipe (proportions, method, cooking technique) is a modern adaptation. No "olive oil flatbread recipe" exists in the biblical text.',
    'The flatbread concept (Hebrew: uggah) was the most common bread form in the ancient Near East, well supported by archaeological evidence.',
    'Research status remains in-progress. The unresolved questions (flour type, everyday vs. ritual use, techniques, modern relation) are documented in the canonical research record.',
  ],
  relatedFoodIds: [...oliveOilResearch.foodIds],
  productionStatus: 'draft',
  editorialReviewStatus: 'not-started',
  publicationStatus: oliveOilResearch.publicationStatus,
  publicationEligible: false,
};
