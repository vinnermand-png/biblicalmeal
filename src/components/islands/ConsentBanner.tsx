import { useState } from 'react';
import {
  getConsentState,
  acceptAnalyticsConsent,
  rejectAnalyticsConsent,
  type ConsentState,
} from '../../lib/consent';

type BannerState = 'hidden' | 'show-choices' | 'show-manage';

/**
 * V3C.38 Consent Banner
 *
 * Privacy-safe consent UI for optional analytics tracking.
 * - Shows only if user hasn't made a choice yet
 * - Provides explicit Accept/Reject options
 * - Allows changing or withdrawing consent
 * - Default is privacy-safe (no tracking)
 * - No fake consent, no automatic tracking
 *
 * Note: This component is client-only (rendered with client:load).
 * On the server, it renders nothing. On the client, it checks
 * localStorage for consent state and shows the banner if needed.
 */

/**
 * Check if we're in the browser.
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get consent state safely (only on client).
 */
function getClientConsentState(): ConsentState | null {
  if (!isBrowser()) return null;
  return getConsentState();
}

/**
 * Determine initial banner state based on consent.
 */
function getInitialBannerState(consent: ConsentState | null): BannerState {
  if (!consent) return 'hidden';
  return consent.hasChosen ? 'hidden' : 'show-choices';
}

export default function ConsentBanner() {
  // Initialize state - null means not yet checked
  const [state, setState] = useState<ConsentState | null>(() =>
    getClientConsentState(),
  );
  const [bannerState, setBannerState] = useState<BannerState>(() =>
    getInitialBannerState(state),
  );

  const handleAccept = () => {
    const newState = acceptAnalyticsConsent();
    setState(newState);
    setBannerState('hidden');
  };

  const handleReject = () => {
    const newState = rejectAnalyticsConsent();
    setState(newState);
    setBannerState('hidden');
  };

  const handleManage = () => {
    setBannerState('show-manage');
  };

  const handleCloseManage = () => {
    setBannerState('hidden');
  };

  const handleWithdrawConsent = () => {
    const newState = rejectAnalyticsConsent();
    setState(newState);
    setBannerState('hidden');
  };

  // Don't render if not in browser or banner should be hidden
  if (!isBrowser() || bannerState === 'hidden') return null;

  if (bannerState === 'show-choices') {
    return (
      <div
        role="dialog"
        aria-label="Cookie consent"
        className="fixed right-0 bottom-0 left-0 z-50 border-t border-line bg-surface/95 p-4 shadow-lg backdrop-blur-sm sm:p-6"
      >
        <div className="mx-auto max-w-4xl">
          <p className="mb-4 text-body text-ink">
            We use optional analytics to understand how visitors use
            BiblicalMeal. No tracking occurs unless you consent.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAccept}
              type="button"
              className="rounded-full bg-terracotta px-6 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-terracotta-dark"
            >
              Accept Analytics
            </button>
            <button
              onClick={handleReject}
              type="button"
              className="rounded-full border border-line bg-surface px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:border-terracotta hover:text-terracotta-dark"
            >
              Reject
            </button>
            <button
              onClick={handleManage}
              type="button"
              className="rounded-full border border-line bg-surface px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:border-terracotta hover:text-terracotta-dark"
            >
              Manage Preferences
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (bannerState === 'show-manage') {
    return (
      <div
        role="dialog"
        aria-label="Cookie preferences"
        className="fixed right-0 bottom-0 left-0 z-50 border-t border-line bg-surface/95 p-4 shadow-lg backdrop-blur-sm sm:p-6"
      >
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-h3 text-ink">
              Cookie Preferences
            </h2>
            <button
              onClick={handleCloseManage}
              type="button"
              className="rounded-full border border-line p-2 text-ink transition-colors hover:border-terracotta hover:text-terracotta-dark"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-3">
              <span className="text-sm font-semibold text-ink">Necessary</span>
              <span className="rounded-full bg-olive/20 px-2 py-0.5 text-xs text-olive-dark">
                Always On
              </span>
            </div>
            <p className="text-caption text-ink-muted">
              Required for site functionality. No consent needed.
            </p>
          </div>
          <div className="mb-4">
            <div className="mb-2 flex items-center gap-3">
              <span className="text-sm font-semibold text-ink">Analytics</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  state?.analytics
                    ? 'bg-olive/20 text-olive-dark'
                    : 'bg-terracotta/10 text-terracotta-dark'
                }`}
              >
                {state?.analytics ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <p className="text-caption text-ink-muted">
              Optional browser analytics to understand how visitors use the
              site. No tracking unless you consent.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAccept}
              type="button"
              className="rounded-full bg-terracotta px-6 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-terracotta-dark"
            >
              {state?.analytics ? 'Keep Enabled' : 'Enable Analytics'}
            </button>
            <button
              onClick={handleWithdrawConsent}
              type="button"
              className="rounded-full border border-line bg-surface px-6 py-2.5 text-sm font-medium text-ink transition-colors hover:border-terracotta hover:text-terracotta-dark"
            >
              {state?.analytics ? 'Disable Analytics' : 'Keep Disabled'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
