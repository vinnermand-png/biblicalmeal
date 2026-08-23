import { describe, expect, it } from 'vitest';
import { auditAdminOverview } from './audit';
import { ADMIN_OVERVIEW, evaluateAdminMutation } from './overview';

describe('V3C.31 admin foundation', () => {
  it('reads canonical records without creating a parallel registry', () => {
    expect(ADMIN_OVERVIEW.metrics.some((metric) => metric.id === 'foods')).toBe(true);
    expect(ADMIN_OVERVIEW.workflowItems.some((item) => item.kind === 'recipe-content')).toBe(true);
  });

  it('preserves draft and published separation in the overview', () => {
    expect(auditAdminOverview()).toHaveLength(0);
  });

  it('does not grant the admin layer mutation or publication authority', () => {
    const decision = evaluateAdminMutation({
      kind: 'recipe-content',
      id: 'recipe-content-lentil-pottage',
      operation: 'publish',
    });
    expect(decision.allowed).toBe(false);
  });

  it('rejects duplicate canonical ownership and invalid public state in audits', () => {
    const duplicate = {
      ...ADMIN_OVERVIEW,
      workflowItems: [
        ...ADMIN_OVERVIEW.workflowItems,
        ADMIN_OVERVIEW.workflowItems[0],
      ],
    };
    expect(
      auditAdminOverview(duplicate).some((issue) => issue.code === 'duplicate-workflow-item'),
    ).toBe(true);

    const invalidPublic = {
      ...ADMIN_OVERVIEW,
      workflowItems: ADMIN_OVERVIEW.workflowItems.map((item, index) =>
        index === 0 ? { ...item, publicationState: 'public', publicationEligible: false } : item,
      ),
    };
    expect(
      auditAdminOverview(invalidPublic).some(
        (issue) => issue.code === 'invalid-published-state',
      ),
    ).toBe(true);
  });
});
