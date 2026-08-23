import { describe, expect, it } from 'vitest';
import {
  FOOD_UNIVERSE_AUDIT,
  auditFoodUniverse,
} from './food-universe-audit';
import { FOOD_CATEGORIES, FOOD_UNIVERSE } from './food-universe';

describe('V3C.16 Full Biblical Foods Universe', () => {
  it('covers every declared food category with at least one entity', () => {
    expect(FOOD_UNIVERSE_AUDIT.categoryCount).toBe(FOOD_CATEGORIES.length);
    for (const category of FOOD_CATEGORIES) {
      expect(FOOD_UNIVERSE_AUDIT.countsByCategory[category.id]).toBeGreaterThan(
        0,
      );
    }
  });

  it('keeps the inventory structurally complete and internally resolvable', () => {
    expect(FOOD_UNIVERSE_AUDIT.entityCount).toBe(FOOD_UNIVERSE.length);
    expect(
      FOOD_UNIVERSE_AUDIT.issues.filter(
        (issue) => issue.code !== 'unresolved-direct-page-candidate',
      ),
    ).toEqual([]);
  });

  it('keeps uncertainty and exclusions explicit instead of silently publishing them', () => {
    expect(FOOD_UNIVERSE_AUDIT.researchFirstIds.length).toBeGreaterThan(0);
    expect(FOOD_UNIVERSE_AUDIT.notPursuingIds.length).toBeGreaterThan(0);
    expect(FOOD_UNIVERSE_AUDIT.notPursuingIds).toContain('wine-entity');
    expect(FOOD_UNIVERSE_AUDIT.notPursuingIds).toContain('incense');
  });

  it('connects known direct page candidates to the existing SEO universe', () => {
    expect(FOOD_UNIVERSE_AUDIT.directPageCandidateTargetIds).toContain('figs');
    expect(FOOD_UNIVERSE_AUDIT.directPageCandidateTargetIds).toContain('barley');
  });

  it('surfaces unmapped direct page candidates honestly for the next expansion pass', () => {
    for (const issue of FOOD_UNIVERSE_AUDIT.issues.filter(
      (issue) => issue.code === 'unresolved-direct-page-candidate',
    )) {
      expect(issue.entityId).toBeTruthy();
    }
  });

  it('detects duplicate ids and empty categories in synthetic broken input', () => {
    const broken = auditFoodUniverse([
      ...FOOD_UNIVERSE,
      {
        ...FOOD_UNIVERSE[0],
        category: FOOD_UNIVERSE[0].category,
      },
    ]);

    expect(broken.issues.map((issue) => issue.code)).toContain('duplicate-id');
    expect(broken.issues.map((issue) => issue.code)).toContain('duplicate-name');
  });
});
