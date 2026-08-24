import { describe, expect, it } from 'vitest';
import { auditInstagramContent } from './audit';
import {
  canApproveForFutureExternalProduction,
  duplicateInstagramSourceIds,
  generateInstagramContent,
  validateInstagramContent,
} from './engine';
import { INSTAGRAM_CONTENT_RECORDS, INSTAGRAM_PROVIDER_BOUNDARY } from './records';

describe('V3C.34 AI Daily Instagram Content Engine', () => {
  const prototype = INSTAGRAM_CONTENT_RECORDS.find(
    (record) => record.id === 'instagram-ai-website-figs-research-context',
  );

  it('passes the canonical audit and preserves existing seed records', () => {
    expect(auditInstagramContent()).toEqual([]);
  });

  it('generates the deterministic end-to-end prototype from canonical website content', async () => {
    expect(prototype).toBeDefined();
    const generated = await generateInstagramContent(prototype!);
    expect(generated.status).toBe('editorial-review');
    expect(generated.provider).toBe('deterministic-canonical-prototype');
    expect(generated.validation?.passed).toBe(true);
    expect(generated.externalProductionApproved).toBe(false);
    expect(generated.publicationEligible).toBe(false);
  });

  it('rejects invalid canonical source relationships and fabricated evidence links', () => {
    const invalid = {
      ...prototype!,
      canonicalSources: [{ kind: 'ai-website-content' as const, id: 'missing-source' }],
      sourceWebsiteContentId: 'missing-source',
      citationReferences: ['fabricated-citation'],
    };
    const validation = validateInstagramContent(invalid);
    expect(validation.canonicalSourceValid).toBe(false);
    expect(validation.citationsTraceable).toBe(false);
    expect(validation.passed).toBe(false);
  });

  it('prevents duplicate social ownership for the same canonical website source and mode', () => {
    const duplicate = { ...prototype!, id: 'duplicate-social-record' };
    expect(duplicateInstagramSourceIds([prototype!, duplicate])).toEqual(['duplicate-social-record']);
    expect(auditInstagramContent([prototype!, duplicate]).some((issue) => issue.code === 'duplicate-social-content-ownership')).toBe(true);
  });

  it('requires image assets to remain connected to the same website content and editorial boundary', () => {
    const invalid = { ...prototype!, sourceImageAssetIds: ['missing-image'] };
    expect(auditInstagramContent([invalid]).some((issue) => issue.code === 'invalid-image-relationship')).toBe(true);
  });

  it('keeps review and publication boundaries closed when the canonical website source is not publication eligible', async () => {
    const generated = await generateInstagramContent(prototype!);
    expect(canApproveForFutureExternalProduction(generated)).toBe(false);
    expect(generated.externalProductionApproved).toBe(false);
    expect(generated.publicationEligible).toBe(false);
  });

  it('handles provider failure with retry state and no fabricated publication readiness', async () => {
    const failed = await generateInstagramContent(prototype!, {
      kind: 'external-ai', configured: true,
      generate: async () => { throw new Error('provider unavailable'); },
    });
    expect(failed.status).toBe('generation-failed');
    expect(failed.retryCount).toBe(prototype!.retryCount + 1);
    expect(failed.lastFailure).toContain('provider unavailable');
    expect(failed.publicationEligible).toBe(false);
    expect(failed.externalProductionApproved).toBe(false);
  });

  it('keeps external AI and Instagram publishing integrations unconfigured by default', () => {
    expect(INSTAGRAM_PROVIDER_BOUNDARY.aiProviderMode).toBe('not-configured');
    expect(INSTAGRAM_PROVIDER_BOUNDARY.instagramPublishingMode).toBe('external-integration-not-configured');
  });
});
