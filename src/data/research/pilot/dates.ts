/** V3C.4 PHASE 1B RESEARCH - DATES: palm references are not date-fruit proof. */
import type { ResearchClaim, ScriptureVerificationRecord } from '../types';
const ACCESS_API = 'bible-api.com public domain KJV text';
const SESSION = '2026-08-23';
export const DATES_CLAIMS: ResearchClaim[] = [
  {
    id: 'claim-dates-elim-palms',
    subjectId: 'dates',
    text: 'Exodus 15:27 reports that Elim had seventy palm trees.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 1B research session ${SESSION}`,
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification: 'Palm trees are named; edible dates are not named.',
      },
    ],
    uncertaintyNote:
      'This palm reference does not by itself identify edible dates or prove date consumption.',
    scriptureContext: {
      reference: { book: 'Exodus', chapter: 15, verseStart: 27 },
      mode: 'reference-only',
      ambiguityQuestionId: 'question-dates-palm-fruit-identification',
    },
  },
  {
    id: 'claim-dates-palm-branches',
    subjectId: 'dates',
    text: 'Leviticus 23:40 commands branches of palm trees for the feast.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 1B research session ${SESSION}`,
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification:
          'The wording concerns branches and ritual rejoicing, not edible fruit.',
      },
    ],
    uncertaintyNote: 'Palm branches must not be relabeled as dates.',
    scriptureContext: {
      reference: { book: 'Leviticus', chapter: 23, verseStart: 40 },
      mode: 'reference-only',
      ambiguityQuestionId: 'question-dates-palm-fruit-identification',
    },
  },
  {
    id: 'claim-dates-deborah-palm',
    subjectId: 'dates',
    text: 'Judges 4:5 places Deborah under a palm tree where Israelites came to her for judgment.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 1B research session ${SESSION}`,
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification: 'Narrative location; no fruit or food use is stated.',
      },
    ],
    uncertaintyNote:
      'The passage identifies a palm tree as a location, not dates as food.',
    scriptureContext: {
      reference: { book: 'Judges', chapter: 4, verseStart: 5 },
      mode: 'reference-only',
      ambiguityQuestionId: 'question-dates-palm-fruit-identification',
    },
  },
  {
    id: 'claim-dates-joel-palm',
    subjectId: 'dates',
    text: 'Joel 1:12 includes the palm tree among trees described as withered in a crop-failure image.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 1B research session ${SESSION}`,
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification:
          'Agricultural imagery; the verse does not identify edible dates.',
      },
    ],
    uncertaintyNote:
      'The palm-tree wording does not establish date fruit identification.',
    scriptureContext: {
      reference: { book: 'Joel', chapter: 1, verseStart: 12 },
      mode: 'reference-only',
      ambiguityQuestionId: 'question-dates-palm-fruit-identification',
    },
  },
  {
    id: 'claim-dates-john-palm-branches',
    subjectId: 'dates',
    text: 'John 12:13 reports people taking branches of palm trees when they went to meet Jesus.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 1B research session ${SESSION}`,
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification:
          'Branches in a narrative procession; no fruit consumption is stated.',
      },
    ],
    uncertaintyNote: 'Palm branches are not edible dates.',
    scriptureContext: {
      reference: { book: 'John', chapter: 12, verseStart: 13 },
      mode: 'reference-only',
      ambiguityQuestionId: 'question-dates-palm-fruit-identification',
    },
  },
  {
    id: 'claim-dates-palm-proverb',
    subjectId: 'dates',
    text: 'Psalm 92:12 compares the flourishing of the righteous to a palm tree.',
    category: 'scripture',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 1B research session ${SESSION}`,
    supports: [
      {
        sourceId: 'scripture-canon',
        level: 'direct',
        qualification: 'Poetic comparison, not a food reference.',
      },
    ],
    uncertaintyNote:
      'A poetic palm comparison does not establish dates as food.',
    scriptureContext: {
      reference: { book: 'Psalms', chapter: 92, verseStart: 12 },
      mode: 'reference-only',
      ambiguityQuestionId: 'question-dates-palm-fruit-identification',
    },
  },
];
export const DATES_VERIFICATION_RECORDS: ScriptureVerificationRecord[] = [
  {
    id: 'verify-dates-elim-palms',
    claimId: 'claim-dates-elim-palms',
    referenceText: 'Exodus 15:27',
    translation: 'kjv',
    verifiedWording:
      'And they came to Elim, where were twelve wells of water, and threescore and ten palm trees: and they encamped there by the waters.',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
  {
    id: 'verify-dates-palm-branches',
    claimId: 'claim-dates-palm-branches',
    referenceText: 'Leviticus 23:40',
    translation: 'kjv',
    verifiedWording:
      'And ye shall take you on the first day the boughs of goodly trees, branches of palm trees, and the boughs of thick trees, and willows of the brook; and ye shall rejoice before the LORD your God seven days.',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
  {
    id: 'verify-dates-deborah-palm',
    claimId: 'claim-dates-deborah-palm',
    referenceText: 'Judges 4:5',
    translation: 'kjv',
    verifiedWording:
      'And she dwelt under the palm tree of Deborah between Ramah and Bethel in mount Ephraim: and the children of Israel came up to her for judgment.',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
  {
    id: 'verify-dates-joel-palm',
    claimId: 'claim-dates-joel-palm',
    referenceText: 'Joel 1:12',
    translation: 'kjv',
    verifiedWording:
      'The vine is dried up, and the fig tree languisheth; the pomegranate tree, the palm tree also, and the apple tree, even all the trees of the field, are withered: because joy is withered away from the sons of men.',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
  {
    id: 'verify-dates-john-palm-branches',
    claimId: 'claim-dates-john-palm-branches',
    referenceText: 'John 12:13',
    translation: 'kjv',
    verifiedWording:
      'Took branches of palm trees, and went forth to meet him, and cried, Hosanna: Blessed is the King of Israel that cometh in the name of the Lord.',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
  {
    id: 'verify-dates-palm-proverb',
    claimId: 'claim-dates-palm-proverb',
    referenceText: 'Psalms 92:12',
    translation: 'kjv',
    verifiedWording:
      'The righteous shall flourish like the palm tree: he shall grow like a cedar in Lebanon.',
    accessedAt: SESSION,
    accessPoint: ACCESS_API,
  },
];
export const DATES_DOSSIER_NOTES = [
  `Research session ${SESSION}: 6 KJV palm references retrieved and wording-recorded via bible-api.com.`,
  'The retrieved KJV passages directly verify palm trees or palm branches, not edible dates as a consumed fruit.',
  'Editorial disclosure requirement: never convert palm tree, palm branch, or palm imagery into a date-fruit claim without independent identification evidence.',
];
