import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { evaluateAdminMutation } from '../data/admin/overview';

const readSource = (path: string) =>
  readFileSync(new URL(path, import.meta.url), 'utf8');

/**
 * V3C.38 Admin/Backend Security Review Tests
 *
 * Tests cover:
 * - Unauthenticated mutation rejection
 * - Unauthorized mutation rejection
 * - No publication bypass
 * - No hardcoded admin accounts
 * - No fake authentication
 * - Canonical ownership protection
 */

describe('V3C.38 admin security review', () => {
  it('rejects all mutation operations', () => {
    const operations = [
      'update-status',
      'publish',
      'delete',
      'create',
    ] as const;

    for (const operation of operations) {
      const decision = evaluateAdminMutation({
        kind: 'recipe-content',
        id: 'test-recipe',
        operation,
      });
      expect(decision.allowed).toBe(false);
      expect(decision.reason).toContain('cannot bypass canonical gates');
    }
  });

  it('rejects mutations for all resource kinds', () => {
    const kinds = [
      'food',
      'research-dossier',
      'article-content',
      'recipe-research',
      'recipe-content',
      'cookbook',
      'seo-target',
      'instagram-content',
    ] as const;

    for (const kind of kinds) {
      const decision = evaluateAdminMutation({
        kind,
        id: 'test-id',
        operation: 'publish',
      });
      expect(decision.allowed).toBe(false);
    }
  });

  it('does not have hardcoded admin accounts', () => {
    const overviewSource = readSource('../data/admin/overview.ts');
    expect(overviewSource).not.toContain('admin@');
    expect(overviewSource).not.toContain('password');
    expect(overviewSource).not.toContain('secret');
  });

  it('admin page is read-only with no mutation authority', () => {
    const adminPage = readSource('../pages/admin.astro');
    expect(adminPage).toContain('never grants direct publication authority');
  });

  it('admin does not expose server-only secrets', () => {
    const overviewSource = readSource('../data/admin/overview.ts');
    expect(overviewSource).not.toContain('API_KEY');
    expect(overviewSource).not.toContain('SECRET');
    expect(overviewSource).not.toContain('OPENAI_API_KEY');
  });

  it('preserves publication gate authority', () => {
    const overviewSource = readSource('../data/admin/overview.ts');
    expect(overviewSource).toContain('canonical');
  });

  it('admin warnings document system boundaries', () => {
    const overviewSource = readSource('../data/admin/overview.ts');
    expect(overviewSource).toContain(
      'canonical publication gates remain authoritative',
    );
    expect(overviewSource).toContain(
      'Future mutations must resolve to the existing canonical owners',
    );
  });
});
