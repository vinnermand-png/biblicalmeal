import type { AuthorityRecord, CitationRecord } from './types';

/** Reuses only canonical source metadata already present in the research registry. */
export const AUTHORITY_RECORDS: readonly AuthorityRecord[] = [
  {
    id: 'authority-scripture-canon',
    sourceId: 'scripture-canon',
    classification: 'primary-scripture',
    notes:
      'Canonical KJV scripture source already defined by research. Wording verification remains separate from source identity.',
  },
  {
    id: 'authority-nature-2022-tel-tsaf',
    sourceId: 'nature-2022-tel-tsaf-fruit-trees',
    classification: 'archaeological-or-material-evidence',
    notes:
      'Existing reviewed archaeological source; classification does not upgrade claim verification.',
  },
  {
    id: 'authority-science-2020-judean-date-palm',
    sourceId: 'science-2020-judean-date-palm',
    classification: 'archaeological-or-material-evidence',
    notes:
      'Existing primary archaeological/genetic source; use remains bounded to its recorded evidence and project review state.',
  },
  {
    id: 'authority-bible-odyssey-bread',
    sourceId: 'bible-odyssey-bread-ancient-israel',
    classification: 'academic-source',
    notes:
      'Existing scholarly synthesis; useful for contextual traceability without replacing recipe-specific evidence gates.',
  },
  {
    id: 'authority-bible-odyssey-milk-honey',
    sourceId: 'bible-odyssey-milk-honey',
    classification: 'academic-source',
    notes:
      'Existing scholarly synthesis; does not resolve every devash identification and must retain that boundary.',
  },
];

/**
 * Traceability links only. No citation record creates research completion,
 * editorial approval, a route, or public publication eligibility.
 */
export const CITATION_RECORDS: readonly CitationRecord[] = [
  {
    id: 'citation-figs-tel-tsaf-context',
    authorityId: 'authority-nature-2022-tel-tsaf',
    targetKind: 'research-dossier',
    targetId: 'dossier-figs',
    relationship: 'contextually-supports',
    evidenceState: 'contextual',
    verificationState: 'partially-verified',
    claimStrength: 'contextual',
    uncertaintyDisclosure:
      'The source is site- and period-specific and does not establish universal dietary practice.',
  },
  {
    id: 'citation-figs-article-tel-tsaf-context',
    authorityId: 'authority-nature-2022-tel-tsaf',
    targetKind: 'article-content',
    targetId: 'article-figs-research-context',
    relationship: 'contextually-supports',
    evidenceState: 'contextual',
    verificationState: 'partially-verified',
    claimStrength: 'contextual',
    uncertaintyDisclosure:
      'This trace supports the linked archaeological context only; the article remains a non-public draft and must preserve its common-fig and sycomore boundaries.',
  },
  {
    id: 'citation-dates-judean-palm-context',
    authorityId: 'authority-science-2020-judean-date-palm',
    targetKind: 'research-dossier',
    targetId: 'dossier-dates',
    relationship: 'contextually-supports',
    evidenceState: 'contextual',
    verificationState: 'partially-verified',
    claimStrength: 'contextual',
    uncertaintyDisclosure:
      'Historic Judean date-palm evidence does not resolve every biblical palm reference as an edible-date reference.',
  },
  {
    id: 'citation-dates-article-judean-palm-context',
    authorityId: 'authority-science-2020-judean-date-palm',
    targetKind: 'article-content',
    targetId: 'article-dates-palm-evidence-boundaries',
    relationship: 'contextually-supports',
    evidenceState: 'contextual',
    verificationState: 'partially-verified',
    claimStrength: 'contextual',
    uncertaintyDisclosure:
      'The citation traces historic date-palm context only and must not collapse palm-tree or palm-branch wording into automatic food identification.',
  },
  {
    id: 'citation-honey-bible-odyssey-context',
    authorityId: 'authority-bible-odyssey-milk-honey',
    targetKind: 'research-dossier',
    targetId: 'dossier-honey',
    relationship: 'contextually-supports',
    evidenceState: 'contextual',
    verificationState: 'partially-verified',
    claimStrength: 'contextual',
    uncertaintyDisclosure:
      'The source discusses milk and honey in ancient Israel but does not resolve every devash identification as bee honey.',
  },
  {
    id: 'citation-honey-article-bible-odyssey-context',
    authorityId: 'authority-bible-odyssey-milk-honey',
    targetKind: 'article-content',
    targetId: 'article-honey-evidence-boundaries',
    relationship: 'contextually-supports',
    evidenceState: 'contextual',
    verificationState: 'partially-verified',
    claimStrength: 'contextual',
    uncertaintyDisclosure:
      'This contextual trace does not authorize a universal bee-honey identification; the article remains non-public and evidence-bound.',
  },
  {
    id: 'citation-unleavened-bread-research-context',
    authorityId: 'authority-bible-odyssey-bread',
    targetKind: 'recipe-research',
    targetId: 'recipe-unleavened-bread',
    relationship: 'contextually-supports',
    evidenceState: 'contextual',
    verificationState: 'partially-verified',
    claimStrength: 'contextual',
    uncertaintyDisclosure:
      'The source provides contextual bread-production synthesis and does not establish one exact biblical formula, proportion, vessel, or cooking method.',
  },
  {
    id: 'citation-unleavened-bread-content-context',
    authorityId: 'authority-bible-odyssey-bread',
    targetKind: 'recipe-content',
    targetId: 'recipe-content-unleavened-bread',
    relationship: 'contextually-supports',
    evidenceState: 'contextual',
    verificationState: 'partially-verified',
    claimStrength: 'contextual',
    uncertaintyDisclosure:
      'The recipe remains an internal modern reconstruction draft; contextual bread evidence does not verify its flour choice, quantities, skillet, or timing.',
  },
  {
    id: 'citation-seven-foods-unresolved',
    authorityId: 'authority-scripture-canon',
    targetKind: 'article-content',
    targetId: 'question-seven-foods-promised-land',
    relationship: 'unresolved',
    evidenceState: 'unresolved',
    verificationState: 'unresolved',
    claimStrength: 'background',
    uncertaintyDisclosure:
      'This relationship records canonical context only; the underlying answer remains unresolved and is not verified by this citation record.',
  },
];
