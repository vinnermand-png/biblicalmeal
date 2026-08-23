/**
 * V3C.1 editorial workflow lifecycle.
 *
 * Two independent axes govern content:
 * - Publication status (`status`: draft | in-review | published) controls
 *   PUBLIC VISIBILITY. Owned by the V3A schema; untouched semantics.
 * - Workflow status (`workflowStatus`) controls EDITORIAL/RESEARCH readiness.
 *   Content can only become publicly visible when the workflow has reached
 *   `approved` (enforced in content.config.ts and publication-gate.ts).
 *
 * Pure module: no astro:content imports so it stays unit-testable.
 */

export const WORKFLOW_STATUSES = [
  'research-needed',
  'research-in-progress',
  'research-complete',
  'draft',
  'editorial-review',
  'approved',
] as const;

export type WorkflowStatus = (typeof WORKFLOW_STATUSES)[number];

const WORKFLOW_RANK: Readonly<Record<WorkflowStatus, number>> = {
  'research-needed': 0,
  'research-in-progress': 1,
  'research-complete': 2,
  draft: 3,
  'editorial-review': 4,
  approved: 5,
};

/** Ordered stage index; higher = closer to publishable. */
export function workflowRank(status: WorkflowStatus): number {
  return WORKFLOW_RANK[status];
}

/**
 * Transitions may only move FORWARD through the lifecycle. Skipping stages is
 * allowed (e.g. text written before research completes) because enforcement
 * of research/citation requirements happens at the publication gate, not by
 * restricting day-to-day editing movement. Backwards movement would erase
 * review history and is rejected; use an explicit re-open decision recorded
 * outside this state machine if ever genuinely needed.
 */
export function canTransition(
  from: WorkflowStatus,
  to: WorkflowStatus,
): boolean {
  return workflowRank(to) > workflowRank(from);
}

export function isValidWorkflowStatus(value: unknown): value is WorkflowStatus {
  return (
    typeof value === 'string' &&
    (WORKFLOW_STATUSES as readonly string[]).includes(value)
  );
}

/** Default for entries authored before V3C existed. */
export const DEFAULT_WORKFLOW_STATUS: WorkflowStatus = 'research-needed';

/** Stages at which research obligations are considered satisfied. */
export function researchComplete(status: WorkflowStatus): boolean {
  return workflowRank(status) >= WORKFLOW_RANK['research-complete'];
}
