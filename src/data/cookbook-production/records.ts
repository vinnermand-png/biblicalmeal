import { RECIPE_CONTENT_RECORDS } from '../recipe-content/records';
import type {
  CookbookRecord,
  CookbookRecipeInclusion,
  CookbookSection,
} from './types';

const recipeContentById = new Map(
  RECIPE_CONTENT_RECORDS.map((record) => [record.id, record]),
);

const lentilRecipe = recipeContentById.get('recipe-content-lentil-pottage');
const unleavenedBreadRecipe = recipeContentById.get(
  'recipe-content-unleavened-bread',
);
const grilledFishRecipe = recipeContentById.get('recipe-content-grilled-fish');
const barleyBreadRecipe = recipeContentById.get('recipe-content-barley-bread');
const wheatFlatbreadRecipe = recipeContentById.get(
  'recipe-content-wheat-flatbread',
);
const ezekielBreadRecipe = recipeContentById.get(
  'recipe-content-ezekiel-bread',
);
const oliveOilFlatbreadRecipe = recipeContentById.get(
  'recipe-content-olive-oil-flatbread',
);
const honeyCakesRecipe = recipeContentById.get('recipe-content-honey-cakes');
const bitterHerbsRecipe = recipeContentById.get('recipe-content-bitter-herbs');

if (
  !lentilRecipe ||
  !unleavenedBreadRecipe ||
  !grilledFishRecipe ||
  !barleyBreadRecipe ||
  !wheatFlatbreadRecipe ||
  !ezekielBreadRecipe ||
  !oliveOilFlatbreadRecipe ||
  !honeyCakesRecipe ||
  !bitterHerbsRecipe
) {
  throw new Error(
    'V3C.30 cookbook seeds require canonical V3C.18 + V3C.44C + V3C.44E + V3C.44G recipe content records.',
  );
}

/**
 * V3C.30 + V3C.44C + V3C.44E + V3C.44G — Cookbook Production Records.
 *
 * The cookbook now includes nine recipes across six sections:
 * - V3C.18 seeds (lentil pottage, unleavened bread)
 * - V3C.44C Wave 1 (grilled fish, barley bread, wheat flatbread)
 * - V3C.44E Wave 3 (ezekiel bread)
 * - V3C.44G Wave 4 (olive oil flatbread, honey cakes, bitter herbs)
 *
 * Inclusion does not promote any draft to published: cookbook production
 * remains separate from recipe ownership, editorial approval and publication.
 */
export const COOKBOOK_RECORDS: readonly CookbookRecord[] = [
  {
    id: 'cookbook-biblicalmeal-first-reconstructions',
    title: 'BiblicalMeal: First Evidence-Aware Reconstructions',
    slug: 'first-evidence-aware-reconstructions',
    description:
      'An internal production cookbook batch that groups the first evidence-aware reconstruction and scripture-inspired drafts while preserving their uncertainty and modern-kitchen adaptation disclosures.',
    productionStatus: 'in-production',
    publicationStatus: 'draft',
    publicationEligible: false,
    sectionIds: [
      'cookbook-section-simple-preparations',
      'cookbook-section-breads-and-grains',
      'cookbook-section-seafood-preparations',
      'cookbook-section-fruits-and-preserves',
      'cookbook-section-herbs-oils-seasonings',
      'cookbook-section-feasts-and-gatherings',
    ],
    recipeContentIds: [
      lentilRecipe.id,
      unleavenedBreadRecipe.id,
      grilledFishRecipe.id,
      barleyBreadRecipe.id,
      wheatFlatbreadRecipe.id,
      ezekielBreadRecipe.id,
      oliveOilFlatbreadRecipe.id,
      honeyCakesRecipe.id,
      bitterHerbsRecipe.id,
    ],
  },
];

export const COOKBOOK_SECTIONS: readonly CookbookSection[] = [
  {
    id: 'cookbook-section-simple-preparations',
    cookbookId: 'cookbook-biblicalmeal-first-reconstructions',
    title: 'Simple Preparations',
    order: 1,
    description:
      'Evidence-aware drafts centered on a simple preparation where exact historical quantities and methods remain explicitly unresolved.',
  },
  {
    id: 'cookbook-section-breads-and-grains',
    cookbookId: 'cookbook-biblicalmeal-first-reconstructions',
    title: 'Breads and Grain Preparations',
    order: 2,
    description:
      'Reconstruction and scripture-inspired drafts that preserve the distinction between an attested food concept and a modern practical formula.',
  },
  {
    id: 'cookbook-section-seafood-preparations',
    cookbookId: 'cookbook-biblicalmeal-first-reconstructions',
    title: 'Seafood Preparations',
    order: 3,
    description:
      'Scripture-inspired recipes drawing on the attested fish consumption in the Gospels.',
  },
  {
    id: 'cookbook-section-fruits-and-preserves',
    cookbookId: 'cookbook-biblicalmeal-first-reconstructions',
    title: 'Fruits and Preserves',
    order: 4,
    description:
      'Scripture-inspired recipes using honey and fruit — foods attested as part of the seven species of Israel.',
  },
  {
    id: 'cookbook-section-herbs-oils-seasonings',
    cookbookId: 'cookbook-biblicalmeal-first-reconstructions',
    title: 'Herbs, Oils and Seasonings',
    order: 5,
    description:
      'Scripture-inspired recipes centred on olive oil and seasonings — staples of the biblical kitchen.',
  },
  {
    id: 'cookbook-section-feasts-and-gatherings',
    cookbookId: 'cookbook-biblicalmeal-first-reconstructions',
    title: 'Feasts and Gatherings',
    order: 6,
    description:
      'Recipes honouring the biblical feast traditions, including Passover preparations.',
  },
];

export const COOKBOOK_RECIPE_INCLUSIONS: readonly CookbookRecipeInclusion[] = [
  {
    cookbookId: 'cookbook-biblicalmeal-first-reconstructions',
    sectionId: 'cookbook-section-simple-preparations',
    recipeContentId: lentilRecipe.id,
    order: 1,
    productionStatus: lentilRecipe.productionStatus,
    editorialReviewStatus: lentilRecipe.editorialReviewStatus,
    publicationStatus: lentilRecipe.publicationStatus,
    productionReady: false,
    notes:
      'Included as an internal production draft only. Modern quantities, timing and vessel choices remain adaptations and the recipe must not be presented as an exact recovered ancient preparation.',
  },
  {
    cookbookId: 'cookbook-biblicalmeal-first-reconstructions',
    sectionId: 'cookbook-section-breads-and-grains',
    recipeContentId: unleavenedBreadRecipe.id,
    order: 1,
    productionStatus: unleavenedBreadRecipe.productionStatus,
    editorialReviewStatus: unleavenedBreadRecipe.editorialReviewStatus,
    publicationStatus: unleavenedBreadRecipe.publicationStatus,
    productionReady: false,
    notes:
      'Included as an internal production draft only. The selected flour, quantities and skillet method remain modern practical choices rather than a claimed exact biblical formula.',
  },
  {
    cookbookId: 'cookbook-biblicalmeal-first-reconstructions',
    sectionId: 'cookbook-section-breads-and-grains',
    recipeContentId: barleyBreadRecipe.id,
    order: 2,
    productionStatus: barleyBreadRecipe.productionStatus,
    editorialReviewStatus: barleyBreadRecipe.editorialReviewStatus,
    publicationStatus: barleyBreadRecipe.publicationStatus,
    productionReady: false,
    notes:
      'Included as a scripture-inspired draft. Barley is attested as one of the seven species (Deuteronomy 8:8) and barley loaves appear in John 6:9, but no specific bread recipe exists in the text.',
  },
  {
    cookbookId: 'cookbook-biblicalmeal-first-reconstructions',
    sectionId: 'cookbook-section-breads-and-grains',
    recipeContentId: wheatFlatbreadRecipe.id,
    order: 3,
    productionStatus: wheatFlatbreadRecipe.productionStatus,
    editorialReviewStatus: wheatFlatbreadRecipe.editorialReviewStatus,
    publicationStatus: wheatFlatbreadRecipe.publicationStatus,
    productionReady: false,
    notes:
      'Included as a scripture-inspired draft. Wheat is attested as one of the seven species (Deuteronomy 8:8), but no specific flatbread recipe exists in the text.',
  },
  {
    cookbookId: 'cookbook-biblicalmeal-first-reconstructions',
    sectionId: 'cookbook-section-breads-and-grains',
    recipeContentId: ezekielBreadRecipe.id,
    order: 4,
    productionStatus: ezekielBreadRecipe.productionStatus,
    editorialReviewStatus: ezekielBreadRecipe.editorialReviewStatus,
    publicationStatus: ezekielBreadRecipe.publicationStatus,
    productionReady: false,
    notes:
      'Included as a historically informed reconstruction draft. Ezekiel 4:9 explicitly names five ingredients but provides no proportions, quantities, or cooking instructions. The passage describes a siege/emergency bread — a deliberate act of prophetic symbolism, not a daily recipe. This recipe does NOT represent the modern commercial "Ezekiel bread" product as historical evidence.',
  },
  {
    cookbookId: 'cookbook-biblicalmeal-first-reconstructions',
    sectionId: 'cookbook-section-seafood-preparations',
    recipeContentId: grilledFishRecipe.id,
    order: 1,
    productionStatus: grilledFishRecipe.productionStatus,
    editorialReviewStatus: grilledFishRecipe.editorialReviewStatus,
    publicationStatus: grilledFishRecipe.publicationStatus,
    productionReady: false,
    notes:
      'Included as a scripture-inspired draft. Fish consumption is explicitly attested in Luke 24:42-43, but the specific preparation method is a modern adaptation.',
  },
  {
    cookbookId: 'cookbook-biblicalmeal-first-reconstructions',
    sectionId: 'cookbook-section-herbs-oils-seasonings',
    recipeContentId: oliveOilFlatbreadRecipe.id,
    order: 1,
    productionStatus: oliveOilFlatbreadRecipe.productionStatus,
    editorialReviewStatus: oliveOilFlatbreadRecipe.editorialReviewStatus,
    publicationStatus: oliveOilFlatbreadRecipe.publicationStatus,
    productionReady: false,
    notes:
      'Included as a scripture-inspired draft. Olive oil is attested as one of the seven species (Deuteronomy 8:8) and is used in grain preparations (Leviticus 2:4-7, Exodus 29:2-3), but no specific olive oil flatbread recipe exists in the text.',
  },
  {
    cookbookId: 'cookbook-biblicalmeal-first-reconstructions',
    sectionId: 'cookbook-section-fruits-and-preserves',
    recipeContentId: honeyCakesRecipe.id,
    order: 1,
    productionStatus: honeyCakesRecipe.productionStatus,
    editorialReviewStatus: honeyCakesRecipe.editorialReviewStatus,
    publicationStatus: honeyCakesRecipe.publicationStatus,
    productionReady: false,
    notes:
      'Included as a scripture-inspired draft. Honey is attested as one of the seven species (Deuteronomy 8:8) and appears in food preparation contexts (Exodus 16:31), but no specific honey cake recipe exists in the text. The Hebrew word for "cake" refers to baked grain preparations, not modern pastry.',
  },
  {
    cookbookId: 'cookbook-biblicalmeal-first-reconstructions',
    sectionId: 'cookbook-section-feasts-and-gatherings',
    recipeContentId: bitterHerbsRecipe.id,
    order: 1,
    productionStatus: bitterHerbsRecipe.productionStatus,
    editorialReviewStatus: bitterHerbsRecipe.editorialReviewStatus,
    publicationStatus: bitterHerbsRecipe.publicationStatus,
    productionReady: false,
    notes:
      'Included as a scripture-inspired draft. Bitter herbs are commanded in Exodus 12:8 as part of the Passover meal, but the specific plant identification remains genuinely uncertain. This recipe does NOT assert any single plant as "the biblical bitter herb."',
  },
];

export const RECIPE_CONTENT_BY_ID = recipeContentById;
