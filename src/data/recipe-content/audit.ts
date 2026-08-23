import { FOOD_UNIVERSE } from '../food-universe';
import { RECIPE_RESEARCH_RECORDS } from '../recipe-research/records';
import { RECIPE_CONTENT_RECORDS } from './records';
import type { RecipeContentRecord } from './types';

export type RecipeContentAuditCode =
  | 'duplicate-id'
  | 'duplicate-title'
  | 'duplicate-slug'
  | 'invalid-research-reference'
  | 'classification-mismatch'
  | 'invalid-food-reference'
  | 'missing-uncertainty-disclosure'
  | 'missing-ingredient-disclosure'
  | 'unresolved-evidence-hidden'
  | 'invalid-lifecycle'
  | 'publication-state-mismatch';

export interface RecipeContentAuditIssue {
  code: RecipeContentAuditCode;
  contentId: string;
  message: string;
}

export interface RecipeContentAudit {
  contentCount: number;
  issues: RecipeContentAuditIssue[];
}

export function auditRecipeContent(
  records: readonly RecipeContentRecord[] = RECIPE_CONTENT_RECORDS,
): RecipeContentAudit {
  const researchById = new Map(
    RECIPE_RESEARCH_RECORDS.map((record) => [record.id, record]),
  );
  const foodIds = new Set(FOOD_UNIVERSE.map((food) => food.id));
  const ids = new Set<string>();
  const titles = new Set<string>();
  const slugs = new Set<string>();
  const issues: RecipeContentAuditIssue[] = [];

  for (const record of records) {
    if (ids.has(record.id)) {
      issues.push({
        code: 'duplicate-id',
        contentId: record.id,
        message: `Duplicate recipe content id: ${record.id}`,
      });
    }
    ids.add(record.id);

    const normalizedTitle = record.title.trim().toLowerCase();
    if (titles.has(normalizedTitle)) {
      issues.push({
        code: 'duplicate-title',
        contentId: record.id,
        message: `Duplicate recipe content title: ${record.title}`,
      });
    }
    titles.add(normalizedTitle);

    const normalizedSlug = record.slug.trim().toLowerCase();
    if (slugs.has(normalizedSlug)) {
      issues.push({
        code: 'duplicate-slug',
        contentId: record.id,
        message: `Duplicate recipe content slug: ${record.slug}`,
      });
    }
    slugs.add(normalizedSlug);

    const research = researchById.get(record.recipeResearchId);
    if (!research) {
      issues.push({
        code: 'invalid-research-reference',
        contentId: record.id,
        message: `Unknown recipe research id: ${record.recipeResearchId}`,
      });
      continue;
    }

    if (record.classification !== research.classification) {
      issues.push({
        code: 'classification-mismatch',
        contentId: record.id,
        message: 'Recipe content classification must match its canonical research record.',
      });
    }

    for (const foodId of [
      ...record.relatedFoodIds,
      ...record.ingredients.flatMap((ingredient) => ingredient.foodId ? [ingredient.foodId] : []),
    ]) {
      if (!foodIds.has(foodId)) {
        issues.push({
          code: 'invalid-food-reference',
          contentId: record.id,
          message: `Unknown Food Universe id: ${foodId}`,
        });
      }
    }

    for (const ingredient of record.ingredients) {
      if (
        ingredient.evidenceLayer === 'practical-adaptation' &&
        !ingredient.disclosure?.trim()
      ) {
        issues.push({
          code: 'missing-ingredient-disclosure',
          contentId: record.id,
          message: `Modern or practical ingredient choices require disclosure: ${ingredient.label}.`,
        });
      }
    }

    if (!record.uncertaintyDisclosure.trim()) {
      issues.push({
        code: 'missing-uncertainty-disclosure',
        contentId: record.id,
        message: 'Recipe content requires an explicit uncertainty disclosure.',
      });
    }

    const researchHasUnresolved = research.evidence.some(
      (entry) => entry.layer === 'unresolved',
    );
    if (researchHasUnresolved && record.editorialNotes.length === 0) {
      issues.push({
        code: 'unresolved-evidence-hidden',
        contentId: record.id,
        message: 'Unresolved research evidence must remain visible in recipe content production.',
      });
    }

    if (
      record.editorialReviewStatus === 'approved' &&
      record.productionStatus !== 'produced'
    ) {
      issues.push({
        code: 'invalid-lifecycle',
        contentId: record.id,
        message: 'Editorial approval requires produced recipe content.',
      });
    }

    if (
      record.publicationEligible &&
      (record.productionStatus !== 'produced' ||
        record.editorialReviewStatus !== 'approved' ||
        research.researchStatus !== 'complete' ||
        research.reconstructionStatus !== 'ready')
    ) {
      issues.push({
        code: 'invalid-lifecycle',
        contentId: record.id,
        message: 'Publication eligibility requires complete research, ready reconstruction, produced content and editorial approval.',
      });
    }

    if (
      record.publicationStatus === 'public' ||
      (record.publicationStatus === 'eligible' && !record.publicationEligible)
    ) {
      issues.push({
        code: 'publication-state-mismatch',
        contentId: record.id,
        message: 'Recipe content cannot advance publication status independently of its eligibility state.',
      });
    }
  }

  return { contentCount: records.length, issues };
}

export const RECIPE_CONTENT_AUDIT = auditRecipeContent();
