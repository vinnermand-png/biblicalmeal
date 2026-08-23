/**
 * V3C.2 UNRESOLVED QUESTIONS
 * ==========================
 * Open research questions that must not silently disappear when pages are
 * drafted. Each carries an explicit resolution:
 * - 'blocker'       -> blocks publication of content using the subject
 * - 'warning'       -> publishable but the open point must be disclosed
 * - 'research-task' -> backlog only
 *
 * Every entry cites its provenance in existing repo documentation. The
 * uncertain-identification questions are DERIVED from food-universe evidence
 * statuses rather than hand-invented.
 */

import { FOOD_UNIVERSE } from '../food-universe';
import type { UnresolvedQuestion } from './types';

/** Hand-recorded questions, each traceable to V3B documentation. */
const RECORDED_QUESTIONS: UnresolvedQuestion[] = [
  {
    id: 'question-honey-devash-translation',
    subjectId: 'honey',
    question:
      'Does devash in the biblical text mean bee honey, date syrup, or both? Rendering affects every honey-page statement.',
    kind: 'translation-ambiguity',
    resolution: 'warning',
    provenance:
      'source-citations.ts SOURCE_REF_SPECS translation-note example; CITATION_RULES require the site translation decision before publication.',
  },
  {
    id: 'question-meat-theological-review',
    subjectId: 'meat-in-the-bible',
    question:
      'The meat SERP is dominated by contradictory clean/unclean doctrine (including opposing dietary claims). A theological review must gate any brief approval.',
    kind: 'theological-review',
    resolution: 'blocker',
    provenance:
      'V3B completion audit SERP validation (2026-08-23) and seo-master-map.ts RESEARCH_LOG.',
  },
  {
    id: 'question-olives-deut-wording',
    subjectId: 'olives',
    question:
      'Deuteronomy 8:8 (KJV) lists "oil olive" - does the list item denote the olive tree, its fruit, or its oil? Page framing must keep tree/fruit/oil distinct until resolved.',
    kind: 'translation-ambiguity',
    resolution: 'warning',
    provenance:
      'V3C.4 Phase 1A KJV verification session (2026-08-23): Deuteronomy 8:8 wording retrieved and recorded; KJV compound rendering raises a framing scope question analogous to the honey devash case.',
  },
  {
    id: 'question-figs-sycomore-identification',
    subjectId: 'figs',
    question:
      'Amos 7:14 has Amos describing himself as a gatherer of sycomore fruit. Sycomore is traditionally identified as Ficus sycomorus, distinct from the common fig (Ficus carica) - confirm before any page statement treats it as fig content.',
    kind: 'disputed-identification',
    resolution: 'research-task',
    provenance:
      'V3C.4 Phase 1A KJV verification session (2026-08-23): Amos 7:14 wording retrieved and recorded during fig research.',
  },
  {
    id: 'question-dates-palm-fruit-identification',
    subjectId: 'dates',
    question:
      'Do the KJV palm-tree and palm-branch references identify edible dates? Palm references, branches, and fruit consumption must remain distinct until independent evidence supports identification.',
    kind: 'disputed-identification',
    resolution: 'warning',
    provenance:
      'V3C.4 Phase 1B KJV research session (2026-08-23): six palm references retrieved; none explicitly names edible dates.',
  },
];

/**
 * Derived from the food universe: entities whose very identification is
 * uncertain become explicit research tasks - they can never be silently
 * flattened into confident content.
 */
function deriveIdentificationQuestions(): UnresolvedQuestion[] {
  return FOOD_UNIVERSE.filter(
    (entity) => entity.evidence === 'uncertain-identification',
  ).map((entity) => ({
    id: `question-${entity.id}-identification`,
    subjectId: entity.id,
    question: `Which plant/species does "${entity.name}" refer to in the biblical text? Identification is uncertain.`,
    kind: 'disputed-identification' as const,
    resolution: 'research-task' as const,
    provenance: `food-universe.ts entity "${entity.id}" evidence=uncertain-identification`,
  }));
}

export const UNRESOLVED_QUESTIONS: UnresolvedQuestion[] = [
  ...RECORDED_QUESTIONS,
  ...deriveIdentificationQuestions(),
];

export function questionsForSubject(subjectId: string): UnresolvedQuestion[] {
  return UNRESOLVED_QUESTIONS.filter((q) => q.subjectId === subjectId);
}
