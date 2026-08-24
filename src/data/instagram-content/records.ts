import { ARTICLE_CONTENT_RECORDS } from '../article-content/records';
import { AI_WEBSITE_CONTENT_RECORDS } from '../ai-website-content/records';
import { AUTHORITY_RECORDS, CITATION_RECORDS } from '../authority/records';
import type { InstagramContentRecord, InstagramProviderBoundary } from './types';

const articleIds = new Set(ARTICLE_CONTENT_RECORDS.map((record) => record.id));
const websiteSource = AI_WEBSITE_CONTENT_RECORDS.find(
  (record) => record.id === 'ai-website-article-figs-research-context',
);

if (!articleIds.has('article-biblical-food-evidence-labels')) {
  throw new Error('Instagram content requires canonical source content before social drafts can be created.');
}
if (!websiteSource) {
  throw new Error('V3C.34 prototype requires the canonical V3C.32 website-content record.');
}

const prototypeAuthorityIds = websiteSource.citationIds
  .map((citationId) => CITATION_RECORDS.find((citation) => citation.id === citationId)?.authorityId)
  .filter((id): id is string => Boolean(id) && AUTHORITY_RECORDS.some((authority) => authority.id === id));

/**
 * Canonical social records. Existing V3C.32 seed drafts remain non-public.
 * V3C.34 adds one end-to-end prototype sourced directly from V3C.32 website
 * content and V3C.33 editorial image direction without minting new facts,
 * citations, authorities or publication authority.
 */
export const INSTAGRAM_CONTENT_RECORDS: readonly InstagramContentRecord[] = [
  {
    id: 'instagram-evidence-boundaries-intro',
    title: 'How BiblicalMeal Separates Evidence, Inference and Editorial Content',
    mode: 'factual',
    status: 'draft',
    canonicalSources: [{ kind: 'article-content', id: 'article-biblical-food-evidence-labels' }],
    sourceImageAssetIds: [],
    brief: {
      objective: 'Explain the project methodology without converting methodology into new historical claims.',
      audienceIntent: 'Understand how BiblicalMeal labels supported, inferred, editorial and unresolved material.',
      factualBoundaries: ['Use only distinctions already owned by the canonical methodology record.', 'Do not add biblical, historical, archaeological or nutritional claims.'],
      uncertaintyBoundaries: ['The social draft does not resolve any unresolved food or scripture identification.'],
      disclosureRequirements: ['State that social formatting is an editorial summary of canonical project methodology.'],
    },
    draft: {
      hook: 'Not every biblical-food statement has the same level of evidence.',
      caption: 'BiblicalMeal keeps supported evidence, inference, editorial explanation and unresolved questions distinct. A clear format can make research easier to follow, but formatting itself does not turn a claim into verified research.',
      carousel: [],
      reelScript: [],
      visualDirection: 'Clean editorial card explaining the four evidence boundaries; no documentary or historical-scene claim is implied.',
      visualBrief: 'Editorial social card; no documentary evidence claim.',
      hashtags: ['#BiblicalMeal', '#BiblicalResearch', '#FoodHistory'],
      platformNotes: ['Educational editorial draft only.', 'Do not imply external publication approval.'],
    },
    evidenceReferences: ['article-biblical-food-evidence-labels'],
    citationReferences: [], authorityReferences: [],
    provider: 'not-configured', providerConfigured: false, retryCount: 0,
    publicationEligible: false, externalProductionApproved: false,
    adminReviewRequired: true, requiresExistingPublicationGates: true,
  },
  {
    id: 'instagram-biblical-food-reflection',
    title: 'Biblical Food as a Starting Point for Reflection',
    mode: 'inspirational', status: 'candidate',
    canonicalSources: [{ kind: 'article-content', id: 'article-biblical-food-evidence-labels' }],
    sourceImageAssetIds: [],
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
      carousel: [], reelScript: [],
      visualDirection: 'Quiet editorial food detail or existing illustrative asset; avoid documentary claims about ancient events.',
      visualBrief: 'Illustrative reflective direction; not documentary evidence.',
      hashtags: ['#BiblicalMeal', '#BibleReflection'],
      platformNotes: ['Inspirational mode.', 'Not a research conclusion.'],
    },
    evidenceReferences: ['article-biblical-food-evidence-labels'],
    citationReferences: [], authorityReferences: [],
    provider: 'not-configured', providerConfigured: false, retryCount: 0,
    publicationEligible: false, externalProductionApproved: false,
    adminReviewRequired: true, requiresExistingPublicationGates: true,
  },
  {
    id: 'instagram-ai-website-figs-research-context',
    title: 'Figs in the Bible: What the Evidence Scope Supports',
    mode: 'factual', status: 'brief-ready',
    canonicalSources: [
      { kind: 'ai-website-content', id: websiteSource.id },
      { kind: 'article-content', id: websiteSource.sourceArticleContentId },
    ],
    sourceWebsiteContentId: websiteSource.id,
    sourceImageAssetIds: ['ai-editorial-ai-website-article-figs-research-context'],
    brief: {
      objective: 'Adapt only the canonical V3C.32 figs research context into an evidence-bound Instagram explanation.',
      audienceIntent: 'Understand the evidence scope without mistaking editorial formatting for new research.',
      factualBoundaries: ['Use only the canonical website-content source relationships and cited evidence already resolved by V3C.32.', 'Do not convert the separate sycomore uncertainty into a common-fig conclusion.'],
      uncertaintyBoundaries: ['The social draft preserves the source uncertainty rather than resolving sycomore identification or adding new historical claims.'],
      disclosureRequirements: ['Social formatting is an editorial summary of canonical evidence-bound website content.', 'The related image is editorial/illustrative and not documentary historical evidence.'],
    },
    draft: {
      hook: 'A biblical food reference can be evidence-bound without being a complete historical reconstruction.',
      caption: `${websiteSource.seo.description} ${websiteSource.draftBody.split('\n\n').at(-1) ?? ''}`,
      carousel: [
        'Slide 1: What does the canonical figs evidence scope actually support?',
        'Slide 2: Reuse the completed research dossier rather than creating a second evidence record.',
        'Slide 3: Keep common fig and the separately owned sycomore uncertainty distinct.',
        'Slide 4: Editorial formatting does not convert inference or uncertainty into verified research.',
      ],
      reelScript: [
        'Hook: A clear social post is not the same thing as new historical evidence.',
        'Point: BiblicalMeal reuses its canonical figs research relationships.',
        'Boundary: Common fig and sycomore identification remain separate.',
        'Close: Check the full evidence context before treating a summary as a universal conclusion.',
      ],
      visualDirection: 'Use the V3C.33 editorial image direction connected to the same V3C.32 website content record.',
      visualBrief: 'Editorial/illustrative social visual derived from the canonical website image brief; not documentary historical evidence.',
      hashtags: ['#BiblicalMeal', '#BiblicalResearch', '#FoodHistory'],
      platformNotes: ['Internal V3C.34 prototype.', 'No Instagram API integration.', 'No external publication approval or automatic publishing.'],
    },
    evidenceReferences: [websiteSource.sourceArticleContentId, ...websiteSource.researchDossierIds],
    citationReferences: websiteSource.citationIds,
    authorityReferences: prototypeAuthorityIds,
    provider: 'deterministic-canonical-prototype', providerConfigured: false, retryCount: 0,
    publicationEligible: false, externalProductionApproved: false,
    adminReviewRequired: true, requiresExistingPublicationGates: true,
  },
];

export const INSTAGRAM_PROVIDER_BOUNDARY: InstagramProviderBoundary = {
  aiProviderMode: 'not-configured',
  instagramPublishingMode: 'external-integration-not-configured',
  notes: [
    'No external AI provider is called by repository default.',
    'The V3C.34 prototype is deterministic and reuses only canonical V3C.32/V3C.33 relationships.',
    'No Instagram publishing integration exists in this phase.',
    'Future providers must return drafts that re-enter canonical evidence, disclosure and editorial review; they cannot publish automatically.',
  ],
};
