/** V3C.4 PHASE 1B RESEARCH - BARLEY (KJV session 2026-08-23). */
import type { ResearchClaim, ScriptureVerificationRecord } from '../types';

const ACCESS_API = 'bible-api.com public domain KJV text';
const SESSION = '2026-08-23';

export const BARLEY_CLAIMS: ResearchClaim[] = [
  {
    id: 'claim-barley-deut-signature-list',
    subjectId: 'barley',
    text: 'Deuteronomy 8:8 names barley among the agricultural products of the land.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 1B research session ${SESSION} (KJV wording retrieved and recorded)`,
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification:
          'KJV wording verified; this does not establish a universal diet.',
      },
    ],
    scriptureContext: {
      reference: { book: 'Deuteronomy', chapter: 8, verseStart: 8 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-barley-ruth-harvest',
    subjectId: 'barley',
    text: "Ruth 1:22 places Naomi and Ruth's arrival in Bethlehem at the beginning of barley harvest.",
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 1B research session ${SESSION} (KJV wording retrieved and recorded)`,
    supports: [{ sourceId: 'scripture-canon', level: 'direct' }],
    scriptureContext: {
      reference: { book: 'Ruth', chapter: 1, verseStart: 22 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-barley-ruth-gleaning',
    subjectId: 'barley',
    text: 'Ruth 2:23 reports gleaning through the end of barley harvest and wheat harvest.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 1B research session ${SESSION} (KJV wording retrieved and recorded)`,
    supports: [{ sourceId: 'scripture-canon', level: 'direct' }],
    scriptureContext: {
      reference: { book: 'Ruth', chapter: 2, verseStart: 23 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-barley-gideon-bread',
    subjectId: 'barley',
    text: "Judges 7:13 uses a cake of barley bread in Gideon's reported dream.",
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 1B research session ${SESSION} (KJV wording retrieved and recorded)`,
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification:
          'Dream narrative and symbolic interpretation; not a recipe.',
      },
    ],
    uncertaintyNote:
      'The passage is a dream report with symbolic interpretation, not a reconstructed barley-bread recipe.',
    scriptureContext: {
      reference: { book: 'Judges', chapter: 7, verseStart: 13 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-barley-elisha-provision',
    subjectId: 'barley',
    text: '2 Kings 4:42 reports twenty loaves of barley among firstfruits brought to the man of God for people to eat.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 1B research session ${SESSION} (KJV wording retrieved and recorded)`,
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification:
          'Narrative provision account; not evidence for a standard recipe.',
      },
    ],
    scriptureContext: {
      reference: { book: '2 Kings', chapter: 4, verseStart: 42 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-barley-john-loaves',
    subjectId: 'barley',
    text: 'John 6:9 reports a lad having five barley loaves and two small fishes.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 1B research session ${SESSION} (KJV wording retrieved and recorded)`,
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification:
          'Narrative food detail; it does not reconstruct a general daily meal.',
      },
    ],
    scriptureContext: {
      reference: { book: 'John', chapter: 6, verseStart: 9 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-barley-exodus-crop',
    subjectId: 'barley',
    text: 'Exodus 9:31 says the barley was in the ear when the hail smote the crop.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 1B research session ${SESSION} (KJV wording retrieved and recorded)`,
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification: 'Plague narrative agricultural context.',
      },
    ],
    scriptureContext: {
      reference: { book: 'Exodus', chapter: 9, verseStart: 31 },
      mode: 'reference-only',
    },
  },
];

export const BARLEY_VERIFICATION_RECORDS: ScriptureVerificationRecord[] = [
  {
    id: 'verify-barley-deut-signature-list',
    claimId: 'claim-barley-deut-signature-list',
    referenceText: 'Deuteronomy 8:8',
    translation: 'kjv',
    verifiedWording:
      'A land of wheat, and barley, and vines, and fig trees, and pomegranates; a land of oil olive, and honey;',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
  {
    id: 'verify-barley-ruth-harvest',
    claimId: 'claim-barley-ruth-harvest',
    referenceText: 'Ruth 1:22',
    translation: 'kjv',
    verifiedWording:
      'So Naomi returned, and Ruth the Moabitess, her daughter in law, with her, which returned out of the country of Moab: and they came to Bethlehem in the beginning of barley harvest.',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
  {
    id: 'verify-barley-ruth-gleaning',
    claimId: 'claim-barley-ruth-gleaning',
    referenceText: 'Ruth 2:23',
    translation: 'kjv',
    verifiedWording:
      'So she kept fast by the maidens of Boaz to glean unto the end of barley harvest and of wheat harvest; and dwelt with her mother in law.',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
  {
    id: 'verify-barley-gideon-bread',
    claimId: 'claim-barley-gideon-bread',
    referenceText: 'Judges 7:13',
    translation: 'kjv',
    verifiedWording:
      'And when Gideon was come, behold, there was a man that told a dream unto his fellow, and said, Behold, I dreamed a dream, and, lo, a cake of barley bread tumbled into the host of Midian, and came unto a tent, and smote it that it fell, and overturned it, that the tent lay along.',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
  {
    id: 'verify-barley-elisha-provision',
    claimId: 'claim-barley-elisha-provision',
    referenceText: '2 Kings 4:42',
    translation: 'kjv',
    verifiedWording:
      'And there came a man from Baal-shalisha, and brought the man of God bread of the firstfruits, twenty loaves of barley, and full ears of corn in the husk thereof. And he said, Give unto the people, that they may eat.',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
  {
    id: 'verify-barley-john-loaves',
    claimId: 'claim-barley-john-loaves',
    referenceText: 'John 6:9',
    translation: 'kjv',
    verifiedWording:
      'There is a lad here, which hath five barley loaves, and two small fishes: but what are they among so many?',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
  {
    id: 'verify-barley-exodus-crop',
    claimId: 'claim-barley-exodus-crop',
    referenceText: 'Exodus 9:31',
    translation: 'kjv',
    verifiedWording:
      'And the flax and the barley was smitten: for the barley was in the ear, and the flax was bolled.',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
];

export const BARLEY_DOSSIER_NOTES = [
  `Research session ${SESSION}: 7 KJV passages retrieved and wording-recorded via bible-api.com; Deuteronomy 8:8 and Judges 7:13 were also checked through Bible Gateway retrieval.`,
  'Barley is directly attested in agricultural, harvest, provision, and narrative bread contexts.',
  'Judges 7:13 is dream symbolism, and 2 Kings 4:42 and John 6:9 are narrative food contexts; none independently supplies a universal diet or reconstructed recipe.',
  'No historical or archaeological claim was promoted without a separately reviewed source.',
];
