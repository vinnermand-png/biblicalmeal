import { SEO_TARGETS } from './seo-master-map';
import {
  FOOD_UNIVERSE,
  type FoodCategory,
  type FoodEntity,
  type FoodEvidenceStatus,
  type InventoryClassification,
} from './food-universe';
import { FIRST_WAVE_CONTENT_PLANS } from './content/plans';
import { V3C15_WAVE2_DRAFTS } from './content/wave2';
import type { WorkflowStatus } from '../lib/workflow';

/**
 * V3C.16 canonical registry over the V3B Food Universe inventory.
 *
 * This does not create public pages or new research. It makes the existing
 * inventory explicit about canonical ownership, research/editorial readiness,
 * and future relationship slots so later phases cannot silently promote a food
 * simply because it is mentioned in the inventory.
 */
export type FoodUniverseStage =
  | 'candidate'
  | 'identified'
  | 'classified'
  | 'research-required'
  | 'research-in-progress'
  | 'research-complete'
  | 'content-draft'
  | 'editorial-review'
  | 'published'
  | 'excluded';

export interface CanonicalFoodRecord {
  id: string;
  name: string;
  category: FoodCategory;
  classification: InventoryClassification;
  evidence: FoodEvidenceStatus;
  stage: FoodUniverseStage;
  /** SEO target that owns the canonical URL, if one already exists. */
  canonicalTargetId?: string;
  canonicalPath?: string;
  /** Existing content architecture is reused rather than duplicated. */
  contentPlanId?: string;
  contentDraftId?: string;
  workflowStatus?: WorkflowStatus;
  /** Data relationship slots for future production; no recipes are created here. */
  relatedFoodIds: string[];
  relatedArticleTargetIds: string[];
  relatedRecipeIds: string[];
  note: string;
}

function targetIdFor(entity: FoodEntity): string {
  if (entity.mergeInto) return entity.mergeInto;
  return entity.id.endsWith('-entity')
    ? entity.id.slice(0, -'-entity'.length)
    : entity.id;
}

function relatedFoods(entity: FoodEntity): string[] {
  const sameCategory = FOOD_UNIVERSE.filter(
    (candidate) =>
      candidate.id !== entity.id &&
      candidate.category === entity.category &&
      candidate.classification !== 'not-pursuing',
  )
    .map((candidate) => candidate.id)
    .slice(0, 6);
  return sameCategory;
}

function stageFor(
  entity: FoodEntity,
  plan?: (typeof FIRST_WAVE_CONTENT_PLANS)[number],
  draft?: (typeof V3C15_WAVE2_DRAFTS)[number],
): FoodUniverseStage {
  if (entity.classification === 'not-pursuing') return 'excluded';
  if (draft) return 'content-draft';
  if (plan?.workflowStatus === 'research-complete') return 'research-complete';
  if (plan?.workflowStatus === 'research-in-progress')
    return 'research-in-progress';
  if (entity.classification === 'research-first') return 'research-required';
  if (entity.classification === 'direct-page-candidate') return 'classified';
  if (entity.evidence === 'requires-verification') return 'candidate';
  return 'identified';
}

function buildCanonicalFoodRecord(entity: FoodEntity): CanonicalFoodRecord {
  const targetId = targetIdFor(entity);
  const seoTarget = SEO_TARGETS.find((target) => target.id === targetId);
  const plan = FIRST_WAVE_CONTENT_PLANS.find(
    (candidate) => candidate.canonicalTargetId === targetId,
  );
  const draft = V3C15_WAVE2_DRAFTS.find(
    (candidate) => candidate.contentItemId === plan?.id,
  );

  return {
    id: entity.id,
    name: entity.name,
    category: entity.category,
    classification: entity.classification,
    evidence: entity.evidence,
    stage: stageFor(entity, plan, draft),
    canonicalTargetId: seoTarget?.id,
    canonicalPath: seoTarget?.targetRoute,
    contentPlanId: plan?.id,
    contentDraftId: draft?.id,
    workflowStatus: draft?.workflowStatus ?? plan?.workflowStatus,
    relatedFoodIds: relatedFoods(entity),
    relatedArticleTargetIds: [],
    relatedRecipeIds: [],
    note: entity.note,
  };
}

export const CANONICAL_FOOD_UNIVERSE: CanonicalFoodRecord[] = FOOD_UNIVERSE.map(
  buildCanonicalFoodRecord,
);

export const FOOD_UNIVERSE_STAGE_COUNTS = CANONICAL_FOOD_UNIVERSE.reduce(
  (counts, record) => {
    counts[record.stage] = (counts[record.stage] ?? 0) + 1;
    return counts;
  },
  {} as Partial<Record<FoodUniverseStage, number>>,
);
