import { strict as assert } from 'node:assert';
import { describe, it } from 'node:test';
import { auditAdminOverview } from './audit';
import { ADMIN_OVERVIEW, evaluateAdminMutation } from './overview';

describe('V3C.31 admin foundation', () => {
  it('reads canonical records without creating a parallel registry', () => {
    assert.ok(ADMIN_OVERVIEW.metrics.some((metric) => metric.id === 'foods'));
    assert.ok(ADMIN_OVERVIEW.workflowItems.some((item) => item.kind === 'recipe-content'));
  });

  it('preserves draft and published separation in the overview', () => {
    const issues = auditAdminOverview();
    assert.equal(issues.length, 0);
  });

  it('does not grant the admin layer mutation or publication authority', () => {
    const decision = evaluateAdminMutation({
      kind: 'recipe-content',
      id: 'recipe-content-lentil-pottage',
      operation: 'publish',
    });
    assert.equal(decision.allowed, false);
  });

  it('rejects duplicate canonical ownership and invalid public state in audits', () => {
    const duplicate = {
      ...ADMIN_OVERVIEW,
      workflowItems: [
        ...ADMIN_OVERVIEW.workflowItems,
        ADMIN_OVERVIEW.workflowItems[0],
      ],
    };
    assert.ok(auditAdminOverview(duplicate).some((issue) => issue.code === 'duplicate-workflow-item'));

    const invalidPublic = {
      ...ADMIN_OVERVIEW,
      workflowItems: ADMIN_OVERVIEW.workflowItems.map((item, index) =>
        index === 0 ? { ...item, publicationState: 'public', publicationEligible: false } : item,
      ),
    };
    assert.ok(auditAdminOverview(invalidPublic).some((issue) => issue.code === 'invalid-published-state'));
  });
});
