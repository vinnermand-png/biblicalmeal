import { describe, expect, it } from 'vitest';
import { RESEARCH_CLAIMS } from './claims';
import {
  FIRST_WAVE_COMPLETENESS_AUDIT,
  auditDossier,
  completenessForDossier,
} from './audit';
import { RESEARCH_DOSSIERS } from './dossiers';
import {
  SOURCE_ASSESSMENTS,
  meetsExternalPromotionCriteria,
  validateSourceAssessments,
} from './source-assessments';
import { SOURCE_REGISTRY } from './sources';
import { DOSSIER_COMPLETION_RECORDS } from './completions';
import {
  SCRIPTURE_VERIFICATION_RECORDS,
  validateVerificationRegistry,
} from './verification';

describe('V3C.4 Phase 4 completeness audit', () => {
  it('exposes the current dynamic registry totals without promotion', () => {
    expect(RESEARCH_CLAIMS).toHaveLength(60);
    expect(
      RESEARCH_CLAIMS.filter((claim) => claim.verification === 'verified'),
    ).toHaveLength(47);
    expect(
      RESEARCH_CLAIMS.filter((claim) => claim.verification === 'in-review'),
    ).toHaveLength(6);
    expect(
      RESEARCH_CLAIMS.filter((claim) => claim.verification === 'unverified'),
    ).toHaveLength(7);
  });

  it('assesses every registered external source with reasoning', () => {
    expect(validateSourceAssessments()).toEqual([]);
    expect(SOURCE_ASSESSMENTS).toHaveLength(
      SOURCE_REGISTRY.filter((source) => source.kind !== 'scripture').length,
    );
    for (const assessment of SOURCE_ASSESSMENTS) {
      expect(assessment.reasoning.length).toBeGreaterThan(20);
      expect(assessment.limitations.length).toBeGreaterThan(20);
    }
  });

  it('audits every first-wave dossier dynamically', () => {
    expect(FIRST_WAVE_COMPLETENESS_AUDIT).toHaveLength(
      RESEARCH_DOSSIERS.length,
    );
    for (const entry of FIRST_WAVE_COMPLETENESS_AUDIT) {
      expect(['in-progress', 'complete']).toContain(entry.researchStatus);
      expect(entry.dossierId).toMatch(/^dossier-/);
      expect(entry.externalSourceIds).toEqual(
        expect.arrayContaining(entry.reviewedSourceIds),
      );
    }
  });

  it('does not equate external sources with dossier completion', () => {
    const dates = completenessForDossier('dossier-dates');
    expect(dates?.externalSourceIds).toContain('science-2020-judean-date-palm');
    expect(dates?.reviewedSourceIds).toContain('science-2020-judean-date-palm');
    expect(dates?.researchStatus).toBe('complete');
  });

  it('keeps historical evidence in-review rather than falsely verified', () => {
    const historical = RESEARCH_CLAIMS.filter(
      (claim) =>
        claim.category !== 'scripture' &&
        claim.supports.some(
          (support) => support.sourceId !== 'scripture-canon',
        ),
    );
    expect(historical.length).toBeGreaterThan(0);
    expect(
      historical.filter((claim) => claim.verification === 'verified'),
    ).toHaveLength(3);
    expect(
      historical.filter((claim) => claim.verification === 'in-review').length,
    ).toBeGreaterThan(0);
  });

  it('requires reviewed, directly supporting evidence for external promotion', () => {
    const promoted = RESEARCH_CLAIMS.filter(
      (claim) =>
        claim.verification === 'verified' && claim.category !== 'scripture',
    );
    expect(promoted.length).toBe(3);
    expect(promoted.every(meetsExternalPromotionCriteria)).toBe(true);
    expect(
      meetsExternalPromotionCriteria({
        category: 'historical',
        supports: [{ sourceId: 'macdonald-2008', level: 'direct' }],
      }),
    ).toBe(false);
  });

  it('preserves the 44-claim Scripture baseline plus aligned additions', () => {
    const verifiedScripture = RESEARCH_CLAIMS.filter(
      (claim) =>
        claim.category === 'scripture' && claim.verification === 'verified',
    );
    expect(verifiedScripture.length).toBe(44);
    expect(SCRIPTURE_VERIFICATION_RECORDS.length).toBe(
      verifiedScripture.length,
    );
    expect(validateVerificationRegistry(RESEARCH_CLAIMS)).toEqual([]);
  });

  it('derives readiness without promoting dossier status', () => {
    const figs = completenessForDossier('dossier-figs');
    const dates = completenessForDossier('dossier-dates');
    const olives = completenessForDossier('dossier-olives');
    expect(figs?.researchCompleteEligible).toBe(true);
    expect(dates?.readinessReasons).toEqual([]);
    expect(dates?.unresolvedWarnings).toBe(1);
    expect(dates?.researchCompleteEligible).toBe(true);
    expect(olives?.researchCompleteEligible).toBe(false);
    expect(figs?.researchStatus).toBe('complete');
    expect(dates?.researchStatus).toBe('complete');
    expect(figs?.readinessClassification).toBe('complete');
    expect(dates?.readinessClassification).toBe('complete');
    expect(figs?.completionRecordStatus).toBe('present');
    expect(dates?.completionRecordStatus).toBe('present');
  });

  it('rejects a manually completed dossier without satisfied criteria', () => {
    const barley = RESEARCH_DOSSIERS.find((d) => d.id === 'dossier-barley');
    if (!barley) throw new Error('barley dossier must exist');
    const manual = auditDossier({
      ...barley,
      id: 'dossier-manual-barley',
      researchStatus: 'complete',
    });
    expect(manual.researchCompleteEligible).toBe(false);
    expect(manual.readinessClassification).toBe('blocked');
    expect(manual.readinessReasons).toContain('complete-status-without-record');
  });

  it('requires completion records to preserve scope, criteria, warnings, and reason', () => {
    expect(DOSSIER_COMPLETION_RECORDS).toHaveLength(2);
    for (const record of DOSSIER_COMPLETION_RECORDS) {
      expect(record.scope.length).toBeGreaterThan(20);
      expect(record.criteriaSatisfied.length).toBeGreaterThan(0);
      expect(record.completionReason.length).toBeGreaterThan(20);
    }
    const dates = DOSSIER_COMPLETION_RECORDS.find(
      (record) => record.dossierId === 'dossier-dates',
    );
    expect(dates?.remainingWarnings.length).toBeGreaterThan(0);
    expect(dates?.unresolvedUncertainty.length).toBeGreaterThan(0);
  });
});
