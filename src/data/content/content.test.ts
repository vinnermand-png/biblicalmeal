import { describe, expect, it } from 'vitest';
import { RESEARCH_CLAIMS } from '../research/claims';
import { RESEARCH_DOSSIERS } from '../research/dossiers';
import { questionsForSubject } from '../research/questions';
import {
  FIRST_WAVE_CONTENT_PLANS,
  PILOT_CONTENT_DRAFTS,
  PILOT_CONTENT_ITEMS,
} from './plans';
import { PUBLIC_FOOD_CONTENT, PUBLIC_FOOD_DRAFTS } from './public';
import {
  canCreateContentDraft,
  canIncludeClaim,
  isContentPublicationEligible,
  mustIncludeDisclosure,
  researchStateForContent,
  validateContentCatalog,
  validateContentDraft,
  validateContentPlan,
} from './validation';

describe('V3C.5 canonical content architecture', () => {
  it('creates one internal plan for each first-wave target', () => {
    expect(FIRST_WAVE_CONTENT_PLANS).toHaveLength(9);
    expect(validateContentCatalog(FIRST_WAVE_CONTENT_PLANS)).toEqual([]);
    for (const plan of FIRST_WAVE_CONTENT_PLANS) {
      expect(validateContentPlan(plan, FIRST_WAVE_CONTENT_PLANS)).toEqual([]);
      expect(plan.seo.indexable).toBe(false);
      expect(researchStateForContent(plan)?.researchStatus).toBe(
        RESEARCH_DOSSIERS.find((dossier) => dossier.id === plan.dossierId)
          ?.researchStatus,
      );
    }
  });

  it('allows internal drafts for completed Figs and Dates without publication approval', () => {
    for (const targetId of ['figs', 'dates']) {
      const plan = FIRST_WAVE_CONTENT_PLANS.find(
        (item) => item.canonicalTargetId === targetId,
      );
      if (!plan) throw new Error(`missing ${targetId} plan`);
      expect(canCreateContentDraft(plan)).toBe(true);
    }
    expect(PILOT_CONTENT_ITEMS).toHaveLength(2);
    expect(
      PILOT_CONTENT_DRAFTS.every((draft) => draft.status === 'draft'),
    ).toBe(true);
    expect(
      PILOT_CONTENT_DRAFTS.every(
        (draft) => draft.publicationState === 'unpublished',
      ),
    ).toBe(true);
  });

  it('defines the two approved public content objects on canonical routes', () => {
    expect(PUBLIC_FOOD_CONTENT.map((item) => item.canonicalTargetId)).toEqual([
      'figs',
      'dates',
    ]);
    expect(PUBLIC_FOOD_CONTENT.map((item) => item.canonicalPath)).toEqual([
      '/foods/figs/',
      '/foods/dates/',
    ]);
    expect(PUBLIC_FOOD_DRAFTS).toHaveLength(2);
    expect(PUBLIC_FOOD_CONTENT.every((item) => item.seo.indexable)).toBe(true);
  });

  it('renders required public disclosures without internal identifiers', () => {
    const publicCopy = PUBLIC_FOOD_CONTENT.flatMap((item) =>
      item.sections.map((section) => section.content ?? ''),
    ).join(' ');
    expect(publicCopy).toContain('sycomore');
    expect(publicCopy).toContain(
      'Palm reference does not equal edible-date reference',
    );
    expect(publicCopy).not.toMatch(/claim-|dossier-|source-registry/);
  });

  it('keeps publication eligibility stricter than draft eligibility', () => {
    const figs = FIRST_WAVE_CONTENT_PLANS.find(
      (plan) => plan.canonicalTargetId === 'figs',
    );
    const draft = PILOT_CONTENT_DRAFTS.find(
      (item) => item.contentItemId === 'content-figs',
    );
    if (!figs || !draft) throw new Error('figs pilot must exist');
    expect(canCreateContentDraft(figs)).toBe(true);
    expect(isContentPublicationEligible(figs, draft)).toBe(false);
    expect(validateContentDraft(draft, figs)).toEqual([]);
  });

  it('requires evidence bindings for factual sections and rejects missing claims', () => {
    const figs = FIRST_WAVE_CONTENT_PLANS.find(
      (plan) => plan.canonicalTargetId === 'figs',
    );
    if (!figs) throw new Error('figs plan must exist');
    const broken = {
      ...figs,
      sections: figs.sections.map((section) =>
        section.mode === 'evidence-backed'
          ? { ...section, evidence: { ...section.evidence, claimIds: [] } }
          : section,
      ),
    };
    expect(validateContentPlan(broken)).toContain(
      'factual-section-without-evidence',
    );
    const missingClaim = {
      ...figs,
      sections: figs.sections.map((section) =>
        section.mode === 'evidence-backed'
          ? {
              ...section,
              evidence: {
                ...section.evidence,
                claimIds: ['claim-does-not-exist'],
              },
            }
          : section,
      ),
    };
    expect(validateContentPlan(missingClaim)).toContain('unknown-claim');
  });

  it('rejects invalid source and Scripture bindings', () => {
    const figs = FIRST_WAVE_CONTENT_PLANS.find(
      (plan) => plan.canonicalTargetId === 'figs',
    );
    if (!figs) throw new Error('figs plan must exist');
    const broken = {
      ...figs,
      sections: figs.sections.map((section) =>
        section.mode === 'evidence-backed'
          ? {
              ...section,
              evidence: {
                ...section.evidence,
                sourceIds: ['source-does-not-exist'],
                scriptureRefs: [{ book: '', chapter: 0, verseStart: 0 }],
              },
              quotation: {
                text: 'invalid quote',
                reference: { book: '', chapter: 0, verseStart: 0 },
              },
            }
          : section,
      ),
    };
    const issues = validateContentPlan(broken);
    expect(issues).toContain('unknown-source');
    expect(issues).toContain('invalid-scripture-reference');
    expect(issues).toContain('invalid-quotation');
  });

  it('flows required uncertainty disclosures from research questions', () => {
    const dates = FIRST_WAVE_CONTENT_PLANS.find(
      (plan) => plan.canonicalTargetId === 'dates',
    );
    const honey = FIRST_WAVE_CONTENT_PLANS.find(
      (plan) => plan.canonicalTargetId === 'honey',
    );
    if (!dates || !honey) throw new Error('dates and honey plans must exist');
    expect(mustIncludeDisclosure(dates)).toBe(true);
    expect(dates.requiredDisclosureQuestionIds).toContain(
      'question-dates-palm-fruit-identification',
    );
    expect(honey.requiredDisclosureQuestionIds).toContain(
      'question-honey-devash-translation',
    );
    expect(
      questionsForSubject('dates').some((q) => q.resolution === 'warning'),
    ).toBe(true);
  });

  it('preserves claim status and canonical ownership without duplicating research state', () => {
    const figs = FIRST_WAVE_CONTENT_PLANS.find(
      (plan) => plan.canonicalTargetId === 'figs',
    );
    if (!figs) throw new Error('figs plan must exist');
    expect(figs.workflowStatus).toBe('research-complete');
    expect(figs.ownership).toBe('primary');
    expect(canIncludeClaim('claim-figs-tel-tsaf-horticulture')).toBe(true);
    expect(
      RESEARCH_CLAIMS.find(
        (claim) => claim.id === 'claim-figs-tel-tsaf-horticulture',
      )?.verification,
    ).toBe('verified');
  });

  it('references existing content briefs without copying brief content', () => {
    const jesus = FIRST_WAVE_CONTENT_PLANS.find(
      (plan) => plan.canonicalTargetId === 'what-did-jesus-eat',
    );
    const figs = FIRST_WAVE_CONTENT_PLANS.find(
      (plan) => plan.canonicalTargetId === 'figs',
    );
    expect(jesus?.briefId).toBe('what-did-jesus-eat');
    expect(jesus?.briefStatus).toBe('approved');
    expect(figs?.briefId).toBeUndefined();
  });

  it('keeps in-progress subjects from appearing research-complete', () => {
    const barley = FIRST_WAVE_CONTENT_PLANS.find(
      (plan) => plan.canonicalTargetId === 'barley',
    );
    if (!barley) throw new Error('barley plan must exist');
    expect(barley.workflowStatus).toBe('research-in-progress');
    expect(researchStateForContent(barley)?.researchStatus).toBe('in-progress');
  });
});
