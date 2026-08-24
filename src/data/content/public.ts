/**
 * V3C.7 controlled public release layer.
 * Public content is derived from explicitly approved V3C.6 drafts; the internal
 * drafts themselves remain draft-only and are never exposed directly to routes.
 *
 * V3C.43 Wave 1: Added olives, lentils, honey, barley to public release.
 */
import type { ContentDraft, ContentPlan, ContentSection } from './model';
import { FIRST_WAVE_CONTENT_PLANS, PILOT_CONTENT_DRAFTS } from './plans';
import { isContentPublicationEligible } from './validation';

const PUBLIC_RELEASE_TARGET_IDS = [
  'figs',
  'dates',
  'olives',
  'lentils',
  'honey',
  'barley',
] as const;

function planForTarget(targetId: string): ContentPlan {
  const plan = FIRST_WAVE_CONTENT_PLANS.find(
    (item) => item.canonicalTargetId === targetId,
  );
  if (!plan) throw new Error(`Missing canonical content plan for ${targetId}`);
  return plan;
}

function draftForTarget(targetId: string): ContentDraft {
  const draft = PILOT_CONTENT_DRAFTS.find(
    (item) => item.id === `draft-${targetId}`,
  );
  if (!draft) throw new Error(`Missing editorial draft for ${targetId}`);
  return draft;
}

function publicationCandidate(
  plan: ContentPlan,
  draft: ContentDraft,
): ContentDraft {
  const titles: Record<string, string> = {
    figs: 'Figs in the Bible',
    dates: 'Dates in the Bible',
    olives: 'Olives in the Bible',
    lentils: 'Lentils in the Bible',
    honey: 'Honey in the Bible',
    barley: 'Barley in the Bible',
  };

  return {
    ...draft,
    id: `published-${plan.canonicalTargetId}`,
    status: 'published',
    workflowStatus: 'approved',
    title: titles[plan.canonicalTargetId] ?? plan.title,
    reviewState: 'approved',
    publicationState: 'published',
    disclosureQuestionIds: plan.requiredDisclosureQuestionIds,
    editorialNotes: [
      ...draft.editorialNotes,
      'V3C.43 Wave 1 public release approval.',
    ],
  };
}

function publish(
  plan: ContentPlan,
  sourceDraft: ContentDraft,
): {
  content: ContentPlan;
  draft: ContentDraft;
} {
  const draft = publicationCandidate(plan, sourceDraft);
  if (!isContentPublicationEligible(plan, draft)) {
    throw new Error(
      `Public release failed publication eligibility: ${plan.id}`,
    );
  }

  const sections: ContentSection[] = draft.sections.map((section) => ({
    ...section,
    content: section.content,
  }));
  return {
    content: {
      ...plan,
      title: draft.title,
      workflowStatus: 'approved',
      publicationStatus: 'published',
      seo: { ...plan.seo, indexable: true, schemaEligible: true },
      sections,
    },
    draft,
  };
}

const PUBLIC_RELEASES = PUBLIC_RELEASE_TARGET_IDS.map((targetId) =>
  publish(planForTarget(targetId), draftForTarget(targetId)),
);

export const PUBLIC_FOOD_CONTENT: ContentPlan[] = PUBLIC_RELEASES.map(
  (release) => release.content,
);

export const PUBLIC_FOOD_DRAFTS: ContentDraft[] = PUBLIC_RELEASES.map(
  (release) => release.draft,
);

export function publicFoodContentFor(slug: string): ContentPlan | undefined {
  return PUBLIC_FOOD_CONTENT.find((item) => item.canonicalTargetId === slug);
}
