/**
 * V3C.2 RESEARCH RECORD MODEL
 * ===========================
 * Typed infrastructure for every factual claim BiblicalMeal may publish:
 * what is claimed, what kind of claim it is, which sources support it, how
 * strong that support is, whether it is verified, and whether uncertainty
 * must be disclosed.
 *
 * AXIS SEPARATION (deliberate, do not collapse):
 * - CONTENT PRIORITY   -> V3B SEO targets / production queue (page1-framework)
 * - PUBLICATION STATUS -> V3A `status` field (public visibility)
 * - WORKFLOW STATUS    -> V3C.1 editorial lifecycle (src/lib/workflow.ts)
 * - CLAIM EVIDENCE     -> THIS module (how strong the underlying evidence is)
 * - VERIFICATION       -> THIS module (whether wording/facts have been checked)
 *
 * Terminology policy: extends existing vocabularies instead of duplicating
 * them. SourceKind reuses source-citations.ts; claim evidence maps the brief
 * claimPlan tiers (content-briefs.ts); food-entity evidence maps
 * food-universe.ts FoodEvidenceStatus via mapFoodEvidence().
 */

import type { SourceKind } from '../source-citations';
import type { ScriptureRef } from '../../lib/scripture';

// ---------------------------------------------------------------- evidence

/**
 * How strong the underlying evidence for a claim is. Extends the brief
 * claimPlan tiers with one explicit state carried over from food-universe
 * (`requires-verification`) so entity evidence can be mapped losslessly.
 */
export type ClaimEvidence =
  'attested' | 'plausible' | 'speculative' | 'requires-verification';

export type ClaimCategory =
  | 'scripture'
  | 'historical'
  | 'archaeological'
  | 'linguistic'
  | 'recipe-reconstruction'
  | 'modern-contextual';

/**
 * Verification axis - independent from evidence. A claim can carry strong
 * evidence yet remain unverified because checking (e.g. against the chosen
 * Bible translation, which is itself a deferred site-wide gate) has not
 * happened yet.
 */
export type VerificationStatus = 'unverified' | 'in-review' | 'verified';

// ----------------------------------------------------------------- sources

/** Reliability classification - never fabricated; defaults are conservative. */
export type SourceReliability =
  | 'canonical-text'
  | 'scholarly-anchor'
  | 'primary-historical'
  | 'archaeological-report'
  | 'unassessed';

export interface SourceRecord {
  /** Unique stable id, referenced by claims. */
  id: string;
  title: string;
  /** Author and/or organization, only when actually known. */
  author?: string;
  organization?: string;
  kind: SourceKind;
  /** Primary = original material; secondary = commentary/synthesis. */
  primarySource: boolean;
  /** Only set when factually known from existing verified repo data. */
  year?: number;
  publisher?: string;
  /** Scripture sources record their locked translation edition here. */
  edition?: string;
  /** Identifier or URL only where real; never invented. */
  identifier?: string;
  reliability: SourceReliability;
  /** Date the source page was actually read during research, when known. */
  reviewedAt?: string;
  notes: string;
}

// ------------------------------------------------------------------ claims

/** How strongly a source supports a claim. Not binary - by design. */
export type SupportLevel =
  'direct' | 'partial' | 'contextual' | 'disputed' | 'insufficient';

export interface ClaimSupport {
  sourceId: string;
  level: SupportLevel;
  /**
   * What this source does and does not establish for the claim, including
   * any qualification (e.g. "wording check pending translation decision").
   */
  qualification?: string;
}

export interface ResearchClaim {
  /** Unique stable id. Convention: `claim-<subject>-<slug>`. */
  id: string;
  /** Subject: a FoodEntity.id or SeoTarget.id this claim belongs to. */
  subjectId: string;
  /** The factual assertion, stated plainly. */
  text: string;
  category: ClaimCategory;
  evidence: ClaimEvidence;
  verification: VerificationStatus;
  /** Where this record came from (derivation vs. genuine research). */
  provenance: string;
  supports: ClaimSupport[];
  /** Visible uncertainty notes; required when disclosure applies. */
  uncertaintyNote?: string;
  /**
   * V3C.3: scripture policy context - present only on scripture claims.
   * Optional by design so non-scripture claims are not overloaded.
   */
  scriptureContext?: ScriptureClaimContext;
}

/** How scripture content is used on the page. PARAPHRASE != DIRECT QUOTE. */
export type QuotationMode = 'direct-quote' | 'paraphrase' | 'reference-only';

/**
 * Typed relationship between a scripture claim and the KJV citation policy.
 * Kept small: reference + usage mode + optional flags.
 */
export interface ScriptureClaimContext {
  reference: ScriptureRef;
  mode: QuotationMode;
  /** True when wording materially matters and a comparison may be needed. */
  comparisonRequired?: boolean;
  /** Links an open translation ambiguity in UNRESOLVED_QUESTIONS. */
  ambiguityQuestionId?: string;
}

// --------------------------------------------------- unresolved questions

export type UnresolvedQuestionKind =
  | 'translation-ambiguity'
  | 'disputed-identification'
  | 'source-conflict'
  | 'missing-evidence'
  | 'theological-review';

/**
 * How an open question behaves downstream. NOT every question blocks:
 * - 'blocker'       -> prevents publication of content using the subject
 * - 'warning'       -> content may publish but must disclose the open point
 * - 'research-task' -> backlog item only; no content effect
 */
export type QuestionResolution = 'blocker' | 'warning' | 'research-task';

export interface UnresolvedQuestion {
  /** Unique stable id. */
  id: string;
  /** Subject: FoodEntity.id or SeoTarget.id. */
  subjectId: string;
  question: string;
  kind: UnresolvedQuestionKind;
  resolution: QuestionResolution;
  /** Where the open question was documented (never invented). */
  provenance: string;
}

// ------------------------------------------------- verification records (V3C.4)

/**
 * A RECORDED KJV wording check - the concrete work product that allows a
 * scripture claim to carry verification:'verified'. Policy (V3C.3) requires
 * that verification is never automatic; these records ARE the recorded work.
 * One record per verified claim, created only after the passage text was
 * actually retrieved and read during a research session.
 */
export interface ScriptureVerificationRecord {
  /** Unique stable id. Convention: `verify-<claim slug>`. */
  id: string;
  /** The ResearchClaim.id this record verifies. Exactly one record per claim. */
  claimId: string;
  /** Canonical reference string as checked (parsed at load time). */
  referenceText: string;
  translation: 'kjv';
  /**
   * The KJV wording as retrieved (whitespace-normalized from the public
   * domain text). Never paraphrased - this is the checked text itself.
   */
  verifiedWording: string;
  /** ISO date (YYYY-MM-DD) of the retrieval session. */
  accessedAt: string;
  /** Where the text was actually retrieved from - never invented. */
  accessPoint: string;
}

// ---------------------------------------------------------------- dossiers

export type DossierSubjectType = 'food-entity' | 'seo-target';

export type DossierResearchStatus = 'not-started' | 'in-progress' | 'complete';

/**
 * Structural grouping of research around a subject. A dossier existing does
 * NOT mean its research is done - `researchStatus` stays 'not-started' until
 * real research work is recorded.
 */
export interface ResearchDossier {
  id: string;
  subjectType: DossierSubjectType;
  /** FoodEntity.id or SeoTarget.id. */
  subjectId: string;
  /** Related V3B canonical target ids (validated to exist; never not-pursuing). */
  relatedTargetIds: string[];
  claimIds: string[];
  questionIds: string[];
  unresolvedNotes: string[];
  researchStatus: DossierResearchStatus;
  /**
   * V3C.4: recorded research-session notes (what was checked, when, and any
   * framing guardrails). Present only once real research has been recorded.
   */
  researchNotes?: string[];
  /** ISO date (YYYY-MM-DD) of the last recorded research session. */
  updatedAt?: string;
}

export interface DossierCompletionRecord {
  id: string;
  dossierId: string;
  completedAt: string;
  scope: string;
  criteriaSatisfied: string[];
  remainingWarnings: string[];
  unresolvedUncertainty: string[];
  completionReason: string;
}
