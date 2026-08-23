/** V3C.4 PHASE 3 qualitative source assessment. No numeric authority scores. */
import { getSource, SOURCE_REGISTRY } from './sources';

export type SourceAssessmentQuality =
  'unassessed' | 'limited' | 'contextual' | 'suitable-for-support' | 'strong';

export interface SourceAssessment {
  sourceId: string;
  quality: SourceAssessmentQuality;
  reasoning: string;
  limitations: string;
  assessedAt: string;
}

const SESSION = '2026-08-23';

export const SOURCE_ASSESSMENTS: SourceAssessment[] = [
  {
    sourceId: 'macdonald-2008',
    quality: 'unassessed',
    reasoning:
      'The book is an identified scholarly anchor, but it was not consulted in this research session.',
    limitations:
      'No claim should be promoted from this source until the relevant sections are actually reviewed.',
    assessedAt: SESSION,
  },
  {
    sourceId: 'bas-2015-ancient-beans',
    quality: 'limited',
    reasoning:
      'The retrieved BAS article is secondary reporting of a Weizmann Institute / Israel Antiquities Authority study.',
    limitations:
      'The underlying study and full source assessment remain outstanding; dependent lentil claims stay in-review.',
    assessedAt: SESSION,
  },
  {
    sourceId: 'nature-2022-tel-tsaf-fruit-trees',
    quality: 'strong',
    reasoning:
      'This is a fully reviewed, open-access peer-reviewed Scientific Reports research article with named authors, methods, results, and archaeological material analysis.',
    limitations:
      'Its conclusions are site- and period-specific; fig cultivation is explicitly qualified as possible, and neither fig nor olive evidence supports universal dietary claims.',
    assessedAt: SESSION,
  },
  {
    sourceId: 'science-2020-judean-date-palm',
    quality: 'strong',
    reasoning:
      'This is a fully reviewed, open-access Science Advances research article with archaeological seed provenance, radiocarbon methods, morphometrics, and genetic analysis.',
    limitations:
      'The sample is limited and the study does not convert KJV palm references into direct edible-date claims.',
    assessedAt: SESSION,
  },
  {
    sourceId: 'bible-odyssey-bread-ancient-israel',
    quality: 'contextual',
    reasoning:
      'The full institutional Bible Odyssey article was reviewed; its author is identified and the article provides an academic synthesis of bread and archaeological processing context.',
    limitations:
      'It is secondary synthesis rather than a primary excavation report and does not establish a standardized barley recipe or universal household practice.',
    assessedAt: SESSION,
  },
  {
    sourceId: 'bible-odyssey-milk-honey',
    quality: 'contextual',
    reasoning:
      'The full Society of Biblical Literature Bible Odyssey article was reviewed; it identifies its academic author and distinguishes textual, symbolic, and Tel Rehov archaeological evidence.',
    limitations:
      'It does not resolve every devash interpretation and should not be used to generalize Tel Rehov beekeeping to every biblical honey reference.',
    assessedAt: SESSION,
  },
];

export function getSourceAssessment(
  sourceId: string,
): SourceAssessment | undefined {
  return SOURCE_ASSESSMENTS.find(
    (assessment) => assessment.sourceId === sourceId,
  );
}

/** Eligibility check for an already-explicitly-promoted external claim. */
export function meetsExternalPromotionCriteria(claim: {
  category: string;
  supports: { sourceId: string; level: string }[];
}): boolean {
  if (claim.category === 'scripture') return false;
  const supports = claim.supports.filter(
    (support) => support.sourceId !== 'scripture-canon',
  );
  return (
    supports.length > 0 &&
    supports.every((support) => {
      const source = getSource(support.sourceId);
      const assessment = getSourceAssessment(support.sourceId);
      return (
        support.level === 'direct' &&
        source?.reviewedAt !== undefined &&
        assessment !== undefined &&
        assessment.quality !== 'unassessed'
      );
    })
  );
}

export function validateSourceAssessments(): string[] {
  const issues: string[] = [];
  const externalSources = SOURCE_REGISTRY_EXTERNAL_IDS();
  const assessedIds = new Set<string>();
  for (const assessment of SOURCE_ASSESSMENTS) {
    if (assessedIds.has(assessment.sourceId))
      issues.push('duplicate-source-assessment');
    assessedIds.add(assessment.sourceId);
    if (!getSource(assessment.sourceId))
      issues.push('assessment-unknown-source');
    if (!assessment.reasoning.trim())
      issues.push('assessment-missing-reasoning');
    if (!assessment.limitations.trim())
      issues.push('assessment-missing-limitations');
  }
  for (const sourceId of externalSources) {
    if (!assessedIds.has(sourceId))
      issues.push('external-source-without-assessment');
  }
  return issues;
}

function SOURCE_REGISTRY_EXTERNAL_IDS(): string[] {
  return SOURCE_REGISTRY.filter((source) => source.kind !== 'scripture').map(
    (source) => source.id,
  );
}
