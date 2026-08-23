import { describe, expect, it } from 'vitest';
import {
  AdminBackendService,
  hasAdminPermission,
  type AdminAuditEntry,
  type AdminAuthProvider,
  type AdminPersistentDraft,
  type AdminPersistenceProvider,
  type AdminPrincipal,
} from './admin-backend';

class TestPersistenceProvider implements AdminPersistenceProvider {
  readonly status = 'configured' as const;
  private readonly drafts = new Map<string, AdminPersistentDraft>();
  private readonly auditEntries: AdminAuditEntry[] = [];

  async readDraft(input: { resourceKind: AdminPersistentDraft['resourceKind']; canonicalId: string }) {
    return this.drafts.get(`${input.resourceKind}:${input.canonicalId}`) ?? null;
  }

  async writeDraft(input: AdminPersistentDraft) {
    this.drafts.set(`${input.resourceKind}:${input.canonicalId}`, input);
  }

  async appendAudit(entry: AdminAuditEntry) {
    this.auditEntries.push(entry);
  }

  async readAudit(input: { resourceKind: AdminPersistentDraft['resourceKind']; canonicalId: string }) {
    return this.auditEntries.filter((entry) => entry.resourceKind === input.resourceKind && entry.canonicalId === input.canonicalId);
  }
}

function authProvider(principal: AdminPrincipal | null): AdminAuthProvider {
  return { status: 'configured', async authenticate() { return principal; } };
}

const editor: AdminPrincipal = { id: 'editor-1', roles: ['editor'] };
const reviewer: AdminPrincipal = { id: 'reviewer-1', roles: ['reviewer'] };
const administrator: AdminPrincipal = { id: 'admin-1', roles: ['administrator'] };

describe('V3C.37 authenticated admin backend foundation', () => {
  it('keeps least-privilege role permissions explicit', () => {
    expect(hasAdminPermission(editor, 'draft:edit')).toBe(true);
    expect(hasAdminPermission(editor, 'workflow:approve')).toBe(false);
    expect(hasAdminPermission(reviewer, 'workflow:approve')).toBe(true);
  });

  it('rejects unauthenticated mutations', async () => {
    const service = new AdminBackendService(authProvider(null), new TestPersistenceProvider());
    const result = await service.saveDraft({ principal: null, resourceKind: 'article-content', canonicalId: 'article:grain', canonicalOwnerId: 'article:grain', payload: {}, now: '2026-08-24T00:00:00Z' });
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('Authentication');
  });

  it('rejects draft persistence when the configured persistence boundary is absent', async () => {
    const unavailable: AdminPersistenceProvider = {
      status: 'integration-required',
      async readDraft() { throw new Error('not configured'); },
      async writeDraft() { throw new Error('not configured'); },
      async appendAudit() { throw new Error('not configured'); },
      async readAudit() { throw new Error('not configured'); },
    };
    const service = new AdminBackendService(authProvider(editor), unavailable);
    const result = await service.saveDraft({ principal: editor, resourceKind: 'article-content', canonicalId: 'article:grain', canonicalOwnerId: 'article:grain', payload: {}, now: '2026-08-24T00:00:00Z' });
    expect(result.ok).toBe(false);
    expect(result.reason).toContain('Persistent storage integration');
  });

  it('persists only canonical-owner-bound drafts and records audit history', async () => {
    const persistence = new TestPersistenceProvider();
    const service = new AdminBackendService(authProvider(editor), persistence);
    const result = await service.saveDraft({ principal: editor, resourceKind: 'article-content', canonicalId: 'article:grain', canonicalOwnerId: 'article:grain', payload: { title: 'Draft' }, now: '2026-08-24T00:00:00Z' });
    expect(result.ok).toBe(true);
    expect(result.value?.revision).toBe(1);
    const audit = await service.readAudit({ principal: editor, resourceKind: 'article-content', canonicalId: 'article:grain' });
    expect(audit.value).toHaveLength(1);
  });

  it('rejects conflicting canonical ownership and invalid workflow transitions', async () => {
    const persistence = new TestPersistenceProvider();
    const service = new AdminBackendService(authProvider(administrator), persistence);
    await service.saveDraft({ principal: administrator, resourceKind: 'article-content', canonicalId: 'article:grain', canonicalOwnerId: 'article:grain', payload: {}, now: '2026-08-24T00:00:00Z' });
    const conflict = await service.saveDraft({ principal: administrator, resourceKind: 'article-content', canonicalId: 'article:grain', canonicalOwnerId: 'article:other', payload: {}, now: '2026-08-24T00:01:00Z' });
    expect(conflict.ok).toBe(false);
    const invalid = await service.transition({ principal: administrator, resourceKind: 'article-content', canonicalId: 'article:grain', to: 'approved', now: '2026-08-24T00:02:00Z' });
    expect(invalid.ok).toBe(false);
  });

  it('enforces role-specific review and approval transitions', async () => {
    const persistence = new TestPersistenceProvider();
    const service = new AdminBackendService(authProvider(administrator), persistence);
    await service.saveDraft({ principal: administrator, resourceKind: 'article-content', canonicalId: 'article:grain', canonicalOwnerId: 'article:grain', payload: {}, now: '2026-08-24T00:00:00Z' });
    const review = await service.transition({ principal: reviewer, resourceKind: 'article-content', canonicalId: 'article:grain', to: 'review', now: '2026-08-24T00:01:00Z' });
    expect(review.ok).toBe(true);
    const approved = await service.transition({ principal: reviewer, resourceKind: 'article-content', canonicalId: 'article:grain', to: 'approved', now: '2026-08-24T00:02:00Z' });
    expect(approved.ok).toBe(true);
  });

  it('never grants publication authority to the admin persistence workflow', () => {
    const service = new AdminBackendService(authProvider(administrator), new TestPersistenceProvider());
    expect(service.canPublishThroughAdmin()).toBe(false);
  });
});
