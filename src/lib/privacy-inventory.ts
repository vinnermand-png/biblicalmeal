/**
 * V3C.38 Privacy & Data Inventory
 *
 * Canonical registry of all actual data flows in the BiblicalMeal repository.
 * This inventory is grounded in the real implementation and does not claim
 * data collection, processing, or integration that does not exist.
 *
 * Categories:
 * - currently-implemented: actively processing data now
 * - integration-ready: infrastructure exists but no data flows yet
 * - future-external-integration: planned but not implemented
 * - not-applicable: no data collection
 */

export type DataFlowStatus =
  | 'currently-implemented'
  | 'integration-ready'
  | 'future-external-integration'
  | 'not-applicable';

export type DataCategory =
  | 'analytics-measurement'
  | 'search-console-import'
  | 'admin-authentication'
  | 'admin-audit-history'
  | 'draft-content-persistence'
  | 'cookies-local-storage'
  | 'external-providers'
  | 'newsletter-email'
  | 'user-generated-content'
  | 'form-submissions';

export interface DataFlow {
  id: string;
  category: DataCategory;
  description: string;
  status: DataFlowStatus;
  /** What data is processed (empty if not-applicable or future). */
  dataElements: readonly string[];
  /** Where the data is stored or transmitted. */
  storage: string;
  /** Who has access. */
  access: string;
  /** Whether consent is required before processing. */
  requiresConsent: boolean;
  /** Current consent integration status. */
  consentStatus:
    'not-required' | 'required' | 'implemented' | 'not-implemented';
}

/**
 * Actual data flows discovered in the repository during V3C.38 audit.
 */
export const PRIVACY_DATA_FLOWS: readonly DataFlow[] = [
  // --- Currently implemented ---
  {
    id: 'ga4-browser-analytics',
    category: 'analytics-measurement',
    description:
      'Optional GA4 browser measurement script loaded in BaseLayout when analytics is enabled.',
    status: 'integration-ready',
    dataElements: [
      'page views (via gtag)',
      'browser events (via gtag)',
      'GA4 client ID (cookie _ga)',
      'GA4 session ID (cookie _ga)',
    ],
    storage: 'Google Analytics (external)',
    access: 'Google Analytics (external)',
    requiresConsent: true,
    consentStatus: 'not-implemented',
  },
  {
    id: 'admin-visibility',
    category: 'admin-audit-history',
    description:
      'Read-only admin overview page displaying canonical content status, workflow items, and system metrics.',
    status: 'currently-implemented',
    dataElements: [
      'workflow item status (public, not PII)',
      'publication readiness (public, not PII)',
      'canonical system metrics (public, not PII)',
    ],
    storage: 'Static build output (read-only)',
    access: 'Public (read-only, no authentication)',
    requiresConsent: false,
    consentStatus: 'not-required',
  },
  {
    id: 'newsletter-email-form',
    category: 'newsletter-email',
    description:
      'Demo newsletter subscription form accepting email input in browser. Email delivery is not connected.',
    status: 'currently-implemented',
    dataElements: ['email address (client-side only, not transmitted)'],
    storage: 'Client-side state only (not persisted)',
    access: 'Client-side only',
    requiresConsent: true,
    consentStatus: 'not-implemented',
  },
  {
    id: 'search-engine-verification',
    category: 'external-providers',
    description:
      'Optional ownership verification meta tags for Google and Bing when configured.',
    status: 'integration-ready',
    dataElements: [
      'google-site-verification token (public)',
      'msvalidate.01 token (public)',
    ],
    storage: 'HTML meta tags (public)',
    access: 'Public',
    requiresConsent: false,
    consentStatus: 'not-required',
  },
  // --- Not applicable ---
  {
    id: 'draft-content-storage',
    category: 'draft-content-persistence',
    description:
      'MDX content files in the repository with workflow statuses. All content is static build output.',
    status: 'currently-implemented',
    dataElements: [
      'content frontmatter (public, not PII)',
      'workflow status (not PII)',
      'editorial notes (not PII)',
    ],
    storage: 'Static build output',
    access: 'Public (published) or none (draft)',
    requiresConsent: false,
    consentStatus: 'not-required',
  },
  {
    id: 'serp-monitoring',
    category: 'search-console-import',
    description:
      'Framework for importing SERP and Search Console data. No data imported yet.',
    status: 'integration-ready',
    dataElements: [
      'query rankings',
      'impressions',
      'clicks',
      'CTR (not imported)',
    ],
    storage: 'Repository data files (empty)',
    access: 'Admin read-only',
    requiresConsent: false,
    consentStatus: 'not-required',
  },
];

/**
 * Get all data flows requiring consent.
 */
export function getDataFlowsRequiringConsent(): readonly DataFlow[] {
  return PRIVACY_DATA_FLOWS.filter((flow) => flow.requiresConsent);
}

/**
 * Get data flows by status.
 */
export function getDataFlowsByStatus(
  status: DataFlowStatus,
): readonly DataFlow[] {
  return PRIVACY_DATA_FLOWS.filter((flow) => flow.status === status);
}

/**
 * Check if any optional tracking is currently active (requires consent but not implemented).
 */
export function hasUnconsentedTracking(): boolean {
  return PRIVACY_DATA_FLOWS.some(
    (flow) => flow.requiresConsent && flow.consentStatus === 'not-implemented',
  );
}

/**
 * Get a summary of privacy status for display.
 */
export function getPrivacyStatusSummary(): {
  totalFlows: number;
  requiresConsent: number;
  consentImplemented: number;
  currentlyImplemented: number;
  integrationReady: number;
  futureExternal: number;
} {
  return {
    totalFlows: PRIVACY_DATA_FLOWS.length,
    requiresConsent: getDataFlowsRequiringConsent().length,
    consentImplemented: PRIVACY_DATA_FLOWS.filter(
      (f) => f.consentStatus === 'implemented',
    ).length,
    currentlyImplemented: getDataFlowsByStatus('currently-implemented').length,
    integrationReady: getDataFlowsByStatus('integration-ready').length,
    futureExternal: getDataFlowsByStatus('future-external-integration').length,
  };
}
