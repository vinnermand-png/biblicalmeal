/** V3C.4 completeness and readiness audit, derived from the research registries. */
import { RESEARCH_CLAIMS } from './claims';
import { RESEARCH_DOSSIERS } from './dossiers';
import { questionsForSubject } from './questions';
import { getSource } from './sources';
import { getSourceAssessment } from './source-assessments';
import type { ResearchDossier } from './types';
import { completionRecordFor } from './completions';

export interface DossierCompleteness {
  dossierId: string;
  researchStatus: ResearchDossier['researchStatus'];
  verifiedScriptureEvidence: number;
  externalSourceIds: string[];
  reviewedSourceIds: string[];
  assessedSourceIds: string[];
  unresolvedBlockers: number;
  unresolvedWarnings: number;
  unverifiedClaims: number;
  inReviewClaims: number;
  researchCompleteEligible: boolean;
  readinessReasons: string[];
  readinessClassification: 'complete' | 'eligible' | 'progressing' | 'blocked';
  completionRecordStatus: 'present' | 'absent';
}

function subjectKeys(dossier: ResearchDossier): Set<string> {
  return new Set([dossier.subjectId, ...dossier.relatedTargetIds]);
}

export function auditDossier(dossier: ResearchDossier): DossierCompleteness {
  const keys = subjectKeys(dossier);
  const claims = RESEARCH_CLAIMS.filter((claim) => keys.has(claim.subjectId));
  const questions = [...keys].flatMap(questionsForSubject);
  const externalSourceIds = [
    ...new Set(
      claims.flatMap((claim) =>
        claim.supports
          .map((support) => support.sourceId)
          .filter((sourceId) => sourceId !== 'scripture-canon'),
      ),
    ),
  ];
  const reviewedSourceIds = externalSourceIds.filter(
    (sourceId) => getSource(sourceId)?.reviewedAt !== undefined,
  );
  const assessedSourceIds = externalSourceIds.filter((sourceId) => {
    const quality = getSourceAssessment(sourceId)?.quality;
    return quality !== undefined && quality !== 'unassessed';
  });
  const unresolvedBlockers = questions.filter(
    (q) => q.resolution === 'blocker',
  ).length;
  const unresolvedWarnings = questions.filter(
    (q) => q.resolution === 'warning',
  ).length;
  const unverifiedClaims = claims.filter(
    (claim) => claim.verification === 'unverified',
  ).length;
  const inReviewClaims = claims.filter(
    (claim) => claim.verification === 'in-review',
  ).length;
  const readinessReasons: string[] = [];
  if (externalSourceIds.some((id) => !reviewedSourceIds.includes(id))) {
    readinessReasons.push('external-source-not-reviewed');
  }
  if (externalSourceIds.some((id) => !assessedSourceIds.includes(id))) {
    readinessReasons.push('external-source-not-assessed');
  }
  if (inReviewClaims > 0) readinessReasons.push('claims-in-review');
  if (unverifiedClaims > 0) readinessReasons.push('claims-unverified');
  if (unresolvedBlockers > 0) readinessReasons.push('unresolved-blocker');
  const completionRecord = completionRecordFor(dossier.id);
  if (dossier.researchStatus === 'complete' && !completionRecord) {
    readinessReasons.push('complete-status-without-record');
  }
  if (completionRecord && readinessReasons.length > 0) {
    readinessReasons.push('completion-record-criteria-not-satisfied');
  }
  const researchCompleteEligible = readinessReasons.length === 0;
  return {
    dossierId: dossier.id,
    researchStatus: dossier.researchStatus,
    verifiedScriptureEvidence: claims.filter(
      (claim) =>
        claim.category === 'scripture' && claim.verification === 'verified',
    ).length,
    externalSourceIds,
    reviewedSourceIds,
    assessedSourceIds,
    unresolvedBlockers,
    unresolvedWarnings,
    unverifiedClaims,
    inReviewClaims,
    researchCompleteEligible,
    readinessReasons,
    readinessClassification:
      dossier.researchStatus === 'complete' && researchCompleteEligible
        ? 'complete'
        : unresolvedBlockers > 0 ||
            (dossier.researchStatus === 'complete' && !researchCompleteEligible)
          ? 'blocked'
          : researchCompleteEligible
            ? 'eligible'
            : 'progressing',
    completionRecordStatus: completionRecord ? 'present' : 'absent',
  };
}

export const FIRST_WAVE_COMPLETENESS_AUDIT =
  RESEARCH_DOSSIERS.map(auditDossier);

export function completenessForDossier(
  dossierId: string,
): DossierCompleteness | undefined {
  return FIRST_WAVE_COMPLETENESS_AUDIT.find(
    (entry) => entry.dossierId === dossierId,
  );
}
