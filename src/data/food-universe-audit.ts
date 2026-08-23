import {
  FOOD_CATEGORIES,
  FOOD_UNIVERSE,
  type FoodCategory,
  type FoodEntity,
  type InventoryClassification,
} from './food-universe';
import { SEO_TARGETS } from './seo-master-map';

/**
 * V3C.16 — Full Biblical Foods Universe
 *
 * A deterministic audit layer over the existing V3B Food Universe inventory.
 * This phase does not invent new foods or silently promote uncertain entities
 * into public pages. It proves that the complete inventory is structurally
 * covered, classified, and connected to the existing SEO universe.
 */

export interface FoodUniverseAuditIssue {
  code:
    | 'duplicate-id'
    | 'duplicate-name'
    | 'unknown-category'
    | 'missing-merge-target'
    | 'unresolved-direct-page-candidate'
    | 'empty-category';
  entityId?: string;
  category?: FoodCategory;
  message: string;
}

export interface FoodUniverseAudit {
  entityCount: number;
  categoryCount: number;
  countsByCategory: Record<FoodCategory, number>;
  countsByClassification: Record<InventoryClassification, number>;
  directPageCandidateTargetIds: string[];
  researchFirstIds: string[];
  notPursuingIds: string[];
  issues: FoodUniverseAuditIssue[];
}

const CLASSIFICATIONS: readonly InventoryClassification[] = [
  'direct-page-candidate',
  'supporting-topic',
  'merge-into-broader-page',
  'research-first',
  'not-pursuing',
];

function canonicalTargetId(entity: FoodEntity): string {
  return entity.id.endsWith('-entity')
    ? entity.id.slice(0, -'-entity'.length)
    : entity.id;
}

export function auditFoodUniverse(
  entities: readonly FoodEntity[] = FOOD_UNIVERSE,
): FoodUniverseAudit {
  const categoryIds = new Set(FOOD_CATEGORIES.map((category) => category.id));
  const targetIds = new Set(SEO_TARGETS.map((target) => target.id));
  const ids = new Set<string>();
  const names = new Set<string>();
  const issues: FoodUniverseAuditIssue[] = [];

  const countsByCategory = Object.fromEntries(
    FOOD_CATEGORIES.map((category) => [category.id, 0]),
  ) as Record<FoodCategory, number>;

  const countsByClassification = Object.fromEntries(
    CLASSIFICATIONS.map((classification) => [classification, 0]),
  ) as Record<InventoryClassification, number>;

  for (const entity of entities) {
    if (ids.has(entity.id)) {
      issues.push({
        code: 'duplicate-id',
        entityId: entity.id,
        message: `Duplicate Food Universe id: ${entity.id}`,
      });
    }
    ids.add(entity.id);

    const normalizedName = entity.name.trim().toLowerCase();
    if (names.has(normalizedName)) {
      issues.push({
        code: 'duplicate-name',
        entityId: entity.id,
        message: `Duplicate Food Universe name: ${entity.name}`,
      });
    }
    names.add(normalizedName);

    if (!categoryIds.has(entity.category)) {
      issues.push({
        code: 'unknown-category',
        entityId: entity.id,
        message: `Unknown Food Universe category: ${entity.category}`,
      });
      continue;
    }

    countsByCategory[entity.category] += 1;
    countsByClassification[entity.classification] += 1;

    if (entity.classification === 'merge-into-broader-page') {
      if (!entity.mergeInto || !targetIds.has(entity.mergeInto)) {
        issues.push({
          code: 'missing-merge-target',
          entityId: entity.id,
          message: `Merge target is missing or not in SEO_TARGETS: ${entity.id}`,
        });
      }
    }

    if (entity.classification === 'direct-page-candidate') {
      const targetId = canonicalTargetId(entity);
      if (!targetIds.has(targetId)) {
        issues.push({
          code: 'unresolved-direct-page-candidate',
          entityId: entity.id,
          message: `Direct-page candidate is not represented by an SEO target: ${targetId}`,
        });
      }
    }
  }

  for (const category of FOOD_CATEGORIES) {
    if (countsByCategory[category.id] === 0) {
      issues.push({
        code: 'empty-category',
        category: category.id,
        message: `Food Universe category has no inventoried entities: ${category.id}`,
      });
    }
  }

  return {
    entityCount: entities.length,
    categoryCount: FOOD_CATEGORIES.length,
    countsByCategory,
    countsByClassification,
    directPageCandidateTargetIds: entities
      .filter((entity) => entity.classification === 'direct-page-candidate')
      .map(canonicalTargetId)
      .sort(),
    researchFirstIds: entities
      .filter((entity) => entity.classification === 'research-first')
      .map((entity) => entity.id)
      .sort(),
    notPursuingIds: entities
      .filter((entity) => entity.classification === 'not-pursuing')
      .map((entity) => entity.id)
      .sort(),
    issues,
  };
}

export const FOOD_UNIVERSE_AUDIT = auditFoodUniverse();
