import { describe, expect, it } from 'vitest';
import { PUBLIC_FOOD_CONTENT } from '../data/content/public';
import {
  DEFAULT_SOCIAL_IMAGE_PATH,
  absoluteSiteURL,
  resolveSocialImage,
  resolveSocialMetadata,
} from './social-metadata';

describe('V3C.10 social metadata', () => {
  it('derives canonical social metadata from canonical page metadata', () => {
    const metadata = resolveSocialMetadata({
      title: 'Figs',
      description: 'Canonical figs description.',
      pathname: '/foods/figs/',
      type: 'article',
    });

    expect(metadata.title).toBe('Figs | BiblicalMeal');
    expect(metadata.description).toBe('Canonical figs description.');
    expect(metadata.canonicalURL).toBe('https://biblicalmeal.com/foods/figs/');
    expect(metadata.type).toBe('article');
  });

  it('resolves absolute social image URLs through the canonical site URL', () => {
    expect(resolveSocialImage()).toBe(
      'https://biblicalmeal.com/og-default.svg',
    );
    expect(new URL(resolveSocialImage()).protocol).toBe('https:');
    expect(absoluteSiteURL(DEFAULT_SOCIAL_IMAGE_PATH)).toBe(
      resolveSocialImage(),
    );
  });

  it('uses a site-level fallback for pages without content-specific social images', () => {
    const metadata = resolveSocialMetadata();
    expect(metadata.imageURL).toBe(resolveSocialImage());
    expect(metadata.imageAlt).toContain('BiblicalMeal');
  });

  it('supports published figs and dates without page-specific resolver logic', () => {
    for (const content of PUBLIC_FOOD_CONTENT) {
      const metadata = resolveSocialMetadata({
        title: content.title,
        description: content.sections.find(
          (section) => section.kind === 'introduction',
        )?.content,
        pathname: `/foods/${content.canonicalTargetId}/`,
        type: 'article',
      });

      expect(metadata.canonicalURL).toBe(
        `https://biblicalmeal.com/foods/${content.canonicalTargetId}/`,
      );
      expect(metadata.imageURL).toBe(resolveSocialImage());
    }
  });

  it('creates public social metadata for all released content', () => {
    expect(
      PUBLIC_FOOD_CONTENT.map((content) => content.canonicalTargetId),
    ).toEqual([
      'figs',
      'dates',
      'olives',
      'lentils',
      'honey',
      'barley',
      'what-did-jesus-eat',
    ]);
  });
});
