import { RECIPE_CONTENT_BY_ID } from './records';
import type { CookbookRecord, CookbookRecipeInclusion, CookbookSection } from './types';

export interface CookbookAuditResult { valid: boolean; errors: string[] }

export function auditCookbookProduction(
  cookbooks: readonly CookbookRecord[],
  sections: readonly CookbookSection[],
  inclusions: readonly CookbookRecipeInclusion[],
): CookbookAuditResult {
  const errors: string[] = [];
  const cookbookIds = new Set<string>();
  const cookbookSlugs = new Set<string>();
  for (const cookbook of cookbooks) {
    if (cookbookIds.has(cookbook.id)) errors.push(`Duplicate cookbook ID: ${cookbook.id}`);
    if (cookbookSlugs.has(cookbook.slug)) errors.push(`Duplicate cookbook slug: ${cookbook.slug}`);
    cookbookIds.add(cookbook.id); cookbookSlugs.add(cookbook.slug);
    if (cookbook.productionStatus === 'published' && !cookbook.publicationEligible) errors.push(`Published cookbook bypasses eligibility gate: ${cookbook.id}`);
    if (cookbook.publicationStatus === 'published' && cookbook.productionStatus !== 'published') errors.push(`Cookbook publication state mismatch: ${cookbook.id}`);
  }
  const sectionIds = new Set<string>();
  const sectionOrders = new Map<string, Set<number>>();
  for (const section of sections) {
    if (sectionIds.has(section.id)) errors.push(`Duplicate section ID: ${section.id}`);
    sectionIds.add(section.id);
    if (!cookbookIds.has(section.cookbookId)) errors.push(`Section references unknown cookbook: ${section.id}`);
    if (section.order < 1 || !Number.isInteger(section.order)) errors.push(`Invalid section order: ${section.id}`);
    const orders = sectionOrders.get(section.cookbookId) ?? new Set<number>();
    if (orders.has(section.order)) errors.push(`Duplicate section order in cookbook: ${section.cookbookId}`);
    orders.add(section.order); sectionOrders.set(section.cookbookId, orders);
  }
  const recipeOwnership = new Set<string>();
  const inclusionOrders = new Map<string, Set<number>>();
  for (const inclusion of inclusions) {
    if (!cookbookIds.has(inclusion.cookbookId)) errors.push(`Inclusion references unknown cookbook: ${inclusion.recipeContentId}`);
    const section = sections.find((item) => item.id === inclusion.sectionId);
    if (!section || section.cookbookId !== inclusion.cookbookId) errors.push(`Inclusion section relationship invalid: ${inclusion.recipeContentId}`);
    const recipe = RECIPE_CONTENT_BY_ID.get(inclusion.recipeContentId);
    if (!recipe) errors.push(`Unknown canonical recipe content: ${inclusion.recipeContentId}`);
    const ownershipKey = `${inclusion.cookbookId}:${inclusion.recipeContentId}`;
    if (recipeOwnership.has(ownershipKey)) errors.push(`Duplicate recipe ownership: ${ownershipKey}`);
    recipeOwnership.add(ownershipKey);
    if (inclusion.order < 1 || !Number.isInteger(inclusion.order)) errors.push(`Invalid recipe order: ${inclusion.recipeContentId}`);
    const orderKey = `${inclusion.cookbookId}:${inclusion.sectionId}`;
    const orders = inclusionOrders.get(orderKey) ?? new Set<number>();
    if (orders.has(inclusion.order)) errors.push(`Duplicate recipe order in section: ${orderKey}`);
    orders.add(inclusion.order); inclusionOrders.set(orderKey, orders);

    if (recipe && (
      inclusion.productionStatus !== recipe.productionStatus ||
      inclusion.editorialReviewStatus !== recipe.editorialReviewStatus ||
      inclusion.publicationStatus !== recipe.publicationStatus
    )) {
      errors.push(`Inclusion lifecycle diverges from canonical recipe: ${inclusion.recipeContentId}`);
    }
    if (inclusion.publicationStatus === 'published' && !inclusion.productionReady) errors.push(`Published inclusion bypasses production gate: ${inclusion.recipeContentId}`);
    if (inclusion.productionReady && (inclusion.productionStatus !== 'produced' || inclusion.editorialReviewStatus !== 'approved' || inclusion.publicationStatus !== 'published')) errors.push(`Production-ready inclusion lacks canonical gates: ${inclusion.recipeContentId}`);
    if (inclusion.productionReady && recipe && !recipe.publicationEligible) errors.push(`Production-ready inclusion bypasses recipe publication eligibility: ${inclusion.recipeContentId}`);
  }
  return { valid: errors.length === 0, errors };
}
