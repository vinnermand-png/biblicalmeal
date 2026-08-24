import type { AdminResourceKind } from './admin/types';

export type AdminRole = 'viewer' | 'editor' | 'reviewer' | 'scheduler' | 'administrator';
export type AdminPermission =
  | 'admin:read'
  | 'draft:edit'
  | 'workflow:review'
  | 'workflow:approve'
  | 'workflow:schedule'
  | 'audit:read';

export interface AdminPrincipal {
  id: string;
  roles: readonly AdminRole[];
}

export interface AdminAuthProvider {
  readonly status: 'configured' | 'integration-required';
  authenticate(input: { readonly credential: string }): Promise<AdminPrincipal | null>;
}

export interface AdminPersistentDraft {
  readonly resourceKind: AdminResourceKind;
  readonly canonicalId: string;
  readonly canonicalOwnerId: string;
  readonly revision: number;
  readonly stage: 'draft' | 'review' | 'approved' | 'scheduled';
  readonly payload: Readonly<Record<string, unknown>>;
  readonly updatedBy: string;
  readonly updatedAt: string;
}

export interface AdminAuditEntry {
  readonly id: string;
  readonly actorId: string;
  readonly action: 'draft-created' | 'draft-updated' | 'sent-to-review' | 'approved' | 'scheduled' | 'mutation-rejected';
  readonly resourceKind: AdminResourceKind;
  readonly canonicalId: string;
  readonly at: string;
  readonly reason?: string;
}

export interface AdminPersistenceProvider {
  readonly status: 'configured' | 'integration-required';
  readDraft(input: { readonly resourceKind: AdminResourceKind; readonly canonicalId: string }): Promise<AdminPersistentDraft | null>;
  writeDraft(input: AdminPersistentDraft): Promise<void>;
  appendAudit(entry: AdminAuditEntry): Promise<void>;
  readAudit(input: { readonly resourceKind: AdminResourceKind; readonly canonicalId: string }): Promise<readonly AdminAuditEntry[]>;
}

export const ROLE_PERMISSIONS: Readonly<Record<AdminRole, readonly AdminPermission[]>> = {
  viewer: ['admin:read', 'audit:read'],
  editor: ['admin:read', 'draft:edit', 'audit:read'],
  reviewer: ['admin:read', 'workflow:review', 'workflow:approve', 'audit:read'],
  scheduler: ['admin:read', 'workflow:schedule', 'audit:read'],
  administrator: ['admin:read', 'draft:edit', 'workflow:review', 'workflow:approve', 'workflow:schedule', 'audit:read'],
};

export function hasAdminPermission(principal: AdminPrincipal, permission: AdminPermission): boolean {
  return principal.roles.some((role) => ROLE_PERMISSIONS[role].includes(permission));
}

export function createIntegrationRequiredAuthProvider(): AdminAuthProvider {
  return {
    status: 'integration-required',
    async authenticate() {
      return null;
    },
  };
}

export function createIntegrationRequiredPersistenceProvider(): AdminPersistenceProvider {
  const unavailable = async (): Promise<never> => {
    throw new Error('Persistent admin storage is not configured. Connect a real database adapter before enabling mutations.');
  };

  return {
    status: 'integration-required',
    readDraft: unavailable,
    writeDraft: unavailable,
    appendAudit: unavailable,
    readAudit: unavailable,
  };
}

export interface AdminBackendResult<T> {
  readonly ok: boolean;
  readonly value?: T;
  readonly reason?: string;
}

export class AdminBackendService {
  constructor(
    private readonly authProvider: AdminAuthProvider,
    private readonly persistenceProvider: AdminPersistenceProvider,
  ) {}

  async authenticate(credential: string): Promise<AdminBackendResult<AdminPrincipal>> {
    const principal = await this.authProvider.authenticate({ credential });
    return principal
      ? { ok: true, value: principal }
      : { ok: false, reason: 'Authentication was not established by a configured provider.' };
  }

  async saveDraft(input: {
    readonly principal: AdminPrincipal | null;
    readonly resourceKind: AdminResourceKind;
    readonly canonicalId: string;
    readonly canonicalOwnerId: string;
    readonly payload: Readonly<Record<string, unknown>>;
    readonly now: string;
  }): Promise<AdminBackendResult<AdminPersistentDraft>> {
    if (!input.principal) return this.reject(input, 'Authentication is required for admin mutations.');
    if (!hasAdminPermission(input.principal, 'draft:edit')) return this.reject(input, 'The authenticated role cannot edit drafts.');
    if (!input.canonicalId || !input.canonicalOwnerId) return this.reject(input, 'Canonical ownership is required before persistence.');
    if (this.persistenceProvider.status !== 'configured') return this.reject(input, 'Persistent storage integration is required before mutations are enabled.');

    const existing = await this.persistenceProvider.readDraft({ resourceKind: input.resourceKind, canonicalId: input.canonicalId });
    if (existing && existing.canonicalOwnerId !== input.canonicalOwnerId) {
      return this.reject(input, 'Conflicting canonical ownership cannot be persisted.');
    }
    if (existing && existing.stage !== 'draft') return this.reject(input, 'Only draft-stage records can be edited through the draft mutation boundary.');

    const record: AdminPersistentDraft = {
      resourceKind: input.resourceKind,
      canonicalId: input.canonicalId,
      canonicalOwnerId: input.canonicalOwnerId,
      revision: (existing?.revision ?? 0) + 1,
      stage: 'draft',
      payload: input.payload,
      updatedBy: input.principal.id,
      updatedAt: input.now,
    };
    await this.persistenceProvider.writeDraft(record);
    await this.persistenceProvider.appendAudit(this.audit(input.principal.id, 'draft-updated', input.resourceKind, input.canonicalId, input.now));
    return { ok: true, value: record };
  }

  async transition(input: {
    readonly principal: AdminPrincipal | null;
    readonly resourceKind: AdminResourceKind;
    readonly canonicalId: string;
    readonly to: AdminPersistentDraft['stage'];
    readonly now: string;
  }): Promise<AdminBackendResult<AdminPersistentDraft>> {
    if (!input.principal) return this.reject(input, 'Authentication is required for workflow transitions.');
    if (this.persistenceProvider.status !== 'configured') return this.reject(input, 'Persistent storage integration is required before workflow transitions are enabled.');
    const record = await this.persistenceProvider.readDraft({ resourceKind: input.resourceKind, canonicalId: input.canonicalId });
    if (!record) return this.reject(input, 'No persistent draft exists for this canonical record.');

    const permission: AdminPermission | null = input.to === 'review'
      ? 'workflow:review'
      : input.to === 'approved'
        ? 'workflow:approve'
        : input.to === 'scheduled'
          ? 'workflow:schedule'
          : null;
    if (!permission || !hasAdminPermission(input.principal, permission)) return this.reject(input, 'The authenticated role cannot perform this workflow transition.');
    if (!this.isValidTransition(record.stage, input.to)) return this.reject(input, `Invalid workflow transition from ${record.stage} to ${input.to}.`);

    const next: AdminPersistentDraft = { ...record, stage: input.to, revision: record.revision + 1, updatedBy: input.principal.id, updatedAt: input.now };
    await this.persistenceProvider.writeDraft(next);
    const action = input.to === 'review' ? 'sent-to-review' : input.to === 'approved' ? 'approved' : 'scheduled';
    await this.persistenceProvider.appendAudit(this.audit(input.principal.id, action, input.resourceKind, input.canonicalId, input.now));
    return { ok: true, value: next };
  }

  async readAudit(input: {
    readonly principal: AdminPrincipal | null;
    readonly resourceKind: AdminResourceKind;
    readonly canonicalId: string;
  }): Promise<AdminBackendResult<readonly AdminAuditEntry[]>> {
    if (!input.principal || !hasAdminPermission(input.principal, 'audit:read')) return { ok: false, reason: 'Audit access requires an authenticated role with audit visibility.' };
    if (this.persistenceProvider.status !== 'configured') return { ok: false, reason: 'Persistent storage integration is required before audit history is available.' };
    return { ok: true, value: await this.persistenceProvider.readAudit(input) };
  }

  canPublishThroughAdmin(): false {
    return false;
  }

  private isValidTransition(from: AdminPersistentDraft['stage'], to: AdminPersistentDraft['stage']): boolean {
    return (from === 'draft' && to === 'review') || (from === 'review' && (to === 'draft' || to === 'approved')) || (from === 'approved' && (to === 'review' || to === 'scheduled')) || (from === 'scheduled' && to === 'approved');
  }

  private audit(actorId: string, action: AdminAuditEntry['action'], resourceKind: AdminResourceKind, canonicalId: string, at: string, reason?: string): AdminAuditEntry {
    return { id: `${canonicalId}:${at}:${action}`, actorId, action, resourceKind, canonicalId, at, ...(reason ? { reason } : {}) };
  }

  private async reject(
    input: { readonly principal?: AdminPrincipal | null; readonly resourceKind: AdminResourceKind; readonly canonicalId: string; readonly now?: string },
    reason: string,
  ): Promise<AdminBackendResult<never>> {
    if (this.persistenceProvider.status === 'configured' && input.principal && input.now) {
      await this.persistenceProvider.appendAudit(this.audit(input.principal.id, 'mutation-rejected', input.resourceKind, input.canonicalId, input.now, reason));
    }
    return { ok: false, reason };
  }
}

export const ADMIN_AUTH_PROVIDER = createIntegrationRequiredAuthProvider();
export const ADMIN_PERSISTENCE_PROVIDER = createIntegrationRequiredPersistenceProvider();
export const ADMIN_BACKEND_INTEGRATION_REQUIREMENTS = [
  'Connect a real server-side authentication provider that returns authenticated admin principals.',
  'Connect a real durable database adapter that implements AdminPersistenceProvider.',
  'Keep provider credentials server-only and never expose them to the static admin page.',
  'Map canonical records by their existing IDs; do not copy canonical registries into the persistence layer.',
  'Route publication through the existing research, citation, editorial and publication gates; this backend never publishes directly.',
] as const;
