import { describe, expect, it } from 'vitest';
import {
  DEFAULT_WORKFLOW_STATUS,
  WORKFLOW_STATUSES,
  canTransition,
  isValidWorkflowStatus,
  researchComplete,
  workflowRank,
  type WorkflowStatus,
} from './workflow';

describe('workflow lifecycle', () => {
  it('orders the documented V3C lifecycle stages', () => {
    expect(WORKFLOW_STATUSES).toEqual([
      'research-needed',
      'research-in-progress',
      'research-complete',
      'draft',
      'editorial-review',
      'approved',
    ]);
  });

  it('allows every adjacent forward transition', () => {
    for (let i = 0; i < WORKFLOW_STATUSES.length - 1; i++) {
      expect(
        canTransition(WORKFLOW_STATUSES[i], WORKFLOW_STATUSES[i + 1]),
        `${WORKFLOW_STATUSES[i]} -> ${WORKFLOW_STATUSES[i + 1]}`,
      ).toBe(true);
    }
  });

  it('allows skipping forward stages (gate enforces quality, not pacing)', () => {
    expect(canTransition('research-needed', 'draft')).toBe(true);
    expect(canTransition('research-needed', 'approved')).toBe(true);
  });

  it('rejects backwards transitions that would erase review history', () => {
    expect(canTransition('approved', 'draft')).toBe(false);
    expect(canTransition('editorial-review', 'research-complete')).toBe(false);
    expect(canTransition('draft', 'research-needed')).toBe(false);
  });

  it('rejects self-transitions', () => {
    for (const status of WORKFLOW_STATUSES) {
      expect(canTransition(status, status)).toBe(false);
    }
  });

  it('recognizes only defined statuses', () => {
    expect(isValidWorkflowStatus('approved')).toBe(true);
    expect(isValidWorkflowStatus('published')).toBe(false);
    expect(isValidWorkflowStatus(undefined)).toBe(false);
    expect(isValidWorkflowStatus(42)).toBe(false);
  });

  it('defaults pre-V3C content to research-needed', () => {
    expect(DEFAULT_WORKFLOW_STATUS).toBe<WorkflowStatus>('research-needed');
    expect(researchComplete(DEFAULT_WORKFLOW_STATUS)).toBe(false);
  });

  it('marks research obligations satisfied from research-complete onward', () => {
    expect(researchComplete('research-in-progress')).toBe(false);
    expect(researchComplete('research-complete')).toBe(true);
    expect(researchComplete('approved')).toBe(true);
  });

  it('ranks statuses monotonically', () => {
    expect(workflowRank('research-needed')).toBeLessThan(
      workflowRank('approved'),
    );
  });
});
