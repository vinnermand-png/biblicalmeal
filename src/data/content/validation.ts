/** V3C.5 content validation and eligibility helpers. */
import { isValidReferenceStructure } from '../../lib/scripture';
import { validateQuotation } from '../scripture-policy';
import { RESEARCH_CLAIMS } from '../research/claims';
import { RESEARCH_DOSSIERS } from '../research/dossiers';
import { questionsForSubject } from '../research/questions';
import { getSource } from '../research/sources';
import { completenessForDossier } from '../research/audit';
import { SEO_TARGETS } from '../seo-master-map';
import type { CanonicalContentItem, ContentDraft, ContentPlan } from './model';

export type ContentValidationIssue =
  | 'duplicate-content-id'
  | 'unknown-target'
  | 'unknown-dossier'
  | 'canonical-route-mismatch'
  | 'invalid-related-content'
  | 'unknown-claim'
  | 'unknown-source'
  | 'unknown-question'
  | 'invalid-scripture-reference'
  | 'factual-section-without-evidence'
  | 'disclosure-section-without-question'
  | 'required-disclosure-omitted'
  | 'invalid-quotation'
  | 'primary-owner-duplicated'
  | 'complete-status-not-derived';

function allContentClaims(plan: ContentPlan): Set<string> {
  return new Set(plan.sections.flatMap((section) => section.evidence.claimIds));
}

function questionsForPlan(plan: ContentPlan) {
  const dossier = RESEARCH_DOSSIERS.find((item) => item.id === plan.dossierId);
  const keys = new Set([plan.subjectId, plan.canonicalTargetId]);
  for (const targetId of dossier?.relatedTargetIds ?? []) keys.add(targetId);
  return [...keys].flatMap(questionsForSubject);
}

export function validateContentPlan(
  plan: ContentPlan,
  allPlans: ContentPlan[] = [plan],
): ContentValidationIssue[] {
  const issues: ContentValidationIssue[] = [];
  const target = SEO_TARGETS.find((item) => item.id === plan.canonicalTargetId);
  const dossier = RESEARCH_DOSSIERS.find((item) => item.id === plan.dossierId);
  if (!target) issues.push('unknown-target');
  if (!dossier) issues.push('unknown-dossier');
  if (target && plan.canonicalPath !== target.targetRoute)
    issues.push('canonical-route-mismatch');
  if (
    plan.relatedContentIds.some(
      (id) => !allPlans.some((item) => item.id === id),
    )
  ) {
    issues.push('invalid-related-content');
  }
  const claimIds = allContentClaims(plan);
  for (const claimId of claimIds) {
    const claim = RESEARCH_CLAIMS.find((item) => item.id === claimId);
    if (!claim) {
      issues.push('unknown-claim');
      continue;
    }
    for (const support of claim.supports) {
      if (!getSource(support.sourceId)) issues.push('unknown-source');
    }
  }
  for (const section of plan.sections) {
    for (const sourceId of section.evidence.sourceIds) {
      if (!getSource(sourceId)) issues.push('unknown-source');
    }
    for (const reference of section.evidence.scriptureRefs) {
      if (!isValidReferenceStructure(reference)) {
        issues.push('invalid-scripture-reference');
      }
    }
    for (const questionId of section.evidence.questionIds) {
      const question = questionsForPlan(plan).find(
        (item) => item.id === questionId,
      );
      if (!question) issues.push('unknown-question');
    }
    if (
      section.mode === 'evidence-backed' &&
      section.evidence.claimIds.length === 0
    ) {
      issues.push('factual-section-without-evidence');
    }
    if (
      section.mode === 'disclosure-focused' &&
      section.evidence.questionIds.length === 0
    ) {
      issues.push('disclosure-section-without-question');
    }
    if (section.quotation) {
      if (!isValidReferenceStructure(section.quotation.reference)) {
        issues.push('invalid-scripture-reference');
      }
      if (
        validateQuotation({
          mode: 'direct-quote',
          text: section.quotation.text,
          reference: section.quotation.reference,
        }).length > 0
      ) {
        issues.push('invalid-quotation');
      }
    }
  }
  const questions = questionsForPlan(plan);
  const required = questions
    .filter((question) => question.resolution === 'warning')
    .map((question) => question.id);
  if (required.some((id) => !plan.requiredDisclosureQuestionIds.includes(id))) {
    issues.push('required-disclosure-omitted');
  }
  if (
    allPlans.filter(
      (item) =>
        item.canonicalTargetId === plan.canonicalTargetId &&
        item.ownership === 'primary',
    ).length > 1
  ) {
    issues.push('primary-owner-duplicated');
  }
  if (plan.workflowStatus === 'research-complete') {
    const audit = completenessForDossier(plan.dossierId);
    if (!audit?.researchCompleteEligible)
      issues.push('complete-status-not-derived');
  }
  return issues;
}

export function canCreateContentDraft(plan: ContentPlan): boolean {
  return (
    validateContentPlan(plan).length === 0 &&
    RESEARCH_DOSSIERS.some((dossier) => dossier.id === plan.dossierId)
  );
}

export function canIncludeClaim(claimId: string): boolean {
  const claim = RESEARCH_CLAIMS.find((item) => item.id === claimId);
  if (!claim) return false;
  return !questionsForSubject(claim.subjectId).some(
    (question) => question.resolution === 'blocker',
  );
}

export function mustIncludeDisclosure(plan: ContentPlan): boolean {
  return plan.requiredDisclosureQuestionIds.length > 0;
}

export function researchStateForContent(plan: ContentPlan) {
  return completenessForDossier(plan.dossierId);
}

export function isContentPublicationEligible(
  plan: ContentPlan,
  draft: ContentDraft,
): boolean {
  if (!canCreateContentDraft(plan)) return false;
  if (draft.status !== 'in-review' && draft.status !== 'published')
    return false;
  if (draft.workflowStatus !== 'approved') return false;
  if (draft.publicationState !== 'published') return false;
  if (
    draft.disclosureQuestionIds.length <
    plan.requiredDisclosureQuestionIds.length
  )
    return false;
  return [...allContentClaims(plan)].every((claimId) => {
    const claim = RESEARCH_CLAIMS.find((item) => item.id === claimId);
    return (
      claim !== undefined &&
      claim.verification === 'verified' &&
      canIncludeClaim(claimId)
    );
  });
}

export function validateContentDraft(
  draft: ContentDraft,
  plan: ContentPlan,
): ContentValidationIssue[] {
  const issues = validateContentPlan(plan);
  if (draft.contentItemId !== plan.id) issues.push('unknown-dossier');
  if (draft.sections.length === 0)
    issues.push('factual-section-without-evidence');
  if (
    draft.disclosureQuestionIds.some(
      (id) => !plan.requiredDisclosureQuestionIds.includes(id),
    )
  ) {
    issues.push('required-disclosure-omitted');
  }
  return issues;
}

export function validateContentCatalog(
  items: CanonicalContentItem[],
): ContentValidationIssue[] {
  const issues: ContentValidationIssue[] = [];
  const ids = new Set<string>();
  for (const item of items) {
    if (ids.has(item.id)) issues.push('duplicate-content-id');
    ids.add(item.id);
    if (!SEO_TARGETS.some((target) => target.id === item.canonicalTargetId))
      issues.push('unknown-target');
    if (!RESEARCH_DOSSIERS.some((dossier) => dossier.id === item.dossierId))
      issues.push('unknown-dossier');
  }
  if (
    items.filter((item) => item.ownership === 'primary').length !==
    new Set(
      items
        .filter((item) => item.ownership === 'primary')
        .map((item) => item.canonicalTargetId),
    ).size
  ) {
    issues.push('primary-owner-duplicated');
  }
  return issues;
}
