import { ARTICLE_CONTENT_RECORDS } from '../article-content/records';
import { CITATION_RECORDS } from '../authority/records';
import { CANONICAL_FOOD_UNIVERSE } from '../food-universe-registry';
import { RESEARCH_DOSSIERS } from '../research/dossiers';
import { SEO_TARGETS } from '../seo-master-map';
import { AI_WEBSITE_CONTENT_RECORDS } from './records';
import type { WebsiteContentDraft } from './types';

const articleIds = new Set(ARTICLE_CONTENT_RECORDS.map((record) => record.id));
const dossierIds = new Set(RESEARCH_DOSSIERS.map((record) => record.id));
const citationIds = new Set(CITATION_RECORDS.map((record) => record.id));
const foodIds = new Set(CANONICAL_FOOD_UNIVERSE.map((record) => record.id));

export function auditAiWebsiteContentEngine(
  records: readonly WebsiteContentDraft[] = AI_WEBSITE_CONTENT_RECORDS,
): string[] {
  const issues: string[] = [];
  const ids = new Set<string>();
  const sourceOwners = new Set<string>();

  for (const record of records) {
    if (!record.id.trim())
      issues.push('AI website draft is missing a canonical ID.');
    if (ids.has(record.id))
      issues.push(`Duplicate AI website draft ID: ${record.id}.`);
    ids.add(record.id);

    if (sourceOwners.has(record.sourceArticleContentId)) {
      issues.push(
        `Duplicate AI website draft ownership: ${record.sourceArticleContentId}.`,
      );
    }
    sourceOwners.add(record.sourceArticleContentId);

    if (!articleIds.has(record.sourceArticleContentId)) {
      issues.push(`Unknown canonical article source: ${record.id}.`);
    }

    const target = SEO_TARGETS.find((item) => item.id === record.targetId);
    if (!target) {
      issues.push(`Unknown canonical SEO target: ${record.id}.`);
    } else if (target.targetRoute !== record.canonicalRoute) {
      issues.push(
        `AI website draft route is not the canonical target route: ${record.id}.`,
      );
    }

    if (record.researchDossierIds.some((id) => !dossierIds.has(id))) {
      issues.push(
        `Unknown canonical research dossier reference: ${record.id}.`,
      );
    }
    if (record.foodIds.some((id) => !foodIds.has(id))) {
      issues.push(`Unknown canonical food reference: ${record.id}.`);
    }
    if (record.citationIds.some((id) => !citationIds.has(id))) {
      issues.push(`Unknown canonical citation reference: ${record.id}.`);
    }

    if (!record.qa.noUnsupportedClaims) {
      issues.push(`Unsupported claim QA failure: ${record.id}.`);
    }
    if (!record.qa.citationsTraceable) {
      issues.push(`Untraceable citation QA failure: ${record.id}.`);
    }
    if (!record.qa.uncertaintyPreserved) {
      issues.push(`Unresolved uncertainty was not preserved: ${record.id}.`);
    }
    if (!record.qa.canonicalRouteMatchesTarget) {
      issues.push(`Canonical route QA failure: ${record.id}.`);
    }

    if (!record.adminReviewRequired) {
      issues.push(`AI website draft bypasses admin review: ${record.id}.`);
    }
    if (!record.requiresExistingPublicationGates) {
      issues.push(
        `AI website draft bypasses existing publication gates: ${record.id}.`,
      );
    }
    if (record.publicationEligible) {
      issues.push(
        `AI website draft cannot grant itself publication eligibility: ${record.id}.`,
      );
    }
    if (
      record.pipelineStatus === 'ready-for-existing-publication-gates' &&
      !record.requiresExistingPublicationGates
    ) {
      issues.push(`Publication hand-off bypass detected: ${record.id}.`);
    }
  }

  return issues;
}
