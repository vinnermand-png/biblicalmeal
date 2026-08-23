import { ARTICLE_CONTENT_RECORDS } from '../article-content/records';
import { FOOD_UNIVERSE } from '../food-universe';
import { RESEARCH_CLAIMS } from '../research/claims';
import { RESEARCH_DOSSIERS } from '../research/dossiers';
import { SOURCE_REGISTRY } from '../research/sources';
import { SEO_TARGETS } from '../seo-master-map';
import { AUTHORITY_RECORDS, CITATION_RECORDS } from './records';
import type { AuthorityRecord, CitationRecord } from './types';

export type AuthorityAuditCode = 'duplicate-authority-id' | 'duplicate-citation-id' | 'invalid-authority-classification' | 'invalid-source-reference' | 'invalid-authority-reference' | 'invalid-target-reference' | 'claim-strength-violation' | 'direct-support-mismatch' | 'impossible-verification-state' | 'missing-uncertainty-disclosure';
export interface AuthorityAuditIssue { code: AuthorityAuditCode; recordId: string; message: string; }
export interface AuthorityAudit { authorityCount: number; citationCount: number; issues: AuthorityAuditIssue[]; }

const CLASSIFICATIONS = new Set(['primary-scripture','primary-historical-source','academic-source','scholarly-reference-work','institutional-source','archaeological-or-material-evidence','historical-secondary-source','editorial-reference','unresolved']);
const RELATIONSHIPS = new Set(['directly-supports','contextually-supports','partially-supports','background-only','unresolved']);
const EVIDENCE = new Set(['direct','partial','contextual','unresolved']);
const VERIFICATION = new Set(['unverified','partially-verified','verified','unresolved']);
const STRENGTH_RANK: Record<CitationRecord['claimStrength'], number> = { background: 0, contextual: 1, partial: 2, direct: 3 };
const MAX_STRENGTH: Record<CitationRecord['evidenceState'], CitationRecord['claimStrength']> = { unresolved: 'background', contextual: 'contextual', partial: 'partial', direct: 'direct' };

function validTarget(kind: CitationRecord['targetKind'], id: string): boolean {
  switch (kind) {
    case 'research-dossier': return RESEARCH_DOSSIERS.some((x) => x.id === id);
    case 'research-claim': return RESEARCH_CLAIMS.some((x) => x.id === id);
    case 'article-content': return ARTICLE_CONTENT_RECORDS.some((x) => x.id === id);
    case 'food-entity': return FOOD_UNIVERSE.some((x) => x.id === id);
    case 'seo-target': return SEO_TARGETS.some((x) => x.id === id);
    default: return false;
  }
}

export function auditAuthority(authorities: readonly AuthorityRecord[] = AUTHORITY_RECORDS, citations: readonly CitationRecord[] = CITATION_RECORDS): AuthorityAudit {
  const issues: AuthorityAuditIssue[] = [];
  const sourceIds = new Set(SOURCE_REGISTRY.map((x) => x.id));
  const authorityIds = new Set<string>();
  for (const authority of authorities) {
    if (authorityIds.has(authority.id)) issues.push({ code: 'duplicate-authority-id', recordId: authority.id, message: `Duplicate authority id: ${authority.id}` });
    authorityIds.add(authority.id);
    if (!CLASSIFICATIONS.has(authority.classification)) issues.push({ code: 'invalid-authority-classification', recordId: authority.id, message: `Unknown authority classification: ${authority.classification}` });
    if (!sourceIds.has(authority.sourceId)) issues.push({ code: 'invalid-source-reference', recordId: authority.id, message: `Unknown canonical source: ${authority.sourceId}` });
  }
  const citationIds = new Set<string>();
  for (const citation of citations) {
    if (citationIds.has(citation.id)) issues.push({ code: 'duplicate-citation-id', recordId: citation.id, message: `Duplicate citation id: ${citation.id}` });
    citationIds.add(citation.id);
    if (!authorityIds.has(citation.authorityId)) issues.push({ code: 'invalid-authority-reference', recordId: citation.id, message: `Unknown authority: ${citation.authorityId}` });
    if (!RELATIONSHIPS.has(citation.relationship) || !EVIDENCE.has(citation.evidenceState) || !VERIFICATION.has(citation.verificationState)) issues.push({ code: 'impossible-verification-state', recordId: citation.id, message: 'Citation has an invalid relationship, evidence, or verification state.' });
    if (!validTarget(citation.targetKind, citation.targetId)) issues.push({ code: 'invalid-target-reference', recordId: citation.id, message: `Unknown canonical target: ${citation.targetId}` });
    if (STRENGTH_RANK[citation.claimStrength] > STRENGTH_RANK[MAX_STRENGTH[citation.evidenceState]]) issues.push({ code: 'claim-strength-violation', recordId: citation.id, message: 'Claim strength exceeds recorded evidence.' });
    if (citation.relationship === 'directly-supports' && (citation.evidenceState !== 'direct' || citation.claimStrength !== 'direct')) issues.push({ code: 'direct-support-mismatch', recordId: citation.id, message: 'Direct support requires direct evidence and direct claim strength.' });
    if (citation.relationship === 'unresolved' && citation.verificationState === 'verified') issues.push({ code: 'impossible-verification-state', recordId: citation.id, message: 'Unresolved citation cannot be verified.' });
    if ((citation.evidenceState === 'unresolved' || citation.verificationState === 'unresolved') && !citation.uncertaintyDisclosure?.trim()) issues.push({ code: 'missing-uncertainty-disclosure', recordId: citation.id, message: 'Unresolved evidence requires visible uncertainty.' });
  }
  return { authorityCount: authorities.length, citationCount: citations.length, issues };
}
export const AUTHORITY_AUDIT = auditAuthority();
