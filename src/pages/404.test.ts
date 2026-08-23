import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const readSource = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');

describe('V3C.11 custom 404 launch safety', () => {
  const page = readSource('./404.astro');
  const layout = readSource('../layouts/BaseLayout.astro');

  it('provides the Astro static 404 entrypoint', () => {
    expect(page).toContain('BaseLayout');
    expect(page).toContain('Page Not Found');
  });

  it('keeps the 404 noindex-safe and out of canonical fallback metadata', () => {
    expect(page).toContain('noindex={true}');
    expect(page).toContain('technicalFallback={true}');
    expect(layout).toContain('technicalFallback?: boolean');
    expect(layout).toContain('(noindex || technicalFallback)');
    expect(layout).toContain('<meta name="robots" content="noindex, follow"');
    expect(layout).toContain('!technicalFallback && <link rel="canonical"');
  });

  it('keeps technical fallback pages out of social and structured-data output', () => {
    expect(layout).toContain('!technicalFallback && (');
    expect(layout).toContain("type=\"application/ld+json\"");
  });

  it('provides recovery only to known public routes', () => {
    expect(page).toContain('href="/"');
    expect(page).toContain('href="/foods/figs/"');
    expect(page).toContain('href="/foods/dates/"');
    for (const unreleased of ['olives', 'lentils', 'barley', 'honey']) {
      expect(page).not.toContain(`/foods/${unreleased}/`);
    }
  });

  it('does not change normal-page canonical or social metadata paths', () => {
    expect(layout).toContain('const canonicalURL = new URL(Astro.url.pathname, Astro.site);');
    expect(layout).toContain('const social = resolveSocialMetadata({');
    expect(layout).toContain('<meta property="og:url" content={social.canonicalURL} />');
  });
});
