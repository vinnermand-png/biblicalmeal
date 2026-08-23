import { SEO_TARGETS, type SeoTarget } from './seo-master-map';
import {
  getSerpTargetStatus,
  type SerpSnapshot,
  type SerpTargetStatus,
} from './serp-monitoring';

/**
 * V3C.27 canonical content refresh foundation.
 *
 * Refresh candidates are resolved from existing canonical SEO targets. This
 * module does not rewrite, edit, approve, or publish content. A refresh record
 * is a traceable request for work that must still pass the repository's
 * existing research, authority, citation, editorial, and publication gates.
 */

export type RefreshReasonType =
  | 'research-update'
  | 'citation-update'
  | 'authority-gap'
  | 'content-accuracy-observation'
  | 'editorial-observation'
  | 'internal-link-observation'
  | 'serp-observation';

export type RefreshEvidenceState = 'missing-data' | 'observation' | 'trigger';

export type RefreshStatus =
  | 'identified'
  | 'triaged'
  | 'research-required'
  | 'editorial-review'
  | 'ready-for-existing-publication-gates'
  | 'completed'
  | 'rejected';

export interface ContentRefreshCandidate {
  targetId: SeoTarget['id'];
  canonicalRoute: string;
  topic: string;
  contentType: SeoTarget['contentType'];
  seoStatus: SeoTarget['status'];
  cluster: SeoTarget['cluster'];
}

export interface RefreshReason {
  type: RefreshReasonType;
  evidenceState: RefreshEvidenceState;
  observedOn: string;
  summary: string;
  sourceReference?: string;
  relatedSerpTargetId?: string;
}

export interface RefreshHistoryEvent {
  occurredOn: string;
  status: RefreshStatus;
  note: string;
}

export interface ContentRefreshRecord {
  id: string;
  targetId: SeoTarget['id'];
  canonicalRoute: string;
  status: RefreshStatus;
  reasons: readonly RefreshReason[];
  history: readonly RefreshHistoryEvent[];
  relatedSerpTargetId?: string;
  requiresResearchGate: boolean;
  requiresAuthorityAndCitationReview: boolean;
  requiresEditorialReview: boolean;
  /**
   * The record may represent an invalid bypass attempt so the audit can reject
   * it. A valid hand-off still requires this to be true.
   */
  requiresExistingPublicationGate: boolean;
}

export const CONTENT_REFRESH_CANDIDATES: readonly ContentRefreshCandidate[] = SEO_TARGETS
  .filter((target) => target.status === 'published' || target.status === 'in-development')
  .map((target) => ({
    targetId: target.id,
    canonicalRoute: target.targetRoute,
    topic: target.topic,
    contentType: target.contentType,
    seoStatus: target.status,
    cluster: target.cluster,
  }));

/**
 * Empty by design. A candidate is not automatically a refresh task, and missing
 * SERP data is not a refresh trigger. Real observations must be recorded before
 * a canonical target receives a refresh record.
 */
export const CONTENT_REFRESH_RECORDS: readonly ContentRefreshRecord[] = [];

export function getContentRefreshCandidate(
  targetId: string,
): ContentRefreshCandidate | undefined {
  return CONTENT_REFRESH_CANDIDATES.find((candidate) => candidate.targetId === targetId);
}

export function getRefreshRecordsForTarget(
  targetId: string,
  records: readonly ContentRefreshRecord[] = CONTENT_REFRESH_RECORDS,
): readonly ContentRefreshRecord[] {
  return records.filter((record) => record.targetId === targetId);
}

export function getSerpRefreshContext(
  targetId: string,
  snapshots: readonly SerpSnapshot[] = [],
): SerpTargetStatus {
  return getSerpTargetStatus(targetId, snapshots);
}

export function hasRealRefreshTrigger(record: ContentRefreshRecord): boolean {
  return record.reasons.some((reason) => reason.evidenceState === 'trigger');
}

/**
 * This deliberately models hand-off only. It never approves publication; the
 * existing content lifecycle remains the sole publication authority.
 */
export function isReadyForExistingPublicationGates(record: ContentRefreshRecord): boolean {
  return (
    record.status === 'ready-for-existing-publication-gates' &&
    hasRealRefreshTrigger(record) &&
    record.requiresExistingPublicationGate === true
  );
}

export function auditContentRefreshSystem(
  candidates: readonly ContentRefreshCandidate[] = CONTENT_REFRESH_CANDIDATES,
  records: readonly ContentRefreshRecord[] = CONTENT_REFRESH_RECORDS,
): string[] {
  const issues: string[] = [];
  const candidateIds = new Set<string>();
  const candidateRoutes = new Set<string>();
  const recordIds = new Set<string>();

  for (const candidate of candidates) {
    if (!candidate.targetId.trim()) issues.push('Missing canonical refresh target ID.');
    if (candidateIds.has(candidate.targetId)) {
      issues.push(`Duplicate canonical refresh target: ${candidate.targetId}.`);
    }
    candidateIds.add(candidate.targetId);

    if (!candidate.canonicalRoute.startsWith('/')) {
      issues.push(`Refresh candidate route is not canonical: ${candidate.targetId}.`);
    }
    if (candidateRoutes.has(candidate.canonicalRoute)) {
      issues.push(`Duplicate refresh candidate route: ${candidate.canonicalRoute}.`);
    }
    candidateRoutes.add(candidate.canonicalRoute);
  }

  for (const record of records) {
    if (!record.id.trim()) issues.push('Missing content refresh record ID.');
    if (recordIds.has(record.id)) issues.push(`Duplicate content refresh record: ${record.id}.`);
    recordIds.add(record.id);

    const candidate = getContentRefreshCandidate(record.targetId);
    if (!candidate || !candidateIds.has(record.targetId)) {
      issues.push(`Refresh record references unknown canonical target: ${record.id}.`);
    } else if (record.canonicalRoute !== candidate.canonicalRoute) {
      issues.push(`Refresh record route does not match canonical target: ${record.id}.`);
    }

    if (record.reasons.length === 0) {
      issues.push(`Refresh record has no documented reason: ${record.id}.`);
    }
    if (record.history.length === 0) {
      issues.push(`Refresh record has no history: ${record.id}.`);
    }
    if (record.requiresExistingPublicationGate !== true) {
      issues.push(`Refresh record bypasses existing publication gates: ${record.id}.`);
    }

    for (const reason of record.reasons) {
      if (!reason.summary.trim()) issues.push(`Refresh reason is missing a summary: ${record.id}.`);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(reason.observedOn)) {
        issues.push(`Refresh reason date must be ISO calendar format: ${record.id}.`);
      }
      if (reason.relatedSerpTargetId && reason.relatedSerpTargetId !== record.targetId) {
        issues.push(`Refresh reason references a different SERP target: ${record.id}.`);
      }
    }

    if (
      record.status === 'ready-for-existing-publication-gates' &&
      !hasRealRefreshTrigger(record)
    ) {
      issues.push(`Refresh record cannot reach publication hand-off without a real trigger: ${record.id}.`);
    }
  }

  return issues;
}
