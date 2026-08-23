/** V3C.4 PHASE 1B RESEARCH - HONEY (devash ambiguity retained). */
import type { ResearchClaim, ScriptureVerificationRecord } from '../types';
const ACCESS_API = 'bible-api.com public domain KJV text';
const ACCESS_GATEWAY = 'Bible Gateway, King James Version';
const SESSION = '2026-08-23';
const NOTE =
  'KJV wording is verified, but the existing devash question remains open; wording alone does not establish bee honey versus syrup in every context.';
export const HONEY_CLAIMS: ResearchClaim[] = [
  {
    id: 'claim-honey-milk-land',
    subjectId: 'honey',
    text: 'Exodus 3:8 describes the promised land as flowing with milk and honey.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 1B research session ${SESSION}`,
    supports: [
      { sourceId: 'scripture-canon', level: 'direct', qualification: NOTE },
    ],
    uncertaintyNote: NOTE,
    scriptureContext: {
      reference: { book: 'Exodus', chapter: 3, verseStart: 8 },
      mode: 'reference-only',
      ambiguityQuestionId: 'question-honey-devash-translation',
    },
  },
  {
    id: 'claim-honey-manna-wafers',
    subjectId: 'honey',
    text: 'Exodus 16:31 says manna tasted like wafers made with honey.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 1B research session ${SESSION}`,
    supports: [
      { sourceId: 'scripture-canon', level: 'direct', qualification: NOTE },
    ],
    uncertaintyNote: NOTE,
    scriptureContext: {
      reference: { book: 'Exodus', chapter: 16, verseStart: 31 },
      mode: 'reference-only',
      ambiguityQuestionId: 'question-honey-devash-translation',
    },
  },
  {
    id: 'claim-honey-samson-bees',
    subjectId: 'honey',
    text: 'Judges 14:8-9 reports a swarm of bees and honey in the lion carcass, which Samson took and ate and gave to his parents.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 1B research session ${SESSION}`,
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification:
          'Wild/animal-associated narrative; do not generalize to every biblical honey use.',
      },
    ],
    uncertaintyNote:
      'This passage explicitly mentions bees and honey in a narrative setting; it does not resolve the meaning of honey in other passages.',
    scriptureContext: {
      reference: { book: 'Judges', chapter: 14, verseStart: 8, verseEnd: 9 },
      mode: 'reference-only',
      ambiguityQuestionId: 'question-honey-devash-translation',
    },
  },
  {
    id: 'claim-honey-jonathan-comb',
    subjectId: 'honey',
    text: '1 Samuel 14:27 reports Jonathan dipping his rod in an honeycomb and eating from it.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 1B research session ${SESSION}`,
    supports: [
      { sourceId: 'scripture-canon', level: 'direct', qualification: NOTE },
    ],
    uncertaintyNote: NOTE,
    scriptureContext: {
      reference: { book: '1 Samuel', chapter: 14, verseStart: 27 },
      mode: 'reference-only',
      ambiguityQuestionId: 'question-honey-devash-translation',
    },
  },
  {
    id: 'claim-honey-david-provision',
    subjectId: 'honey',
    text: '2 Samuel 17:29 lists honey among provisions brought for David and the people with him to eat.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 1B research session ${SESSION}`,
    supports: [
      { sourceId: 'scripture-canon', level: 'direct', qualification: NOTE },
    ],
    uncertaintyNote: NOTE,
    scriptureContext: {
      reference: { book: '2 Samuel', chapter: 17, verseStart: 29 },
      mode: 'reference-only',
      ambiguityQuestionId: 'question-honey-devash-translation',
    },
  },
  {
    id: 'claim-honey-proverb-good',
    subjectId: 'honey',
    text: 'Proverbs 24:13 calls honey good and pairs it with honeycomb as sweet to the taste.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 1B research session ${SESSION}`,
    supports: [
      { sourceId: 'scripture-canon', level: 'direct', qualification: NOTE },
    ],
    uncertaintyNote: NOTE,
    scriptureContext: {
      reference: { book: 'Proverbs', chapter: 24, verseStart: 13 },
      mode: 'reference-only',
      ambiguityQuestionId: 'question-honey-devash-translation',
    },
  },
  {
    id: 'claim-honey-wild-john',
    subjectId: 'honey',
    text: "Matthew 3:4 says John's meat was locusts and wild honey.",
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 1B research session ${SESSION}`,
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification:
          'Wild honey is a specific phrase and must not generalize to all honey.',
      },
    ],
    uncertaintyNote:
      'The KJV explicitly says wild honey here; the verse does not settle the identification of every biblical honey term.',
    scriptureContext: {
      reference: { book: 'Matthew', chapter: 3, verseStart: 4 },
      mode: 'reference-only',
      ambiguityQuestionId: 'question-honey-devash-translation',
    },
  },
  {
    id: 'claim-honey-luke-fish',
    subjectId: 'honey',
    text: 'Luke 24:42-43 reports that Jesus was given a piece of broiled fish and honeycomb, and ate before them.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 1B research session ${SESSION}`,
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification:
          'Explicit narrative consumption; honeycomb wording does not resolve devash in other passages.',
      },
    ],
    uncertaintyNote: NOTE,
    scriptureContext: {
      reference: { book: 'Luke', chapter: 24, verseStart: 42, verseEnd: 43 },
      mode: 'reference-only',
      ambiguityQuestionId: 'question-honey-devash-translation',
    },
  },
];
export const HONEY_VERIFICATION_RECORDS: ScriptureVerificationRecord[] = [
  {
    id: 'verify-honey-milk-land',
    claimId: 'claim-honey-milk-land',
    referenceText: 'Exodus 3:8',
    translation: 'kjv',
    verifiedWording:
      'And I am come down to deliver them out of the hand of the Egyptians, and to bring them up out of that land unto a good land and a large, unto a land flowing with milk and honey; unto the place of the Canaanites, and the Hittites, and the Amorites, and the Perizzites, and the Hivites, and the Jebusites.',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
  {
    id: 'verify-honey-manna-wafers',
    claimId: 'claim-honey-manna-wafers',
    referenceText: 'Exodus 16:31',
    translation: 'kjv',
    verifiedWording:
      'And the house of Israel called the name thereof Manna: and it was like coriander seed, white; and the taste of it was like wafers made with honey.',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
  {
    id: 'verify-honey-samson-bees',
    claimId: 'claim-honey-samson-bees',
    referenceText: 'Judges 14:8-9',
    translation: 'kjv',
    verifiedWording:
      'And after a time he returned to take her, and he turned aside to see the carcase of the lion: and, behold, there was a swarm of bees and honey in the carcase of the lion. And he took thereof in his hands, and went on eating, and came to his father and mother, and he gave them, and they did eat: but he told not them that he had taken the honey out of the carcase of the lion.',
    accessedAt: SESSION,
    accessPoint: ACCESS_GATEWAY,
  },
  {
    id: 'verify-honey-jonathan-comb',
    claimId: 'claim-honey-jonathan-comb',
    referenceText: '1 Samuel 14:27',
    translation: 'kjv',
    verifiedWording:
      'But Jonathan heard not when his father charged the people with the oath: wherefore he put forth the end of the rod that was in his hand, and dipped it in an honeycomb, and put his hand to his mouth; and his eyes were enlightened.',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
  {
    id: 'verify-honey-david-provision',
    claimId: 'claim-honey-david-provision',
    referenceText: '2 Samuel 17:29',
    translation: 'kjv',
    verifiedWording:
      'And honey, and butter, and sheep, and cheese of kine, for David, and for the people that were with him, to eat: for they said, The people is hungry, and weary, and thirsty, in the wilderness.',
    accessedAt: SESSION,
    accessPoint: ACCESS_GATEWAY,
  },
  {
    id: 'verify-honey-proverb-good',
    claimId: 'claim-honey-proverb-good',
    referenceText: 'Proverbs 24:13',
    translation: 'kjv',
    verifiedWording:
      'My son, eat thou honey, because it is good; and the honeycomb, which is sweet to thy taste:',
    accessedAt: SESSION,
    accessPoint: ACCESS_GATEWAY,
  },
  {
    id: 'verify-honey-wild-john',
    claimId: 'claim-honey-wild-john',
    referenceText: 'Matthew 3:4',
    translation: 'kjv',
    verifiedWording:
      "And the same John had his raiment of camel's hair, and a leathern girdle about his loins; and his meat was locusts and wild honey.",
    accessedAt: SESSION,
    accessPoint: ACCESS_GATEWAY,
  },
  {
    id: 'verify-honey-luke-fish',
    claimId: 'claim-honey-luke-fish',
    referenceText: 'Luke 24:42-43',
    translation: 'kjv',
    verifiedWording:
      'And they gave him a piece of a broiled fish, and of an honeycomb. And he took it, and did eat before them.',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
];
export const HONEY_DOSSIER_NOTES = [
  `Research session ${SESSION}: 8 KJV passages retrieved and wording-recorded via bible-api.com and Bible Gateway.`,
  'Direct wording verifies honey, honeycomb, wild honey, and narrative uses; it does not resolve the existing devash identification question.',
  'The “milk and honey” formula remains a land-description and must not be converted into a precise universal dietary statement.',
  'Wild honey, honeycomb, and the explicit bee narrative remain distinct evidence categories.',
];
