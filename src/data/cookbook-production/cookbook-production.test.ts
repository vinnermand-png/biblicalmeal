import { describe, expect, it } from 'vitest';
import { auditCookbookProduction } from './audit';
import {
  COOKBOOK_RECORDS,
  COOKBOOK_RECIPE_INCLUSIONS,
  COOKBOOK_SECTIONS,
  RECIPE_CONTENT_BY_ID,
} from './records';
import type {
  CookbookRecord,
  CookbookRecipeInclusion,
  CookbookSection,
} from './types';

const canonicalRecipe = RECIPE_CONTENT_BY_ID.get(
  'recipe-content-lentil-pottage',
);

if (!canonicalRecipe) {
  throw new Error(
    'Cookbook validation fixture requires canonical lentil recipe content.',
  );
}

const cookbook: CookbookRecord = {
  id: 'cookbook-test',
  title: 'Test',
  slug: 'test',
  description: 'Test',
  productionStatus: 'not-started',
  publicationStatus: 'draft',
  publicationEligible: false,
  sectionIds: ['section-test'],
  recipeContentIds: [canonicalRecipe.id],
};

const section: CookbookSection = {
  id: 'section-test',
  cookbookId: 'cookbook-test',
  title: 'Section',
  order: 1,
};

const inclusion: CookbookRecipeInclusion = {
  cookbookId: 'cookbook-test',
  sectionId: 'section-test',
  recipeContentId: canonicalRecipe.id,
  order: 1,
  productionStatus: canonicalRecipe.productionStatus,
  editorialReviewStatus: canonicalRecipe.editorialReviewStatus,
  publicationStatus: canonicalRecipe.publicationStatus,
  productionReady: false,
};

describe('V3C.30 cookbook production audit', () => {
  it('accepts the first canonical cookbook batch as internal production work', () => {
    expect(
      auditCookbookProduction(
        COOKBOOK_RECORDS,
        COOKBOOK_SECTIONS,
        COOKBOOK_RECIPE_INCLUSIONS,
      ).valid,
    ).toBe(true);
  });

  it('accepts a valid draft structure without publishing it', () => {
    expect(
      auditCookbookProduction([cookbook], [section], [inclusion]).valid,
    ).toBe(true);
  });

  it('rejects duplicate cookbook ownership', () => {
    expect(
      auditCookbookProduction([cookbook], [section], [inclusion, inclusion])
        .valid,
    ).toBe(false);
  });

  it('rejects invalid recipe references', () => {
    expect(
      auditCookbookProduction(
        [cookbook],
        [section],
        [{ ...inclusion, recipeContentId: 'missing-recipe' }],
      ).valid,
    ).toBe(false);
  });

  it('rejects invalid ordering and section relationships', () => {
    expect(
      auditCookbookProduction(
        [cookbook],
        [{ ...section, order: 0 }],
        [{ ...inclusion, sectionId: 'missing-section' }],
      ).valid,
    ).toBe(false);
  });

  it('rejects lifecycle divergence from canonical recipe content', () => {
    expect(
      auditCookbookProduction(
        [cookbook],
        [section],
        [{ ...inclusion, editorialReviewStatus: 'approved' }],
      ).valid,
    ).toBe(false);
  });

  it('rejects lifecycle and publication gate bypass', () => {
    expect(
      auditCookbookProduction(
        [
          {
            ...cookbook,
            productionStatus: 'published',
            publicationEligible: false,
          },
        ],
        [section],
        [{ ...inclusion, publicationStatus: 'public', productionReady: false }],
      ).valid,
    ).toBe(false);
  });
});
