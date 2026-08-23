import { ARTICLE_CONTENT_RECORDS } from '../article-content/records';
import { INSTAGRAM_CONTENT_RECORDS } from './records';
import type { InstagramContentRecord } from './types';

export type InstagramAuditCode =
  | 'duplicate-instagram-id'
  | 'missing-canonical-source'
  | 'invalid-source-reference'
  | 'fabricated-citation-relationship'
  | 'fabricated-authority-relationship'
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

export function auditInstagramContent(
  records: readonly InstagramContentRecord[] = INSTAGRAM_CONTENT_RECORDS,
): readonly InstagramAuditIssue[] {
  const issues: InstagramAuditIssue[] = [];
  const ids = new Set<string>();

  for (const record of records) {
    if (ids.has(record.id)) issues.push({ code: 'duplicate-instagram-id', id: record.id, message: 'Duplicate Instagram canonical ID.' });
    ids.add(record.id);

    if (record.canonicalSources.length === 0) {
      issues.push({ code: 'missing-canonical-source', id: record.id, message: 'Social content must resolve to canonical source content.' });
    }
    for (const source of record.canonicalSources) {
      if (source.kind === 'article-content' && !articleIds.has(source.id)) {
        issues.push({ code: 'invalid-source-reference', id: record.id, message: `Unknown canonical source: ${source.id}` });
      }
    }

    if (record.citationReferences.length > 0) {
      issues.push({ code: 'fabricated-citation-relationship', id: record.id, message: 'V3C.32 seed records may not declare citation references without canonical citation mapping.' });
    }
    if (record.authorityReferences.length > 0) {
      issues.push({ code: 'fabricated-authority-relationship', id: record.id, message: 'V3C.32 seed records may not declare authority references without canonical authority mapping.' });
    }
    if ((record.status === 'approved-for-external-production') !== record.externalProductionApproved) {
      issues.push({ code: 'lifecycle-bypass', id: record.id, message: 'External production approval must match the canonical lifecycle state.' });
    }
    if (record.publicationEligible || record.externalProductionApproved) {
      issues.push({ code: 'unsupported-publication-readiness', id: record.id, message: 'V3C.32 seed records are not approved for external production or publication.' });
    }
    if (record.brief.uncertaintyBoundaries.length === 0 || record.brief.disclosureRequirements.length === 0) {
      issues.push({ code: 'unresolved-uncertainty', id: record.id, message: 'Social content must preserve uncertainty and disclosure boundaries.' });
    }
    if (record.status === 'approved-for-external-production' && record.publicationEligible === false) {
      issues.push({ code: 'invalid-published-separation', id: record.id, message: 'External approval cannot bypass canonical publication readiness.' });
    }
  }

  return issues;
}
