/** V3C.4 PHASE 2 historical, archaeological, and contextual research. */
import type { ResearchClaim } from './types';

const SESSION = '2026-08-23';

export const PHASE2_CLAIMS: ResearchClaim[] = [
  {
    id: 'claim-figs-tel-tsaf-horticulture',
    subjectId: 'figs-entity',
    text: 'The Tel Tsaf study reports charred young common-fig branches and says the evidence may indicate common-fig cultivation at the Chalcolithic site.',
    category: 'archaeological',
    evidence: 'plausible',
    verification: 'verified',
    provenance: `V3C.4 Phase 2 research session ${SESSION}: full Scientific Reports article reviewed`,
    supports: [
      {
        sourceId: 'nature-2022-tel-tsaf-fruit-trees',
        level: 'direct',
        qualification:
          'The article reports the find and explicitly qualifies the cultivation interpretation as possible; no claim is made about all ancient figs.',
      },
    ],
    uncertaintyNote:
      'The article distinguishes charred wood evidence from traded seeds and qualifies the fig-cultivation interpretation; this remains in-review.',
  },
  {
    id: 'claim-olives-tel-tsaf-orchards',
    subjectId: 'olives-entity',
    text: 'The Tel Tsaf study interprets substantial charred olive wood, at a site outside wild-olive distribution, as strong evidence for nearby olive orchards.',
    category: 'archaeological',
    evidence: 'plausible',
    verification: 'verified',
    provenance: `V3C.4 Phase 2 research session ${SESSION}: full Scientific Reports article reviewed`,
    supports: [
      {
        sourceId: 'nature-2022-tel-tsaf-fruit-trees',
        level: 'direct',
        qualification:
          'Site-specific archaeological interpretation; it does not establish olive use in every period or community.',
      },
    ],
    uncertaintyNote:
      'This is evidence for horticulture near one Chalcolithic site, not a universal claim about olive cultivation or consumption.',
  },
  {
    id: 'claim-barley-bread-processing',
    subjectId: 'barley',
    text: 'Bible Odyssey reports that barley, alongside wheat and emmer, was used in ancient Israel bread production and describes archaeological evidence for grain storage, grinding, and ovens.',
    category: 'historical',
    evidence: 'plausible',
    verification: 'in-review',
    provenance: `V3C.4 Phase 2 research session ${SESSION}: full Bible Odyssey article reviewed`,
    supports: [
      {
        sourceId: 'bible-odyssey-bread-ancient-israel',
        level: 'direct',
        qualification:
          'Secondary academic synthesis; not a recipe and not evidence that every household ate barley bread.',
      },
    ],
    uncertaintyNote:
      'The source describes broad ancient-Israel evidence and does not establish one standardized barley bread formula.',
  },
  {
    id: 'claim-dates-judean-archaeological-seeds',
    subjectId: 'dates-entity',
    text: 'The Science Advances study analyzes ancient Phoenix dactylifera seeds recovered from Judean Desert archaeological sites and reports evidence consistent with a historic Judean date-palm culture.',
    category: 'archaeological',
    evidence: 'attested',
    verification: 'verified',
    provenance: `V3C.4 Phase 2 research session ${SESSION}: full Science Advances article reviewed`,
    supports: [
      {
        sourceId: 'science-2020-judean-date-palm',
        level: 'direct',
        qualification:
          'The study directly analyzes archaeological date seeds; it does not make every KJV palm reference a date-food reference.',
      },
    ],
    uncertaintyNote:
      'The archaeological evidence supports ancient date palms and a Judean date culture, while the relationship to individual biblical palm references remains unresolved.',
  },
  {
    id: 'claim-honey-tel-rehov-beekeeping',
    subjectId: 'honey-entity',
    text: 'Bible Odyssey reports that beekeeping was practiced at Iron Age Tel Rehov and that biblical texts describe honey in wild and symbolic contexts.',
    category: 'archaeological',
    evidence: 'plausible',
    verification: 'in-review',
    provenance: `V3C.4 Phase 2 research session ${SESSION}: full Bible Odyssey article reviewed`,
    supports: [
      {
        sourceId: 'bible-odyssey-milk-honey',
        level: 'direct',
        qualification:
          'Institutional academic synthesis; Tel Rehov evidence does not resolve the meaning of devash in every passage.',
      },
    ],
    uncertaintyNote:
      'The source supports ancient beekeeping evidence and preserves the distinction between archaeology, biblical wording, and interpretation.',
  },
  {
    id: 'claim-foods-bible-methodology-evidence',
    subjectId: 'foods-of-the-bible',
    text: 'A responsible biblical-food catalog must combine textual evidence with archaeological and historical evidence rather than treat every named substance as an ordinary food.',
    category: 'historical',
    evidence: 'plausible',
    verification: 'in-review',
    provenance: `V3C.4 Phase 2 research session ${SESSION}: methodological synthesis of reviewed academic sources`,
    supports: [
      {
        sourceId: 'bible-odyssey-bread-ancient-israel',
        level: 'contextual',
        qualification:
          'Methodological synthesis only; categories remain governed by the existing food-universe classification.',
      },
      {
        sourceId: 'bible-odyssey-milk-honey',
        level: 'contextual',
        qualification:
          'Shows how food, symbolism, and archaeological context must be distinguished.',
      },
    ],
    uncertaintyNote:
      'The inventory is not promoted to a definitive complete count of biblical foods.',
  },
  {
    id: 'claim-biblical-times-regional-context',
    subjectId: 'food-in-biblical-times',
    text: 'The reviewed sources support describing ancient foodways through specific sites, periods, and evidence types rather than one undifferentiated biblical diet.',
    category: 'historical',
    evidence: 'plausible',
    verification: 'in-review',
    provenance: `V3C.4 Phase 2 research session ${SESSION}: cross-source contextual synthesis`,
    supports: [
      {
        sourceId: 'nature-2022-tel-tsaf-fruit-trees',
        level: 'contextual',
        qualification:
          'Tel Tsaf is a specific Chalcolithic Jordan Valley context.',
      },
      {
        sourceId: 'bible-odyssey-milk-honey',
        level: 'contextual',
        qualification:
          'Ancient Israel context and Iron Age Tel Rehov evidence are not generalized to every period.',
      },
    ],
    uncertaintyNote:
      'Further period-specific and regional source review remains necessary before detailed daily-diet claims.',
  },
];
