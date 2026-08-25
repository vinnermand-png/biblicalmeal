/**
 * V3C.15 Content Expansion Wave 2.
 *
 * Adds the next two research-complete first-wave subjects as internal,
 * evidence-bound editorial drafts. Publication state is intentionally unchanged:
 * these records remain drafts until the existing publication gate is satisfied.
 */
import { canIncludeClaim, canCreateContentDraft } from './validation';
import { FIRST_WAVE_CONTENT_PLANS } from './plans';
import type { ContentDraft, ContentPlan } from './model';

export const V3C15_WAVE2_TARGET_IDS = ['barley', 'honey'] as const;

export const V3C15_INTERNAL_LINKS = {
  barley: ['content-figs', 'content-dates', 'content-honey'],
  honey: ['content-dates', 'content-figs', 'content-barley'],
} as const;

const COPY: Record<string, Record<string, string>> = {
  barley: {
    introduction:
      'Barley is expanded in Wave 2 because its defined research scope is complete and the recorded evidence already places it across agricultural, harvest, provision, and narrative food contexts. The draft remains limited to those verified contexts and does not reconstruct a universal biblical diet.',
    'biblical-references':
      'The verified evidence places barley among the agricultural products named in Deuteronomy 8:8, connects it with harvest timing in Ruth, and records it in several narrative food contexts. These passages establish distinct textual settings rather than a single uniform account of how all biblical communities ate.',
    'historical-context':
      'This draft does not extend the Scripture evidence into a broad historical reconstruction. Agricultural and narrative references can provide context for the recorded passages, but they do not independently prove a complete everyday diet for every period or region represented in the Bible.',
    'food-use':
      'The evidence includes barley bread in Judges 7:13, twenty barley loaves in 2 Kings 4:42, and five barley loaves in John 6:9. These are narrative food details, not standardized recipes, so the draft preserves the difference between attested food references and reconstructed cooking practice.',
    uncertainty:
      'The present scope does not reconstruct a universal barley diet or recipe. In particular, Judges 7:13 is a dream report with symbolic interpretation, while 2 Kings 4:42 and John 6:9 are narrative provision contexts. Each passage must remain bounded by its recorded setting.',
  },
  honey: {
    introduction:
      'Honey is expanded in Wave 2 because the defined Scripture scope is complete while an important linguistic uncertainty remains explicitly preserved. The draft therefore distinguishes direct narrative evidence involving honey, honeycomb, wild honey, and bees from broader wording that does not by itself settle the meaning of every biblical honey term.',
    'biblical-references':
      'The verified evidence includes the promised-land formula in Exodus 3:8, the manna description in Exodus 16:31, Jonathan eating from an honeycomb, provisions that include honey, wild honey in Matthew 3:4, and the honeycomb detail in Luke 24:42–43. These references belong to different literary and narrative contexts and are not collapsed into one claim about a universal biblical diet.',
    'historical-context':
      'The current scope remains intentionally narrower than a complete historical reconstruction of ancient honey production or trade. Biblical wording and narrative context can establish the recorded evidence without resolving every lexical or historical question outside the verified scope.',
    'food-use':
      'Some passages provide especially concrete consumption contexts: Samson encounters a swarm of bees and honey in Judges 14:8–9, Jonathan eats from an honeycomb in 1 Samuel 14:27, and Luke 24:42–43 records honeycomb in a specific narrative meal context. These examples are stronger for their own settings than for generalized claims about every use of honey in the biblical world.',
    uncertainty:
      'The devash identification question remains active. KJV wording alone does not resolve bee honey versus syrup in every biblical context. Palm reference does not resolve this honey question, and explicit bee, honeycomb, and wild-honey contexts must not be silently generalized to every occurrence of biblical honey wording.',
  },
};

function planFor(
  targetId: (typeof V3C15_WAVE2_TARGET_IDS)[number],
): ContentPlan {
  const plan = FIRST_WAVE_CONTENT_PLANS.find(
    (item) => item.canonicalTargetId === targetId,
  );
  if (!plan) throw new Error(`Missing Wave 2 content plan for ${targetId}`);
  if (!canCreateContentDraft(plan)) {
    throw new Error(`Wave 2 target ${targetId} is not eligible for drafting`);
  }
  return plan;
}

function buildWave2Draft(
  targetId: (typeof V3C15_WAVE2_TARGET_IDS)[number],
): ContentDraft {
  const plan = planFor(targetId);
  const copy = COPY[targetId];
  const sections = plan.sections.map((section) => ({
    ...section,
    content: copy[section.kind] ?? section.content,
  }));
  const claimIds = [
    ...new Set(
      sections
        .flatMap((section) => section.evidence.claimIds)
        .filter(canIncludeClaim),
    ),
  ];

  return {
    id: `draft-${targetId}-wave2`,
    contentItemId: plan.id,
    status: 'draft',
    workflowStatus: plan.workflowStatus,
    title: plan.title,
    sections,
    claimIds,
    scriptureRefs: sections.flatMap(
      (section) => section.evidence.scriptureRefs,
    ),
    disclosureQuestionIds: plan.requiredDisclosureQuestionIds,
    editorialNotes: [
      'V3C.15 Content Expansion Wave 2. Internal only and not approved for publication.',
      'Draft prose is bounded by existing verified claims and required uncertainty disclosures.',
      `Planned internal relationships: ${V3C15_INTERNAL_LINKS[targetId].join(', ')}.`,
    ],
    reviewState: 'not-started',
    publicationState: 'unpublished',
  };
}

export const V3C15_WAVE2_DRAFTS: ContentDraft[] =
  V3C15_WAVE2_TARGET_IDS.map(buildWave2Draft);
