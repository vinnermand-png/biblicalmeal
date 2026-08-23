export interface AnalyticsConfig {
  measurementId?: string;
}

export interface ResolvedAnalyticsConfig {
  enabled: boolean;
  measurementId?: string;
}

const PLACEHOLDER_VALUES = new Set([
  'YOUR_GA_MEASUREMENT_ID',
  'GA_MEASUREMENT_ID',
  'G-XXXXXXXXXX',
  'EXAMPLE',
  'PLACEHOLDER',
  'TODO',
  'REPLACE_ME',
]);

function normalizeMeasurementId(value: string | undefined): string | undefined {
  const normalized = value?.trim().toUpperCase();

  if (!normalized || PLACEHOLDER_VALUES.has(normalized)) {
    return undefined;
  }

  return /^G-[A-Z0-9]{6,20}$/.test(normalized) ? normalized : undefined;
}

/**
 * Resolves optional GA4 configuration. Analytics remains disabled unless a
 * valid-looking deployment measurement ID is explicitly configured.
 */
export function resolveAnalytics(
  config: AnalyticsConfig,
): ResolvedAnalyticsConfig {
  const measurementId = normalizeMeasurementId(config.measurementId);

  return measurementId ? { enabled: true, measurementId } : { enabled: false };
}

export const ANALYTICS = resolveAnalytics({
  measurementId: import.meta.env.PUBLIC_GA_MEASUREMENT_ID,
});
