/** Internal first-wave content plans and two architecture-only pilot drafts. */
import { CONTENT_DRAFT_TARGET_IDS, CONTENT_PLAN_TARGET_IDS } from './catalog';
import type {
  CanonicalContentType,
  ContentDraft,
  ContentPlan,
  ContentSection,
} from './model';
import { SEO_TARGETS } from '../seo-master-map';
import { CONTENT_BRIEFS } from '../content-briefs';
import { RESEARCH_DOSSIERS } from '../research/dossiers';
import { RESEARCH_CLAIMS } from '../research/claims';
import { questionsForSubject } from '../research/questions';
import type { ResearchDossier } from '../research/types';

const SECTION_HEADINGS: Record<string, string> = {
  introduction: 'Introduction',
  'biblical-references': 'Biblical references',
  'biblical-context': 'Biblical context',
  'historical-context': 'Historical context',
  'archaeological-evidence': 'Archaeological evidence',
  'food-use': 'Food use',
  uncertainty: 'What remains uncertain',
  'related-passages': 'Related passages',
  'related-foods': 'Related foods',
  methodology: 'Methodology',
  'recipe-notes': 'Recipe notes',
};

const TYPE_BY_TARGET: Record<string, CanonicalContentType> = {
  figs: 'ingredient',
  olives: 'ingredient',
  lentils: 'ingredient',
  barley: 'ingredient',
  dates: 'ingredient',
  honey: 'ingredient',
  'foods-of-the-bible': 'cornerstone',
  'what-did-jesus-eat': 'cornerstone',
  'food-in-biblical-times': 'contextual',
};

const SECTION_KINDS: Record<string, string[]> = {
  figs: [
    'introduction',
    'biblical-references',
    'historical-context',
    'archaeological-evidence',
    'uncertainty',
    'related-foods',
  ],
  olives: [
    'introduction',
    'biblical-references',
    'historical-context',
    'archaeological-evidence',
    'food-use',
    'uncertainty',
  ],
  lentils: [
    'introduction',
    'biblical-references',
    'historical-context',
    'archaeological-evidence',
    'food-use',
    'uncertainty',
  ],
  barley: [
    'introduction',
    'biblical-references',
    'historical-context',
    'food-use',
    'uncertainty',
  ],
  dates: [
    'introduction',
    'biblical-references',
    'historical-context',
    'archaeological-evidence',
    'food-use',
    'uncertainty',
  ],
  honey: [
    'introduction',
    'biblical-references',
    'historical-context',
    'food-use',
    'uncertainty',
  ],
  'foods-of-the-bible': [
    'introduction',
    'biblical-references',
    'methodology',
    'uncertainty',
    'related-foods',
  ],
  'what-did-jesus-eat': [
    'introduction',
    'biblical-references',
    'biblical-context',
    'historical-context',
    'uncertainty',
  ],
  'food-in-biblical-times': [
    'introduction',
    'biblical-context',
    'historical-context',
    'archaeological-evidence',
    'methodology',
    'uncertainty',
  ],
};

function dossierForTarget(targetId: string): ResearchDossier {
  const dossier = RESEARCH_DOSSIERS.find((item) =>
    item.relatedTargetIds.includes(targetId),
  );
  if (!dossier)
    throw new Error(`Missing dossier for content target ${targetId}`);
  return dossier;
}

function sectionMode(kind: string): ContentSection['mode'] {
  if (kind === 'introduction' || kind === 'related-foods')
    return 'editorial-only';
  if (kind === 'uncertainty') return 'disclosure-focused';
  return 'evidence-backed';
}

function buildSections(
  targetId: string,
  dossier: ResearchDossier,
): ContentSection[] {
  const claims = RESEARCH_CLAIMS.filter((claim) =>
    [dossier.subjectId, ...dossier.relatedTargetIds].includes(claim.subjectId),
  );
  const questions = questionsForSubject(dossier.subjectId).concat(
    ...dossier.relatedTargetIds.map(questionsForSubject),
  );
  return (SECTION_KINDS[targetId] ?? []).map((kind) => {
    const mode =
      kind === 'uncertainty' && questions.length === 0
        ? 'editorial-only'
        : sectionMode(kind);
    return {
      id: `${targetId}-${kind}`,
      kind: kind as ContentSection['kind'],
      heading: SECTION_HEADINGS[kind],
      mode,
      evidence: {
        claimIds:
          mode === 'editorial-only' ? [] : claims.map((claim) => claim.id),
        sourceIds:
          mode === 'editorial-only'
            ? []
            : [
                ...new Set(
                  claims.flatMap((claim) =>
                    claim.supports.map((support) => support.sourceId),
                  ),
                ),
              ],
        scriptureRefs:
          mode === 'editorial-only'
            ? []
            : claims.flatMap((claim) =>
                claim.scriptureContext
                  ? [claim.scriptureContext.reference]
                  : [],
              ),
        questionIds:
          mode === 'disclosure-focused' ? questions.map((q) => q.id) : [],
      },
    };
  });
}

function buildPlan(targetId: string): ContentPlan {
  const target = SEO_TARGETS.find((item) => item.id === targetId);
  if (!target)
    throw new Error(`Missing SEO target for content plan ${targetId}`);
  const dossier = dossierForTarget(targetId);
  const brief = CONTENT_BRIEFS.find((item) => item.targetId === targetId);
  const questions = questionsForSubject(dossier.subjectId).concat(
    ...dossier.relatedTargetIds.map(questionsForSubject),
  );
  const sections = buildSections(targetId, dossier);
  return {
    id: `content-${targetId}`,
    subjectId: dossier.subjectId,
    canonicalTargetId: targetId,
    contentType: TYPE_BY_TARGET[targetId],
    canonicalPath: target.targetRoute,
    title: target.topic,
    searchIntent: target.intent,
    primaryTopic: target.primaryKeyword,
    workflowStatus:
      dossier.researchStatus === 'complete'
        ? 'research-complete'
        : 'research-in-progress',
    publicationStatus: 'draft',
    dossierId: dossier.id,
    briefId: brief?.id,
    briefStatus: brief?.status,
    seo: {
      seoTargetId: target.id,
      canonicalPath: target.targetRoute,
      indexable: false,
      schemaEligible: false,
    },
    ownership: 'primary',
    relatedContentIds: [],
    scope: `Internal planning scope for ${target.topic}; final prose is deferred to a later phase.`,
    requiredEvidenceKinds:
      targetId === 'food-in-biblical-times'
        ? ['scripture', 'academic', 'archaeological']
        : ['scripture'],
    forbiddenClaims: [
      'Do not promote unsupported historical or recipe claims.',
    ],
    requiredDisclosureQuestionIds: questions
      .filter(
        (q) => q.resolution === 'warning' || q.resolution === 'research-task',
      )
      .map((q) => q.id),
    sections,
  };
}

export const FIRST_WAVE_CONTENT_PLANS = CONTENT_PLAN_TARGET_IDS.map(buildPlan);

export const PILOT_CONTENT_ITEMS = FIRST_WAVE_CONTENT_PLANS.filter((plan) =>
  CONTENT_DRAFT_TARGET_IDS.includes(plan.canonicalTargetId as never),
);

export const PILOT_CONTENT_DRAFTS: ContentDraft[] = PILOT_CONTENT_ITEMS.map(
  (item) => ({
    id: `draft-${item.canonicalTargetId}`,
    contentItemId: item.id,
    status: 'draft',
    workflowStatus: item.workflowStatus,
    title: item.title,
    sections: item.sections,
    claimIds: item.sections.flatMap((section) => section.evidence.claimIds),
    scriptureRefs: item.sections.flatMap(
      (section) => section.evidence.scriptureRefs,
    ),
    disclosureQuestionIds: item.requiredDisclosureQuestionIds,
    editorialNotes: [
      'Architecture pilot only. No final prose or publication approval is present.',
    ],
    reviewState: 'not-started',
    publicationState: 'unpublished',
  }),
);
