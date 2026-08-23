import { describe, expect, it } from 'vitest';
import { FOOD_UNIVERSE } from '../data/food-universe';
import { validatePublication, type GateEntry } from './publication-gate';
import type { WorkflowStatus } from './workflow';

const APPROVED = 'approved' as WorkflowStatus;

const baseIngredient = {
  name: 'Figs',
  description:
    'Sweet orchard fruit repeatedly named across scripture and ancient agriculture.',
  category: 'fruit' as const,
  scriptureRefs: [{ book: 'Deuteronomy', chapter: 8, verseStart: 8 }],
  scriptureNote: 'Listed among the seven species of the Promised Land.',
  history: 'Attested in Iron Age archaeobotanical finds.',
};

function ingredient(
  overrides: Partial<GateEntry['data']> = {},
  workflowStatus: WorkflowStatus | undefined = APPROVED,
): GateEntry {
  return {
    collection: 'ingredients',
    id: 'figs',
    workflowStatus,
    data: { ...baseIngredient, ...overrides },
  };
}

const baseRecipe = {
  title: 'Lentil Stew',
  description:
    'A rustic slow-simmered lentil stew inspired by the ancient pantry.',
  inspiredNote:
    'Biblical-inspired modern tribute - not a reconstruction of any historical dish.',
  recipeType: 'inspired' as const,
  ingredients: [{ item: 'Lentils', quantity: '1 cup' }],
  instructions: ['Simmer until tender.'],
};

function recipe(
  overrides: Partial<GateEntry['data']> = {},
  workflowStatus: WorkflowStatus | undefined = APPROVED,
): GateEntry {
  return {
    collection: 'recipes',
    id: 'lentil-stew',
    workflowStatus,
    data: { ...baseRecipe, ...overrides },
  };
}

const baseArticle = {
  title: 'What Did Jesus Eat?',
  excerpt:
    'The Gospel evidence for the daily food of first-century Galilee, examined verse by verse.',
  category: 'passage' as const,
  pubDate: new Date('2026-09-01'),
  scriptureRefs: [{ book: 'Luke', chapter: 24, verseStart: 42 }],
  seoTargetId: 'what-did-jesus-eat',
};

function article(
  overrides: Partial<GateEntry['data']> = {},
  body = 'x '.repeat(150),
  workflowStatus: WorkflowStatus | undefined = APPROVED,
): GateEntry {
  return {
    collection: 'articles',
    id: 'what-did-jesus-eat',
    workflowStatus,
    data: { ...baseArticle, ...overrides },
    body,
  };
}

describe('publication gate - common rules', () => {
  it('blocks any entry whose workflow has not reached approved', () => {
    for (const status of [
      'research-needed',
      'draft',
      'editorial-review',
    ] as const) {
      const result = validatePublication(ingredient({}, status));
      expect(result.ready).toBe(false);
      expect(result.blockers.map((b) => b.code)).toContain(
        'workflow-not-approved',
      );
    }
  });

  it('accepts a fully prepared entry of each content type', () => {
    expect(validatePublication(ingredient()).ready).toBe(true);
    expect(validatePublication(recipe()).ready).toBe(true);
    expect(validatePublication(article()).ready).toBe(true);
  });

  it('rejects invalid route slugs', () => {
    const result = validatePublication({
      ...ingredient(),
      id: 'Figs!!',
    });
    expect(result.blockers.map((b) => b.code)).toContain('invalid-route-slug');
  });

  it('treats warnings as non-blocking information', () => {
    const warned = ingredient({ foodUniverseId: undefined });
    const result = validatePublication(warned);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.ready).toBe(true);
  });

  it('never lets a blocker hide behind warnings', () => {
    const result = validatePublication(
      ingredient({ history: 'Claim without research.' }, 'draft'),
    );
    expect(result.warnings.length + result.blockers.length).toBeGreaterThan(0);
    expect(result.ready).toBe(false);
  });
});

describe('publication gate - canonical ownership (V3B master map)', () => {
  it('blocks content claiming a not-pursuing target', () => {
    const result = validatePublication(
      article({ seoTargetId: 'wine-in-scripture' }),
    );
    expect(result.blockers.map((b) => b.code)).toContain(
      'canonical-target-not-pursuing',
    );
  });

  it('blocks unknown targets and mismatched routes', () => {
    const unknown = validatePublication(article({ seoTargetId: 'nope' }));
    expect(unknown.blockers.map((b) => b.code)).toContain(
      'canonical-target-invalid',
    );

    const wrongRoute = validatePublication({
      ...article(),
      id: 'wrong-slug',
    });
    expect(wrongRoute.blockers.map((b) => b.code)).toContain(
      'canonical-route-mismatch',
    );
  });
});

describe('publication gate - ingredient rules', () => {
  it('requires scripture citations with framing notes', () => {
    const noRefs = validatePublication(ingredient({ scriptureRefs: [] }));
    expect(noRefs.blockers.map((b) => b.code)).toContain(
      'missing-scripture-refs',
    );

    const unframed = validatePublication(ingredient({ scriptureNote: '' }));
    expect(unframed.blockers.map((b) => b.code)).toContain(
      'unframed-scripture-refs',
    );
  });

  it('blocks historical claims made before research completed', () => {
    const result = validatePublication(ingredient({}, 'research-in-progress'));
    expect(result.blockers.map((b) => b.code)).toContain(
      'historical-claims-before-research',
    );
  });

  it('links evidence uncertainty to the food universe instead of flattening it', () => {
    const uncertain = FOOD_UNIVERSE.find(
      (f) => f.evidence === 'uncertain-identification',
    );
    if (uncertain) {
      const result = validatePublication(
        ingredient({ foodUniverseId: uncertain.id }),
      );
      expect(result.warnings.map((w) => w.code)).toContain(
        'uncertain-evidence-on-page',
      );
    }

    const notPursuing = FOOD_UNIVERSE.find(
      (f) => f.classification === 'not-pursuing',
    );
    if (notPursuing) {
      const result = validatePublication(
        ingredient({ foodUniverseId: notPursuing.id }),
      );
      expect(result.blockers.map((b) => b.code)).toContain(
        'ingredient-entity-not-pursuing',
      );
    }
  });

  it('flags unknown universe links as blockers', () => {
    const result = validatePublication(
      ingredient({ foodUniverseId: 'unicorn' }),
    );
    expect(result.blockers.map((b) => b.code)).toContain(
      'universe-entity-invalid',
    );
  });
});

describe('publication gate - recipe honesty rules', () => {
  it('requires ingredients and instructions to exist', () => {
    const empty = validatePublication(
      recipe({ ingredients: [], instructions: [] }),
    );
    const codes = empty.blockers.map((b) => b.code);
    expect(codes).toContain('missing-ingredients');
    expect(codes).toContain('missing-instructions');
  });

  it('demands a cited research basis for historical classifications', () => {
    for (const recipeType of ['researched', 'reconstructed'] as const) {
      const result = validatePublication(
        recipe({ recipeType }, 'research-in-progress'),
      );
      const codes = result.blockers.map((b) => b.code);
      expect(codes).toContain('historical-recipe-without-basis');
      expect(codes).toContain('historical-recipe-before-research');
    }
    // Once research is complete, only the citation basis remains blocking.
    const researched = validatePublication(
      recipe({ recipeType: 'researched' }, 'editorial-review'),
    );
    const codes = researched.blockers.map((b) => b.code);
    expect(codes).not.toContain('historical-recipe-before-research');
    expect(codes).toContain('historical-recipe-without-basis');
  });

  it('lets an honest inspired recipe pass without scripture anchors', () => {
    const result = validatePublication(recipe({ scriptureRefs: [] }));
    expect(result.ready).toBe(true);
  });
});

describe('publication gate - article rules', () => {
  it('requires excerpt, date, real body text and scripture anchors', () => {
    const codes = validatePublication(
      article(
        { excerpt: '', pubDate: undefined, scriptureRefs: [] },
        'too short',
      ),
    ).blockers.map((b) => b.code);
    expect(codes).toContain('missing-excerpt');
    expect(codes).toContain('missing-pub-date');
    expect(codes).toContain('thin-body');
    expect(codes).toContain('missing-scripture-refs');
  });

  it('does not impose recipe-specific or ingredient-specific rules on articles', () => {
    const result = validatePublication(article());
    const codes = [...result.blockers, ...result.warnings].map((i) => i.code);
    expect(codes).not.toContain('missing-ingredients');
    expect(codes).not.toContain('unframed-scripture-refs');
  });
});

describe('publication gate - draft protection', () => {
  it('keeps pre-V3C drafts unpublishable (default workflow state)', () => {
    // An entry authored before V3C carries no workflowStatus at all.
    const legacyDraft: GateEntry = {
      collection: 'ingredients',
      id: 'figs',
      status: 'draft',
      data: { ...baseIngredient },
    };
    expect(validatePublication(legacyDraft).ready).toBe(false);
  });
});

describe('publication gate - research state consumption (V3C.2)', () => {
  it('is inert unless explicitly enabled', () => {
    const entry = ingredient({ researchSubjectId: 'unknown-subject' });
    expect(validatePublication(entry).blockers).toHaveLength(0);
  });

  it('rejects unknown research subjects', () => {
    const result = validatePublication(
      ingredient({ researchSubjectId: 'atlantis' }),
      { consumeResearchState: true },
    );
    expect(result.blockers.map((b) => b.code)).toContain(
      'research-subject-invalid',
    );
  });

  it('converts blocking questions into publication blockers', () => {
    const meatEntry: GateEntry = {
      collection: 'articles',
      id: 'meat-in-the-bible',
      workflowStatus: APPROVED,
      data: {
        title: 'Meat in the Bible',
        excerpt:
          'What the biblical text actually records about animal foods, carefully framed.',
        category: 'history',
        pubDate: new Date('2026-10-01'),
        scriptureRefs: [{ book: 'Genesis', chapter: 9, verseStart: 3 }],
        researchSubjectId: 'meat-in-the-bible',
      },
      body: 'x '.repeat(150),
    };
    const result = validatePublication(meatEntry, {
      consumeResearchState: true,
    });
    expect(
      result.blockers
        .map((b) => b.code)
        .some((c) => c.startsWith('unresolved-research-')),
    ).toBe(true);
    expect(result.ready).toBe(false);
  });

  it('converts warning-level questions into disclosures, not blockers', () => {
    const result = validatePublication(
      ingredient({ researchSubjectId: 'honey-entity' }),
      { consumeResearchState: true },
    );
    expect(result.warnings.map((w) => w.code)).toContain(
      'research-disclosure-question-honey-devash-translation',
    );
    expect(result.ready).toBe(true);
  });

  it('resolves dossier ids as well as raw subject ids', () => {
    for (const subject of ['dossier-honey', 'honey-entity']) {
      const result = validatePublication(
        ingredient({ researchSubjectId: subject }),
        { consumeResearchState: true },
      );
      expect(result.blockers.map((b) => b.code)).not.toContain(
        'research-subject-invalid',
      );
    }
  });
});
