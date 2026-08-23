import { describe, expect, it } from 'vitest';
import { FIRST_WAVE_CONTENT_PLANS, PILOT_CONTENT_DRAFTS } from './plans';
import { PUBLIC_FOOD_CONTENT, PUBLIC_FOOD_DRAFTS } from './public';
import { canIncludeClaim, isContentPublicationEligible } from './validation';

describe('V3C.7 first public content release', () => {
  it('releases only the explicitly approved figs and dates targets', () => {
    expect(PUBLIC_FOOD_CONTENT.map((item) => item.canonicalTargetId)).toEqual([
      'figs',
      'dates',
    ]);
    expect(PUBLIC_FOOD_DRAFTS.map((item) => item.contentItemId)).toEqual([
      'content-figs',
      'content-dates',
    ]);
  });

  it('derives public editorial content from the V3C.6 source drafts', () => {
    for (const targetId of ['figs', 'dates']) {
      const source = PILOT_CONTENT_DRAFTS.find(
        (item) => item.id === `draft-${targetId}`,
      );
      const released = PUBLIC_FOOD_DRAFTS.find(
        (item) => item.id === `published-${targetId}`,
      );
      expect(source).toBeDefined();
      expect(released?.sections).toEqual(source?.sections);
      expect(released?.claimIds).toEqual(source?.claimIds);
      expect(released?.scriptureRefs).toEqual(source?.scriptureRefs);
    }
  });

  it('requires the canonical publication path and preserves publication gates', () => {
    for (const targetId of ['figs', 'dates']) {
      const plan = FIRST_WAVE_CONTENT_PLANS.find(
        (item) => item.canonicalTargetId === targetId,
      );
      const internal = PILOT_CONTENT_DRAFTS.find(
        (item) => item.id === `draft-${targetId}`,
      );
      const released = PUBLIC_FOOD_DRAFTS.find(
        (item) => item.id === `published-${targetId}`,
      );
      if (!plan || !internal || !released) throw new Error('release missing');
      expect(isContentPublicationEligible(plan, internal)).toBe(false);
      expect(isContentPublicationEligible(plan, released)).toBe(true);
      expect(internal.status).toBe('draft');
      expect(internal.publicationState).toBe('unpublished');
    }
  });

  it('keeps all public evidence claim IDs eligible', () => {
    expect(
      PUBLIC_FOOD_DRAFTS.every((draft) =>
        draft.claimIds.every(canIncludeClaim),
      ),
    ).toBe(true);
  });

  it('preserves public uncertainty boundaries and unique canonical routes', () => {
    const figs = PUBLIC_FOOD_CONTENT.find(
      (item) => item.canonicalTargetId === 'figs',
    );
    const dates = PUBLIC_FOOD_CONTENT.find(
      (item) => item.canonicalTargetId === 'dates',
    );
    const figCopy = figs?.sections.map((section) => section.content ?? '').join(' ');
    const dateCopy = dates?.sections.map((section) => section.content ?? '').join(' ');
    expect(figCopy).toContain('sycomore');
    expect(figCopy).toContain('separate research question');
    expect(dateCopy).toContain('Palm reference does not equal edible-date reference');
    expect(new Set(PUBLIC_FOOD_CONTENT.map((item) => item.canonicalPath)).size).toBe(
      PUBLIC_FOOD_CONTENT.length,
    );
  });

  it('does not release future first-wave drafts automatically', () => {
    const publicIds = new Set(
      PUBLIC_FOOD_CONTENT.map((item) => item.canonicalTargetId),
    );
    expect(publicIds.has('olives')).toBe(false);
    expect(publicIds.has('lentils')).toBe(false);
    expect(publicIds.has('barley')).toBe(false);
    expect(publicIds.has('honey')).toBe(false);
  });
});
