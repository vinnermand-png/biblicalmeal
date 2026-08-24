/**
 * V3C.38 Consent Architecture
 *
 * Canonical consent model for optional tracking (analytics, etc.).
 *
 * Requirements:
 * - Consent must be explicit
 * - Consent state must be inspectable
 * - Consent can be changed or withdrawn
 * - Consent must distinguish necessary functionality from optional tracking
 * - Optional tracking must not be treated as automatically consented to
 * - Default behavior must be privacy-safe (no tracking)
 *
 * Storage:
 * - Consent state is stored in localStorage under 'bm-consent'
 * - No server-side persistence (no fake database, no fake consent records)
 */

/**
 * Consent categories.
 * - 'necessary': Required for site functionality (always allowed, no consent needed)
 * - 'analytics': Optional browser analytics tracking (GA4)
 */
export type ConsentCategory = 'necessary' | 'analytics';

export interface ConsentState {
  /** Whether the user has made a choice (false = not yet asked) */
  hasChosen: boolean;
  /** Analytics tracking consent */
  analytics: boolean;
  /** Timestamp of last consent change */
  timestamp: number;
}

/**
 * Default consent state: privacy-safe, no tracking.
 */
export const DEFAULT_CONSENT: ConsentState = {
  hasChosen: false,
  analytics: false,
  timestamp: 0,
};

const CONSENT_STORAGE_KEY = 'bm-consent';

/**
 * Valid consent state shape check.
 */
export function isValidConsentState(value: unknown): value is ConsentState {
  if (typeof value !== 'object' || value === null) return false;
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.hasChosen === 'boolean' &&
    typeof obj.analytics === 'boolean' &&
    typeof obj.timestamp === 'number'
  );
}

/**
 * Get consent state from localStorage.
 * Returns default (privacy-safe) state if not found or invalid.
 * Client-side only - returns default on server.
 */
export function getConsentState(): ConsentState {
  if (typeof window === 'undefined') return DEFAULT_CONSENT;

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return DEFAULT_CONSENT;

    const parsed: unknown = JSON.parse(stored);
    if (!isValidConsentState(parsed)) return DEFAULT_CONSENT;

    return parsed;
  } catch {
    return DEFAULT_CONSENT;
  }
}

/**
 * Save consent state to localStorage.
 * Client-side only - no-op on server.
 */
export function setConsentState(state: ConsentState): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable or full - fail silently
  }
}

/**
 * Accept analytics consent.
 */
export function acceptAnalyticsConsent(): ConsentState {
  const state: ConsentState = {
    hasChosen: true,
    analytics: true,
    timestamp: Date.now(),
  };
  setConsentState(state);
  return state;
}

/**
 * Reject/withdraw analytics consent.
 */
export function rejectAnalyticsConsent(): ConsentState {
  const state: ConsentState = {
    hasChosen: true,
    analytics: false,
    timestamp: Date.now(),
  };
  setConsentState(state);
  return state;
}

/**
 * Check if analytics consent is granted.
 */
export function hasAnalyticsConsent(): boolean {
  return getConsentState().analytics === true;
}

/**
 * Clear all consent state (reset to default).
 */
export function clearConsentState(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
  } catch {
    // fail silently
  }
}

/**
 * Check if a specific category requires consent.
 */
export function categoryRequiresConsent(category: ConsentCategory): boolean {
  return category === 'analytics';
}

/**
 * Get all categories requiring consent.
 */
export function getConsentRequiredCategories(): ConsentCategory[] {
  return ['analytics'];
}
