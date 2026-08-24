/**
 * V3C.44A — Recipe Classification Guide
 *
 * Canonical reader-facing definitions for recipe classifications.
 *
 * This file reuses the existing RecipeClassification type from:
 * - src/data/recipe-research/types.ts
 *
 * It does NOT duplicate classification ownership.
 * It provides reader-facing explanations for the cookbook.
 */

import type { RecipeClassification } from '../recipe-research/types';

/**
 * Classification definition type.
 */
export interface ClassificationDefinition {
  classification: RecipeClassification;
  label: string;
  shortDescription: string;
  fullDescription: string;
  keyCharacteristics: readonly string[];
  readerDisclosure: string;
}

/**
 * Canonical recipe classification definitions.
 * These are the reader-facing explanations for the cookbook.
 */
export const CLASSIFICATION_DEFINITIONS: readonly ClassificationDefinition[] = [
  {
    classification: 'scripture-inspired-preparation',
    label: 'Inspired',
    shortDescription: 'Modern creation using biblical-world ingredients.',
    fullDescription:
      'These are modern kitchen creations that draw inspiration from the foods and cooking traditions of the biblical world. They use ingredients that were available in the ancient Near East, but the specific preparation methods, quantities, and techniques are modern adaptations designed for today\u2019s kitchen.',
    keyCharacteristics: [
      'Uses ingredients available in the biblical world',
      'Modern preparation methods and quantities',
      'Inspired by biblical food traditions',
      'Not a historical reconstruction',
      'Clearly labelled as a modern creation',
    ],
    readerDisclosure:
      'This recipe is a modern kitchen creation inspired by biblical ingredients. It is not a historical reconstruction and does not claim to represent any specific ancient preparation.',
  },
  {
    classification: 'historically-attested-preparation',
    label: 'Researched',
    shortDescription: 'Built from cited historical sources.',
    fullDescription:
      'These recipes are built from cited historical sources and documented preparation methods where available. They follow historical evidence where it exists, but still require some modern kitchen adaptations. Each recipe identifies which elements are historically documented and which are practical choices.',
    keyCharacteristics: [
      'Based on cited historical sources',
      'Documents preparation methods where available',
      'Identifies modern adaptations',
      'Preserves historical evidence boundaries',
      'Traceable to scholarly sources',
    ],
    readerDisclosure:
      'This recipe is based on historical sources and documented preparation methods. Where exact historical details are unavailable, modern adaptations are clearly identified.',
  },
  {
    classification: 'modern-adaptation',
    label: 'Reconstructed',
    shortDescription: 'Scholarly best-effort historical assembly.',
    fullDescription:
      'These are scholarly best-effort attempts to recreate historical preparations. They are based on archaeological evidence, historical texts, and expert interpretation. Reconstruction recipes always disclose which elements are uncertain or inferred, and they never claim to represent exact ancient recipes.',
    keyCharacteristics: [
      'Based on archaeological and historical evidence',
      'Scholarly best-effort assembly',
      'Discloses uncertain or inferred elements',
      'Does not claim exact ancient preparation',
      'Preserves evidence boundaries',
    ],
    readerDisclosure:
      'This recipe is a scholarly reconstruction based on available evidence. It represents our best understanding of historical preparations, but some elements remain uncertain or inferred.',
  },
  {
    classification: 'historically-informed-reconstruction',
    label: 'Historically-Informed',
    shortDescription: 'Evidence-aware modern adaptation.',
    fullDescription:
      'These recipes preserve the distinction between attested food concepts and modern practical formulas. They are transparent about where exact historical quantities, methods, or ingredients remain unresolved, and they use modern kitchen adaptations while preserving historical context.',
    keyCharacteristics: [
      'Evidence-aware modern adaptation',
      'Transparent about unresolved historical details',
      'Uses modern kitchen adaptations',
      'Preserves attested food concepts',
      'Clear about what is known versus unknown',
    ],
    readerDisclosure:
      'This recipe is a historically-informed adaptation. It uses modern kitchen methods while preserving the historical food concept. Exact historical details remain unresolved.',
  },
] as const;

/**
 * Get a classification definition by classification type.
 */
export function getClassificationDefinition(
  classification: RecipeClassification,
): ClassificationDefinition | undefined {
  return CLASSIFICATION_DEFINITIONS.find(
    (definition) => definition.classification === classification,
  );
}

/**
 * Get a classification definition by label.
 */
export function getClassificationByLabel(
  label: string,
): ClassificationDefinition | undefined {
  return CLASSIFICATION_DEFINITIONS.find(
    (definition) => definition.label.toLowerCase() === label.toLowerCase(),
  );
}

/**
 * Get all classification labels.
 */
export function getClassificationLabels(): readonly string[] {
  return CLASSIFICATION_DEFINITIONS.map((definition) => definition.label);
}

/**
 * Classification rules for the cookbook.
 * These rules must be followed for all recipes.
 */
export const CLASSIFICATION_RULES = {
  /**
   * Classification must be explicit on every recipe.
   */
  mustBeExplicit: true,

  /**
   * Classification cannot be upgraded without additional evidence.
   */
  cannotUpgradeWithoutEvidence: true,

  /**
   * Uncertainty must remain visible, not hidden.
   */
  uncertaintyMustBeVisible: true,

  /**
   * Modern adaptations must be identified.
   */
  modernAdaptationsMustBeIdentified: true,

  /**
   * Historical claims must remain traceable to sources.
   */
  historicalClaimsMustBeTraceable: true,
} as const;
