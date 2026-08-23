import type { AuthorityRecord, CitationRecord } from './types';

/** Reuses existing canonical source metadata; creates no new sources. */
export const AUTHORITY_RECORDS: readonly AuthorityRecord[] = [
  { id: 'authority-scripture-canon', sourceId: 'scripture-canon', classification: 'primary-scripture', notes: 'Canonical KJV scripture source already defined by research.' },
  { id: 'authority-nature-2022-tel-tsaf', sourceId: 'nature-2022-tel-tsaf-fruit-trees', classification: 'archaeological-or-material-evidence', notes: 'Existing reviewed archaeological source; classification does not upgrade claim verification.' },
];

/** Minimal structural seeds; no citation creates completion, approval, routes, or public release. */
export const CITATION_RECORDS: readonly CitationRecord[] = [
  {
    id: 'citation-figs-tel-tsaf-context', authorityId: 'authority-nature-2022-tel-tsaf', targetKind: 'research-dossier', targetId: 'dossier-figs',
    relationship: 'contextually-supports', evidenceState: 'contextual', verificationState: 'partially-verified', claimStrength: 'contextual',
    uncertaintyDisclosure: 'The source is site- and period-specific and does not establish universal dietary practice.',
  },
  {
    id: 'citation-seven-foods-unresolved', authorityId: 'authority-scripture-canon', targetKind: 'article-content', targetId: 'question-seven-foods-promised-land',
    relationship: 'unresolved', evidenceState: 'unresolved', verificationState: 'unresolved', claimStrength: 'background',
    uncertaintyDisclosure: 'This relationship records canonical context only; the underlying answer remains unresolved and is not verified by this citation record.',
  },
];
