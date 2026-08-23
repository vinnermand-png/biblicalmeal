/**
 * PAGE-1 OPPORTUNITY FRAMEWORK - STRATEGIC PRIORITIZATION (V3B expansion)
 * =======================================================================
 * QUALITATIVE effort-prioritization model. This is NOT a Google ranking
 * prediction. No search volume, keyword difficulty, or ranking probability
 * exists anywhere in this file or this project.
 *
 * Each factor is scored 1-5 (higher = more favorable):
 * - relevance          : fit with the Biblical-food topical core.
 * - intentClarity      : how unambiguous the search intent is.
 * - depthPotential     : how much genuinely verifiable content is possible.
 * - authorityFit       : match with BiblicalMeal's editorial identity.
 * - linkingValue       : hub/linking value inside our architecture.
 * - researchEase       : 5 = light verification burden; 1 = heavy sourcing.
 * - lowCompetition     : qualitative SERP crowding; 5 = clearly beatable.
 * - differentiation    : room to be visibly better than observed SERP norms.
 * - editorialConfidence: confidence we can publish without overclaiming.
 *
 * Tiers (effort prioritization, not outcome promises):
 * cornerstone | strong-supporting | long-tail-value | research-heavy
 */

export type PriorityFactor =
  | 'relevance'
  | 'intentClarity'
  | 'depthPotential'
  | 'authorityFit'
  | 'linkingValue'
  | 'researchEase'
  | 'lowCompetition'
  | 'differentiation'
  | 'editorialConfidence';

export type OpportunityTier =
  'cornerstone' | 'strong-supporting' | 'long-tail-value' | 'research-heavy';

export interface TargetPriorityScore {
  factors: Record<PriorityFactor, number>;
  tier: OpportunityTier;
  rationale: string;
}

/**
 * Scores exist for every PURSUING target except the navigational
 * homepage-brand (no keyword competition to prioritize against).
 */
export const TARGET_PRIORITY_SCORES: Record<string, TargetPriorityScore> = {
  'foods-of-the-bible': {
    factors: {
      relevance: 5,
      intentClarity: 5,
      depthPotential: 5,
      authorityFit: 5,
      linkingValue: 5,
      researchEase: 3,
      lowCompetition: 2,
      differentiation: 4,
      editorialConfidence: 4,
    },
    tier: 'cornerstone',
    rationale:
      'Head catalog intent; crowded SERP but our verification layer is a visible differentiator.',
  },
  'what-did-jesus-eat': {
    factors: {
      relevance: 5,
      intentClarity: 5,
      depthPotential: 4,
      authorityFit: 5,
      linkingValue: 5,
      researchEase: 2,
      lowCompetition: 2,
      differentiation: 5,
      editorialConfidence: 4,
    },
    tier: 'cornerstone',
    rationale:
      'Highest-sensitivity, highest-reward pillar; evidence tiers are unmatched by observed competitors.',
  },
  'food-in-biblical-times': {
    factors: {
      relevance: 5,
      intentClarity: 4,
      depthPotential: 5,
      authorityFit: 5,
      linkingValue: 5,
      researchEase: 3,
      lowCompetition: 3,
      differentiation: 4,
      editorialConfidence: 4,
    },
    tier: 'cornerstone',
    rationale:
      'Scholarly anchor (MacDonald 2008) makes rigorous daily-life coverage feasible.',
  },
  'seven-foods-deuteronomy-8': {
    factors: {
      relevance: 5,
      intentClarity: 5,
      depthPotential: 4,
      authorityFit: 5,
      linkingValue: 5,
      researchEase: 4,
      lowCompetition: 3,
      differentiation: 4,
      editorialConfidence: 4,
    },
    tier: 'cornerstone',
    rationale:
      'Clear passage anchor + natural hub into seven profiles; blocked only on one translation check.',
  },
  figs: {
    factors: {
      relevance: 5,
      intentClarity: 4,
      depthPotential: 4,
      authorityFit: 5,
      linkingValue: 4,
      researchEase: 4,
      lowCompetition: 3,
      differentiation: 4,
      editorialConfidence: 5,
    },
    tier: 'strong-supporting',
    rationale:
      'Draft exists; illustration done; fastest path to publishing quality.',
  },
  olives: {
    factors: {
      relevance: 5,
      intentClarity: 4,
      depthPotential: 5,
      authorityFit: 5,
      linkingValue: 4,
      researchEase: 4,
      lowCompetition: 3,
      differentiation: 4,
      editorialConfidence: 5,
    },
    tier: 'strong-supporting',
    rationale:
      'Draft exists; symbolism layers need careful but known handling.',
  },
  lentils: {
    factors: {
      relevance: 4,
      intentClarity: 4,
      depthPotential: 4,
      authorityFit: 5,
      linkingValue: 4,
      researchEase: 4,
      lowCompetition: 3,
      differentiation: 4,
      editorialConfidence: 5,
    },
    tier: 'strong-supporting',
    rationale: 'Genesis anchor plus direct recipe bridge.',
  },
  dates: {
    factors: {
      relevance: 4,
      intentClarity: 4,
      depthPotential: 4,
      authorityFit: 5,
      linkingValue: 3,
      researchEase: 3,
      lowCompetition: 4,
      differentiation: 4,
      editorialConfidence: 4,
    },
    tier: 'strong-supporting',
    rationale: 'Date-honey question offers real differentiation if verified.',
  },
  honey: {
    factors: {
      relevance: 4,
      intentClarity: 4,
      depthPotential: 4,
      authorityFit: 5,
      linkingValue: 4,
      researchEase: 3,
      lowCompetition: 3,
      differentiation: 4,
      editorialConfidence: 4,
    },
    tier: 'strong-supporting',
    rationale: 'Bee-vs-date-syrup nuance requires solid sourcing first.',
  },
  barley: {
    factors: {
      relevance: 4,
      intentClarity: 4,
      depthPotential: 4,
      authorityFit: 5,
      linkingValue: 4,
      researchEase: 4,
      lowCompetition: 3,
      differentiation: 3,
      editorialConfidence: 5,
    },
    tier: 'strong-supporting',
    rationale:
      'Draft exists; harvest-cycle references straightforward to verify.',
  },
  wheat: {
    factors: {
      relevance: 5,
      intentClarity: 4,
      depthPotential: 4,
      authorityFit: 5,
      linkingValue: 5,
      researchEase: 4,
      lowCompetition: 3,
      differentiation: 3,
      editorialConfidence: 4,
    },
    tier: 'strong-supporting',
    rationale:
      'Needed before catalog pillar can claim completeness; new illustration required.',
  },
  grapes: {
    factors: {
      relevance: 4,
      intentClarity: 4,
      depthPotential: 4,
      authorityFit: 4,
      linkingValue: 4,
      researchEase: 3,
      lowCompetition: 3,
      differentiation: 3,
      editorialConfidence: 4,
    },
    tier: 'strong-supporting',
    rationale:
      'Wine boundary must stay clean; otherwise standard profile work.',
  },
  pomegranate: {
    factors: {
      relevance: 4,
      intentClarity: 4,
      depthPotential: 4,
      authorityFit: 4,
      linkingValue: 3,
      researchEase: 3,
      lowCompetition: 4,
      differentiation: 4,
      editorialConfidence: 4,
    },
    tier: 'strong-supporting',
    rationale: 'Temple symbolism handled as interpretive tradition.',
  },
  'recipes-hub': {
    factors: {
      relevance: 5,
      intentClarity: 5,
      depthPotential: 4,
      authorityFit: 5,
      linkingValue: 5,
      researchEase: 4,
      lowCompetition: 3,
      differentiation: 4,
      editorialConfidence: 5,
    },
    tier: 'strong-supporting',
    rationale:
      'Hub value grows with each published recipe; classification honesty is the moat.',
  },
  'fruits-of-the-bible': {
    factors: {
      relevance: 4,
      intentClarity: 4,
      depthPotential: 3,
      authorityFit: 4,
      linkingValue: 4,
      researchEase: 4,
      lowCompetition: 3,
      differentiation: 3,
      editorialConfidence: 4,
    },
    tier: 'strong-supporting',
    rationale:
      'Category page assembling verified profiles; cheap once ingredients exist.',
  },
  'vegetables-of-the-bible': {
    factors: {
      relevance: 4,
      intentClarity: 4,
      depthPotential: 3,
      authorityFit: 4,
      linkingValue: 4,
      researchEase: 3,
      lowCompetition: 3,
      differentiation: 3,
      editorialConfidence: 3,
    },
    tier: 'research-heavy',
    rationale:
      'Identification debates (melons et al.) raise the verification bar.',
  },
  'meat-in-the-bible': {
    factors: {
      relevance: 4,
      intentClarity: 4,
      depthPotential: 4,
      authorityFit: 4,
      linkingValue: 4,
      researchEase: 2,
      lowCompetition: 3,
      differentiation: 4,
      editorialConfidence: 3,
    },
    tier: 'research-heavy',
    rationale:
      'Must describe without doctrinal settlement; careful framing work.',
  },
  fish: {
    factors: {
      relevance: 4,
      intentClarity: 4,
      depthPotential: 4,
      authorityFit: 4,
      linkingValue: 4,
      researchEase: 2,
      lowCompetition: 3,
      differentiation: 4,
      editorialConfidence: 4,
    },
    tier: 'research-heavy',
    rationale: 'Galilee fishing economy needs real sourcing before writing.',
  },
  'bread-in-the-bible': {
    factors: {
      relevance: 5,
      intentClarity: 4,
      depthPotential: 5,
      authorityFit: 5,
      linkingValue: 5,
      researchEase: 2,
      lowCompetition: 2,
      differentiation: 4,
      editorialConfidence: 4,
    },
    tier: 'research-heavy',
    rationale:
      'Bread-of-life theology requires citing recognized teachers throughout.',
  },
  salt: {
    factors: {
      relevance: 3,
      intentClarity: 4,
      depthPotential: 3,
      authorityFit: 4,
      linkingValue: 3,
      researchEase: 2,
      lowCompetition: 4,
      differentiation: 4,
      editorialConfidence: 4,
    },
    tier: 'research-heavy',
    rationale: 'Covenant-of-salt scholarship must precede any draft.',
  },
  'herbs-spices': {
    factors: {
      relevance: 3,
      intentClarity: 3,
      depthPotential: 3,
      authorityFit: 4,
      linkingValue: 4,
      researchEase: 3,
      lowCompetition: 3,
      differentiation: 3,
      editorialConfidence: 4,
    },
    tier: 'long-tail-value',
    rationale: 'Overview article once individual herb facts are verified.',
  },
  'lentil-stew': {
    factors: {
      relevance: 4,
      intentClarity: 5,
      depthPotential: 3,
      authorityFit: 5,
      linkingValue: 4,
      researchEase: 5,
      lowCompetition: 3,
      differentiation: 4,
      editorialConfidence: 5,
    },
    tier: 'long-tail-value',
    rationale: 'Draft complete; honest inspired-labeling already built in.',
  },
  'ezekiel-bread': {
    factors: {
      relevance: 4,
      intentClarity: 5,
      depthPotential: 4,
      authorityFit: 5,
      linkingValue: 4,
      researchEase: 3,
      lowCompetition: 2,
      differentiation: 5,
      editorialConfidence: 4,
    },
    tier: 'research-heavy',
    rationale:
      'Crowded wellness SERP; only verse-context depth differentiates us.',
  },
  'unleavened-bread': {
    factors: {
      relevance: 4,
      intentClarity: 5,
      depthPotential: 4,
      authorityFit: 5,
      linkingValue: 4,
      researchEase: 3,
      lowCompetition: 3,
      differentiation: 4,
      editorialConfidence: 4,
    },
    tier: 'long-tail-value',
    rationale: 'Simple recipe; respectful Passover context is the actual work.',
  },
  'last-supper-foods': {
    factors: {
      relevance: 4,
      intentClarity: 5,
      depthPotential: 4,
      authorityFit: 4,
      linkingValue: 4,
      researchEase: 2,
      lowCompetition: 3,
      differentiation: 4,
      editorialConfidence: 3,
    },
    tier: 'research-heavy',
    rationale:
      'Chronology + communion reverence demand slow, sourced treatment.',
  },
  'john-the-baptist-diet': {
    factors: {
      relevance: 3,
      intentClarity: 5,
      depthPotential: 3,
      authorityFit: 4,
      linkingValue: 3,
      researchEase: 4,
      lowCompetition: 4,
      differentiation: 4,
      editorialConfidence: 4,
    },
    tier: 'long-tail-value',
    rationale:
      'Narrow but well-defined; locust/carob resolution is the whole game.',
  },
  'what-is-manna': {
    factors: {
      relevance: 4,
      intentClarity: 5,
      depthPotential: 5,
      authorityFit: 5,
      linkingValue: 4,
      researchEase: 2,
      lowCompetition: 3,
      differentiation: 4,
      editorialConfidence: 4,
    },
    tier: 'research-heavy',
    rationale:
      'Deep material; deserves unhurried study rather than rushed coverage.',
  },
  'wilderness-diet': {
    factors: {
      relevance: 3,
      intentClarity: 4,
      depthPotential: 4,
      authorityFit: 4,
      linkingValue: 3,
      researchEase: 3,
      lowCompetition: 4,
      differentiation: 3,
      editorialConfidence: 4,
    },
    tier: 'long-tail-value',
    rationale: 'Sequenced after manna to avoid Exodus 16 overlap.',
  },
};

/** Deliberately avoided topics - documented so audits never re-litigate silently. */
export const DELIBERATE_AVOIDANCES: { targetId: string; reason: string }[] = [
  {
    targetId: 'wine-in-scripture',
    reason:
      'Contested theology + age-sensitive topic; revisit only with qualified pastoral review.',
  },
  {
    targetId: 'clean-unclean-foods',
    reason:
      'Doctrinally contested across traditions; an error would mislead readers spiritually.',
  },
  {
    targetId: 'biblical-diet-wellness',
    reason:
      'Health-advice liability conflicts with honesty standards; permanently out of scope.',
  },
];

export const TIER_LABELS: Record<OpportunityTier, string> = {
  cornerstone: 'Cornerstone opportunities',
  'strong-supporting': 'Strong supporting opportunities',
  'long-tail-value': 'High-value long-tail opportunities',
  'research-heavy': 'Research-heavy opportunities',
};
