import { ARTICLE_CONTENT_RECORDS } from '../article-content/records';
import { AUTHORITY_RECORDS, CITATION_RECORDS } from '../authority/records';
import { FOOD_UNIVERSE } from '../food-universe';
import { RECIPE_CONTENT_RECORDS } from '../recipe-content/records';
import { RECIPE_RESEARCH_RECORDS } from '../recipe-research/records';
import { RESEARCH_DOSSIERS } from '../research/dossiers';
import { SOURCE_REGISTRY } from '../research/sources';
import { SEO_TARGETS } from '../seo-master-map';
import { SCRIPTURE_POLICY_RULES } from '../scripture-policy';
import { TRANSPARENCY_RECORDS } from './records';
import type { TransparencyRecord } from './types';

export type TrustAuditCode =
  | 'duplicate-id'
  | 'duplicate-title'
  | 'invalid-area'
  | 'invalid-canonical-reference'
  | 'invalid-lifecycle-state'
  | 'impossible-publication-state'
  | 'missing-uncertainty-disclosure'
  | 'hidden-unresolved-evidence'
  | 'reconstruction-attestation-mismatch'
  | 'scripture-context-missing-policy'
  | 'overclaim-beyond-citation-support';

export interface TrustAuditIssue {
  code: TrustAuditCode;
  recordId: string;
  message: string;
}
export interface TrustAudit {
  recordCount: number;
  issues: TrustAuditIssue[];
}

const AREAS = new Set([
  'research-methodology',
  'historical-evidence-standards',
  'uncertainty-and-limitations',
  'sources-and-citations',
  'recipe-reconstruction',
  'scripture-context',
  'editorial-and-publication',
]);
const idSets = {
  researchDossierIds: new Set(RESEARCH_DOSSIERS.map((x) => x.id)),
  sourceIds: new Set(SOURCE_REGISTRY.map((x) => x.id)),
  authorityIds: new Set(AUTHORITY_RECORDS.map((x) => x.id)),
  citationIds: new Set(CITATION_RECORDS.map((x) => x.id)),
  articleContentIds: new Set(ARTICLE_CONTENT_RECORDS.map((x) => x.id)),
  recipeResearchIds: new Set(RECIPE_RESEARCH_RECORDS.map((x) => x.id)),
  recipeContentIds: new Set(RECIPE_CONTENT_RECORDS.map((x) => x.id)),
  foodIds: new Set(FOOD_UNIVERSE.map((x) => x.id)),
  seoTargetIds: new Set(SEO_TARGETS.map((x) => x.id)),
  scripturePolicyRuleIds: new Set(SCRIPTURE_POLICY_RULES.map((x) => x.id)),
};

function invalidReferences(record: TransparencyRecord): string[] {
  return (Object.keys(idSets) as Array<keyof typeof idSets>).flatMap((field) =>
    record[field]
      .filter((id) => !idSets[field].has(id))
      .map((id) => `${field}:${id}`),
  );
}

export function auditTrust(
  records: readonly TransparencyRecord[] = TRANSPARENCY_RECORDS,
): TrustAudit {
  const issues: TrustAuditIssue[] = [];
  const ids = new Set<string>();
  const titles = new Set<string>();
  const unresolvedCitationIds = new Set(
    CITATION_RECORDS.filter(
      (x) =>
        x.relationship === 'unresolved' || x.evidenceState === 'unresolved',
    ).map((x) => x.id),
  );
  const partialCitationIds = new Set(
    CITATION_RECORDS.filter(
      (x) =>
        x.relationship === 'partially-supports' ||
        x.evidenceState === 'partial' ||
        x.relationship === 'contextually-supports' ||
        x.evidenceState === 'contextual',
    ).map((x) => x.id),
  );

  for (const record of records) {
    const normalizedTitle = record.title.trim().toLowerCase();
    if (ids.has(record.id))
      issues.push({
        code: 'duplicate-id',
        recordId: record.id,
        message: `Duplicate trust id: ${record.id}`,
      });
    ids.add(record.id);
    if (titles.has(normalizedTitle))
      issues.push({
        code: 'duplicate-title',
        recordId: record.id,
        message: `Duplicate trust title: ${record.title}`,
      });
    titles.add(normalizedTitle);
    if (!AREAS.has(record.area))
      issues.push({
        code: 'invalid-area',
        recordId: record.id,
        message: `Unknown transparency area: ${record.area}`,
      });
    const invalid = invalidReferences(record);
    if (invalid.length)
      issues.push({
        code: 'invalid-canonical-reference',
        recordId: record.id,
        message: `Unknown canonical references: ${invalid.join(', ')}`,
      });
    if (!record.uncertaintyDisclosure.trim())
      issues.push({
        code: 'missing-uncertainty-disclosure',
        recordId: record.id,
        message:
          'Transparency records require explicit uncertainty disclosure.',
      });
    if (
      record.evidenceState === 'unresolved' &&
      !/unresolved|uncertain|not verified/i.test(record.uncertaintyDisclosure)
    )
      issues.push({
        code: 'hidden-unresolved-evidence',
        recordId: record.id,
        message: 'Unresolved evidence must remain visible in the disclosure.',
      });
    if (
      record.historicalRepresentation ===
        'historically-informed-reconstruction' &&
      !/reconstruction|reconstruct/i.test(
        `${record.summary} ${record.uncertaintyDisclosure}`,
      )
    )
      issues.push({
        code: 'reconstruction-attestation-mismatch',
        recordId: record.id,
        message: 'Reconstruction representation must remain explicit.',
      });
    if (
      record.area === 'scripture-context' &&
      record.scripturePolicyRuleIds.length === 0
    )
      issues.push({
        code: 'scripture-context-missing-policy',
        recordId: record.id,
        message:
          'Scripture context transparency must link canonical scripture policy.',
      });
    if (
      record.citationIds.some((id) => unresolvedCitationIds.has(id)) &&
      record.evidenceState === 'supported'
    )
      issues.push({
        code: 'overclaim-beyond-citation-support',
        recordId: record.id,
        message:
          'Unresolved citation support cannot be represented as fully supported.',
      });
    if (
      record.citationIds.some((id) => partialCitationIds.has(id)) &&
      record.evidenceState === 'supported'
    )
      issues.push({
        code: 'overclaim-beyond-citation-support',
        recordId: record.id,
        message:
          'Partial or contextual citation support cannot be represented as fully supported without additional direct support.',
      });
    if (record.publicReleased && record.publicationStatus !== 'public')
      issues.push({
        code: 'impossible-publication-state',
        recordId: record.id,
        message: 'Public release requires public publication status.',
      });
    if (
      record.publicationEligible &&
      record.publicationStatus === 'not-eligible'
    )
      issues.push({
        code: 'impossible-publication-state',
        recordId: record.id,
        message: 'Publication eligibility conflicts with not-eligible status.',
      });
    if (
      record.editorialReviewStatus === 'approved' &&
      record.productionStatus === 'not-started'
    )
      issues.push({
        code: 'invalid-lifecycle-state',
        recordId: record.id,
        message: 'Unstarted production cannot already be approved.',
      });
  }
  return { recordCount: records.length, issues };
}

export const TRUST_AUDIT = auditTrust();
