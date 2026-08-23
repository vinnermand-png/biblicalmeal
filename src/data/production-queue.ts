/**
 * V3C.1 production queue - machine-readable answer to "what should we work
 * on next?".
 *
 * DERIVATION ONLY: this module invents no SEO strategy. Every item is derived
 * from the locked V3B source of truth:
 * - Targets/routes/types/statuses: seo-master-map.ts SEO_TARGETS
 * - Priorities: page1-framework.ts TARGET_PRIORITY_SCORES
 * - Brief linkage: content-briefs.ts CONTENT_BRIEFS
 * - Cornerstones: seo-master-map.ts PILLAR_TARGET_IDS
 *
 * Workflow state per item comes from an injectable index keyed by target id
 * (populated from real content entries in later phases). Default state is
 * `research-needed` - nothing is assumed done that has not been recorded.
 */

import {
  PILLAR_TARGET_IDS,
  SEO_TARGETS,
  type ContentType,
  type EvidenceLevel,
  type Priority,
} from './seo-master-map';
import {
  TARGET_PRIORITY_SCORES,
  type OpportunityTier,
} from './page1-framework';
import { CONTENT_BRIEFS } from './content-briefs';
import { UNRESOLVED_QUESTIONS } from './research/questions';
import type { WorkflowStatus } from '../lib/workflow';
import {
  CONTENT_DRAFT_TARGET_IDS,
  CONTENT_PLAN_TARGET_IDS,
} from './content/catalog';

/** Content types that must have an approved content brief before drafting. */
const BRIEF_REQUIRED_TYPES: readonly ContentType[] = [
  'pillar',
  'hub',
  'article',
];

/**
 * First authority batch (V3C planning only - NOT written yet):
 * three cornerstones plus the first core food batch. All ids are verified
 * against SEO_TARGETS by tests.
 */
export const FIRST_WAVE_TARGET_IDS: readonly string[] = [
  ...PILLAR_TARGET_IDS,
  'figs',
  'olives',
  'lentils',
  'dates',
  'honey',
  'barley',
];

const TIER_ORDER: Record<OpportunityTier, number> = {
  cornerstone: 0,
  'strong-supporting': 1,
  'long-tail-value': 2,
  'research-heavy': 3,
};

const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export interface QueueBlocker {
  code: string;
  message: string;
}

export interface ProductionQueueItem {
  targetId: string;
  topic: string;
  contentType: ContentType;
  canonicalRoute: string;
  firstWave: boolean;
  tier: OpportunityTier | null;
  priority: Priority;
  evidenceLevel: EvidenceLevel;
  briefStatus: 'draft' | 'in-review' | 'approved' | null;
  workflowStatus: WorkflowStatus;
  openResearchItems: number;
  blockers: QueueBlocker[];
  /** Warning-level research findings that must be disclosed, never blocking. */
  researchWarnings: QueueBlocker[];
  nextAction: string;
  contentPlanStatus: 'not-planned' | 'planned' | 'draft-available';
}

/** Keyed by SeoTarget.id; values come from real content workflow records. */
export type ContentWorkflowIndex = Record<string, WorkflowStatus>;

function deriveNextAction(
  blockers: QueueBlocker[],
  workflow: WorkflowStatus,
): string {
  if (blockers.length > 0) return `Resolve blocker: ${blockers[0].code}`;
  switch (workflow) {
    case 'research-needed':
      return 'Begin research';
    case 'research-in-progress':
      return 'Continue research';
    case 'research-complete':
      return 'Write draft';
    case 'draft':
      return 'Submit for editorial review';
    case 'editorial-review':
      return 'Complete editorial review';
    case 'approved':
      return 'Publish (publication gate must pass)';
  }
}

export function buildProductionQueue(
  workflowState: ContentWorkflowIndex = {},
): ProductionQueueItem[] {
  const items: ProductionQueueItem[] = [];

  for (const target of SEO_TARGETS) {
    // Not-pursuing targets can never enter the production pipeline.
    if (target.status === 'not-pursuing') continue;

    const brief = CONTENT_BRIEFS.find((b) => b.targetId === target.id);
    const workflow = workflowState[target.id] ?? 'research-needed';
    const needsBrief = BRIEF_REQUIRED_TYPES.includes(target.contentType);

    const blockers: QueueBlocker[] = [];
    if (needsBrief && !brief) {
      blockers.push({
        code: 'brief-not-created',
        message: `No content brief exists for "${target.id}".`,
      });
    }
    if (brief && brief.status !== 'approved') {
      blockers.push({
        code: 'brief-not-approved',
        message: `Brief for "${target.id}" is "${brief.status}", not approved.`,
      });
    }
    if (brief?.scriptureAnchors.some((a) => !a.verified)) {
      blockers.push({
        code: 'unverified-scripture-anchors',
        message: `Brief for "${target.id}" carries unverified scripture anchors (CITATION_RULES).`,
      });
    }
    // V3C.2: blocking research questions flow straight into the queue;
    // warning-level findings are surfaced without blocking.
    const researchWarnings: QueueBlocker[] = [];
    for (const question of UNRESOLVED_QUESTIONS) {
      const applies =
        question.subjectId === target.id ||
        target.relatedTopics.includes(question.subjectId);
      if (!applies) continue;
      if (question.resolution === 'blocker') {
        blockers.push({
          code: `research-${question.kind}`,
          message: `${question.question} (${question.provenance})`,
        });
      } else if (question.resolution === 'warning') {
        researchWarnings.push({
          code: `research-${question.kind}`,
          message: question.question,
        });
      }
    }

    items.push({
      targetId: target.id,
      topic: target.topic,
      contentType: target.contentType,
      canonicalRoute: target.targetRoute,
      firstWave: FIRST_WAVE_TARGET_IDS.includes(target.id),
      tier: TARGET_PRIORITY_SCORES[target.id]?.tier ?? null,
      priority: target.priority,
      evidenceLevel: target.evidenceLevel,
      briefStatus: brief?.status ?? null,
      workflowStatus: workflow,
      openResearchItems: target.researchRequired.length,
      blockers,
      researchWarnings,
      nextAction: deriveNextAction(blockers, workflow),
      contentPlanStatus: CONTENT_DRAFT_TARGET_IDS.includes(target.id as never)
        ? 'draft-available'
        : CONTENT_PLAN_TARGET_IDS.includes(target.id as never)
          ? 'planned'
          : 'not-planned',
    });
  }

  return items.sort((a, b) => {
    if (a.firstWave !== b.firstWave) return a.firstWave ? -1 : 1;
    const tierA = a.tier ? TIER_ORDER[a.tier] : 4;
    const tierB = b.tier ? TIER_ORDER[b.tier] : 4;
    if (tierA !== tierB) return tierA - tierB;
    const prioA = PRIORITY_ORDER[a.priority];
    const prioB = PRIORITY_ORDER[b.priority];
    if (prioA !== prioB) return prioA - prioB;
    return a.targetId.localeCompare(b.targetId);
  });
}

/** Queue summary for dashboards: counts by workflow stage. */
export function summarizeQueue(
  queue: ProductionQueueItem[],
): Record<WorkflowStatus, number> {
  const summary = {
    'research-needed': 0,
    'research-in-progress': 0,
    'research-complete': 0,
    draft: 0,
    'editorial-review': 0,
    approved: 0,
  } satisfies Record<WorkflowStatus, number>;
  for (const item of queue) summary[item.workflowStatus] += 1;
  return summary;
}
