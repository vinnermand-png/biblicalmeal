import { describe, expect, it } from 'vitest';
import { AI_EDITORIAL_IMAGE_ASSET_RECORDS } from './records';
import {
  canProposeEditorialManifestAssignment,
  generateAiEditorialImage,
  validateAiEditorialImageAsset,
} from './engine';

describe('V3C.33 AI Editorial Image & Asset Engine', () => {
  it('keeps prototype assets outside the editorial manifest until validation and review', () => {
    const [record] = AI_EDITORIAL_IMAGE_ASSET_RECORDS;
    expect(record.pipelineStatus).toBe('image-brief-ready');
    expect(record.manifestAssignmentStatus).toBe('not-added');
    expect(record.publicationEligible).toBe(false);
    expect(record.brief.editorialOnly).toBe(true);
    expect(record.brief.documentaryEvidence).toBe(false);
  });

  it('runs the deterministic end-to-end prototype through generation and validation', async () => {
    const [record] = AI_EDITORIAL_IMAGE_ASSET_RECORDS;
    const generated = await generateAiEditorialImage(record);
    expect(generated.provider).toBe('deterministic-canonical-prototype');
    expect(generated.pipelineStatus).toBe('admin-review');
    expect(generated.validation?.passed).toBe(true);
    expect(generated.generation?.format).toBe('webp');
    expect(generated.manifestAssignmentStatus).toBe('not-added');
    expect(generated.publicationEligible).toBe(false);
    expect(canProposeEditorialManifestAssignment(generated)).toBe(true);
  });

  it('rejects documentary claims, invalid dimensions and missing canonical source relationships', () => {
    const [record] = AI_EDITORIAL_IMAGE_ASSET_RECORDS;
    const invalid = {
      ...record,
      sourceWebsiteContentId: 'missing-source',
      brief: { ...record.brief, documentaryEvidence: true as const, altText: '' },
      generation: {
        provider: 'deterministic-canonical-prototype' as const,
        requestId: 'bad',
        publicPath: '/assets/editorial/prototypes/bad.webp',
        output: 'public/assets/editorial/prototypes/bad.webp',
        width: 1,
        height: 1,
        format: 'webp' as const,
      },
    };
    const validation = validateAiEditorialImageAsset(invalid);
    expect(validation.passed).toBe(false);
    expect(validation.dimensionsValid).toBe(false);
    expect(validation.altTextValid).toBe(false);
    expect(validation.disclosureValid).toBe(false);
    expect(validation.canonicalContentValid).toBe(false);
  });

  it('records provider failures without fabricating generated assets', async () => {
    const [record] = AI_EDITORIAL_IMAGE_ASSET_RECORDS;
    const result = await generateAiEditorialImage(record, {
      kind: 'external-ai-image',
      configured: true,
      generate: async () => { throw new Error('provider unavailable'); },
    });
    expect(result.pipelineStatus).toBe('generation-failed');
    expect(result.generation).toBeUndefined();
    expect(result.retryCount).toBe(1);
  });
});
