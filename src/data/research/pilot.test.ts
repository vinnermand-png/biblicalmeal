/**
 * V3C.4 PHASE 1A PILOT TRIO TESTS (figs / olives / lentils)
 * =========================================================
 * Enforces that the first real research layer stays honest:
 * - every verified claim has exactly one recorded KJV wording check
 * - recorded wording matches distinctive fetched phrases
 * - policy evaluation agrees verified claims are verification-eligible
 * - uncertainty flows survive (warning question, research task, in-review)
 * - axis separations hold (olive-oil vs olives; warnings never block)
 */

import { describe, expect, it } from 'vitest';
import {
  evaluateScriptureVerification,
  TRANSLATION_COMPARISONS,
  validateComparison,
} from '../scripture-policy';
import { RESEARCH_CLAIMS } from './claims';
import {
  SCRIPTURE_VERIFICATION_RECORDS,
  validateVerificationRegistry,
  verificationRecordFor,
} from './verification';
import { questionsForSubject } from './questions';
import { RESEARCH_DOSSIERS } from './dossiers';
import { buildProductionQueue } from '../production-queue';
import { validatePublication } from '../../lib/publication-gate';
import type { ResearchClaim } from './types';

const PILOT_SUBJECTS = [
  'figs',
  'olives',
  'lentils',
  'olive-oil',
  'barley',
  'dates',
  'honey',
];

const PILOT_CLAIMS: ResearchClaim[] = RESEARCH_CLAIMS.filter(
  (c) =>
    PILOT_SUBJECTS.includes(c.subjectId) &&
    !c.provenance.includes('Phase 2') &&
    !c.provenance.includes('brief-anchor'),
);

const byId = (id: string): ResearchClaim => {
  const claim = RESEARCH_CLAIMS.find((c) => c.id === id);
  if (!claim) throw new Error(`missing claim fixture: ${id}`);
  return claim;
};

function recordedWorkOf(claim: ResearchClaim): {
  verifiedWordingRecorded: boolean;
  claimReferenceAligned: boolean;
  disclosureSatisfied: boolean;
} {
  const record = verificationRecordFor(claim.id);
  return {
    verifiedWordingRecorded: record !== undefined,
    claimReferenceAligned:
      record !== undefined && claim.scriptureContext !== undefined,
    disclosureSatisfied:
      claim.uncertaintyNote !== undefined ||
      questionsForSubject(claim.subjectId).every(
        (q) => q.resolution !== 'warning',
      ),
  };
}

describe('pilot claim registry integrity', () => {
  it('registers all three pilot subjects with real claims', () => {
    for (const subject of ['figs', 'olives', 'lentils']) {
      const claims = PILOT_CLAIMS.filter((c) => c.subjectId === subject);
      expect(claims.length, subject).toBeGreaterThanOrEqual(5);
    }
    expect(PILOT_CLAIMS.length).toBeGreaterThanOrEqual(20);
  });

  it('keeps olive-oil claims on their own subject axis', () => {
    const oilClaims = PILOT_CLAIMS.filter((c) => c.subjectId === 'olive-oil');
    expect(oilClaims.length).toBeGreaterThanOrEqual(1);
    for (const claim of oilClaims) {
      expect(claim.text.toLowerCase()).toContain('oil');
    }
  });
});

describe('recorded KJV wording checks', () => {
  it('satisfies the bidirectional record/claim invariant globally', () => {
    expect(validateVerificationRegistry(RESEARCH_CLAIMS)).toEqual([]);
    expect(SCRIPTURE_VERIFICATION_RECORDS.length).toBeGreaterThanOrEqual(20);
  });

  it('records only real retrieved wording (distinctive phrase spot checks)', () => {
    expect(
      verificationRecordFor('claim-figs-abigail-provision')?.verifiedWording,
    ).toContain('two hundred cakes of figs');
    expect(
      verificationRecordFor('claim-lentils-esau-pottage')?.verifiedWording,
    ).toContain('pottage of lentiles');
    expect(
      verificationRecordFor('claim-olives-deut-oil-olive')?.verifiedWording,
    ).toContain('a land of oil olive');
    expect(
      verificationRecordFor('claim-figs-mark-season-note')?.verifiedWording,
    ).toContain('the time of figs was not yet');
    expect(
      verificationRecordFor('claim-olives-micah-treading')?.verifiedWording,
    ).toContain('thou shalt tread the olives');
    expect(
      verificationRecordFor('claim-lentils-ezekiel-siege-bread')
        ?.verifiedWording,
    ).toContain('beans, and lentiles, and millet');
    for (const record of SCRIPTURE_VERIFICATION_RECORDS) {
      expect(record.accessedAt).toBe('2026-08-23');
      expect(record.accessPoint).toMatch(/Bible Gateway|bible-api\.com/);
    }
  });

  it('makes policy evaluation agree with recorded work for verified claims', () => {
    const verified = PILOT_CLAIMS.filter((c) => c.verification === 'verified');
    expect(verified.length).toBeGreaterThanOrEqual(15);
    for (const claim of verified) {
      const result = evaluateScriptureVerification(
        claim,
        recordedWorkOf(claim),
      );
      expect(result.eligible, claim.id).toBe(true);
    }
  });

  it('keeps pending claims disclosed with no recorded-work shortcut', () => {
    const pending = PILOT_CLAIMS.filter((c) => c.verification !== 'verified');
    expect(pending.length).toBeGreaterThanOrEqual(4);
    for (const claim of pending) {
      // Disclosure obligations stay visible on every pending claim.
      const mustDisclose =
        claim.verification !== 'verified' ||
        claim.supports.some((s) => s.level !== 'direct');
      expect(mustDisclose, claim.id).toBe(true);
      if (claim.verification === 'in-review') {
        expect(claim.uncertaintyNote, claim.id).toBeDefined();
        expect(claim.provenance).toContain('2026-08-23');
      }
      if (claim.verification === 'unverified') {
        // MacDonald placeholders: identified but explicitly unconsulted.
        expect(
          claim.supports.some(
            (s) =>
              s.sourceId === 'macdonald-2008' &&
              s.qualification?.includes('NOT yet consulted'),
          ),
          claim.id,
        ).toBe(true);
      }
    }
  });
});

describe('uncertainty flow for the trio', () => {
  it('tracks sycomore identification as a backlog task without blocking', () => {
    const question = questionsForSubject('figs').find(
      (q) => q.id === 'question-figs-sycomore-identification',
    );
    expect(question?.resolution).toBe('research-task');
    expect(question?.kind).toBe('disputed-identification');
    expect(byId('claim-figs-amos-sycomore').uncertaintyNote).toContain(
      'Ficus sycomorus',
    );
  });

  it('keeps the Deuteronomy 8:8 oil-olive scope as a visible warning', () => {
    const question = questionsForSubject('olives').find(
      (q) => q.id === 'question-olives-deut-wording',
    );
    expect(question?.resolution).toBe('warning');
    const verifiedOlives = PILOT_CLAIMS.filter(
      (c) => c.subjectId === 'olives' && c.verification === 'verified',
    );
    expect(verifiedOlives.length).toBeGreaterThan(0);
    for (const claim of verifiedOlives) {
      expect(claim.uncertaintyNote, claim.id).toBeDefined();
    }
  });

  it('never adds blockers to the trio subjects', () => {
    for (const subject of ['figs', 'olives', 'lentils']) {
      expect(
        questionsForSubject(subject).every((q) => q.resolution !== 'blocker'),
        subject,
      ).toBe(true);
    }
  });
});

describe('translation comparison integration', () => {
  it('documents Mark 11:13 as a researched KJV-vs-WEB comparison', () => {
    const comparison = TRANSLATION_COMPARISONS[0];
    expect(comparison.id).toBe('comparison-mark-11-13-fig-season');
    expect(validateComparison(comparison)).toEqual([]);
    const markClaim = byId('claim-figs-mark-season-note');
    expect(markClaim.scriptureContext?.comparisonRequired).toBe(true);
    expect(markClaim.verification).toBe('verified');
  });
});

describe('dossiers, queue and gate integration', () => {
  it('links pilot claims into the trio dossiers with session notes', () => {
    for (const [dossierId, subject] of [
      ['dossier-figs', 'figs'],
      ['dossier-olives', 'olives'],
      ['dossier-lentils', 'lentils'],
    ] as const) {
      const dossier = RESEARCH_DOSSIERS.find((d) => d.id === dossierId);
      expect(dossier, dossierId).toBeDefined();
      const pilotIds = PILOT_CLAIMS.filter((c) => c.subjectId === subject).map(
        (c) => c.id,
      );
      for (const id of pilotIds) {
        expect(dossier?.claimIds, id).toContain(id);
      }
      expect(dossier?.researchNotes?.length).toBeGreaterThan(3);
    }
  });

  it('surfaces the olive wording warning in the production queue without blocking', () => {
    const queue = buildProductionQueue();
    const researchBlockersOf = (id: string) =>
      queue
        .find((i) => i.targetId === id)
        ?.blockers.filter((b) => b.code.startsWith('research-')) ?? [];
    const warningsOf = (id: string) =>
      queue.find((i) => i.targetId === id)?.researchWarnings ?? [];
    // Olive wording ambiguity: visible warning, never a blocker.
    expect(warningsOf('olives').map((w) => w.code)).toContain(
      'research-translation-ambiguity',
    );
    expect(researchBlockersOf('olives')).toHaveLength(0);
    // Figs: sycomore item is backlog-only - neither warning nor blocker.
    expect(warningsOf('figs')).toHaveLength(0);
    expect(researchBlockersOf('figs')).toHaveLength(0);
    expect(researchBlockersOf('lentils')).toHaveLength(0);
  });

  it('lets the gate consume pilot research state correctly', () => {
    const base = {
      description:
        'A meaningful ingredient description long enough to pass the gate.',
      scriptureRefs: [{ book: 'Genesis', chapter: 3, verseStart: 7 }],
      scriptureNote: 'Framing sentence for cited references.',
      history: 'Recorded historical context paragraph.',
    };
    // Figs entity: no warnings or blockers from pilot research.
    const figsResult = validatePublication(
      {
        collection: 'ingredients',
        id: 'figs',
        workflowStatus: 'approved',
        data: { ...base, researchSubjectId: 'figs-entity' },
      },
      { consumeResearchState: true },
    );
    expect(figsResult.ready).toBe(true);
    expect(
      figsResult.warnings.filter((w) =>
        w.code.startsWith('research-disclosure'),
      ),
    ).toEqual([]);
    // Olives entity: disclosure warning flows through; nothing blocks.
    const olivesResult = validatePublication(
      {
        collection: 'ingredients',
        id: 'olives',
        workflowStatus: 'approved',
        data: { ...base, researchSubjectId: 'olives-entity' },
      },
      { consumeResearchState: true },
    );
    expect(olivesResult.ready).toBe(true);
    expect(olivesResult.warnings.map((w) => w.code)).toContain(
      'research-disclosure-question-olives-deut-wording',
    );
    // Olive-oil has claims but no dossier - still a resolvable subject.
    const oilResult = validatePublication(
      {
        collection: 'ingredients',
        id: 'olive-oil',
        workflowStatus: 'approved',
        data: { ...base, researchSubjectId: 'olive-oil' },
      },
      { consumeResearchState: true },
    );
    expect(oilResult.blockers).toHaveLength(0);
  });
});

describe('Phase 1B and 1C research boundaries', () => {
  it('records verified barley claims with exactly one aligned record each', () => {
    const claims = RESEARCH_CLAIMS.filter(
      (c) => c.subjectId === 'barley' && c.category === 'scripture',
    );
    expect(claims.length).toBeGreaterThanOrEqual(5);
    for (const claim of claims) {
      if (claim.verification !== 'verified') continue;
      expect(verificationRecordFor(claim.id)).toBeDefined();
    }
    expect(validateVerificationRegistry(RESEARCH_CLAIMS)).toEqual([]);
  });

  it('does not collapse palm references into edible-date claims', () => {
    const dateClaims = RESEARCH_CLAIMS.filter(
      (c) => c.subjectId === 'dates' && c.provenance.includes('Phase 1B'),
    );
    expect(dateClaims.length).toBeGreaterThan(0);
    expect(dateClaims.every((c) => /palm/i.test(c.text))).toBe(true);
    expect(dateClaims.every((c) => c.uncertaintyNote)).toBe(true);
    expect(
      dateClaims.every(
        (c) =>
          c.scriptureContext?.ambiguityQuestionId ===
          'question-dates-palm-fruit-identification',
      ),
    ).toBe(true);
    expect(questionsForSubject('dates').map((q) => q.resolution)).toContain(
      'warning',
    );
  });

  it('keeps honey devash disclosure on every researched honey claim', () => {
    const honey = RESEARCH_CLAIMS.filter(
      (c) => c.subjectId === 'honey' && c.provenance.includes('Phase 1B'),
    );
    expect(honey.length).toBeGreaterThan(0);
    expect(honey.every((c) => c.uncertaintyNote)).toBe(true);
    expect(
      honey.every(
        (c) =>
          c.scriptureContext?.ambiguityQuestionId ===
          'question-honey-devash-translation',
      ),
    ).toBe(true);
    expect(
      questionsForSubject('honey').some(
        (q) => q.id === 'question-honey-devash-translation',
      ),
    ).toBe(true);
  });

  it('reconciles verified scripture claims, records, and dashboard totals dynamically', () => {
    const verifiedScripture = RESEARCH_CLAIMS.filter(
      (c) => c.category === 'scripture' && c.verification === 'verified',
    );
    const records = SCRIPTURE_VERIFICATION_RECORDS.filter((r) =>
      verifiedScripture.some((c) => c.id === r.claimId),
    );
    expect(verifiedScripture.length).toBe(records.length);
    expect(SCRIPTURE_VERIFICATION_RECORDS.length).toBeGreaterThanOrEqual(
      records.length,
    );
    expect(validateVerificationRegistry(RESEARCH_CLAIMS)).toEqual([]);
  });

  it('keeps cornerstone claims distinct from ingredient claim ownership', () => {
    const cornerstone = RESEARCH_CLAIMS.filter((c) =>
      c.provenance.includes('Phase 1C'),
    );
    expect(cornerstone.map((c) => c.id)).toEqual([
      'claim-foods-of-bible-category-boundary',
      'claim-jesus-explicit-fish-honeycomb',
      'claim-biblical-times-no-universal-diet',
    ]);
    expect(cornerstone.some((c) => c.verification === 'unverified')).toBe(true);
  });
});
