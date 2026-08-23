import { describe, expect, it } from 'vitest';
import {
  INTERNAL_RECIPE_RESEARCH_FIXTURES,
  RECIPE_EVIDENCE_CLASSIFICATIONS,
  RECIPE_RECONSTRUCTION_STAGES,
  RECONSTRUCTION_CONFIDENCE_DEFINITIONS,
  validateRecipeResearchRecord,
  type RecipeResearchRecord,
} from './reconstruction';

describe('V3C.17 recipe research and reconstruction system', () => {
  const fixture = INTERNAL_RECIPE_RESEARCH_FIXTURES[0];

  it('keeps canonical IDs, evidence classifications and reconstruction stages explicit', () => {
    expect(fixture.id).toBeTruthy();
    expect(RECIPE_EVIDENCE_CLASSIFICATIONS).toContain('INFERENCE');
    expect(RECIPE_EVIDENCE_CLASSIFICATIONS).toContain('MODERN_ADAPTATION');
    expect(RECIPE_RECONSTRUCTION_STAGES).toContain('published');
  });

  it('documents confidence without false mathematical precision', () => {
    expect(RECONSTRUCTION_CONFIDENCE_DEFINITIONS.HIGH).toBeTruthy();
    expect(RECONSTRUCTION_CONFIDENCE_DEFINITIONS.SPECULATIVE).toMatch(/never/i);
  });

  it('validates the internal fixture against the canonical food universe', () => {
    expect(validateRecipeResearchRecord(fixture)).toEqual([]);
    expect(fixture.internalOnly).toBe(true);
    expect(fixture.publicationEligible).toBe(false);
  });

  it('rejects unknown canonical foods', () => {
    const invalid: RecipeResearchRecord = {
      ...fixture,
      canonicalFoodIds: ['not-a-canonical-food'],
    };
    expect(validateRecipeResearchRecord(invalid)).toContain(
      'Unknown canonical food ID: not-a-canonical-food.',
    );
  });

  it('prevents inference from masquerading as historical support', () => {
    const invalid: RecipeResearchRecord = {
      ...fixture,
      components: [
        {
          ...fixture.components[0],
          reconstructionStatus: 'historically-supported',
        },
      ],
    };
    expect(validateRecipeResearchRecord(invalid).join(' ')).toMatch(
      /cannot be historically-supported/i,
    );
  });

  it('requires disclosure when uncertainty or modern reconstruction exists', () => {
    const invalid: RecipeResearchRecord = {
      ...fixture,
      disclosure: { ...fixture.disclosure, required: false },
    };
    expect(validateRecipeResearchRecord(invalid)).toContain(
      'Disclosure is required when reconstruction uncertainty or adaptation exists.',
    );
  });

  it('blocks published state without the existing approved workflow gate', () => {
    const invalid: RecipeResearchRecord = {
      ...fixture,
      stage: 'published',
      workflowStatus: 'draft',
      internalOnly: false,
      publicationEligible: false,
    };
    const errors = validateRecipeResearchRecord(invalid).join(' ');
    expect(errors).toMatch(/publication eligibility/i);
    expect(errors).toMatch(/approved workflow gate/i);
  });

  it('keeps speculative fixtures from becoming publication eligible', () => {
    const invalid: RecipeResearchRecord = {
      ...fixture,
      publicationEligible: true,
    };
    expect(validateRecipeResearchRecord(invalid)).toContain(
      'Speculative reconstructions are not publication-eligible as historical recipes.',
    );
  });
});
