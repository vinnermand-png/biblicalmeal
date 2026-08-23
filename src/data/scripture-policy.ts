/**
 * V3C.3 SCRIPTURE TRANSLATION & CITATION POLICY
 * =============================================
 * Official, typed, machine-readable Scripture policy for BiblicalMeal.
 *
 * LOCKED PROJECT DECISION: the King James Version (KJV) is the canonical
 * editorial Scripture translation. This decision is not reopened anywhere in
 * the codebase. Secondary translations may appear ONLY through the controlled
 * comparison rules below.
 *
 * KJV is an editorial AUTHORITY layer - never an SEO keyword strategy. Broad
 * search intents (foods in the Bible, what did Jesus eat, ...) remain the V3B
 * SEO strategy; "KJV" is not forced into titles, URLs or headings.
 *
 * Integration without duplication:
 * - source-citations.ts  SourceKind + CITATION_RULES (the translation gate
 *   those rules anticipated is fulfilled HERE)
 * - research/sources.ts  scripture-canon edition records KJV
 * - research/questions.ts ambiguity flows into UNRESOLVED_QUESTIONS via
 *   translationAmbiguityQuestion()
 * - lib/scripture.ts     canonical reference parsing/formatting (en dash)
 *
 * Pure module - no astro:content imports.
 */

import type { ScriptureRef } from '../lib/scripture';
import {
  formatScriptureRef,
  isValidReferenceStructure,
} from '../lib/scripture';
import type {
  QuotationMode,
  ResearchClaim,
  UnresolvedQuestion,
} from './research/types';
import {
  questionsForSubject,
  UNRESOLVED_QUESTIONS,
} from './research/questions';
import { RESEARCH_CLAIMS } from './research/claims';

export {
  parseCanonicalReference,
  isValidReferenceStructure,
} from '../lib/scripture';

// ------------------------------------------------------- primary translation

export interface TranslationPolicyEntry {
  id: string;
  name: string;
  abbreviation: string;
}

/** THE canonical translation. Exactly one entry may ever exist here. */
export const PRIMARY_TRANSLATION: TranslationPolicyEntry = {
  id: 'kjv',
  name: 'King James Version',
  abbreviation: 'KJV',
};

/**
 * Known secondary translations eligible for controlled comparison contexts.
 * Only public identity data (name/abbreviation) is recorded - no years,
 * publishers or URLs.
 */
export const SECONDARY_TRANSLATIONS: TranslationPolicyEntry[] = [
  { id: 'web', name: 'World English Bible', abbreviation: 'WEB' },
  { id: 'esv', name: 'English Standard Version', abbreviation: 'ESV' },
  { id: 'niv', name: 'New International Version', abbreviation: 'NIV' },
];

/** Site-level attribution statement for pages quoting scripture. */
export const TRANSLATION_ATTRIBUTION_STATEMENT =
  'Unless otherwise noted, Scripture quotations are from the King James Version (KJV).';

function isSecondaryTranslation(id: string): boolean {
  return SECONDARY_TRANSLATIONS.some((t) => t.id === id);
}

// ------------------------------------------------------ canonical references

export type CanonicalReference = ScriptureRef;

export function formatCanonicalReference(ref: CanonicalReference): string {
  return formatScriptureRef(ref);
}

/** Same passage identity (book + chapter + overlapping verses). */
export function samePassage(
  a: CanonicalReference,
  b: CanonicalReference,
): boolean {
  return (
    a.book.toLowerCase() === b.book.toLowerCase() &&
    a.chapter === b.chapter &&
    a.verseStart <= (b.verseEnd ?? b.verseStart) &&
    b.verseStart <= (a.verseEnd ?? a.verseStart)
  );
}

// ------------------------------------------------------------ policy rules

export type PolicyDomain =
  | 'canonical-translation'
  | 'quotation'
  | 'paraphrase'
  | 'attribution'
  | 'comparison'
  | 'original-language'
  | 'ambiguity'
  | 'verification';

export interface PolicyRule {
  domain: PolicyDomain;
  id: string;
  rule: string;
}

/** The maintainable editorial documentation - machine-referenceable by id. */
export const SCRIPTURE_POLICY_RULES: PolicyRule[] = [
  {
    domain: 'canonical-translation',
    id: 'kjv-primary',
    rule: 'KJV is the only canonical primary translation; the decision is locked project-wide.',
  },
  {
    domain: 'quotation',
    id: 'quote-distinguishable',
    rule: 'Direct quotations are always typographically distinguishable from editorial prose.',
  },
  {
    domain: 'quotation',
    id: 'quote-unaltered',
    rule: 'Quoted wording follows the KJV text exactly; nothing is silently altered.',
  },
  {
    domain: 'quotation',
    id: 'quote-precise-reference',
    rule: 'Every direct quotation carries its precise book/chapter/verse reference.',
  },
  {
    domain: 'quotation',
    id: 'quote-excerpt-integrity',
    rule: 'Ellipses and excerpts must be marked and must not change the meaning of the passage.',
  },
  {
    domain: 'quotation',
    id: 'quote-length-necessity',
    rule: 'Long quotations are used only when editorially necessary.',
  },
  {
    domain: 'paraphrase',
    id: 'paraphrase-no-quote-marks',
    rule: 'A paraphrase never appears inside quotation marks as if it were scripture text.',
  },
  {
    domain: 'paraphrase',
    id: 'paraphrase-faithful-referenced',
    rule: 'A paraphrase stays faithful to the cited passage and keeps its scripture reference.',
  },
  {
    domain: 'attribution',
    id: 'kjv-default-statement',
    rule: 'Pages quoting scripture can rely on the site-level KJV default statement.',
  },
  {
    domain: 'attribution',
    id: 'secondary-always-attributed',
    rule: 'Without the site-level default statement, every quotation names its translation explicitly.',
  },
  {
    domain: 'comparison',
    id: 'comparison-needs-trigger',
    rule: 'Translation comparisons require a documented material trigger - never decoration.',
  },
  {
    domain: 'comparison',
    id: 'comparison-kjv-first',
    rule: 'Comparisons always record KJV as the primary side of the comparison.',
  },
  {
    domain: 'original-language',
    id: 'origlang-material-only',
    rule: "Hebrew/Greek terms, transliterations and Strong's numbers appear only where materially relevant - never as decorative authority signals.",
  },
  {
    domain: 'original-language',
    id: 'origlang-sourced',
    rule: 'Original-language analysis cites its basis sources and states its evidence honestly.',
  },
  {
    domain: 'ambiguity',
    id: 'ambiguity-explicit-classification',
    rule: 'Translation ambiguity carries an explicit classification; convenience is never a resolution.',
  },
  {
    domain: 'verification',
    id: 'verification-wording-check',
    rule: 'Direct-quotation claims become verified only after their wording is checked against KJV and the check is recorded.',
  },
  {
    domain: 'verification',
    id: 'verification-not-automatic',
    rule: 'Opening this policy does not verify anything; verification requires recorded checking work.',
  },
];

// --------------------------------------------------------- quotation policy

export interface QuotationCheckInput {
  mode: QuotationMode;
  /** Raw quoted/paraphrased text as it would appear in content. */
  text?: string;
  reference?: CanonicalReference;
  /**
   * True when the page displays the site-level KJV attribution statement
   * (or relies on it). Defaults to true - the statement is site policy.
   */
  pageDeclaresKjvDefault?: boolean;
  /** True when omissions in an excerpted quote are visibly marked. */
  omissionsMarked?: boolean;
}

export type QuotationIssue =
  | 'direct-quote-missing-reference'
  | 'direct-quote-invalid-reference'
  | 'direct-quote-unattributed'
  | 'direct-quote-unmarked-omission'
  | 'paraphrase-in-quote-marks'
  | 'paraphrase-missing-reference'
  | 'reference-only-invalid';

const ATTRIBUTION_MARKER_PATTERN = /\((WEB|ESV|NIV|KJV)\)/;

/**
 * Structural enforcement of the quotation/paraphrase policy. The system
 * enforces structure; it does NOT pretend to interpret theology.
 */
export function validateQuotation(
  input: QuotationCheckInput,
): QuotationIssue[] {
  const issues: QuotationIssue[] = [];
  if (input.mode === 'direct-quote') {
    if (!input.reference) {
      issues.push('direct-quote-missing-reference');
    } else if (!isValidReferenceStructure(input.reference)) {
      issues.push('direct-quote-invalid-reference');
    }
    // Without the site-level default statement every quote must carry an
    // explicit translation marker such as "(KJV)" or "(NIV)".
    if (
      input.pageDeclaresKjvDefault === false &&
      !(input.text && ATTRIBUTION_MARKER_PATTERN.test(input.text))
    ) {
      issues.push('direct-quote-unattributed');
    }
    if (input.text && /(…|\.\.\.)/.test(input.text) && !input.omissionsMarked) {
      issues.push('direct-quote-unmarked-omission');
    }
  } else if (input.mode === 'paraphrase') {
    // Structural proxy: double quotes inside paraphrase text risk presenting
    // editorial wording as scripture text.
    if (input.text && input.text.includes('"')) {
      issues.push('paraphrase-in-quote-marks');
    }
    if (!input.reference) {
      issues.push('paraphrase-missing-reference');
    }
  } else if (input.mode === 'reference-only') {
    if (!isValidReferenceStructure(input.reference)) {
      issues.push('reference-only-invalid');
    }
  }
  return issues;
}

// --------------------------------------------------- translation comparisons

export type ComparisonTrigger =
  | 'food-identification-affected'
  | 'interpretation-affected'
  | 'known-translation-ambiguity'
  | 'translation-investigation-article'
  | 'original-language-issue';

export interface TranslationComparison {
  /** Unique stable id. */
  id: string;
  /** Subject: FoodEntity.id or SeoTarget.id. */
  subjectId: string;
  reference: CanonicalReference;
  /** Always 'kjv' - enforced by validateComparison. */
  primaryTranslationId: string;
  secondaryTranslationId: string;
  trigger: ComparisonTrigger;
  /** What materially differs between the renderings (when known). */
  materialDifference?: string;
  editorialConclusion?: string;
  uncertaintyNote?: string;
  provenance: string;
}

/**
 * Comparisons are added ONLY as real translation work happens. The first
 * entry was researched during the V3C.4 Phase 1A session (2026-08-23): both
 * renderings of Mark 11:13 were retrieved and recorded (KJV via Bible
 * Gateway/bible-api.com public domain text; WEB via bible-api.com).
 */
export const TRANSLATION_COMPARISONS: TranslationComparison[] = [
  {
    id: 'comparison-mark-11-13-fig-season',
    subjectId: 'figs',
    reference: { book: 'Mark', chapter: 11, verseStart: 13 },
    primaryTranslationId: 'kjv',
    secondaryTranslationId: 'web',
    trigger: 'interpretation-affected',
    materialDifference:
      'KJV: "for the time of figs was not yet." WEB: "for it was not the season for figs." Same underlying sense, but the archaic KJV phrasing invites over-reading (e.g. whether fig trees bear before leaves) that the plainer modern rendering forecloses.',
    editorialConclusion:
      'Pages quote the KJV wording exactly and explain the season explanation plainly; no interpretive weight may rest on the archaic phrasing.',
    provenance:
      'V3C.4 Phase 1A verification session 2026-08-23: Mark 11:12-13 retrieved in both translations (public domain texts via bible-api.com; KJV cross-checked via Bible Gateway).',
  },
];

export function validateComparison(
  comparison: TranslationComparison,
): string[] {
  const issues: string[] = [];
  if (comparison.primaryTranslationId !== PRIMARY_TRANSLATION.id) {
    issues.push('primary-not-kjv');
  }
  if (comparison.secondaryTranslationId === PRIMARY_TRANSLATION.id) {
    issues.push('secondary-cannot-be-canonical');
  } else if (!isSecondaryTranslation(comparison.secondaryTranslationId)) {
    issues.push('unknown-secondary-translation');
  }
  if (!isValidReferenceStructure(comparison.reference)) {
    issues.push('invalid-reference');
  }
  if (comparison.provenance.trim().length < 10) {
    issues.push('missing-provenance');
  }
  if (!comparison.editorialConclusion && !comparison.uncertaintyNote) {
    issues.push('unconcluded-comparison-needs-uncertainty');
  }
  return issues;
}

// ---------------------------------------------------- original language model

export type OriginalLanguage = 'hebrew' | 'greek' | 'aramaic';

export interface OriginalTermReference {
  /** Unique stable id. */
  id: string;
  term: string;
  language: OriginalLanguage;
  transliteration?: string;
  locations: CanonicalReference[];
  /** The concrete translation/interpretation issue being documented. */
  issue: string;
  /** SOURCE_REGISTRY ids backing the analysis (never invented). */
  basisSourceIds: string[];
  explanation?: string;
  evidence: 'attested' | 'plausible' | 'speculative' | 'requires-verification';
  provenance: string;
}

/**
 * Empty by policy: no original-language review has been performed. Terms,
 * transliterations and Strong's numbers are never populated decoratively.
 */
export const ORIGINAL_TERM_REFERENCES: OriginalTermReference[] = [];

export function validateOriginalTerm(term: OriginalTermReference): string[] {
  const issues: string[] = [];
  if (!term.term.trim()) issues.push('missing-term');
  if (
    term.locations.length === 0 ||
    term.locations.some((l) => !isValidReferenceStructure(l))
  ) {
    issues.push('missing-or-invalid-locations');
  }
  if (!term.issue.trim()) issues.push('missing-issue');
  if (term.basisSourceIds.length === 0) issues.push('unsourced-analysis');
  if (term.provenance.trim().length < 10) issues.push('missing-provenance');
  return issues;
}

// -------------------------------------------------------- ambiguity model

/**
 * Explicit ambiguity classification. Maps onto the EXISTING
 * UnresolvedQuestion resolutions - no duplicate question system.
 */
export type AmbiguityClassification =
  | 'no-material-ambiguity'
  | 'editorial-note-required'
  | 'research-task'
  | 'publication-warning'
  | 'publication-blocker';

const AMBIGUITY_TO_RESOLUTION = {
  'editorial-note-required': 'warning',
  'research-task': 'research-task',
  'publication-warning': 'warning',
  'publication-blocker': 'blocker',
} as const;

/**
 * Builds an UnresolvedQuestion from a classified translation ambiguity so it
 * flows through the existing V3C.2 machinery (queue, gate, dossiers).
 * 'no-material-ambiguity' produces no question by definition.
 */
export function translationAmbiguityQuestion(input: {
  id: string;
  subjectId: string;
  question: string;
  classification: AmbiguityClassification;
}): UnresolvedQuestion | undefined {
  if (input.classification === 'no-material-ambiguity') return undefined;
  const resolution = AMBIGUITY_TO_RESOLUTION[input.classification];
  return {
    id: input.id,
    subjectId: input.subjectId,
    question: input.question,
    kind: 'translation-ambiguity',
    resolution,
    provenance: 'scripture-policy.ts classification (V3C.3)',
  };
}

/** Registered translation ambiguities for a subject (existing registry). */
export function openTranslationQuestions(
  subjectId: string,
): UnresolvedQuestion[] {
  return questionsForSubject(subjectId).filter(
    (q) => q.kind === 'translation-ambiguity',
  );
}

export function countUnresolvedTranslationAmbiguities(): number {
  return UNRESOLVED_QUESTIONS.filter((q) => q.kind === 'translation-ambiguity')
    .length;
}

// ---------------------------------------------- scripture claim verification

export interface ScriptureVerificationRequirements {
  /** Reference parses and is structurally valid. */
  validReference: boolean;
  /** Claim sits inside the locked KJV canonical context. */
  canonicalTranslationContext: boolean;
  /** Wording was checked against KJV and the check was RECORDED. */
  verifiedWordingRecorded: boolean;
  /** The claim actually corresponds to the referenced passage. */
  claimReferenceAligned: boolean;
  /** No unresolved material translation blocker on the subject. */
  freeOfMaterialBlocker: boolean;
  /** Required uncertainty disclosure is in place. */
  disclosureSatisfied: boolean;
}

export interface ScriptureVerificationResult {
  eligible: boolean;
  missing: (keyof ScriptureVerificationRequirements)[];
}

/**
 * Evaluates whether a scripture claim MAY be marked verified under policy.
 *
 * CRITICAL HONESTY PROPERTY: requirements are satisfied only by RECORDED
 * WORK passed in by the caller. Nothing here auto-verifies. Existing derived
 * anchor claims carry no recorded KJV wording checks, so they stay unverified
 * even though the policy now exists (POLICY READY != VERIFICATION COMPLETE).
 */
export function evaluateScriptureVerification(
  claim: ResearchClaim,
  recordedWork: Partial<ScriptureVerificationRequirements> = {},
): ScriptureVerificationResult {
  const requirements: ScriptureVerificationRequirements = {
    validReference: isValidReferenceStructure(
      claim.scriptureContext?.reference,
    ),
    canonicalTranslationContext:
      claim.scriptureContext !== undefined || claim.category === 'scripture',
    verifiedWordingRecorded:
      claim.scriptureContext?.mode !== 'direct-quote' ||
      recordedWork.verifiedWordingRecorded === true,
    claimReferenceAligned: recordedWork.claimReferenceAligned === true,
    freeOfMaterialBlocker: !questionsForSubject(claim.subjectId).some(
      (q) => q.resolution === 'blocker',
    ),
    disclosureSatisfied:
      recordedWork.disclosureSatisfied === true ||
      claim.uncertaintyNote !== undefined ||
      openTranslationQuestions(claim.subjectId).every(
        (q) => q.resolution !== 'warning',
      ),
  };
  const missing = (
    Object.keys(requirements) as (keyof ScriptureVerificationRequirements)[]
  ).filter((key) => !requirements[key]);
  return { eligible: missing.length === 0, missing };
}

// ---------------------------------------------------------- dossier readiness

export interface DossierScriptureReadiness {
  primaryTranslation: string;
  policyReady: true;
  scriptureClaimsTotal: number;
  scriptureClaimsVerified: number;
  scriptureClaimsPending: number;
  unresolvedTranslationIssueIds: string[];
}

/**
 * Derived (never stored): dossier readiness expresses that the POLICY layer
 * is ready while the underlying research remains not-started.
 */
export function getScripturePolicyReadiness(dossier: {
  subjectId: string;
  relatedTargetIds: string[];
}): DossierScriptureReadiness {
  const subjectKeys = new Set<string>([
    dossier.subjectId,
    ...dossier.relatedTargetIds,
  ]);
  const claims = RESEARCH_CLAIMS.filter((c) => subjectKeys.has(c.subjectId));
  const issueIds = new Set<string>();
  for (const key of subjectKeys) {
    for (const q of openTranslationQuestions(key)) {
      issueIds.add(q.id);
    }
  }
  const verified = claims.filter((c) => c.verification === 'verified').length;
  return {
    primaryTranslation: PRIMARY_TRANSLATION.abbreviation,
    policyReady: true,
    scriptureClaimsTotal: claims.length,
    scriptureClaimsVerified: verified,
    scriptureClaimsPending: claims.length - verified,
    unresolvedTranslationIssueIds: [...issueIds],
  };
}
