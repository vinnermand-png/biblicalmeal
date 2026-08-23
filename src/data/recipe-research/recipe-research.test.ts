import { describe, expect, it } from 'vitest';
import { auditRecipeResearch, RECIPE_RESEARCH_AUDIT } from './audit';
import { RECIPE_RESEARCH_RECORDS } from './records';

describe('V3C.17 Recipe Research & Reconstruction System', () => {
  it('keeps canonical recipe identities unique and structurally valid', () => {
    expect(RECIPE_RESEARCH_AUDIT.recipeCount).toBe(
      RECIPE_RESEARCH_RECORDS.length,
    );
    expect(RECIPE_RESEARCH_AUDIT.issues).toEqual([]);
  });

  it('keeps historical authority and publication separate', () => {
    for (const record of RECIPE_RESEARCH_RECORDS) {
      expect(record.publicationStatus).toBe('not-eligible');
      expect(record.classification).not.toBe('historically-attested-preparation');
    }
  });

  it('keeps uncertainty visible instead of silently upgrading reconstruction choices', () => {
    for (const record of RECIPE_RESEARCH_RECORDS) {
      expect(record.evidence.some((entry) => entry.layer === 'unresolved')).toBe(
        true,
      );
      expect(record.unresolvedQuestions.length).toBeGreaterThan(0);
      expect(record.reconstructionDisclosure).not.toHaveLength(0);
    }
  });

  it('detects duplicate identity and invalid Food Universe references', () => {
    const [first] = RECIPE_RESEARCH_RECORDS;
    const broken = [
      first,
      {
        ...first,
        id: first.id,
        name: first.name.toUpperCase(),
        foodIds: ['invented-food'],
        ingredients: [
          {
            foodId: 'invented-food',
            provenance: 'directly-attested' as const,
          },
        ],
      },
    ];

    const issues = auditRecipeResearch(broken).issues.map((issue) => issue.code);
    expect(issues).toContain('duplicate-id');
    expect(issues).toContain('duplicate-name');
    expect(issues).toContain('invalid-food-reference');
  });

  it('rejects impossible readiness and publication lifecycle states', () => {
    const [first] = RECIPE_RESEARCH_RECORDS;
    const broken = {
      ...first,
      reconstructionStatus: 'ready' as const,
      publicationStatus: 'public' as const,
    };

    const issues = auditRecipeResearch([broken]).issues.map((issue) => issue.code);
    expect(issues).toContain('invalid-lifecycle');
    expect(issues).toContain('public-without-readiness');
  });
});
