export type InstagramContentMode = 'factual' | 'inspirational' | 'creative-social';

export type InstagramContentStatus =
  | 'candidate'
  | 'brief-ready'
  | 'draft'
  | 'editorial-review'
  | 'approved-for-external-production'
  | 'rejected';

export type AIProviderMode = 'not-configured';
export type InstagramPublishingMode = 'external-integration-not-configured';

export interface CanonicalInstagramSource {
  kind: 'article-content' | 'recipe-content' | 'food-universe';
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
  visualDirection: string;
  hashtags: readonly string[];
  platformNotes: readonly string[];
}

export interface InstagramContentRecord {
  id: string;
  title: string;
  mode: InstagramContentMode;
  status: InstagramContentStatus;
  canonicalSources: readonly CanonicalInstagramSource[];
  brief: InstagramContentBrief;
  draft: InstagramContentDraft;
  evidenceReferences: readonly string[];
  citationReferences: readonly string[];
  authorityReferences: readonly string[];
  publicationEligible: boolean;
  externalProductionApproved: boolean;
}

export interface InstagramProviderBoundary {
  aiProviderMode: AIProviderMode;
  instagramPublishingMode: InstagramPublishingMode;
  notes: readonly string[];
}
