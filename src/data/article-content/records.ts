import { RESEARCH_DOSSIERS } from '../research/dossiers';
import { SEO_TARGETS } from '../seo-master-map';
import type { ArticleContentRecord } from './types';

const dossierIds = new Set(RESEARCH_DOSSIERS.map((dossier) => dossier.id));
const targetIds = new Set(SEO_TARGETS.map((target) => target.id));

if (!dossierIds.has('dossier-figs') || !targetIds.has('figs')) {
  throw new Error('V3C.19 seeds require canonical research and SEO records.');
}

/**
 * Minimal non-public seed set. These records prove the V3C.19 architecture;
 * they do not create routes, citations, verification, or public release.
 */
export const ARTICLE_CONTENT_RECORDS: readonly ArticleContentRecord[] = [
  {
    id: 'article-figs-research-context',
    title: 'Figs in the Bible: Research Context',
    contentType: 'historical-context',
    purpose:
      'Provide an evidence-aware editorial shell around the existing figs research record.',
    seoTargetId: 'figs',
    researchDossierIds: ['dossier-figs'],
    foodIds: ['figs-entity'],
    scriptureContext: [],
    summary:
      'This draft connects existing canonical figs research to a future explanatory article without adding new historical claims.',
    uncertaintyDisclosure:
      'Only claims supported by the linked research dossier may be promoted in later editorial production; unrecorded details remain outside this seed.',
    keyPoints: [
      'Reuse the existing research dossier instead of creating a second evidence record.',
      'Keep future historical context within the evidence boundaries recorded by canonical research.',
    ],
    evidenceState: 'supported',
    claimStrength: 'supported',
    editorialNotes: [
      'No scripture quotation or new citation is created by this content seed.',
    ],
    productionStatus: 'draft',
    editorialReviewStatus: 'not-started',
    publicationStatus: 'not-eligible',
    publicationEligible: false,
  },
  {
    id: 'question-seven-foods-promised-land',
    title: 'What Are the Seven Foods of the Promised Land?',
    contentType: 'question',
    purpose:
      'Preserve a candidate Bible-food question without treating an unresolved verification task as an answered fact.',
    seoTargetId: 'seven-foods-deuteronomy-8',
    researchDossierIds: [],
    foodIds: [],
    scriptureContext: ['Deuteronomy 8:8'],
    summary:
      'This is a controlled question seed whose final answer remains unresolved until the canonical research and scripture-verification process supports publication.',
    uncertaintyDisclosure:
      'The question is intentionally unresolved here. This record does not verify the passage wording, enumerate the foods, or create a publication-ready answer.',
    keyPoints: [
      'Keep the verification gap visible.',
      'Do not convert an SEO question candidate into a completed historical answer by editorial production alone.',
    ],
    evidenceState: 'unresolved',
    claimStrength: 'unresolved',
    questionText: 'What are the seven foods of the Promised Land?',
    answerContent:
      'No authoritative answer is produced by this seed; the underlying verification work remains a prerequisite for a completed answer.',
    editorialNotes: [
      'The existing content brief keeps publication blocked pending verification.',
    ],
    productionStatus: 'draft',
    editorialReviewStatus: 'not-started',
    publicationStatus: 'not-eligible',
    publicationEligible: false,
  },
  {
    id: 'explainer-biblical-food-evidence-labels',
    title: 'How Biblical Food Evidence Is Explained',
    contentType: 'explainer',
    purpose:
      'Explain the project distinction between supported, inferred, editorial and unresolved material without claiming a new historical fact.',
    researchDossierIds: [],
    foodIds: [],
    scriptureContext: [],
    summary:
      'This practical editorial explainer documents how future content should preserve evidence boundaries.',
    uncertaintyDisclosure:
      'This record is an editorial explanation of project methodology and does not itself verify historical or scriptural claims.',
    keyPoints: [
      'Editorial explanation does not create research verification.',
      'Uncertainty must remain visible until canonical research resolves it.',
    ],
    evidenceState: 'practical-editorial-explanation',
    claimStrength: 'editorial',
    editorialNotes: [
      'Keep this record separate from scripture or historical evidence claims.',
    ],
    productionStatus: 'draft',
    editorialReviewStatus: 'not-started',
    publicationStatus: 'not-eligible',
    publicationEligible: false,
  },
];
