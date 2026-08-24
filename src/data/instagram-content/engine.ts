import { AI_EDITORIAL_IMAGE_ASSET_RECORDS } from '../ai-editorial-image/records';
import { AI_WEBSITE_CONTENT_RECORDS } from '../ai-website-content/records';
import { AUTHORITY_RECORDS, CITATION_RECORDS } from '../authority/records';
import { INSTAGRAM_CONTENT_RECORDS } from './records';
import type {
  InstagramContentProvider,
  InstagramContentRecord,
  InstagramContentValidation,
} from './types';

const websiteRecords = new Map(
  AI_WEBSITE_CONTENT_RECORDS.map((record) => [record.id, record]),
);
const imageRecords = new Map(
  AI_EDITORIAL_IMAGE_ASSET_RECORDS.map((record) => [record.id, record]),
);
const citationRecords = new Map(
  CITATION_RECORDS.map((record) => [record.id, record]),
);
const authorityRecords = new Map(
  AUTHORITY_RECORDS.map((record) => [record.id, record]),
);

export function validateInstagramContent(
  record: InstagramContentRecord,
): InstagramContentValidation {
  const issues: string[] = [];
  const source = record.sourceWebsiteContentId
    ? websiteRecords.get(record.sourceWebsiteContentId)
    : undefined;
  const canonicalSourceValid = source
    ? record.canonicalSources.some(
        (item) => item.kind === 'ai-website-content' && item.id === source.id,
      )
    : record.sourceWebsiteContentId
      ? false
      : record.canonicalSources.length > 0;
  const evidenceReferencesValid = source
    ? record.evidenceReferences.includes(source.sourceArticleContentId)
    : record.evidenceReferences.length > 0;
  const citationsTraceable = source
    ? record.citationReferences.every(
        (id) => source.citationIds.includes(id) && citationRecords.has(id),
      )
    : record.citationReferences.every((id) => citationRecords.has(id));
  const authorityReferencesTraceable = source
    ? record.authorityReferences.every(
        (authorityId) =>
          source.citationIds.some(
            (citationId) =>
              citationRecords.get(citationId)?.authorityId === authorityId,
          ) && authorityRecords.has(authorityId),
      )
    : record.authorityReferences.every((id) => authorityRecords.has(id));
  const uncertaintyPreserved = source
    ? record.brief.uncertaintyBoundaries.some((boundary) =>
        /uncertainty|uncertain|unresolved/i.test(boundary),
      ) ||
      record.draft.caption.includes(source.draftBody.split('\n\n').at(-1) ?? '')
    : record.brief.uncertaintyBoundaries.length > 0;
  const disclosurePreserved = source
    ? record.brief.disclosureRequirements.some((requirement) =>
        /editorial|illustrative|evidence|uncertainty/i.test(requirement),
      )
    : record.brief.disclosureRequirements.length > 0;
  const imageRelationshipValid = record.sourceImageAssetIds.every((id) => {
    const image = imageRecords.get(id);
    return Boolean(
      image &&
      source &&
      image.sourceWebsiteContentId === source.id &&
      image.canonicalRoute === source.canonicalRoute &&
      image.brief.editorialOnly &&
      image.brief.documentaryEvidence === false,
    );
  });
  const noUnsupportedClaims = source
    ? record.mode !== 'factual' ||
      (source.qa.noUnsupportedClaims === true &&
        source.qa.citationsTraceable === true)
    : true;

  if (!canonicalSourceValid)
    issues.push(
      'Instagram content must retain a canonical website-content source relationship.',
    );
  if (!evidenceReferencesValid)
    issues.push(
      'Instagram evidence references must resolve to the canonical source content.',
    );
  if (!citationsTraceable)
    issues.push(
      'Instagram citation references must resolve through canonical website-content citation relationships.',
    );
  if (!authorityReferencesTraceable)
    issues.push(
      'Instagram authority references must resolve through canonical citation authority relationships.',
    );
  if (!uncertaintyPreserved)
    issues.push(
      'Instagram content must preserve canonical uncertainty boundaries.',
    );
  if (!disclosurePreserved)
    issues.push(
      'Instagram content must preserve evidence/editorial disclosure requirements.',
    );
  if (!imageRelationshipValid)
    issues.push(
      'Instagram image assets must resolve to the same canonical website-content source and remain editorial.',
    );
  if (!noUnsupportedClaims)
    issues.push(
      'Factual Instagram content cannot inherit unsupported claim clearance.',
    );

  return {
    canonicalSourceValid,
    evidenceReferencesValid,
    citationsTraceable,
    authorityReferencesTraceable,
    uncertaintyPreserved,
    disclosurePreserved,
    imageRelationshipValid,
    noUnsupportedClaims,
    passed: issues.length === 0,
    issues,
  };
}

export function duplicateInstagramSourceIds(
  records: readonly InstagramContentRecord[] = INSTAGRAM_CONTENT_RECORDS,
): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const record of records) {
    if (!record.sourceWebsiteContentId) continue;
    const ownershipKey = `${record.sourceWebsiteContentId}:${record.mode}`;
    if (seen.has(ownershipKey)) duplicates.add(record.id);
    seen.add(ownershipKey);
  }
  return [...duplicates];
}

export async function generateInstagramContent(
  record: InstagramContentRecord,
  provider?: InstagramContentProvider,
): Promise<InstagramContentRecord> {
  const source = record.sourceWebsiteContentId
    ? websiteRecords.get(record.sourceWebsiteContentId)
    : undefined;
  if (!source)
    return {
      ...record,
      status: 'validation-failed',
      retryCount: record.retryCount + 1,
      lastFailure: 'Missing canonical website-content source.',
    };
  try {
    const draft = provider?.configured
      ? await provider.generate({
          record,
          sourceTitle: source.title,
          sourceSummary: source.seo.description,
          keyPoints: source.draftBody.split('\n\n').slice(1, -1),
          uncertaintyDisclosure: source.draftBody.split('\n\n').at(-1) ?? '',
          imageBriefDisclosure: source.imageBrief.disclosure,
        })
      : record.draft;
    const generated: InstagramContentRecord = {
      ...record,
      draft,
      provider: provider?.configured
        ? provider.kind
        : 'deterministic-canonical-prototype',
      providerConfigured: Boolean(provider?.configured),
      status: 'draft',
      retryCount: record.retryCount,
      lastFailure: undefined,
      publicationEligible: false,
      externalProductionApproved: false,
    };
    const validation = validateInstagramContent(generated);
    return {
      ...generated,
      validation,
      status: validation.passed ? 'editorial-review' : 'validation-failed',
    };
  } catch (error) {
    return {
      ...record,
      provider: provider?.kind ?? record.provider,
      providerConfigured: Boolean(provider?.configured),
      status: 'generation-failed',
      retryCount: record.retryCount + 1,
      lastFailure:
        error instanceof Error
          ? error.message
          : 'Instagram content provider failed.',
      publicationEligible: false,
      externalProductionApproved: false,
    };
  }
}

export function canApproveForFutureExternalProduction(
  record: InstagramContentRecord,
): boolean {
  const source = record.sourceWebsiteContentId
    ? websiteRecords.get(record.sourceWebsiteContentId)
    : undefined;
  return (
    record.status === 'editorial-review' &&
    record.validation?.passed === true &&
    Boolean(source?.publicationEligible) &&
    record.adminReviewRequired &&
    record.requiresExistingPublicationGates &&
    record.publicationEligible === false &&
    record.externalProductionApproved === false
  );
}
