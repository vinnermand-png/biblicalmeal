/**
 * V3C.4 PHASE 1A PILOT RESEARCH - LENTILS
 * =======================================
 * Lentil research pairing verified KJV narrative passages with the first
 * retrieved archaeological context (BAS report of a Weizmann/IAA study).
 *
 * Guardrails recorded in the dossier notes: Genesis 25 is narrative, never a
 * recipe endorsement; Ezekiel 4:9 depicts siege conditions - any future
 * "Ezekiel bread" recipe content must keep that framing visible.
 */

import type { ResearchClaim, ScriptureVerificationRecord } from '../types';

const ACCESS_API = 'bible-api.com public domain KJV text';
const SESSION = '2026-08-23';

export const LENTILS_CLAIMS: ResearchClaim[] = [
  {
    id: 'claim-lentils-esau-pottage',
    subjectId: 'lentils',
    text: 'Genesis 25:29-34 records Jacob cooking lentil pottage ("pottage of lentiles"), for which Esau traded his birthright; the red stew request underlies the Edom name wordplay.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance:
      'V3C.4 Phase 1A pilot research session 2026-08-23 (KJV wording retrieved and recorded)',
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification:
          'KJV wording verified 2026-08-23; see verification record.',
      },
    ],
    scriptureContext: {
      reference: { book: 'Genesis', chapter: 25, verseStart: 29, verseEnd: 34 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-lentils-david-provision',
    subjectId: 'lentils',
    text: '2 Samuel 17:28-29 lists lentiles among the provisions brought to David\u2019s hungry and weary people at Mahanaim.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance:
      'V3C.4 Phase 1A pilot research session 2026-08-23 (KJV wording retrieved and recorded)',
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification:
          'KJV wording verified 2026-08-23; see verification record.',
      },
    ],
    scriptureContext: {
      reference: {
        book: '2 Samuel',
        chapter: 17,
        verseStart: 27,
        verseEnd: 29,
      },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-lentils-ezekiel-siege-bread',
    subjectId: 'lentils',
    text: 'Ezekiel 4:9 prescribes a mixed-grain bread including lentiles, eaten by weight for 390 days as enacted siege conditions.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance:
      'V3C.4 Phase 1A pilot research session 2026-08-23 (KJV wording retrieved and recorded)',
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification:
          'Siege-symbolism context - any recipe content derived from this verse must keep the famine framing visible.',
      },
    ],
    scriptureContext: {
      reference: { book: 'Ezekiel', chapter: 4, verseStart: 9 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-lentils-neolithic-galilee-diet',
    subjectId: 'lentils',
    text: 'A Weizmann Institute / Israel Antiquities Authority study of Neolithic Galilee sites found legumes - including lentils alongside fava beans, peas and chickpeas - formed a substantial part of the prehistoric diet.',
    category: 'archaeological',
    evidence: 'attested',
    verification: 'in-review',
    provenance: `V3C.4 Phase 1A research session ${SESSION}: BAS article reporting the study retrieved; full article and underlying report review pending`,
    supports: [
      {
        sourceId: 'bas-2015-ancient-beans',
        level: 'direct',
        qualification:
          'Directly stated in the retrieved BAS article text (secondary reporting of the Weizmann/IAA study); claim stays in-review until the article is fully reviewed.',
      },
    ],
    uncertaintyNote:
      'Based on secondary archaeological reporting retrieved 2026-08-23; full review pending before any page use.',
  },
  {
    id: 'claim-lentils-early-legume-domestication',
    subjectId: 'lentils',
    text: 'Researchers in the same study suggested that, west of the Jordan River, legumes were among the first plant species domesticated.',
    category: 'archaeological',
    evidence: 'plausible',
    verification: 'in-review',
    provenance: `V3C.4 Phase 1A research session ${SESSION}: researcher statement quoted in the retrieved BAS article`,
    supports: [
      {
        sourceId: 'bas-2015-ancient-beans',
        level: 'partial',
        qualification:
          'Single-study researcher statement as quoted by BAS; treated as plausible, not settled science.',
      },
    ],
    uncertaintyNote:
      'Researcher interpretation from one study (as reported by BAS); scope-limited to west of the Jordan River.',
  },
  {
    id: 'claim-lentils-iron-age-staple-pulse',
    subjectId: 'lentils',
    text: 'Lentils were a routine pulse staple in the ancient Israelite diet.',
    category: 'historical',
    evidence: 'plausible',
    verification: 'unverified',
    provenance:
      'V3B strategy identification; consultation still pending (honest placeholder, no page use before research)',
    supports: [
      {
        sourceId: 'macdonald-2008',
        level: 'contextual',
        qualification:
          'Source identified as daily-life anchor in V3B but NOT yet consulted; claim remains unverified and must not appear on any page until checked.',
      },
    ],
    uncertaintyNote:
      'Unverified contextual attribution - MacDonald (2008) has not been consulted yet.',
  },
];

export const LENTILS_VERIFICATION_RECORDS: ScriptureVerificationRecord[] = [
  {
    id: 'verify-lentils-esau-pottage',
    claimId: 'claim-lentils-esau-pottage',
    referenceText: 'Genesis 25:34',
    translation: 'kjv',
    verifiedWording:
      'Then Jacob gave Esau bread and pottage of lentiles; and he did eat and drink, and rose up, and went his way: thus Esau despised his birthright.',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
  {
    id: 'verify-lentils-david-provision',
    claimId: 'claim-lentils-david-provision',
    referenceText: '2 Samuel 17:28',
    translation: 'kjv',
    verifiedWording:
      'Brought beds, and basons, and earthen vessels, and wheat, and barley, and flour, and parched corn, and beans, and lentiles, and parched pulse,',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
  {
    id: 'verify-lentils-ezekiel-siege-bread',
    claimId: 'claim-lentils-ezekiel-siege-bread',
    referenceText: 'Ezekiel 4:9',
    translation: 'kjv',
    verifiedWording:
      'Take thou also unto thee wheat, and barley, and beans, and lentiles, and millet, and fitches, and put them in one vessel, and make thee bread thereof, according to the number of the days that thou shalt lie upon thy side, three hundred and ninety days shalt thou eat thereof.',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
];

export const LENTILS_DOSSIER_NOTES: string[] = [
  `Research session ${SESSION}: 6 KJV passages retrieved and wording-recorded (Bible Gateway multi-passage retrieval + bible-api.com public domain KJV text); BAS archaeological article retrieved via search with substantial verbatim content.`,
  'Recipe guardrail: Genesis 25:29-34 is narrative - it must never be presented as a recipe endorsement or reconstruction basis on its own.',
  'Framing guardrail: Ezekiel 4:9 enacts siege/famine conditions - any "Ezekiel bread" recipe content must keep that framing visible (gate warning already covers reconstructed recipes).',
  'Archaeological claims stay in-review until the BAS article and underlying Weizmann/IAA report are fully reviewed; disclosure notes are mandatory meanwhile.',
  'Open item: MacDonald (2008) staple-pulse context remains unconsulted; dependent claim stays unverified and off-page.',
];
