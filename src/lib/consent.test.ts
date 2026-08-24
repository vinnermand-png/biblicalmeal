import { describe, expect, it } from 'vitest';
import {
  DEFAULT_CONSENT,
  type ConsentState,
  categoryRequiresConsent,
  getConsentRequiredCategories,
  isValidConsentState,
} from './consent';

/**
 * V3C.38 Consent Architecture Tests
 *
 * Tests cover:
 * - Privacy-safe default consent state
 * - Consent category validation
 * - Invalid consent value handling
 * - Consent requirement checks
 */

describe('V3C.38 consent architecture', () => {
  it('defaults to privacy-safe state (no tracking)', () => {
    expect(DEFAULT_CONSENT.hasChosen).toBe(false);
    expect(DEFAULT_CONSENT.analytics).toBe(false);
    expect(DEFAULT_CONSENT.timestamp).toBe(0);
  });

  it('marks analytics as requiring consent', () => {
    expect(categoryRequiresConsent('analytics')).toBe(true);
  });

  it('marks necessary as not requiring consent', () => {
    expect(categoryRequiresConsent('necessary')).toBe(false);
  });

  it('returns only analytics as consent-required category', () => {
    const required = getConsentRequiredCategories();
    expect(required).toEqual(['analytics']);
  });

  it('rejects invalid consent state shapes', () => {
    expect(isValidConsentState(null)).toBe(false);
    expect(isValidConsentState(undefined)).toBe(false);
    expect(isValidConsentState('string')).toBe(false);
    expect(isValidConsentState(123)).toBe(false);
    expect(isValidConsentState({})).toBe(false);
    expect(isValidConsentState({ hasChosen: 'yes' })).toBe(false);
    expect(isValidConsentState({ hasChosen: true, analytics: 'yes' })).toBe(
      false,
    );
    expect(
      isValidConsentState({
        hasChosen: true,
        analytics: true,
        timestamp: 'now',
      }),
    ).toBe(false);
  });

  it('accepts valid consent state shapes', () => {
    const valid: ConsentState = {
      hasChosen: true,
      analytics: false,
      timestamp: Date.now(),
    };
    expect(isValidConsentState(valid)).toBe(true);

    const accepted: ConsentState = {
      hasChosen: true,
      analytics: true,
      timestamp: Date.now(),
    };
    expect(isValidConsentState(accepted)).toBe(true);
  });
});
