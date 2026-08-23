import { describe, expect, it } from 'vitest';
import { NAV_LINKS, SITE } from './config';

describe('SITE configuration', () => {
  it('points to the production domain', () => {
    expect(SITE.url).toBe('https://biblicalmeal.com');
  });

  it('has required metadata', () => {
    expect(SITE.name.length).toBeGreaterThan(0);
    expect(SITE.title.length).toBeGreaterThan(0);
    expect(SITE.description.length).toBeGreaterThan(0);
  });
});

describe('NAV_LINKS', () => {
  it('uses absolute hrefs', () => {
    for (const link of NAV_LINKS) {
      expect(link.href.startsWith('/')).toBe(true);
    }
  });
});
