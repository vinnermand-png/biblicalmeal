/**
 * V3C.2 RESEARCH CLAIMS
 * =====================
 * The claim registry starts MINIMAL and honest:
 *
 * - Scripture-anchor claims are DERIVED programmatically from the V3B content
 *   briefs (content-briefs.ts). They record only facts already in this repo:
 *   that a given passage is a working anchor for a given brief. No
 *   interpretation of any passage is recorded.
 * - All anchors are verified:false in the briefs, so every derived claim is
 *   verification:'unverified' - wording checks cannot start before the
 *   site-wide translation decision (deferred gate).
 * - No historical, archaeological or linguistic claims exist yet. They will
 *   be added as REAL research happens, never to populate the system.
 */

import { CONTENT_BRIEFS } from '../content-briefs';
import { parseCanonicalReference } from '../../lib/scripture';
import type { ResearchClaim, ScriptureClaimContext } from './types';
import { FIGS_CLAIMS } from './pilot/figs';
import { OLIVES_CLAIMS } from './pilot/olives';
import { LENTILS_CLAIMS } from './pilot/lentils';
import { BARLEY_CLAIMS } from './pilot/barley';
import { DATES_CLAIMS } from './pilot/dates';
import { HONEY_CLAIMS } from './pilot/honey';
import { CORNERSTONE_CLAIMS } from './cornerstones';
import { PHASE2_CLAIMS } from './phase2';

/** Derives scripture-anchor claims from brief anchors (repo data only). */
export function deriveAnchorClaims(): ResearchClaim[] {
  const claims: ResearchClaim[] = [];
  for (const brief of CONTENT_BRIEFS) {
    for (const anchor of brief.scriptureAnchors) {
      const slug = anchor.reference.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      // V3C.3: anchors become machine-validatable canonical references.
      // Anchors are working references, not quotations - mode reference-only.
      const parsed = parseCanonicalReference(anchor.reference);
      const scriptureContext: ScriptureClaimContext | undefined = parsed
        ? { reference: parsed, mode: 'reference-only' }
        : undefined;
      claims.push({
        id: `claim-${brief.targetId}-${slug}`.toLowerCase(),
        subjectId: brief.targetId,
        text: `Working anchor "${anchor.reference}" for brief "${brief.workingTitle}" (${brief.targetId}).`,
        category: 'scripture',
        evidence: 'attested',
        verification: anchor.verified ? 'verified' : 'unverified',
        provenance: 'derived-from-brief-anchor (content-briefs.ts)',
        supports: [
          {
            sourceId: 'scripture-canon',
            level: 'direct',
            qualification: anchor.verified
              ? 'Wording verified against KJV.'
              : 'Textual presence only; wording check against the locked KJV text has not yet been performed.',
          },
        ],
        scriptureContext,
      });
    }
  }
  return claims;
}

/**
 * The registry now has two honest layers:
 * - Derived brief anchors (repo data only, all unverified - see above).
 * - V3C.4 Phase 1A pilot research (figs / olives / lentils): real claims from
 *   the 2026-08-23 research session. Scripture claims verified there each
 *   carry a recorded KJV wording check enforced via verification.ts.
 */
export const RESEARCH_CLAIMS: ResearchClaim[] = [
  ...deriveAnchorClaims(),
  ...FIGS_CLAIMS,
  ...OLIVES_CLAIMS,
  ...LENTILS_CLAIMS,
  ...BARLEY_CLAIMS,
  ...DATES_CLAIMS,
  ...HONEY_CLAIMS,
  ...CORNERSTONE_CLAIMS,
  ...PHASE2_CLAIMS,
];
