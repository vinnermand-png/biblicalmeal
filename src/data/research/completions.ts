/** Explicit, reviewed dossier-completion decisions. */
import type { DossierCompletionRecord } from './types';

export const DOSSIER_COMPLETION_RECORDS: DossierCompletionRecord[] = [
  {
    id: 'completion-figs-2026-08-23',
    dossierId: 'dossier-figs',
    completedAt: '2026-08-23',
    scope:
      'Common-fig Scripture and Tel Tsaf cultivation evidence; sycomore is excluded from common-fig conclusions.',
    criteriaSatisfied: [
      'All scoped Scripture claims are verified with aligned KJV records.',
      'The scoped external claim has a reviewed and strong-assessed source.',
      'No scoped claims remain in-review or unverified.',
      'No unresolved blocker applies to the dossier.',
    ],
    remainingWarnings: [],
    unresolvedUncertainty: [
      'Amos 7:14 sycomore identification remains a separate research task and is not used as common-fig evidence.',
    ],
    completionReason:
      'The defined common-fig scope is fully supported while the separately owned sycomore uncertainty remains visible.',
  },
  {
    id: 'completion-barley-2026-08-23',
    dossierId: 'dossier-barley',
    completedAt: '2026-08-23',
    scope:
      'KJV barley evidence in agricultural, harvest, provision, narrative bread, and crop contexts; no universal diet or recipe reconstruction is inferred.',
    criteriaSatisfied: [
      'All scoped Scripture claims are verified with aligned KJV records.',
      'No scoped claims remain in-review or unverified.',
      'No unresolved blocker applies to the dossier.',
    ],
    remainingWarnings: [],
    unresolvedUncertainty: [
      'Narrative and symbolic barley passages remain bounded by their recorded contexts and do not independently establish a universal diet or reconstructed recipe.',
    ],
    completionReason:
      'The defined Scripture-only barley scope is fully verified, with contextual limits retained as non-blocking uncertainty.',
  },
  {
    id: 'completion-dates-2026-08-23',
    dossierId: 'dossier-dates',
    completedAt: '2026-08-23',
    scope:
      'KJV palm references and reviewed archaeological evidence for historic Judean date palms.',
    criteriaSatisfied: [
      'All scoped Scripture claims are verified with aligned KJV records.',
      'The archaeological date-palm claim has a reviewed and strong-assessed source.',
      'No scoped claims remain in-review or unverified.',
      'No unresolved blocker applies to the dossier.',
    ],
    remainingWarnings: [
      'Palm-tree and palm-branch references are not automatically edible-date references.',
    ],
    unresolvedUncertainty: [
      'The relationship between individual KJV palm references and edible dates remains unresolved.',
    ],
    completionReason:
      'The defined historical date-palm scope is supported; the non-blocking palm-versus-date warning is preserved for publication disclosure.',
  },
  {
    id: 'completion-honey-2026-08-23',
    dossierId: 'dossier-honey',
    completedAt: '2026-08-23',
    scope:
      'KJV honey, honeycomb, wild-honey, and explicit bee narrative evidence; the unresolved devash identification remains outside any universal identification claim.',
    criteriaSatisfied: [
      'All scoped Scripture claims are verified with aligned KJV records.',
      'No scoped claims remain in-review or unverified.',
      'No unresolved blocker applies to the dossier.',
    ],
    remainingWarnings: [
      'The existing devash identification warning remains active and requires publication disclosure where relevant.',
    ],
    unresolvedUncertainty: [
      'KJV wording alone does not resolve bee honey versus syrup in every biblical context.',
    ],
    completionReason:
      'The defined honey evidence scope is fully verified while the non-blocking devash identification uncertainty remains explicitly preserved.',
  },
];

export function completionRecordFor(
  dossierId: string,
): DossierCompletionRecord | undefined {
  return DOSSIER_COMPLETION_RECORDS.find(
    (record) => record.dossierId === dossierId,
  );
}
