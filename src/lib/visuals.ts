/**
 * Central registry for the BiblicalMeal original illustration system and
 * optional premium ingredient image assets.
 *
 * Every visual on the site keeps a semantic `ArtKind` fallback. When a
 * premium ingredient asset exists, the ingredient card can use it without
 * changing the ingredient data model or component architecture.
 */

export const ART_KINDS = [
  'figs',
  'olives',
  'lentils',
  'dates',
  'honey',
  'barley',
  'stew',
  'still-life',
  'israel',
  'galilee',
  'judea',
  'mediterranean',
] as const;

export type ArtKind = (typeof ART_KINDS)[number];

export interface ArtDefinition {
  /** Two-stop warm backdrop gradient (top-left → bottom-right). */
  backdrop: [string, string];
  /** Accessible description of the scene. */
  label: string;
}

export const ART_REGISTRY: Record<ArtKind, ArtDefinition> = {
  figs: {
    backdrop: ['#e2d2b8', '#c9b492'],
    label: 'Illustration of whole and cut figs on a warm stone surface',
  },
  olives: {
    backdrop: ['#dde0c3', '#b9c29a'],
    label: 'Illustration of an olive branch with green and dark olives',
  },
  lentils: {
    backdrop: ['#decba4', '#c6ad7c'],
    label: 'Illustration of a mound of lentils spilling onto linen',
  },
  dates: {
    backdrop: ['#d9b98c', '#bd9260'],
    label: 'Illustration of three dates beneath a palm frond',
  },
  honey: {
    backdrop: ['#ebd08a', '#d2a94e'],
    label:
      'Illustration of golden honey in a ceramic bowl with a dripping dipper',
  },
  barley: {
    backdrop: ['#e4d2a0', '#cbae72'],
    label: 'Illustration of barley stalks against dry Mediterranean light',
  },
  stew: {
    backdrop: ['#c89a6b', '#a5713f'],
    label:
      'Illustration of a rustic lentil stew in a terracotta bowl, steaming',
  },
  'still-life': {
    backdrop: ['#eddfbf', '#d8c298'],
    label:
      'Editorial still-life illustration with bread, figs, olives, a ceramic jug and linen in warm sunlight',
  },
  israel: {
    backdrop: ['#e6d6ae', '#cdb684'],
    label:
      'Illustration of the terraced hills of ancient Israel at golden hour',
  },
  galilee: {
    backdrop: ['#cbd4c9', '#9fb3a8'],
    label: 'Illustration of the Sea of Galilee framed by quiet hills',
  },
  judea: {
    backdrop: ['#e0cda0', '#c4a96f'],
    label: 'Illustration of terraced fields in the Judean highlands',
  },
  mediterranean: {
    backdrop: ['#c2d3d6', '#93aeb5'],
    label: 'Illustration of the Mediterranean sea under soft sunlight',
  },
};

/** Homepage ingredient slugs mapped to their illustration fallbacks. */
export const INGREDIENT_ART: Record<string, ArtKind> = {
  figs: 'figs',
  olives: 'olives',
  lentils: 'lentils',
  dates: 'dates',
  honey: 'honey',
  barley: 'barley',
};

/**
 * Optional premium ingredient image IDs.
 *
 * These IDs intentionally remain asset-only references. Until a finished
 * image is added to the editorial image registry, the component falls back
 * to the existing semantic illustration above.
 */
export const INGREDIENT_PREMIUM_IMAGE_IDS: Record<string, string> = {
  figs: 'ingredient-portrait-figs',
  olives: 'ingredient-portrait-olives',
  barley: 'ingredient-portrait-barley',
  lentils: 'ingredient-portrait-lentils',
  dates: 'ingredient-portrait-dates',
  honey: 'ingredient-portrait-honey',
  pomegranates: 'ingredient-portrait-pomegranates',
};
