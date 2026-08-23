/** V3C.5 typed canonical content and evidence-binding model. */
import type { ScriptureRef } from '../../lib/scripture';
import type { WorkflowStatus } from '../../lib/workflow';

export type CanonicalContentType =
  'ingredient' | 'cornerstone' | 'recipe' | 'contextual';

export type ContentPublicationStatus = 'draft' | 'in-review' | 'published';

export type ContentSectionKind =
  | 'introduction'
  | 'biblical-references'
  | 'biblical-context'
  | 'historical-context'
  | 'archaeological-evidence'
  | 'food-use'
  | 'uncertainty'
  | 'related-passages'
  | 'related-foods'
  | 'methodology'
  | 'recipe-notes';

export type ContentSectionMode =
  'evidence-backed' | 'editorial-only' | 'disclosure-focused';

export interface ContentEvidenceBinding {
  claimIds: string[];
  sourceIds: string[];
  scriptureRefs: ScriptureRef[];
  questionIds: string[];
}

export interface ContentSection {
  id: string;
  kind: ContentSectionKind;
  heading: string;
  mode: ContentSectionMode;
  evidence: ContentEvidenceBinding;
  /** Editorial copy remains separate from the evidence binding. */
  content?: string;
  /** Direct quotations are validated structurally; draft prose is added later. */
  quotation?: {
    text: string;
    reference: ScriptureRef;
  };
}

export interface ContentSeoHooks {
  seoTargetId: string;
  canonicalPath: string;
  indexable: boolean;
  schemaEligible: boolean;
}

export interface CanonicalContentItem {
  id: string;
  subjectId: string;
  canonicalTargetId: string;
  contentType: CanonicalContentType;
  canonicalPath: string;
  title: string;
  searchIntent: 'informational' | 'navigational';
  primaryTopic: string;
  workflowStatus: WorkflowStatus;
  publicationStatus: ContentPublicationStatus;
  dossierId: string;
  seo: ContentSeoHooks;
  ownership: 'primary' | 'contextual';
  relatedContentIds: string[];
}

export interface ContentPlan extends CanonicalContentItem {
  briefId?: string;
  briefStatus?: 'draft' | 'in-review' | 'approved';
  scope: string;
  requiredEvidenceKinds: string[];
  forbiddenClaims: string[];
  requiredDisclosureQuestionIds: string[];
  sections: ContentSection[];
}

export interface ContentDraft {
  id: string;
  contentItemId: string;
  status: ContentPublicationStatus;
  workflowStatus: WorkflowStatus;
  title: string;
  sections: ContentSection[];
  claimIds: string[];
  scriptureRefs: ScriptureRef[];
  disclosureQuestionIds: string[];
  editorialNotes: string[];
  reviewState: 'not-started' | 'in-review' | 'approved';
  publicationState: 'unpublished' | 'published';
}
