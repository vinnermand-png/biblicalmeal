import type { ContentPlan } from '../data/content/model';
import { isContentPublicationEligible } from '../data/content/validation';
import {
  PUBLIC_FOOD_CONTENT,
  PUBLIC_FOOD_DRAFTS,
} from '../data/content/public';
import { ARTICLE_CONTENT_RECORDS } from '../data/article-content/records';
import { RECIPE_CONTENT_RECORDS } from '../data/recipe-content/records';
import { CANONICAL_FOOD_UNIVERSE } from '../data/food-universe-registry';
import { SEO_TARGETS } from '../data/seo-master-map';

export interface InternalLink {
  id: string;
  title: string;
  href: string;
  relationship: 'explicit-related' | 'shared-cluster' | 'parent-topic';
}

export type InternalLinkAuditCode =
  | 'invalid-source-target'
  | 'invalid-target'
  | 'canonical-path-mismatch'
  | 'self-link'
  | 'duplicate-destination'
  | 'non-public-destination'
  | 'unresolved-public-destination';

export interface InternalLinkAuditIssue {
  code: InternalLinkAuditCode;
  sourceId: string;
  targetId?: string;
  message: string;
}

function isPubliclyLinkable(content: ContentPlan): boolean {
  const draft = PUBLIC_FOOD_DRAFTS.find(
    (item) => item.contentItemId === content.id,
  );

  if (!draft) return false;

  return (
    content.publicationStatus === 'published' &&
    content.workflowStatus === 'approved' &&
    content.seo.indexable &&
    isContentPublicationEligible(content, draft)
  );
}

function relationshipFor(
  source: ContentPlan,
  candidate: ContentPlan,
): InternalLink['relationship'] | undefined {
  if (source.relatedContentIds.includes(candidate.id))
    return 'explicit-related';

  const sourceTarget = SEO_TARGETS.find(
    (target) => target.id === source.canonicalTargetId,
  );
  const candidateTarget = SEO_TARGETS.find(
    (target) => target.id === candidate.canonicalTargetId,
  );
  if (!sourceTarget || !candidateTarget) return undefined;

  if (
    sourceTarget.relatedTopics.includes(candidate.canonicalTargetId) ||
    candidateTarget.relatedTopics.includes(source.canonicalTargetId)
  ) {
    return 'explicit-related';
  }

  if (
    sourceTarget.parentTopic === candidate.canonicalTargetId ||
    candidateTarget.parentTopic === source.canonicalTargetId
  ) {
    return 'parent-topic';
  }

  if (sourceTarget.cluster === candidateTarget.cluster) return 'shared-cluster';

  return undefined;
}

export function auditInternalLinks(
  source: ContentPlan,
  content: readonly ContentPlan[],
): InternalLinkAuditIssue[] {
  const issues: InternalLinkAuditIssue[] = [];
  const sourceTarget = SEO_TARGETS.find(
    (target) => target.id === source.canonicalTargetId,
  );

  if (!sourceTarget) {
    issues.push({
      code: 'invalid-source-target',
      sourceId: source.id,
      message: `Missing canonical SEO target: ${source.canonicalTargetId}`,
    });
    return issues;
  }

  if (source.canonicalPath !== sourceTarget.targetRoute) {
    issues.push({
      code: 'canonical-path-mismatch',
      sourceId: source.id,
      message: `Canonical path does not match SEO target route: ${source.id}`,
    });
  }

  const seenDestinations = new Set<string>();

  for (const candidate of content) {
    if (candidate.id === source.id) continue;

    const relationship = relationshipFor(source, candidate);
    if (!relationship) continue;

    const candidateTarget = SEO_TARGETS.find(
      (target) => target.id === candidate.canonicalTargetId,
    );
    if (!candidateTarget) {
      issues.push({
        code: 'invalid-target',
        sourceId: source.id,
        targetId: candidate.id,
        message: `Related content has no canonical SEO target: ${candidate.canonicalTargetId}`,
      });
      continue;
    }

    if (candidate.canonicalPath !== candidateTarget.targetRoute) {
      issues.push({
        code: 'canonical-path-mismatch',
        sourceId: source.id,
        targetId: candidate.id,
        message: `Canonical path does not match SEO target route: ${candidate.id}`,
      });
    }

    if (candidate.canonicalPath === source.canonicalPath) {
      issues.push({
        code: 'self-link',
        sourceId: source.id,
        targetId: candidate.id,
        message: `Related content resolves to the source canonical URL: ${candidate.id}`,
      });
      continue;
    }

    if (seenDestinations.has(candidate.canonicalPath)) {
      issues.push({
        code: 'duplicate-destination',
        sourceId: source.id,
        targetId: candidate.id,
        message: `Duplicate canonical destination: ${candidate.canonicalPath}`,
      });
    } else {
      seenDestinations.add(candidate.canonicalPath);
    }

    if (!isPubliclyLinkable(candidate)) {
      issues.push({
        code: 'non-public-destination',
        sourceId: source.id,
        targetId: candidate.id,
        message: `Related content is not a public link destination: ${candidate.id}`,
      });
      issues.push({
        code: 'unresolved-public-destination',
        sourceId: source.id,
        targetId: candidate.id,
        message: `Relationship remains unresolved for public linking: ${candidate.id}`,
      });
    }
  }

  return issues;
}

export function internalLinksFor(
  source: ContentPlan,
  content: readonly ContentPlan[],
): InternalLink[] {
  if (!isPubliclyLinkable(source)) return [];

  const seen = new Set<string>();

  return content
    .filter((candidate) => candidate.id !== source.id)
    .filter(isPubliclyLinkable)
    .map((candidate) => {
      const relationship = relationshipFor(source, candidate);
      if (!relationship || seen.has(candidate.canonicalPath)) return undefined;
      seen.add(candidate.canonicalPath);
      return {
        id: candidate.id,
        title: candidate.title,
        href: candidate.canonicalPath,
        relationship,
      } satisfies InternalLink;
    })
    .filter((link): link is InternalLink => link !== undefined);
}

/**
 * V3C.22 extends the existing canonical internal-link layer with a relationship
 * graph for content that is not yet public. It deliberately does not mint URLs
 * for drafts: public hrefs remain owned by the existing publication and SEO
 * systems, while Food Universe IDs remain the shared relationship key.
 */
export type CanonicalRelationshipKind =
  'food-related' | 'article-food' | 'recipe-food' | 'article-related';

export type CanonicalRelationshipDirection = 'explicit' | 'inferred-backlink';

export interface CanonicalContentRelationship {
  fromId: string;
  toId: string;
  kind: CanonicalRelationshipKind;
  direction: CanonicalRelationshipDirection;
  href?: string;
}

export type CanonicalRelationshipAuditCode =
  | 'invalid-food-target'
  | 'excluded-food-target'
  | 'self-relationship'
  | 'duplicate-relationship';

export interface CanonicalRelationshipAuditIssue {
  code: CanonicalRelationshipAuditCode;
  fromId: string;
  toId: string;
  message: string;
}

function publicHrefForFood(foodId: string): string | undefined {
  const food = CANONICAL_FOOD_UNIVERSE.find(
    (candidate) => candidate.id === foodId,
  );
  if (!food?.canonicalTargetId) return undefined;

  const publicContent = PUBLIC_FOOD_CONTENT.find(
    (candidate) => candidate.canonicalTargetId === food.canonicalTargetId,
  );

  return publicContent?.canonicalPath;
}

function addRelationship(
  relationships: CanonicalContentRelationship[],
  relationship: CanonicalContentRelationship,
) {
  relationships.push(relationship);
}

export function canonicalContentRelationships(): CanonicalContentRelationship[] {
  const relationships: CanonicalContentRelationship[] = [];

  for (const food of CANONICAL_FOOD_UNIVERSE) {
    for (const relatedFoodId of food.relatedFoodIds) {
      addRelationship(relationships, {
        fromId: food.id,
        toId: relatedFoodId,
        kind: 'food-related',
        direction: 'explicit',
        href: publicHrefForFood(relatedFoodId),
      });
    }
  }

  for (const article of ARTICLE_CONTENT_RECORDS) {
    for (const foodId of article.foodIds) {
      const href = publicHrefForFood(foodId);
      addRelationship(relationships, {
        fromId: article.id,
        toId: foodId,
        kind: 'article-food',
        direction: 'explicit',
        ...(href ? { href } : {}),
      });
    }

    for (const relatedContentId of article.relatedContentIds) {
      addRelationship(relationships, {
        fromId: article.id,
        toId: relatedContentId,
        kind: 'article-related',
        direction: 'explicit',
      });
      addRelationship(relationships, {
        fromId: relatedContentId,
        toId: article.id,
        kind: 'article-related',
        direction: 'inferred-backlink',
      });
    }
  }

  for (const recipe of RECIPE_CONTENT_RECORDS) {
    for (const foodId of recipe.relatedFoodIds) {
      const href = publicHrefForFood(foodId);
      addRelationship(relationships, {
        fromId: recipe.id,
        toId: foodId,
        kind: 'recipe-food',
        direction: 'explicit',
        ...(href ? { href } : {}),
      });
    }
  }

  return relationships;
}

export function canonicalRelationshipAudit(
  relationships: readonly CanonicalContentRelationship[] = canonicalContentRelationships(),
): CanonicalRelationshipAuditIssue[] {
  const issues: CanonicalRelationshipAuditIssue[] = [];
  const foodById = new Map(
    CANONICAL_FOOD_UNIVERSE.map((food) => [food.id, food]),
  );
  const knownArticleIds = new Set(
    ARTICLE_CONTENT_RECORDS.map((article) => article.id),
  );
  const seen = new Set<string>();

  for (const relationship of relationships) {
    if (relationship.fromId === relationship.toId) {
      issues.push({
        code: 'self-relationship',
        fromId: relationship.fromId,
        toId: relationship.toId,
        message: 'Canonical content cannot relate to itself.',
      });
    }

    const key = `${relationship.fromId}:${relationship.toId}:${relationship.kind}:${relationship.direction}`;
    if (seen.has(key)) {
      issues.push({
        code: 'duplicate-relationship',
        fromId: relationship.fromId,
        toId: relationship.toId,
        message: `Duplicate canonical relationship: ${key}`,
      });
    }
    seen.add(key);

    if (
      relationship.kind === 'food-related' ||
      relationship.kind === 'article-food' ||
      relationship.kind === 'recipe-food'
    ) {
      const food = foodById.get(relationship.toId);
      if (!food) {
        issues.push({
          code: 'invalid-food-target',
          fromId: relationship.fromId,
          toId: relationship.toId,
          message: `Unknown canonical Food Universe id: ${relationship.toId}`,
        });
      } else if (food.stage === 'excluded') {
        issues.push({
          code: 'excluded-food-target',
          fromId: relationship.fromId,
          toId: relationship.toId,
          message: `Excluded food cannot be used as a canonical relationship target: ${relationship.toId}`,
        });
      }
    }

    if (
      relationship.kind === 'article-related' &&
      !knownArticleIds.has(relationship.toId)
    ) {
      issues.push({
        code: 'invalid-food-target',
        fromId: relationship.fromId,
        toId: relationship.toId,
        message: `Unknown article content id: ${relationship.toId}`,
      });
    }
  }

  return issues;
}

export function canonicalRelationshipsFor(
  contentId: string,
): CanonicalContentRelationship[] {
  return canonicalContentRelationships().filter(
    (relationship) =>
      relationship.fromId === contentId || relationship.toId === contentId,
  );
}
