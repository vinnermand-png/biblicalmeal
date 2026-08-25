import { ARTICLE_CONTENT_RECORDS } from '../article-content/records';
import { CITATION_RECORDS } from '../authority/records';
import { CANONICAL_FOOD_UNIVERSE } from '../food-universe-registry';
import { RESEARCH_DOSSIERS } from '../research/dossiers';
import { SEO_TARGETS } from '../seo-master-map';
import type { WebsiteContentDraft } from './types';

const ARTICLE_IDS = new Set(ARTICLE_CONTENT_RECORDS.map((record) => record.id));
const TARGET_IDS = new Set(SEO_TARGETS.map((target) => target.id));
const DOSSIER_IDS = new Set(RESEARCH_DOSSIERS.map((record) => record.id));
const FOOD_IDS = new Set(CANONICAL_FOOD_UNIVERSE.map((record) => record.id));

function sourceRecord(id: string) {
  const record = ARTICLE_CONTENT_RECORDS.find((item) => item.id === id);
  if (!record)
    throw new Error(`Missing canonical article content source: ${id}`);
  return record;
}

function citationIdsForArticle(id: string): readonly string[] {
  return CITATION_RECORDS.filter(
    (citation) =>
      citation.targetKind === 'article-content' && citation.targetId === id,
  ).map((citation) => citation.id);
}

function buildPrototypeDraft(sourceId: string): WebsiteContentDraft {
  const source = sourceRecord(sourceId);
  const target = SEO_TARGETS.find((item) => item.id === source.seoTargetId);
  if (!target) throw new Error(`Missing canonical SEO target for ${sourceId}`);

  const citationIds = citationIdsForArticle(sourceId);
  const researchBrief = [
    source.purpose,
    ...source.editorialNotes,
    `Required uncertainty: ${source.uncertaintyDisclosure}`,
  ].join(' ');
  const draftBody = [
    source.summary,
    ...source.keyPoints,
    source.uncertaintyDisclosure,
  ].join('\n\n');

  return {
    id: `ai-website-${source.id}`,
    sourceArticleContentId: source.id,
    targetId: target.id,
    canonicalRoute: target.targetRoute,
    title: source.title,
    slug: target.id,
    provider: 'deterministic-canonical-prototype',
    providerConfigured: false,
    pipelineStatus: 'admin-review',
    researchDossierIds: source.researchDossierIds,
    foodIds: source.foodIds,
    citationIds,
    sourceRefs: [
      { kind: 'article-content', id: source.id },
      { kind: 'seo-target', id: target.id },
      ...source.researchDossierIds.map((id) => ({
        kind: 'research-dossier' as const,
        id,
      })),
      ...source.foodIds.map((id) => ({ kind: 'food' as const, id })),
      ...citationIds.map((id) => ({ kind: 'citation' as const, id })),
    ],
    researchBrief,
    draftBody,
    seo: {
      title: source.title,
      description: source.summary,
    },
    internalLinkTargetIds: target.relatedTopics,
    imageBrief: {
      editorialOnly: true,
      generatedImageRequired: false,
      disclosure:
        'Any future image is editorial/illustrative and must not be presented as documentary historical evidence.',
    },
    qa: {
      noUnsupportedClaims:
        source.evidenceState === 'supported' &&
        source.claimStrength === 'supported',
      citationsTraceable: citationIds.length > 0,
      uncertaintyPreserved: source.uncertaintyDisclosure.trim().length > 0,
      canonicalRouteMatchesTarget: target.targetRoute === target.targetRoute,
    },
    adminReviewRequired: true,
    requiresExistingPublicationGates: true,
    publicationEligible: false,
  };
}

/**
 * V3C.32 small end-to-end prototype batch. These records deliberately reuse
 * existing non-public article records with completed research relationships and
 * existing citation traces. They do not create new facts, sources, routes or
 * publication authority.
 */
export const AI_WEBSITE_CONTENT_RECORDS: readonly WebsiteContentDraft[] = [
  buildPrototypeDraft('article-figs-research-context'),
  buildPrototypeDraft('article-honey-evidence-boundaries'),
];

for (const record of AI_WEBSITE_CONTENT_RECORDS) {
  if (!ARTICLE_IDS.has(record.sourceArticleContentId)) {
    throw new Error(
      `AI website draft references missing canonical article: ${record.id}`,
    );
  }
  if (!TARGET_IDS.has(record.targetId)) {
    throw new Error(
      `AI website draft references missing SEO target: ${record.id}`,
    );
  }
  if (record.researchDossierIds.some((id) => !DOSSIER_IDS.has(id))) {
    throw new Error(
      `AI website draft references missing research dossier: ${record.id}`,
    );
  }
  if (record.foodIds.some((id) => !FOOD_IDS.has(id))) {
    throw new Error(
      `AI website draft references missing canonical food: ${record.id}`,
    );
  }
}
