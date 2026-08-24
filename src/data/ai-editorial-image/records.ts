import { AI_WEBSITE_CONTENT_RECORDS } from '../ai-website-content/records';
import type { AiEditorialImageAssetRecord } from './types';

const source = AI_WEBSITE_CONTENT_RECORDS.find(
  (record) => record.id === 'ai-website-article-figs-research-context',
);

if (!source) {
  throw new Error('Missing V3C.32 source draft for V3C.33 prototype');
}

/**
 * V3C.33 keeps generated assets outside the canonical editorial manifest until
 * validation and explicit admin review have completed. This prototype is not a
 * public asset and does not claim documentary historical evidence.
 */
export const AI_EDITORIAL_IMAGE_ASSET_RECORDS: readonly AiEditorialImageAssetRecord[] = [
  {
    id: 'ai-editorial-ai-website-article-figs-research-context',
    sourceWebsiteContentId: source.id,
    canonicalRoute: source.canonicalRoute,
    provider: 'deterministic-canonical-prototype',
    providerConfigured: false,
    pipelineStatus: 'image-brief-ready',
    brief: {
      contentDraftId: source.id,
      canonicalRoute: source.canonicalRoute,
      subject: source.imageBrief.disclosure,
      purpose: 'Editorial image direction for an evidence-bound website content draft.',
      editorialOnly: true,
      documentaryEvidence: false,
      disclosure: source.imageBrief.disclosure,
      altText: `Editorial illustration supporting ${source.title}.`,
      targetSize: '1536x1024',
      targetFormat: 'webp',
    },
    manifestAssignmentStatus: 'not-added',
    adminReviewRequired: true,
    requiresExistingPublicationGates: true,
    publicationEligible: false,
    retryCount: 0,
  },
];
