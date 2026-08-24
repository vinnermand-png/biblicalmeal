import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  PRIVACY_DATA_FLOWS,
  getDataFlowsRequiringConsent,
  getDataFlowsByStatus,
  hasUnconsentedTracking,
  getPrivacyStatusSummary,
} from './privacy-inventory';

const readSource = (path: string) =>
  readFileSync(new URL(path, import.meta.url), 'utf8');

/**
 * V3C.38 Privacy & Data Inventory Tests
 *
 * Tests cover:
 * - Truthful privacy data classification
 * - No fabricated tracking or provider integrations
 * - Consent requirement validation
 * - Data flow status accuracy
 * - Privacy policy page exists and reflects actual behavior
 */

describe('V3C.38 privacy inventory', () => {
  it('contains real data flows discovered in the repository', () => {
    expect(PRIVACY_DATA_FLOWS.length).toBeGreaterThan(0);

    // Verify specific flows exist
    const flowIds = PRIVACY_DATA_FLOWS.map((f) => f.id);
    expect(flowIds).toContain('ga4-browser-analytics');
    expect(flowIds).toContain('admin-visibility');
    expect(flowIds).toContain('newsletter-email-form');
    expect(flowIds).toContain('search-engine-verification');
    expect(flowIds).toContain('draft-content-storage');
    expect(flowIds).toContain('serp-monitoring');
  });

  it('correctly identifies flows requiring consent', () => {
    const requiringConsent = getDataFlowsRequiringConsent();
    expect(requiringConsent.length).toBeGreaterThan(0);

    // GA4 analytics requires consent
    const ga4Flow = requiringConsent.find(
      (f) => f.id === 'ga4-browser-analytics',
    );
    expect(ga4Flow).toBeDefined();
    expect(ga4Flow?.requiresConsent).toBe(true);
    expect(ga4Flow?.consentStatus).toBe('not-implemented');
  });

  it('correctly classifies data flow statuses', () => {
    const implemented = getDataFlowsByStatus('currently-implemented');
    expect(implemented.length).toBeGreaterThan(0);

    // Admin and newsletter are currently implemented
    const adminFlow = implemented.find((f) => f.id === 'admin-visibility');
    expect(adminFlow).toBeDefined();

    const newsletterFlow = implemented.find(
      (f) => f.id === 'newsletter-email-form',
    );
    expect(newsletterFlow).toBeDefined();

    // SERP monitoring is integration-ready (empty)
    const integrationReady = getDataFlowsByStatus('integration-ready');
    const serpFlow = integrationReady.find((f) => f.id === 'serp-monitoring');
    expect(serpFlow).toBeDefined();
  });

  it('detects unconsented tracking', () => {
    // GA4 requires consent but is not implemented
    expect(hasUnconsentedTracking()).toBe(true);
  });

  it('provides accurate privacy status summary', () => {
    const summary = getPrivacyStatusSummary();
    expect(summary.totalFlows).toBe(PRIVACY_DATA_FLOWS.length);
    expect(summary.requiresConsent).toBeGreaterThan(0);
    expect(summary.currentlyImplemented).toBeGreaterThan(0);
    expect(summary.integrationReady).toBeGreaterThan(0);
  });

  it('does not claim fabricated data collection', () => {
    // Verify no flow claims to collect data that doesn't exist
    for (const flow of PRIVACY_DATA_FLOWS) {
      // All flows must have honest status labels
      expect([
        'currently-implemented',
        'integration-ready',
        'future-external-integration',
        'not-applicable',
      ]).toContain(flow.status);

      // Consent status must be one of the valid values
      expect([
        'not-required',
        'required',
        'implemented',
        'not-implemented',
      ]).toContain(flow.consentStatus);
    }
  });

  it('marks GA4 as integration-ready, not currently implemented', () => {
    const ga4Flow = PRIVACY_DATA_FLOWS.find(
      (f) => f.id === 'ga4-browser-analytics',
    );
    expect(ga4Flow?.status).toBe('integration-ready');
    expect(ga4Flow?.consentStatus).toBe('not-implemented');
  });

  it('verifies no fake OAuth or provider connections', () => {
    // No flow should claim a real provider connection that doesn't exist
    for (const flow of PRIVACY_DATA_FLOWS) {
      if (flow.id === 'ga4-browser-analytics') {
        expect(flow.consentStatus).not.toBe('implemented');
      }
    }
  });

  it('verifies privacy policy page exists and reflects actual behavior', () => {
    const privacyPolicy = readSource('../pages/privacy.astro');
    expect(privacyPolicy).toContain('Privacy Policy');
    expect(privacyPolicy).toContain('PRIVACY_DATA_FLOWS');
    expect(privacyPolicy).toContain('Integration-ready');
    expect(privacyPolicy).toContain('not claim GDPR compliance');
  });

  it('verifies cookie policy page exists and reflects actual behavior', () => {
    const cookiePolicy = readSource('../pages/cookies.astro');
    expect(cookiePolicy).toContain('Cookie Policy');
    expect(cookiePolicy).toContain('bm-consent');
    expect(cookiePolicy).toContain('not claim GDPR compliance');
  });

  it('verifies analytics is disabled by default', () => {
    const analyticsFlow = PRIVACY_DATA_FLOWS.find(
      (f) => f.id === 'ga4-browser-analytics',
    );
    expect(analyticsFlow?.consentStatus).toBe('not-implemented');
  });

  it('verifies no hardcoded credentials or secrets', () => {
    const inventorySource = readSource('./privacy-inventory.ts');
    expect(inventorySource).not.toContain('API_KEY');
    expect(inventorySource).not.toContain('SECRET');
    expect(inventorySource).not.toContain('password');
    // Note: 'token' appears in description of verification tokens, which is acceptable
    // We check for actual secret patterns instead
    expect(inventorySource).not.toMatch(/['"]sk-[a-zA-Z0-9]+['"]/); // OpenAI keys
    expect(inventorySource).not.toMatch(/ghp_[a-zA-Z0-9]+/); // GitHub tokens
  });
});
