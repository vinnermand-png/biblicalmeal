/**
 * V3C.4 PHASE 1A PILOT RESEARCH - FIGS
 * ====================================
 * First genuinely researched subject. Every claim below stays inside what the
 * retrieved KJV text itself states; every verified claim carries a recorded
 * KJV wording check (ScriptureVerificationRecord) from the 2026-08-23 session.
 *
 * Boundaries recorded in the dossier notes: Hezekiah's fig poultice is a
 * narrative report (never medicinal advice); Amos's sycomore is tracked as an
 * open identification question; Mark 11:13 carries a registered translation
 * comparison.
 */

import type { ResearchClaim, ScriptureVerificationRecord } from '../types';

const ACCESS_GATEWAY =
  'Bible Gateway, King James Version (multi-passage retrieval)';
const ACCESS_API = 'bible-api.com public domain KJV text';
const SESSION = '2026-08-23';

export const FIGS_CLAIMS: ResearchClaim[] = [
  {
    id: 'claim-figs-deut-signature-list',
    subjectId: 'figs',
    text: 'Deuteronomy 8:8 names fig trees among the signature agricultural products of the land (the traditional "seven species" list).',
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
      reference: { book: 'Deuteronomy', chapter: 8, verseStart: 8 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-figs-genesis-first-garments',
    subjectId: 'figs',
    text: 'Genesis 3:7 reports the first human garments were sewn from fig leaves.',
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
      reference: { book: 'Genesis', chapter: 3, verseStart: 6, verseEnd: 7 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-figs-scouts-produce',
    subjectId: 'figs',
    text: 'Numbers 13:23 records the scouts bringing figs back among samples of the land\u2019s produce.',
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
      reference: { book: 'Numbers', chapter: 13, verseStart: 23, verseEnd: 24 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-figs-abigail-provision',
    subjectId: 'figs',
    text: '1 Samuel 25:18 lists two hundred cakes of figs in Abigail\u2019s provision to David.',
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
      reference: { book: '1 Samuel', chapter: 25, verseStart: 18 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-figs-reviving-cake',
    subjectId: 'figs',
    text: '1 Samuel 30:12 reports a starving man revived after being given a piece of fig cake and raisin clusters ("his spirit came again to him").',
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
          'Narrative report only - never presentable as medical guidance.',
      },
    ],
    scriptureContext: {
      reference: { book: '1 Samuel', chapter: 30, verseStart: 12 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-figs-hezekiah-poultice',
    subjectId: 'figs',
    text: '2 Kings 20:7 reports Isaiah ordering a lump of figs laid on Hezekiah\u2019s boil, after which he recovered.',
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
          'Narrative report of an ancient remedy - never presentable as medical advice.',
      },
    ],
    scriptureContext: {
      reference: { book: '2 Kings', chapter: 20, verseStart: 7 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-figs-tending-proverb',
    subjectId: 'figs',
    text: 'Proverbs 27:18 draws its analogy from fig cultivation: whoever keeps the fig tree eats its fruit.',
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
      reference: { book: 'Proverbs', chapter: 27, verseStart: 18 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-figs-habakkuk-failure-imagery',
    subjectId: 'figs',
    text: 'Habakkuk 3:17 uses a blossoming-less fig tree (alongside failed vines, fields, flocks and herds) as total crop-failure imagery.',
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
      reference: { book: 'Habakkuk', chapter: 3, verseStart: 17 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-figs-amos-sycomore',
    subjectId: 'figs',
    text: 'Amos 7:14 has Amos describing himself as a herdsman and a gatherer of sycomore fruit.',
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
          'Verse fact verified; sycomore identification (vs common fig) is open question question-figs-sycomore-identification.',
      },
    ],
    uncertaintyNote:
      'The sycomore of Amos 7:14 is traditionally identified as Ficus sycomorus, a distinct species from the common fig; identification confirmation is pending before this verse supports any page statement about figs proper.',
    scriptureContext: {
      reference: { book: 'Amos', chapter: 7, verseStart: 14 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-figs-luke-vineyard-parable',
    subjectId: 'figs',
    text: 'Luke 13:6-7 tells of a fig tree planted in a vineyard that bore no fruit for three years.',
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
    scriptureContext: {
      reference: { book: 'Luke', chapter: 13, verseStart: 6, verseEnd: 7 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-figs-matthew-withered-tree',
    subjectId: 'figs',
    text: 'Matthew 21:19-20 reports the leafy but fruitless fig tree withering at Jesus\u2019 word.',
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
      reference: { book: 'Matthew', chapter: 21, verseStart: 18, verseEnd: 20 },
      mode: 'reference-only',
    },
  },
  {
    id: 'claim-figs-mark-season-note',
    subjectId: 'figs',
    text: 'Mark 11:13 reports the leafy fig tree had nothing but leaves "for the time of figs was not yet" (KJV rendering).',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance:
      'V3C.4 Phase 1A pilot research session 2026-08-23 (KJV and WEB wording retrieved and recorded)',
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification:
          'KJV wording verified 2026-08-23; rendering difference vs WEB documented in comparison-mark-11-13-fig-season.',
      },
    ],
    scriptureContext: {
      reference: { book: 'Mark', chapter: 11, verseStart: 12, verseEnd: 13 },
      mode: 'reference-only',
      comparisonRequired: true,
    },
  },
];

export const FIGS_VERIFICATION_RECORDS: ScriptureVerificationRecord[] = [
  {
    id: 'verify-figs-deut-signature-list',
    claimId: 'claim-figs-deut-signature-list',
    referenceText: 'Deuteronomy 8:8',
    translation: 'kjv',
    verifiedWording:
      'A land of wheat, and barley, and vines, and fig trees, and pomegranates; a land of oil olive, and honey;',
    accessedAt: SESSION,
    accessPoint: ACCESS_GATEWAY,
  },
  {
    id: 'verify-figs-genesis-first-garments',
    claimId: 'claim-figs-genesis-first-garments',
    referenceText: 'Genesis 3:7',
    translation: 'kjv',
    verifiedWording:
      'and they sewed fig leaves together, and made themselves aprons.',
    accessedAt: SESSION,
    accessPoint: ACCESS_GATEWAY,
  },
  {
    id: 'verify-figs-scouts-produce',
    claimId: 'claim-figs-scouts-produce',
    referenceText: 'Numbers 13:23',
    translation: 'kjv',
    verifiedWording:
      'And they came unto the brook of Eshcol, and cut down from thence a branch with one cluster of grapes, and they bare it between two upon a staff; and they brought of the pomegranates, and of the figs.',
    accessedAt: SESSION,
    accessPoint: ACCESS_GATEWAY,
  },
  {
    id: 'verify-figs-abigail-provision',
    claimId: 'claim-figs-abigail-provision',
    referenceText: '1 Samuel 25:18',
    translation: 'kjv',
    verifiedWording:
      'Then Abigail made haste, and took two hundred loaves, and two bottles of wine, and five sheep ready dressed, and five measures of parched corn, and an hundred clusters of raisins, and two hundred cakes of figs, and laid them on asses.',
    accessedAt: SESSION,
    accessPoint: ACCESS_GATEWAY,
  },
  {
    id: 'verify-figs-reviving-cake',
    claimId: 'claim-figs-reviving-cake',
    referenceText: '1 Samuel 30:12',
    translation: 'kjv',
    verifiedWording:
      'And they gave him a piece of a cake of figs, and two clusters of raisins: and when he had eaten, his spirit came again to him: for he had eaten no bread, nor drunk any water, three days and three nights.',
    accessedAt: SESSION,
    accessPoint: ACCESS_GATEWAY,
  },
  {
    id: 'verify-figs-hezekiah-poultice',
    claimId: 'claim-figs-hezekiah-poultice',
    referenceText: '2 Kings 20:7',
    translation: 'kjv',
    verifiedWording:
      'And Isaiah said, Take a lump of figs. And they took and laid it on the boil, and he recovered.',
    accessedAt: SESSION,
    accessPoint: ACCESS_GATEWAY,
  },
  {
    id: 'verify-figs-tending-proverb',
    claimId: 'claim-figs-tending-proverb',
    referenceText: 'Proverbs 27:18',
    translation: 'kjv',
    verifiedWording:
      'Whoso keepeth the fig tree shall eat the fruit thereof: so he that waiteth on his master shall be honoured.',
    accessedAt: SESSION,
    accessPoint: ACCESS_GATEWAY,
  },
  {
    id: 'verify-figs-habakkuk-failure-imagery',
    claimId: 'claim-figs-habakkuk-failure-imagery',
    referenceText: 'Habakkuk 3:17',
    translation: 'kjv',
    verifiedWording:
      'Although the fig tree shall not blossom, neither shall fruit be in the vines; the labour of the olive shall fail, and the fields shall yield no meat; the flock shall be cut off from the fold, and there shall be no herd in the stalls:',
    accessedAt: SESSION,
    accessPoint: ACCESS_GATEWAY,
  },
  {
    id: 'verify-figs-amos-sycomore',
    claimId: 'claim-figs-amos-sycomore',
    referenceText: 'Amos 7:14',
    translation: 'kjv',
    verifiedWording:
      'Then answered Amos, and said to Amaziah, I was no prophet, neither was I a prophet\u2019s son; but I was an herdman, and a gatherer of sycomore fruit:',
    accessedAt: SESSION,
    accessPoint: ACCESS_GATEWAY,
  },
  {
    id: 'verify-figs-luke-vineyard-parable',
    claimId: 'claim-figs-luke-vineyard-parable',
    referenceText: 'Luke 13:6-7',
    translation: 'kjv',
    verifiedWording:
      'He spake also this parable; A certain man had a fig tree planted in his vineyard; and he came and sought fruit thereon, and found none. Then said he unto the dresser of his vineyard, Behold, these three years I come seeking fruit on this fig tree, and find none: cut it down; why cumbereth it the ground?',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
  {
    id: 'verify-figs-matthew-withered-tree',
    claimId: 'claim-figs-matthew-withered-tree',
    referenceText: 'Matthew 21:19-20',
    translation: 'kjv',
    verifiedWording:
      'And when he saw a fig tree in the way, he came to it, and found nothing thereon, but leaves only, and said unto it, Let no fruit grow on thee henceforward for ever. And presently the fig tree withered away. And when the disciples saw it, they marvelled, saying, How soon is the fig tree withered away!',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
  {
    id: 'verify-figs-mark-season-note',
    claimId: 'claim-figs-mark-season-note',
    referenceText: 'Mark 11:13',
    translation: 'kjv',
    verifiedWording:
      'And seeing a fig tree afar off having leaves, he came, if haply he might find any thing thereon: and when he came to it, he found nothing but leaves; for the time of figs was not yet.',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
];

export const FIGS_DOSSIER_NOTES: string[] = [
  `Research session ${SESSION}: 12 KJV passages retrieved and wording-recorded (Bible Gateway multi-passage retrieval + bible-api.com public domain KJV text).`,
  'Framing guardrail: 2 Kings 20:7 and 1 Samuel 30:12 are narrative reports of ancient practice - never medicinal advice on any page.',
  'Open item: sycomore identification in Amos 7:14 (question-figs-sycomore-identification) must resolve before the verse supports fig-specific statements.',
  'Translation work: Mark 11:13 KJV-vs-WEB difference registered as comparison-mark-11-13-fig-season; page content quotes KJV exactly and explains the season plainly.',
];
