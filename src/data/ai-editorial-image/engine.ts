import { AI_WEBSITE_CONTENT_RECORDS } from '../ai-website-content/records';
import type {
  AiEditorialImageAssetRecord,
  AiEditorialImageGenerationOutput,
  AiEditorialImageProvider,
  AiEditorialImageValidation,
} from './types';

const WEBSITE_DRAFT_IDS = new Set(
  AI_WEBSITE_CONTENT_RECORDS.map((record) => record.id),
);

function parseSize(
  size: string,
): { width: number; height: number } | undefined {
  const match = /^(\d+)x(\d+)$/.exec(size.trim());
  if (!match) return undefined;
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (
    !Number.isSafeInteger(width) ||
    !Number.isSafeInteger(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return undefined;
  }
  return { width, height };
}

export function validateAiEditorialImageAsset(
  record: AiEditorialImageAssetRecord,
): AiEditorialImageValidation {
  const issues: string[] = [];
  const expectedSize = parseSize(record.brief.targetSize);
  const generation = record.generation;
  const dimensionsValid = Boolean(
    generation &&
    expectedSize &&
    generation.width === expectedSize.width &&
    generation.height === expectedSize.height,
  );
  const formatValid =
    generation?.format === record.brief.targetFormat &&
    generation?.publicPath.endsWith('.webp') === true &&
    generation?.output.endsWith('.webp') === true;
  const altTextValid = record.brief.altText.trim().length > 0;
  const disclosureValid =
    record.brief.editorialOnly &&
    !record.brief.documentaryEvidence &&
    /editorial|illustrative/i.test(record.brief.disclosure);
  const canonicalContentValid =
    WEBSITE_DRAFT_IDS.has(record.sourceWebsiteContentId) &&
    record.brief.contentDraftId === record.sourceWebsiteContentId &&
    AI_WEBSITE_CONTENT_RECORDS.some(
      (draft) =>
        draft.id === record.sourceWebsiteContentId &&
        draft.canonicalRoute === record.canonicalRoute,
    );

  if (!dimensionsValid)
    issues.push(
      'Generated dimensions do not match the requested asset dimensions.',
    );
  if (!formatValid)
    issues.push(
      'Generated asset does not satisfy the canonical WebP output boundary.',
    );
  if (!altTextValid)
    issues.push('Generated asset requires meaningful alt text metadata.');
  if (!disclosureValid)
    issues.push(
      'Generated asset must remain explicitly editorial/illustrative and non-documentary.',
    );
  if (!canonicalContentValid)
    issues.push(
      'Generated asset is not connected to its canonical V3C.32 content source.',
    );

  return {
    dimensionsValid,
    formatValid,
    altTextValid,
    disclosureValid,
    canonicalContentValid,
    passed: issues.length === 0,
    issues,
  };
}

export async function generateAiEditorialImage(
  record: AiEditorialImageAssetRecord,
  provider?: AiEditorialImageProvider,
): Promise<AiEditorialImageAssetRecord> {
  const expectedSize = parseSize(record.brief.targetSize);
  if (!expectedSize) {
    return {
      ...record,
      pipelineStatus: 'validation-failed',
      retryCount: record.retryCount + 1,
      lastFailure: 'Invalid target image dimensions.',
    };
  }

  let generation: AiEditorialImageGenerationOutput;
  try {
    generation = provider?.configured
      ? await provider.generate({ assetId: record.id, brief: record.brief })
      : {
          provider: 'deterministic-canonical-prototype',
          requestId: `prototype-${record.id}`,
          publicPath: `/assets/editorial/prototypes/${record.id}.webp`,
          output: `public/assets/editorial/prototypes/${record.id}.webp`,
          width: expectedSize.width,
          height: expectedSize.height,
          format: 'webp',
        };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Image generation provider failed.';
    return {
      ...record,
      provider: provider?.kind ?? record.provider,
      providerConfigured: Boolean(provider?.configured),
      pipelineStatus: 'generation-failed',
      retryCount: record.retryCount + 1,
      lastFailure: message,
    };
  }

  const generated: AiEditorialImageAssetRecord = {
    ...record,
    provider: generation.provider,
    providerConfigured: Boolean(provider?.configured),
    pipelineStatus: 'generated-unapproved',
    generation,
    retryCount: record.retryCount,
    lastFailure: undefined,
  };
  const validation = validateAiEditorialImageAsset(generated);
  return {
    ...generated,
    validation,
    pipelineStatus: validation.passed ? 'admin-review' : 'validation-failed',
  };
}

export function canProposeEditorialManifestAssignment(
  record: AiEditorialImageAssetRecord,
): boolean {
  return (
    record.pipelineStatus === 'admin-review' &&
    record.validation?.passed === true &&
    record.adminReviewRequired &&
    record.requiresExistingPublicationGates &&
    record.publicationEligible === false
  );
}
