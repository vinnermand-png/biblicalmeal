import { describe, expect, it } from 'vitest';
import { AUTHORITY_AUDIT } from './authority/audit';
import { CITATION_RECORDS } from './authority/records';
import {
  getPublicSourceRegistry,
  getTransparencySnapshot,
  TRANSPARENCY_EVIDENCE_LABELS,
} from './editorial-transparency';

describe('V3C.21 trust and editorial transparency', () => {
  it('keeps the public transparency snapshot tied to canonical records', () => {
    const snapshot = getTransparencySnapshot();
    expect(snapshot.auditIssueCount).toBe(AUTHORITY_AUDIT.issues.length);
    expect(snapshot.citationCount).toBe(CITATION_RECORDS.length);
    expect(snapshot.evidenceStates).toEqual(
      expect.arrayContaining(['contextual', 'unresolved']),
    );
  });

  it('defines visible language for every citation evidence state', () => {
    for (const citation of CITATION_RECORDS) {
      expect(TRANSPARENCY_EVIDENCE_LABELS[citation.evidenceState]).toBeTruthy();
    }
  });

  it('exposes only canonical source metadata and does not fabricate completeness', () => {
    const sources = getPublicSourceRegistry();
    expect(sources.length).toBeGreaterThan(0);
    expect(
      sources.every((source) => source.id && source.title && source.notes),
    ).toBe(true);
    expect(sources.some((source) => source.reliability === 'unassessed')).toBe(
      true,
    );
  });
});
