/**
 * V3C.2 RESEARCH DOSSIERS
 * =======================
 * Structural grouping of research around first-wave subjects ONLY.
 *
 * HONESTY RULE: a dossier existing does NOT mean its research is complete.
 * Research status and notes reflect recorded Phase 1-4 work. Completion is
 * explicit and backed by a completion record; claim ids are derived from the
 * claim registry and question ids from the question registry.
 *
 * relatedTargetIds always point at EXISTING pursuing V3B targets - canonical
 * ownership is never changed here.
 */

import { FIRST_WAVE_TARGET_IDS } from '../production-queue';
import { SEO_TARGETS } from '../seo-master-map';
import { FOOD_UNIVERSE } from '../food-universe';
import { RESEARCH_CLAIMS } from './claims';
import { UNRESOLVED_QUESTIONS } from './questions';
import type { DossierResearchStatus, ResearchDossier } from './types';
import { FIGS_DOSSIER_NOTES } from './pilot/figs';
import { OLIVES_DOSSIER_NOTES } from './pilot/olives';
import { LENTILS_DOSSIER_NOTES } from './pilot/lentils';
import { BARLEY_DOSSIER_NOTES } from './pilot/barley';
import { DATES_DOSSIER_NOTES } from './pilot/dates';
import { HONEY_DOSSIER_NOTES } from './pilot/honey';
import { CORNERSTONE_DOSSIER_NOTES } from './cornerstones';
import { completionRecordFor } from './completions';

const CORNERSTONE_TARGET_IDS = [
  'foods-of-the-bible',
  'what-did-jesus-eat',
  'food-in-biblical-times',
] as const;

/**
 * Core-food SEO target ids map to food-universe entity ids. The universe
 * uses an `-entity` suffix for most of them (barley excepted) - recorded
 * explicitly instead of guessed.
 */
const CORE_FOODS: { targetId: string; entityId: string }[] = [
  { targetId: 'figs', entityId: 'figs-entity' },
  { targetId: 'olives', entityId: 'olives-entity' },
  { targetId: 'lentils', entityId: 'lentils-entity' },
  { targetId: 'dates', entityId: 'dates-entity' },
  { targetId: 'honey', entityId: 'honey-entity' },
  { targetId: 'barley', entityId: 'barley' },
];

/**
 * Recorded research sessions are keyed by target id. Completion records are
 * applied separately so a dossier cannot become complete by accident.
 */
const PILOT_SESSION_NOTES: Record<string, { notes: string[]; date: string }> = {
  figs: { notes: FIGS_DOSSIER_NOTES, date: '2026-08-23' },
  olives: { notes: OLIVES_DOSSIER_NOTES, date: '2026-08-23' },
  lentils: { notes: LENTILS_DOSSIER_NOTES, date: '2026-08-23' },
  barley: { notes: BARLEY_DOSSIER_NOTES, date: '2026-08-23' },
  dates: { notes: DATES_DOSSIER_NOTES, date: '2026-08-23' },
  honey: { notes: HONEY_DOSSIER_NOTES, date: '2026-08-23' },
};

const PHASE2_NOTES: Record<string, string> = {
  figs: 'Phase 2: Tel Tsaf archaeological evidence for common-fig cultivation is recorded as plausible and in-review.',
  olives:
    'Phase 2: Tel Tsaf archaeological evidence for nearby olive orchards is recorded as plausible and in-review; tree, fruit, and oil remain distinct.',
  lentils:
    'Phase 2: existing archaeological context remains in-review; no new claim was promoted beyond the reviewed evidence.',
  barley:
    'Phase 2: Bible Odyssey bread and grain-processing synthesis is recorded as historical and in-review, not as a recipe.',
  dates:
    'Phase 2: Science Advances archaeological date-palm study is recorded as in-review; palm wording is not collapsed into every date claim.',
  honey:
    'Phase 2: Bible Odyssey Tel Rehov beekeeping context is recorded as in-review; the devash warning remains active.',
  'foods-of-the-bible':
    'Phase 2: reviewed academic sources strengthen category methodology without changing not-pursuing ritual classifications.',
  'what-did-jesus-eat':
    'Phase 2: external context remains separate from explicit consumption claims; no historical food was promoted as eaten by Jesus.',
  'food-in-biblical-times':
    'Phase 2: regional, chronological, and evidence-type distinctions remain required; no single biblical diet was asserted.',
};

function completionProgress(
  targetId: string,
):
  | { researchStatus: 'complete'; researchNotes: string[]; updatedAt: string }
  | undefined {
  const record = completionRecordFor(`dossier-${targetId}`);
  if (!record) return undefined;
  return {
    researchStatus: 'complete',
    researchNotes: [
      ...(PILOT_SESSION_NOTES[targetId]?.notes ?? []),
      PHASE2_NOTES[targetId],
      `Completion review ${record.completedAt}: ${record.completionReason}`,
    ],
    updatedAt: record.completedAt,
  };
}

function pilotProgress(
  targetId: string,
): Pick<ResearchDossier, 'researchStatus'> &
  Partial<Pick<ResearchDossier, 'researchNotes' | 'updatedAt'>> {
  const session = PILOT_SESSION_NOTES[targetId];
  if (!session) return { researchStatus: 'not-started' as const };
  return {
    researchStatus: 'in-progress' as DossierResearchStatus,
    researchNotes: session.notes,
    updatedAt: session.date,
  };
}

/** Validated at module scope by tests; kept as plain data here. */
export const RESEARCH_DOSSIERS: ResearchDossier[] = [
  ...CORNERSTONE_TARGET_IDS.map((targetId) => ({
    id: `dossier-${targetId}`,
    subjectType: 'seo-target' as const,
    subjectId: targetId,
    relatedTargetIds: [targetId],
    claimIds: RESEARCH_CLAIMS.filter((c) => c.subjectId === targetId).map(
      (c) => c.id,
    ),
    questionIds: UNRESOLVED_QUESTIONS.filter(
      (q) => q.subjectId === targetId,
    ).map((q) => q.id),
    unresolvedNotes: [],
    ...(CORNERSTONE_DOSSIER_NOTES[targetId]
      ? {
          researchStatus: 'in-progress' as const,
          researchNotes: [
            ...CORNERSTONE_DOSSIER_NOTES[targetId],
            PHASE2_NOTES[targetId],
          ],
          updatedAt: '2026-08-23',
        }
      : { researchStatus: 'not-started' as const }),
  })),
  ...CORE_FOODS.map(({ targetId, entityId }) => ({
    id: `dossier-${targetId}`,
    subjectType: 'food-entity' as const,
    subjectId: entityId,
    relatedTargetIds: [targetId],
    claimIds: RESEARCH_CLAIMS.filter((c) => c.subjectId === targetId).map(
      (c) => c.id,
    ),
    questionIds: UNRESOLVED_QUESTIONS.filter(
      (q) => q.subjectId === entityId || q.subjectId === targetId,
    ).map((q) => q.id),
    unresolvedNotes: [],
    ...pilotProgress(targetId),
    ...(completionProgress(targetId) ??
      (PHASE2_NOTES[targetId]
        ? {
            researchStatus: 'in-progress' as const,
            researchNotes: [
              ...(PILOT_SESSION_NOTES[targetId]?.notes ??
                CORNERSTONE_DOSSIER_NOTES[targetId] ??
                []),
              PHASE2_NOTES[targetId],
            ],
            updatedAt: '2026-08-23',
          }
        : {})),
  })),
];

export function getDossier(id: string): ResearchDossier | undefined {
  return RESEARCH_DOSSIERS.find((d) => d.id === id);
}

/** Existence checks used by the publication gate and tests. */
export function dossierSubjectExists(dossier: ResearchDossier): boolean {
  if (dossier.subjectType === 'seo-target') {
    const target = SEO_TARGETS.find((t) => t.id === dossier.subjectId);
    return !!target && target.status !== 'not-pursuing';
  }
  return FOOD_UNIVERSE.some((f) => f.id === dossier.subjectId);
}

export function allDossierTargetIdsExist(): boolean {
  return RESEARCH_DOSSIERS.every((d) =>
    d.relatedTargetIds.every(
      (id) =>
        FIRST_WAVE_TARGET_IDS.includes(id) &&
        SEO_TARGETS.some((t) => t.id === id && t.status !== 'not-pursuing'),
    ),
  );
}
