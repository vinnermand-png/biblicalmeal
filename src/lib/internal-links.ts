import type { ContentPlan } from '../data/content/model';
import { isContentPublicationEligible } from '../data/content/validation';
import { PUBLIC_FOOD_DRAFTS } from '../data/content/public';
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
