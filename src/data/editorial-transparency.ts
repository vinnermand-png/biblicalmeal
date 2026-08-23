import { AUTHORITY_RECORDS, CITATION_RECORDS } from './authority/records';
import { AUTHORITY_AUDIT } from './authority/audit';
import { METHODOLOGY_RULES, TRUST_NON_NEGOTIABLES } from './editorial-trust';
import { SOURCE_REGISTRY } from './research/sources';

export type TransparencyEvidenceLabel = 'direct' | 'partial' | 'contextual' | 'unresolved';

export const TRANSPARENCY_EVIDENCE_LABELS: Record<TransparencyEvidenceLabel, string> = {
  direct: 'Directly supported by the recorded evidence.',
  partial: 'Partially supported; important limits remain.',
  contextual: 'Provides context but does not establish the full claim on its own.',
  unresolved: 'Not resolved; the uncertainty must remain visible.',
};

export const EDITORIAL_TRANSPARENCY = {
  title: 'How BiblicalMeal Handles Evidence',
  summary: 'BiblicalMeal separates scripture, historical evidence, interpretation, reconstruction, and modern adaptation instead of presenting them as the same thing.',
  methodologyRules: METHODOLOGY_RULES,
  nonNegotiables: TRUST_NON_NEGOTIABLES,
  evidenceLabels: TRANSPARENCY_EVIDENCE_LABELS,
} as const;

export function getTransparencySnapshot() {
  const evidenceStates = new Set(CITATION_RECORDS.map((citation) => citation.evidenceState));
  return {
    sourceCount: SOURCE_REGISTRY.length,
    authorityCount: AUTHORITY_RECORDS.length,
    citationCount: CITATION_RECORDS.length,
    auditIssueCount: AUTHORITY_AUDIT.issues.length,
    evidenceStates: [...evidenceStates],
  };
}

export function getPublicSourceRegistry() {
  return SOURCE_REGISTRY.map((source) => ({
    id: source.id,
    title: source.title,
    author: source.author,
    organization: source.organization,
    publisher: source.publisher,
    year: source.year,
    kind: source.kind,
    primarySource: source.primarySource,
    identifier: source.identifier,
    reliability: source.reliability,
    reviewedAt: source.reviewedAt,
    notes: source.notes,
  }));
}
