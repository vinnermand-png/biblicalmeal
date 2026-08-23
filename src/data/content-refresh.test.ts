import { describe, expect, it } from 'vitest';
import { SEO_TARGETS } from './seo-master-map';
import {
  auditContentRefreshSystem,
  CONTENT_REFRESH_CANDIDATES,
  CONTENT_REFRESH_RECORDS,
  getSerpRefreshContext,
  hasRealRefreshTrigger,
  isReadyForExistingPublicationGates,
  type ContentRefreshRecord,
} from './content-refresh';

describe('V3C.27 content refresh foundation', () => {
  it('derives refresh candidates from canonical existing SEO targets', () => {
    expect(CONTENT_REFRESH_CANDIDATES.map((candidate) => candidate.targetId)).toEqual(
      SEO_TARGETS.filter(
        (target) => target.status === 'published' || target.status === 'in-development',
      ).map((target) => target.id),
    );
    expect(auditContentRefreshSystem()).toEqual([]);
  });

  it('does not create refresh work or fake triggers without real observations', () => {
    expect(CONTENT_REFRESH_RECORDS).toEqual([]);
    const context = getSerpRefreshContext(CONTENT_REFRESH_CANDIDATES[0].targetId);
    expect(context.availability).toBe('future-source');
    expect(context.positionStatus).toBe('not-measured');
  });

  it('distinguishes missing data from observations and real triggers', () => {
    const target = CONTENT_REFRESH_CANDIDATES[0];
    const record: ContentRefreshRecord = {
      id: 'refresh-observation-example',
      targetId: target.targetId,
      canonicalRoute: target.canonicalRoute,
      status: 'triaged',
      reasons: [
        {
          type: 'serp-observation',
          evidenceState: 'missing-data',
          observedOn: '2026-08-24',
          summary: 'No imported measurement exists yet; this is not a refresh trigger.',
        },
        {
          type: 'editorial-observation',
          evidenceState: 'observation',
          observedOn: '2026-08-24',
          summary: 'Editorial review should determine whether a material change is needed.',
        },
      ],
      history: [
        {
          occurredOn: '2026-08-24',
          status: 'triaged',
          note: 'Recorded for review without changing content.',
        },
      ],
      requiresResearchGate: true,
      requiresAuthorityAndCitationReview: true,
      requiresEditorialReview: true,
      requiresExistingPublicationGate: true,
    };

    expect(hasRealRefreshTrigger(record)).toBe(false);
    expect(isReadyForExistingPublicationGates(record)).toBe(false);
    expect(auditContentRefreshSystem(CONTENT_REFRESH_CANDIDATES, [record])).toEqual([]);
  });

  it('requires a real trigger before publication-gate hand-off and rejects bypasses', () => {
    const target = CONTENT_REFRESH_CANDIDATES[0];
    const invalidRecord: ContentRefreshRecord = {
      id: 'refresh-invalid',
      targetId: target.targetId,
      canonicalRoute: target.canonicalRoute,
      status: 'ready-for-existing-publication-gates',
      reasons: [
        {
          type: 'research-update',
          evidenceState: 'observation',
          observedOn: '2026-08-24',
          summary: 'Needs research review, but no verified trigger is recorded.',
        },
      ],
      history: [
        {
          occurredOn: '2026-08-24',
          status: 'ready-for-existing-publication-gates',
          note: 'Invalid test state.',
        },
      ],
      requiresResearchGate: false,
      requiresAuthorityAndCitationReview: false,
      requiresEditorialReview: false,
      requiresExistingPublicationGate: false,
    };

    const issues = auditContentRefreshSystem(CONTENT_REFRESH_CANDIDATES, [invalidRecord]);
    expect(issues).toContain('Refresh record bypasses existing publication gates: refresh-invalid.');
    expect(issues).toContain(
      'Refresh record cannot reach publication hand-off without a real trigger: refresh-invalid.',
    );
  });
});
