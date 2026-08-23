import { describe, expect, it } from 'vitest';
import { SEO_TARGETS } from '../seo-master-map';
import { FOOD_UNIVERSE } from '../food-universe';
import {
  canSupportHistoricalRecipe,
  getBestSupport,
  hasValidSources,
  isClaimPublicationEligible,
  isDirectScriptureEvidence,
  isHistoricalContextClaim,
  mapFoodEvidence,
  mustDiscloseUncertainty,
  validateClaim,
} from './helpers';
import { RESEARCH_CLAIMS } from './claims';
import {
  RESEARCH_DOSSIERS,
  allDossierTargetIdsExist,
  dossierSubjectExists,
} from './dossiers';
import { SOURCE_REGISTRY, getSource } from './sources';
import { UNRESOLVED_QUESTIONS, questionsForSubject } from './questions';
import type { ResearchClaim } from './types';

const synthetic = (overrides: Partial<ResearchClaim>): ResearchClaim => ({
  id: 'claim-test-synthetic',
  subjectId: 'figs',
  text: 'Synthetic infrastructure test claim.',
  category: 'historical',
  evidence: 'attested',
  verification: 'unverified',
  provenance: 'test fixture (non-factual)',
  supports: [{ sourceId: 'macdonald-2008', level: 'direct' }],
  ...overrides,
});

describe('source registry', () => {
  it('has unique source ids', () => {
    const ids = SOURCE_REGISTRY.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('records no fabricated metadata', () => {
    // Only sources whose metadata was genuinely researched may carry year or
    // identifier data; everything else must stay metadata-free.
    const researchedSourceIds = new Set([
      'macdonald-2008',
      'bas-2015-ancient-beans',
      'nature-2022-tel-tsaf-fruit-trees',
      'science-2020-judean-date-palm',
      'bible-odyssey-bread-ancient-israel',
      'bible-odyssey-milk-honey',
    ]);
    for (const source of SOURCE_REGISTRY) {
      if (!researchedSourceIds.has(source.id)) {
        expect(source.year, source.id).toBeUndefined();
        expect(source.identifier, source.id).toBeUndefined();
      }
    }
    expect(getSource('scripture-canon')?.reliability).toBe('canonical-text');
    const bas = getSource('bas-2015-ancient-beans');
    expect(bas?.author).toBe('Robin Ngo');
    expect(bas?.year).toBe(2015);
    expect(bas?.identifier).toMatch(
      /^https:\/\/www\.biblicalarchaeology\.org\//,
    );
    expect(bas?.primarySource).toBe(false);
  });

  it('leaves the scripture source unbound to any translation decision', () => {
    const scripture = getSource('scripture-canon');
    expect(scripture).toBeDefined();
    expect(scripture?.notes).toMatch(/translation/i);
    expect(scripture?.kind).toBe('scripture');
  });
});

describe('claim registry integrity', () => {
  it('has unique claim ids', () => {
    const ids = RESEARCH_CLAIMS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('references only existing sources on every claim', () => {
    for (const claim of RESEARCH_CLAIMS) {
      expect(hasValidSources(claim), claim.id).toBe(true);
    }
  });

  it('keeps derived brief-anchor claims unverified (wording checks stay recorded work)', () => {
    const anchors = RESEARCH_CLAIMS.filter((c) =>
      c.provenance.includes('brief-anchor'),
    );
    expect(anchors.length).toBeGreaterThanOrEqual(4);
    for (const claim of anchors) {
      // Anchor claims are repo-derived; they may never self-verify.
      expect(claim.verification).toBe('unverified');
    }
  });

  it('segregates pilot research claims by explicit provenance', () => {
    const pilot = RESEARCH_CLAIMS.filter((c) =>
      c.provenance.includes('research session'),
    );
    expect(pilot.length).toBeGreaterThan(0);
    for (const claim of pilot) {
      expect(claim.provenance).toContain('2026-08-23');
      expect(validateClaim(claim)).toEqual([]);
    }
  });

  it('keeps claims multiple-source and sources multi-claim capable', () => {
    const shared: ResearchClaim[] = [
      synthetic({
        id: 'claim-a',
        supports: [
          { sourceId: 'macdonald-2008', level: 'direct' },
          { sourceId: 'scripture-canon', level: 'contextual' },
        ],
      }),
      synthetic({
        id: 'claim-b',
        subjectId: 'olives',
        supports: [{ sourceId: 'macdonald-2008', level: 'partial' }],
      }),
    ];
    // one claim supported by several sources...
    expect(shared[0].supports).toHaveLength(2);
    expect(getBestSupport(shared[0])).toBe('direct');
    // ...and one source supporting several claims.
    const macdonaldClaims = [...RESEARCH_CLAIMS, ...shared].filter((c) =>
      c.supports.some((s) => s.sourceId === 'macdonald-2008'),
    );
    expect(macdonaldClaims.length).toBeGreaterThan(1);
  });
});

describe('verification rules', () => {
  it('rejects verified claims without sources', () => {
    const issues = validateClaim(
      synthetic({ verification: 'verified', supports: [] }),
    );
    expect(issues).toContain('no-sources');
    expect(issues).toContain('verified-without-source');
  });

  it('rejects verified claims resting on disputed support alone', () => {
    const issues = validateClaim(
      synthetic({
        verification: 'verified',
        supports: [{ sourceId: 'macdonald-2008', level: 'disputed' }],
      }),
    );
    expect(issues).toContain('verified-on-disputed-support');
  });

  it('rejects speculative claims marked verified', () => {
    const issues = validateClaim(
      synthetic({ evidence: 'speculative', verification: 'verified' }),
    );
    expect(issues).toContain('verified-speculative-evidence');
  });

  it('represents uncertainty honestly without forcing false verification', () => {
    const uncertain = synthetic({
      evidence: 'requires-verification',
      supports: [{ sourceId: 'macdonald-2008', level: 'partial' }],
      uncertaintyNote: 'Source qualifies but does not establish the claim.',
    });
    expect(validateClaim(uncertain)).toEqual([]);
    expect(isClaimPublicationEligible(uncertain)).toBe(false);
    expect(mustDiscloseUncertainty(uncertain)).toBe(true);
  });

  it('flags unknown source references', () => {
    const issues = validateClaim(
      synthetic({
        supports: [{ sourceId: 'not-in-registry', level: 'direct' }],
      }),
    );
    expect(issues).toContain('unknown-source');
  });
});

describe('claim usage rules', () => {
  it('marks unverified claims as ineligible even when well-sourced', () => {
    const claim = synthetic({});
    expect(validateClaim(claim)).toEqual([]);
    expect(isClaimPublicationEligible(claim)).toBe(false);
  });

  it('grants eligibility only to clean verified claims without blocking questions', () => {
    const eligible = synthetic({ verification: 'verified' });
    expect(isClaimPublicationEligible(eligible)).toBe(true);

    const gated = synthetic({
      id: 'claim-meat-x',
      subjectId: 'meat-in-the-bible',
      verification: 'verified',
    });
    expect(isClaimPublicationEligible(gated)).toBe(false);
  });

  it('distinguishes direct scripture evidence from historical context', () => {
    expect(isDirectScriptureEvidence(RESEARCH_CLAIMS[0])).toBe(true);
    const historical = synthetic({ category: 'archaeological' });
    expect(isDirectScriptureEvidence(historical)).toBe(false);
    expect(isHistoricalContextClaim(historical)).toBe(true);
  });

  it('requires verified wording before a claim may back a recipe basis', () => {
    const unverifiedScripture = RESEARCH_CLAIMS[0];
    expect(canSupportHistoricalRecipe(unverifiedScripture)).toBe(false);
    const verified = synthetic({
      category: 'scripture',
      verification: 'verified',
    });
    expect(canSupportHistoricalRecipe(verified)).toBe(true);
  });
});

describe('evidence vocabulary mapping', () => {
  it('maps every food-universe evidence status losslessly', () => {
    const statuses = new Set(FOOD_UNIVERSE.map((f) => f.evidence));
    for (const status of statuses) {
      expect(mapFoodEvidence(status), status).toBeDefined();
    }
    expect(mapFoodEvidence('directly-attested')).toBe('attested');
    expect(mapFoodEvidence('uncertain-identification')).toBe('speculative');
    expect(mapFoodEvidence('nonexistent')).toBeUndefined();
  });
});

describe('unresolved questions', () => {
  it('can exist per subject with explicit resolutions', () => {
    expect(UNRESOLVED_QUESTIONS.length).toBeGreaterThan(2);
    for (const q of UNRESOLVED_QUESTIONS) {
      expect(['blocker', 'warning', 'research-task']).toContain(q.resolution);
      expect(q.provenance.length).toBeGreaterThan(10);
    }
  });

  it('turns blockers and warnings into different downstream behavior', () => {
    const meatQuestions = questionsForSubject('meat-in-the-bible');
    expect(meatQuestions.some((q) => q.resolution === 'blocker')).toBe(true);

    const honeyQuestions = questionsForSubject('honey');
    expect(honeyQuestions.some((q) => q.resolution === 'warning')).toBe(true);
    expect(honeyQuestions.every((q) => q.resolution !== 'blocker')).toBe(true);
  });

  it('derives identification questions from uncertain universe entities', () => {
    const uncertainEntities = FOOD_UNIVERSE.filter(
      (f) => f.evidence === 'uncertain-identification',
    );
    for (const entity of uncertainEntities) {
      const derived = questionsForSubject(entity.id).find(
        (q) => q.kind === 'disputed-identification',
      );
      expect(derived, entity.id).toBeDefined();
      expect(derived?.resolution).toBe('research-task');
    }
  });
});

describe('research dossiers', () => {
  it('covers the entire first wave structurally with honest statuses', () => {
    expect(RESEARCH_DOSSIERS).toHaveLength(9);
    const researchedIds = new Set([
      'dossier-figs',
      'dossier-olives',
      'dossier-lentils',
      'dossier-barley',
      'dossier-dates',
      'dossier-honey',
      'dossier-foods-of-the-bible',
      'dossier-what-did-jesus-eat',
      'dossier-food-in-biblical-times',
    ]);
    const completedIds = new Set(['dossier-figs', 'dossier-dates']);
    for (const dossier of RESEARCH_DOSSIERS) {
      expect(dossierSubjectExists(dossier)).toBe(true);
      if (researchedIds.has(dossier.id)) {
        // Pilot trio: recorded research session, notes and date required.
        expect(dossier.researchStatus).toBe(
          completedIds.has(dossier.id) ? 'complete' : 'in-progress',
        );
        expect(dossier.researchNotes?.length).toBeGreaterThan(0);
        expect(dossier.updatedAt).toBe('2026-08-23');
      } else {
        expect(dossier.researchStatus).toBe('not-started');
        expect(dossier.researchNotes).toBeUndefined();
        expect(dossier.updatedAt).toBeUndefined();
      }
    }
  });

  it('references valid pursuing V3B targets only', () => {
    expect(allDossierTargetIdsExist()).toBe(true);
    for (const dossier of RESEARCH_DOSSIERS) {
      for (const targetId of dossier.relatedTargetIds) {
        const target = SEO_TARGETS.find((t) => t.id === targetId);
        expect(target).toBeDefined();
        expect(target?.status).not.toBe('not-pursuing');
      }
    }
  });

  it('never attaches not-pursuing subjects as publication candidates', () => {
    const notPursuing = SEO_TARGETS.filter(
      (t) => t.status === 'not-pursuing',
    ).map((t) => t.id);
    for (const dossier of RESEARCH_DOSSIERS) {
      expect(notPursuing).not.toContain(dossier.subjectId);
    }
  });

  it('links existing claims and questions by id', () => {
    const claimIds = new Set(RESEARCH_CLAIMS.map((c) => c.id));
    const questionIds = new Set(UNRESOLVED_QUESTIONS.map((q) => q.id));
    for (const dossier of RESEARCH_DOSSIERS) {
      for (const id of dossier.claimIds) expect(claimIds.has(id)).toBe(true);
      for (const id of dossier.questionIds)
        expect(questionIds.has(id)).toBe(true);
    }
  });
});
