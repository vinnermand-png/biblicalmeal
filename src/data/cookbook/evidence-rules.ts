/**
 * V3C.44A — Evidence & Scripture Rules
 *
 * Cookbook-wide rules for evidence, Scripture, and historical claims.
 *
 * This file inherits canonical evidence ownership from:
 * - src/data/research/ (V3C.2)
 * - src/data/recipe-research/ (V3C.17)
 * - src/data/recipe-content/ (V3C.18)
 * - src/lib/scripture.ts (V3C.3 KJV policy)
 * - src/data/source-citations.ts
 * - src/data/authority/records.ts
 *
 * This file does NOT create:
 * - A parallel evidence database
 * - A parallel citation system
 * - A parallel authority system
 * - A parallel Scripture system
 */

/**
 * Historical claim rules for the cookbook.
 */
export const HISTORICAL_CLAIM_RULES = {
  /**
   * All historical claims must be traceable to recorded research.
   */
  mustBeTraceableToResearch: true,

  /**
   * Historical claims cannot be promoted without evidence.
   */
  cannotPromoteWithoutEvidence: true,

  /**
   * Uncertainty must remain visible, not hidden.
   */
  uncertaintyMustBeVisible: true,

  /**
   * Archaeological claims require cited sources.
   */
  archaeologicalClaimsRequireCitation: true,

  /**
   * Single findings cannot be generalized to universal claims.
   */
  cannotGeneralizeFromSingleFindings: true,

  /**
   * Interpretation must be qualified.
   */
  interpretationMustBeQualified: true,

  /**
   * Dating must be precise where possible.
   */
  datingMustBePreciseWherePossible: true,
} as const;

/**
 * Scripture rules for the cookbook.
 * Inherits from the existing KJV policy (V3C.3).
 */
export const SCRIPTURE_RULES = {
  /**
   * All Scripture references must use KJV wording.
   */
  mustUseKJVWording: true,

  /**
   * All references must cite book, chapter, and verse.
   */
  mustCiteBookChapterVerse: true,

  /**
   * Claims cannot extend beyond the recorded text.
   */
  cannotExtendBeyondRecordedText: true,

  /**
   * Context must be preserved.
   */
  contextMustBePreserved: true,

  /**
   * Direct quotations must be accurate.
   */
  directQuotationsMustBeAccurate: true,

  /**
   * Paraphrases must be clearly identified.
   */
  paraphrasesMustBeClearlyIdentified: true,
} as const;

/**
 * Uncertainty disclosure rules for the cookbook.
 */
export const UNCERTAINTY_RULES = {
  /**
   * Uncertainty cannot be converted to certainty.
   */
  cannotConvertToCertainty: true,

  /**
   * Unresolved questions must be disclosed.
   */
  unresolvedQuestionsMustBeDisclosed: true,

  /**
   * Attested information must be distinguished from inferred information.
   */
  attestedMustBeDistinguishedFromInferred: true,

  /**
   * Evidence boundaries must be preserved.
   */
  evidenceBoundariesMustBePreserved: true,

  /**
   * Speculative claims must be clearly labelled.
   */
  speculativeClaimsMustBeClearlyLabelled: true,
} as const;

/**
 * Recipe reconstruction rules for the cookbook.
 */
export const RECONSTRUCTION_RULES = {
  /**
   * Recipes must state what is known vs. unknown.
   */
  mustStateKnownVsUnknown: true,

  /**
   * Modern adaptations must be identified.
   */
  modernAdaptationsMustBeIdentified: true,

  /**
   * Exact ancient recipes cannot be claimed without evidence.
   */
  cannotClaimExactAncientRecipesWithoutEvidence: true,

  /**
   * Classification integrity must be preserved.
   */
  classificationIntegrityMustBePreserved: true,

  /**
   * Reconstruction disclosures must be visible.
   */
  reconstructionDisclosuresMustBeVisible: true,
} as const;

/**
 * Citation and authority rules for the cookbook.
 */
export const CITATION_RULES = {
  /**
   * All citations must trace to canonical sources.
   */
  mustTraceToCanonicalSources: true,

  /**
   * Fabricated citations are prohibited.
   */
  fabricatedCitationsProhibited: true,

  /**
   * Invented authorities are prohibited.
   */
  inventedAuthoritiesProhibited: true,

  /**
   * Source ownership must remain with canonical systems.
   */
  sourceOwnershipRemainsWithCanonicalSystems: true,

  /**
   * Citation formatting must be consistent.
   */
  citationFormattingMustBeConsistent: true,
} as const;

/**
 * Modern adaptation disclosure rules for the cookbook.
 */
export const MODERN_ADAPTATION_RULES = {
  /**
   * Modern quantities must be identified.
   */
  modernQuantitiesMustBeIdentified: true,

  /**
   * Modern cooking methods must be identified.
   */
  modernCookingMethodsMustBeIdentified: true,

  /**
   * Modern ingredients must be identified.
   */
  modernIngredientsMustBeIdentified: true,

  /**
   * Modern equipment must be identified.
   */
  modernEquipmentMustBeIdentified: true,

  /**
   * Adaptations must be disclosed in recipe notes.
   */
  adaptationsMustBeDisclosedInRecipeNotes: true,
} as const;

/**
 * Combined evidence rules for the cookbook.
 */
export const EVIDENCE_RULES = {
  historical: HISTORICAL_CLAIM_RULES,
  scripture: SCRIPTURE_RULES,
  uncertainty: UNCERTAINTY_RULES,
  reconstruction: RECONSTRUCTION_RULES,
  citation: CITATION_RULES,
  modernAdaptation: MODERN_ADAPTATION_RULES,
} as const;

/**
 * What the cookbook must NOT do.
 */
export const EVIDENCE_PROHIBITIONS = [
  'Unsupported historical claims',
  'Fabricated citations',
  'Invented authorities',
  'Certainty inflation',
  'Exact-ancient-recipe claims without evidence',
  'Hidden uncertainty',
  'Unqualified interpretation',
  'Generalization from single findings',
  'Extension beyond recorded text',
  'Unclear modern adaptations',
] as const;
