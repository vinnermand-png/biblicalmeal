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

  it('keeps production drafts separate from publication', () => {
    for (const record of RECIPE_CONTENT_RECORDS) {
      expect(record.productionStatus).toBe('draft');
      expect(record.editorialReviewStatus).toBe('not-started');
      expect(record.publicationEligible).toBe(false);
      expect(record.publicationStatus).toBe('not-eligible');
    }
  });

  it('maps each content ingredient and step to an explicit evidence boundary', () => {
    for (const record of RECIPE_CONTENT_RECORDS) {
      expect(record.slug).toMatch(/^[a-z0-9-]+$/);
      expect(record.metaDescription.length).toBeGreaterThan(40);
      expect(record.ingredients.length).toBeGreaterThan(0);
      expect(record.preparationSteps.length).toBeGreaterThan(0);
      expect(record.ingredients.every((ingredient) => ingredient.evidenceLayer)).toBe(true);
      expect(record.preparationSteps.every((step) => step.evidenceLayer)).toBe(true);
    }
  });

  it('keeps modern kitchen choices explicitly disclosed instead of historicalized', () => {
    for (const record of RECIPE_CONTENT_RECORDS) {
      const modernChoices = record.ingredients.filter(
        (ingredient) => ingredient.evidenceLayer === 'practical-adaptation',
      );
      expect(modernChoices.length).toBeGreaterThan(0);
      expect(modernChoices.every((ingredient) => ingredient.disclosure?.trim())).toBe(true);
      expect(record.preparationSteps.every((step) => step.disclosure?.trim())).toBe(true);
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

  it('detects duplicate identities, duplicate slugs and impossible publication readiness', () => {
    const duplicate = {
      ...RECIPE_CONTENT_RECORDS[0],
      publicationEligible: true,
    } satisfies RecipeContentRecord;

    const audit = auditRecipeContent([RECIPE_CONTENT_RECORDS[0], duplicate]);

    expect(audit.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'duplicate-id' }),
        expect.objectContaining({ code: 'duplicate-title' }),
        expect.objectContaining({ code: 'duplicate-slug' }),
        expect.objectContaining({ code: 'invalid-lifecycle' }),
      ]),
    );
  });

  it('requires disclosure for practical ingredient additions', () => {
    const invalid = {
      ...RECIPE_CONTENT_RECORDS[0],
      ingredients: RECIPE_CONTENT_RECORDS[0].ingredients.map((ingredient, index) =>
        index === 1 ? { ...ingredient, disclosure: '' } : ingredient,
      ),
    } satisfies RecipeContentRecord;

    expect(auditRecipeContent([invalid]).issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'missing-ingredient-disclosure' }),
      ]),
    );
  });
});
