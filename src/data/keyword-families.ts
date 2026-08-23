/**
 * KEYWORD FAMILY & CANNIBALIZATION MATRIX (V3B expansion)
 * =======================================================
 * Maps the search universe into keyword families. One family = one intent
 * territory with ONE canonical owner page. Phrases inside a family never
 * get their own competing pages merely because wording differs.
 *
 * STRATEGIC HYPOTHESIS NOTICE: family grouping is editorial judgment about
 * intent similarity, not a verified Google SERP fact, unless a note cites a
 * dated RESEARCH_LOG observation.
 */

export type FamilyPolicy = 'standard' | 'do-not-build';

export interface KeywordFamily {
  id: string;
  label: string;
  /** All mapped phrase variants for the family. */
  phrases: string[];
  /** The single target id that owns this family in search results. */
  canonicalOwner: string;
  /** Targets that belong to this family as future standalone pages. */
  memberTargets?: string[];
  /** Targets that support the family without owning its head phrases. */
  supportingTargets?: string[];
  /** Query variants intentionally NOT given pages (covered by sections). */
  sectionOnlyVariants?: string[];
  policy?: FamilyPolicy;
  rationale: string;
}

export const KEYWORD_FAMILIES: KeywordFamily[] = [
  {
    id: 'family-core-catalog',
    label: 'Core Biblical Food catalog',
    phrases: [
      'foods of the bible',
      'foods in the bible',
      'biblical foods',
      'biblical foods list',
      'food mentioned in the bible',
      'food in the bible',
      'what foods are mentioned in the bible',
      'how many foods are mentioned in the bible',
    ],
    canonicalOwner: 'foods-of-the-bible',
    memberTargets: ['fruits-of-the-bible', 'vegetables-of-the-bible'],
    supportingTargets: ['recipes-hub'],
    rationale:
      'Single catalog pillar owns all list-intent phrasing; count-questions answered as a section; fruit/vegetable category pages exist only because their list intent is produce-specific.',
  },
  {
    id: 'family-jesus-food',
    label: 'Jesus and food',
    phrases: [
      'what did jesus eat',
      'foods jesus ate',
      'what foods did jesus eat',
      'what did jesus eat in the bible',
      'did jesus eat meat',
      'did jesus eat fish',
      'did jesus eat bread',
    ],
    canonicalOwner: 'what-did-jesus-eat',
    memberTargets: [],
    supportingTargets: ['last-supper-foods'],
    sectionOnlyVariants: [
      'did jesus eat meat (pillar section - thin as standalone)',
      'did jesus eat fish (pillar section)',
      'did jesus eat bread (pillar section)',
      'what did jesus eat after the resurrection (pillar section)',
      'what did jesus drink (pillar section - beverages covered inside pillar)',
    ],
    rationale:
      'One tiered pillar per V3B strategy; sub-questions stay sections until independently verifiable depth exists.',
  },
  {
    id: 'family-daily-life',
    label: 'Food in biblical times',
    phrases: [
      'food in biblical times',
      'what did people eat in biblical times',
      'ancient israelite food',
      'ancient israelite diet',
      'food in ancient israel',
      'ancient jewish food',
    ],
    canonicalOwner: 'food-in-biblical-times',
    memberTargets: [],
    supportingTargets: ['bread-in-the-bible', 'wilderness-diet'],
    rationale:
      'Daily-life intent merged into one pillar to prevent cannibalizing the catalog pillar; "ancient jewish food" folded here pending a SERP check for distinct kosher-tradition intent.',
  },
  {
    id: 'family-fruits-category',
    label: 'Fruits category',
    phrases: ['fruits in the bible', 'what fruits are mentioned in the bible'],
    canonicalOwner: 'fruits-of-the-bible',
    rationale:
      'Produce-specific list intent distinct enough from the full catalog; deep-links into fruit profiles.',
  },
  {
    id: 'family-vegetables-category',
    label: 'Vegetables category',
    phrases: [
      'vegetables in the bible',
      'what vegetables are mentioned in the bible',
    ],
    canonicalOwner: 'vegetables-of-the-bible',
    rationale:
      'Same pattern as fruits; identification-debate items labeled via inventory evidence.',
  },
  {
    id: 'family-meat',
    label: 'Meat and eaten animals',
    phrases: ['meat in the bible', 'what animals were eaten in the bible'],
    canonicalOwner: 'meat-in-the-bible',
    supportingTargets: ['fish'],
    rationale:
      'One descriptive article absorbs both head and eaten-animals variants; clean/unclean theology explicitly excluded from this family.',
  },
  {
    id: 'family-bread',
    label: 'Bread',
    phrases: ['bread in the bible', 'daily bread meaning'],
    canonicalOwner: 'bread-in-the-bible',
    memberTargets: ['unleavened-bread'],
    supportingTargets: ['wheat', 'ezekiel-bread'],
    rationale:
      'Article owns meaning-intent; unleavened recipe owns cooking-intent variant so article and recipe do not compete on identical queries.',
  },
  {
    id: 'family-fish',
    label: 'Fish',
    phrases: ['fish in the bible', 'sea of galilee fish'],
    canonicalOwner: 'fish',
    rationale:
      'Ingredient profile owns the topic; loaves-and-fishes narratives covered there.',
  },
  {
    id: 'family-herbs-spices',
    label: 'Herbs and spices',
    phrases: [
      'herbs in the bible',
      'spices in the bible',
      'mint dill cumin bible',
    ],
    canonicalOwner: 'herbs-spices',
    rationale:
      'Existing overview-article target extended to own both herbs-only and spices-only phrasings; individual herb pages only where depth justifies.',
  },
  {
    id: 'family-manna-wilderness',
    label: 'Manna and wilderness food',
    phrases: [
      'what is manna in the bible',
      'manna from heaven meaning',
      'what did the israelites eat in the wilderness',
    ],
    canonicalOwner: 'what-is-manna',
    memberTargets: ['wilderness-diet'],
    rationale:
      'Manna article first; wilderness-diet sequenced after to avoid overlapping Exodus 16 coverage at launch.',
  },
  {
    id: 'family-seven-species',
    label: 'Seven foods of Deuteronomy 8',
    phrases: [
      'seven foods of the promised land',
      'seven species deuteronomy 8:8',
      'seven foods of the bible',
    ],
    canonicalOwner: 'seven-foods-deuteronomy-8',
    supportingTargets: [
      'figs',
      'olives',
      'dates',
      'honey',
      'barley',
      'wheat',
      'grapes',
      'pomegranate',
    ],
    rationale:
      'Single passage anchor; hub article links out to all seven profiles rather than fragmenting into seven competing lists.',
  },
  {
    id: 'family-salt',
    label: 'Salt',
    phrases: ['salt in the bible', 'covenant of salt'],
    canonicalOwner: 'salt',
    rationale:
      'Single ingredient topic; covenant-of-salt scholarship gates any publication.',
  },
  {
    id: 'family-john-baptist',
    label: "John the Baptist's diet",
    phrases: ['what did john the baptist eat', 'locusts and wild honey'],
    canonicalOwner: 'john-the-baptist-diet',
    rationale:
      'Distinct person + direct Gospel anchor; separate from the Jesus pillar by intent.',
  },
  {
    id: 'family-recipes',
    label: 'Recipe intent',
    phrases: [
      'biblical recipes',
      'recipes from the bible',
      'bible food recipes',
      'ezekiel bread bible',
      'ezekiel 4 9 bread recipe',
      'unleavened bread bible',
    ],
    canonicalOwner: 'recipes-hub',
    memberTargets: ['lentil-stew', 'ezekiel-bread', 'unleavened-bread'],
    supportingTargets: ['lentils'],
    rationale:
      'Hub owns generic recipe phrases; specific dishes own dish-specific phrases once published with tested content. Lentils profile supports the family through the lentil-stew bridge.',
  },
  {
    id: 'family-brand-nav',
    label: 'Brand navigation',
    phrases: ['biblicalmeal', 'biblical meal website'],
    canonicalOwner: 'homepage-brand',
    rationale:
      'Navigational queries land on the homepage; no SEO effort allocated.',
  },
  {
    id: 'family-diet-wellness',
    label: 'Biblical diet wellness (excluded by policy)',
    phrases: ['biblical diet', 'bible diet food list'],
    canonicalOwner: 'biblical-diet-wellness',
    policy: 'do-not-build',
    rationale:
      'Health-claim territory conflicts with honesty standards; documented so future keyword audits do not re-litigate it accidentally.',
  },
];
