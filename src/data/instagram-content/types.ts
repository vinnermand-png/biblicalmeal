export type InstagramContentMode =
  'factual' | 'inspirational' | 'creative-social';

export type InstagramContentStatus =
  | 'candidate'
  | 'brief-ready'
  | 'draft'
  | 'generation-failed'
  | 'validation-failed'
  | 'editorial-review'
  | 'approved-for-external-production'
  | 'rejected';

export type AIProviderMode =
  'not-configured' | 'external-ai' | 'deterministic-canonical-prototype';
export type InstagramPublishingMode = 'external-integration-not-configured';

export interface CanonicalInstagramSource {
  kind:
    | 'article-content'
    | 'recipe-content'
    | 'food-universe'
    | 'ai-website-content';
  id: string;
}

export interface InstagramContentBrief {
  objective: string;
  audienceIntent: string;
  factualBoundaries: readonly string[];
  uncertaintyBoundaries: readonly string[];
  disclosureRequirements: readonly string[];
}

export interface InstagramContentDraft {
  hook: string;
  caption: string;
  carousel: readonly string[];
  reelScript: readonly string[];
  visualDirection: string;
  visualBrief: string;
  hashtags: readonly string[];
  platformNotes: readonly string[];
}

export interface InstagramGenerationInput {
  record: InstagramContentRecord;
  sourceTitle: string;
  sourceSummary: string;
  keyPoints: readonly string[];
  uncertaintyDisclosure: string;
  imageBriefDisclosure: string;
}

export interface InstagramContentProvider {
  kind: 'external-ai';
  configured: boolean;
  generate(input: InstagramGenerationInput): Promise<InstagramContentDraft>;
}

export interface InstagramContentValidation {
  canonicalSourceValid: boolean;
  evidenceReferencesValid: boolean;
  citationsTraceable: boolean;
  authorityReferencesTraceable: boolean;
  uncertaintyPreserved: boolean;
  disclosurePreserved: boolean;
  imageRelationshipValid: boolean;
  noUnsupportedClaims: boolean;
  passed: boolean;
  issues: readonly string[];
}

export interface InstagramContentRecord {
  id: string;
  title: string;
  mode: InstagramContentMode;
  status: InstagramContentStatus;
  canonicalSources: readonly CanonicalInstagramSource[];
  sourceWebsiteContentId?: string;
  sourceImageAssetIds: readonly string[];
  brief: InstagramContentBrief;
  draft: InstagramContentDraft;
  evidenceReferences: readonly string[];
  citationReferences: readonly string[];
  authorityReferences: readonly string[];
  provider: AIProviderMode;
  providerConfigured: boolean;
  validation?: InstagramContentValidation;
  retryCount: number;
  lastFailure?: string;
  publicationEligible: boolean;
  externalProductionApproved: boolean;
  adminReviewRequired: true;
  requiresExistingPublicationGates: true;
}

export interface InstagramProviderBoundary {
  aiProviderMode: AIProviderMode;
  instagramPublishingMode: InstagramPublishingMode;
  notes: readonly string[];
}
