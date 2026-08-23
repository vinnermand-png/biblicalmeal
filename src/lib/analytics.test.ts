import { readFileSync, readdirSync, statSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { PUBLIC_FOOD_CONTENT } from '../data/content/public';
import { resolveAnalytics } from './analytics';

const readRepositoryFile = (path: string) =>
  readFileSync(new URL(path, import.meta.url), 'utf8');

function listSourceFiles(path: URL): URL[] {
  return readdirSync(path).flatMap((entry) => {
    const entryUrl = new URL(entry, path);
    return statSync(entryUrl).isDirectory()
      ? listSourceFiles(new URL(`${entry}/`, path))
      : [entryUrl];
  });
}

describe('V3C.13 analytics readiness', () => {
  it('disables analytics when configuration is absent, empty, or whitespace-only', () => {
    expect(resolveAnalytics({})).toEqual({ enabled: false });
    expect(resolveAnalytics({ measurementId: '' })).toEqual({ enabled: false });
    expect(resolveAnalytics({ measurementId: '   ' })).toEqual({
      enabled: false,
    });
  });

  it('enables analytics only for a valid real-looking GA4 measurement ID', () => {
    expect(resolveAnalytics({ measurementId: ' g-ABC12345 ' })).toEqual({
      enabled: true,
      measurementId: 'G-ABC12345',
    });
    expect(resolveAnalytics({ measurementId: 'not-a-ga4-id' })).toEqual({
      enabled: false,
    });
  });

  it('rejects obvious placeholder values instead of emitting analytics', () => {
    for (const measurementId of [
      'YOUR_GA_MEASUREMENT_ID',
      'GA_MEASUREMENT_ID',
      'G-XXXXXXXXXX',
      'example',
      'placeholder',
    ]) {
      expect(resolveAnalytics({ measurementId })).toEqual({ enabled: false });
    }
  });

  it('keeps one centralized BaseLayout analytics integration and emits no route-level tracker', () => {
    const layout = readRepositoryFile('../layouts/BaseLayout.astro');
    const pageFiles = listSourceFiles(new URL('../pages/', import.meta.url));

    expect(layout).toContain("import { ANALYTICS } from '../lib/analytics';");
    expect(layout).toContain('const analyticsEnabled =');
    expect(layout).toContain('www.googletagmanager.com/gtag/js?id=');

    for (const pageFile of pageFiles) {
      expect(readFileSync(pageFile, 'utf8')).not.toContain(
        'googletagmanager.com/gtag',
      );
    }
  });

  it('emits no external analytics script when analytics is disabled', () => {
    const layout = readRepositoryFile('../layouts/BaseLayout.astro');

    expect(layout).toContain('analyticsEnabled && ANALYTICS.measurementId');
    expect(layout).toContain(
      'ANALYTICS.enabled && !noindex && !technicalFallback',
    );
  });

  it('keeps normal public pages independent of analytics configuration', () => {
    expect(PUBLIC_FOOD_CONTENT.map((item) => item.canonicalTargetId)).toEqual([
      'figs',
      'dates',
    ]);
    expect(PUBLIC_FOOD_CONTENT.every((item) => item.seo.indexable)).toBe(true);
  });

  it('protects noindex and technical fallback pages without changing V3C.11 behavior', () => {
    const layout = readRepositoryFile('../layouts/BaseLayout.astro');

    expect(layout).toContain('(noindex || technicalFallback)');
    expect(layout).toContain('!technicalFallback && <link rel="canonical"');
    expect(layout).toContain(
      'ANALYTICS.enabled && !noindex && !technicalFallback',
    );
  });

  it('preserves V3C.12 search-engine verification architecture', () => {
    const layout = readRepositoryFile('../layouts/BaseLayout.astro');
    const verification = readRepositoryFile('./search-engine-verification.ts');

    expect(layout).toContain(
      "import { SEARCH_ENGINE_VERIFICATION } from '../lib/search-engine-verification';",
    );
    expect(verification).toContain('PUBLIC_GOOGLE_SITE_VERIFICATION');
    expect(verification).toContain('PUBLIC_BING_SITE_VERIFICATION');
  });

  it('does not commit a real analytics ID or fabricate measurement data', () => {
    const envExample = readRepositoryFile('../../.env.example');
    const analyticsSource = readRepositoryFile('./analytics.ts');
    const docs = readRepositoryFile('../../docs/analytics-seo-measurement.md');
    const validatorLiteral = '/^G-[A-Z0-9]{6,20}$/';
    const quotedMeasurementIdPattern = /(['"`])(G-[A-Z0-9]{6,20})\1/g;
    const hardcodedMeasurementIds = [
      ...analyticsSource.matchAll(quotedMeasurementIdPattern),
    ]
      .map((match) => match[2])
      .filter((measurementId) => measurementId !== 'G-XXXXXXXXXX');

    expect(envExample).toContain('PUBLIC_GA_MEASUREMENT_ID=');
    expect(envExample).not.toMatch(/PUBLIC_GA_MEASUREMENT_ID=G-[A-Z0-9]{6,20}/);
    expect(analyticsSource).toContain(validatorLiteral);
    expect(hardcodedMeasurementIds).toEqual([]);
    expect(docs).toContain(
      'does not maintain an internal database of invented metrics',
    );
  });
});
