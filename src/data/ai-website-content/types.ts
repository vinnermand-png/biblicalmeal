export type WebsiteContentPipelineStatus =
  | 'content-gap'
  | 'topic-selected'
  | 'research-brief-ready'
  | 'draft-generated'
  | 'qa-passed'
  | 'admin-review'
  | 'ready-for-existing-publication-gates'
  | 'rejected';

export type WebsiteContentProviderKind =
  | 'external-ai'
  | 'deterministic-canonical-prototype';

export interface AiWebsiteContentSourceRef {
  kind: 'article-content' | 'research-dossier' | 'citation' | 'seo-target' | 'food';
  id: string;
}

export interface WebsiteContentDraft {
  id: string;
  sourceArticleContentId: string;
  targetId: string;
  canonicalRoute: string;
  title: string;
  slug: string;
  provider: WebsiteContentProviderKind;
  providerConfigured: boolean;
  pipelineStatus: WebsiteContentPipelineStatus;
  researchDossierIds: readonly string[];
  foodIds: readonly string[];
  citationIds: readonly string[];
  sourceRefs: readonly AiWebsiteContentSourceRef[];
  researchBrief: string;
  draftBody: string;
  seo: {
    title: string;
    description: string;
  };
  internalLinkTargetIds: readonly string[];
  imageBrief: {
    editorialOnly: true;
    generatedImageRequired: false;
    disclosure: string;
  };
  qa: {
    noUnsupportedClaims: boolean;
    citationsTraceable: boolean;
    uncertaintyPreserved: boolean;
    canonicalRouteMatchesTarget: boolean;
  };
  adminReviewRequired: true;
  requiresExistingPublicationGates: true;
  publicationEligible: false;
}

export interface WebsiteContentProvider {
  kind: 'external-ai';
  configured: boolean;
  generate(input: WebsiteContentGenerationInput): Promise<string>;
}

export interface WebsiteContentGenerationInput {
  title: string;
  summary: string;
  keyPoints: readonly string[];
  uncertaintyDisclosure: string;
  researchBrief: string;
}
