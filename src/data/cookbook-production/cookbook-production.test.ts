import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { auditCookbookProduction } from './audit';
import type { CookbookRecord, CookbookRecipeInclusion, CookbookSection } from './types';

const cookbook: CookbookRecord = { id: 'cookbook-test', title: 'Test', slug: 'test', description: 'Test', productionStatus: 'not-started', publicationStatus: 'draft', publicationEligible: false, sectionIds: ['section-test'], recipeContentIds: ['recipe-content-lentil-pottage'] };
const section: CookbookSection = { id: 'section-test', cookbookId: 'cookbook-test', title: 'Section', order: 1 };
const inclusion: CookbookRecipeInclusion = { cookbookId: 'cookbook-test', sectionId: 'section-test', recipeContentId: 'recipe-content-lentil-pottage', order: 1, productionStatus: 'draft', editorialReviewStatus: 'not-started', publicationStatus: 'draft', productionReady: false };

describe('V3C.29 cookbook production audit', () => {
  it('accepts a valid draft structure without publishing it', () => assert.equal(auditCookbookProduction([cookbook], [section], [inclusion]).valid, true));
  it('rejects duplicate cookbook ownership', () => assert.equal(auditCookbookProduction([cookbook], [section], [inclusion, inclusion]).valid, false));
  it('rejects invalid recipe references', () => assert.equal(auditCookbookProduction([cookbook], [section], [{ ...inclusion, recipeContentId: 'missing-recipe' }]).valid, false));
  it('rejects invalid ordering and section relationships', () => assert.equal(auditCookbookProduction([cookbook], [{ ...section, order: 0 }], [{ ...inclusion, sectionId: 'missing-section' }]).valid, false));
  it('rejects lifecycle and publication gate bypass', () => assert.equal(auditCookbookProduction([{ ...cookbook, productionStatus: 'published', publicationEligible: false }], [section], [{ ...inclusion, publicationStatus: 'published', productionReady: false }]).valid, false));
});
