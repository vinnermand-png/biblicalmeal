import { describe, expect, it } from 'vitest';
import { AUTHORITY_AUDIT, auditAuthority } from './audit';
import { AUTHORITY_RECORDS, CITATION_RECORDS } from './records';
import type { CitationRecord } from './types';

describe('V3C.20 authority and citation expansion', () => {
  it('keeps canonical authority and citation seeds valid', () => {
    expect(AUTHORITY_AUDIT.issues).toEqual([]);
    expect(AUTHORITY_RECORDS.length).toBeGreaterThan(0);
    expect(CITATION_RECORDS.length).toBeGreaterThan(0);
  });
  it('keeps authority classification separate from citation verification', () => {
    const unresolved = CITATION_RECORDS.find((x) => x.relationship === 'unresolved');
    expect(unresolved?.verificationState).toBe('unresolved');
    expect(unresolved?.claimStrength).toBe('background');
  });
  it('detects duplicate identities and invalid canonical references', () => {
    const invalid = { ...CITATION_RECORDS[0], authorityId: 'missing', targetId: 'missing' } as CitationRecord;
    const audit = auditAuthority([AUTHORITY_RECORDS[0], AUTHORITY_RECORDS[0]], [CITATION_RECORDS[0], invalid]);
    expect(audit.issues.map((x) => x.code)).toEqual(expect.arrayContaining(['duplicate-authority-id','duplicate-citation-id','invalid-authority-reference','invalid-target-reference']));
  });
  it('rejects overclaiming, invalid direct support and hidden uncertainty', () => {
    const invalid: CitationRecord = { ...CITATION_RECORDS[1], id: 'citation-invalid', relationship: 'directly-supports', evidenceState: 'unresolved', verificationState: 'verified', claimStrength: 'direct', uncertaintyDisclosure: '' };
    expect(auditAuthority(AUTHORITY_RECORDS, [invalid]).issues.map((x) => x.code)).toEqual(expect.arrayContaining(['claim-strength-violation','direct-support-mismatch','missing-uncertainty-disclosure']));
  });
  it('does not let citation records publish or complete unrelated content', () => {
    expect(CITATION_RECORDS.some((x) => x.verificationState === 'unresolved')).toBe(true);
    expect(CITATION_RECORDS.every((x) => x.targetKind !== 'recipe-content')).toBe(true);
  });
});
