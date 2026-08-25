import { describe, expect, it } from 'vitest';
import {
  auditExternalAuthorityOpportunities,
  isExternalAuthorityOpportunityVerified,
} from './audit';
import type { ExternalAuthorityOpportunity } from './types';

const qualified: ExternalAuthorityOpportunity = {
  id: 'target-archive-example',
  domain: 'archive.example.org',
  targetName: 'Example Archive',
  category: 'library-or-archive',
  status: 'qualified',
  verificationState: 'unverified',
  relevance: 'Relevant to documented biblical food research.',
  qualityAssessment: 'high',
  qualityNotes:
    'Assessment recorded without invented traffic or domain metrics.',
  relevantSitePaths: ['/ingredients/figs'],
  discoveryNotes: 'Fixture only; not a real outreach target.',
};

describe('V3C.25 external authority opportunity foundation', () => {
  it('accepts a qualified but explicitly unverified opportunity', () => {
    expect(auditExternalAuthorityOpportunities([qualified])).toEqual([]);
    expect(isExternalAuthorityOpportunityVerified(qualified)).toBe(false);
  });

  it('rejects duplicate targets and invalid lifecycle progression', () => {
    const contacted = { ...qualified, status: 'contacted' as const };
    const issues = auditExternalAuthorityOpportunities([qualified, contacted]);
    expect(issues.map((issue) => issue.message)).toContain(
      'Duplicate canonical opportunity ID.',
    );
    expect(issues.map((issue) => issue.message)).toContain(
      'Duplicate outreach target domain.',
    );
    expect(issues.map((issue) => issue.message)).toContain(
      'Contact lifecycle states require recorded contact history.',
    );
  });

  it('never accepts an unverified mention or link as a verified result', () => {
    const claimed = {
      ...qualified,
      status: 'verified-mention-link' as const,
    };
    const issues = auditExternalAuthorityOpportunities([claimed]);
    expect(issues.map((issue) => issue.message)).toContain(
      'Verified mentions or links require explicit verification evidence.',
    );
    expect(isExternalAuthorityOpportunityVerified(claimed)).toBe(false);
  });

  it('accepts a verified result only with explicit external evidence', () => {
    const verified: ExternalAuthorityOpportunity = {
      ...qualified,
      status: 'verified-mention-link',
      verificationState: 'verified',
      verification: {
        observedOn: '2026-08-23',
        evidenceUrl: 'https://archive.example.org/resources/biblicalmeal',
        evidenceType: 'mention',
        notes:
          'Fixture evidence only; not a claim about a real external mention.',
      },
    };
    expect(auditExternalAuthorityOpportunities([verified])).toEqual([]);
    expect(isExternalAuthorityOpportunityVerified(verified)).toBe(true);
  });

  it('requires low-quality targets to stop and rejected targets to explain why', () => {
    const issues = auditExternalAuthorityOpportunities([
      { ...qualified, qualityAssessment: 'insufficient' },
      {
        ...qualified,
        id: 'rejected-target',
        domain: 'rejected.example.org',
        status: 'rejected',
      },
    ]);
    expect(issues.map((issue) => issue.message)).toContain(
      'Insufficient-quality targets must be rejected rather than progressed.',
    );
    expect(issues.map((issue) => issue.message)).toContain(
      'Rejected targets require an explicit rejection reason.',
    );
  });
});
