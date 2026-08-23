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
];

export function completionRecordFor(
  dossierId: string,
): DossierCompletionRecord | undefined {
  return DOSSIER_COMPLETION_RECORDS.find(
    (record) => record.dossierId === dossierId,
  );
}
