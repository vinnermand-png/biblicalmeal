/**
 * BIBLICAL FOOD UNIVERSE INVENTORY (V3B expansion)
 * ================================================
 * Structured editorial inventory of Biblical food-related entities.
 * This is NOT a list of pages - each entity carries a classification
 * that decides whether it ever becomes one, and an evidence status
 * for how well its identification is supported.
 *
 * Honesty rules:
 * - Evidence labels are conservative; "requires-verification" is the default
 *   whenever a passage or identification has not been checked in sources.
 * - Ritual/liturgical substances are inventoried but classified not-pursuing
 *   as ordinary food topics.
 */

export type FoodCategory =
  | 'grains-staples'
  | 'fruits-plants'
  | 'legumes-vegetables'
  | 'herbs-spices'
  | 'animal-foods'
  | 'sweet-foods'
  | 'dairy'
  | 'oils'
  | 'flavourings-other'
  | 'beverages'
  | 'ritual-non-food';

export type InventoryClassification =
  | 'direct-page-candidate'
  | 'supporting-topic'
  | 'merge-into-broader-page'
  | 'research-first'
  | 'not-pursuing';

export type FoodEvidenceStatus =
  | 'directly-attested'
  | 'historically-plausible'
  | 'uncertain-identification'
  | 'requires-verification';

export interface FoodEntity {
  id: string;
  name: string;
  category: FoodCategory;
  classification: InventoryClassification;
  evidence: FoodEvidenceStatus;
  /** Merges point at the owning page/target; merges use target ids where they exist. */
  mergeInto?: string;
  note: string;
}

const PLANT_ENTITIES: FoodEntity[] = [
  {
    id: 'barley',
    name: 'Barley',
    category: 'grains-staples',
    classification: 'direct-page-candidate',
    evidence: 'directly-attested',
    note: 'Ingredient profile already planned in master map.',
  },
  {
    id: 'wheat',
    name: 'Wheat',
    category: 'grains-staples',
    classification: 'direct-page-candidate',
    evidence: 'directly-attested',
    note: 'Seven-species member; profile planned.',
  },
  {
    id: 'spelt',
    name: 'Spelt',
    category: 'grains-staples',
    classification: 'supporting-topic',
    evidence: 'requires-verification',
    note: 'Named among plague-affected grains in tradition; verify exact passages before any claim.',
  },
  {
    id: 'millet',
    name: 'Millet',
    category: 'grains-staples',
    classification: 'supporting-topic',
    evidence: 'requires-verification',
    note: 'Include only where evidence supports; verify Ezekiel-style grain lists wording first.',
  },
  {
    id: 'bread-entity',
    name: 'Bread (topic)',
    category: 'grains-staples',
    classification: 'merge-into-broader-page',
    mergeInto: 'bread-in-the-bible',
    evidence: 'directly-attested',
    note: 'Owned by the bread article, not a duplicate ingredient page.',
  },
  {
    id: 'unleavened-bread-entity',
    name: 'Unleavened bread (topic)',
    category: 'grains-staples',
    classification: 'merge-into-broader-page',
    mergeInto: 'unleavened-bread',
    evidence: 'directly-attested',
    note: 'Recipe target owns cooking intent; article covers meaning.',
  },
  {
    id: 'flour',
    name: 'Flour / meal',
    category: 'grains-staples',
    classification: 'supporting-topic',
    evidence: 'historically-plausible',
    note: 'Supports grain and bread pages; never standalone.',
  },
  {
    id: 'roasted-grain',
    name: 'Roasted grain',
    category: 'grains-staples',
    classification: 'supporting-topic',
    evidence: 'requires-verification',
    note: 'Verify narrative passages during research pass before citing.',
  },
  {
    id: 'grapes',
    name: 'Grapes',
    category: 'fruits-plants',
    classification: 'direct-page-candidate',
    evidence: 'directly-attested',
    note: 'Profile planned; wine theology excluded from the page.',
  },
  {
    id: 'figs-entity',
    name: 'Figs',
    category: 'fruits-plants',
    classification: 'direct-page-candidate',
    evidence: 'directly-attested',
    note: 'Existing draft profile.',
  },
  {
    id: 'sycamore-figs',
    name: 'Sycamore figs',
    category: 'fruits-plants',
    classification: 'research-first',
    evidence: 'historically-plausible',
    note: 'Distinct tree from the common fig; needs its own sourcing pass.',
  },
  {
    id: 'pomegranates',
    name: 'Pomegranates',
    category: 'fruits-plants',
    classification: 'direct-page-candidate',
    evidence: 'directly-attested',
    note: 'Profile planned; temple imagery handled carefully.',
  },
  {
    id: 'dates-entity',
    name: 'Dates',
    category: 'fruits-plants',
    classification: 'direct-page-candidate',
    evidence: 'directly-attested',
    note: 'Existing draft; date-honey nuance to be verified.',
  },
  {
    id: 'olives-entity',
    name: 'Olives',
    category: 'fruits-plants',
    classification: 'direct-page-candidate',
    evidence: 'directly-attested',
    note: 'Existing draft; oil covered inside profile initially.',
  },
  {
    id: 'apples',
    name: 'Apples',
    category: 'fruits-plants',
    classification: 'research-first',
    evidence: 'uncertain-identification',
    note: 'Hebrew word identification is genuinely debated; only cover if supportable.',
  },
  {
    id: 'lentils-entity',
    name: 'Lentils',
    category: 'legumes-vegetables',
    classification: 'direct-page-candidate',
    evidence: 'directly-attested',
    note: 'Existing draft; Genesis pottage details must stay verified.',
  },
  {
    id: 'beans',
    name: 'Beans',
    category: 'legumes-vegetables',
    classification: 'supporting-topic',
    evidence: 'requires-verification',
    note: 'Verify ingredient-list passages before inclusion claims.',
  },
  {
    id: 'cucumbers',
    name: 'Cucumbers',
    category: 'legumes-vegetables',
    classification: 'supporting-topic',
    evidence: 'requires-verification',
    note: 'Wilderness-tradition produce list; verify wording.',
  },
  {
    id: 'melons',
    name: 'Melons',
    category: 'legumes-vegetables',
    classification: 'supporting-topic',
    evidence: 'uncertain-identification',
    note: 'Identification debated; label clearly if ever covered.',
  },
  {
    id: 'onions',
    name: 'Onions',
    category: 'legumes-vegetables',
    classification: 'supporting-topic',
    evidence: 'requires-verification',
    note: 'Same wilderness list as cucumbers; verify together.',
  },
  {
    id: 'garlic',
    name: 'Garlic',
    category: 'legumes-vegetables',
    classification: 'supporting-topic',
    evidence: 'requires-verification',
    note: 'Same wilderness list; verify together.',
  },
  {
    id: 'leeks',
    name: 'Leeks',
    category: 'legumes-vegetables',
    classification: 'supporting-topic',
    evidence: 'requires-verification',
    note: 'Same wilderness list; verify together.',
  },
  {
    id: 'bitter-herbs',
    name: 'Bitter herbs',
    category: 'legumes-vegetables',
    classification: 'research-first',
    evidence: 'requires-verification',
    note: 'Passover context demands careful, sourced treatment.',
  },
  {
    id: 'mint',
    name: 'Mint',
    category: 'herbs-spices',
    classification: 'supporting-topic',
    evidence: 'requires-verification',
    note: 'Verify Gospel tithe-passage wording before citing.',
  },
  {
    id: 'dill',
    name: 'Dill',
    category: 'herbs-spices',
    classification: 'supporting-topic',
    evidence: 'requires-verification',
    note: 'Translation varies (dill/cumin/anise); verify.',
  },
  {
    id: 'cumin',
    name: 'Cumin',
    category: 'herbs-spices',
    classification: 'supporting-topic',
    evidence: 'requires-verification',
    note: 'Verify passages; possible future herb overview member.',
  },
  {
    id: 'coriander',
    name: 'Coriander',
    category: 'herbs-spices',
    classification: 'supporting-topic',
    evidence: 'requires-verification',
    note: 'Appears in manna-description tradition; verify wording.',
  },
  {
    id: 'hyssop',
    name: 'Hyssop',
    category: 'herbs-spices',
    classification: 'research-first',
    evidence: 'uncertain-identification',
    note: 'Plant identity genuinely uncertain; ritual uses dominate.',
  },
  {
    id: 'mustard-seed',
    name: 'Mustard',
    category: 'herbs-spices',
    classification: 'research-first',
    evidence: 'requires-verification',
    note: 'Terminology and usage require verification; parable context sensitive.',
  },
];

export { PLANT_ENTITIES };

import { ANIMAL_OTHER_ENTITIES } from './food-universe.animal-other';

/** The complete inventory: plant-based + animal/other entities. */
export const FOOD_UNIVERSE: FoodEntity[] = [
  ...PLANT_ENTITIES,
  ...ANIMAL_OTHER_ENTITIES,
];

export const FOOD_CATEGORIES: { id: FoodCategory; label: string }[] = [
  { id: 'grains-staples', label: 'Grains and Staples' },
  { id: 'fruits-plants', label: 'Fruits and Plants' },
  { id: 'legumes-vegetables', label: 'Legumes and Vegetables' },
  { id: 'herbs-spices', label: 'Herbs and Spices' },
  { id: 'animal-foods', label: 'Animal Foods' },
  { id: 'sweet-foods', label: 'Sweet Foods' },
  { id: 'dairy', label: 'Dairy' },
  { id: 'oils', label: 'Oils' },
  { id: 'flavourings-other', label: 'Flavourings and Other Substances' },
  { id: 'beverages', label: 'Beverages' },
  { id: 'ritual-non-food', label: 'Ritual / Non-Food Substances' },
];
