import { describe, expect, it } from 'vitest';
import { auditInstagramContent } from './audit';
import { INSTAGRAM_CONTENT_RECORDS, INSTAGRAM_PROVIDER_BOUNDARY } from './records';

describe('V3C.32 Instagram content engine', () => {
  it('passes the canonical audit', () => {
    expect(auditInstagramContent()).toEqual([]);
  });

  it('rejects an unknown canonical source', () => {
    const record = {
      ...INSTAGRAM_CONTENT_RECORDS[0],
      canonicalSources: [{ kind: 'article-content' as const, id: 'missing-source' }],
    };
    expect(auditInstagramContent([record]).some((issue) => issue.code === 'invalid-source-reference')).toBe(true);
  });

  it('keeps AI and publishing integrations unconfigured', () => {
    expect(INSTAGRAM_PROVIDER_BOUNDARY.aiProviderMode).toBe('not-configured');
    expect(INSTAGRAM_PROVIDER_BOUNDARY.instagramPublishingMode).toBe('external-integration-not-configured');
  });

  it('keeps draft records out of external production', () => {
    expect(INSTAGRAM_CONTENT_RECORDS.every((record) => record.publicationEligible === false && record.externalProductionApproved === false)).toBe(true);
  });
});
