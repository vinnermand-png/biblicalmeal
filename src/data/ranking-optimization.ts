import { SEO_TARGETS, type SeoTarget } from './seo-master-map';
import {
  getContentRefreshCandidate,
  getRefreshRecordsForTarget,
  getSerpRefreshContext,
  type ContentRefreshRecord,
} from './content-refresh';
import { type SerpSnapshot } from './serp-monitoring';

/**
 * V3C.28 canonical ranking optimization foundation.
 *
 * Optimization opportunities are evidence-bound work records derived from the
 * existing SEO targets, SERP monitoring and content refresh systems. This
 * module does not promise rankings, modify content, or publish changes.
 */

export type OptimizationEvidenceState =
  'missing-data' | 'observation' | 'signal' | 'opportunity';

export type OptimizationType =
  'content' | 'internal-linking' | 'metadata' | 'technical' | 'authority';

export type OptimizationStatus =
  | 'identified'
  | 'evidence-review'
  | 'research-required'
  | 'editorial-review'
  | 'ready-for-existing-publication-gates'
  | 'completed'
  | 'rejected';

export interface RankingOptimizationCandidate {
  targetId: SeoTarget['id'];
  canonicalRoute: string;
  topic: string;
  primaryKeyword: string;
  contentType: SeoTarget['contentType'];
  cluster: SeoTarget['cluster'];
}

export interface OptimizationEvidence {
  state: OptimizationEvidenceState;
  observedOn: string;
  summary: string;
  sourceReference?: string;
  relatedRefreshRecordId?: string;
}

export interface OptimizationHistoryEvent {
  occurredOn: string;
  status: OptimizationStatus;
  note: string;
}

export interface RankingOptimizationRecord {
  id: string;
  targetId: SeoTarget['id'];
  canonicalRoute: string;
  status: OptimizationStatus;
  types: readonly OptimizationType[];
  evidence: readonly OptimizationEvidence[];
  history: readonly OptimizationHistoryEvent[];
  relatedRefreshRecordIds?: readonly string[];
  requiresResearchGate: boolean;
  requiresAuthorityAndCitationReview: boolean;
  requiresEditorialReview: boolean;
  /** Invalid bypass attempts remain representable so the canonical audit can reject them. */
  requiresExistingPublicationGate: boolean;
}

export const RANKING_OPTIMIZATION_CANDIDATES: readonly RankingOptimizationCandidate[] =
  SEO_TARGETS.filter((target) => target.status !== 'not-pursuing').map(
    (target) => ({
      targetId: target.id,
      canonicalRoute: target.targetRoute,
      topic: target.topic,
      primaryKeyword: target.primaryKeyword,
      contentType: target.contentType,
      cluster: target.cluster,
    }),
  );

/**
 * Empty by design. A canonical SEO target and missing measurement data are not
 * themselves optimization opportunities. Records require documented evidence.
 */
export const RANKING_OPTIMIZATION_RECORDS: readonly RankingOptimizationRecord[] =
  [];

export function getRankingOptimizationCandidate(
  targetId: string,
): RankingOptimizationCandidate | undefined {
  return RANKING_OPTIMIZATION_CANDIDATES.find(
    (candidate) => candidate.targetId === targetId,
  );
}

export function getRankingOptimizationRecordsForTarget(
  targetId: string,
  records: readonly RankingOptimizationRecord[] = RANKING_OPTIMIZATION_RECORDS,
): readonly RankingOptimizationRecord[] {
  return records.filter((record) => record.targetId === targetId);
}

export function getRankingOptimizationContext(
  targetId: string,
  snapshots: readonly SerpSnapshot[] = [],
  refreshRecords: readonly ContentRefreshRecord[] = [],
) {
  return {
    candidate: getRankingOptimizationCandidate(targetId),
    serp: getSerpRefreshContext(targetId, snapshots),
    refreshCandidate: getContentRefreshCandidate(targetId),
    refreshRecords: getRefreshRecordsForTarget(targetId, refreshRecords),
  };
}

export function hasDocumentedOptimizationOpportunity(
  record: RankingOptimizationRecord,
): boolean {
  return record.evidence.some((entry) => entry.state === 'opportunity');
}

/**
 * This is a hand-off check only. Existing research, citation, editorial and
 * publication systems remain responsible for approving and publishing changes.
 */
export function isReadyForExistingPublicationGates(
  record: RankingOptimizationRecord,
): boolean {
  return (
    record.status === 'ready-for-existing-publication-gates' &&
    hasDocumentedOptimizationOpportunity(record) &&
    record.requiresExistingPublicationGate === true
  );
}

export function auditRankingOptimizationSystem(
  candidates: readonly RankingOptimizationCandidate[] = RANKING_OPTIMIZATION_CANDIDATES,
  records: readonly RankingOptimizationRecord[] = RANKING_OPTIMIZATION_RECORDS,
): string[] {
  const issues: string[] = [];
  const candidateIds = new Set<string>();
  const candidateRoutes = new Set<string>();
  const recordIds = new Set<string>();
  const knownEvidenceStates = new Set<OptimizationEvidenceState>([
    'missing-data',
    'observation',
    'signal',
    'opportunity',
  ]);

  for (const candidate of candidates) {
    if (!candidate.targetId.trim())
      issues.push('Missing canonical optimization target ID.');
    if (candidateIds.has(candidate.targetId)) {
      issues.push(
        `Duplicate canonical optimization target: ${candidate.targetId}.`,
      );
    }
    candidateIds.add(candidate.targetId);

    if (!candidate.canonicalRoute.startsWith('/')) {
      issues.push(
        `Optimization candidate route is not canonical: ${candidate.targetId}.`,
      );
    }
    if (candidateRoutes.has(candidate.canonicalRoute)) {
      issues.push(
        `Duplicate optimization candidate route: ${candidate.canonicalRoute}.`,
      );
    }
    candidateRoutes.add(candidate.canonicalRoute);
  }

  for (const record of records) {
    if (!record.id.trim())
      issues.push('Missing ranking optimization record ID.');
    if (recordIds.has(record.id)) {
      issues.push(`Duplicate ranking optimization record: ${record.id}.`);
    }
    recordIds.add(record.id);

    const candidate = getRankingOptimizationCandidate(record.targetId);
    if (!candidate || !candidateIds.has(record.targetId)) {
      issues.push(
        `Optimization record references unknown canonical target: ${record.id}.`,
      );
    } else if (record.canonicalRoute !== candidate.canonicalRoute) {
      issues.push(
        `Optimization record route does not match canonical target: ${record.id}.`,
      );
    }

    if (record.types.length === 0) {
      issues.push(
        `Optimization record has no optimization type: ${record.id}.`,
      );
    }
    if (record.evidence.length === 0) {
      issues.push(
        `Optimization record has no documented evidence: ${record.id}.`,
      );
    }
    if (record.history.length === 0) {
      issues.push(`Optimization record has no history: ${record.id}.`);
    }
    if (record.requiresExistingPublicationGate !== true) {
      issues.push(
        `Optimization record bypasses existing publication gates: ${record.id}.`,
      );
    }

    for (const evidence of record.evidence) {
      if (!knownEvidenceStates.has(evidence.state)) {
        issues.push(`Invalid optimization evidence state: ${record.id}.`);
      }
      if (!evidence.summary.trim()) {
        issues.push(
          `Optimization evidence is missing a summary: ${record.id}.`,
        );
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(evidence.observedOn)) {
        issues.push(
          `Optimization evidence date must be ISO calendar format: ${record.id}.`,
        );
      }
    }

    if (
      record.status === 'ready-for-existing-publication-gates' &&
      !hasDocumentedOptimizationOpportunity(record)
    ) {
      issues.push(
        `Optimization cannot reach publication hand-off without a documented opportunity: ${record.id}.`,
      );
    }
  }

  return issues;
}
