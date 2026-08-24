import { AI_EDITORIAL_IMAGE_ASSET_RECORDS } from '../ai-editorial-image/records';
import { AI_WEBSITE_CONTENT_RECORDS } from '../ai-website-content/records';
import { ARTICLE_CONTENT_RECORDS } from '../article-content/records';
import { AUTHORITY_RECORDS, CITATION_RECORDS } from '../authority/records';
import { duplicateInstagramSourceIds, validateInstagramContent } from './engine';
import { INSTAGRAM_CONTENT_RECORDS } from './records';
import type { InstagramContentRecord } from './types';

export type InstagramAuditCode =
  | 'duplicate-instagram-id'
  | 'duplicate-social-content-ownership'
  | 'missing-canonical-source'
  | 'invalid-source-reference'
  | 'invalid-image-relationship'
  | 'fabricated-citation-relationship'
  | 'fabricated-authority-relationship'
  | 'unsupported-claim'
  | 'unsupported-publication-readiness'
  | 'lifecycle-bypass'
  | 'unresolved-uncertainty'
  | 'invalid-published-separation';

export interface InstagramAuditIssue {
  code: InstagramAuditCode;
  id: string;
  message: string;
}

const articleIds = new Set(ARTICLE_CONTENT_RECORDS.map((record) => record.id));
const websiteIds = new Set(AI_WEBSITE_CONTENT_RECORDS.map((record) => record.id));
const imageIds = new Set(AI_EDITORIAL_IMAGE_ASSET_RECORDS.map((record) => record.id));
const citationIds = new Set(CITATION_RECORDS.map((record) => record.id));
const authorityIds = new Set(AUTHORITY_RECORDS.map((record) => record.id));

export function auditInstagramContent(
  records: readonly InstagramContentRecord[] = INSTAGRAM_CONTENT_RECORDS,
): readonly InstagramAuditIssue[] {
  const issues: InstagramAuditIssue[] = [];
  const ids = new Set<string>();
  const duplicateSourceIds = new Set(duplicateInstagramSourceIds(records));

  for (const record of records) {
    if (ids.has(record.id)) issues.push({ code: 'duplicate-instagram-id', id: record.id, message: 'Duplicate Instagram canonical ID.' });
    ids.add(record.id);
    if (duplicateSourceIds.has(record.id)) issues.push({ code: 'duplicate-social-content-ownership', id: record.id, message: 'Duplicate Instagram ownership for the same canonical website-content source and mode.' });

    if (record.canonicalSources.length === 0) issues.push({ code: 'missing-canonical-source', id: record.id, message: 'Social content must resolve to canonical source content.' });
    for (const source of record.canonicalSources) {
      if (source.kind === 'article-content' && !articleIds.has(source.id)) issues.push({ code: 'invalid-source-reference', id: record.id, message: `Unknown article source: ${source.id}` });
      if (source.kind === 'ai-website-content' && !websiteIds.has(source.id)) issues.push({ code: 'invalid-source-reference', id: record.id, message: `Unknown website-content source: ${source.id}` });
    }
    if (record.sourceWebsiteContentId && !websiteIds.has(record.sourceWebsiteContentId)) issues.push({ code: 'invalid-source-reference', id: record.id, message: 'Unknown canonical website-content relationship.' });
    if (record.sourceImageAssetIds.some((id) => !imageIds.has(id))) issues.push({ code: 'invalid-image-relationship', id: record.id, message: 'Unknown canonical editorial image relationship.' });
    if (record.citationReferences.some((id) => !citationIds.has(id))) issues.push({ code: 'fabricated-citation-relationship', id: record.id, message: 'Citation reference does not exist in the canonical citation registry.' });
    if (record.authorityReferences.some((id) => !authorityIds.has(id))) issues.push({ code: 'fabricated-authority-relationship', id: record.id, message: 'Authority reference does not exist in the canonical authority registry.' });

    const validation = validateInstagramContent(record);
    if (record.sourceWebsiteContentId && !validation.passed) {
      if (!validation.imageRelationshipValid) issues.push({ code: 'invalid-image-relationship', id: record.id, message: 'Image relationship is not bound to the same canonical website-content source.' });
      if (!validation.citationsTraceable) issues.push({ code: 'fabricated-citation-relationship', id: record.id, message: 'Citation relationship is not traceable through the canonical website source.' });
      if (!validation.authorityReferencesTraceable) issues.push({ code: 'fabricated-authority-relationship', id: record.id, message: 'Authority relationship is not traceable through canonical citations.' });
      if (!validation.noUnsupportedClaims) issues.push({ code: 'unsupported-claim', id: record.id, message: 'Factual social content lacks canonical unsupported-claim clearance.' });
      if (!validation.uncertaintyPreserved || !validation.disclosurePreserved) issues.push({ code: 'unresolved-uncertainty', id: record.id, message: 'Social content does not preserve uncertainty or disclosure boundaries.' });
    }

    if ((record.status === 'approved-for-external-production') !== record.externalProductionApproved) issues.push({ code: 'lifecycle-bypass', id: record.id, message: 'External production approval must match the canonical lifecycle state.' });
    if (record.publicationEligible || record.externalProductionApproved) issues.push({ code: 'unsupported-publication-readiness', id: record.id, message: 'Social content cannot claim publication or external production readiness without existing canonical gates.' });
    if (record.brief.uncertaintyBoundaries.length === 0 || record.brief.disclosureRequirements.length === 0) issues.push({ code: 'unresolved-uncertainty', id: record.id, message: 'Social content must preserve uncertainty and disclosure boundaries.' });
    if (record.status === 'approved-for-external-production' && record.publicationEligible === false) issues.push({ code: 'invalid-published-separation', id: record.id, message: 'External approval cannot bypass canonical publication readiness.' });
  }

  return issues;
}
