/**
 * V3C.4 PHASE 1A PILOT RESEARCH - OLIVES
 * ======================================
 * Olive research with two deliberate axis separations:
 * - Oil-specific claims (Exodus 27:20 lamp oil) sit under the separate
 *   'olive-oil' food entity, never collapsed into the tree/fruit subject.
 * - The KJV "oil olive" rendering of Deuteronomy 8:8 carries an explicit
 *   warning question (question-olives-deut-wording), so every verified olive
 *   claim records its uncertaintyNote per policy.
 *
 * MacDonald (2008) is cited only as identified-but-unconsulted context.
 */

import type { ResearchClaim, ScriptureVerificationRecord } from '../types';

const ACCESS_GATEWAY =
  'Bible Gateway, King James Version (multi-passage retrieval)';
const ACCESS_API = 'bible-api.com public domain KJV text';
const SESSION = '2026-08-23';

const WORDING_NOTE =
  'KJV renders the Deuteronomy 8:8 list item as "oil olive"; pages must keep tree, fruit and oil distinct until question-olives-deut-wording resolves.';

export const OLIVES_CLAIMS: ResearchClaim[] = [
  {
    id: 'claim-olives-deut-oil-olive',
    subjectId: 'olives',
    text: 'Deuteronomy 8:8 includes the olive in the land\u2019s signature products, rendered "oil olive" in KJV.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance:
      'V3C.4 Phase 1A pilot research session 2026-08-23 (KJV wording retrieved and recorded)',
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification: `KJV wording verified 2026-08-23; ${WORDING_NOTE}`,
      },
    ],
    uncertaintyNote: WORDING_NOTE,
    scriptureContext: {
      reference: { book: 'Deuteronomy', chapter: 8, verseStart: 8 },
      mode: 'reference-only',
      ambiguityQuestionId: 'question-olives-deut-wording',
    },
  },
  {
    id: 'claim-olives-noah-dove-leaf',
    subjectId: 'olives',
    text: 'Genesis 8:11 reports the dove returning to Noah with a freshly plucked olive leaf.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance:
      'V3C.4 Phase 1A pilot research session 2026-08-23 (KJV wording retrieved and recorded)',
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification: `KJV wording verified 2026-08-23. ${WORDING_NOTE}`,
      },
    ],
    uncertaintyNote: WORDING_NOTE,
    scriptureContext: {
      reference: { book: 'Genesis', chapter: 8, verseStart: 11 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-olives-micah-treading',
    subjectId: 'olives',
    text: 'Micah 6:15 depicts olive processing as treading the olives, paired with losing the anointing oil as covenant-curse imagery.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance:
      'V3C.4 Phase 1A pilot research session 2026-08-23 (KJV wording retrieved and recorded)',
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification: `Verse fact verified; the treading-to-oil process reading stays framed as imagery context. ${WORDING_NOTE}`,
      },
    ],
    uncertaintyNote: WORDING_NOTE,
    scriptureContext: {
      reference: { book: 'Micah', chapter: 6, verseStart: 15 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-olives-beating-gleaning',
    subjectId: 'olives',
    text: 'Deuteronomy 24:20 commands beating the olive harvest once, leaving what remains for the stranger, fatherless and widow.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance:
      'V3C.4 Phase 1A pilot research session 2026-08-23 (KJV wording retrieved and recorded)',
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification: `KJV wording verified 2026-08-23. ${WORDING_NOTE}`,
      },
    ],
    uncertaintyNote: WORDING_NOTE,
    scriptureContext: {
      reference: { book: 'Deuteronomy', chapter: 24, verseStart: 20 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-olive-oil-tabernacle-lamp',
    subjectId: 'olive-oil',
    text: 'Exodus 27:20 prescribes pure beaten "oil olive" for the tabernacle lamp to burn continually.',
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
          'KJV wording verified 2026-08-23; tracked under the olive-oil entity, not the tree/fruit subject.',
      },
    ],
    scriptureContext: {
      reference: { book: 'Exodus', chapter: 27, verseStart: 20 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-olives-jotham-parable',
    subjectId: 'olives',
    text: 'Judges 9:8-9 pictures the olive tree declining kingship because its "fatness" honors God and man.',
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
          'Parable material - symbolic framing must stay visible on any page use.',
      },
    ],
    uncertaintyNote: `Parable framing note. ${WORDING_NOTE}`,
    scriptureContext: {
      reference: { book: 'Judges', chapter: 9, verseStart: 8, verseEnd: 9 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-olives-dietary-staple-fat',
    subjectId: 'olives',
    text: 'Scholarship treats olive oil as the principal dietary fat of the ancient Israelite diet.',
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

export const OLIVES_VERIFICATION_RECORDS: ScriptureVerificationRecord[] = [
  {
    id: 'verify-olives-deut-oil-olive',
    claimId: 'claim-olives-deut-oil-olive',
    referenceText: 'Deuteronomy 8:8',
    translation: 'kjv',
    verifiedWording:
      'A land of wheat, and barley, and vines, and fig trees, and pomegranates; a land of oil olive, and honey;',
    accessedAt: SESSION,
    accessPoint: ACCESS_GATEWAY,
  },
  {
    id: 'verify-olives-noah-dove-leaf',
    claimId: 'claim-olives-noah-dove-leaf',
    referenceText: 'Genesis 8:11',
    translation: 'kjv',
    verifiedWording:
      'And the dove came in to him in the evening; and, lo, in her mouth was an olive leaf pluckt off: so Noah knew that the waters were abated from off the earth.',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
  {
    id: 'verify-olives-micah-treading',
    claimId: 'claim-olives-micah-treading',
    referenceText: 'Micah 6:15',
    translation: 'kjv',
    verifiedWording:
      'Thou shalt sow, but thou shalt not reap; thou shalt tread the olives, but thou shalt not anoint thee with oil; and sweet wine, but shalt not drink wine.',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
  {
    id: 'verify-olives-beating-gleaning',
    claimId: 'claim-olives-beating-gleaning',
    referenceText: 'Deuteronomy 24:20',
    translation: 'kjv',
    verifiedWording:
      'When thou beatest thine olive tree, thou shalt not go over the boughs again: it shall be for the stranger, for the fatherless, and for the widow.',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
  {
    id: 'verify-olive-oil-tabernacle-lamp',
    claimId: 'claim-olive-oil-tabernacle-lamp',
    referenceText: 'Exodus 27:20',
    translation: 'kjv',
    verifiedWording:
      'And thou shalt command the children of Israel, that they bring thee pure oil olive beaten for the light, to cause the lamp to burn always.',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
  {
    id: 'verify-olives-jotham-parable',
    claimId: 'claim-olives-jotham-parable',
    referenceText: 'Judges 9:8-9',
    translation: 'kjv',
    verifiedWording:
      'The trees went forth on a time to anoint a king over them; and they said unto the olive tree, Reign thou over us. But the olive tree said unto them, Should I leave my fatness, wherewith by me they honour God and man, and go to be promoted over the trees?',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
];

export const OLIVES_DOSSIER_NOTES: string[] = [
  `Research session ${SESSION}: 7 KJV passages retrieved and wording-recorded (Bible Gateway multi-passage retrieval + bible-api.com public domain KJV text).`,
  'Wording disclosure: Deuteronomy 8:8 KJV "oil olive" - tree/fruit/oil scope question registered (question-olives-deut-wording, warning-class); every verified olive claim carries the disclosure note.',
  'Axis separation: Exodus 27:20 lamp-oil claim lives under the olive-oil entity, not the olives tree/fruit subject.',
  'Framing guardrail: Judges 9:8-9 and Micah 6:15 are symbolic/covenant-curse contexts - never presented as agricultural manuals.',
  'Open item: MacDonald (2008) dietary-fat context remains unconsulted; dependent claim stays unverified and off-page.',
];
