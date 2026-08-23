import { AI_WEBSITE_CONTENT_RECORDS } from './records';
import type {
  WebsiteContentDraft,
  WebsiteContentGenerationInput,
  WebsiteContentProvider,
} from './types';

export function generationInputFor(
  record: WebsiteContentDraft,
): WebsiteContentGenerationInput {
  return {
    title: record.title,
    summary: record.seo.description,
    keyPoints: record.draftBody.split('\n\n').slice(1, -1),
    uncertaintyDisclosure: record.draftBody.split('\n\n').at(-1) ?? '',
    researchBrief: record.researchBrief,
  };
}

/**
 * Safe provider boundary. No provider is configured by repository default, so
 * the canonical prototype remains deterministic and evidence-bound. If an
 * external provider is supplied later, its raw output is returned only as a
 * draft with QA reset; it cannot inherit evidence or publication approval.
 */
export async function generateWebsiteContentDraft(
  sourceArticleContentId: string,
  provider?: WebsiteContentProvider,
): Promise<WebsiteContentDraft | undefined> {
  const prototype = AI_WEBSITE_CONTENT_RECORDS.find(
    (record) => record.sourceArticleContentId === sourceArticleContentId,
  );
  if (!prototype) return undefined;

  if (!provider || !provider.configured) return prototype;

  const draftBody = await provider.generate(generationInputFor(prototype));
  return {
    ...prototype,
    provider: 'external-ai',
    providerConfigured: true,
    pipelineStatus: 'draft-generated',
    draftBody,
    qa: {
      noUnsupportedClaims: false,
      citationsTraceable: false,
      uncertaintyPreserved: false,
      canonicalRouteMatchesTarget: prototype.qa.canonicalRouteMatchesTarget,
    },
    publicationEligible: false,
  };
}
