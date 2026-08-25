import type { ExternalAuthorityOpportunity } from './types';

export interface ExternalAuthorityAuditIssue {
  opportunityId: string;
  message: string;
}

const CONTACT_STATES = new Set([
  'contacted',
  'replied',
  'relationship-established',
]);

export function auditExternalAuthorityOpportunities(
  opportunities: readonly ExternalAuthorityOpportunity[],
): ExternalAuthorityAuditIssue[] {
  const issues: ExternalAuthorityAuditIssue[] = [];
  const ids = new Set<string>();
  const domains = new Set<string>();

  for (const opportunity of opportunities) {
    if (!opportunity.id.trim())
      issues.push({
        opportunityId: opportunity.id,
        message: 'Missing canonical opportunity ID.',
      });
    if (ids.has(opportunity.id))
      issues.push({
        opportunityId: opportunity.id,
        message: 'Duplicate canonical opportunity ID.',
      });
    ids.add(opportunity.id);

    const domain = opportunity.domain.trim().toLowerCase();
    if (!domain || domain.includes('/') || domain.includes('://')) {
      issues.push({
        opportunityId: opportunity.id,
        message:
          'Domain must be a canonical host name without a protocol or path.',
      });
    }
    if (domains.has(domain))
      issues.push({
        opportunityId: opportunity.id,
        message: 'Duplicate outreach target domain.',
      });
    domains.add(domain);

    if (
      !opportunity.relevantSitePaths.length ||
      opportunity.relevantSitePaths.some((path) => !path.startsWith('/'))
    ) {
      issues.push({
        opportunityId: opportunity.id,
        message: 'Opportunity requires canonical relevant site paths.',
      });
    }

    if (
      opportunity.qualityAssessment === 'insufficient' &&
      opportunity.status !== 'rejected'
    ) {
      issues.push({
        opportunityId: opportunity.id,
        message:
          'Insufficient-quality targets must be rejected rather than progressed.',
      });
    }

    if (
      CONTACT_STATES.has(opportunity.status) &&
      !opportunity.contactHistory?.length
    ) {
      issues.push({
        opportunityId: opportunity.id,
        message: 'Contact lifecycle states require recorded contact history.',
      });
    }

    if (
      opportunity.status === 'rejected' &&
      !opportunity.rejectionReason?.trim()
    ) {
      issues.push({
        opportunityId: opportunity.id,
        message: 'Rejected targets require an explicit rejection reason.',
      });
    }

    if (opportunity.status === 'verified-mention-link') {
      if (
        opportunity.verificationState !== 'verified' ||
        !opportunity.verification
      ) {
        issues.push({
          opportunityId: opportunity.id,
          message:
            'Verified mentions or links require explicit verification evidence.',
        });
      }
    }

    if (
      opportunity.verificationState === 'verified' &&
      !opportunity.verification
    ) {
      issues.push({
        opportunityId: opportunity.id,
        message: 'Verified external results require a verification record.',
      });
    }

    if (
      opportunity.verification &&
      !/^https:\/\//.test(opportunity.verification.evidenceUrl)
    ) {
      issues.push({
        opportunityId: opportunity.id,
        message: 'Verification evidence must use an explicit HTTPS URL.',
      });
    }
  }

  return issues;
}

export function isExternalAuthorityOpportunityVerified(
  opportunity: ExternalAuthorityOpportunity,
): boolean {
  return (
    opportunity.status === 'verified-mention-link' &&
    opportunity.verificationState === 'verified' &&
    Boolean(opportunity.verification)
  );
}
