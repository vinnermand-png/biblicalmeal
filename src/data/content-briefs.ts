/**
 * SEO CONTENT BRIEF SYSTEM (V3B)
 * ==============================
 * A brief is the mandatory gate between "keyword idea" and "page gets written".
 * No page may be drafted without an approved brief that satisfies this schema.
 *
 * Rules enforced by process (checked in seo-map tests where automatable):
 * - brief.targetId MUST reference an existing SEO_TARGETS entry.
 * - Scripture anchors start as verified:false until checked against the chosen
 *   translation; pages may not publish with unverified anchors.
 * - Every claim class must state its intended tier: attested / plausible /
 *   speculative (three-tier evidence labels).
 * - Honesty guardrails are non-negotiable content constraints.
 */

export type BriefStatus = 'draft' | 'in-review' | 'approved';

/** Which production template the page will use (Part 10 readiness). */
export type BriefType =
  'pillar' | 'ingredient' | 'historical-article' | 'question-page' | 'recipe';

export interface ScriptureAnchor {
  /** Human-readable reference, e.g. "Deuteronomy 8:8". */
  reference: string;
  /** Why this passage matters for the page. */
  note: string;
  /** True ONLY after checking exact wording against the chosen translation. */
  verified: boolean;
}

export interface ContentBrief {
  /** Unique brief id; conventionally equals the target id. */
  id: string;
  /** Must match a SeoTarget.id from the master map. */
  targetId: string;
  briefType?: BriefType;
  workingTitle: string;
  workingRoute: string;
  /** The editorial angle - why our page deserves to exist. */
  angle: string;
  audience: string;
  intentSummary: string;
  /** Questions the page must answer above the fold of its section. */
  mustAnswer: string[];
  scriptureAnchors: ScriptureAnchor[];
  /**
   * Claim classes with their required evidence tier:
   * 'attested' = explicit text/archaeology; 'plausible' = reasoned consensus;
   * 'speculative' = clearly labeled interpretation only.
   */
  claimPlan: {
    claimClass: string;
    tier: 'attested' | 'plausible' | 'speculative';
  }[];
  sourcesToConsult: string[];
  /** Target ids or existing slugs this page should link into. */
  linksInto: string[];
  /** Target ids expected to link back once published. */
  linksFrom: string[];
  differentiator: string;
  honestyGuardrails: string[];
  /**
   * Source kinds the finished page must carry (see source-citations.ts).
   * Optional for legacy briefs; required for newly approved briefs.
   */
  citationPlan?: string[];
  status: BriefStatus;
  updatedAt: string;
}

export const CONTENT_BRIEFS: ContentBrief[] = [
  {
    id: 'what-did-jesus-eat',
    targetId: 'what-did-jesus-eat',
    briefType: 'pillar',
    workingTitle: 'What Did Jesus Eat? Food in First-Century Galilee',
    workingRoute: '/articles/what-did-jesus-eat/',
    angle:
      'A verse-by-verse food inventory of the Gospels, each item labeled by evidence tier, set against the scholarly picture of the Galilean peasant diet.',
    audience:
      'Readers curious about the historical Jesus and daily life; explicitly not a diet-advice audience.',
    intentSummary:
      'Informational. Searchers want a concrete list plus honest uncertainty; competitors hedge vaguely or assert without sources.',
    mustAnswer: [
      'Which foods are explicitly named in Gospel narratives?',
      'What does scholarship say about the typical first-century Galilean diet?',
      'Did Jesus eat meat? (Section, not a standalone page.)',
      'The Luke 24 eating-reference question: what does the text actually say? (Verify before asserting.)',
      'Which foods were common, festive, or avoided in his cultural context?',
    ],
    scriptureAnchors: [
      {
        reference: 'Luke 24:42-43',
        note: 'Claimed by SERP content as the only explicit eating reference - verify wording before adopting.',
        verified: false,
      },
      {
        reference: 'Matthew 26:26-29',
        note: 'Bread and cup at the Passover meal narrative.',
        verified: false,
      },
      {
        reference: 'John 21:9-13',
        note: 'Fish and bread by the Sea of Galilee.',
        verified: false,
      },
    ],
    claimPlan: [
      {
        claimClass: 'Foods named in Gospel texts',
        tier: 'attested',
      },
      {
        claimClass: 'General Galilean dietary staples',
        tier: 'plausible',
      },
      {
        claimClass:
          'Any statement about Jesus personal preferences or habits beyond texts',
        tier: 'speculative',
      },
    ],
    sourcesToConsult: [
      'Peer-reviewed literature on first-century Galilee (list specific monographs during research pass)',
      'Primary Gospel texts in the chosen translation',
      'Museum/archaeobotanical summaries for Galilee finds',
    ],
    linksInto: ['fish', 'bread-in-the-bible', 'last-supper-foods'],
    linksFrom: [
      'foods-of-the-bible',
      'food-in-biblical-times',
      'homepage-brand',
    ],
    differentiator:
      'Three-tier evidence labeling on every claim; no competitor observed doing this systematically.',
    honestyGuardrails: [
      'Never present plausible reconstructions as biblical fact.',
      'No health or diet recommendations drawn from the topic.',
      'Doctrinal questions cite recognized teachers; this site originates no doctrine.',
    ],
    citationPlan: ['scripture', 'academic'],
    status: 'approved',
    updatedAt: '2026-08-23',
  },
  {
    id: 'seven-foods-deuteronomy-8',
    targetId: 'seven-foods-deuteronomy-8',
    briefType: 'historical-article',
    workingTitle: 'The Seven Foods of the Promised Land',
    workingRoute: '/articles/seven-foods-of-the-promised-land/',
    angle:
      'Single-passage anchor (Deuteronomy 8) turned into a hub article linking all seven ingredient profiles - depth through structure, not padding.',
    audience:
      'Bible readers who met the "seven species" idea and want the actual text and each food explained.',
    intentSummary:
      'Informational with strong navigational potential into ingredient cluster.',
    mustAnswer: [
      'What exactly does the passage name? (BLOCKED until Deuteronomy 8:8 verification completes.)',
      'Why these seven? Agricultural and covenant context.',
      'Where does each food appear elsewhere in scripture? (Link to profiles.)',
    ],
    scriptureAnchors: [
      {
        reference: 'Deuteronomy 8:8',
        note: 'Longstanding project TODO: verify exact species enumeration in chosen translation before ANY publication.',
        verified: false,
      },
    ],
    claimPlan: [
      { claimClass: 'Species named in the passage', tier: 'attested' },
      { claimClass: 'Agrarian symbolism interpretations', tier: 'plausible' },
      { claimClass: 'Numerological readings', tier: 'speculative' },
    ],
    sourcesToConsult: [
      'Chosen translation source text for Deuteronomy 8',
      'Scholarly commentary on Deuteronomy (identify specific volume in research pass)',
    ],
    linksInto: [
      'wheat',
      'barley',
      'grapes',
      'figs',
      'pomegranate',
      'olives',
      'dates',
      'honey',
    ],
    linksFrom: ['foods-of-the-bible'],
    differentiator:
      'Every listed food deep-links to a full researched profile - SERP lists observed are flat.',
    honestyGuardrails: [
      'Publish nothing until the Deuteronomy 8:8 verification TODO is closed.',
      'Present symbolic interpretations as interpretive traditions, not facts.',
    ],
    citationPlan: ['scripture', 'academic', 'translation-note'],
    status: 'in-review',
    updatedAt: '2026-08-23',
  },
];

export function getBriefByTargetId(targetId: string): ContentBrief | undefined {
  return CONTENT_BRIEFS.find((b) => b.targetId === targetId);
}
