import { describe, expect, it } from 'vitest';
import { PUBLIC_FOOD_CONTENT } from '../data/content/public';
import { CANONICAL_FOOD_UNIVERSE } from '../data/food-universe-registry';
import {
  auditInternalLinks,
  canonicalContentRelationships,
  canonicalRelationshipAudit,
  canonicalRelationshipsFor,
  internalLinksFor,
} from './internal-links';

describe('V3C.9 canonical internal links', () => {
  const figs = PUBLIC_FOOD_CONTENT.find(
    (item) => item.canonicalTargetId === 'figs',
  )!;
  const dates = PUBLIC_FOOD_CONTENT.find(
    (item) => item.canonicalTargetId === 'dates',
  )!;

  it('links published public content through canonical URLs', () => {
    expect(internalLinksFor(figs, PUBLIC_FOOD_CONTENT)).toContainEqual(
      expect.objectContaining({ id: dates.id, href: dates.canonicalPath }),
    );
    expect(internalLinksFor(dates, PUBLIC_FOOD_CONTENT)).toContainEqual(
      expect.objectContaining({ id: figs.id, href: figs.canonicalPath }),
    );
  });

  it('does not link a page to itself and deduplicates canonical URLs', () => {
    const links = internalLinksFor(figs, PUBLIC_FOOD_CONTENT);
    expect(links.some((link) => link.id === figs.id)).toBe(false);
    expect(new Set(links.map((link) => link.href)).size).toBe(links.length);
  });

  it('excludes draft-only and unpublished content from public linking', () => {
    const draftOnly = {
      ...figs,
      id: 'content-olives-test',
      canonicalTargetId: 'olives',
      canonicalPath: '/ingredients/olives/',
      publicationStatus: 'draft' as const,
      workflowStatus: 'research-in-progress' as const,
      seo: { ...figs.seo, indexable: false },
    };

    expect(internalLinksFor(figs, [figs, dates, draftOnly])).not.toContainEqual(
      expect.objectContaining({ id: draftOnly.id }),
    );
    expect(internalLinksFor(draftOnly, [figs, dates])).toEqual([]);
  });

  it('keeps V3C.7 and V3C.8 public inputs intact', () => {
    expect(
      PUBLIC_FOOD_CONTENT.map((item) => item.canonicalTargetId).sort(),
    ).toEqual(['dates', 'figs']);
    expect(PUBLIC_FOOD_CONTENT.every((item) => item.seo.schemaEligible)).toBe(
      true,
    );
  });
});

describe('V3C.22 internal link optimization audit', () => {
  const figs = PUBLIC_FOOD_CONTENT.find(
    (item) => item.canonicalTargetId === 'figs',
  )!;
  const dates = PUBLIC_FOOD_CONTENT.find(
    (item) => item.canonicalTargetId === 'dates',
  )!;

  it('accepts the existing public relationship set without optimization issues', () => {
    expect(auditInternalLinks(figs, PUBLIC_FOOD_CONTENT)).toEqual([]);
  });

  it('keeps unresolved non-public relationships visible without generating a URL', () => {
    const draftOnly = {
      ...dates,
      id: 'content-olives-test',
      canonicalTargetId: 'olives',
      canonicalPath: '/ingredients/olives/',
      publicationStatus: 'draft' as const,
      workflowStatus: 'research-in-progress' as const,
      seo: { ...dates.seo, indexable: false },
    };

    const issues = auditInternalLinks(figs, [figs, draftOnly]);
    expect(issues).toContainEqual(
      expect.objectContaining({
        code: 'non-public-destination',
        targetId: draftOnly.id,
      }),
    );
    expect(issues).toContainEqual(
      expect.objectContaining({
        code: 'unresolved-public-destination',
        targetId: draftOnly.id,
      }),
    );
    expect(internalLinksFor(figs, [figs, draftOnly])).toEqual([]);
  });

  it('detects invalid SEO targets and canonical route mismatches', () => {
    const invalid = {
      ...dates,
      canonicalTargetId: 'missing-target',
      canonicalPath: '/fabricated/',
    };

    expect(auditInternalLinks(invalid, [invalid])).toContainEqual(
      expect.objectContaining({ code: 'invalid-source-target' }),
    );
  });

  it('detects duplicate destinations and self-link relationships', () => {
    const duplicate = {
      ...dates,
      id: 'content-dates-duplicate',
      canonicalPath: figs.canonicalPath,
    };

    const issues = auditInternalLinks(figs, [figs, dates, duplicate]);
    expect(issues).toContainEqual(
      expect.objectContaining({
        code: 'self-link',
        targetId: duplicate.id,
      }),
    );

    const sameDestination = {
      ...dates,
      id: 'content-dates-same-destination',
    };
    expect(
      auditInternalLinks(figs, [figs, dates, sameDestination]),
    ).toContainEqual(
      expect.objectContaining({
        code: 'duplicate-destination',
        targetId: sameDestination.id,
      }),
    );
  });

  it('connects article and recipe records to canonical Food Universe IDs without minting draft URLs', () => {
    const relationships = canonicalContentRelationships();
    const articleToFigs = relationships.find(
      (relationship) =>
        relationship.fromId === 'article-figs-research-context' &&
        relationship.toId === 'figs-entity' &&
        relationship.kind === 'article-food',
    );
    const recipeToLentils = relationships.find(
      (relationship) =>
        relationship.fromId === 'recipe-content-lentil-pottage' &&
        relationship.toId === 'lentils-entity' &&
        relationship.kind === 'recipe-food',
    );

    expect(articleToFigs?.href).toBe('/ingredients/figs/');
    expect(recipeToLentils?.href).toBeUndefined();
    expect(CANONICAL_FOOD_UNIVERSE.some((food) => food.id === 'lentils-entity')).toBe(true);
  });

  it('infers article backlinks so relationship coverage does not require duplicate declarations', () => {
    const relationships = canonicalRelationshipsFor('article-barley-biblical-evidence');

    expect(relationships).toContainEqual(
      expect.objectContaining({
        fromId: 'article-barley-biblical-evidence',
        toId: 'question-what-does-barley-evidence-support',
        kind: 'article-related',
        direction: 'explicit',
      }),
    );
    expect(relationships).toContainEqual(
      expect.objectContaining({
        fromId: 'question-what-does-barley-evidence-support',
        toId: 'article-barley-biblical-evidence',
        kind: 'article-related',
        direction: 'inferred-backlink',
      }),
    );
  });

  it('keeps the canonical relationship graph integrity clean', () => {
    expect(canonicalRelationshipAudit()).toEqual([]);
  });
});
