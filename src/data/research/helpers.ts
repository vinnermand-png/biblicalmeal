/**
 * V3C.2 RESEARCH HELPERS
 * ======================
 * Small typed question layer over the research model. Future content asks:
 * - Is this claim verified enough for publication?
 * - Must uncertainty be displayed?
 * - Does the claim rest on at least one valid source?
 * - Is it direct scripture evidence or historical context?
 * - Can it support a researched/reconstructed recipe?
 *
 * Pure module - no astro:content imports.
 */

import { getSource } from './sources';
import { questionsForSubject } from './questions';
import type { ClaimEvidence, ResearchClaim, SupportLevel } from './types';

const SUPPORT_RANK: Record<SupportLevel, number> = {
  direct: 4,
  contextual: 3,
  partial: 2,
  disputed: 1,
  insufficient: 0,
};

/** Strongest support any source offers the claim. */
export function getBestSupport(claim: ResearchClaim): SupportLevel | null {
  let best: SupportLevel | null = null;
  for (const support of claim.supports) {
    if (!best || SUPPORT_RANK[support.level] > SUPPORT_RANK[best]) {
      best = support.level;
    }
  }
  return best;
}

/** Every referenced source must exist in the registry. */
export function hasValidSources(claim: ResearchClaim): boolean {
  return (
    claim.supports.length > 0 &&
    claim.supports.every((s) => getSource(s.sourceId) !== undefined)
  );
}

/**
 * Verification rules (typed, testable). A claim may be marked verified only
 * when ALL hold:
 * - it rests on at least one existing source
 * - its evidence is not speculative
 * - no source relation is purely disputed/insufficient
 */
export type ClaimIssue =
  | 'no-sources'
  | 'unknown-source'
  | 'verified-without-source'
  | 'verified-speculative-evidence'
  | 'verified-on-disputed-support';

export function validateClaim(claim: ResearchClaim): ClaimIssue[] {
  const issues: ClaimIssue[] = [];
  if (claim.supports.length === 0) issues.push('no-sources');
  if (!hasValidSources(claim)) issues.push('unknown-source');
  if (claim.verification === 'verified') {
    if (claim.supports.length === 0 || !hasValidSources(claim)) {
      issues.push('verified-without-source');
    }
    if (claim.evidence === 'speculative') {
      issues.push('verified-speculative-evidence');
    }
    if (
      claim.supports.some(
        (s) => s.level === 'disputed' || s.level === 'insufficient',
      )
    ) {
      issues.push('verified-on-disputed-support');
    }
  }
  return issues;
}

/** Publication eligibility of the CLAIM itself (content gates apply too). */
export function isClaimPublicationEligible(claim: ResearchClaim): boolean {
  return (
    validateClaim(claim).length === 0 &&
    claim.verification === 'verified' &&
    questionsForSubject(claim.subjectId).every(
      (q) => q.resolution !== 'blocker',
    )
  );
}

/** Does publishing content using this claim require visible uncertainty? */
export function mustDiscloseUncertainty(claim: ResearchClaim): boolean {
  return (
    claim.evidence === 'speculative' ||
    claim.evidence === 'requires-verification' ||
    claim.verification !== 'verified' ||
    questionsForSubject(claim.subjectId).some(
      (q) => q.resolution === 'warning',
    ) ||
    claim.supports.some((s) => s.level !== 'direct')
  );
}

/** Best support across a set of supports (gate-facing utility). */
export function isDirectScriptureEvidence(claim: ResearchClaim): boolean {
  return claim.category === 'scripture' && getBestSupport(claim) === 'direct';
}

export function isHistoricalContextClaim(claim: ResearchClaim): boolean {
  return claim.category === 'historical' || claim.category === 'archaeological';
}

/**
 * METHODOLOGY_RULES (recipes): researched/reconstructed recipes need a cited
 * basis with verified wording. Scripture anchors therefore qualify only once
 * verification has happened.
 */
export function canSupportHistoricalRecipe(claim: ResearchClaim): boolean {
  const recipeCategories = [
    'scripture',
    'historical',
    'archaeological',
    'recipe-reconstruction',
  ];
  return (
    recipeCategories.includes(claim.category) &&
    getBestSupport(claim) === 'direct' &&
    claim.verification === 'verified' &&
    validateClaim(claim).length === 0
  );
}

/**
 * Lossless mapping from food-universe evidence to claim evidence. Keeps both
 * vocabularies intact instead of collapsing them.
 */
export function mapFoodEvidence(evidence: string): ClaimEvidence | undefined {
  switch (evidence) {
    case 'directly-attested':
      return 'attested';
    case 'historically-plausible':
      return 'plausible';
    case 'uncertain-identification':
      return 'speculative';
    case 'requires-verification':
      return 'requires-verification';
    default:
      return undefined;
  }
}
