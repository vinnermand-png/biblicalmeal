import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { PUBLIC_FOOD_CONTENT } from '../data/content/public';
import { SITE } from '../config';
import {
  resolveSearchEngineVerification,
  type SearchEngineVerificationConfig,
} from './search-engine-verification';

const readRepositoryFile = (path: string) =>
  readFileSync(new URL(path, import.meta.url), 'utf8');

const productionSitemap = 'https://biblicalmeal.com/sitemap-index.xml';

describe('V3C.12 search-engine readiness', () => {
  it('keeps the canonical production URL authoritative', () => {
    expect(SITE.url).toBe('https://biblicalmeal.com');
  });

  it('keeps one canonical sitemap architecture on the production site URL', () => {
    const astroConfig = readRepositoryFile('../../astro.config.mjs');
    expect(astroConfig).toContain("site: 'https://biblicalmeal.com'");
    expect(astroConfig).toContain("from '@astrojs/sitemap'");
    expect(astroConfig).toContain('sitemap({');
  });

  it('keeps robots pointed at the canonical sitemap', () => {
    const robots = readRepositoryFile('../../public/robots.txt');
    const sitemapReferences = robots.match(/^Sitemap:/gm) ?? [];

    expect(sitemapReferences).toHaveLength(1);
    expect(robots).toContain(`Sitemap: ${productionSitemap}`);
  });

  it('omits verification metadata when no real value is configured', () => {
    expect(resolveSearchEngineVerification({})).toEqual({
      google: undefined,
      bing: undefined,
    });
    expect(
      resolveSearchEngineVerification({ google: '   ', bing: '' }),
    ).toEqual({
      google: undefined,
      bing: undefined,
    });
  });

  it('emits only configured verification values and never invents placeholders', () => {
    const configured: SearchEngineVerificationConfig = {
      google: 'google-issued-value',
      bing: 'bing-issued-value',
    };

    expect(resolveSearchEngineVerification(configured)).toEqual(configured);
    expect(resolveSearchEngineVerification({ google: ' real-value ' })).toEqual({
      google: 'real-value',
      bing: undefined,
    });
  });

  it('keeps verification metadata centralized and protected on technical fallbacks', () => {
    const layout = readRepositoryFile('../layouts/BaseLayout.astro');

    expect(layout).toContain(
      "import { SEARCH_ENGINE_VERIFICATION } from '../lib/search-engine-verification';",
    );
    expect(layout).toContain('!technicalFallback && (');
    expect(layout).toContain('name="google-site-verification"');
    expect(layout).toContain('name="msvalidate.01"');
  });

  it('keeps published public content indexable while unreleased targets remain absent', () => {
    expect(PUBLIC_FOOD_CONTENT.map((item) => item.canonicalTargetId)).toEqual([
      'figs',
      'dates',
    ]);
    expect(PUBLIC_FOOD_CONTENT.every((item) => item.seo.indexable)).toBe(true);
    expect(
      PUBLIC_FOOD_CONTENT.some((item) =>
        ['olives', 'lentils', 'barley', 'honey'].includes(item.canonicalTargetId),
      ),
    ).toBe(false);
  });

  it('preserves the V3C.11 technical fallback boundary', () => {
    const layout = readRepositoryFile('../layouts/BaseLayout.astro');

    expect(layout).toContain('(noindex || technicalFallback)');
    expect(layout).toContain('!technicalFallback && <link rel="canonical"');
    expect(layout).toContain('type="application/ld+json"');
  });
});
