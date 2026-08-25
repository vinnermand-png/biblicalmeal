import { describe, expect, it } from 'vitest';
import { SEO_TARGETS } from './seo-master-map';
import {
  auditSerpMonitoring,
  getLatestSerpSnapshot,
  getSerpTargetStatus,
  SERP_MONITORING_TARGETS,
  SERP_SNAPSHOTS,
  type SerpSnapshot,
} from './serp-monitoring';

describe('V3C.26 ongoing SERP monitoring foundation', () => {
  it('derives canonical monitoring targets from the existing SEO master map', () => {
    expect(SERP_MONITORING_TARGETS.map((target) => target.targetId)).toEqual(
      SEO_TARGETS.filter((target) => target.status !== 'not-pursuing').map(
        (target) => target.id,
      ),
    );
    expect(auditSerpMonitoring()).toEqual([]);
  });

  it('does not invent measurement data before a real source is connected', () => {
    expect(SERP_SNAPSHOTS).toEqual([]);
    const status = getSerpTargetStatus(SERP_MONITORING_TARGETS[0].targetId);
    expect(status).toMatchObject({
      availability: 'future-source',
      positionStatus: 'not-measured',
      impressionStatus: 'not-measured',
      clickStatus: 'not-measured',
    });
  });

  it('accepts source-attributed snapshots without requiring every metric to exist', () => {
    const target = SERP_MONITORING_TARGETS[0];
    const snapshots: SerpSnapshot[] = [
      {
        targetId: target.targetId,
        observedOn: '2026-08-23',
        source: 'google-search-console',
        measurements: [
          {
            source: 'google-search-console',
            observedOn: '2026-08-23',
            query: target.primaryKeyword,
            canonicalRoute: target.canonicalRoute,
            impressions: 0,
          },
        ],
      },
    ];

    expect(auditSerpMonitoring(SERP_MONITORING_TARGETS, snapshots)).toEqual([]);
    expect(getLatestSerpSnapshot(target.targetId, snapshots)).toBe(
      snapshots[0],
    );
    expect(getSerpTargetStatus(target.targetId, snapshots).availability).toBe(
      'measured',
    );
  });

  it('rejects synthetic-looking invalid values and unknown target references', () => {
    const target = SERP_MONITORING_TARGETS[0];
    const snapshots: SerpSnapshot[] = [
      {
        targetId: 'unknown-target',
        observedOn: '23-08-2026',
        source: 'serp-provider',
        measurements: [
          {
            source: 'serp-provider',
            observedOn: '2026-08-23',
            query: '',
            canonicalRoute: target.canonicalRoute,
            position: 0,
            impressions: -1,
            clicks: -1,
            averageCtr: 2,
          },
        ],
      },
    ];

    const issues = auditSerpMonitoring(SERP_MONITORING_TARGETS, snapshots);
    expect(issues).toContain(
      'Snapshot references unknown SEO target: unknown-target.',
    );
    expect(issues).toContain(
      'Snapshot date must be ISO calendar format: unknown-target.',
    );
    expect(issues).toContain('Measurement query is missing: unknown-target.');
    expect(issues).toContain(
      'Position must be greater than zero: unknown-target.',
    );
    expect(issues).toContain('Impressions cannot be negative: unknown-target.');
    expect(issues).toContain('Clicks cannot be negative: unknown-target.');
    expect(issues).toContain(
      'Average CTR must be between 0 and 1: unknown-target.',
    );
  });
});
