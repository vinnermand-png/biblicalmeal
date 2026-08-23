/**
 * V3C.4 SCRIPTURE VERIFICATION RECORDS
 * ====================================
 * Central registry of RECORDED KJV wording checks - the concrete work
 * product scripture-policy.ts anticipated ("verification requires recorded
 * checking work"). Nothing here auto-verifies: records exist only because
 * the passages were actually retrieved and read during research sessions.
 *
 * INVARIANT (test-enforced): every claim in RESEARCH_CLAIMS carrying
 * verification:'verified' must have exactly one record here whose reference
 * aligns with the claim's scriptureContext.
 *
 * Whitespace in verifiedWording is normalized from the retrieved public
 * domain text (retrieval endpoints insert line breaks); wording itself is
 * never altered.
 */

import { parseCanonicalReference } from '../../lib/scripture';
import type { ScriptureRef } from '../../lib/scripture';
import type { ResearchClaim, ScriptureVerificationRecord } from './types';
import { questionsForSubject } from './questions';
import { FIGS_VERIFICATION_RECORDS } from './pilot/figs';
import { OLIVES_VERIFICATION_RECORDS } from './pilot/olives';
import { LENTILS_VERIFICATION_RECORDS } from './pilot/lentils';
import { BARLEY_VERIFICATION_RECORDS } from './pilot/barley';
import { DATES_VERIFICATION_RECORDS } from './pilot/dates';
import { HONEY_VERIFICATION_RECORDS } from './pilot/honey';
import { CORNERSTONE_VERIFICATION_RECORDS } from './cornerstones';

export const SCRIPTURE_VERIFICATION_RECORDS: ScriptureVerificationRecord[] = [
  ...FIGS_VERIFICATION_RECORDS,
  ...OLIVES_VERIFICATION_RECORDS,
  ...LENTILS_VERIFICATION_RECORDS,
  ...BARLEY_VERIFICATION_RECORDS,
  ...DATES_VERIFICATION_RECORDS,
  ...HONEY_VERIFICATION_RECORDS,
  ...CORNERSTONE_VERIFICATION_RECORDS,
];

export function verificationRecordFor(
  claimId: string,
): ScriptureVerificationRecord | undefined {
  return SCRIPTURE_VERIFICATION_RECORDS.find((r) => r.claimId === claimId);
}

/** Same passage identity for a parsed ref vs a record's canonical text. */
function alignsWithRecord(
  claimRef: ScriptureRef,
  record: ScriptureVerificationRecord,
): boolean {
  const parsed = parseCanonicalReference(record.referenceText);
  if (!parsed) return false;
  const sameBook = parsed.book.toLowerCase() === claimRef.book.toLowerCase();
  const sameChapter = parsed.chapter === claimRef.chapter;
  const recordEnd = parsed.verseEnd ?? parsed.verseStart;
  const claimEnd = claimRef.verseEnd ?? claimRef.verseStart;
  const overlaps =
    parsed.verseStart <= claimEnd && claimRef.verseStart <= recordEnd;
  return sameBook && sameChapter && overlaps;
}

export type VerificationRegistryIssue =
  | 'duplicate-record-id'
  | 'duplicate-claim-record'
  | 'unparsable-reference'
  | 'missing-wording'
  | 'missing-access-point'
  | 'invalid-accessed-at'
  | 'record-without-verified-claim'
  | 'verified-claim-without-record'
  | 'record-reference-misaligned';

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates the whole verification layer against the claim registry:
 * structural integrity of every record, plus the bidirectional invariant
 * with verified claims and per-record reference alignment.
 */
export function validateVerificationRegistry(
  claims: ResearchClaim[],
): VerificationRegistryIssue[] {
  const issues: VerificationRegistryIssue[] = [];
  const seenIds = new Set<string>();
  const seenClaims = new Set<string>();
  for (const record of SCRIPTURE_VERIFICATION_RECORDS) {
    if (seenIds.has(record.id)) issues.push('duplicate-record-id');
    seenIds.add(record.id);
    if (seenClaims.has(record.claimId)) issues.push('duplicate-claim-record');
    seenClaims.add(record.claimId);
    if (!parseCanonicalReference(record.referenceText)) {
      issues.push('unparsable-reference');
    }
    if (!record.verifiedWording.trim()) issues.push('missing-wording');
    if (!record.accessPoint.trim()) issues.push('missing-access-point');
    if (!ISO_DATE.test(record.accessedAt)) issues.push('invalid-accessed-at');
    const claim = claims.find((c) => c.id === record.claimId);
    if (!claim || claim.verification !== 'verified') {
      issues.push('record-without-verified-claim');
    } else if (
      !claim.scriptureContext ||
      !alignsWithRecord(claim.scriptureContext.reference, record)
    ) {
      issues.push('record-reference-misaligned');
    }
  }
  for (const claim of claims) {
    if (
      claim.category === 'scripture' &&
      claim.verification === 'verified' &&
      !seenClaims.has(claim.id)
    ) {
      issues.push('verified-claim-without-record');
    }
  }
  return issues;
}

/**
 * Recorded policy work for a claim, derived from its verification record.
 * Feeds evaluateScriptureVerification without weakening it: alignment and
 * disclosure inputs come only from recorded artifacts, never assumptions.
 */
export function recordedWorkFor(claim: ResearchClaim): {
  verifiedWordingRecorded: boolean;
  claimReferenceAligned: boolean;
  disclosureSatisfied: boolean;
} {
  const record = verificationRecordFor(claim.id);
  return {
    verifiedWordingRecorded:
      record !== undefined &&
      !!parseCanonicalReference(record.referenceText) &&
      !!record.verifiedWording.trim(),
    claimReferenceAligned:
      record !== undefined &&
      !!claim.scriptureContext &&
      alignsWithRecord(claim.scriptureContext.reference, record),
    disclosureSatisfied:
      claim.uncertaintyNote !== undefined ||
      questionsForSubject(claim.subjectId).every(
        (q) => q.resolution !== 'warning',
      ),
  };
}
