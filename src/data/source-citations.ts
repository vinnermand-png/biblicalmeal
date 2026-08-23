/**
 * SOURCE & CITATION ARCHITECTURE (V3B expansion)
 * ==============================================
 * Future-facing system for documenting sources on major pages.
 * The architecture exists now; entries are added ONLY as real research
 * happens. No source is ever invented to populate the system.
 */

export type SourceKind =
  | 'scripture'
  | 'historical-primary'
  | 'academic'
  | 'archaeological'
  | 'translation-note';

export interface SourceRefSpec {
  kind: SourceKind;
  /** What a reference of this kind must record. */
  requiredFields: string[];
  exampleUsage: string;
}

export const SOURCE_REF_SPECS: SourceRefSpec[] = [
  {
    kind: 'scripture',
    requiredFields: ['book', 'chapter', 'verse', 'translation'],
    exampleUsage: 'Deuteronomy 8:8 (NIV) - quoted verbatim after verification.',
  },
  {
    kind: 'historical-primary',
    requiredFields: ['author', 'work', 'book/passage', 'edition used'],
    exampleUsage:
      'Josephus, Antiquities - cited only where directly relevant and checked in an edition.',
  },
  {
    kind: 'academic',
    requiredFields: ['author', 'title', 'year', 'page/section where practical'],
    exampleUsage:
      'MacDonald (2008), What Did the Ancient Israelites Eat? - already identified as daily-life anchor.',
  },
  {
    kind: 'archaeological',
    requiredFields: [
      'site/find',
      'excavation or museum report',
      'date of report',
    ],
    exampleUsage:
      'Archaeobotanical finds for Galilee diet claims - cite the excavation/museum report, never a blog paraphrase.',
  },
  {
    kind: 'translation-note',
    requiredFields: [
      'term at issue',
      'renderings compared',
      'decision + reason',
    ],
    exampleUsage:
      '"Honey" (devash): bee honey vs date-syrup question documented on the honey profile.',
  },
];

/** Which source kinds each content type must be able to carry. */
export const CITATION_REQUIREMENTS: Record<
  string,
  { mandatory: SourceKind[]; conditional: SourceKind[] }
> = {
  pillar: {
    mandatory: ['scripture', 'academic'],
    conditional: ['historical-primary', 'archaeological', 'translation-note'],
  },
  ingredient: {
    mandatory: ['scripture'],
    conditional: ['academic', 'archaeological', 'translation-note'],
  },
  recipe: {
    mandatory: [],
    conditional: ['scripture', 'academic', 'historical-primary'],
  },
  article: {
    mandatory: ['scripture'],
    conditional: ['academic', 'archaeological', 'translation-note'],
  },
};

export const CITATION_RULES: string[] = [
  'Every quotation carries its exact reference and translation.',
  'The site-wide translation choice is finalized BEFORE first publication and documented once.',
  'A page may not publish with unverified scripture anchors in its brief.',
  'Sources are listed because they were consulted - the /sources/ register never pads.',
  'When scholarship disagrees, the disagreement is reported with both positions attributed.',
];
