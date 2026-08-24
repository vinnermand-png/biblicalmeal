import { describe, expect, it } from 'vitest';
import { SEO_TARGETS } from './seo-master-map';
import {
  auditMeasurementHistory,
  buildMeasurementDashboard,
  mapAnalyticsRows,
  type AnalyticsImportRow,
} from './analytics-measurement';
import {
  mapGoogleSearchConsoleRows,
  type GoogleSearchConsoleImportRow,
} from './search-console-integration';

const target = SEO_TARGETS.find(
  (item) => item.targetRoute === '/foods-of-the-bible/',
);
if (!target) throw new Error('Canonical SEO target fixture missing.');
const analyticsRow: AnalyticsImportRow = {
  date: '2026-08-24',
  page: target.targetRoute,
  sessions: 24,
  users: 18,
  pageviews: 31,
  events: 6,
};
const searchRow: GoogleSearchConsoleImportRow = {
  date: '2026-08-24',
  page: target.targetRoute,
  query: target.primaryKeyword,
  clicks: 7,
  impressions: 120,
  ctr: 7 / 120,
  position: 8.4,
};

describe('V3C.36 analytics measurement foundation', () => {
  it('maps valid analytics rows to existing canonical targets', () => {
    const result = mapAnalyticsRows([analyticsRow]);
    expect(result.rejectedRows).toEqual([]);
    expect(result.measurements[0]).toMatchObject({
      targetId: target.id,
      canonicalRoute: target.targetRoute,
      sessions: 24,
    });
  });
  it('keeps invalid and unknown analytics data out of canonical history', () => {
    const result = mapAnalyticsRows([
      { ...analyticsRow, page: '/unknown/' },
      { ...analyticsRow, sessions: -1 },
    ]);
    expect(result.measurements).toEqual([]);
    expect(result.rejectedRows.map((item) => item.reason)).toEqual([
      'unknown-canonical-route',
      'invalid-sessions',
    ]);
  });
  it('detects duplicate snapshots and preserves chronological ordering inputs', () => {
    const measurements = mapAnalyticsRows([
      { ...analyticsRow, date: '2026-08-23' },
      analyticsRow,
    ]).measurements;
    expect(measurements.map((item) => item.observedOn)).toEqual([
      '2026-08-23',
      '2026-08-24',
    ]);
    expect(
      auditMeasurementHistory([
        analyticsRowToMeasurement(),
        analyticsRowToMeasurement(),
      ]),
    ).toContain(`Duplicate analytics measurement: ${target.id}:2026-08-24.`);
  });
  it('joins Search Console, refresh and ranking context without fabricating metrics', () => {
    const searchSnapshots = mapGoogleSearchConsoleRows([searchRow]).snapshots;
    const analytics = mapAnalyticsRows([analyticsRow]).measurements;
    const item = buildMeasurementDashboard(searchSnapshots, analytics).find(
      (entry) => entry.targetId === target.id,
    );
    expect(item?.availability).toBe('measured');
    expect(item?.impressions).toBe(120);
    expect(item?.clicks).toBe(7);
    expect(item?.sessions).toBe(24);
    expect(item?.refreshCandidateId).toBeDefined();
    expect(item?.rankingCandidateId).toBeDefined();
  });
  it('does not turn empty inputs into fabricated performance metrics', () => {
    expect(buildMeasurementDashboard([])).toEqual([]);
  });
});

function analyticsRowToMeasurement() {
  return {
    targetId: target!.id,
    canonicalRoute: target!.targetRoute,
    observedOn: '2026-08-24',
    sessions: 24,
  };
}
