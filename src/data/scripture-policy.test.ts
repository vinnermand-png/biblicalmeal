import { describe, expect, it } from 'vitest';
import {
  ORIGINAL_TERM_REFERENCES,
  PRIMARY_TRANSLATION,
  SCRIPTURE_POLICY_RULES,
  SECONDARY_TRANSLATIONS,
  TRANSLATION_ATTRIBUTION_STATEMENT,
  TRANSLATION_COMPARISONS,
  countUnresolvedTranslationAmbiguities,
  evaluateScriptureVerification,
  formatCanonicalReference,
  getScripturePolicyReadiness,
  openTranslationQuestions,
  parseCanonicalReference,
  samePassage,
  translationAmbiguityQuestion,
  validateComparison,
  validateOriginalTerm,
  validateQuotation,
} from './scripture-policy';
import { RESEARCH_CLAIMS } from './research/claims';
import { RESEARCH_DOSSIERS } from './research/dossiers';
import { UNRESOLVED_QUESTIONS } from './research/questions';
import {
  recordedWorkFor,
  verificationRecordFor,
} from './research/verification';
import { SOURCE_REGISTRY } from './research/sources';
import type { ResearchClaim } from './research/types';

const syntheticScriptureClaim = (
  overrides: Partial<ResearchClaim> = {},
): ResearchClaim => ({
  id: 'claim-test-scripture',
  subjectId: 'figs',
  text: 'Synthetic policy test claim (non-factual fixture).',
  category: 'scripture',
  evidence: 'attested',
  verification: 'unverified',
  provenance: 'test fixture',
  supports: [{ sourceId: 'scripture-canon', level: 'direct' }],
  ...overrides,
});

describe('canonical translation policy', () => {
  it('locks KJV as the ONLY canonical primary translation', () => {
    expect(PRIMARY_TRANSLATION).toEqual({
      id: 'kjv',
      name: 'King James Version',
      abbreviation: 'KJV',
    });
    expect(SECONDARY_TRANSLATIONS.map((t) => t.id)).not.toContain('kjv');
    // No other module may declare a competing primary.
    const primaryRules = SCRIPTURE_POLICY_RULES.filter(
      (r) => r.domain === 'canonical-translation' && r.id === 'kjv-primary',
    );
    expect(primaryRules).toHaveLength(1);
  });

  it('keeps secondary translations identity-only and non-canonical', () => {
    for (const translation of SECONDARY_TRANSLATIONS) {
      expect(translation.name).toBeTruthy();
      expect(translation.abbreviation).toBeTruthy();
      expect(Object.keys(translation)).toEqual(['id', 'name', 'abbreviation']);
    }
  });

  it('is internally consistent across rules, attribution and registry', () => {
    expect(SCRIPTURE_POLICY_RULES.length).toBeGreaterThanOrEqual(16);
    const domains = new Set(SCRIPTURE_POLICY_RULES.map((r) => r.domain));
    for (const required of [
      'quotation',
      'paraphrase',
      'attribution',
      'comparison',
      'original-language',
      'ambiguity',
      'verification',
    ]) {
      expect(domains.has(required as never)).toBe(true);
    }
    expect(TRANSLATION_ATTRIBUTION_STATEMENT).toContain('King James Version');
    const scriptureSource = SOURCE_REGISTRY.find(
      (s) => s.id === 'scripture-canon',
    );
    expect(scriptureSource?.edition).toBe('King James Version (KJV)');
  });
});

describe('canonical reference standard', () => {
  it('parses single verses and ranges including en dashes', () => {
    expect(parseCanonicalReference('Genesis 3:2')).toEqual({
      book: 'Genesis',
      chapter: 3,
      verseStart: 2,
    });
    expect(parseCanonicalReference('Luke 24:42\u201343')).toEqual({
      book: 'Luke',
      chapter: 24,
      verseStart: 42,
      verseEnd: 43,
    });
    expect(parseCanonicalReference('Deuteronomy 8:8')).toEqual({
      book: 'Deuteronomy',
      chapter: 8,
      verseStart: 8,
    });
    expect(parseCanonicalReference('1 Corinthians 10:4')).toEqual({
      book: '1 Corinthians',
      chapter: 10,
      verseStart: 4,
    });
  });

  it('rejects malformed references instead of guessing', () => {
    expect(parseCanonicalReference('not a verse')).toBeUndefined();
    expect(parseCanonicalReference('Genesis 3:banana')).toBeUndefined();
    expect(parseCanonicalReference('Luke 24:43-42')).toBeUndefined();
  });

  it('formats canonically with en dash and detects overlapping passages', () => {
    const range = parseCanonicalReference('Matthew 14:19-21');
    expect(range && formatCanonicalReference(range)).toBe(
      'Matthew 14:19\u201321',
    );
    const a = parseCanonicalReference('Luke 24:41-43');
    const b = parseCanonicalReference('Luke 24:42-44');
    const c = parseCanonicalReference('Luke 7:1-10');
    expect(a && b && samePassage(a, b)).toBe(true);
    expect(a && c && samePassage(a, c)).toBe(false);
  });
});

describe('direct quotation vs paraphrase policy', () => {
  const ref = parseCanonicalReference('John 21:9');

  it('requires precise valid references for direct quotes', () => {
    const missing = validateQuotation({ mode: 'direct-quote', text: 'x' });
    expect(missing).toContain('direct-quote-missing-reference');

    const bad = validateQuotation({
      mode: 'direct-quote',
      reference: { book: '', chapter: -1, verseStart: 0 },
    });
    expect(bad).toContain('direct-quote-invalid-reference');
  });

  it('marks unmarked omissions in excerpted quotes', () => {
    const issues = validateQuotation({
      mode: 'direct-quote',
      reference: ref,
      text: 'first part … last part',
    });
    expect(issues).toContain('direct-quote-unmarked-omission');
    const marked = validateQuotation({
      mode: 'direct-quote',
      reference: ref,
      text: 'first part … last part',
      omissionsMarked: true,
    });
    expect(marked).not.toContain('direct-quote-unmarked-omission');
  });

  it('demands explicit attribution when no page-level default exists', () => {
    const unattributed = validateQuotation({
      mode: 'direct-quote',
      reference: ref,
      pageDeclaresKjvDefault: false,
    });
    expect(unattributed).toContain('direct-quote-unattributed');
    const attributed = validateQuotation({
      mode: 'direct-quote',
      reference: ref,
      text: 'quoted words (KJV)',
      pageDeclaresKjvDefault: false,
    });
    expect(attributed).not.toContain('direct-quote-unattributed');
  });

  it('never allows a paraphrase to pose as quoted scripture', () => {
    const posing = validateQuotation({
      mode: 'paraphrase',
      reference: ref,
      text: '"editorial wording in quote marks"',
    });
    expect(posing).toContain('paraphrase-in-quote-marks');
    const honest = validateQuotation({
      mode: 'paraphrase',
      reference: ref,
      text: 'plain editorial retelling of the passage',
    });
    expect(honest).toEqual([]);
  });

  it('keeps direct quote and paraphrase structurally distinct modes', () => {
    // Double-quoted wording is fine INSIDE a direct quote but forbidden as
    // a paraphrase - same input, different policy verdict per mode.
    const text = '"wording inside quote marks"';
    const ref = parseCanonicalReference('John 21:9')!;
    expect(
      validateQuotation({ mode: 'direct-quote', reference: ref, text }),
    ).not.toContain('paraphrase-in-quote-marks');
    expect(
      validateQuotation({ mode: 'paraphrase', reference: ref, text }),
    ).toContain('paraphrase-in-quote-marks');
  });
});

describe('secondary translation comparison system', () => {
  it('contains only real researched comparisons, KJV-first and valid', () => {
    expect(TRANSLATION_COMPARISONS.length).toBeGreaterThanOrEqual(1);
    for (const comparison of TRANSLATION_COMPARISONS) {
      expect(validateComparison(comparison)).toEqual([]);
      expect(comparison.provenance).toContain('2026-08-23');
    }
    const mark = TRANSLATION_COMPARISONS.find(
      (c) => c.id === 'comparison-mark-11-13-fig-season',
    );
    expect(mark).toBeDefined();
    expect(mark?.primaryTranslationId).toBe('kjv');
    expect(mark?.secondaryTranslationId).toBe('web');
    expect(mark?.materialDifference).toContain('time of figs was not yet');
  });

  it('rejects comparisons that demote or hide KJV', () => {
    const ref = parseCanonicalReference('Judges 9:49');
    if (!ref) throw new Error('fixture reference must parse');
    const base = {
      id: 'comparison-test',
      subjectId: 'figs-entity',
      reference: ref,
      trigger: 'food-identification-affected' as const,
      provenance: 'structural test fixture, not real research data',
    };
    expect(
      validateComparison({
        ...base,
        primaryTranslationId: 'niv',
        secondaryTranslationId: 'esv',
      }),
    ).toContain('primary-not-kjv');
    expect(
      validateComparison({
        ...base,
        primaryTranslationId: 'kjv',
        secondaryTranslationId: 'kjv',
      }),
    ).toContain('secondary-cannot-be-canonical');
    expect(
      validateComparison({
        ...base,
        primaryTranslationId: 'kjv',
        secondaryTranslationId: 'vulgate',
      }),
    ).toContain('unknown-secondary-translation');
    const valid = validateComparison({
      ...base,
      primaryTranslationId: 'kjv',
      secondaryTranslationId: 'esv',
      uncertaintyNote: 'Renderings differ; conclusion pending real research.',
    });
    expect(valid).toEqual([]);
  });
});

describe('original language handling', () => {
  it('contains no decorative original-language entries', () => {
    expect(ORIGINAL_TERM_REFERENCES).toHaveLength(0);
  });

  it('rejects unsourced or decorative term analysis', () => {
    const ref = parseCanonicalReference('Nehemiah 3:13');
    if (!ref) throw new Error('fixture reference must parse');
    const unsourced = validateOriginalTerm({
      id: 'term-test',
      term: 'placeholder',
      language: 'hebrew',
      locations: [ref],
      issue: 'documented issue placeholder',
      basisSourceIds: [],
      evidence: 'speculative',
      provenance: 'structural test fixture only',
    });
    expect(unsourced).toContain('unsourced-analysis');
    const valid = validateOriginalTerm({
      id: 'term-test',
      term: 'placeholder',
      language: 'greek',
      locations: [ref],
      issue: 'documented issue placeholder',
      basisSourceIds: ['macdonald-2008'],
      evidence: 'attested',
      provenance: 'structural test fixture only',
    });
    expect(valid.filter((i) => i === 'unsourced-analysis')).toEqual([]);
  });
});

describe('translation ambiguity integration', () => {
  it('classifies ambiguity into blocker/warning/task without duplicates', () => {
    const blocker = translationAmbiguityQuestion({
      id: 'q-x',
      subjectId: 'figs-entity',
      question: 'Structural fixture question?',
      classification: 'publication-blocker',
    });
    expect(blocker?.resolution).toBe('blocker');
    expect(blocker?.kind).toBe('translation-ambiguity');

    const warning = translationAmbiguityQuestion({
      id: 'q-y',
      subjectId: 'olives-entity',
      question: 'Fixture?',
      classification: 'publication-warning',
    });
    expect(warning?.resolution).toBe('warning');

    const none = translationAmbiguityQuestion({
      id: 'q-z',
      subjectId: 'dates-entity',
      question: 'Fixture?',
      classification: 'no-material-ambiguity',
    });
    expect(none).toBeUndefined();
  });

  it('flows through the existing unresolved-question machinery', () => {
    // The registered honey devash ambiguity is warning-classified.
    const honey = openTranslationQuestions('honey');
    expect(honey.map((q) => q.resolution)).toContain('warning');
    expect(
      honey.every((q) => q.id !== 'question-meat-theological-review'),
    ).toBe(true);
    // Meat's theological review is NOT a translation ambiguity - axes stay separate.
    expect(
      UNRESOLVED_QUESTIONS.find((q) => q.subjectId === 'meat-in-the-bible')
        ?.kind,
    ).toBe('theological-review');
    expect(countUnresolvedTranslationAmbiguities()).toBeGreaterThan(0);
  });
});

describe('scripture claim verification requirements', () => {
  it('does not auto-verify derived anchor claims because policy now exists', () => {
    const anchors = RESEARCH_CLAIMS.filter((c) =>
      c.provenance.includes('brief-anchor'),
    );
    expect(anchors.length).toBeGreaterThanOrEqual(4);
    const anchor = anchors[0];
    const result = evaluateScriptureVerification(anchor);
    expect(result.eligible).toBe(false);
    expect(result.missing).toContain('claimReferenceAligned');
    for (const claim of anchors) {
      expect(claim.verification).toBe('unverified');
    }
  });

  it('requires recorded KJV wording checks for direct-quote claims', () => {
    const quoteClaim = syntheticScriptureClaim({
      scriptureContext: {
        reference: parseCanonicalReference('Ruth 2:14')!,
        mode: 'direct-quote',
      },
    });
    const withoutWork = evaluateScriptureVerification(quoteClaim);
    expect(withoutWork.missing).toContain('verifiedWordingRecorded');

    const withWork = evaluateScriptureVerification(quoteClaim, {
      verifiedWordingRecorded: true,
      claimReferenceAligned: true,
      disclosureSatisfied: true,
    });
    expect(withoutWork.missing).toContain('claimReferenceAligned');
    expect(withWork.missing).not.toContain('verifiedWordingRecorded');
  });

  it('treats reference-only claims as needing no wording check, only alignment', () => {
    const anchor = syntheticScriptureClaim({
      scriptureContext: {
        reference: parseCanonicalReference('Isaiah 1:1')!,
        mode: 'reference-only',
      },
    });
    const withoutAlignment = evaluateScriptureVerification(anchor);
    expect(withoutAlignment.missing).not.toContain('verifiedWordingRecorded');
    expect(withoutAlignment.missing).toContain('claimReferenceAligned');

    // With alignment recorded and no ambiguity/blocker on the subject, the
    // reference-only claim becomes verification-eligible under policy.
    const withAlignment = evaluateScriptureVerification(anchor, {
      claimReferenceAligned: true,
    });
    expect(withAlignment.eligible).toBe(true);
  });

  it('blocks claims on subjects carrying material translation blockers', () => {
    const gatedSubject = syntheticScriptureClaim({
      subjectId: 'meat-in-the-bible',
    });
    const result = evaluateScriptureVerification(gatedSubject, {
      claimReferenceAligned: true,
      disclosureSatisfied: true,
    });
    expect(result.missing).toContain('freeOfMaterialBlocker');
  });
});

describe('policy readiness vs research completion', () => {
  const RESEARCHED_DOSSIERS = new Set([
    'dossier-figs',
    'dossier-olives',
    'dossier-lentils',
    'dossier-barley',
    'dossier-dates',
    'dossier-honey',
    'dossier-foods-of-the-bible',
    'dossier-what-did-jesus-eat',
    'dossier-food-in-biblical-times',
  ]);
  const COMPLETED_DOSSIERS = new Set(['dossier-figs', 'dossier-dates']);

  it('shows non-pilot dossiers policy-ready yet honestly not-started', () => {
    for (const dossier of RESEARCH_DOSSIERS.filter(
      (d) => !RESEARCHED_DOSSIERS.has(d.id),
    )) {
      expect(dossier.researchStatus).toBe('not-started');
      const readiness = getScripturePolicyReadiness(dossier);
      expect(readiness.primaryTranslation).toBe('KJV');
      expect(readiness.policyReady).toBe(true);
      // POLICY READY != RESEARCH COMPLETE:
      expect(readiness.scriptureClaimsVerified).toBe(0);
    }
  });

  it('reflects recorded pilot verification work on the trio dossiers', () => {
    for (const dossier of RESEARCH_DOSSIERS.filter((d) =>
      RESEARCHED_DOSSIERS.has(d.id),
    )) {
      expect(dossier.researchStatus).toBe(
        COMPLETED_DOSSIERS.has(dossier.id) ? 'complete' : 'in-progress',
      );
      const readiness = getScripturePolicyReadiness(dossier);
      expect(readiness.primaryTranslation).toBe('KJV');
      if (dossier.id === 'dossier-food-in-biblical-times') {
        expect(readiness.scriptureClaimsVerified).toBe(0);
        expect(readiness.scriptureClaimsPending).toBeGreaterThan(0);
        continue;
      }
      expect(readiness.scriptureClaimsTotal).toBeGreaterThan(0);
      // Real verified wording checks exist for the pilot trio now...
      expect(readiness.scriptureClaimsVerified).toBeGreaterThan(0);
      // ...and the pending split stays arithmetically honest (figs may be
      // fully verified; olives/lentils carry disclosed pending items).
      expect(readiness.scriptureClaimsPending).toBe(
        readiness.scriptureClaimsTotal - readiness.scriptureClaimsVerified,
      );
    }
    const figsDossier = RESEARCH_DOSSIERS.find((d) => d.id === 'dossier-figs');
    if (!figsDossier) throw new Error('figs dossier must exist');
    const figsIssues = getScripturePolicyReadiness(figsDossier);
    expect(figsIssues.unresolvedTranslationIssueIds).toEqual([]);
  });

  it('surfaces open translation issues and honest claim counts', () => {
    // Honey: policy sees the devash disclosure even though the food dossier
    // has zero researched claims yet (honest structural state).
    const honeyDossier = RESEARCH_DOSSIERS.find(
      (d) => d.id === 'dossier-honey',
    );
    if (!honeyDossier) throw new Error('honey dossier must exist');
    const honeyReadiness = getScripturePolicyReadiness(honeyDossier);
    expect(honeyReadiness.unresolvedTranslationIssueIds).toContain(
      'question-honey-devash-translation',
    );
    expect(honeyReadiness.scriptureClaimsTotal).toBeGreaterThan(0);

    // Cornerstone: derived anchor claims exist, all still pending.
    const jesusDossier = RESEARCH_DOSSIERS.find(
      (d) => d.id === 'dossier-what-did-jesus-eat',
    );
    if (!jesusDossier) throw new Error('cornerstone dossier must exist');
    const jesusReadiness = getScripturePolicyReadiness(jesusDossier);
    expect(jesusReadiness.scriptureClaimsPending).toBeGreaterThan(0);
    expect(jesusReadiness.scriptureClaimsVerified).toBeGreaterThan(0);
  });
});

describe('backward compatibility guarantees', () => {
  it('leaves V3C.2 evidence/verification rules intact', () => {
    for (const claim of RESEARCH_CLAIMS) {
      expect(hasValidSourcesShim(claim)).toBe(true);
    }
    function hasValidSourcesShim(c: ResearchClaim): boolean {
      return (
        c.supports.length > 0 &&
        c.supports.every((s) =>
          SOURCE_REGISTRY.some((src) => src.id === s.sourceId),
        )
      );
    }
  });

  it('backs every verified claim with recorded work - no fake verification', () => {
    const verified = RESEARCH_CLAIMS.filter(
      (c) => c.verification === 'verified' && c.category === 'scripture',
    );
    // Verification exists only where real checking was recorded (pilot trio).
    expect(verified.length).toBeGreaterThan(0);
    for (const claim of verified) {
      const record = verificationRecordFor(claim.id);
      expect(record, claim.id).toBeDefined();
      const work = recordedWorkFor(claim);
      expect(work.verifiedWordingRecorded, claim.id).toBe(true);
      expect(work.claimReferenceAligned, claim.id).toBe(true);
      // Policy evaluation must agree the claim is verification-eligible.
      const result = evaluateScriptureVerification(claim, work);
      expect(result.eligible, claim.id).toBe(true);
    }
    // Anchor-derived claims remain outside the verified set.
    for (const claim of RESEARCH_CLAIMS.filter((c) =>
      c.provenance.includes('brief-anchor'),
    )) {
      expect(claim.verification).toBe('unverified');
    }
  });

  it('parses every derived anchor reference cleanly (machine validation)', () => {
    const anchors = RESEARCH_CLAIMS.filter((c) =>
      c.provenance.includes('brief-anchor'),
    );
    expect(anchors.length).toBeGreaterThanOrEqual(4);
    for (const claim of anchors) {
      expect(claim.scriptureContext, claim.id).toBeDefined();
      expect(claim.scriptureContext?.mode).toBe('reference-only');
      expect(claim.scriptureContext?.reference.chapter).toBeGreaterThan(0);
    }
  });
});
