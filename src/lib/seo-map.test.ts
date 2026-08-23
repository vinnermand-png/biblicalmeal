import { describe, expect, it } from 'vitest';

import {
  DATA_LIMITS_DISCLAIMER,
  LINKING_PATHS,
  PILLAR_TARGET_IDS,
  RESEARCH_LOG,
  ROADMAP_PHASES,
  SEO_CLUSTERS,
  SEO_TARGETS,
} from '../data/seo-master-map';
import { CONTENT_BRIEFS } from '../data/content-briefs';
import { FOOD_UNIVERSE } from '../data/food-universe';
import { KEYWORD_FAMILIES } from '../data/keyword-families';
import {
  DELIBERATE_AVOIDANCES,
  TARGET_PRIORITY_SCORES,
} from '../data/page1-framework';
import { COMPETITOR_OBSERVATIONS, GAP_THEMES } from '../data/competitor-gap';
import {
  METHODOLOGY_RULES,
  TRUST_NON_NEGOTIABLES,
  TRUST_PAGE_PLANS,
} from '../data/editorial-trust';
import {
  CITATION_REQUIREMENTS,
  SOURCE_REF_SPECS,
} from '../data/source-citations';
import {
  AUTHORITY_PRINCIPLES,
  OUTREACH_CATEGORIES,
  POST_LAUNCH_LOOP,
  PROHIBITED_TACTICS,
  TECH_SEO_EXPANSION_CHECKLIST,
} from '../data/post-launch-seo';
import {
  V3B_COMPLETION_MATRIX,
  type MatrixClassification,
} from '../data/v3b-completion-matrix';

const targetIds = new Set(SEO_TARGETS.map((t) => t.id));
const clusterIds = new Set(SEO_CLUSTERS.map((c) => c.id));
const pursuingTargetIds = new Set(
  SEO_TARGETS.filter((t) => t.status !== 'not-pursuing').map((t) => t.id),
);

describe('SEO master map - targets', () => {
  it('has unique target ids', () => {
    expect(targetIds.size).toBe(SEO_TARGETS.length);
  });

  it('has unique non-empty target routes', () => {
    const routes = SEO_TARGETS.map((t) => t.targetRoute).filter(
      (r) => r.length > 0,
    );
    expect(new Set(routes).size).toBe(routes.length);
  });

  it('only uses known clusters', () => {
    for (const t of SEO_TARGETS) {
      expect(clusterIds.has(t.cluster), `unknown cluster on ${t.id}`).toBe(
        true,
      );
    }
  });

  it('relatedTopics reference valid targets', () => {
    for (const t of SEO_TARGETS) {
      for (const rel of t.relatedTopics) {
        expect(targetIds.has(rel), `${t.id} -> unknown related "${rel}"`).toBe(
          true,
        );
      }
    }
  });

  it('parentTopic references valid targets', () => {
    for (const t of SEO_TARGETS) {
      if (t.parentTopic !== undefined) {
        expect(
          targetIds.has(t.parentTopic),
          `${t.id} -> unknown parent "${t.parentTopic}"`,
        ).toBe(true);
      }
    }
  });

  it('pillar targets exist and are pillar content type', () => {
    for (const id of PILLAR_TARGET_IDS) {
      const t = SEO_TARGETS.find((x) => x.id === id);
      expect(t, `pillar id ${id} missing`).toBeDefined();
      expect(t?.contentType).toBe('pillar');
    }
  });

  it('not-pursuing targets carry no route', () => {
    for (const t of SEO_TARGETS) {
      if (t.status === 'not-pursuing') {
        expect(t.targetRoute, `${t.id} must not claim a route`).toBe('');
      }
    }
  });
});

describe('SEO master map - linking plan', () => {
  it('linking path steps reference valid targets', () => {
    for (const p of LINKING_PATHS) {
      for (const step of p.steps) {
        expect(targetIds.has(step), `path ${p.name} -> unknown "${step}"`).toBe(
          true,
        );
      }
    }
  });

  it('roadmap phases reference valid targets', () => {
    for (const phase of ROADMAP_PHASES) {
      for (const id of phase.targetIds) {
        expect(targetIds.has(id), `phase ${phase.id} -> unknown "${id}"`).toBe(
          true,
        );
      }
    }
  });
});

describe('content briefs', () => {
  it('have unique ids', () => {
    const ids = CONTENT_BRIEFS.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('reference existing targets exactly once each', () => {
    const seen = new Set<string>();
    for (const b of CONTENT_BRIEFS) {
      expect(targetIds.has(b.targetId), `brief ${b.id} -> unknown target`).toBe(
        true,
      );
      expect(seen.has(b.targetId), `duplicate brief for ${b.targetId}`).toBe(
        false,
      );
      seen.add(b.targetId);
    }
  });

  it('carry guardrails and a claim plan', () => {
    for (const b of CONTENT_BRIEFS) {
      expect(b.honestyGuardrails.length).toBeGreaterThan(0);
      expect(b.claimPlan.length).toBeGreaterThan(0);
      for (const link of [...b.linksInto, ...b.linksFrom]) {
        expect(
          targetIds.has(link),
          `brief ${b.id} -> unknown link "${link}"`,
        ).toBe(true);
      }
    }
  });

  it('use only defined evidence tiers in claim plans', () => {
    const tiers = new Set(['attested', 'plausible', 'speculative']);
    for (const b of CONTENT_BRIEFS) {
      for (const c of b.claimPlan) {
        expect(tiers.has(c.tier)).toBe(true);
      }
    }
  });
});

describe('research log discipline', () => {
  it('labels every entry as a verified SERP observation', () => {
    for (const e of RESEARCH_LOG) {
      expect(e.label).toBe('VERIFIED-SERP-OBSERVATION');
      expect(e.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(e.observations.length).toBeGreaterThan(0);
    }
  });

  it('states the data-limits disclaimer', () => {
    expect(DATA_LIMITS_DISCLAIMER.length).toBeGreaterThan(50);
    expect(DATA_LIMITS_DISCLAIMER).toMatch(/no such tooling/i);
  });
});

describe('food universe inventory', () => {
  const entityIds = new Set(FOOD_UNIVERSE.map((f) => f.id));
  const classifications = new Set([
    'direct-page-candidate',
    'supporting-topic',
    'merge-into-broader-page',
    'research-first',
    'not-pursuing',
  ]);
  const evidenceSet = new Set([
    'directly-attested',
    'historically-plausible',
    'uncertain-identification',
    'requires-verification',
  ]);

  it('has unique entity ids', () => {
    expect(entityIds.size).toBe(FOOD_UNIVERSE.length);
    expect(FOOD_UNIVERSE.length).toBeGreaterThanOrEqual(50);
  });

  it('uses valid classifications and evidence labels', () => {
    for (const f of FOOD_UNIVERSE) {
      expect(classifications.has(f.classification), f.id).toBe(true);
      expect(evidenceSet.has(f.evidence), f.id).toBe(true);
      expect(f.note.length).toBeGreaterThan(5);
    }
  });

  it('mergeInto references an entity or target id', () => {
    for (const f of FOOD_UNIVERSE) {
      if (f.classification === 'merge-into-broader-page') {
        expect(
          entityIds.has(f.mergeInto ?? '') || targetIds.has(f.mergeInto ?? ''),
          `${f.id} -> unknown merge target ${f.mergeInto}`,
        ).toBe(true);
      } else {
        expect(f.mergeInto).toBeUndefined();
      }
    }
  });

  it('never classifies ritual substances as food candidates', () => {
    for (const f of FOOD_UNIVERSE) {
      if (f.category === 'ritual-non-food') {
        expect(f.classification, f.id).toBe('not-pursuing');
      }
      if (
        ['frankincense', 'myrrh', 'anointing-oil', 'incense'].includes(f.id)
      ) {
        expect(f.classification, f.id).toBe('not-pursuing');
      }
    }
  });

  it('defaults uncertain identifications to research-first or supporting', () => {
    for (const f of FOOD_UNIVERSE) {
      if (f.evidence === 'uncertain-identification') {
        expect(
          [
            'research-first',
            'supporting-topic',
            'not-pursuing',
            'merge-into-broader-page',
          ],
          f.id,
        ).toContain(f.classification);
      }
    }
  });
});

describe('keyword families / cannibalization matrix', () => {
  const familyIds = new Set(KEYWORD_FAMILIES.map((f) => f.id));

  it('have unique family ids', () => {
    expect(familyIds.size).toBe(KEYWORD_FAMILIES.length);
  });

  it('canonical owners exist', () => {
    for (const fam of KEYWORD_FAMILIES) {
      expect(targetIds.has(fam.canonicalOwner), fam.id).toBe(true);
    }
  });

  it('standard families own a pursuing target exactly once', () => {
    const seenOwners = new Set<string>();
    for (const fam of KEYWORD_FAMILIES) {
      if (fam.policy === 'do-not-build') continue;
      const owner = SEO_TARGETS.find((t) => t.id === fam.canonicalOwner);
      expect(owner?.status, `${fam.id} owner must be pursuing`).not.toBe(
        'not-pursuing',
      );
      expect(
        seenOwners.has(fam.canonicalOwner),
        `duplicate canonical route ownership: ${fam.canonicalOwner}`,
      ).toBe(false);
      seenOwners.add(fam.canonicalOwner);
    }
  });

  it('member and supporting references are valid targets', () => {
    for (const fam of KEYWORD_FAMILIES) {
      for (const id of [
        ...(fam.memberTargets ?? []),
        ...(fam.supportingTargets ?? []),
      ]) {
        expect(targetIds.has(id), `${fam.id} -> ${id}`).toBe(true);
      }
    }
  });

  it('every pursuing target belongs to at least one family (no empty canonical coverage)', () => {
    const covered = new Set<string>();
    for (const fam of KEYWORD_FAMILIES) {
      covered.add(fam.canonicalOwner);
      for (const id of fam.memberTargets ?? []) covered.add(id);
      for (const id of fam.supportingTargets ?? []) covered.add(id);
    }
    for (const id of pursuingTargetIds) {
      expect(
        covered.has(id),
        `pursuing target without family coverage: ${id}`,
      ).toBe(true);
    }
  });

  it('maps a meaningful phrase universe', () => {
    const total = KEYWORD_FAMILIES.reduce((n, f) => n + f.phrases.length, 0);
    expect(total).toBeGreaterThanOrEqual(45);
  });

  it('never assigns the same primary keyword to two targets (cannibalization guard)', () => {
    const primaries = new Set<string>();
    for (const t of SEO_TARGETS) {
      const key = t.primaryKeyword.toLowerCase();
      expect(primaries.has(key), `duplicate primary keyword "${key}"`).toBe(
        false,
      );
      primaries.add(key);
      for (const other of SEO_TARGETS) {
        if (other.id === t.id) continue;
        expect(
          other.primaryKeyword.toLowerCase(),
          `${t.id} and ${other.id} share primary keyword`,
        ).not.toBe(key);
      }
    }
  });

  it('section-only variants never leak onto targets outside their own family', () => {
    const keywordOwners = new Map<string, Set<string>>();
    for (const t of SEO_TARGETS) {
      for (const kw of [t.primaryKeyword, ...t.secondaryKeywords]) {
        const key = kw.toLowerCase();
        if (!keywordOwners.has(key)) keywordOwners.set(key, new Set());
        keywordOwners.get(key)?.add(t.id);
      }
    }
    const seen = new Set<string>();
    for (const fam of KEYWORD_FAMILIES) {
      for (const v of fam.sectionOnlyVariants ?? []) {
        const phrase = v.split('(')[0].trim().toLowerCase();
        expect(seen.has(phrase), `duplicate section variant "${phrase}"`).toBe(
          false,
        );
        seen.add(phrase);
        const owners = keywordOwners.get(phrase);
        if (!owners) continue;
        for (const owner of owners) {
          expect(
            owner,
            `"${phrase}" is section-only in ${fam.id} but is a keyword of foreign target ${owner}`,
          ).toBe(fam.canonicalOwner);
        }
      }
    }
  });
});

describe('page-1 prioritization framework', () => {
  const factors = [
    'relevance',
    'intentClarity',
    'depthPotential',
    'authorityFit',
    'linkingValue',
    'researchEase',
    'lowCompetition',
    'differentiation',
    'editorialConfidence',
  ] as const;
  const tiers = new Set([
    'cornerstone',
    'strong-supporting',
    'long-tail-value',
    'research-heavy',
  ]);
  const scorable = new Set(
    [...pursuingTargetIds].filter((id) => id !== 'homepage-brand'),
  );

  it('scores every pursuing non-navigational target', () => {
    for (const id of scorable) {
      expect(
        TARGET_PRIORITY_SCORES[id],
        `missing score for ${id}`,
      ).toBeDefined();
    }
  });

  it('contains no scores for unknown or avoided targets', () => {
    for (const id of Object.keys(TARGET_PRIORITY_SCORES)) {
      expect(scorable.has(id), `unexpected score entry: ${id}`).toBe(true);
    }
  });

  it('keeps factor values within 1-5 and tiers valid', () => {
    for (const [id, s] of Object.entries(TARGET_PRIORITY_SCORES)) {
      for (const f of factors) {
        const v = s.factors[f];
        expect(Number.isInteger(v) && v >= 1 && v <= 5, `${id}.${f}=${v}`).toBe(
          true,
        );
      }
      expect(tiers.has(s.tier), id).toBe(true);
      expect(s.rationale.length).toBeGreaterThan(10);
    }
  });

  it('documents avoidances for every not-pursuing target and no others', () => {
    const avoidIds = new Set(DELIBERATE_AVOIDANCES.map((a) => a.targetId));
    const notPursuing = new Set(
      SEO_TARGETS.filter((t) => t.status === 'not-pursuing').map((t) => t.id),
    );
    expect(avoidIds).toEqual(notPursuing);
  });
});

describe('competitor & content gap framework', () => {
  it('records only dated, SERP-labeled observations', () => {
    for (const c of COMPETITOR_OBSERVATIONS) {
      expect(c.evidenceLevel).toBe('serp-observed');
      expect(c.reviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(c.observedForQuery.length).toBeGreaterThan(3);
      expect(c.biblicalmealDifferentiation.length).toBeGreaterThan(0);
    }
  });

  it('defines cross-cutting gap themes', () => {
    expect(GAP_THEMES.length).toBeGreaterThanOrEqual(4);
  });
});

describe('editorial trust architecture', () => {
  it('plans unique trust pages with required content lists', () => {
    const routes = new Set(TRUST_PAGE_PLANS.map((p) => p.route));
    expect(routes.size).toBe(TRUST_PAGE_PLANS.length);
    for (const p of TRUST_PAGE_PLANS) {
      expect(p.mustContain.length).toBeGreaterThan(0);
      expect(p.evidenceRequired.length).toBeGreaterThan(0);
    }
  });

  it('covers all four methodology domains with uncertainty rules', () => {
    const domains = new Set(METHODOLOGY_RULES.map((r) => r.domain));
    for (const d of ['scripture', 'history', 'recipes', 'uncertainty']) {
      expect(domains.has(d as never), `missing methodology domain ${d}`).toBe(
        true,
      );
    }
  });

  it('states non-negotiables including english-only policy', () => {
    expect(TRUST_NON_NEGOTIABLES.some((r) => /english-only/i.test(r))).toBe(
      true,
    );
    expect(
      TRUST_NON_NEGOTIABLES.some((r) => /no fabricated scripture/i.test(r)),
    ).toBe(true);
  });
});

describe('source & citation strategy', () => {
  it('defines unique source kinds with required fields', () => {
    const kinds = new Set(SOURCE_REF_SPECS.map((s) => s.kind));
    expect(kinds.size).toBe(SOURCE_REF_SPECS.length);
    for (const s of SOURCE_REF_SPECS) {
      expect(s.requiredFields.length).toBeGreaterThan(0);
    }
  });

  it('requires citation plans per content type', () => {
    for (const key of ['pillar', 'ingredient', 'article', 'recipe']) {
      expect(
        CITATION_REQUIREMENTS[key],
        `missing citation requirements for ${key}`,
      ).toBeDefined();
    }
  });

  it('briefs declare citation plans where present', () => {
    for (const b of CONTENT_BRIEFS) {
      if (b.citationPlan) {
        expect(b.citationPlan.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('post-launch system & authority strategy', () => {
  it('encodes the launch-to-page-1 loop in order', () => {
    const expected = [
      'launch',
      'indexing',
      'search-console',
      'real-impressions',
      'real-queries',
      'real-average-positions',
      'position-11-20-review',
      'content-improvement',
      'internal-link-improvement',
      'ctr-improvement',
      'relevant-link-earning',
      'page-1-push',
    ];
    expect(POST_LAUNCH_LOOP.map((s) => s.stage)).toEqual(expected);
  });

  it('marks all loop stages as future data', () => {
    for (const s of POST_LAUNCH_LOOP) {
      expect(s.dataStatus).toBe('future');
    }
  });

  it('expands technical seo with dated-timing requirements', () => {
    expect(TECH_SEO_EXPANSION_CHECKLIST.length).toBeGreaterThanOrEqual(10);
    for (const t of TECH_SEO_EXPANSION_CHECKLIST) {
      expect(t.timing.length).toBeGreaterThan(3);
    }
  });

  it('prioritizes relevance-based authority building and bans spam tactics', () => {
    expect(AUTHORITY_PRINCIPLES.join(' ')).toMatch(/relevance/i);
    expect(OUTREACH_CATEGORIES.length).toBeGreaterThanOrEqual(5);
    expect(PROHIBITED_TACTICS.some((p) => /PBN/i.test(p))).toBe(true);
    expect(PROHIBITED_TACTICS.some((p) => /buy/i.test(p))).toBe(true);
  });
});

describe('public-content language discipline', () => {
  it('contains no Danish characters in public-facing strategy data', () => {
    const publicData = JSON.stringify({
      SEO_TARGETS,
      FOOD_UNIVERSE,
      KEYWORD_FAMILIES,
      TARGET_PRIORITY_SCORES,
      COMPETITOR_OBSERVATIONS,
      GAP_THEMES,
      TRUST_PAGE_PLANS,
      METHODOLOGY_RULES,
      POST_LAUNCH_LOOP,
      CONTENT_BRIEFS,
    });
    expect(publicData).not.toMatch(/[æøåÆØÅ]/);
  });
});

describe('V3B completion matrix (phase gate)', () => {
  const validClassifications: MatrixClassification[] = [
    'verified',
    'resolved-with-caveat',
    'explicitly-deferred',
    'not-blocking',
  ];

  it('has unique item ids', () => {
    const ids = V3B_COMPLETION_MATRIX.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThanOrEqual(18);
  });

  it('uses only defined classifications', () => {
    for (const m of V3B_COMPLETION_MATRIX) {
      expect(validClassifications, m.id).toContain(m.classification);
    }
  });

  it('closes the phase only when nothing is blocking (gate)', () => {
    const blockers = V3B_COMPLETION_MATRIX.filter((m) => m.blocking);
    expect(
      blockers.map((b) => b.id),
      'V3B cannot close while blocking items exist - resolve or reclassify them honestly first',
    ).toEqual([]);
    for (const m of V3B_COMPLETION_MATRIX) {
      if (m.blocking) continue;
      expect(m.status, `${m.id} must be closed`).toBe('closed');
      expect(m.evidence.length, `${m.id} needs evidence`).toBeGreaterThan(10);
    }
  });

  it('demands an explicit action or note from every deferred/caveated item', () => {
    for (const m of V3B_COMPLETION_MATRIX) {
      if (
        m.classification === 'explicitly-deferred' ||
        m.classification === 'resolved-with-caveat'
      ) {
        expect(
          (m.requiredAction ?? m.notes ?? '').length,
          `${m.id} lacks a documented condition`,
        ).toBeGreaterThan(10);
      }
    }
  });
});
