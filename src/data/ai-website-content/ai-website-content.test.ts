import { describe, expect, it } from 'vitest';
import { auditAiWebsiteContentEngine } from './audit';
import { generateWebsiteContentDraft } from './engine';
import { AI_WEBSITE_CONTENT_RECORDS } from './records';

describe('V3C.32 AI Website Content Engine', () => {
  it('runs the focused prototype batch through canonical source ownership', () => {
    expect(AI_WEBSITE_CONTENT_RECORDS).toHaveLength(2);
    expect(AI_WEBSITE_CONTENT_RECORDS.map((record) => record.sourceArticleContentId)).toEqual([
      'article-figs-research-context',
      'article-honey-evidence-boundaries',
    ]);
    expect(auditAiWebsiteContentEngine()).toEqual([]);
  });

  it('does not fabricate provider configuration or publication authority', () => {
    for (const record of AI_WEBSITE_CONTENT_RECORDS) {
      expect(record.provider).toBe('deterministic-canonical-prototype');
      expect(record.providerConfigured).toBe(false);
      expect(record.adminReviewRequired).toBe(true);
      expect(record.requiresExistingPublicationGates).toBe(true);
      expect(record.publicationEligible).toBe(false);
    }
  });

  it('preserves evidence, citation, uncertainty, SEO and image boundaries', () => {
    for (const record of AI_WEBSITE_CONTENT_RECORDS) {
      expect(record.researchDossierIds.length).toBeGreaterThan(0);
      expect(record.citationIds.length).toBeGreaterThan(0);
      expect(record.qa.noUnsupportedClaims).toBe(true);
      expect(record.qa.citationsTraceable).toBe(true);
      expect(record.qa.uncertaintyPreserved).toBe(true);
      expect(record.seo.title).toBe(record.title);
      expect(record.imageBrief.editorialOnly).toBe(true);
      expect(record.imageBrief.generatedImageRequired).toBe(false);
    }
  });

  it('keeps raw external AI output unapproved until QA runs again', async () => {
    const result = await generateWebsiteContentDraft(
      'article-figs-research-context',
      {
        kind: 'external-ai',
        configured: true,
        generate: async () => 'Unreviewed provider output',
      },
    );

    expect(result?.provider).toBe('external-ai');
    expect(result?.pipelineStatus).toBe('draft-generated');
    expect(result?.qa.noUnsupportedClaims).toBe(false);
    expect(result?.qa.citationsTraceable).toBe(false);
    expect(result?.qa.uncertaintyPreserved).toBe(false);
    expect(result?.publicationEligible).toBe(false);
  });

  it('rejects duplicate source ownership and publication-gate bypasses', () => {
    const [record] = AI_WEBSITE_CONTENT_RECORDS;
    const issues = auditAiWebsiteContentEngine([
      record,
      {
        ...record,
        id: 'duplicate-ai-website-record',
        publicationEligible: true,
        requiresExistingPublicationGates: false,
      },
    ]);

    expect(issues).toContain(`Duplicate AI website draft ownership: ${record.sourceArticleContentId}.`);
    expect(issues).toContain(`AI website draft bypasses existing publication gates: duplicate-ai-website-record.`);
    expect(issues).toContain(`AI website draft cannot grant itself publication eligibility: duplicate-ai-website-record.`);
  });
});
