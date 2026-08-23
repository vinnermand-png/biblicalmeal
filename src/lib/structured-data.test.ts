import { describe, expect, it } from 'vitest';
import { FIRST_WAVE_CONTENT_PLANS } from '../data/content/plans';
import { PUBLIC_FOOD_CONTENT } from '../data/content/public';
import {
  foodStructuredData,
  publicFoodStructuredDataFor,
} from './structured-data';

describe('V3C.8 structured data', () => {
  const descriptions = {
    figs: 'Figs public description.',
    dates: 'Dates public description.',
  } as const;

  it('generates reusable JSON-LD from canonical public content only', () => {
    for (const content of PUBLIC_FOOD_CONTENT) {
      const schema = foodStructuredData(
        content,
        descriptions[content.canonicalTargetId as keyof typeof descriptions],
      );
      expect(schema.map((item) => item['@type'])).toEqual([
        'WebPage',
        'Article',
        'BreadcrumbList',
      ]);
      expect(JSON.parse(JSON.stringify(schema))).toEqual(schema);
    }
  });

  it('uses canonical URLs and unique canonical ownership', () => {
    const urls = PUBLIC_FOOD_CONTENT.map((content) => {
      const schema = foodStructuredData(content, 'Description');
      return schema[0].url;
    });
    expect(urls).toEqual([
      'https://biblicalmeal.com/foods/figs/',
      'https://biblicalmeal.com/foods/dates/',
    ]);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it('keeps public schema limited to explicitly released targets', () => {
    expect(
      publicFoodStructuredDataFor('figs', descriptions.figs),
    ).toBeDefined();
    expect(
      publicFoodStructuredDataFor('dates', descriptions.dates),
    ).toBeDefined();
    expect(publicFoodStructuredDataFor('olives', 'No release')).toBeUndefined();
    expect(
      publicFoodStructuredDataFor('lentils', 'No release'),
    ).toBeUndefined();
    expect(publicFoodStructuredDataFor('barley', 'No release')).toBeUndefined();
    expect(publicFoodStructuredDataFor('honey', 'No release')).toBeUndefined();
  });

  it('rejects draft-only or unpublished content', () => {
    const figsPlan = FIRST_WAVE_CONTENT_PLANS.find(
      (item) => item.canonicalTargetId === 'figs',
    );
    if (!figsPlan) throw new Error('missing figs plan');
    expect(() => foodStructuredData(figsPlan, 'Draft')).toThrow(
      'not eligible for public structured data',
    );
  });

  it('preserves the public uncertainty content that schema describes', () => {
    const figs = PUBLIC_FOOD_CONTENT.find(
      (item) => item.canonicalTargetId === 'figs',
    );
    const dates = PUBLIC_FOOD_CONTENT.find(
      (item) => item.canonicalTargetId === 'dates',
    );
    const figsUncertainty = figs?.sections.find(
      (section) => section.kind === 'uncertainty',
    )?.content;
    const datesUncertainty = dates?.sections.find(
      (section) => section.kind === 'uncertainty',
    )?.content;

    expect(figsUncertainty).toContain('sycomore');
    expect(datesUncertainty).toMatch(
      /palm-versus-edible-date distinction remains unresolved/i,
    );
    expect(datesUncertainty).toMatch(/individual KJV palm references/i);
  });
});
