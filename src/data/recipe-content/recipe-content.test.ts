import { describe, expect, it } from 'vitest';
import { auditRecipeContent, RECIPE_CONTENT_AUDIT } from './audit';
import { RECIPE_CONTENT_RECORDS } from './records';
import type { RecipeContentRecord } from './types';

describe('V3C.18 recipe content production', () => {
  it('keeps canonical identity and V3C.17 research linkage intact', () => {
    expect(RECIPE_CONTENT_AUDIT.issues).toEqual([]);
    expect(new Set(RECIPE_CONTENT_RECORDS.map((record) => record.id)).size).toBe(
      RECIPE_CONTENT_RECORDS.length,
    );
    expect(RECIPE_CONTENT_RECORDS.every((record) => record.recipeResearchId)).toBe(true);
  });

  it('preserves research classification and unresolved evidence disclosures', () => {
    for (const record of RECIPE_CONTENT_RECORDS) {
      expect(record.classification).toBe('historically-informed-reconstruction');
      expect(record.uncertaintyDisclosure.trim()).not.toBe('');
      expect(record.editorialNotes.length).toBeGreaterThan(0);
    }
  });

  it('keeps draft production separate from publication', () => {
    for (const record of RECIPE_CONTENT_RECORDS) {
      expect(record.productionStatus).toBe('draft');
      expect(record.editorialReviewStatus).toBe('not-started');
      expect(record.publicationEligible).toBe(false);
      expect(record.publicationStatus).toBe('not-eligible');
    }
  });

  it('detects synthetic invalid research and Food Universe references', () => {
    const invalidResearch = {
      ...RECIPE_CONTENT_RECORDS[0],
      id: 'invalid-research-content',
      recipeResearchId: 'missing-recipe-research',
    };
    const invalidFood = {
      ...RECIPE_CONTENT_RECORDS[0],
      id: 'invalid-food-content',
      relatedFoodIds: ['missing-food'],
    };

    expect(auditRecipeContent([invalidResearch])).toMatchObject({
      issues: expect.arrayContaining([
        expect.objectContaining({ code: 'invalid-research-reference' }),
      ]),
    });
    expect(auditRecipeContent([invalidFood])).toMatchObject({
      issues: expect.arrayContaining([
        expect.objectContaining({ code: 'invalid-food-reference' }),
      ]),
    });
  });

  it('detects duplicate identities and impossible publication readiness', () => {
    const duplicate = {
      ...RECIPE_CONTENT_RECORDS[0],
      publicationEligible: true,
    } satisfies RecipeContentRecord;

    const audit = auditRecipeContent([RECIPE_CONTENT_RECORDS[0], duplicate]);

    expect(audit.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'duplicate-id' }),
        expect.objectContaining({ code: 'duplicate-title' }),
        expect.objectContaining({ code: 'invalid-lifecycle' }),
      ]),
    );
  });
});
