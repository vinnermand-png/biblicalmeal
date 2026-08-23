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
