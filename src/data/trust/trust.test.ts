import { describe, expect, it } from 'vitest';
import { auditTrust, TRUST_AUDIT } from './audit';
import { TRANSPARENCY_RECORDS } from './records';
import type { TransparencyRecord } from './types';

describe('V3C.21 trust pages and editorial transparency', () => {
  it('keeps canonical trust records structurally valid and non-public', () => {
    expect(TRUST_AUDIT.issues).toEqual([]);
    expect(TRANSPARENCY_RECORDS.length).toBeGreaterThan(0);
    expect(
      TRANSPARENCY_RECORDS.every(
        (x) => !x.publicReleased && x.publicationStatus === 'not-eligible',
      ),
    ).toBe(true);
  });

  it('keeps authority, citation and verification distinctions visible', () => {
    const record = TRANSPARENCY_RECORDS.find(
      (x) => x.id === 'trust-sources-citations-policy',
    );
    expect(record?.uncertaintyDisclosure).toMatch(/support strength/i);
    expect(record?.applicableSystems).toEqual(
      expect.arrayContaining(['authority', 'citations', 'verification']),
    );
  });

  it('keeps reconstruction distinct from direct historical attestation', () => {
    const record = TRANSPARENCY_RECORDS.find(
      (x) => x.id === 'trust-recipe-reconstruction-policy',
    );
    expect(record?.historicalRepresentation).toBe(
      'historically-informed-reconstruction',
    );
    expect(record?.uncertaintyDisclosure).toMatch(/Exact ingredients/i);
  });

  it('keeps scripture context linked to canonical scripture policy without claiming automatic verification', () => {
    const record = TRANSPARENCY_RECORDS.find(
      (x) => x.id === 'trust-scripture-context-policy',
    );
    expect(record?.scripturePolicyRuleIds).toEqual(
      expect.arrayContaining(['kjv-primary', 'verification-not-automatic']),
    );
    expect(record?.uncertaintyDisclosure).toMatch(/does not by itself verify/i);
  });

  it('detects duplicates, invalid references, hidden uncertainty and impossible publication', () => {
    const invalid: TransparencyRecord = {
      ...TRANSPARENCY_RECORDS[0],
      id: TRANSPARENCY_RECORDS[0].id,
      title: TRANSPARENCY_RECORDS[0].title,
      researchDossierIds: ['missing'],
      uncertaintyDisclosure: '',
      publicationStatus: 'not-eligible',
      publicationEligible: true,
      publicReleased: true,
    };
    const codes = auditTrust([TRANSPARENCY_RECORDS[0], invalid]).issues.map(
      (x) => x.code,
    );
    expect(codes).toEqual(
      expect.arrayContaining([
        'duplicate-id',
        'duplicate-title',
        'invalid-canonical-reference',
        'missing-uncertainty-disclosure',
        'impossible-publication-state',
      ]),
    );
  });

  it('rejects unresolved citation support being silently presented as fully supported', () => {
    const unresolved = TRANSPARENCY_RECORDS.find(
      (x) => x.id === 'trust-historical-uncertainty-limitations',
    );
    const invalid = { ...unresolved!, evidenceState: 'supported' as const };
    expect(auditTrust([invalid]).issues.map((x) => x.code)).toContain(
      'overclaim-beyond-citation-support',
    );
  });

  it('keeps editorial review, publication eligibility and public release separate', () => {
    const record = TRANSPARENCY_RECORDS.find(
      (x) => x.id === 'trust-editorial-publication-process',
    );
    expect(record?.productionStatus).toBe('draft');
    expect(record?.editorialReviewStatus).toBe('not-started');
    expect(record?.publicationEligible).toBe(false);
    expect(record?.publicReleased).toBe(false);
  });
});
