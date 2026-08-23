export interface SearchEngineVerificationConfig {
  google?: string;
  bing?: string;
}

function configuredVerificationValue(
  value: string | undefined,
): string | undefined {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

/**
 * Resolves optional search-engine ownership verification values without
 * introducing a second metadata source. Meta verification values are public
 * ownership challenges and are emitted only when a real deployment value exists.
 */
export function resolveSearchEngineVerification(
  config: SearchEngineVerificationConfig,
): SearchEngineVerificationConfig {
  return {
    google: configuredVerificationValue(config.google),
    bing: configuredVerificationValue(config.bing),
  };
}

export const SEARCH_ENGINE_VERIFICATION = resolveSearchEngineVerification({
  google: import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION,
  bing: import.meta.env.PUBLIC_BING_SITE_VERIFICATION,
});
