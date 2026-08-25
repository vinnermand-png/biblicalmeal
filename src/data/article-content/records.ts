import { RESEARCH_DOSSIERS } from '../research/dossiers';
import { SEO_TARGETS } from '../seo-master-map';
import type { ArticleContentRecord } from './types';

const dossierIds = new Set(RESEARCH_DOSSIERS.map((dossier) => dossier.id));
const targetIds = new Set(SEO_TARGETS.map((target) => target.id));

if (!dossierIds.has('dossier-figs') || !targetIds.has('figs')) {
  throw new Error('V3C.19 seeds require canonical research and SEO records.');
}

/**
 * V3C.19 keeps production deliberately evidence-bound. These are non-public
 * drafts connected to canonical dossiers and Food Universe records; they do
 * not create routes, new citations, or public publication claims.
 */
export const ARTICLE_CONTENT_RECORDS: readonly ArticleContentRecord[] = [
  {
    id: 'article-figs-research-context',
    title: 'Figs in the Bible: Research Context',
    contentType: 'historical-context',
    purpose:
      'Provide an evidence-aware editorial shell around the completed common-fig research scope.',
    seoTargetId: 'figs',
    researchDossierIds: ['dossier-figs'],
    foodIds: ['figs-entity'],
    relatedContentIds: ['article-biblical-food-evidence-labels'],
    scriptureContext: [],
    summary:
      'This draft connects the completed common-fig research scope to a future explanatory article without adding claims beyond the canonical dossier.',
    uncertaintyDisclosure:
      'Common-fig conclusions exclude the separately owned sycomore uncertainty; only claims inside the completed dossier scope may be promoted in later editorial production.',
    keyPoints: [
      'Reuse the canonical research dossier instead of creating a second evidence record.',
      'Keep common fig and sycomore identification work explicitly separate.',
    ],
    evidenceState: 'supported',
    claimStrength: 'supported',
    editorialNotes: [
      'No new scripture quotation or citation is created by this content draft.',
    ],
    productionStatus: 'draft',
    editorialReviewStatus: 'not-started',
    publicationStatus: 'not-eligible',
    publicationEligible: false,
  },
  {
    id: 'article-barley-biblical-evidence',
    title: 'Barley in the Bible: What the Evidence Scope Supports',
    contentType: 'scripture-context',
    purpose:
      'Explain the completed barley evidence scope without converting contextual references into a universal diet or reconstructed recipe claim.',
    seoTargetId: 'barley',
    researchDossierIds: ['dossier-barley'],
    foodIds: ['barley'],
    relatedContentIds: [
      'question-what-does-barley-evidence-support',
      'article-biblical-food-evidence-labels',
    ],
    scriptureContext: [],
    summary:
      'The draft preserves the completed barley scope across agricultural, harvest, provision, narrative bread and crop contexts while retaining its stated limits.',
    uncertaintyDisclosure:
      'The completed dossier does not establish a universal biblical diet, a single historical recipe or an exact ancient preparation method.',
    keyPoints: [
      'Context determines what a barley reference can support.',
      'Bread and crop references do not by themselves create a reconstructed recipe.',
    ],
    evidenceState: 'supported',
    claimStrength: 'supported',
    editorialNotes: [
      'Keep narrative and symbolic contexts within their recorded evidence boundaries.',
    ],
    productionStatus: 'draft',
    editorialReviewStatus: 'not-started',
    publicationStatus: 'not-eligible',
    publicationEligible: false,
  },
  {
    id: 'question-what-does-barley-evidence-support',
    title: 'What Does the Biblical Evidence for Barley Support?',
    contentType: 'question',
    purpose:
      'Answer a bounded search question using the completed barley dossier without overstating what those contexts prove.',
    seoTargetId: 'barley',
    researchDossierIds: ['dossier-barley'],
    foodIds: ['barley'],
    relatedContentIds: [
      'article-barley-biblical-evidence',
      'article-biblical-food-evidence-labels',
    ],
    scriptureContext: [],
    summary:
      'The answer is limited to the canonical research scope and explicitly separates recorded contexts from broader diet or recipe claims.',
    uncertaintyDisclosure:
      'This answer does not claim that every biblical barley reference describes a universal diet, an exact dish or a reproducible ancient recipe.',
    keyPoints: [
      'The completed scope includes agricultural, harvest, provision, narrative bread and crop contexts.',
      'Contextual evidence is not automatically evidence for a universal dietary pattern.',
    ],
    evidenceState: 'supported',
    claimStrength: 'supported',
    questionText: 'What does the biblical evidence for barley support?',
    answerContent:
      'Within the completed BiblicalMeal research scope, barley is documented across agricultural, harvest, provision, narrative bread and crop contexts. Those contexts support discussion of barley in those recorded settings, but they do not by themselves establish a universal biblical diet or an exact reconstructed recipe.',
    editorialNotes: [
      'Do not add scripture quotations until a production record reuses the canonical verified scripture records.',
    ],
    productionStatus: 'draft',
    editorialReviewStatus: 'not-started',
    publicationStatus: 'not-eligible',
    publicationEligible: false,
  },
  {
    id: 'article-dates-palm-evidence-boundaries',
    title: 'Dates and Palm References: Keeping the Evidence Boundaries Clear',
    contentType: 'historical-context',
    purpose:
      'Support future date-food content while preserving the completed dossier distinction between historic Judean date-palm evidence and every biblical palm reference.',
    seoTargetId: 'dates',
    researchDossierIds: ['dossier-dates'],
    foodIds: ['dates-entity'],
    relatedContentIds: [
      'question-do-palm-references-always-mean-edible-dates',
      'article-biblical-food-evidence-labels',
    ],
    scriptureContext: [],
    summary:
      'This draft connects completed historical date-palm research to future food content without collapsing palm-tree and palm-branch references into edible-date claims.',
    uncertaintyDisclosure:
      'The completed dossier preserves an unresolved relationship between individual KJV palm references and edible dates; palm wording must not automatically be treated as food evidence.',
    keyPoints: [
      'Historic date-palm evidence and every biblical palm reference are not identical claim categories.',
      'Food identification remains bounded by the evidence attached to each context.',
    ],
    evidenceState: 'supported',
    claimStrength: 'supported',
    editorialNotes: [
      'Retain the palm-versus-date warning in any later publication derived from this draft.',
    ],
    productionStatus: 'draft',
    editorialReviewStatus: 'not-started',
    publicationStatus: 'not-eligible',
    publicationEligible: false,
  },
  {
    id: 'question-do-palm-references-always-mean-edible-dates',
    title: 'Do Biblical Palm References Always Mean Edible Dates?',
    contentType: 'question',
    purpose:
      'Preserve a bounded question whose answer directly reflects the completed dates dossier warning.',
    seoTargetId: 'dates',
    researchDossierIds: ['dossier-dates'],
    foodIds: ['dates-entity'],
    relatedContentIds: ['article-dates-palm-evidence-boundaries'],
    scriptureContext: [],
    summary:
      'The answer prevents automatic conversion of palm wording into edible-date evidence.',
    uncertaintyDisclosure:
      'The completed dossier does not resolve every individual KJV palm reference as an edible-date reference.',
    keyPoints: [
      'Palm-tree and palm-branch references are not automatically edible-date references.',
      'Historic Judean date-palm evidence can support a narrower historical context without resolving every biblical usage.',
    ],
    evidenceState: 'supported',
    claimStrength: 'supported',
    questionText: 'Do biblical palm references always mean edible dates?',
    answerContent:
      'No. The completed BiblicalMeal dates dossier explicitly preserves that palm-tree and palm-branch references are not automatically edible-date references, and it leaves the relationship between individual KJV palm references and edible dates unresolved where the evidence does not justify a direct identification.',
    editorialNotes: [
      'Keep the answer bounded to the canonical dossier warning rather than generalizing beyond its reviewed scope.',
    ],
    productionStatus: 'draft',
    editorialReviewStatus: 'not-started',
    publicationStatus: 'not-eligible',
    publicationEligible: false,
  },
  {
    id: 'article-honey-evidence-boundaries',
    title:
      'Honey in Biblical Food Research: What the Evidence Does and Does Not Identify',
    contentType: 'historical-context',
    purpose:
      'Provide an evidence-bound editorial bridge around completed KJV honey and bee narrative research while retaining the devash identification warning.',
    seoTargetId: 'honey',
    researchDossierIds: ['dossier-honey'],
    foodIds: ['honey-entity'],
    relatedContentIds: [
      'question-does-biblical-honey-always-mean-bee-honey',
      'article-biblical-food-evidence-labels',
    ],
    scriptureContext: [],
    summary:
      'This draft distinguishes completed evidence for recorded honey contexts from a universal identification of every relevant biblical term as bee honey.',
    uncertaintyDisclosure:
      'The completed dossier keeps the devash identification warning active: KJV wording alone does not resolve bee honey versus syrup in every biblical context.',
    keyPoints: [
      'Explicit bee narratives and broader identification questions are not the same evidence category.',
      'Unresolved identification must remain visible in later editorial production.',
    ],
    evidenceState: 'supported',
    claimStrength: 'supported',
    editorialNotes: [
      'Do not promote a universal bee-honey identification from this record.',
    ],
    productionStatus: 'draft',
    editorialReviewStatus: 'not-started',
    publicationStatus: 'not-eligible',
    publicationEligible: false,
  },
  {
    id: 'question-does-biblical-honey-always-mean-bee-honey',
    title: 'Does Biblical Honey Always Mean Bee Honey?',
    contentType: 'question',
    purpose:
      'Answer a high-risk identification question with the explicit uncertainty retained by the completed honey dossier.',
    seoTargetId: 'honey',
    researchDossierIds: ['dossier-honey'],
    foodIds: ['honey-entity'],
    relatedContentIds: ['article-honey-evidence-boundaries'],
    scriptureContext: [],
    summary:
      'The answer preserves the difference between explicit bee evidence and unresolved identification in every broader biblical context.',
    uncertaintyDisclosure:
      'KJV wording alone does not resolve bee honey versus syrup in every biblical context, so this draft does not claim a universal identification.',
    keyPoints: [
      'Explicit bee narrative evidence can be discussed without resolving every broader term.',
      'The devash identification warning remains a publication disclosure requirement where relevant.',
    ],
    evidenceState: 'supported',
    claimStrength: 'supported',
    questionText: 'Does biblical honey always mean bee honey?',
    answerContent:
      'No universal identification is claimed by the completed BiblicalMeal research scope. The dossier supports discussion of KJV honey, honeycomb, wild honey and explicit bee narrative evidence, while preserving that KJV wording alone does not resolve bee honey versus syrup in every biblical context.',
    editorialNotes: [
      'The answer must remain paired with its uncertainty disclosure if promoted toward publication.',
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
    relatedContentIds: ['article-biblical-food-evidence-labels'],
    scriptureContext: ['Deuteronomy 8:8'],
    summary:
      'This is a controlled question draft whose final answer remains unresolved until canonical research and scripture verification support publication.',
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
      'No authoritative answer is produced by this draft; the underlying verification work remains a prerequisite for a completed answer.',
    editorialNotes: [
      'The existing content brief keeps publication blocked pending verification.',
    ],
    productionStatus: 'draft',
    editorialReviewStatus: 'not-started',
    publicationStatus: 'not-eligible',
    publicationEligible: false,
  },
  {
    id: 'article-biblical-food-evidence-labels',
    title: 'How Biblical Food Evidence Is Explained',
    contentType: 'explainer',
    purpose:
      'Explain the project distinction between supported, inferred, editorial and unresolved material without claiming a new historical fact.',
    researchDossierIds: [],
    foodIds: [],
    relatedContentIds: [],
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
