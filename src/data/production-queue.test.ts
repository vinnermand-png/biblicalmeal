import { describe, expect, it } from 'vitest';
import { CONTENT_BRIEFS } from './content-briefs';
import {
  FIRST_WAVE_TARGET_IDS,
  buildProductionQueue,
  summarizeQueue,
} from './production-queue';
import { SEO_TARGETS } from './seo-master-map';
import type { WorkflowStatus } from '../lib/workflow';

describe('production queue derivation', () => {
  const queue = buildProductionQueue();

  it('contains every pursuing target exactly once', () => {
    const pursuing = SEO_TARGETS.filter((t) => t.status !== 'not-pursuing');
    expect(queue).toHaveLength(pursuing.length);
    const ids = queue.map((q) => q.targetId);
    expect(new Set(ids).size).toBe(ids.length);
    for (const target of pursuing) {
      expect(ids).toContain(target.id);
    }
  });

  it('never admits not-pursuing targets', () => {
    const ids = queue.map((q) => q.targetId);
    for (const excluded of SEO_TARGETS.filter(
      (t) => t.status === 'not-pursuing',
    )) {
      expect(ids).not.toContain(excluded.id);
    }
    expect(ids).not.toContain('wine-in-scripture');
    expect(ids).not.toContain('clean-unclean-foods');
    expect(ids).not.toContain('biblical-diet-wellness');
  });

  it('routes and types always come from the master map verbatim', () => {
    for (const item of queue) {
      const target = SEO_TARGETS.find((t) => t.id === item.targetId);
      expect(target).toBeDefined();
      expect(item.canonicalRoute).toBe(target?.targetRoute);
      expect(item.contentType).toBe(target?.contentType);
      expect(item.evidenceLevel).toBe(target?.evidenceLevel);
    }
  });

  it('defaults workflow state to research-needed (nothing assumed done)', () => {
    for (const item of queue) {
      expect(item.workflowStatus).toBe<WorkflowStatus>('research-needed');
    }
  });

  it('respects injected workflow state', () => {
    const state = { figs: 'research-complete', barley: 'draft' } as const;
    const injected = buildProductionQueue(state);
    expect(injected.find((i) => i.targetId === 'figs')?.workflowStatus).toBe(
      'research-complete',
    );
    expect(injected.find((i) => i.targetId === 'barley')?.workflowStatus).toBe(
      'draft',
    );
  });
});

describe('production queue - first wave', () => {
  const queue = buildProductionQueue();

  it('resolves every first-wave id to a real queue entry', () => {
    expect(FIRST_WAVE_TARGET_IDS).toHaveLength(9);
    for (const id of FIRST_WAVE_TARGET_IDS) {
      const item = queue.find((q) => q.targetId === id);
      expect(item, `${id} must exist in the SEO master map`).toBeDefined();
      expect(item?.firstWave).toBe(true);
    }
  });

  it('sorts the first wave ahead of everything else', () => {
    const firstNonWave = queue.findIndex((q) => !q.firstWave);
    expect(firstNonWave).toBeGreaterThan(0);
    for (let i = 0; i < firstNonWave; i++) {
      expect(queue[i].firstWave).toBe(true);
    }
  });

  it('keeps the six core foods as ingredient targets on canonical routes', () => {
    for (const id of [
      'figs',
      'olives',
      'lentils',
      'dates',
      'honey',
      'barley',
    ]) {
      const item = queue.find((q) => q.targetId === id);
      expect(item?.contentType).toBe('ingredient');
      expect(item?.canonicalRoute).toBe(
        ['figs', 'dates'].includes(id)
          ? `/foods/${id}/`
          : `/ingredients/${id}/`,
      );
    }
  });
});

describe('production queue - blockers', () => {
  it('gates pillar/article targets behind approved briefs', () => {
    for (const item of buildProductionQueue()) {
      if (!['pillar', 'hub', 'article'].includes(item.contentType)) continue;
      const codes = item.blockers.map((b) => b.code);
      const briefGate =
        codes.includes('brief-not-created') ||
        codes.includes('brief-not-approved');
      const clearedByApprovedBrief =
        item.briefStatus === 'approved' &&
        !codes.some((c) => c.startsWith('brief-'));
      expect(
        briefGate || clearedByApprovedBrief,
        `${item.targetId} must be brief-gated or carry an approved brief`,
      ).toBe(true);
    }
  });

  it('derives the theological review gate from the research layer', () => {
    const meat = buildProductionQueue().find(
      (q) => q.targetId === 'meat-in-the-bible',
    );
    expect(meat?.blockers.map((b) => b.code)).toContain(
      'research-theological-review',
    );
  });

  it('surfaces warning-level research findings without blocking', () => {
    const honey = buildProductionQueue().find((q) => q.targetId === 'honey');
    expect(honey?.researchWarnings.map((w) => w.code)).toContain(
      'research-translation-ambiguity',
    );
    expect(honey?.blockers).toHaveLength(0);
  });

  it('never marks a blocked item as publishable', () => {
    const queue = buildProductionQueue();
    for (const item of queue) {
      if (item.blockers.length > 0 && item.workflowStatus === 'approved') {
        expect(item.nextAction).toMatch(/Resolve blocker/);
      }
    }
    // A clean approved item reaches the publish action...
    const figs = buildProductionQueue({ figs: 'approved' }).find(
      (q) => q.targetId === 'figs',
    );
    expect(figs?.blockers).toHaveLength(0);
    expect(figs?.nextAction).toBe('Publish (publication gate must pass)');
    // ...while the meat target stays gated regardless of workflow state.
    const meat = buildProductionQueue({
      'meat-in-the-bible': 'approved',
    }).find((q) => q.targetId === 'meat-in-the-bible');
    expect(meat?.blockers.length).toBeGreaterThan(0);
  });

  it('summarizes into workflow counts that add up', () => {
    const queue = buildProductionQueue();
    const summary = summarizeQueue(queue);
    const total = Object.values(summary).reduce((a, b) => a + b, 0);
    expect(total).toBe(queue.length);
    expect(summary['research-needed']).toBe(queue.length);
  });

  it('keeps brief linkage consistent with the brief registry', () => {
    for (const item of buildProductionQueue()) {
      const brief = CONTENT_BRIEFS.find((b) => b.targetId === item.targetId);
      expect(item.briefStatus).toBe(brief ? brief.status : null);
    }
  });

  it('surfaces content planning without implying publication readiness', () => {
    const items = buildProductionQueue();
    expect(
      items.find((item) => item.targetId === 'figs')?.contentPlanStatus,
    ).toBe('draft-available');
    expect(
      items.find((item) => item.targetId === 'dates')?.contentPlanStatus,
    ).toBe('draft-available');
    expect(
      items.find((item) => item.targetId === 'barley')?.contentPlanStatus,
    ).toBe('draft-available');
    expect(
      items.find((item) => item.targetId === 'meat-in-the-bible')
        ?.contentPlanStatus,
    ).toBe('not-planned');
  });
});
