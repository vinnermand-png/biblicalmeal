export type AiEditorialImageProviderKind =
  'external-ai-image' | 'deterministic-canonical-prototype';

export type AiEditorialImagePipelineStatus =
  | 'image-brief-ready'
  | 'generation-requested'
  | 'generated-unapproved'
  | 'validation-failed'
  | 'validated'
  | 'admin-review'
  | 'approved-for-manifest-assignment'
  | 'rejected'
  | 'generation-failed';

export interface AiEditorialImageBrief {
  contentDraftId: string;
  canonicalRoute: string;
  subject: string;
  purpose: string;
  editorialOnly: true;
  documentaryEvidence: false;
  disclosure: string;
  altText: string;
  targetSize: string;
  targetFormat: 'webp';
}

export interface AiEditorialImageGenerationInput {
  assetId: string;
  brief: AiEditorialImageBrief;
}

export interface AiEditorialImageGenerationOutput {
  provider: AiEditorialImageProviderKind;
  requestId: string;
  publicPath: string;
  output: string;
  width: number;
  height: number;
  format: 'webp';
}

export interface AiEditorialImageProvider {
  kind: 'external-ai-image';
  configured: boolean;
  generate(
    input: AiEditorialImageGenerationInput,
  ): Promise<AiEditorialImageGenerationOutput>;
}

export interface AiEditorialImageValidation {
  dimensionsValid: boolean;
  formatValid: boolean;
  altTextValid: boolean;
  disclosureValid: boolean;
  canonicalContentValid: boolean;
  passed: boolean;
  issues: readonly string[];
}

export interface AiEditorialImageAssetRecord {
  id: string;
  sourceWebsiteContentId: string;
  canonicalRoute: string;
  provider: AiEditorialImageProviderKind;
  providerConfigured: boolean;
  pipelineStatus: AiEditorialImagePipelineStatus;
  brief: AiEditorialImageBrief;
  generation?: AiEditorialImageGenerationOutput;
  validation?: AiEditorialImageValidation;
  manifestAssignmentStatus: 'not-added' | 'proposal-only';
  adminReviewRequired: true;
  requiresExistingPublicationGates: true;
  publicationEligible: false;
  retryCount: number;
  lastFailure?: string;
}
