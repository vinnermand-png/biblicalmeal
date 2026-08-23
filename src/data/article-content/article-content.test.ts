import { describe, expect, it } from 'vitest';
import { ARTICLE_CONTENT_AUDIT, auditArticleContent } from './audit';
import { ARTICLE_CONTENT_RECORDS } from './records';
import type { ArticleContentRecord } from './types';

describe('V3C.19 article and question content', () => {
  it('keeps the canonical seed set internally valid and non-public', () => {
    expect(ARTICLE_CONTENT_AUDIT.issues).toEqual([]);
    expect(ARTICLE_CONTENT_RECORDS.length).toBeGreaterThanOrEqual(3);
    expect(
      ARTICLE_CONTENT_RECORDS.every(
        (record) =>
          record.publicationStatus === 'not-eligible' &&
          !record.publicationEligible,
      ),
    ).toBe(true);
  });

  it('preserves canonical research, Food Universe and SEO relationships', () => {
    const figs = ARTICLE_CONTENT_RECORDS.find(
      (record) => record.id === 'article-figs-research-context',
    );
    expect(figs?.researchDossierIds).toContain('dossier-figs');
    expect(figs?.foodIds).toContain('figs-entity');
    expect(figs?.seoTargetId).toBe('figs');
  });

  it('keeps unresolved question answers explicitly limited', () => {
    const question = ARTICLE_CONTENT_RECORDS.find(
      (record) => record.contentType === 'question',
    );
    expect(question?.questionText).toBeTruthy();
    expect(question?.answerContent).toContain('No authoritative answer');
    expect(question?.evidenceState).toBe('unresolved');
    expect(question?.claimStrength).toBe('unresolved');
    expect(question?.uncertaintyDisclosure).toBeTruthy();
  });

  it('detects duplicate identity, invalid references and stronger claims than evidence allows', () => {
    const base = ARTICLE_CONTENT_RECORDS[0] as ArticleContentRecord;
    const invalid: ArticleContentRecord = {
      ...base,
      researchDossierIds: ['dossier-missing'],
      foodIds: ['food-missing'],
      seoTargetId: 'seo-missing',
      evidenceState: 'unresolved',
      claimStrength: 'supported',
    };
    const audit = auditArticleContent([base, invalid]);
    expect(audit.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'duplicate-id',
        'duplicate-title',
        'invalid-research-reference',
        'invalid-food-reference',
        'invalid-seo-reference',
        'evidence-strength-violation',
      ]),
    );
  });

  it('rejects impossible lifecycle and publication states', () => {
    const base = ARTICLE_CONTENT_RECORDS[0] as ArticleContentRecord;
    const invalid: ArticleContentRecord = {
      ...base,
      id: 'article-invalid-lifecycle',
      editorialReviewStatus: 'approved',
      publicationStatus: 'public',
      publicationEligible: true,
    };
    const audit = auditArticleContent([invalid]);
    expect(audit.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['invalid-lifecycle', 'publication-state-mismatch']),
    );
  });

  it('requires question records to preserve both the question and answer fields', () => {
    const base = ARTICLE_CONTENT_RECORDS.find(
      (record) => record.contentType === 'question',
    ) as ArticleContentRecord;
    const invalid: ArticleContentRecord = {
      ...base,
      id: 'question-invalid',
      answerContent: '',
    };
    expect(
      auditArticleContent([invalid]).issues.map((issue) => issue.code),
    ).toContain('invalid-question');
  });
});
