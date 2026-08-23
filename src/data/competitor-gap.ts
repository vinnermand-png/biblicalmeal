/**
 * COMPETITOR & CONTENT GAP FRAMEWORK (V3B expansion)
 * ==================================================
 * Tracks what was OBSERVED in dated SERP reviews. No traffic numbers,
 * no ranking claims, no assumptions about competitor performance beyond
 * what the search results themselves showed.
 *
 * Question this framework answers: WHAT CAN BIBLICALMEAL DO BETTER?
 * It is not a copying exercise.
 */

export interface CompetitorObservation {
  domain: string;
  /** The dated query during which this domain was observed. */
  observedForQuery: string;
  observedPageType: string;
  strengths: string[];
  observedWeaknessesOrGaps: string[];
  biblicalmealDifferentiation: string[];
  evidenceLevel: 'serp-observed';
  reviewedAt: string;
}

export const COMPETITOR_OBSERVATIONS: CompetitorObservation[] = [
  {
    domain: 'learnreligions.com',
    observedForQuery: 'foods of the bible',
    observedPageType: 'List-format article with scripture references',
    strengths: ['Broad coverage', 'Established domain presence in results'],
    observedWeaknessesOrGaps: [
      'Generalist religion site, not food-editorial',
      'No evidence labeling of historical claims observed',
    ],
    biblicalmealDifferentiation: [
      'Dedicated food-site depth',
      'Verified scripture + tiered historical claims',
    ],
    evidenceLevel: 'serp-observed',
    reviewedAt: '2026-08-23',
  },
  {
    domain: 'biblehub.com',
    observedForQuery: 'foods of the bible',
    observedPageType: 'Topical list / encyclopedia entry',
    strengths: [
      'Scripture-focused utility',
      'Reference-grade trust for verses',
    ],
    observedWeaknessesOrGaps: [
      'Not culinary',
      'List framing without daily-life or recipe pathways',
    ],
    biblicalmealDifferentiation: [
      'Ingredient-to-recipe relationships',
      'Modern-vs-historical classification transparency',
    ],
    evidenceLevel: 'serp-observed',
    reviewedAt: '2026-08-23',
  },
  {
    domain: 'churchequips.com',
    observedForQuery: 'foods of the bible',
    observedPageType: 'KJV-framed guide listicle',
    strengths: ['Clear single-translation framing'],
    observedWeaknessesOrGaps: [
      'Single-translation dependence without discussion',
      'Thin sourcing of historical statements',
    ],
    biblicalmealDifferentiation: [
      'Explicit Bible-translation documentation on major pages',
    ],
    evidenceLevel: 'serp-observed',
    reviewedAt: '2026-08-23',
  },
  {
    domain: 'faithward.org',
    observedForQuery: 'what did jesus eat',
    observedPageType:
      'Christian content article citing scholarly literature (JSTOR links)',
    strengths: [
      'Cites academic sources - strongest observed practice in cluster',
    ],
    observedWeaknessesOrGaps: [
      'No systematic per-claim evidence labels observed',
    ],
    biblicalmealDifferentiation: [
      'Mandatory attested/plausible/speculative labeling on every claim class',
    ],
    evidenceLevel: 'serp-observed',
    reviewedAt: '2026-08-23',
  },
  {
    domain: 'tastingtable.com',
    observedForQuery: 'what did jesus eat',
    observedPageType:
      'Food-media article built on a historian interview (Neot Kedumim)',
    strengths: ['Genuine expert voice', 'Strong editorial production'],
    observedWeaknessesOrGaps: [
      'Single-interview base; not a structured topical resource',
    ],
    biblicalmealDifferentiation: [
      'Comprehensive architecture: pillar + ingredients + recipes interlinked',
    ],
    evidenceLevel: 'serp-observed',
    reviewedAt: '2026-08-23',
  },
  {
    domain: 'christianityfaq.com',
    observedForQuery: 'what did jesus eat',
    observedPageType: 'FAQ-style answer page',
    strengths: ['Direct question-answer format'],
    observedWeaknessesOrGaps: [
      'Asserts Luke 24:42-43 as only explicit eating reference - flagged by us TO VERIFY, not adopted',
      'No source citations observed',
    ],
    biblicalmealDifferentiation: [
      'Verse-level verification before assertion',
      'Uncertainty stated openly instead of filled with confidence',
    ],
    evidenceLevel: 'serp-observed',
    reviewedAt: '2026-08-23',
  },
  {
    domain: 'biblical.recipes',
    observedForQuery:
      'foods of the bible; recipes from the bible; what did jesus eat',
    observedPageType: 'Dedicated niche competitor ranking across clusters',
    strengths: [
      'Exact-match topical domain',
      'Cross-cluster visibility observed in multiple queries',
    ],
    observedWeaknessesOrGaps: [
      'Depth/verification level not assessable from SERP listing alone - requires manual content review later',
    ],
    biblicalmealDifferentiation: [
      'Evidence-tier system',
      'Research-first recipes never presented as ancient reconstructions without cited basis',
    ],
    evidenceLevel: 'serp-observed',
    reviewedAt: '2026-08-23',
  },
  {
    domain: 'thebiblecookbook.com',
    observedForQuery: 'recipes from the bible',
    observedPageType: 'Devotional story-based cooking site',
    strengths: [
      'Explicitly labels recipes as modern creations - validates honest framing model',
    ],
    observedWeaknessesOrGaps: ['Devotional framing limits historical depth'],
    biblicalmealDifferentiation: [
      'Same honesty PLUS historically-researched/reconstructed tiers with documented sources',
    ],
    evidenceLevel: 'serp-observed',
    reviewedAt: '2026-08-23',
  },
];

/** Cross-cutting gaps BiblicalMeal is positioned to fill. */
export const GAP_THEMES: { theme: string; howWeAddressIt: string }[] = [
  {
    theme: 'Scripture vs interpretation blending',
    howWeAddressIt:
      'Structural separation: quoted text with reference+translation, interpretation labeled as such.',
  },
  {
    theme: 'Unlabeled historical certainty',
    howWeAddressIt: 'Three-tier evidence labels on every claim class.',
  },
  {
    theme: 'Flat lists without architecture',
    howWeAddressIt:
      'Pillar → ingredient → recipe graph with typed internal linking.',
  },
  {
    theme: 'Recipes pretending to be ancient',
    howWeAddressIt:
      'Inspired / historically-researched / reconstruction classification, always visible.',
  },
  {
    theme: 'No uncertainty disclosure',
    howWeAddressIt:
      'Editorial policy: incomplete evidence is stated as incomplete.',
  },
  {
    theme: 'Translation opacity',
    howWeAddressIt: 'Every quotation documents its translation once chosen.',
  },
];
