/** V3C.4 PHASE 1C: minimal cornerstone-level research, without duplicating ingredient claims. */
import type { ResearchClaim, ScriptureVerificationRecord } from './types';

const SESSION = '2026-08-23';
const API = 'bible-api.com public domain KJV text';

export const CORNERSTONE_CLAIMS: ResearchClaim[] = [
  {
    id: 'claim-foods-of-bible-category-boundary',
    subjectId: 'foods-of-the-bible',
    text: 'Deuteronomy 8:8 presents a land description naming wheat, barley, vines, fig trees, pomegranates, oil olive, and honey; it does not by itself define a complete catalog of biblical foods.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 1C research session ${SESSION}`,
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification:
          'Overview framing preserves the distinction between a named passage list and a complete food inventory.',
      },
    ],
    uncertaintyNote:
      'The passage is not treated as an exhaustive list, and “oil olive” and “honey” retain their existing scope questions.',
    scriptureContext: {
      reference: { book: 'Deuteronomy', chapter: 8, verseStart: 8 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-jesus-explicit-fish-honeycomb',
    subjectId: 'what-did-jesus-eat',
    text: 'Luke 24:42-43 explicitly reports that Jesus was given broiled fish and honeycomb and ate before the disciples.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 1C research session ${SESSION}`,
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification:
          'This is an explicit narrative consumption claim; it is not expanded into assumptions about every meal.',
      },
    ],
    uncertaintyNote:
      'This passage supports only the foods explicitly described in this scene; period context and inferred foods remain separate.',
    scriptureContext: {
      reference: { book: 'Luke', chapter: 24, verseStart: 42, verseEnd: 43 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-biblical-times-no-universal-diet',
    subjectId: 'food-in-biblical-times',
    text: 'Scripture passages about food are context-specific and do not, without separate historical evidence, establish one universal everyday diet for every biblical community and period.',
    category: 'modern-contextual',
    evidence: 'plausible',
    verification: 'unverified',
    provenance: `V3C.4 Phase 1C research session ${SESSION}: methodological synthesis`,
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'contextual',
        qualification:
          'Methodological conclusion; no historical source was promoted for this claim.',
      },
    ],
    uncertaintyNote:
      'A period-and-region-specific historical source review remains required before detailed everyday-diet statements.',
  },
];

export const CORNERSTONE_VERIFICATION_RECORDS: ScriptureVerificationRecord[] = [
  {
    id: 'verify-foods-of-bible-category-boundary',
    claimId: 'claim-foods-of-bible-category-boundary',
    referenceText: 'Deuteronomy 8:8',
    translation: 'kjv',
    verifiedWording:
      'A land of wheat, and barley, and vines, and fig trees, and pomegranates; a land of oil olive, and honey;',
    accessedAt: SESSION,
    accessPoint: API,
  },
  {
    id: 'verify-jesus-explicit-fish-honeycomb',
    claimId: 'claim-jesus-explicit-fish-honeycomb',
    referenceText: 'Luke 24:42-43',
    translation: 'kjv',
    verifiedWording:
      'And they gave him a piece of a broiled fish, and of an honeycomb. And he took it, and did eat before them.',
    accessedAt: SESSION,
    accessPoint: API,
  },
];

export const CORNERSTONE_DOSSIER_NOTES: Record<string, string[]> = {
  'foods-of-the-bible': [
    `Research session ${SESSION}: overview boundary checked against Deuteronomy 8:8 KJV.`,
    'The 58-entity inventory remains a methodology-backed inventory, not a claim of a complete biblical-food count.',
    'Ritual substances remain excluded from food targets.',
  ],
  'what-did-jesus-eat': [
    `Research session ${SESSION}: Luke 24:42-43 KJV retrieved and wording-recorded.`,
    'Explicit consumption is separated from associated foods, period context, and speculation.',
    'No ingredient claims were copied into this cornerstone dossier.',
  ],
  'food-in-biblical-times': [
    `Research session ${SESSION}: historical scope methodology recorded.`,
    'No universal everyday diet claim was promoted; period, geography, and evidence type must remain explicit.',
    'No external historical source was added because none was fully reviewed in this session.',
  ],
};
