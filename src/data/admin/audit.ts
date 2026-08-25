import { ADMIN_OVERVIEW } from './overview';
import type { AdminOverview } from './types';

export type AdminAuditCode =
  | 'duplicate-workflow-item'
  | 'missing-canonical-id'
  | 'invalid-published-state'
  | 'missing-blocker-for-ineligible-item'
  | 'conflicting-relationship';

export interface AdminAuditIssue {
  code: AdminAuditCode;
  id: string;
  message: string;
}

export function auditAdminOverview(
  overview: AdminOverview = ADMIN_OVERVIEW,
): readonly AdminAuditIssue[] {
  const issues: AdminAuditIssue[] = [];
  const ids = new Set<string>();

  for (const item of overview.workflowItems) {
    const canonicalKey = `${item.kind}:${item.id}`;
    if (!item.id.trim()) {
      issues.push({
        code: 'missing-canonical-id',
        id: canonicalKey,
        message: 'Admin item is missing a canonical ID.',
      });
    }
    if (ids.has(canonicalKey)) {
      issues.push({
        code: 'duplicate-workflow-item',
        id: canonicalKey,
        message: 'Duplicate canonical admin item.',
      });
    }
    ids.add(canonicalKey);

    if (
      item.publicationState === 'public' &&
      item.publicationEligible !== true
    ) {
      issues.push({
        code: 'invalid-published-state',
        id: canonicalKey,
        message:
          'Admin view must not represent an ineligible record as public.',
      });
    }
    if (item.publicationEligible === false && item.blockers.length === 0) {
      issues.push({
        code: 'missing-blocker-for-ineligible-item',
        id: canonicalKey,
        message:
          'Ineligible workflow items must expose at least one canonical blocker.',
      });
    }
    if (new Set(item.relationships).size !== item.relationships.length) {
      issues.push({
        code: 'conflicting-relationship',
        id: canonicalKey,
        message: 'Admin item contains duplicate canonical relationships.',
      });
    }
  }

  return issues;
}
