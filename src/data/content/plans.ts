/** Internal first-wave content plans and two evidence-bound editorial pilot drafts. */
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
import { canIncludeClaim } from './validation';
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

const EDITORIAL_DRAFT_CONTENT: Record<string, Record<string, string>> = {
  figs: {
    introduction:
      'Figs belong to the BiblicalMeal food universe as a research subject where Scripture evidence and archaeological evidence can be considered together without treating them as the same kind of proof. The present draft is intentionally limited to evidence that has passed the project research gate.',
    'biblical-references':
      'The current common-fig scope is built from the verified Scripture references already recorded in the dossier. These references establish the presence of fig-related language in the KJV evidence set; this draft does not add new quotations or extend those references beyond their recorded claim support.',
    'historical-context':
      'Historical interpretation remains bounded by the evidence attached to the verified claims. The draft therefore avoids turning biblical references into a complete reconstruction of everyday diet or treating later historical patterns as automatic proof for every biblical period.',
    'archaeological-evidence':
      'The Tel Tsaf evidence concerns charred young common-fig branches at a Chalcolithic site. The reviewed study allows a qualified interpretation that the evidence may indicate common-fig cultivation at that site, but the finding does not establish a universal account of ancient fig cultivation.',
    uncertainty:
      'The common-fig scope does not resolve every biblical fruit identification. In particular, the sycomore fruit in Amos 7:14 remains a separate research question and must not be silently merged into conclusions about the common fig.',
    'related-foods':
      'Related BiblicalMeal content can later connect figs with other researched foods while preserving each subject’s own evidence and uncertainty boundaries.',
  },
  dates: {
    introduction:
      'Dates are handled here as an evidence-bound subject with two distinct lines of evidence: biblical palm references and archaeological evidence for historic date palms. Those lines should inform one another without being treated as interchangeable.',
    'biblical-references':
      'The verified KJV evidence currently concerns palm trees and palm branches. Those references establish the recorded biblical palm context, but this draft does not treat every palm reference as automatic proof of edible-date consumption.',
    'historical-context':
      'Historical discussion remains limited to what the reviewed evidence supports. A biblical reference to a palm can be significant in its own context without settling the separate question of when a specific reference should be read as a food reference.',
    'archaeological-evidence':
      'A reviewed Science Advances study analyzes ancient Phoenix dactylifera seeds recovered from Judean Desert archaeological sites and supports the existence of a historic Judean date-palm culture. This archaeological evidence does not, by itself, identify every KJV palm reference as an edible-date reference.',
    'food-use':
      'The present draft keeps food use narrower than botanical identity. Palm reference does not equal edible-date reference, so the edible-date question remains explicitly qualified wherever the evidence does not establish it directly.',
    uncertainty:
      'The palm-versus-edible-date distinction remains unresolved for the individual KJV palm references in the current evidence set. The archaeological evidence supports ancient date palms and a historic date culture, while the relationship between that evidence and each biblical palm reference remains a separate interpretive question.',
  },
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

function eligibleClaimIds(item: ContentPlan): string[] {
  return [
    ...new Set(
      item.sections
        .flatMap((section) => section.evidence.claimIds)
        .filter(canIncludeClaim),
    ),
  ];
}

function buildEditorialDraft(item: ContentPlan): ContentDraft {
  const contentBySection =
    EDITORIAL_DRAFT_CONTENT[item.canonicalTargetId] ?? {};
  const sections = item.sections.map((section) => ({
    ...section,
    content: contentBySection[section.kind] ?? section.content,
  }));
  return {
    id: `draft-${item.canonicalTargetId}`,
    contentItemId: item.id,
    status: 'draft',
    workflowStatus: item.workflowStatus,
    title: item.title,
    sections,
    claimIds: eligibleClaimIds(item),
    scriptureRefs: item.sections.flatMap(
      (section) => section.evidence.scriptureRefs,
    ),
    disclosureQuestionIds: item.requiredDisclosureQuestionIds,
    editorialNotes: [
      'V3C.6 controlled editorial draft. Internal only and not approved for publication.',
      'Editorial prose is derived from existing evidence bindings and preserves required uncertainty disclosures.',
    ],
    reviewState: 'not-started',
    publicationState: 'unpublished',
  };
}

export const PILOT_CONTENT_DRAFTS: ContentDraft[] =
  PILOT_CONTENT_ITEMS.map(buildEditorialDraft);
