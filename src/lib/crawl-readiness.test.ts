import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SITE } from '../config';
import { PUBLIC_FOOD_CONTENT } from '../data/content/public';
import { internalLinksFor } from './internal-links';

const readRepositoryFile = (path: string) =>
  readFileSync(new URL(path, import.meta.url), 'utf8');

const canonicalOrigin = new URL(SITE.url).origin;

function canonicalURL(pathname: string): string {
  return new URL(pathname, SITE.url).href;
}

describe('V3C.14 first indexing and crawl readiness', () => {
  const astroConfig = readRepositoryFile('../../astro.config.mjs');
  const robots = readRepositoryFile('../../public/robots.txt');
  const layout = readRepositoryFile('../layouts/BaseLayout.astro');
  const foodRoute = readRepositoryFile('../pages/foods/[slug].astro');
  const notFound = readRepositoryFile('../pages/404.astro');

  it('keeps sitemap and robots discovery on the canonical production origin', () => {
    expect(canonicalOrigin).toBe('https://biblicalmeal.com');
    expect(astroConfig).toContain(`site: '${SITE.url}'`);
    expect(robots).toContain(`Sitemap: ${canonicalURL('/sitemap-index.xml')}`);
    expect(robots).toContain('Allow: /');
  });

  it('keeps the sitemap focused on public indexable routes and excludes the internal SEO map', () => {
    expect(astroConfig).toMatch(
      /filter:\s*\(page\)\s*=>\s*!page\.includes\('\/seo-map\/'\)/,
    );
    expect(
      PUBLIC_FOOD_CONTENT.map((page) => page.canonicalTargetId).sort(),
    ).toEqual([
      'barley',
      'dates',
      'figs',
      'honey',
      'lentils',
      'olives',
      'what-did-jesus-eat',
    ]);
    expect(PUBLIC_FOOD_CONTENT.every((page) => page.seo.indexable)).toBe(true);
  });

  it('keeps generated public food routes canonical, unique, and restricted to the publication layer', () => {
    expect(foodRoute).toContain('ingredientPages.map((page) => ({');
    expect(foodRoute).toContain('params: { slug: page.canonicalTargetId }');
    expect(foodRoute).toContain('isContentPublicationEligible(page, draft)');

    const canonicalURLs = PUBLIC_FOOD_CONTENT.map((page) =>
      canonicalURL(page.canonicalPath),
    );
    expect(new Set(canonicalURLs).size).toBe(canonicalURLs.length);
    expect(canonicalURLs.every((url) => url.startsWith(canonicalOrigin))).toBe(
      true,
    );
  });

  it('keeps normal public pages canonical and indexable while technical fallback pages stay protected', () => {
    expect(layout).toContain(
      'const canonicalURL = new URL(Astro.url.pathname, Astro.site);',
    );
    expect(layout).toContain('(noindex || technicalFallback)');
    expect(layout).toContain('<meta name="robots" content="noindex, follow"');
    expect(layout).toContain('!technicalFallback && <link rel="canonical"');
    expect(notFound).toContain('noindex={true}');
    expect(notFound).toContain('technicalFallback={true}');
  });

  it('keeps every released food discoverable through a meaningful published internal link', () => {
    // Filter to only ingredient content (food pages), not articles
    const ingredientPages = PUBLIC_FOOD_CONTENT.filter(
      (page) => !page.canonicalPath.startsWith('/articles/'),
    );
    for (const page of ingredientPages) {
      const links = internalLinksFor(page, PUBLIC_FOOD_CONTENT);
      expect(links.length).toBeGreaterThan(0);
      expect(links.every((link) => link.href.startsWith('/'))).toBe(true);
      expect(links.some((link) => link.href === page.canonicalPath)).toBe(
        false,
      );
      expect(new Set(links.map((link) => link.href)).size).toBe(links.length);
    }
  });

  it('includes Wave 1 targets in public crawl surfaces', () => {
    const publicTargets = new Set(
      PUBLIC_FOOD_CONTENT.map((page) => page.canonicalTargetId),
    );

    for (const released of ['olives', 'lentils', 'barley', 'honey']) {
      expect(publicTargets.has(released)).toBe(true);
    }
  });
});
