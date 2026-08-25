import { describe, expect, it } from 'vitest';
import { SEO_TARGETS } from './seo-master-map';
import {
  GOOGLE_SEARCH_CONSOLE_PROVIDER,
  auditGoogleSearchConsoleSnapshots,
  getGoogleSearchConsoleOptimizationContext,
  getGoogleSearchConsoleTargetStatus,
  mapGoogleSearchConsoleRows,
  type GoogleSearchConsoleImportRow,
} from './search-console-integration';

const sampleTarget = SEO_TARGETS.find(
  (target) => target.targetRoute === '/foods-of-the-bible/',
);

if (!sampleTarget) {
  throw new Error('Expected canonical SEO target fixture is missing.');
}

const validRow: GoogleSearchConsoleImportRow = {
  date: '2026-08-24',
  page: sampleTarget.targetRoute,
  query: sampleTarget.primaryKeyword,
  clicks: 7,
  impressions: 120,
  ctr: 7 / 120,
  position: 8.4,
};

describe('V3C.35 Google Search Console integration', () => {
  it('keeps the provider boundary import-ready without claiming a live connection', () => {
    expect(GOOGLE_SEARCH_CONSOLE_PROVIDER.status).toBe('import-ready');
    expect(GOOGLE_SEARCH_CONSOLE_PROVIDER.note).toContain(
      'No Google Search Console API',
    );
  });

  it('maps real-format import rows to existing canonical SERP targets', () => {
    const result = mapGoogleSearchConsoleRows([validRow]);

    expect(result.rejectedRows).toEqual([]);
    expect(result.snapshots).toHaveLength(1);
    expect(result.snapshots[0]).toMatchObject({
      targetId: sampleTarget.id,
      observedOn: validRow.date,
      source: 'google-search-console',
    });
    expect(result.snapshots[0].measurements[0]).toMatchObject({
      canonicalRoute: sampleTarget.targetRoute,
      query: validRow.query,
      clicks: validRow.clicks,
      impressions: validRow.impressions,
      averageCtr: validRow.ctr,
      position: validRow.position,
    });
  });

  it('keeps missing data explicit instead of fabricating SEO metrics', () => {
    const status = getGoogleSearchConsoleTargetStatus(sampleTarget.id);

    expect(status.availability).toBe('future-source');
    expect(status.snapshotCount).toBe(0);
    expect(status.latestSnapshot).toBeUndefined();
  });

  it('rejects invalid metrics and unknown canonical routes', () => {
    const result = mapGoogleSearchConsoleRows([
      { ...validRow, page: '/unknown-route/' },
      { ...validRow, query: '   ' },
      { ...validRow, clicks: -1 },
      { ...validRow, impressions: -1 },
      { ...validRow, ctr: 1.2 },
      { ...validRow, position: 0 },
    ]);

    expect(result.snapshots).toEqual([]);
    expect(result.rejectedRows.map((rejection) => rejection.reason)).toEqual([
      'unknown-canonical-route',
      'invalid-query',
      'invalid-clicks',
      'invalid-impressions',
      'invalid-ctr',
      'invalid-position',
    ]);
  });

  it('groups multiple query rows into one canonical target/date snapshot', () => {
    const result = mapGoogleSearchConsoleRows([
      validRow,
      {
        ...validRow,
        query: `${validRow.query} history`,
        clicks: 2,
        impressions: 30,
      },
    ]);

    expect(result.snapshots).toHaveLength(1);
    expect(result.snapshots[0].measurements).toHaveLength(2);
    expect(auditGoogleSearchConsoleSnapshots(result.snapshots)).toEqual([]);
  });

  it('rejects duplicate snapshots and unknown target references during audit', () => {
    const snapshot = mapGoogleSearchConsoleRows([validRow]).snapshots[0];
    const issues = auditGoogleSearchConsoleSnapshots([
      snapshot,
      snapshot,
      { ...snapshot, targetId: 'unknown-target' },
    ]);

    expect(issues).toContain(
      `Duplicate Google Search Console snapshot: ${sampleTarget.id}:${validRow.date}.`,
    );
    expect(issues).toContain(
      'Google Search Console snapshot references unknown canonical target: unknown-target.',
    );
  });

  it('connects imported measurement context to V3C.26, V3C.27 and V3C.28 without duplicate targets', () => {
    const snapshots = mapGoogleSearchConsoleRows([validRow]).snapshots;
    const context = getGoogleSearchConsoleOptimizationContext(
      sampleTarget.id,
      snapshots,
    );

    expect(context.target?.canonicalRoute).toBe(sampleTarget.targetRoute);
    expect(context.searchConsole.availability).toBe('measured');
    expect(context.serp.availability).toBe('measured');
    expect(context.refreshCandidate?.canonicalRoute).toBe(
      sampleTarget.targetRoute,
    );
    expect(context.rankingCandidate?.canonicalRoute).toBe(
      sampleTarget.targetRoute,
    );
  });
});
