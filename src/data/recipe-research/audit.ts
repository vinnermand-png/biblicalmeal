import { FOOD_UNIVERSE } from '../food-universe';
import { RECIPE_RESEARCH_RECORDS } from './records';
import type {
  RecipeClassification,
  RecipeEvidenceLayer,
  RecipePublicationStatus,
  RecipeResearchRecord,
} from './types';

export type RecipeResearchAuditCode =
  | 'duplicate-id'
  | 'duplicate-name'
  | 'invalid-food-reference'
  | 'missing-evidence'
  | 'missing-reconstruction-disclosure'
  | 'missing-unresolved-disclosure'
  | 'invalid-lifecycle'
  | 'public-without-readiness';

export interface RecipeResearchAuditIssue {
  code: RecipeResearchAuditCode;
  recipeId: string;
  message: string;
}

export interface RecipeResearchAudit {
  recipeCount: number;
  issues: RecipeResearchAuditIssue[];
}

const CLASSIFICATIONS: readonly RecipeClassification[] = [
  'historically-attested-preparation',
  'historically-informed-reconstruction',
  'scripture-inspired-preparation',
  'modern-adaptation',
];

const EVIDENCE_LAYERS: readonly RecipeEvidenceLayer[] = [
  'directly-attested',
  'inferred',
  'practical-adaptation',
  'unresolved',
];

const PUBLICATION_STATUSES: readonly RecipePublicationStatus[] = [
  'not-eligible',
  'eligible',
  'public',
];

export function auditRecipeResearch(
  records: readonly RecipeResearchRecord[] = RECIPE_RESEARCH_RECORDS,
): RecipeResearchAudit {
  const foodIds = new Set(FOOD_UNIVERSE.map((food) => food.id));
  const ids = new Set<string>();
  const names = new Set<string>();
  const issues: RecipeResearchAuditIssue[] = [];

  for (const record of records) {
    if (ids.has(record.id)) {
      issues.push({
        code: 'duplicate-id',
        recipeId: record.id,
        message: `Duplicate recipe research id: ${record.id}`,
      });
    }
    ids.add(record.id);

    const normalizedName = record.name.trim().toLowerCase();
    if (names.has(normalizedName)) {
      issues.push({
        code: 'duplicate-name',
        recipeId: record.id,
        message: `Duplicate recipe research name: ${record.name}`,
      });
    }
    names.add(normalizedName);

    if (!CLASSIFICATIONS.includes(record.classification)) {
      issues.push({
        code: 'missing-evidence',
        recipeId: record.id,
        message: `Unknown recipe classification: ${record.classification}`,
      });
    }

    if (!PUBLICATION_STATUSES.includes(record.publicationStatus)) {
      issues.push({
        code: 'invalid-lifecycle',
        recipeId: record.id,
        message: `Unknown recipe publication status: ${record.publicationStatus}`,
      });
    }

    if (record.foodIds.length === 0 || record.evidence.length === 0) {
      issues.push({
        code: 'missing-evidence',
        recipeId: record.id,
        message: 'Recipe research record must declare foods and evidence.',
      });
    }

    for (const foodId of [
      ...record.foodIds,
      ...record.ingredients.map((ingredient) => ingredient.foodId),
    ]) {
      if (!foodIds.has(foodId)) {
        issues.push({
          code: 'invalid-food-reference',
          recipeId: record.id,
          message: `Unknown Food Universe id: ${foodId}`,
        });
      }
    }

    const hasInvalidEvidenceLayer = record.evidence.some(
      (entry) => !EVIDENCE_LAYERS.includes(entry.layer),
    );
    if (hasInvalidEvidenceLayer) {
      issues.push({
        code: 'missing-evidence',
        recipeId: record.id,
        message: 'Recipe research record contains an unknown evidence layer.',
      });
    }

    if (!record.reconstructionDisclosure.trim()) {
      issues.push({
        code: 'missing-reconstruction-disclosure',
        recipeId: record.id,
        message: 'Recipe reconstruction requires an explicit disclosure.',
      });
    }

    const hasUnresolved = record.evidence.some(
      (entry) => entry.layer === 'unresolved',
    );
    if (hasUnresolved && record.unresolvedQuestions.length === 0) {
      issues.push({
        code: 'missing-unresolved-disclosure',
        recipeId: record.id,
        message:
          'Unresolved evidence must remain visible through unresolved questions.',
      });
    }

    if (
      record.researchStatus !== 'complete' &&
      record.reconstructionStatus === 'ready'
    ) {
      issues.push({
        code: 'invalid-lifecycle',
        recipeId: record.id,
        message: 'Reconstruction cannot be ready before research is complete.',
      });
    }

    if (
      record.publicationStatus !== 'not-eligible' &&
      (record.researchStatus !== 'complete' ||
        record.reconstructionStatus !== 'ready')
    ) {
      issues.push({
        code: 'public-without-readiness',
        recipeId: record.id,
        message:
          'Publication eligibility requires complete research and a ready reconstruction.',
      });
    }
  }

  return { recipeCount: records.length, issues };
}

export const RECIPE_RESEARCH_AUDIT = auditRecipeResearch();
