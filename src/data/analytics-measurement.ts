import {
  GOOGLE_SEARCH_CONSOLE_SNAPSHOTS,
  getGoogleSearchConsoleOptimizationContext,
  type GoogleSearchConsoleDataAvailability,
} from './search-console-integration';
import type { SerpSnapshot } from './serp-monitoring';

/** V3C.36 canonical analytics and measurement foundation. */
export type MeasurementAvailability = GoogleSearchConsoleDataAvailability;
export type AnalyticsProviderStatus = 'not-configured' | 'import-ready' | 'connected';

export interface AnalyticsImportRow {
  date: string;
  page: string;
  sessions: number;
  users?: number;
  pageviews?: number;
  events?: number;
}

export interface AnalyticsTargetMeasurement {
  targetId: string;
  canonicalRoute: string;
  observedOn: string;
  sessions: number;
  users?: number;
  pageviews?: number;
  events?: number;
}

export interface AnalyticsImportResult {
  measurements: readonly AnalyticsTargetMeasurement[];
  rejectedRows: readonly AnalyticsImportRejection[];
}

export interface AnalyticsImportRejection {
  row: AnalyticsImportRow;
  reason: 'invalid-date' | 'unknown-canonical-route' | 'invalid-sessions' | 'invalid-users' | 'invalid-pageviews' | 'invalid-events';
}

export interface MeasurementDashboardItem {
  targetId: string;
  canonicalRoute: string;
  availability: MeasurementAvailability;
  observedOn?: string;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  averagePosition?: number;
  sessions?: number;
  users?: number;
  pageviews?: number;
  events?: number;
  refreshCandidateId?: string;
  rankingCandidateId?: string;
}

export const ANALYTICS_PROVIDER = {
  id: 'google-analytics',
  status: 'import-ready' as AnalyticsProviderStatus,
  note: 'No Google Analytics API credential or live property connection is configured. Real analytics exports may enter through the validated import boundary.',
} as const;

export const ANALYTICS_MEASUREMENTS: readonly AnalyticsTargetMeasurement[] = [];

function isDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function validMetric(value: number | undefined): boolean {
  return value === undefined || (Number.isFinite(value) && value >= 0);
}

export function mapAnalyticsRows(rows: readonly AnalyticsImportRow[]): AnalyticsImportResult {
  const measurements: AnalyticsTargetMeasurement[] = [];
  const rejectedRows: AnalyticsImportRejection[] = [];

  for (const row of rows) {
    if (!isDate(row.date)) { rejectedRows.push({ row, reason: 'invalid-date' }); continue; }
    const context = getGoogleSearchConsoleOptimizationContextByRoute(row.page);
    if (!context) { rejectedRows.push({ row, reason: 'unknown-canonical-route' }); continue; }
    if (!validMetric(row.sessions)) { rejectedRows.push({ row, reason: 'invalid-sessions' }); continue; }
    if (!validMetric(row.users)) { rejectedRows.push({ row, reason: 'invalid-users' }); continue; }
    if (!validMetric(row.pageviews)) { rejectedRows.push({ row, reason: 'invalid-pageviews' }); continue; }
    if (!validMetric(row.events)) { rejectedRows.push({ row, reason: 'invalid-events' }); continue; }
    measurements.push({ targetId: context.targetId, canonicalRoute: context.canonicalRoute, observedOn: row.date, sessions: row.sessions, users: row.users, pageviews: row.pageviews, events: row.events });
  }

  measurements.sort((a, b) => a.targetId.localeCompare(b.targetId) || a.observedOn.localeCompare(b.observedOn));
  return { measurements, rejectedRows };
}

function getGoogleSearchConsoleOptimizationContextByRoute(route: string) {
  const snapshotTarget = getGoogleSearchConsoleOptimizationContextByTargetRoute(route);
  return snapshotTarget?.target;
}

function getGoogleSearchConsoleOptimizationContextByTargetRoute(route: string) {
  for (const snapshot of GOOGLE_SEARCH_CONSOLE_SNAPSHOTS) {
    const context = getGoogleSearchConsoleOptimizationContext(snapshot.targetId);
    if (context.target?.canonicalRoute === route) return context;
  }
  return undefined;
}

export function buildMeasurementDashboard(
  searchConsoleSnapshots: readonly SerpSnapshot[] = GOOGLE_SEARCH_CONSOLE_SNAPSHOTS,
  analyticsMeasurements: readonly AnalyticsTargetMeasurement[] = ANALYTICS_MEASUREMENTS,
): readonly MeasurementDashboardItem[] {
  const targetIds = new Set<string>([
    ...searchConsoleSnapshots.map((snapshot) => snapshot.targetId),
    ...analyticsMeasurements.map((measurement) => measurement.targetId),
  ]);

  return [...targetIds].map((targetId) => {
    const context = getGoogleSearchConsoleOptimizationContext(targetId, searchConsoleSnapshots);
    const latestAnalytics = analyticsMeasurements
      .filter((measurement) => measurement.targetId === targetId)
      .sort((a, b) => b.observedOn.localeCompare(a.observedOn))[0];
    const latestSearch = context.searchConsole.latestSnapshot;
    const metrics = latestSearch?.measurements;
    const impressions = metrics?.reduce((sum, item) => sum + (item.impressions ?? 0), 0);
    const clicks = metrics?.reduce((sum, item) => sum + (item.clicks ?? 0), 0);
    const availability: MeasurementAvailability = latestSearch || latestAnalytics
      ? (context.searchConsole.availability === 'partial' ? 'partial' : 'measured')
      : (ANALYTICS_PROVIDER.status === 'connected' ? 'missing' : 'future-source');

    return {
      targetId,
      canonicalRoute: context.target?.canonicalRoute ?? latestAnalytics?.canonicalRoute ?? '',
      availability,
      observedOn: latestSearch?.observedOn ?? latestAnalytics?.observedOn,
      impressions,
      clicks,
      ctr: impressions && impressions > 0 && clicks !== undefined ? clicks / impressions : undefined,
      averagePosition: metrics && metrics.length > 0 ? metrics.reduce((sum, item) => sum + (item.position ?? 0), 0) / metrics.length : undefined,
      sessions: latestAnalytics?.sessions,
      users: latestAnalytics?.users,
      pageviews: latestAnalytics?.pageviews,
      events: latestAnalytics?.events,
      refreshCandidateId: context.refreshCandidate?.id,
      rankingCandidateId: context.rankingCandidate?.id,
    };
  }).sort((a, b) => a.canonicalRoute.localeCompare(b.canonicalRoute));
}

export function auditMeasurementHistory(
  measurements: readonly AnalyticsTargetMeasurement[] = ANALYTICS_MEASUREMENTS,
): string[] {
  const issues: string[] = [];
  const seen = new Set<string>();
  for (const measurement of measurements) {
    const key = `${measurement.targetId}:${measurement.observedOn}`;
    if (seen.has(key)) issues.push(`Duplicate analytics measurement: ${key}.`);
    seen.add(key);
    if (!isDate(measurement.observedOn)) issues.push(`Invalid analytics measurement date: ${measurement.targetId}.`);
    if (!validMetric(measurement.sessions) || !validMetric(measurement.users) || !validMetric(measurement.pageviews) || !validMetric(measurement.events)) issues.push(`Invalid analytics metric: ${measurement.targetId}.`);
  }
  return issues;
}
