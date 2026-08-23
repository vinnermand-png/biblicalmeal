import { describe, expect, it } from 'vitest';
import { FOOD_UNIVERSE } from './food-universe';
import {
  CANONICAL_FOOD_UNIVERSE,
  FOOD_UNIVERSE_STAGE_COUNTS,
} from './food-universe-registry';

describe('V3C.16 canonical food universe registry', () => {
  it('maps every inventoried entity exactly once without creating a second inventory', () => {
    expect(CANONICAL_FOOD_UNIVERSE).toHaveLength(FOOD_UNIVERSE.length);
    expect(new Set(CANONICAL_FOOD_UNIVERSE.map((item) => item.id)).size).toBe(
      FOOD_UNIVERSE.length,
    );
  });

  it('preserves the existing V3C.15 draft boundary for barley and honey', () => {
    const barley = CANONICAL_FOOD_UNIVERSE.find((item) => item.id === 'barley');
    const honey = CANONICAL_FOOD_UNIVERSE.find(
      (item) => item.canonicalTargetId === 'honey',
    );

    expect(barley).toMatchObject({
      stage: 'content-draft',
      contentDraftId: 'draft-barley-wave2',
      canonicalTargetId: 'barley',
    });
    expect(honey).toMatchObject({
      stage: 'content-draft',
      contentDraftId: 'draft-honey-wave2',
      canonicalTargetId: 'honey',
    });
  });

  it('keeps excluded and unresolved entities explicit', () => {
    expect(
      CANONICAL_FOOD_UNIVERSE.find((item) => item.id === 'wine-entity')?.stage,
    ).toBe('excluded');
    expect(
      CANONICAL_FOOD_UNIVERSE.find((item) => item.id === 'incense')?.stage,
    ).toBe('excluded');
    expect(
      CANONICAL_FOOD_UNIVERSE.find((item) => item.id === 'apples')?.stage,
    ).toBe('research-required');
  });

  it('does not imply recipe production while preparing relationship slots', () => {
    expect(
      CANONICAL_FOOD_UNIVERSE.every(
        (item) => Array.isArray(item.relatedRecipeIds) && item.relatedRecipeIds.length === 0,
      ),
    ).toBe(true);
  });

  it('has explicit stage coverage for the current universe', () => {
    expect(FOOD_UNIVERSE_STAGE_COUNTS['content-draft']).toBeGreaterThanOrEqual(2);
    expect(FOOD_UNIVERSE_STAGE_COUNTS['research-required']).toBeGreaterThan(0);
    expect(FOOD_UNIVERSE_STAGE_COUNTS.excluded).toBeGreaterThan(0);
  });
});
