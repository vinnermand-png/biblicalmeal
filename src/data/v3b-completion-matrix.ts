/**
 * V3B COMPLETION MATRIX (closure audit 2026-08-23)
 * ================================================
 * Code-maintained record of every V3B closure item and its explicit
 * classification. This is the phase gate: if any item has blocking:true,
 * the seo-map tests fail and V3B cannot be declared complete.
 *
 * Classifications:
 * - verified             : checked against repository or live evidence
 * - resolved-with-caveat : resolved, with a documented condition attached
 * - explicitly-deferred  : intentionally postponed with a trigger/timing
 * - not-blocking         : real, but belongs to a later phase by design
 */

export type MatrixClassification =
  'verified' | 'resolved-with-caveat' | 'explicitly-deferred' | 'not-blocking';

export interface CompletionItem {
  id: string;
  title: string;
  category:
    | 'research-dependency'
    | 'strategy-integrity'
    | 'technical-seo'
    | 'data-boundary';
  /** 'open' only while blocking is true. */
  status: 'closed' | 'open';
  classification: MatrixClassification;
  blocking: boolean;
  evidence: string;
  notes?: string;
  requiredAction?: string;
}

export const V3B_COMPLETION_MATRIX: CompletionItem[] = [
  {
    id: 'deut-8-8',
    title: 'Deuteronomy 8:8 species wording verification',
    category: 'research-dependency',
    status: 'closed',
    classification: 'not-blocking',
    blocking: false,
    evidence:
      'Represented in map + brief as an explicit publication blocker for the seven-species ARTICLE ONLY (researchRequired + anchor verified:false).',
    notes:
      'Blocks that article entering production (V3C gate), not the strategy phase: the strategy already treats it as blocked.',
    requiredAction:
      'Verify exact wording in chosen translation before the seven-species brief can be approved.',
  },
  {
    id: 'translation-choice',
    title: 'Sitewide Bible translation decision',
    category: 'research-dependency',
    status: 'closed',
    classification: 'explicitly-deferred',
    blocking: false,
    evidence:
      'CITATION_RULES: translation finalized BEFORE FIRST PUBLICATION and documented once; architecture is intentionally translation-agnostic until production begins.',
    requiredAction:
      'Decide and document before any public page quotes scripture.',
  },
  {
    id: 'luke-24',
    title: 'Luke 24:42-43 wording verification',
    category: 'research-dependency',
    status: 'closed',
    classification: 'not-blocking',
    blocking: false,
    evidence:
      'Recorded as claim-to-verify in RESEARCH_LOG and Jesus-food brief anchors (verified:false). Repetition by competitors re-observed in 2026-08-23 meat SERP.',
    notes: 'Article-level research belonging to V3C.',
  },
  {
    id: 'locust-carob',
    title: 'Locust vs carob clarification (John the Baptist)',
    category: 'research-dependency',
    status: 'closed',
    classification: 'not-blocking',
    blocking: false,
    evidence: 'Owned by the john-the-baptist-diet brief researchRequired.',
    notes: 'Article-level research belonging to V3C.',
  },
  {
    id: 'macdonald-2008',
    title: 'MacDonald (2008) daily-life scholarly anchor',
    category: 'research-dependency',
    status: 'closed',
    classification: 'not-blocking',
    blocking: false,
    evidence:
      'Identified in clusters/briefs as the anchor to consult during pillar research.',
    notes: 'Pillar research input for V3C; strategy reference already correct.',
  },
  {
    id: 'fruits-serp',
    title: 'Fruits-in-the-bible SERP validation',
    category: 'strategy-integrity',
    status: 'closed',
    classification: 'verified',
    blocking: false,
    evidence:
      'Live search 2026-08-23 logged in RESEARCH_LOG: symbolism-heavy results dominate; BAS sets scholarly bar. Target retained, now serp-observed.',
  },
  {
    id: 'vegetables-serp',
    title: 'Vegetables-in-the-bible SERP validation',
    category: 'strategy-integrity',
    status: 'closed',
    classification: 'verified',
    blocking: false,
    evidence:
      'Live search 2026-08-23 logged: verse-collection pages dominate; dedicated editorial gap confirmed. Target retained, serp-observed.',
  },
  {
    id: 'meat-serp',
    title: 'Meat-in-the-bible SERP validation',
    category: 'strategy-integrity',
    status: 'closed',
    classification: 'resolved-with-caveat',
    blocking: false,
    evidence:
      'Live search 2026-08-23 logged: results dominated by contested clean/unclean doctrine arguing opposite positions (incl. pro-pork claims).',
    notes:
      'Target retained with the strongest guardrails of any category page; qualified theological review REQUIRED before its brief approval.',
    requiredAction:
      'Theological review gate recorded in target researchRequired; enforced before V3C production of this page.',
  },
  {
    id: 'biblical-recipes-review',
    title: 'Manual depth review of biblical.recipes',
    category: 'strategy-integrity',
    status: 'closed',
    classification: 'explicitly-deferred',
    blocking: false,
    evidence:
      'competitor-gap.ts records that depth is not assessable from SERP listings alone.',
    requiredAction:
      'Manual content review during post-launch competitor monitoring.',
  },
  {
    id: 'date-honey',
    title: 'Date-honey identification question',
    category: 'research-dependency',
    status: 'closed',
    classification: 'not-blocking',
    blocking: false,
    evidence: 'Inventory and honey profile carry requires-verification labels.',
  },
  {
    id: 'apple-id',
    title: 'Apple (tappuach) identification debate',
    category: 'research-dependency',
    status: 'closed',
    classification: 'not-blocking',
    blocking: false,
    evidence: 'Inventory: uncertain-identification, research-first.',
  },
  {
    id: 'melon-id',
    title: 'Melon identification question',
    category: 'research-dependency',
    status: 'closed',
    classification: 'not-blocking',
    blocking: false,
    evidence: 'Inventory: uncertain-identification, supporting-topic.',
  },
  {
    id: 'hyssop-id',
    title: 'Hyssop plant identification',
    category: 'research-dependency',
    status: 'closed',
    classification: 'not-blocking',
    blocking: false,
    evidence: 'Inventory: uncertain-identification, research-first.',
  },
  {
    id: 'og-image',
    title: 'Branded OG image (1200x630)',
    category: 'technical-seo',
    status: 'closed',
    classification: 'explicitly-deferred',
    blocking: false,
    evidence:
      'BaseLayout TODO + TECH_SEO_EXPANSION_CHECKLIST timing: before first pillar publishes.',
    requiredAction:
      'Produce branded social image before Phase 2 pillar launch.',
  },
  {
    id: 'custom-404',
    title: 'Custom 404 page',
    category: 'technical-seo',
    status: 'closed',
    classification: 'not-blocking',
    blocking: false,
    evidence:
      'Audit found src/pages/404.astro absent; Astro default handling functional; no published content routes today minimizes impact.',
    requiredAction: 'Add branded 404 before public launch.',
  },
  {
    id: 'post-launch-boundary',
    title: 'Future data never presented as current evidence',
    category: 'data-boundary',
    status: 'closed',
    classification: 'verified',
    blocking: false,
    evidence:
      'All POST_LAUNCH_LOOP stages carry dataStatus future, enforced by tests; DATA_LIMITS_DISCLAIMER shipped in data and dashboard.',
  },
  {
    id: 'dashboard-protection',
    title:
      '/seo-map/ stays internal (noindex, sitemap-excluded, empty prod shell)',
    category: 'data-boundary',
    status: 'closed',
    classification: 'verified',
    blocking: false,
    evidence:
      'BaseLayout noindex prop + astro.config filter + import.meta.env.DEV shell; verified in dist after build.',
  },
  {
    id: 'english-only',
    title: 'English-only public strategy content',
    category: 'data-boundary',
    status: 'closed',
    classification: 'verified',
    blocking: false,
    evidence:
      'Danish-character scan test across all public-facing datasets passes.',
  },
  {
    id: 'no-fabricated-metrics',
    title: 'No invented volume/difficulty/ranking data anywhere',
    category: 'data-boundary',
    status: 'closed',
    classification: 'verified',
    blocking: false,
    evidence:
      'Framework labelled effort-prioritization; priorities derived only from dated logged searches; disclaimer test enforced.',
  },
  {
    id: 'canonical-protection',
    title: 'One intent = one canonical owner (cannibalization guards)',
    category: 'strategy-integrity',
    status: 'closed',
    classification: 'verified',
    blocking: false,
    evidence:
      'Tests enforce unique primaries, unique family owners, full pursuing coverage, and section-only variants never colliding with targets (incl. what-did-jesus-drink).',
  },
];
