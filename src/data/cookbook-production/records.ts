import { RECIPE_CONTENT_RECORDS } from '../recipe-content/records';
import type { CookbookRecord, CookbookRecipeInclusion, CookbookSection } from './types';

/**
 * V3C.30 — Full Cookbook Creation.
 *
 * This first real cookbook batch uses only the canonical V3C.18 recipe content
 * records. Inclusion does not promote either draft: cookbook production remains
 * separate from recipe ownership, editorial approval and publication.
 */
export const COOKBOOK_RECORDS: readonly CookbookRecord[] = [
  {
    id: 'cookbook-biblicalmeal-first-reconstructions',
    title: 'BiblicalMeal: First Evidence-Aware Reconstructions',
    slug: 'first-evidence-aware-reconstructions',
    description:
      'An internal production cookbook batch that groups the first evidence-aware reconstruction drafts while preserving their uncertainty and modern-kitchen adaptation disclosures.',
    productionStatus: 'in-production',
    publicationStatus: 'draft',
    publicationEligible: false,
    sectionIds: [
      'cookbook-section-simple-preparations',
      'cookbook-section-breads-and-grains',
    ],
    recipeContentIds: [
      'recipe-content-lentil-pottage',
      'recipe-content-unleavened-bread',
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
      'Reconstruction drafts that preserve the distinction between an attested food concept and a modern practical formula.',
  },
];

export const COOKBOOK_RECIPE_INCLUSIONS: readonly CookbookRecipeInclusion[] = [
  {
    cookbookId: 'cookbook-biblicalmeal-first-reconstructions',
    sectionId: 'cookbook-section-simple-preparations',
    recipeContentId: 'recipe-content-lentil-pottage',
    order: 1,
    productionStatus: 'draft',
    editorialReviewStatus: 'not-started',
    publicationStatus: 'draft',
    productionReady: false,
    notes:
      'Included as an internal production draft only. Modern quantities, timing and vessel choices remain adaptations and the recipe must not be presented as an exact recovered ancient preparation.',
  },
  {
    cookbookId: 'cookbook-biblicalmeal-first-reconstructions',
    sectionId: 'cookbook-section-breads-and-grains',
    recipeContentId: 'recipe-content-unleavened-bread',
    order: 1,
    productionStatus: 'draft',
    editorialReviewStatus: 'not-started',
    publicationStatus: 'draft',
    productionReady: false,
    notes:
      'Included as an internal production draft only. The selected flour, quantities and skillet method remain modern practical choices rather than a claimed exact biblical formula.',
  },
];

export const RECIPE_CONTENT_BY_ID = new Map(
  RECIPE_CONTENT_RECORDS.map((record) => [record.id, record]),
);
