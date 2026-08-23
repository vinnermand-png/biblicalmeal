/** The first two explicitly approved public content objects. */
import type { ContentDraft, ContentPlan, ContentSection } from './model';
import { PILOT_CONTENT_ITEMS } from './plans';

const COPY: Record<string, Record<string, string>> = {
  figs: {
    introduction:
      'Figs are directly named in the KJV as fruit, provisions, cultivated produce, and part of the agricultural landscape. This first profile keeps what Scripture says distinct from what archaeology and later interpretation can support.',
    'biblical-references':
      'The KJV places figs in several different kinds of passages: the produce of the land, provisions carried to David, a fig cake given to a starving man, fig cultivation, and symbolic or parabolic scenes. A narrative mention is not automatically a recipe or a universal diet statement.',
    'historical-context':
      'A peer-reviewed study of Chalcolithic Tel Tsaf in the Jordan Valley reports charred young branches identified as common fig and says they may indicate cultivation at that site. That is a specific archaeological context, not proof about every fig reference in Scripture.',
    'archaeological-evidence':
      'The Tel Tsaf evidence is based on anatomical study of charred wood and a radiocarbon-dated young branch. The study distinguishes this kind of evidence from seeds that could have arrived through trade, so the conclusion is kept narrow to possible common-fig horticulture at the site.',
    uncertainty:
      'Amos 7:14 mentions “sycomore fruit.” The KJV wording is verified, but sycomore is tracked separately from common fig here. This page does not silently turn that reference into evidence about common figs.',
    'related-foods':
      'The wider first-wave food research also considers dates, olives, lentils, barley, and honey. Each subject keeps its own evidence and uncertainty rather than becoming one undifferentiated biblical diet.',
  },
  dates: {
    introduction:
      'The KJV passages researched for this profile directly name palm trees or palm branches, while archaeological research provides separate evidence for historic Judean date palms. Those are related subjects, but they are not interchangeable claims.',
    'biblical-references':
      'Palm trees appear in the KJV as a landscape feature, a place associated with Deborah, branches used in a procession, and poetic imagery. These passages do not themselves say that edible dates were eaten.',
    'historical-context':
      'A fully reviewed Science Advances study examined ancient Phoenix dactylifera seeds recovered from Judean Desert archaeological sites. Its findings are consistent with a historic Judean date-palm culture and document cultivation history through archaeological and genetic evidence.',
    'archaeological-evidence':
      'The study analyzed ancient seeds from sites including Masada and Qumran using radiocarbon-related methods, morphometrics, and genetic analysis. Its evidence supports ancient Judean date palms, while the sample size and relationship to individual biblical palm references remain qualified.',
    'food-use':
      'Ancient date-palm evidence makes edible dates historically plausible in the region, but this profile does not label every palm-tree or palm-branch passage as a food reference. Date consumption requires evidence specific to fruit use.',
    uncertainty:
      'Palm reference does not equal edible-date reference. The KJV wording and the archaeological date-palm evidence are shown together without collapsing the distinction. Any future claim about a particular biblical passage and edible dates must be separately supported.',
  },
};

function publicPlan(plan: ContentPlan): ContentPlan {
  const copy = COPY[plan.canonicalTargetId];
  const sections: ContentSection[] = plan.sections.map((section) => ({
    ...section,
    content: copy[section.kind],
  }));
  return {
    ...plan,
    title:
      plan.canonicalTargetId === 'figs'
        ? 'Figs in the Bible'
        : 'Dates in the Bible',
    publicationStatus: 'published',
    workflowStatus: 'approved',
    seo: { ...plan.seo, indexable: true, schemaEligible: true },
    sections,
  };
}

export const PUBLIC_FOOD_CONTENT: ContentPlan[] =
  PILOT_CONTENT_ITEMS.map(publicPlan);

export const PUBLIC_FOOD_DRAFTS: ContentDraft[] = PUBLIC_FOOD_CONTENT.map(
  (item) => ({
    id: `published-${item.canonicalTargetId}`,
    contentItemId: item.id,
    status: 'published',
    workflowStatus: 'approved',
    title: item.title,
    sections: item.sections,
    claimIds: item.sections.flatMap((section) => section.evidence.claimIds),
    scriptureRefs: item.sections.flatMap(
      (section) => section.evidence.scriptureRefs,
    ),
    disclosureQuestionIds: item.requiredDisclosureQuestionIds,
    editorialNotes: [
      'Public first-wave content object produced from the approved V3C.5 plan.',
    ],
    reviewState: 'approved',
    publicationState: 'published',
  }),
);

export function publicFoodContentFor(slug: string): ContentPlan | undefined {
  return PUBLIC_FOOD_CONTENT.find((item) => item.canonicalTargetId === slug);
}
