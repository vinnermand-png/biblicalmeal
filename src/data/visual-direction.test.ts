import { describe, expect, it } from 'vitest';

import { VISUAL_DIRECTION } from './visual-direction';

describe('V3D.1 visual direction', () => {
  it('preserves the canonical BiblicalMeal identity statement', () => {
    expect(VISUAL_DIRECTION.identity).toBe(
      'Ancient roots. Modern editorial design.',
    );
  });

  it('keeps editorial and interface typography roles distinct', () => {
    expect(VISUAL_DIRECTION.typographyRoles.display).toBe('font-display');
    expect(VISUAL_DIRECTION.typographyRoles.ui).toBe('font-sans');
    expect(VISUAL_DIRECTION.typographyRoles.display).not.toBe(
      VISUAL_DIRECTION.typographyRoles.ui,
    );
  });

  it('reuses the canonical color and layout vocabulary', () => {
    expect(VISUAL_DIRECTION.colorRoles.parchment).toBe('background');
    expect(VISUAL_DIRECTION.colorRoles.deepOlive).toBe('olive-dark');
    expect(VISUAL_DIRECTION.layoutRoles.page).toBe('container-site');
    expect(VISUAL_DIRECTION.layoutRoles.editorialReading).toBe('prose-bm');
  });

  it('keeps motion restrained and reduced-motion aware', () => {
    expect(VISUAL_DIRECTION.motion.reducedMotion).toContain(
      'prefers-reduced-motion',
    );
    expect(VISUAL_DIRECTION.motion.behavior).toContain('Subtle');
  });

  it('defines a non-generic illustration direction and explicit exclusions', () => {
    expect(VISUAL_DIRECTION.illustrationDirection).toContain(
      'clear silhouette',
    );
    expect(VISUAL_DIRECTION.avoid).toContain('generic SaaS gloss');
    expect(VISUAL_DIRECTION.avoid).toContain('flashy AI-generated visuals');
  });
});
