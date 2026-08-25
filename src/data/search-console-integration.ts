import {
  getContentRefreshCandidate,
  getSerpRefreshContext,
} from './content-refresh';
import { getRankingOptimizationCandidate } from './ranking-optimization';
import {
  SERP_MONITORING_TARGETS,
  type SerpMeasurement,
  type SerpSnapshot,
} from './serp-monitoring';

/**
 * V3C.35 Google Search Console integration foundation.
 *
 * This module is deliberately provider-bound and import-ready. It does not
 * claim that a Google Search Console property, API credential, OAuth flow or
 * live measurement feed is configured. Canonical SEO ownership remains in
 * SEO_TARGETS through the V3C.26 monitoring targets.
 */

export type GoogleSearchConsoleProviderStatus =
  'not-configured' | 'import-ready' | 'connected';

export type GoogleSearchConsoleDataAvailability =
  'measured' | 'missing' | 'partial' | 'future-source';

export interface GoogleSearchConsoleImportRow {
  date: string;
  page: string;
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GoogleSearchConsoleImportResult {
  snapshots: readonly SerpSnapshot[];
  rejectedRows: readonly GoogleSearchConsoleImportRejection[];
}

export interface GoogleSearchConsoleImportRejection {
  row: GoogleSearchConsoleImportRow;
  reason:
    | 'invalid-date'
    | 'unknown-canonical-route'
    | 'invalid-query'
    | 'invalid-clicks'
    | 'invalid-impressions'
    | 'invalid-ctr'
    | 'invalid-position';
}

export interface GoogleSearchConsoleTargetStatus {
  targetId: string;
  canonicalRoute: string;
  availability: GoogleSearchConsoleDataAvailability;
  snapshotCount: number;
  latestSnapshot?: SerpSnapshot;
}

export const GOOGLE_SEARCH_CONSOLE_PROVIDER = {
  id: 'google-search-console',
  status: 'import-ready' as GoogleSearchConsoleProviderStatus,
  note: 'No Google Search Console API or account credential is configured in this repository. Real source data may be imported through the validated import boundary.',
} as const;

export const GOOGLE_SEARCH_CONSOLE_SNAPSHOTS: readonly SerpSnapshot[] = [];

function isIsoCalendarDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isFiniteNonNegative(value: number): boolean {
  return Number.isFinite(value) && value >= 0;
}

function isFinitePositive(value: number): boolean {
  return Number.isFinite(value) && value > 0;
}

function canonicalRouteForImport(page: string): string {
  if (!page.startsWith('/')) return page;
  return page;
}

export function getGoogleSearchConsoleTarget(targetId: string) {
  return SERP_MONITORING_TARGETS.find((target) => target.targetId === targetId);
}

export function mapGoogleSearchConsoleRows(
  rows: readonly GoogleSearchConsoleImportRow[],
): GoogleSearchConsoleImportResult {
  const measurementsByTargetAndDate = new Map<string, SerpMeasurement[]>();
  const rejectedRows: GoogleSearchConsoleImportRejection[] = [];

  for (const row of rows) {
    if (!isIsoCalendarDate(row.date)) {
      rejectedRows.push({ row, reason: 'invalid-date' });
      continue;
    }

    const canonicalRoute = canonicalRouteForImport(row.page);
    const target = SERP_MONITORING_TARGETS.find(
      (candidate) => candidate.canonicalRoute === canonicalRoute,
    );
    if (!target) {
      rejectedRows.push({ row, reason: 'unknown-canonical-route' });
      continue;
    }
    if (!row.query.trim()) {
      rejectedRows.push({ row, reason: 'invalid-query' });
      continue;
    }
    if (!isFiniteNonNegative(row.clicks)) {
      rejectedRows.push({ row, reason: 'invalid-clicks' });
      continue;
    }
    if (!isFiniteNonNegative(row.impressions)) {
      rejectedRows.push({ row, reason: 'invalid-impressions' });
      continue;
    }
    if (!Number.isFinite(row.ctr) || row.ctr < 0 || row.ctr > 1) {
      rejectedRows.push({ row, reason: 'invalid-ctr' });
      continue;
    }
    if (!isFinitePositive(row.position)) {
      rejectedRows.push({ row, reason: 'invalid-position' });
      continue;
    }

    const key = `${target.targetId}:${row.date}`;
    const measurements = measurementsByTargetAndDate.get(key) ?? [];
    measurements.push({
      source: 'google-search-console',
      observedOn: row.date,
      query: row.query,
      canonicalRoute: target.canonicalRoute,
      position: row.position,
      impressions: row.impressions,
      clicks: row.clicks,
      averageCtr: row.ctr,
    });
    measurementsByTargetAndDate.set(key, measurements);
  }

  const snapshots: SerpSnapshot[] = [];
  for (const [key, measurements] of measurementsByTargetAndDate) {
    const separatorIndex = key.lastIndexOf(':');
    const targetId = key.slice(0, separatorIndex);
    const observedOn = key.slice(separatorIndex + 1);
    snapshots.push({
      targetId,
      observedOn,
      source: 'google-search-console',
      measurements,
    });
  }

  snapshots.sort((a, b) => {
    const byTarget = a.targetId.localeCompare(b.targetId);
    return byTarget !== 0 ? byTarget : a.observedOn.localeCompare(b.observedOn);
  });

  return { snapshots, rejectedRows };
}

export function getGoogleSearchConsoleTargetStatus(
  targetId: string,
  snapshots: readonly SerpSnapshot[] = GOOGLE_SEARCH_CONSOLE_SNAPSHOTS,
): GoogleSearchConsoleTargetStatus {
  const target = getGoogleSearchConsoleTarget(targetId);
  if (!target) {
    return {
      targetId,
      canonicalRoute: '',
      availability: 'missing',
      snapshotCount: 0,
    };
  }

  const targetSnapshots = snapshots
    .filter(
      (snapshot) =>
        snapshot.targetId === targetId &&
        snapshot.source === 'google-search-console',
    )
    .sort((a, b) => b.observedOn.localeCompare(a.observedOn));

  if (targetSnapshots.length === 0) {
    return {
      targetId,
      canonicalRoute: target.canonicalRoute,
      availability:
        GOOGLE_SEARCH_CONSOLE_PROVIDER.status === 'connected'
          ? 'missing'
          : 'future-source',
      snapshotCount: 0,
    };
  }

  const hasPartialMeasurement = targetSnapshots.some((snapshot) =>
    snapshot.measurements.some(
      (measurement) =>
        measurement.position === undefined ||
        measurement.impressions === undefined ||
        measurement.clicks === undefined ||
        measurement.averageCtr === undefined,
    ),
  );

  return {
    targetId,
    canonicalRoute: target.canonicalRoute,
    availability: hasPartialMeasurement ? 'partial' : 'measured',
    snapshotCount: targetSnapshots.length,
    latestSnapshot: targetSnapshots[0],
  };
}

export function getGoogleSearchConsoleOptimizationContext(
  targetId: string,
  snapshots: readonly SerpSnapshot[] = GOOGLE_SEARCH_CONSOLE_SNAPSHOTS,
) {
  return {
    target: getGoogleSearchConsoleTarget(targetId),
    searchConsole: getGoogleSearchConsoleTargetStatus(targetId, snapshots),
    serp: getSerpRefreshContext(targetId, snapshots),
    refreshCandidate: getContentRefreshCandidate(targetId),
    rankingCandidate: getRankingOptimizationCandidate(targetId),
  };
}

export function auditGoogleSearchConsoleSnapshots(
  snapshots: readonly SerpSnapshot[] = GOOGLE_SEARCH_CONSOLE_SNAPSHOTS,
): string[] {
  const issues: string[] = [];
  const seenSnapshots = new Set<string>();

  for (const snapshot of snapshots) {
    if (snapshot.source !== 'google-search-console') continue;

    const target = getGoogleSearchConsoleTarget(snapshot.targetId);
    if (!target) {
      issues.push(
        `Google Search Console snapshot references unknown canonical target: ${snapshot.targetId}.`,
      );
      continue;
    }
    if (!isIsoCalendarDate(snapshot.observedOn)) {
      issues.push(
        `Google Search Console snapshot date is invalid: ${snapshot.targetId}.`,
      );
    }

    const key = `${snapshot.targetId}:${snapshot.observedOn}`;
    if (seenSnapshots.has(key)) {
      issues.push(`Duplicate Google Search Console snapshot: ${key}.`);
    }
    seenSnapshots.add(key);

    for (const measurement of snapshot.measurements) {
      if (measurement.canonicalRoute !== target.canonicalRoute) {
        issues.push(
          `Google Search Console measurement route does not match canonical target: ${snapshot.targetId}.`,
        );
      }
      if (!measurement.query.trim()) {
        issues.push(
          `Google Search Console measurement query is missing: ${snapshot.targetId}.`,
        );
      }
      if (!isFinitePositive(measurement.position ?? 0)) {
        issues.push(
          `Google Search Console position is invalid: ${snapshot.targetId}.`,
        );
      }
      if (!isFiniteNonNegative(measurement.impressions ?? Number.NaN)) {
        issues.push(
          `Google Search Console impressions are invalid: ${snapshot.targetId}.`,
        );
      }
      if (!isFiniteNonNegative(measurement.clicks ?? Number.NaN)) {
        issues.push(
          `Google Search Console clicks are invalid: ${snapshot.targetId}.`,
        );
      }
      if (
        !Number.isFinite(measurement.averageCtr) ||
        measurement.averageCtr === undefined ||
        measurement.averageCtr < 0 ||
        measurement.averageCtr > 1
      ) {
        issues.push(
          `Google Search Console CTR is invalid: ${snapshot.targetId}.`,
        );
      }
    }
  }

  return issues;
}
