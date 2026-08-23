import { SEO_TARGETS, type SeoTarget } from './seo-master-map';

/**
 * V3C.26 ongoing SERP monitoring foundation.
 *
 * This module deliberately stores no synthetic rankings, clicks, impressions,
 * or positions. Canonical monitoring targets are derived from the existing SEO
 * master map, while measurement records remain explicitly source-bound.
 */

export type SerpMeasurementSource =
  | 'google-search-console'
  | 'serp-provider'
  | 'manual-verification';

export type SerpDataAvailability = 'measured' | 'missing' | 'future-source';

export type SerpMetricStatus =
  | 'not-measured'
  | 'improved'
  | 'declined'
  | 'stable'
  | 'newly-observed'
  | 'lost';

export interface SerpMonitoringTarget {
  targetId: SeoTarget['id'];
  canonicalRoute: string;
  primaryKeyword: string;
  secondaryKeywords: readonly string[];
  cluster: SeoTarget['cluster'];
  contentType: SeoTarget['contentType'];
  status: SeoTarget['status'];
}

export interface SerpMeasurement {
  source: SerpMeasurementSource;
  observedOn: string;
  query: string;
  canonicalRoute: string;
  position?: number;
  impressions?: number;
  clicks?: number;
  averageCtr?: number;
}

export interface SerpSnapshot {
  targetId: string;
  observedOn: string;
  source: SerpMeasurementSource;
  measurements: readonly SerpMeasurement[];
}

export interface SerpTargetStatus {
  targetId: string;
  availability: SerpDataAvailability;
  latestSnapshot?: SerpSnapshot;
  positionStatus: SerpMetricStatus;
  impressionStatus: SerpMetricStatus;
  clickStatus: SerpMetricStatus;
  notes?: string;
}

export const SERP_MONITORING_TARGETS: readonly SerpMonitoringTarget[] = SEO_TARGETS
  .filter((target) => target.status !== 'not-pursuing')
  .map((target) => ({
    targetId: target.id,
    canonicalRoute: target.targetRoute,
    primaryKeyword: target.primaryKeyword,
    secondaryKeywords: target.secondaryKeywords,
    cluster: target.cluster,
    contentType: target.contentType,
    status: target.status,
  }));

/**
 * Empty by design until an actual measurement source is connected or imported.
 * Future integrations may populate this with real source-attributed snapshots.
 */
export const SERP_SNAPSHOTS: readonly SerpSnapshot[] = [];

export function getSerpMonitoringTarget(targetId: string): SerpMonitoringTarget | undefined {
  return SERP_MONITORING_TARGETS.find((target) => target.targetId === targetId);
}

export function getLatestSerpSnapshot(
  targetId: string,
  snapshots: readonly SerpSnapshot[] = SERP_SNAPSHOTS,
): SerpSnapshot | undefined {
  return snapshots
    .filter((snapshot) => snapshot.targetId === targetId)
    .sort((a, b) => b.observedOn.localeCompare(a.observedOn))[0];
}

export function getSerpTargetStatus(
  targetId: string,
  snapshots: readonly SerpSnapshot[] = SERP_SNAPSHOTS,
): SerpTargetStatus {
  const latestSnapshot = getLatestSerpSnapshot(targetId, snapshots);

  if (!latestSnapshot) {
    return {
      targetId,
      availability: 'future-source',
      positionStatus: 'not-measured',
      impressionStatus: 'not-measured',
      clickStatus: 'not-measured',
      notes: 'No real SERP or Search Console measurement has been imported yet.',
    };
  }

  return {
    targetId,
    availability: 'measured',
    latestSnapshot,
    positionStatus: 'stable',
    impressionStatus: 'stable',
    clickStatus: 'stable',
  };
}

export function auditSerpMonitoring(
  targets: readonly SerpMonitoringTarget[] = SERP_MONITORING_TARGETS,
  snapshots: readonly SerpSnapshot[] = SERP_SNAPSHOTS,
): string[] {
  const issues: string[] = [];
  const targetIds = new Set<string>();
  const routes = new Set<string>();

  for (const target of targets) {
    if (!target.targetId.trim()) issues.push('Missing canonical SEO target ID.');
    if (targetIds.has(target.targetId)) issues.push(`Duplicate SERP target ID: ${target.targetId}.`);
    targetIds.add(target.targetId);

    if (!target.canonicalRoute.startsWith('/')) {
      issues.push(`SERP target route is not canonical: ${target.targetId}.`);
    }
    if (routes.has(target.canonicalRoute)) {
      issues.push(`Duplicate SERP target route: ${target.canonicalRoute}.`);
    }
    routes.add(target.canonicalRoute);
  }

  for (const snapshot of snapshots) {
    if (!targetIds.has(snapshot.targetId)) {
      issues.push(`Snapshot references unknown SEO target: ${snapshot.targetId}.`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(snapshot.observedOn)) {
      issues.push(`Snapshot date must be ISO calendar format: ${snapshot.targetId}.`);
    }
    for (const measurement of snapshot.measurements) {
      if (measurement.canonicalRoute !== getSerpMonitoringTarget(snapshot.targetId)?.canonicalRoute) {
        issues.push(`Measurement route does not match canonical target: ${snapshot.targetId}.`);
      }
      if (!measurement.query.trim()) {
        issues.push(`Measurement query is missing: ${snapshot.targetId}.`);
      }
      if (measurement.position !== undefined && measurement.position <= 0) {
        issues.push(`Position must be greater than zero: ${snapshot.targetId}.`);
      }
      if (measurement.impressions !== undefined && measurement.impressions < 0) {
        issues.push(`Impressions cannot be negative: ${snapshot.targetId}.`);
      }
      if (measurement.clicks !== undefined && measurement.clicks < 0) {
        issues.push(`Clicks cannot be negative: ${snapshot.targetId}.`);
      }
      if (
        measurement.averageCtr !== undefined &&
        (measurement.averageCtr < 0 || measurement.averageCtr > 1)
      ) {
        issues.push(`Average CTR must be between 0 and 1: ${snapshot.targetId}.`);
      }
    }
  }

  return issues;
}
