export type ExternalAuthorityTargetCategory =
  | 'academic'
  | 'museum-or-cultural-institution'
  | 'library-or-archive'
  | 'faith-or-scripture-resource'
  | 'food-history-publication'
  | 'editorial-or-publisher'
  | 'community-or-education'
  | 'other-qualified';

export type ExternalAuthorityOpportunityStatus =
  | 'discovered'
  | 'qualified'
  | 'contacted'
  | 'replied'
  | 'relationship-established'
  | 'verified-mention-link'
  | 'rejected';

export type ExternalAuthorityQualityAssessment =
  'high' | 'medium' | 'insufficient';
export type ExternalAuthorityVerificationState =
  'unverified' | 'verified' | 'rejected';

export interface ExternalAuthorityContactEvent {
  channel: string;
  occurredOn: string;
  summary: string;
}

export interface ExternalAuthorityVerification {
  observedOn: string;
  evidenceUrl: string;
  evidenceType: 'mention' | 'link' | 'partnership' | 'other';
  notes: string;
}

export interface ExternalAuthorityOpportunity {
  id: string;
  domain: string;
  targetName: string;
  category: ExternalAuthorityTargetCategory;
  status: ExternalAuthorityOpportunityStatus;
  verificationState: ExternalAuthorityVerificationState;
  relevance: string;
  qualityAssessment: ExternalAuthorityQualityAssessment;
  qualityNotes: string;
  relevantSitePaths: string[];
  discoveryNotes: string;
  contactHistory?: ExternalAuthorityContactEvent[];
  verification?: ExternalAuthorityVerification;
  rejectionReason?: string;
}
