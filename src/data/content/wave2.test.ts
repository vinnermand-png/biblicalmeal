import { describe, expect, it } from 'vitest';
import { canIncludeClaim, validateContentDraft } from './validation';
import { FIRST_WAVE_CONTENT_PLANS } from './plans';
import {
  V3C15_INTERNAL_LINKS,
  V3C15_WAVE2_DRAFTS,
  V3C15_WAVE2_TARGET_IDS,
} from './wave2';

describe('V3C.15 Content Expansion Wave 2', () => {
  it('expands only the next research-complete first-wave subjects', () => {
    expect(V3C15_WAVE2_TARGET_IDS).toEqual(['barley', 'honey']);
    expect(V3C15_WAVE2_DRAFTS).toHaveLength(2);
    expect(V3C15_WAVE2_DRAFTS.map((draft) => draft.workflowStatus)).toEqual([
      'research-complete',
      'research-complete',
    ]);
  });

  it('keeps both drafts evidence-bound, complete, and unpublished', () => {
    for (const draft of V3C15_WAVE2_DRAFTS) {
      const plan = FIRST_WAVE_CONTENT_PLANS.find(
        (item) => item.id === draft.contentItemId,
      );
      if (!plan) throw new Error(`Missing plan for ${draft.contentItemId}`);
      expect(validateContentDraft(draft, plan)).toEqual([]);
      expect(draft.sections.every((section) => section.content?.trim())).toBe(
        true,
      );
      expect(draft.claimIds.length).toBeGreaterThan(0);
      expect(draft.claimIds.every(canIncludeClaim)).toBe(true);
      expect(draft.publicationState).toBe('unpublished');
      expect(draft.reviewState).toBe('not-started');
    }
  });

  it('preserves the honey devash disclosure', () => {
    const honey = V3C15_WAVE2_DRAFTS.find(
      (draft) => draft.contentItemId === 'content-honey',
    );
    const copy = honey?.sections
      .map((section) => section.content ?? '')
      .join(' ');
    expect(copy).toContain('devash identification question remains active');
    expect(copy).toContain('does not resolve bee honey versus syrup');
    expect(honey?.disclosureQuestionIds).toContain(
      'question-honey-devash-translation',
    );
  });

  it('preserves the bounded barley interpretation', () => {
    const barley = V3C15_WAVE2_DRAFTS.find(
      (draft) => draft.contentItemId === 'content-barley',
    );
    const copy = barley?.sections
      .map((section) => section.content ?? '')
      .join(' ');
    expect(copy).toContain('does not reconstruct a universal biblical diet');
    expect(copy).toContain('dream report with symbolic interpretation');
  });

  it('records contextual relationships without changing canonical ownership', () => {
    expect(V3C15_INTERNAL_LINKS.barley).toContain('content-honey');
    expect(V3C15_INTERNAL_LINKS.honey).toContain('content-barley');
    expect(V3C15_INTERNAL_LINKS.barley).toContain('content-figs');
    expect(V3C15_INTERNAL_LINKS.honey).toContain('content-dates');
  });
});
