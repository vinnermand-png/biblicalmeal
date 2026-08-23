import { ARTICLE_CONTENT_RECORDS } from '../article-content/records';
import type { InstagramContentRecord, InstagramProviderBoundary } from './types';

const articleIds = new Set(ARTICLE_CONTENT_RECORDS.map((record) => record.id));

if (!articleIds.has('article-biblical-food-evidence-labels')) {
  throw new Error('V3C.32 requires canonical source content before social drafts can be created.');
}

/**
 * V3C.32 seeds only canonical, unpublished social-engine records. These are
 * structured editorial drafts, not AI-generated output and not Instagram posts.
 */
export const INSTAGRAM_CONTENT_RECORDS: readonly InstagramContentRecord[] = [
  {
    id: 'instagram-evidence-boundaries-intro',
    title: 'How BiblicalMeal Separates Evidence, Inference and Editorial Content',
    mode: 'factual',
    status: 'draft',
    canonicalSources: [{ kind: 'article-content', id: 'article-biblical-food-evidence-labels' }],
    brief: {
      objective: 'Explain the project methodology without converting methodology into new historical claims.',
      audienceIntent: 'Understand how BiblicalMeal labels supported, inferred, editorial and unresolved material.',
      factualBoundaries: [
        'Use only distinctions already owned by the canonical methodology record.',
        'Do not add biblical, historical, archaeological or nutritional claims.',
      ],
      uncertaintyBoundaries: [
        'The social draft does not resolve any unresolved food or scripture identification.',
      ],
      disclosureRequirements: [
        'State that social formatting is an editorial summary of canonical project methodology.',
      ],
    },
    draft: {
      hook: 'Not every biblical-food statement has the same level of evidence.',
      caption: 'BiblicalMeal keeps supported evidence, inference, editorial explanation and unresolved questions distinct. A clear format can make research easier to follow, but formatting itself does not turn a claim into verified research.',
      visualDirection: 'Clean editorial card explaining the four evidence boundaries; no documentary or historical-scene claim is implied.',
      hashtags: ['#BiblicalMeal', '#BiblicalResearch', '#FoodHistory'],
      platformNotes: ['Educational editorial draft only.', 'Do not imply external publication approval.'],
    },
    evidenceReferences: ['article-biblical-food-evidence-labels'],
    citationReferences: [],
    authorityReferences: [],
    publicationEligible: false,
    externalProductionApproved: false,
  },
  {
    id: 'instagram-biblical-food-reflection',
    title: 'Biblical Food as a Starting Point for Reflection',
    mode: 'inspirational',
    status: 'candidate',
    canonicalSources: [{ kind: 'article-content', id: 'article-biblical-food-evidence-labels' }],
    brief: {
      objective: 'Create a reflective social concept without presenting inspiration as historical verification.',
      audienceIntent: 'Engage with the project theme through a clearly non-factual reflective format.',
      factualBoundaries: ['Do not introduce factual historical claims.'],
      uncertaintyBoundaries: ['Inspiration must not resolve or conceal research uncertainty.'],
      disclosureRequirements: ['Keep reflective wording distinct from evidence labels.'],
    },
    draft: {
      hook: 'A meal can invite reflection without becoming a historical claim.',
      caption: 'BiblicalMeal explores food, context and evidence with room for reflection. Reflection can be meaningful, but it should never be confused with research verification.',
      visualDirection: 'Quiet editorial food detail or existing illustrative asset; avoid documentary claims about ancient events.',
      hashtags: ['#BiblicalMeal', '#BibleReflection'],
      platformNotes: ['Inspirational mode.', 'Not a research conclusion.'],
    },
    evidenceReferences: ['article-biblical-food-evidence-labels'],
    citationReferences: [],
    authorityReferences: [],
    publicationEligible: false,
    externalProductionApproved: false,
  },
];

export const INSTAGRAM_PROVIDER_BOUNDARY: InstagramProviderBoundary = {
  aiProviderMode: 'not-configured',
  instagramPublishingMode: 'external-integration-not-configured',
  notes: [
    'No AI provider is called by V3C.32.',
    'No Instagram publishing integration exists in this phase.',
    'Future providers must consume canonical briefs and return drafts that remain subject to evidence and editorial review.',
  ],
};
