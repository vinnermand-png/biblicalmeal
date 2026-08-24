/**
 * V3C.44A — Recipe Template
 *
 * Cookbook-specific recipe presentation contract.
 *
 * This file defines the presentation structure for recipes in the cookbook.
 * It does NOT duplicate the RecipeContentRecord schema from:
 * - src/data/recipe-content/types.ts
 *
 * Instead, it defines how existing recipe data should be presented
 * in the final cookbook format.
 */

import type { RecipeClassification } from '../recipe-research/types';

/**
 * Recipe presentation section type.
 */
export interface RecipeSection {
  id: string;
  title: string;
  order: number;
  description: string;
  /** Whether this section is required for all recipes. */
  required: boolean;
  /** Data source from existing recipe schema. */
  dataSource?: string;
}

/**
 * Canonical recipe presentation sections.
 * These define how recipe content is organized in the cookbook.
 */
export const RECIPE_SECTIONS: readonly RecipeSection[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    order: 1,
    description:
      'Brief introduction to the recipe and its biblical connection.',
    required: true,
    dataSource: 'RecipeContentRecord.introduction',
  },
  {
    id: 'historical-context',
    title: 'Historical Context',
    order: 2,
    description: 'Historical and archaeological context for the recipe.',
    required: false,
    dataSource: 'RecipeContentRecord.historicalContext',
  },
  {
    id: 'scripture-context',
    title: 'Scripture Context',
    order: 3,
    description:
      'Relevant Scripture references and their connection to the recipe.',
    required: false,
    dataSource: 'RecipeResearchRecord.scriptureRelationship',
  },
  {
    id: 'evidence-notes',
    title: 'Evidence Notes',
    order: 4,
    description: 'Notes on the evidence supporting the recipe classification.',
    required: true,
    dataSource: 'RecipeContentRecord.uncertaintyDisclosure',
  },
  {
    id: 'ingredients',
    title: 'Ingredients',
    order: 5,
    description: 'List of ingredients with quantities and evidence layers.',
    required: true,
    dataSource: 'RecipeContentRecord.ingredients',
  },
  {
    id: 'method',
    title: 'Method',
    order: 6,
    description: 'Step-by-step preparation and cooking instructions.',
    required: true,
    dataSource: 'RecipeContentRecord.preparationSteps',
  },
  {
    id: 'serving-notes',
    title: 'Serving Notes',
    order: 7,
    description: 'Suggestions for serving and presentation.',
    required: false,
    dataSource: 'RecipeContentRecord.servingGuidance',
  },
  {
    id: 'classification-disclosure',
    title: 'Classification Disclosure',
    order: 8,
    description:
      'Clear statement of the recipe classification and its meaning.',
    required: true,
    dataSource: 'RecipeContentRecord.classification',
  },
  {
    id: 'sources',
    title: 'Sources',
    order: 9,
    description: 'Sources and references for the recipe.',
    required: false,
    dataSource: 'RecipeResearchRecord.evidence',
  },
] as const;

/**
 * Recipe presentation metadata type.
 */
export interface RecipePresentationMetadata {
  /** Required fields that must be present for a recipe to be cookbook-ready. */
  requiredFields: readonly string[];
  /** Recommended fields for complete recipes. */
  recommendedFields: readonly string[];
  /** Optional fields that enhance recipes. */
  optionalFields: readonly string[];
}

/**
 * Canonical recipe presentation metadata.
 */
export const RECIPE_PRESENTATION_METADATA: RecipePresentationMetadata = {
  requiredFields: [
    'title',
    'description',
    'classification',
    'servings',
    'ingredients',
    'instructions',
    'classificationDisclosure',
  ],
  recommendedFields: [
    'prepMinutes',
    'cookMinutes',
    'difficulty',
    'historicalContext',
    'scriptureRefs',
    'evidenceNotes',
    'servingGuidance',
  ],
  optionalFields: [
    'tags',
    'relatedFoods',
    'relatedRecipes',
    'art',
    'metaDescription',
  ],
} as const;

/**
 * Recipe image requirements type.
 */
export interface RecipeImageRequirement {
  /** Image type required. */
  type: 'chapter-opener' | 'recipe-hero' | 'ingredient-shot' | 'process-shot';
  /** Aspect ratio. */
  aspectRatio: string;
  /** Minimum resolution. */
  minimumResolution: string;
  /** Whether this is required or recommended. */
  required: boolean;
}

/**
 * Canonical recipe image requirements.
 */
export const RECIPE_IMAGE_REQUIREMENTS: readonly RecipeImageRequirement[] = [
  {
    type: 'chapter-opener',
    aspectRatio: '16:9',
    minimumResolution: '1920x1080',
    required: true,
  },
  {
    type: 'recipe-hero',
    aspectRatio: '4:3',
    minimumResolution: '1200x900',
    required: true,
  },
  {
    type: 'ingredient-shot',
    aspectRatio: '1:1',
    minimumResolution: '800x800',
    required: false,
  },
  {
    type: 'process-shot',
    aspectRatio: '4:3',
    minimumResolution: '800x600',
    required: false,
  },
] as const;

/**
 * Get required fields for a recipe classification.
 */
export function getRequiredFieldsForClassification(
  classification: RecipeClassification,
): readonly string[] {
  const base = [...RECIPE_PRESENTATION_METADATA.requiredFields];

  // Classification-specific requirements
  switch (classification) {
    case 'modern-adaptation':
    case 'historically-informed-reconstruction':
      base.push('historicalContext', 'evidenceNotes');
      break;
    case 'historically-attested-preparation':
      base.push('evidenceNotes');
      break;
    case 'scripture-inspired-preparation':
      // No additional requirements
      break;
  }

  return base;
}

/**
 * Validate that a recipe has all required fields for its classification.
 */
export function validateRecipePresentation(
  recipe: Record<string, unknown>,
  classification: RecipeClassification,
): { valid: boolean; missingFields: string[] } {
  const requiredFields = getRequiredFieldsForClassification(classification);
  const missingFields = requiredFields.filter((field) => !recipe[field]);

  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}
