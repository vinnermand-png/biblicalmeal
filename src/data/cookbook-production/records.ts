import { RECIPE_CONTENT_RECORDS } from '../recipe-content/records';
import type { CookbookRecord, CookbookRecipeInclusion, CookbookSection } from './types';

/**
 * V3C.29 keeps cookbook production intentionally empty until a real editorial
 * project is opened. The canonical production structure exists now; recipe
 * drafts remain owned by V3C.18 and are not silently promoted into a cookbook.
 */
export const COOKBOOK_RECORDS: readonly CookbookRecord[] = [];
export const COOKBOOK_SECTIONS: readonly CookbookSection[] = [];
export const COOKBOOK_RECIPE_INCLUSIONS: readonly CookbookRecipeInclusion[] = [];

export const RECIPE_CONTENT_BY_ID = new Map(
  RECIPE_CONTENT_RECORDS.map((record) => [record.id, record]),
);
