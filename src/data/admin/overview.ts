import { ARTICLE_CONTENT_RECORDS } from '../article-content/records';
import { AUTHORITY_RECORDS, CITATION_RECORDS } from '../authority/records';
import { COOKBOOK_RECORDS } from '../cookbook-production/records';
import { CANONICAL_FOOD_UNIVERSE } from '../food-universe-registry';
import { CONTENT_REFRESH_RECORDS } from '../content-refresh';
import { RECIPE_CONTENT_RECORDS } from '../recipe-content/records';
import { RECIPE_RESEARCH_RECORDS } from '../recipe-research/records';
import { RESEARCH_DOSSIERS } from '../research/dossiers';
import { SEO_TARGETS } from '../seo-master-map';
import { SERP_SNAPSHOTS } from '../serp-monitoring';
import { INSTAGRAM_CONTENT_RECORDS } from '../instagram-content/records';
import { AI_WEBSITE_CONTENT_RECORDS } from '../ai-website-content/records';
import { AI_EDITORIAL_IMAGE_ASSET_RECORDS } from '../ai-editorial-image/records';
import { ANALYTICS_MEASUREMENTS, ANALYTICS_PROVIDER } from '../analytics-measurement';
import type { AdminMutationAttempt, AdminMutationDecision, AdminOverview, AdminWorkflowItem } from './types';

const workflowItems: AdminWorkflowItem[] = [
  ...ARTICLE_CONTENT_RECORDS.map((record) => ({ kind: 'article-content' as const, id: record.id, label: record.title, stage: `${record.productionStatus} / ${record.editorialReviewStatus}`, publicationState: record.publicationStatus, publicationEligible: record.publicationEligible, relationships: [...record.researchDossierIds, ...record.foodIds], blockers: record.publicationEligible ? [] : ['Existing research and editorial publication gates remain authoritative.'] })),
  ...RECIPE_RESEARCH_RECORDS.map((record) => ({ kind: 'recipe-research' as const, id: record.id, label: record.name, stage: `${record.researchStatus} / ${record.reconstructionStatus}`, publicationState: record.publicationStatus, publicationEligible: record.publicationStatus === 'eligible', relationships: [...record.foodIds], blockers: record.unresolvedQuestions })),
  ...RECIPE_CONTENT_RECORDS.map((record) => ({ kind: 'recipe-content' as const, id: record.id, label: record.title, route: `/recipes/${record.slug}/`, stage: `${record.productionStatus} / ${record.editorialReviewStatus}`, publicationState: record.publicationStatus, publicationEligible: record.publicationEligible, relationships: [record.recipeResearchId, ...record.relatedFoodIds], blockers: record.publicationEligible ? [] : ['Recipe remains subject to canonical research, reconstruction and editorial publication gates.'] })),
  ...COOKBOOK_RECORDS.map((record) => ({ kind: 'cookbook' as const, id: record.id, label: record.title, stage: record.productionStatus, publicationState: record.publicationStatus, publicationEligible: record.publicationEligible, relationships: record.recipeContentIds, blockers: record.publicationEligible ? [] : ['Cookbook production does not promote draft recipes or bypass recipe publication gates.'] })),
  ...INSTAGRAM_CONTENT_RECORDS.map((record) => ({ kind: 'instagram-content' as const, id: record.id, label: record.title, stage: `${record.status} / ${record.mode}`, publicationState: record.externalProductionApproved ? 'approved-for-external-production' : 'not-approved-for-external-production', publicationEligible: record.publicationEligible, relationships: [...record.canonicalSources.map((source) => source.id), ...record.sourceImageAssetIds], blockers: ['Social content remains traceable to canonical content, evidence, citation and authority relationships.', 'Generated social drafts require validation and admin review and cannot inherit publication authority automatically.', 'No Instagram publishing integration is configured.'] })),
  ...AI_WEBSITE_CONTENT_RECORDS.map((record) => ({ kind: 'ai-website-content' as const, id: record.id, label: record.title, route: record.canonicalRoute, stage: record.pipelineStatus, publicationState: 'not-eligible', publicationEligible: record.publicationEligible, relationships: record.sourceRefs.map((source) => source.id), blockers: ['Prototype output remains a non-public draft.', 'Admin review and existing research, authority, citation, editorial and publication gates remain authoritative.', 'No external AI provider is configured in this repository.'] })),
  ...AI_EDITORIAL_IMAGE_ASSET_RECORDS.map((record) => ({ kind: 'ai-editorial-image' as const, id: record.id, label: record.brief.purpose, route: record.canonicalRoute, stage: record.pipelineStatus, publicationState: record.manifestAssignmentStatus, publicationEligible: record.publicationEligible, relationships: [record.sourceWebsiteContentId], blockers: ['Generated assets remain editorial/illustrative and are not documentary evidence.', 'Validation, admin review and existing publication gates remain authoritative.', 'No generated asset is added to the canonical editorial manifest automatically.'] })),
];

export function buildAdminOverview(): AdminOverview {
  return { accessMode: 'read-only', metrics: [
    { id: 'foods', label: 'Canonical foods', value: CANONICAL_FOOD_UNIVERSE.length, note: 'Food Universe remains canonical ownership.' },
    { id: 'research', label: 'Research dossiers', value: RESEARCH_DOSSIERS.length, note: 'Research completion remains independent of publication.' },
    { id: 'articles', label: 'Article and question records', value: ARTICLE_CONTENT_RECORDS.length, note: 'Content records remain evidence-bound.' },
    { id: 'recipe-research', label: 'Recipe research records', value: RECIPE_RESEARCH_RECORDS.length, note: 'Research and reconstruction remain separate.' },
    { id: 'recipe-content', label: 'Recipe content records', value: RECIPE_CONTENT_RECORDS.length, note: 'Recipe ownership remains in V3C.18.' },
    { id: 'cookbooks', label: 'Cookbook records', value: COOKBOOK_RECORDS.length, note: 'Cookbook inclusion does not publish recipes.' },
    { id: 'instagram', label: 'Instagram content records', value: INSTAGRAM_CONTENT_RECORDS.length, note: 'Social drafts remain evidence-bound and separate from verified research and external publishing.' },
    { id: 'ai-website', label: 'AI website prototype drafts', value: AI_WEBSITE_CONTENT_RECORDS.length, note: 'Website prototypes are evidence-bound drafts with no publication authority.' },
    { id: 'ai-editorial-images', label: 'AI editorial image prototypes', value: AI_EDITORIAL_IMAGE_ASSET_RECORDS.length, note: 'Image candidates remain outside the canonical manifest until validation and review.' },
    { id: 'authority', label: 'Authority records', value: AUTHORITY_RECORDS.length, note: `${CITATION_RECORDS.length} citation records are visible through canonical traceability.` },
    { id: 'seo', label: 'SEO targets', value: SEO_TARGETS.length, note: `${SERP_SNAPSHOTS.length} imported SERP snapshots; missing data is not fabricated.` },
    { id: 'analytics', label: 'Analytics measurements', value: ANALYTICS_MEASUREMENTS.length, note: `${ANALYTICS_PROVIDER.status} provider boundary; missing traffic data is not fabricated.` },
    { id: 'refresh', label: 'Refresh records', value: CONTENT_REFRESH_RECORDS.length, note: 'No refresh is created automatically from missing data.' },
  ], workflowItems, warnings: [
    'The administration foundation is read-only because the current static repository has no authenticated persistence layer.',
    'Analytics and Search Console visibility expose only verified imported measurements; missing provider data is never converted into zero performance.',
    'Social, website and image AI pipelines expose status without granting authority to generate, approve or publish content automatically.',
    'Status visibility does not grant authority to rewrite, approve or publish canonical records.',
    'Future mutations must resolve to the existing canonical owners and pass their existing research, authority, citation, editorial and publication gates.',
  ] };
}
export const ADMIN_OVERVIEW = buildAdminOverview();
export function evaluateAdminMutation(attempt: AdminMutationAttempt): AdminMutationDecision { void attempt; return { allowed: false, reason: 'The admin foundation exposes canonical status and readiness only. It has no mutation or publication authority and cannot bypass canonical gates.' }; }
