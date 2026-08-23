export type AuthorityClassification =
  | 'primary-scripture'
  | 'primary-historical-source'
  | 'academic-source'
  | 'scholarly-reference-work'
  | 'institutional-source'
  | 'archaeological-or-material-evidence'
  | 'historical-secondary-source'
  | 'editorial-reference'
  | 'unresolved';

export type CitationRelationship =
  | 'directly-supports'
  | 'contextually-supports'
  | 'partially-supports'
  | 'background-only'
  | 'unresolved';

export type CitationEvidenceState = 'direct' | 'partial' | 'contextual' | 'unresolved';
export type CitationVerificationState = 'unverified' | 'partially-verified' | 'verified' | 'unresolved';
export type AuthorityClaimStrength = 'background' | 'contextual' | 'partial' | 'direct';
export type AuthorityTargetKind = 'research-dossier' | 'research-claim' | 'recipe-research' | 'recipe-content' | 'article-content' | 'food-entity' | 'seo-target';

export interface AuthorityRecord { id: string; sourceId: string; classification: AuthorityClassification; notes: string; }
export interface CitationRecord {
  id: string; authorityId: string; targetKind: AuthorityTargetKind; targetId: string;
  relationship: CitationRelationship; evidenceState: CitationEvidenceState;
  verificationState: CitationVerificationState; claimStrength: AuthorityClaimStrength;
  uncertaintyDisclosure?: string; editorialNotes?: string;
}
