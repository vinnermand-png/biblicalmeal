import { describe, expect, it } from 'vitest';
import { ARTICLE_CONTENT_AUDIT, auditArticleContent } from './audit';
import { ARTICLE_CONTENT_RECORDS } from './records';
import type { ArticleContentRecord } from './types';

describe('V3C.19 article and question content', () => {
  it('keeps the scoped expansion internally valid and non-public', () => {
    expect(ARTICLE_CONTENT_AUDIT.issues).toEqual([]);
    expect(ARTICLE_CONTENT_RECORDS.length).toBeGreaterThanOrEqual(8);
    expect(
      ARTICLE_CONTENT_RECORDS.every(
        (record) =>
          record.publicationStatus === 'not-eligible' &&
          !record.publicationEligible,
      ),
    ).toBe(true);
  });

  it('expands only from canonical completed research where the new drafts make factual claims', () => {
    for (const id of [
      'article-figs-research-context',
      'article-barley-biblical-evidence',
      'article-dates-palm-evidence-boundaries',
      'article-honey-evidence-boundaries',
    ]) {
      const record = ARTICLE_CONTENT_RECORDS.find((candidate) => candidate.id === id);
      expect(record?.evidenceState).toBe('supported');
      expect(record?.claimStrength).toBe('supported');
      expect(record?.researchDossierIds.length).toBeGreaterThan(0);
      expect(record?.foodIds.length).toBeGreaterThan(0);
    }
  });

  it('preserves explicit evidence boundaries in supported question answers', () => {
    const barley = ARTICLE_CONTENT_RECORDS.find(
      (record) => record.id === 'question-what-does-barley-evidence-support',
    );
    const dates = ARTICLE_CONTENT_RECORDS.find(
      (record) => record.id === 'question-do-palm-references-always-mean-edible-dates',
    );
    const honey = ARTICLE_CONTENT_RECORDS.find(
      (record) => record.id === 'question-does-biblical-honey-always-mean-bee-honey',
    );

    expect(barley?.answerContent).toContain('do not by themselves establish');
    expect(dates?.answerContent).toContain('not automatically edible-date references');
    expect(honey?.answerContent).toContain('does not resolve bee honey versus syrup');
  });

  it('keeps unresolved question answers explicitly limited', () => {
    const question = ARTICLE_CONTENT_RECORDS.find(
      (record) => record.id === 'question-seven-foods-promised-land',
    );
    expect(question?.questionText).toBeTruthy();
    expect(question?.answerContent).toContain('No authoritative answer');
    expect(question?.evidenceState).toBe('unresolved');
    expect(question?.claimStrength).toBe('unresolved');
    expect(question?.uncertaintyDisclosure).toBeTruthy();
  });

  it('creates data-level internal relationships without inventing a parallel link system', () => {
    const recordsById = new Set(ARTICLE_CONTENT_RECORDS.map((record) => record.id));
    expect(
      ARTICLE_CONTENT_RECORDS
        .filter((record) => record.id !== 'article-biblical-food-evidence-labels')
        .some((record) => record.relatedContentIds.length > 0),
    ).toBe(true);

    for (const record of ARTICLE_CONTENT_RECORDS) {
      for (const relatedId of record.relatedContentIds) {
        expect(relatedId).not.toBe(record.id);
        expect(recordsById.has(relatedId)).toBe(true);
      }
    }
  });

  it('detects duplicate identity, invalid references and stronger claims than evidence allows', () => {
    const base = ARTICLE_CONTENT_RECORDS[0] as ArticleContentRecord;
    const invalid: ArticleContentRecord = {
      ...base,
      researchDossierIds: ['dossier-missing'],
      foodIds: ['food-missing'],
      relatedContentIds: ['content-missing'],
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
        'invalid-related-content-reference',
        'invalid-seo-reference',
        'evidence-strength-violation',
      ]),
    );
  });

  it('rejects self-linking, impossible lifecycle and publication states', () => {
    const base = ARTICLE_CONTENT_RECORDS[0] as ArticleContentRecord;
    const invalid: ArticleContentRecord = {
      ...base,
      id: 'article-invalid-lifecycle',
      relatedContentIds: ['article-invalid-lifecycle'],
      editorialReviewStatus: 'approved',
      publicationStatus: 'public',
      publicationEligible: true,
    };
    expect(auditArticleContent([invalid]).issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining([
        'self-related-content-reference',
        'invalid-lifecycle',
        'publication-state-mismatch',
      ]),
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
