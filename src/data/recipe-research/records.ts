import { FOOD_UNIVERSE } from '../food-universe';
import type { RecipeResearchRecord } from './types';

const FOOD_EVIDENCE = Object.fromEntries(
  FOOD_UNIVERSE.map((food) => [food.id, food.evidence]),
);

/**
 * Small structural seed set only. These records deliberately remain
 * incomplete/non-public and make no claim that exact historical recipes are
 * known. V3C.18 may later produce public content only after real research.
 */
export const RECIPE_RESEARCH_RECORDS: readonly RecipeResearchRecord[] = [
  {
    id: 'recipe-lentil-pottage',
    name: 'Lentil pottage reconstruction',
    foodIds: ['lentils-entity'],
    historicalContext: 'Biblical lentil-pottage context',
    classification: 'historically-informed-reconstruction',
    evidence: [
      {
        layer: 'directly-attested',
        statement: 'Lentils belong to the existing Biblical Food Universe.',
      },
      {
        layer: 'unresolved',
        statement: 'Exact ingredients, proportions and preparation method are not established by this seed record.',
        disclosure: 'A reconstruction must not present these unknown details as historically verified.',
      },
    ],
    ingredients: [
      {
        foodId: 'lentils-entity',
        provenance: 'directly-attested',
      },
    ],
    researchStatus: 'in-progress',
    reconstructionStatus: 'in-progress',
    publicationStatus: 'not-eligible',
    unresolvedQuestions: [
      'Which ingredients beyond lentils can be supported by recorded research for this reconstruction?',
      'Which proportions and cooking method can be evidenced rather than practically adapted?',
    ],
    reconstructionDisclosure:
      'This is a historically informed reconstruction concept. Exact ingredients, proportions and preparation remain unresolved until supported by recorded research.',
    scriptureRelationship: 'Genesis 25 context requires source and wording verification before public recipe use.',
    foodEvidence: {
      'lentils-entity': FOOD_EVIDENCE['lentils-entity'],
    },
  },
  {
    id: 'recipe-unleavened-bread',
    name: 'Unleavened bread reconstruction',
    foodIds: ['unleavened-bread-entity'],
    historicalContext: 'Biblical unleavened-bread context',
    classification: 'historically-informed-reconstruction',
    evidence: [
      {
        layer: 'directly-attested',
        statement: 'Unleavened bread is represented in the existing Biblical Food Universe.',
      },
      {
        layer: 'unresolved',
        statement: 'The seed record does not establish one exact historical recipe, proportion or cooking method.',
        disclosure: 'Future practical choices must be disclosed rather than presented as directly attested.',
      },
    ],
    ingredients: [
      {
        foodId: 'unleavened-bread-entity',
        provenance: 'directly-attested',
      },
    ],
    researchStatus: 'in-progress',
    reconstructionStatus: 'not-started',
    publicationStatus: 'not-eligible',
    unresolvedQuestions: [
      'Which grain and flour choices are directly supported for the selected historical context?',
      'What cooking method can be evidenced for any later reconstruction?',
    ],
    reconstructionDisclosure:
      'This seed records the need for an evidence-aware reconstruction. It does not claim that one exact biblical recipe is known.',
    foodEvidence: {
      'unleavened-bread-entity': FOOD_EVIDENCE['unleavened-bread-entity'],
    },
  },
];
