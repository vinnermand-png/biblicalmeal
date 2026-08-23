import { describe, expect, it } from 'vitest';
import { SEO_TARGETS } from './seo-master-map';
import {
  RANKING_OPTIMIZATION_CANDIDATES,
  RANKING_OPTIMIZATION_RECORDS,
  auditRankingOptimizationSystem,
  getRankingOptimizationContext,
  isReadyForExistingPublicationGates,
  type RankingOptimizationRecord,
} from './ranking-optimization';

const sampleTarget = SEO_TARGETS.find((target) => target.status !== 'not-pursuing')!;

function makeRecord(
  overrides: Partial<RankingOptimizationRecord> = {},
): RankingOptimizationRecord {
  return {
    id: 'test-ranking-optimization',
    targetId: sampleTarget.id,
    canonicalRoute: sampleTarget.targetRoute,
    status: 'identified',
    types: ['content'],
    evidence: [
      {
        state: 'observation',
        observedOn: '2026-08-24',
        summary: 'Editorial review observation requires investigation.',
      },
    ],
    history: [
      {
        occurredOn: '2026-08-24',
        status: 'identified',
        note: 'Record created for validation only.',
      },
    ],
    requiresResearchGate: true,
    requiresAuthorityAndCitationReview: true,
    requiresEditorialReview: true,
    requiresExistingPublicationGate: true,
    ...overrides,
  };
}

describe('V3C.28 ranking optimization foundation', () => {
  it('derives candidates from the canonical SEO targets', () => {
    expect(RANKING_OPTIMIZATION_CANDIDATES.length).toBe(
      SEO_TARGETS.filter((target) => target.status !== 'not-pursuing').length,
    );
  });

  it('does not fabricate optimization opportunities', () => {
    expect(RANKING_OPTIMIZATION_RECORDS).toHaveLength(0);
    expect(getRankingOptimizationContext(sampleTarget.id).serp.availability).toBe('future-source');
  });

  it('distinguishes an observation from a documented opportunity', () => {
    const observation = makeRecord();
    const handoffWithoutOpportunity = makeRecord({
      status: 'ready-for-existing-publication-gates',
    });
    const documentedOpportunity = makeRecord({
      status: 'ready-for-existing-publication-gates',
      evidence: [
        {
          state: 'opportunity',
          observedOn: '2026-08-24',
          summary: 'A documented optimization opportunity requires gated review.',
        },
      ],
    });

    expect(isReadyForExistingPublicationGates(observation)).toBe(false);
    expect(isReadyForExistingPublicationGates(handoffWithoutOpportunity)).toBe(false);
    expect(isReadyForExistingPublicationGates(documentedOpportunity)).toBe(true);
  });

  it('preserves publication gates and rejects invalid records', () => {
    const invalid = makeRecord({
      requiresExistingPublicationGate: false,
      canonicalRoute: '/not-the-canonical-route/',
      status: 'ready-for-existing-publication-gates',
    });

    const issues = auditRankingOptimizationSystem(
      RANKING_OPTIMIZATION_CANDIDATES,
      [invalid],
    );

    expect(issues.some((issue) => issue.includes('does not match canonical target'))).toBe(true);
    expect(issues.some((issue) => issue.includes('bypasses existing publication gates'))).toBe(true);
    expect(issues.some((issue) => issue.includes('without a documented opportunity'))).toBe(true);
  });

  it('keeps V3C.26 and V3C.27 context connected without creating parallel targets', () => {
    const context = getRankingOptimizationContext(sampleTarget.id);

    expect(context.candidate?.canonicalRoute).toBe(sampleTarget.targetRoute);
    expect(context.refreshCandidate?.canonicalRoute).toBe(sampleTarget.targetRoute);
    expect(context.refreshRecords).toHaveLength(0);
  });
});
