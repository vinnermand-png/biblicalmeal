/**
 * V3C.2 SOURCE REGISTRY
 * =====================
 * Central typed registry. Claims reference sources by id; full citation data
 * lives here exactly once.
 *
 * FABRICATION POLICY (inherited from source-citations.ts): entries are added
 * ONLY when their metadata is already documented in this repository. No URLs,
 * years, authors or works are invented to populate the system. The registry
 * starting small is correct behavior, not a gap.
 */

import type { SourceRecord } from './types';

/**
 * The biblical text itself as the canonical scripture source. The site-wide
 * translation decision was LOCKED in V3C.3: the King James Version (KJV) is
 * the canonical editorial translation. Wording verification can now START
 * against KJV - starting it is real research work and has not happened yet,
 * so derived claims remain unverified.
 */
const SCRIPTURE_CANON: SourceRecord = {
  id: 'scripture-canon',
  title: 'The Bible (canonical text)',
  kind: 'scripture',
  primarySource: true,
  edition: 'King James Version (KJV)',
  reliability: 'canonical-text',
  notes:
    'Translation locked to KJV by project decision (V3C.3, see scripture-policy.ts). Secondary translations only under controlled comparison rules. Wording verification against KJV has not yet been performed for any claim.',
};

/**
 * Scholarly anchor already identified and documented in V3B
 * (seo-master-map.ts research log; source-citations.ts SOURCE_REF_SPECS;
 * v3b-completion-matrix.ts item macdonald-2008). Metadata copied from those
 * records - nothing newly invented.
 */
const MACDONALD_2008: SourceRecord = {
  id: 'macdonald-2008',
  title: 'What Did the Ancient Israelites Eat?: Diet in Biblical Times',
  author: 'Nathan MacDonald',
  kind: 'academic',
  primarySource: false,
  year: 2008,
  publisher: 'Eerdmans',
  reliability: 'scholarly-anchor',
  notes:
    'Daily-life scholarly anchor identified during V3B strategy work. To be consulted during V3C research; no claims cite it yet.',
};

/**
 * First genuinely researched source (V3C.4 Phase 1A, 2026-08-23): a Biblical
 * Archaeology Society Bible History Daily article reporting a joint
 * Weizmann Institute (Kimmel Center) / Israel Antiquities Authority study of
 * Neolithic Galilee legume remains. Metadata below was captured from the
 * retrieved page itself - author, date and URL are real, nothing invented.
 * It is SECONDARY reporting of an excavation-based study; the underlying
 * report has not been consulted, so reliability stays conservative.
 */
const BAS_2015_ANCIENT_BEANS: SourceRecord = {
  id: 'bas-2015-ancient-beans',
  title: 'The Ancient Bean Diet: Fava Beans Favored in Prehistoric Israel',
  author: 'Robin Ngo',
  organization: 'Biblical Archaeology Society',
  kind: 'archaeological',
  primarySource: false,
  year: 2015,
  publisher: 'Biblical Archaeology Society',
  identifier:
    'https://www.biblicalarchaeology.org/daily/news/ancient-beans-prehistoric-israel/',
  reliability: 'unassessed',
  notes:
    'Retrieved 2026-08-23 during V3C.4 Phase 1A lentil research (article body via search retrieval; substantial verbatim content confirmed). Reports Weizmann/IAA findings that legumes including lentils were a substantial part of the Neolithic diet in the Galilee. Secondary coverage - full article review and the underlying IAA/Weizmann report remain outstanding, so dependent claims stay in-review with disclosure.',
};

const NATURE_2022_TEL_TSAF: SourceRecord = {
  id: 'nature-2022-tel-tsaf-fruit-trees',
  title:
    '7000-year-old evidence of fruit tree cultivation in the Jordan Valley, Israel',
  author: 'Dafna Langgut and Yosef Garfinkel',
  kind: 'archaeological',
  primarySource: true,
  year: 2022,
  publisher: 'Scientific Reports',
  identifier: 'https://www.nature.com/articles/s41598-022-10743-6',
  reliability: 'unassessed',
  reviewedAt: '2026-08-23',
  notes:
    'Full open-access article reviewed during V3C.4 Phase 2. Reports anatomical identification of charred olive wood and young common-fig branches at Chalcolithic Tel Tsaf; claims remain in-review pending project-level synthesis.',
};

const SCIENCE_2020_JUDEAN_DATE_PALM: SourceRecord = {
  id: 'science-2020-judean-date-palm',
  title:
    'Origins and insights into the historic Judean date palm based on genetic analysis of germinated ancient seeds and morphometric studies',
  author: 'Sarah Sallon',
  kind: 'archaeological',
  primarySource: true,
  year: 2020,
  publisher: 'Science Advances',
  identifier: 'https://doi.org/10.1126/sciadv.aax0384',
  reliability: 'unassessed',
  reviewedAt: '2026-08-23',
  notes:
    'Full article page and methods/results reviewed during V3C.4 Phase 2. Reports ancient Judean date seeds from archaeological sites, germination, morphometrics, and genetic analysis; interpretation remains conservatively in-review.',
};

const BIBLE_ODYSSEY_BREAD: SourceRecord = {
  id: 'bible-odyssey-bread-ancient-israel',
  title: 'Bread in Ancient Israel',
  author: 'Tim Frank',
  organization: 'Society of Biblical Literature',
  kind: 'academic',
  primarySource: false,
  publisher: 'Bible Odyssey',
  identifier: 'https://www.bibleodyssey.org/articles/bread-in-ancient-israel/',
  reliability: 'unassessed',
  reviewedAt: '2026-08-23',
  notes:
    'Full article reviewed during V3C.4 Phase 2. Academic synthesis connecting archaeological grain processing evidence with bread production; not treated as a primary excavation report.',
};

const BIBLE_ODYSSEY_MILK_HONEY: SourceRecord = {
  id: 'bible-odyssey-milk-honey',
  title: 'Milk and Honey in Ancient Israel',
  author: 'Rebekah Welton',
  organization: 'Society of Biblical Literature',
  kind: 'academic',
  primarySource: false,
  year: 2022,
  publisher: 'Bible Odyssey',
  identifier:
    'https://www.bibleodyssey.org/articles/milk-and-honey-in-ancient-israel/',
  reliability: 'unassessed',
  reviewedAt: '2026-08-23',
  notes:
    'Full article reviewed during V3C.4 Phase 2. Discusses milk, honey, symbolism, and Tel Rehov beekeeping; its discussion does not resolve every devash identification.',
};

export const SOURCE_REGISTRY: SourceRecord[] = [
  SCRIPTURE_CANON,
  MACDONALD_2008,
  BAS_2015_ANCIENT_BEANS,
  NATURE_2022_TEL_TSAF,
  SCIENCE_2020_JUDEAN_DATE_PALM,
  BIBLE_ODYSSEY_BREAD,
  BIBLE_ODYSSEY_MILK_HONEY,
];

export function getSource(id: string): SourceRecord | undefined {
  return SOURCE_REGISTRY.find((s) => s.id === id);
}
