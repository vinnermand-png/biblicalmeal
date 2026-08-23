/**
 * EDITORIAL TRUST & E-E-A-T ARCHITECTURE (V3B expansion)
 * ======================================================
 * Plans the public trust pages (not all built now) and codifies the
 * editorial methodology that every published page must follow.
 */

export interface TrustPagePlan {
  route: string;
  whyNeeded: string;
  seoTrustRole: string;
  launchCritical: boolean;
  mustContain: string[];
  evidenceRequired: string[];
}

export const TRUST_PAGE_PLANS: TrustPagePlan[] = [
  {
    route: '/about/',
    whyNeeded:
      'Readers deciding whether to trust religious-historical content need to know who is behind it.',
    seoTrustRole:
      'Core E-E-A-T signal; commonly checked before linking or citing.',
    launchCritical: true,
    mustContain: [
      'Who runs BiblicalMeal and the editorial mission',
      'Honest statement of scope: food history + scripture, not doctrinal authority',
      'Contact pointer',
    ],
    evidenceRequired: [
      'Real identity/organizational details - never fabricated credentials',
    ],
  },
  {
    route: '/editorial-method/',
    whyNeeded:
      'The verification workflow IS our differentiator; showing it converts skeptics.',
    seoTrustRole:
      'Demonstrates methodology; natural citation magnet for writers/researchers.',
    launchCritical: true,
    mustContain: [
      'Three-tier evidence label definitions (attested / plausible / speculative)',
      'Recipe classification system (inspired / researched / reconstruction)',
      'Scripture-vs-interpretation separation policy',
      'How claims get verified and corrected',
    ],
    evidenceRequired: ['Method description only - no invented case studies'],
  },
  {
    route: '/sources/',
    whyNeeded:
      'A living register of works consulted gives citations a stable home.',
    seoTrustRole:
      'Supports academic-style credibility; helps link earning from study resources.',
    launchCritical: false,
    mustContain: [
      'Bibliography of actually-consulted works (grows with real research)',
      'Translation note once the Bible translation choice is finalized',
    ],
    evidenceRequired: [
      'Every listed source must have been genuinely consulted for published content',
    ],
  },
  {
    route: '/contact/',
    whyNeeded: 'Corrections channel and reader trust; basic accountability.',
    seoTrustRole:
      'Minor direct SEO value; supports trust evaluation and correction culture.',
    launchCritical: false,
    mustContain: ['Working contact route', 'Correction-request invitation'],
    evidenceRequired: ['Functional contact method before publishing the page'],
  },
];

export type MethodologyDomain =
  'scripture' | 'history' | 'recipes' | 'uncertainty';

export const METHODOLOGY_RULES: {
  domain: MethodologyDomain;
  rule: string;
}[] = [
  {
    domain: 'scripture',
    rule: 'Direct Biblical text is always typographically and structurally distinct from interpretation; quotations carry reference + translation.',
  },
  {
    domain: 'scripture',
    rule: 'No verse is quoted publicly until its wording is verified against the chosen translation (anchors start verified:false).',
  },
  {
    domain: 'history',
    rule: 'Historical statements are separated from inference; only attested facts are stated plainly, plausible reconstructions are hedged visibly.',
  },
  {
    domain: 'history',
    rule: 'Archaeological claims cite their find context; no borrowing of unsourced "experts say" phrasing observed in SERP content.',
  },
  {
    domain: 'recipes',
    rule: 'Every recipe displays exactly one classification: biblical-inspired, historically-researched, or reconstruction - chosen by documented criteria, not marketing.',
  },
  {
    domain: 'recipes',
    rule: 'Reconstruction recipes require cited primary/historical basis per ingredient decision where knowable.',
  },
  {
    domain: 'uncertainty',
    rule: 'When evidence is incomplete we say so in the text itself - gaps are never filled with AI confidence or decorative certainty.',
  },
  {
    domain: 'uncertainty',
    rule: 'Open questions are listed on-page where they materially affect conclusions.',
  },
];

/** Non-negotiables that override any growth consideration. */
export const TRUST_NON_NEGOTIABLES: string[] = [
  'No fabricated scripture references, ever.',
  'No health claims presented as Biblical authority.',
  'No doctrine originated by this site; contested theology is cited, attributed, and framed as contested.',
  'English-only public content; no mixed-language publication.',
];
