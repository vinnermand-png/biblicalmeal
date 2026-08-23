import { FOOD_UNIVERSE } from '../food-universe';
import { RESEARCH_DOSSIERS } from '../research/dossiers';
import { SEO_TARGETS } from '../seo-master-map';
import { ARTICLE_CONTENT_RECORDS } from './records';
import type {
  ArticleClaimStrength,
  ArticleContentRecord,
  ArticleEvidenceState,
} from './types';

export type ArticleContentAuditCode =
  | 'duplicate-id'
  | 'duplicate-title'
  | 'duplicate-question'
  | 'invalid-content-type'
  | 'invalid-research-reference'
  | 'invalid-food-reference'
  | 'invalid-seo-reference'
  | 'invalid-scripture-context'
  | 'missing-uncertainty-disclosure'
  | 'hidden-unresolved-evidence'
  | 'evidence-strength-violation'
  | 'invalid-question'
  | 'invalid-lifecycle'
  | 'publication-state-mismatch';

export interface ArticleContentAuditIssue {
  code: ArticleContentAuditCode;
  contentId: string;
  message: string;
}

export interface ArticleContentAudit {
  contentCount: number;
  issues: ArticleContentAuditIssue[];
}

const CONTENT_TYPES = new Set([
  'article',
  'question',
  'answer',
  'explainer',
  'comparison',
  'historical-context',
  'scripture-context',
  'practical-guide',
]);

const CLAIM_STRENGTH_RANK: Record<ArticleClaimStrength, number> = {
  unresolved: 0,
  editorial: 1,
  inferred: 2,
  'partially-supported': 3,
  supported: 4,
};

const EVIDENCE_MAX_STRENGTH: Record<ArticleEvidenceState, ArticleClaimStrength> = {
  supported: 'supported',
  'partially-supported': 'partially-supported',
  inferred: 'inferred',
  'practical-editorial-explanation': 'editorial',
  unresolved: 'unresolved',
};

function normalized(value: string): string {
  return value.trim().toLowerCase();
}

function hasValidScriptureContext(value: string): boolean {
  return /\S+\s+\d+:\d+(?:-\d+)?/.test(value.trim());
}

export function auditArticleContent(
  records: readonly ArticleContentRecord[] = ARTICLE_CONTENT_RECORDS,
): ArticleContentAudit {
  const dossierIds = new Set(RESEARCH_DOSSIERS.map((dossier) => dossier.id));
  const foodIds = new Set(FOOD_UNIVERSE.map((food) => food.id));
  const seoTargetIds = new Set(SEO_TARGETS.map((target) => target.id));
  const ids = new Set<string>();
  const titles = new Set<string>();
  const questions = new Set<string>();
  const issues: ArticleContentAuditIssue[] = [];

  for (const record of records) {
    if (ids.has(record.id)) {
      issues.push({ code: 'duplicate-id', contentId: record.id, message: `Duplicate article content id: ${record.id}` });
    }
    ids.add(record.id);

    const title = normalized(record.title);
    if (titles.has(title)) {
      issues.push({ code: 'duplicate-title', contentId: record.id, message: `Duplicate article content title: ${record.title}` });
    }
    titles.add(title);

    if (!CONTENT_TYPES.has(record.contentType)) {
      issues.push({ code: 'invalid-content-type', contentId: record.id, message: `Unknown article content type: ${record.contentType}` });
    }

    for (const dossierId of record.researchDossierIds) {
      if (!dossierIds.has(dossierId)) {
        issues.push({ code: 'invalid-research-reference', contentId: record.id, message: `Unknown research dossier id: ${dossierId}` });
      }
    }

    for (const foodId of record.foodIds) {
      if (!foodIds.has(foodId)) {
        issues.push({ code: 'invalid-food-reference', contentId: record.id, message: `Unknown Food Universe id: ${foodId}` });
      }
    }

    if (record.seoTargetId && !seoTargetIds.has(record.seoTargetId)) {
      issues.push({ code: 'invalid-seo-reference', contentId: record.id, message: `Unknown SEO target id: ${record.seoTargetId}` });
    }

    for (const context of record.scriptureContext) {
      if (!hasValidScriptureContext(context)) {
        issues.push({ code: 'invalid-scripture-context', contentId: record.id, message: `Invalid scripture context: ${context}` });
      }
    }

    if (!record.uncertaintyDisclosure.trim()) {
      issues.push({ code: 'missing-uncertainty-disclosure', contentId: record.id, message: 'Article content requires an explicit uncertainty disclosure.' });
    }

    if (
      record.evidenceState === 'unresolved' &&
      (!record.answerContent?.trim() || !record.uncertaintyDisclosure.trim())
    ) {
      issues.push({ code: 'hidden-unresolved-evidence', contentId: record.id, message: 'Unresolved content must remain explicitly visible in the record.' });
    }

    const maxStrength = EVIDENCE_MAX_STRENGTH[record.evidenceState];
    if (
      CLAIM_STRENGTH_RANK[record.claimStrength] >
      CLAIM_STRENGTH_RANK[maxStrength]
    ) {
      issues.push({ code: 'evidence-strength-violation', contentId: record.id, message: 'Content cannot claim stronger evidence than its recorded evidence state allows.' });
    }

    if (record.contentType === 'question') {
      if (!record.questionText?.trim() || !record.answerContent?.trim()) {
        issues.push({ code: 'invalid-question', contentId: record.id, message: 'Question content requires both preserved question text and answer content.' });
      } else {
        const question = normalized(record.questionText);
        if (questions.has(question)) {
          issues.push({ code: 'duplicate-question', contentId: record.id, message: `Duplicate question text: ${record.questionText}` });
        }
        questions.add(question);
      }
    }

    if (
      record.editorialReviewStatus === 'approved' &&
      record.productionStatus !== 'produced'
    ) {
      issues.push({ code: 'invalid-lifecycle', contentId: record.id, message: 'Editorial approval requires produced content.' });
    }

    if (
      record.publicationEligible &&
      (record.productionStatus !== 'produced' ||
        record.editorialReviewStatus !== 'approved')
    ) {
      issues.push({ code: 'invalid-lifecycle', contentId: record.id, message: 'Publication eligibility requires produced content and editorial approval.' });
    }

    if (
      record.publicationStatus === 'public' ||
      (record.publicationStatus === 'eligible' && !record.publicationEligible)
    ) {
      issues.push({ code: 'publication-state-mismatch', contentId: record.id, message: 'Article content cannot become public or eligible independently of canonical publication gates.' });
    }
  }

  return { contentCount: records.length, issues };
}

export const ARTICLE_CONTENT_AUDIT = auditArticleContent();
