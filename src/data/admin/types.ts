export type AdminResourceKind =
  | 'food'
  | 'research-dossier'
  | 'article-content'
  | 'recipe-research'
  | 'recipe-content'
  | 'cookbook'
  | 'seo-target'
  | 'instagram-content'
  | 'ai-website-content';

export type AdminAccessMode = 'read-only';

export interface AdminSummaryMetric {
  id: string;
  label: string;
  value: number;
  note: string;
}

export interface AdminWorkflowItem {
  kind: AdminResourceKind;
  id: string;
  label: string;
  route?: string;
  stage: string;
  publicationState: string;
  publicationEligible?: boolean;
  relationships: readonly string[];
  blockers: readonly string[];
}

export interface AdminOverview {
  accessMode: AdminAccessMode;
  metrics: readonly AdminSummaryMetric[];
  workflowItems: readonly AdminWorkflowItem[];
  warnings: readonly string[];
}

export interface AdminMutationAttempt {
  kind: AdminResourceKind;
  id: string;
  operation: 'update-status' | 'publish' | 'delete' | 'create';
}

export interface AdminMutationDecision {
  allowed: false;
  reason: string;
}
