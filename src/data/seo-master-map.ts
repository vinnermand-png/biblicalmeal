/**
 * BIBLICALMEAL SEO MASTER MAP (V3B)
 * =================================
 * Single source of truth for search strategy: topic clusters, keyword targets,
 * pillar pages, internal-linking paths, and the production roadmap.
 *
 * EVIDENCE DISCIPLINE - read before editing:
 * - `evidenceLevel: 'serp-observed'` marks claims grounded in real, dated
 *   SERP observations recorded in RESEARCH_LOG below.
 * - `evidenceLevel: 'hypothesis'` marks strategic reasoning only.
 * - NO search volumes, difficulty scores, or ranking claims exist anywhere in
 *   this file. Do not add any without verifiable tooling data.
 *
 * Consume this map via the internal /seo-map/ route and the integrity tests
 * in seo-master-map.test.ts.
 */

export type SeoIntent = 'informational' | 'navigational';

export type TargetStatus =
  | 'published'
  | 'in-development'
  | 'brief-ready'
  | 'planned'
  | 'research-first'
  | 'not-pursuing';

export type Priority = 'high' | 'medium' | 'low';

export type ContentType =
  'pillar' | 'hub' | 'ingredient' | 'recipe' | 'article' | 'homepage';

export type EvidenceLevel = 'serp-observed' | 'hypothesis';

export type ClusterId =
  | 'core-bible-food'
  | 'ingredients'
  | 'jesus-and-food'
  | 'food-in-biblical-times'
  | 'biblical-recipes'
  | 'bible-questions';

export interface SeoCluster {
  id: ClusterId;
  name: string;
  description: string;
  /** Dated SERP observation - verified qualitative evidence, not metrics. */
  serpObservation: string;
  strategySummary: string;
}

export interface SeoTarget {
  id: string;
  topic: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  intent: SeoIntent;
  contentType: ContentType;
  targetRoute: string;
  status: TargetStatus;
  priority: Priority;
  cluster: ClusterId;
  parentTopic?: string;
  relatedTopics: string[];
  existingContent?: string;
  researchRequired: string[];
  evidenceLevel: EvidenceLevel;
  notes: string;
}

export const SEO_CLUSTERS: SeoCluster[] = [
  {
    id: 'core-bible-food',
    name: 'Core Bible Food',
    description:
      'The head topics: what foods the Bible mentions and what people ate.',
    serpObservation:
      '2026-08-23 web-search observation for "foods of the bible": dominated by list-format articles with scripture references (learnreligions.com, biblehub.com topical lists, churchequips.com KJV guide) plus "bible diet" wellness sites. A dedicated niche competitor domain exists (biblical.recipes). Quality is mixed; few entries combine sourced history with modern cooking.',
    strategySummary:
      'One authoritative catalog pillar (/foods-of-the-bible/) absorbs the list-intent keyword family, cross-linked to every ingredient profile. BiblicalMeal differentiates on verification and culinary usefulness, not list length.',
  },
  {
    id: 'ingredients',
    name: 'Biblical Ingredients',
    description:
      'Individual food profiles under /ingredients/[slug]/ - the evergreen core of the site.',
    serpObservation:
      '2026-08-23 observation: ingredient-level queries ("[food] in the bible") are served by general Christian encyclopedias and diet sites rather than dedicated food-editorial pages; Deuteronomy 8:8 "seven species" framing recurs across competitors.',
    strategySummary:
      'Complete seven-species-adjacent profiles first (figs, olives, dates, honey, barley, plus wheat), then lentils (Genesis 25 pottage anchor). Each profile owns its "[food] in the Bible" family; no separate pages per verse.',
  },
  {
    id: 'jesus-and-food',
    name: 'Jesus & Food',
    description:
      'High-sensitivity questions about first-century Galilean food culture and Gospel meals.',
    serpObservation:
      '2026-08-23 observation for "what did Jesus eat": crowded field of moderate-depth Christian content sites (faithward.org cites scholarly sources incl. JSTOR), one strong food-media entry built on a historian interview (tastingtable.com), wellness angles, and biblical.recipes again. Consensus pattern: hedged "likely ate" language around bread, fish, legumes, olive oil; vegetarian-question FAQs common. christianityfaq.com states Luke 24:42-43 is the only explicit reference to Jesus eating - flagged for our own verification, NOT adopted as fact.',
    strategySummary:
      'ONE rigorously tiered pillar article ("What Did Jesus Eat?") with mandatory DIRECTLY ATTESTED / HISTORICALLY PLAUSIBLE / SPECULATIVE labeling. Sub-questions (Last Supper, post-resurrection meals) remain sections inside the pillar until each can stand alone with verified depth. Theological care outranks ranking.',
  },
  {
    id: 'food-in-biblical-times',
    name: 'Food in Biblical Times',
    description:
      'Daily-diet lifestyle queries distinct from catalog intent: meals, staples, daily life.',
    serpObservation:
      '2026-08-23 observation: thin blogs and topical encyclopedias; a key scholarly anchor exists (Nathan MacDonald, "What Did the Ancient Israelites Eat?: Diet in Biblical Times", Eerdmans 2008); a May 2026 NYT piece on the social-media "biblical diet" trend signals ongoing cultural interest. Deuteronomy 8:8 species lists recur here too.',
    strategySummary:
      'One daily-life pillar (/food-in-biblical-times/), deliberately separate from the catalog pillar because intent differs (how people ate vs. what foods existed). Cross-link both to consolidate authority without cannibalization.',
  },
  {
    id: 'biblical-recipes',
    name: 'Biblical Recipes',
    description: 'Recipe intent: people who want to cook, not just read.',
    serpObservation:
      '2026-08-23 observation: dedicated competitor biblical.recipes ranks across clusters; devotional story-based cooking sites exist (thebiblecookbook.com explicitly labels its recipes modern creations); wellness hubs cover Ezekiel bread and unleavened bread; low-effort listicles common. The published book "Cooking with the Bible" (Chiffolo & Hesse) models honest modern-recreation framing.',
    strategySummary:
      '/recipes/ becomes the canonical hub once it holds several tested recipes. Every recipe keeps its recipeType label (inspired/researched/reconstructed). Ezekiel bread and unleavened bread are high-interest but research-first - never presented as ancient recipes without cited evidence.',
  },
  {
    id: 'bible-questions',
    name: 'Specific Bible Food Questions',
    description:
      'Single-intent question pages, each individually justified - never created merely because a query exists.',
    serpObservation:
      '2026-08-23 observation: question-style results (manna, seven foods, John the Baptist diet) surface inside general lists and encyclopedia entries; few dedicated, deeply sourced answers observed. Opportunity exists ONLY where enough material can be verified.',
    strategySummary:
      'Each candidate earns its own page only after its brief passes fact-verification; otherwise it stays a section inside an existing pillar. Clean/unclean-foods theology is explicitly deprioritized out of respect for its complexity.',
  },
];

export const SEO_TARGETS: SeoTarget[] = [
  {
    id: 'foods-of-the-bible',
    topic: 'Foods of the Bible',
    primaryKeyword: 'foods of the bible',
    secondaryKeywords: [
      'biblical foods',
      'foods in the bible',
      'bible foods list',
      'food mentioned in the bible',
      'food in scripture',
    ],
    intent: 'informational',
    contentType: 'pillar',
    targetRoute: '/foods-of-the-bible/',
    status: 'planned',
    priority: 'high',
    cluster: 'core-bible-food',
    relatedTopics: [
      'food-in-biblical-times',
      'seven-foods-deuteronomy-8',
      'recipes-hub',
      'figs',
    ],
    researchRequired: [
      'Compile a verified food catalog with scripture references from scholarly sources (encyclopedia class), not competitor blogs.',
      'Verify Deuteronomy 8:8 wording in the chosen translation before any quotation.',
      'Review MacDonald (2008) for dietary-staples framing.',
    ],
    evidenceLevel: 'serp-observed',
    notes:
      'Absorbs ALL list-intent variants; no competing sub-pages for list keywords. Becomes the canonical catalog once published. Homepage stays brand/trust hub.',
  },
  {
    id: 'homepage-brand',
    topic: 'BiblicalMeal brand queries',
    primaryKeyword: 'biblicalmeal',
    secondaryKeywords: ['biblical meal website'],
    intent: 'navigational',
    contentType: 'homepage',
    targetRoute: '/',
    status: 'published',
    priority: 'low',
    cluster: 'core-bible-food',
    relatedTopics: ['foods-of-the-bible'],
    existingContent: 'Homepage (V1/V2 approved design).',
    researchRequired: [],
    evidenceLevel: 'hypothesis',
    notes:
      'Not a keyword target. Routes visitors into clusters and demonstrates E-E-A-T (research standards, honest labels).',
  },

  {
    id: 'figs',
    topic: 'Figs in the Bible',
    primaryKeyword: 'figs in the bible',
    secondaryKeywords: ['biblical figs', 'fig tree bible food'],
    intent: 'informational',
    contentType: 'ingredient',
    targetRoute: '/foods/figs/',
    status: 'in-development',
    priority: 'high',
    cluster: 'ingredients',
    parentTopic: 'foods-of-the-bible',
    relatedTopics: ['seven-foods-deuteronomy-8', 'recipes-hub'],
    existingContent: 'Draft profile + original illustration exist (V2/V3A).',
    researchRequired: [
      'Verify fig scripture references against source text before quoting.',
      'Historical cultivation context from archaeobotanical literature.',
    ],
    evidenceLevel: 'hypothesis',
    notes: 'Seven-species adjacent; among first profiles to publish.',
  },
  {
    id: 'olives',
    topic: 'Olives and Olive Oil in the Bible',
    primaryKeyword: 'olives in the bible',
    secondaryKeywords: ['olive oil bible', 'olive tree symbolism'],
    intent: 'informational',
    contentType: 'ingredient',
    targetRoute: '/ingredients/olives/',
    status: 'in-development',
    priority: 'high',
    cluster: 'ingredients',
    parentTopic: 'foods-of-the-bible',
    relatedTopics: ['seven-foods-deuteronomy-8', 'recipes-hub'],
    existingContent: 'Draft profile + illustration exist.',
    researchRequired: [
      'Verify olive/oil scripture references.',
      'Keep devotional symbolism separate from culinary history on the page.',
    ],
    evidenceLevel: 'hypothesis',
    notes: 'Symbolically loaded (anointing, peace); handle layers carefully.',
  },
  {
    id: 'lentils',
    topic: 'Lentils in the Bible',
    primaryKeyword: 'lentils in the bible',
    secondaryKeywords: ['lentils genesis 25', 'esau pottage'],
    intent: 'informational',
    contentType: 'ingredient',
    targetRoute: '/ingredients/lentils/',
    status: 'in-development',
    priority: 'high',
    cluster: 'ingredients',
    parentTopic: 'foods-of-the-bible',
    relatedTopics: ['lentil-stew', 'recipes-hub'],
    existingContent: 'Draft profile exists; linked from lentil-stew recipe.',
    researchRequired: [
      'Verify Genesis 25 pottage details before referencing the story.',
    ],
    evidenceLevel: 'hypothesis',
    notes: 'Strongest recipe bridge of all ingredients.',
  },
  {
    id: 'dates',
    topic: 'Dates in the Bible',
    primaryKeyword: 'dates in the bible',
    secondaryKeywords: ['date palm bible'],
    intent: 'informational',
    contentType: 'ingredient',
    targetRoute: '/foods/dates/',
    status: 'in-development',
    priority: 'medium',
    cluster: 'ingredients',
    parentTopic: 'foods-of-the-bible',
    relatedTopics: ['seven-foods-deuteronomy-8'],
    existingContent: 'Draft profile + illustration exist.',
    researchRequired: [
      'Investigate whether biblical honey often means date syrup; assert nothing without sources.',
    ],
    evidenceLevel: 'hypothesis',
    notes: 'Date-honey nuance is a differentiator if verified properly.',
  },
  {
    id: 'honey',
    topic: 'Honey in the Bible',
    primaryKeyword: 'honey in the bible',
    secondaryKeywords: ['milk and honey bible'],
    intent: 'informational',
    contentType: 'ingredient',
    targetRoute: '/ingredients/honey/',
    status: 'in-development',
    priority: 'high',
    cluster: 'ingredients',
    parentTopic: 'foods-of-the-bible',
    relatedTopics: ['seven-foods-deuteronomy-8', 'john-the-baptist-diet'],
    existingContent: 'Draft profile + illustration exist.',
    researchRequired: [
      'Distinguish bee honey vs date syrup in scholarship before claiming anything.',
      '"Land flowing with milk and honey" - verify reference wording.',
    ],
    evidenceLevel: 'hypothesis',
    notes: 'Cross-links to the John-the-Baptist question later.',
  },
  {
    id: 'barley',
    topic: 'Barley in the Bible',
    primaryKeyword: 'barley in the bible',
    secondaryKeywords: ['barley bread bible', 'barley harvest ruth'],
    intent: 'informational',
    contentType: 'ingredient',
    targetRoute: '/ingredients/barley/',
    status: 'in-development',
    priority: 'high',
    cluster: 'ingredients',
    parentTopic: 'foods-of-the-bible',
    relatedTopics: ['seven-foods-deuteronomy-8', 'recipes-hub'],
    existingContent: 'Draft profile + illustration exist.',
    researchRequired: ['Verify barley references (harvest-cycle texts).'],
    evidenceLevel: 'hypothesis',
    notes: '',
  },
  {
    id: 'wheat',
    topic: 'Wheat in the Bible',
    primaryKeyword: 'wheat in the bible',
    secondaryKeywords: ['grain harvest bible'],
    intent: 'informational',
    contentType: 'ingredient',
    targetRoute: '/ingredients/wheat/',
    status: 'planned',
    priority: 'high',
    cluster: 'ingredients',
    parentTopic: 'foods-of-the-bible',
    relatedTopics: ['seven-foods-deuteronomy-8', 'bread-in-the-bible'],
    researchRequired: [
      'Full profile research required (no draft exists yet).',
      'Illustration scene must be added to ART_REGISTRY before launch.',
    ],
    evidenceLevel: 'hypothesis',
    notes: 'Seven-species member; needs new art kind.',
  },
  {
    id: 'grapes',
    topic: 'Grapes in the Bible',
    primaryKeyword: 'grapes in the bible',
    secondaryKeywords: ['fruit of the vine'],
    intent: 'informational',
    contentType: 'ingredient',
    targetRoute: '/ingredients/grapes/',
    status: 'planned',
    priority: 'medium',
    cluster: 'ingredients',
    parentTopic: 'foods-of-the-bible',
    relatedTopics: ['seven-foods-deuteronomy-8'],
    researchRequired: ['Full profile research; new illustration needed.'],
    evidenceLevel: 'hypothesis',
    notes: 'Wine theology deliberately excluded from this page.',
  },
  {
    id: 'pomegranate',
    topic: 'Pomegranates in the Bible',
    primaryKeyword: 'pomegranates in the bible',
    secondaryKeywords: ['pomegranate temple symbolism'],
    intent: 'informational',
    contentType: 'ingredient',
    targetRoute: '/ingredients/pomegranates/',
    status: 'planned',
    priority: 'medium',
    cluster: 'ingredients',
    parentTopic: 'foods-of-the-bible',
    relatedTopics: ['seven-foods-deuteronomy-8'],
    researchRequired: ['Full profile research; new illustration needed.'],
    evidenceLevel: 'hypothesis',
    notes: 'Seven-species member; priestly/temple imagery needs care.',
  },
  {
    id: 'fish',
    topic: 'Fish in the Bible',
    primaryKeyword: 'fish in the bible',
    secondaryKeywords: ['sea of galilee fish', 'loaves and fishes'],
    intent: 'informational',
    contentType: 'ingredient',
    targetRoute: '/ingredients/fish/',
    status: 'research-first',
    priority: 'medium',
    cluster: 'ingredients',
    parentTopic: 'foods-of-the-bible',
    relatedTopics: ['what-did-jesus-eat'],
    researchRequired: [
      'Galilee fishing-economy sourcing from scholarly material.',
      'Present clean/unclean fish criteria descriptively; no dietary advocacy.',
    ],
    evidenceLevel: 'serp-observed',
    notes: 'Strong bridge into Jesus-and-food cluster once researched.',
  },
  {
    id: 'bread-in-the-bible',
    topic: 'Bread in the Bible',
    primaryKeyword: 'bread in the bible',
    secondaryKeywords: ['daily bread meaning'],
    intent: 'informational',
    contentType: 'article',
    targetRoute: '/articles/bread-in-the-bible/',
    status: 'research-first',
    priority: 'medium',
    cluster: 'ingredients',
    parentTopic: 'foods-of-the-bible',
    relatedTopics: ['wheat', 'unleavened-bread', 'what-did-jesus-eat'],
    researchRequired: [
      'Bread-making archaeology from museum/scholarly sources.',
      '"Bread of life" theology: cite recognized teachers; do not originate doctrine.',
    ],
    evidenceLevel: 'serp-observed',
    notes:
      'Article rather than ingredient: prepared food with major symbolic load.',
  },
  {
    id: 'herbs-spices',
    topic: 'Herbs and Spices of Scripture',
    primaryKeyword: 'herbs and spices in the bible',
    secondaryKeywords: ['mint dill cumin', 'bitter herbs passover'],
    intent: 'informational',
    contentType: 'article',
    targetRoute: '/articles/herbs-and-spices-of-scripture/',
    status: 'research-first',
    priority: 'low',
    cluster: 'ingredients',
    parentTopic: 'foods-of-the-bible',
    relatedTopics: [],
    researchRequired: [
      'Decide overview-article-first vs individual pages after sourcing.',
    ],
    evidenceLevel: 'hypothesis',
    notes: 'Individual herb pages only where depth justifies them.',
  },
  {
    id: 'salt',
    topic: 'Salt in the Bible',
    primaryKeyword: 'salt in the bible',
    secondaryKeywords: ['covenant of salt'],
    intent: 'informational',
    contentType: 'ingredient',
    targetRoute: '/ingredients/salt/',
    status: 'research-first',
    priority: 'medium',
    cluster: 'ingredients',
    parentTopic: 'foods-of-the-bible',
    relatedTopics: [],
    researchRequired: ['Covenant-of-salt scholarship before writing.'],
    evidenceLevel: 'hypothesis',
    notes: 'Highly symbolic; verify first.',
  },
  {
    id: 'wine-in-scripture',
    topic: 'Wine in Scripture',
    primaryKeyword: 'wine in the bible',
    secondaryKeywords: ['wedding at cana wine'],
    intent: 'informational',
    contentType: 'ingredient',
    targetRoute: '',
    status: 'not-pursuing',
    priority: 'low',
    cluster: 'ingredients',
    parentTopic: 'foods-of-the-bible',
    relatedTopics: ['grapes'],
    researchRequired: [
      'Requires mature editorial judgment on alcohol theology; defer until authority is established.',
    ],
    evidenceLevel: 'hypothesis',
    notes:
      'Deliberately NOT pursued now: contested theology, age-sensitive topic. Revisit only with careful framing, possibly external pastoral review.',
  },
  {
    id: 'what-did-jesus-eat',
    topic: 'What Did Jesus Eat?',
    primaryKeyword: 'what did jesus eat',
    secondaryKeywords: [
      'what foods did jesus eat',
      'what did jesus eat in the bible',
      'did jesus eat meat',
    ],
    intent: 'informational',
    contentType: 'pillar',
    targetRoute: '/articles/what-did-jesus-eat/',
    status: 'brief-ready',
    priority: 'high',
    cluster: 'jesus-and-food',
    relatedTopics: ['food-in-biblical-times', 'last-supper-foods', 'fish'],
    researchRequired: [
      'Verify every Gospel food reference verse-by-verse (including the Luke 24 claim seen on competitor sites).',
      'Source first-century Galilean diet from scholarship, not Christian blogs.',
      'Apply mandatory three-tier evidence labeling (attested / plausible / speculative).',
    ],
    evidenceLevel: 'serp-observed',
    notes:
      'Single-pillar strategy: sub-questions live as sections here until they stand alone. "Did Jesus eat meat" is a SECTION, never its own thin page.',
  },
  {
    id: 'last-supper-foods',
    topic: 'Food at the Last Supper',
    primaryKeyword: 'what was eaten at the last supper',
    secondaryKeywords: ['last supper meal'],
    intent: 'informational',
    contentType: 'article',
    targetRoute: '/articles/food-at-the-last-supper/',
    status: 'research-first',
    priority: 'medium',
    cluster: 'jesus-and-food',
    parentTopic: 'what-did-jesus-eat',
    relatedTopics: ['unleavened-bread', 'wine-in-scripture'],
    researchRequired: [
      'Passover chronology questions need careful scholarly treatment.',
      'Communion theology presented with reverence; cite recognized teachers, do not editorialize.',
    ],
    evidenceLevel: 'hypothesis',
    notes:
      'High sensitivity. Stays a section of the pillar until independently verifiable depth exists.',
  },
  {
    id: 'john-the-baptist-diet',
    topic: "John the Baptist's Diet",
    primaryKeyword: 'what did john the baptist eat',
    secondaryKeywords: ['locusts and wild honey'],
    intent: 'informational',
    contentType: 'article',
    targetRoute: '/articles/what-did-john-the-baptist-eat/',
    status: 'research-first',
    priority: 'medium',
    cluster: 'jesus-and-food',
    relatedTopics: ['honey'],
    researchRequired: [
      'Resolve the locust-vs-carob translation question from primary scholarship before any claim.',
    ],
    evidenceLevel: 'serp-observed',
    notes:
      'Direct Gospel anchor exists, but the locust/carob ambiguity visible in SERP content shows why verification matters.',
  },

  {
    id: 'food-in-biblical-times',
    topic: 'Food in Biblical Times',
    primaryKeyword: 'food in biblical times',
    secondaryKeywords: [
      'what did people eat in biblical times',
      'ancient israelite food',
      'ancient israelite diet',
      'daily meals in ancient israel',
    ],
    intent: 'informational',
    contentType: 'pillar',
    targetRoute: '/food-in-biblical-times/',
    status: 'planned',
    priority: 'high',
    cluster: 'food-in-biblical-times',
    relatedTopics: ['foods-of-the-bible', 'what-did-jesus-eat', 'recipes-hub'],
    researchRequired: [
      'Anchor on MacDonald (2008); supplement with peer-reviewed archaeobotany.',
      'Meal-structure claims (meals per day etc.) only from cited sources.',
    ],
    evidenceLevel: 'serp-observed',
    notes:
      '"Ancient Israelite food/diet" variants intentionally merged here - prevents cannibalization with the catalog pillar while matching distinct daily-life intent.',
  },
  {
    id: 'biblical-diet-wellness',
    topic: 'Biblical diet wellness trend',
    primaryKeyword: 'biblical diet',
    secondaryKeywords: ['bible diet food list'],
    intent: 'informational',
    contentType: 'article',
    targetRoute: '',
    status: 'not-pursuing',
    priority: 'low',
    cluster: 'food-in-biblical-times',
    relatedTopics: [],
    researchRequired: [
      'Health claims would require clinical sourcing an ancient-diet site cannot honestly provide.',
    ],
    evidenceLevel: 'serp-observed',
    notes:
      'Wellness/diet industry observed in SERPs. Out of scope permanently unless mission changes: health-advice liability conflicts with honesty standards.',
  },

  {
    id: 'recipes-hub',
    topic: 'Biblical Recipes hub',
    primaryKeyword: 'biblical recipes',
    secondaryKeywords: ['recipes from the bible', 'bible food recipes'],
    intent: 'informational',
    contentType: 'hub',
    targetRoute: '/recipes/',
    status: 'in-development',
    priority: 'high',
    cluster: 'biblical-recipes',
    relatedTopics: ['lentil-stew', 'foods-of-the-bible'],
    existingContent: 'Recipe index + one full draft recipe (V3A).',
    researchRequired: [
      'Hub intro copy explaining recipeType classifications honestly.',
      'Minimum viable corpus before targeting this keyword family (suggest 4+ published recipes).',
    ],
    evidenceLevel: 'serp-observed',
    notes:
      'Canonical target for recipe-intent queries once populated. Index page copy must state classification system up front.',
  },
  {
    id: 'lentil-stew',
    topic: 'Lentil Stew (biblical-inspired)',
    primaryKeyword: 'biblical lentil stew',
    secondaryKeywords: ['lentil stew bible story'],
    intent: 'informational',
    contentType: 'recipe',
    targetRoute: '/recipes/lentil-stew/',
    status: 'in-development',
    priority: 'medium',
    cluster: 'biblical-recipes',
    parentTopic: 'recipes-hub',
    relatedTopics: ['lentils', 'recipes-hub'],
    existingContent: 'Full tested-style draft exists (V3A).',
    researchRequired: [
      'Never present as Genesis 25 reconstruction; Genesis pottage was red lentils and details differ - keep inspired framing.',
    ],
    evidenceLevel: 'hypothesis',
    notes:
      'Our first complete recipe; honest inspired-type framing already built into content model.',
  },
  {
    id: 'ezekiel-bread',
    topic: 'Ezekiel Bread',
    primaryKeyword: 'ezekiel bread bible',
    secondaryKeywords: ['ezekiel 4 9 bread recipe'],
    intent: 'informational',
    contentType: 'recipe',
    targetRoute: '/recipes/ezekiel-bread/',
    status: 'research-first',
    priority: 'medium',
    cluster: 'biblical-recipes',
    parentTopic: 'recipes-hub',
    relatedTopics: ['wheat', 'barley', 'bread-in-the-bible'],
    researchRequired: [
      'Ezekiel 4:9 context includes siege-food framing many competitors omit - verify passage fully before using.',
      'Decide honestly between reconstructed and inspired classification based on sources found.',
    ],
    evidenceLevel: 'serp-observed',
    notes:
      'Highest-interest recipe query family observed (multiple competitors). Only worth doing WITH genuine verse-context depth - that is our differentiator vs listicles.',
  },
  {
    id: 'unleavened-bread',
    topic: 'Unleavened Bread',
    primaryKeyword: 'unleavened bread bible',
    secondaryKeywords: ['passover bread'],
    intent: 'informational',
    contentType: 'recipe',
    targetRoute: '/recipes/unleavened-bread/',
    status: 'research-first',
    priority: 'medium',
    cluster: 'biblical-recipes',
    parentTopic: 'recipes-hub',
    relatedTopics: ['bread-in-the-bible', 'last-supper-foods'],
    researchRequired: [
      'Passover theology requires respectful treatment; recipe itself simple, context is the work.',
    ],
    evidenceLevel: 'serp-observed',
    notes:
      'Competitor coverage exists; our angle is verified context + honest classification.',
  },

  {
    id: 'seven-foods-deuteronomy-8',
    topic: 'The Seven Foods of Deuteronomy 8',
    primaryKeyword: 'seven foods of the promised land',
    secondaryKeywords: [
      'seven species deuteronomy 8:8',
      'seven foods of the bible',
    ],
    intent: 'informational',
    contentType: 'article',
    targetRoute: '/articles/seven-foods-of-the-promised-land/',
    status: 'brief-ready',
    priority: 'high',
    cluster: 'bible-questions',
    relatedTopics: [
      'figs',
      'olives',
      'dates',
      'honey',
      'barley',
      'wheat',
      'grapes',
      'pomegranate',
    ],
    researchRequired: [
      'BLOCKED ON VERIFICATION: exact wording of Deuteronomy 8:8 in chosen translation (longstanding project TODO).',
      'Confirm the species enumeration matches translation before publishing any list.',
    ],
    evidenceLevel: 'serp-observed',
    notes:
      'Strongest near-term question opportunity: single clear scripture anchor, natural hub linking all seven ingredient profiles. Publishes ONLY after the reference verification completes.',
  },
  {
    id: 'what-is-manna',
    topic: 'What Is Manna?',
    primaryKeyword: 'what is manna in the bible',
    secondaryKeywords: ['manna from heaven meaning'],
    intent: 'informational',
    contentType: 'article',
    targetRoute: '/articles/what-is-manna/',
    status: 'research-first',
    priority: 'medium',
    cluster: 'bible-questions',
    relatedTopics: ['food-in-biblical-times'],
    researchRequired: [
      'Scholarly identifications vary (resin/honeydew theories); theological meaning matters more than identification - both must be sourced.',
    ],
    evidenceLevel: 'hypothesis',
    notes: 'Deep well of material; needs real study time. Do not rush.',
  },
  {
    id: 'wilderness-diet',
    topic: 'What the Israelites Ate in the Wilderness',
    primaryKeyword: 'what did the israelites eat in the wilderness',
    secondaryKeywords: ['quail manna wilderness'],
    intent: 'informational',
    contentType: 'article',
    targetRoute: '/articles/israelites-wilderness-food/',
    status: 'research-first',
    priority: 'low',
    cluster: 'bible-questions',
    parentTopic: 'food-in-biblical-times',
    relatedTopics: ['what-is-manna'],
    researchRequired: ['Exodus 16 + Numbers 11 narrative sourcing.'],
    evidenceLevel: 'hypothesis',
    notes: 'Overlaps manna article; sequence after it.',
  },
  {
    id: 'clean-unclean-foods',
    topic: 'Clean and Unclean Foods',
    primaryKeyword: 'clean and unclean foods in the bible',
    secondaryKeywords: ['leviticus 11 food laws'],
    intent: 'informational',
    contentType: 'article',
    targetRoute: '',
    status: 'not-pursuing',
    priority: 'low',
    cluster: 'bible-questions',
    relatedTopics: [],
    researchRequired: [
      'Levitical law + Acts 10 + Mark 7 interpretation landscape requires serious theological review beyond current capacity.',
    ],
    evidenceLevel: 'hypothesis',
    notes:
      'Deliberately deprioritized: contested doctrine where an error would mislead readers spiritually. Revisit only with qualified theological review.',
  },
  {
    id: 'fruits-of-the-bible',
    topic: 'Fruits of the Bible',
    primaryKeyword: 'fruits in the bible',
    secondaryKeywords: ['what fruits are mentioned in the bible'],
    intent: 'informational',
    contentType: 'article',
    targetRoute: '/articles/fruits-of-the-bible/',
    status: 'planned',
    priority: 'medium',
    cluster: 'core-bible-food',
    parentTopic: 'foods-of-the-bible',
    relatedTopics: ['figs', 'grapes', 'pomegranate', 'dates'],
    researchRequired: [
      'Differentiation required against symbolism-heavy results (fruit-of-the-Spirit, dream-interpretation pages observed 2026-08-23).',
      'High scholarly bar set by Biblical Archaeology Society fruit article - match sourcing discipline, not format.',
      'Apple identification debate must follow inventory evidence labels.',
    ],
    evidenceLevel: 'serp-observed',
    notes:
      'Category-intent page owned by this target; deep-links into fruit ingredient profiles. Validated 2026-08-23: literal-food intent is under-served versus symbolic-devotional results.',
  },
  {
    id: 'vegetables-of-the-bible',
    topic: 'Vegetables of the Bible',
    primaryKeyword: 'vegetables in the bible',
    secondaryKeywords: ['what vegetables are mentioned in the bible'],
    intent: 'informational',
    contentType: 'article',
    targetRoute: '/articles/vegetables-of-the-bible/',
    status: 'planned',
    priority: 'medium',
    cluster: 'core-bible-food',
    parentTopic: 'foods-of-the-bible',
    relatedTopics: ['lentils', 'seven-foods-deuteronomy-8'],
    researchRequired: [
      'Confirmed gap 2026-08-23: results are verse-collection pages and encyclopedias; no dedicated food-editorial vegetables page observed.',
      'Handle identification-debate items (melons, onions-leeks-garlic tradition) with evidence labels.',
    ],
    evidenceLevel: 'serp-observed',
    notes:
      'Category-intent page; Numbers 11 wilderness-tradition items require verification pass. Some observed competitors add health framing we will not.',
  },
  {
    id: 'meat-in-the-bible',
    topic: 'Meat in the Bible',
    primaryKeyword: 'meat in the bible',
    secondaryKeywords: ['what animals were eaten in the bible'],
    intent: 'informational',
    contentType: 'article',
    targetRoute: '/articles/meat-in-the-bible/',
    status: 'research-first',
    priority: 'medium',
    cluster: 'core-bible-food',
    parentTopic: 'foods-of-the-bible',
    relatedTopics: ['fish', 'what-did-jesus-eat'],
    researchRequired: [
      'SERP validated 2026-08-23: results dominated by contested clean/unclean doctrine (denominational sites arguing opposite positions, e.g. on pork).',
      'Descriptive eaten-animals intent exists (FAQ-style results) but execution requires qualified theological review BEFORE brief approval.',
      'Page must stay strictly descriptive of narrative animal foods; clean/unclean interpretation stays excluded per clean-unclean-foods decision.',
    ],
    evidenceLevel: 'serp-observed',
    notes:
      'Absorbs the eaten-animals question family so it does not fragment into thin pages. Elevated doctrinal-contamination risk confirmed in live SERP - strongest guardrails of any category page.',
  },
];

/** Targets that act as pillars - derived for quick reference and the /seo-map/ view. */
export const PILLAR_TARGET_IDS = [
  'foods-of-the-bible',
  'what-did-jesus-eat',
  'food-in-biblical-times',
] as const;

export interface LinkingPath {
  name: string;
  /** Ordered target ids forming the intended topical walk. */
  steps: string[];
  description: string;
}

/**
 * Internal linking master plan.
 * Rules (enforced culturally, reviewed per brief):
 * 1. Every published page must have at least one inbound internal link
 *    (homepage, section index, or related-content block counts).
 * 2. Pillars link DOWN to their cluster children; children link UP to their
 *    pillar once it exists (parentTopic field drives this).
 * 3. Lateral links flow through the existing getRelated() system - never
 *    hand-hardcoded inside templates.
 * 4. Anchors are descriptive phrases ("figs in scripture", not "click here",
 *    not exact-match keyword stuffing).
 * 5. No circular link rings beyond breadcrumb up-navigation.
 */
export const LINKING_PATHS: LinkingPath[] = [
  {
    name: 'Catalog walk',
    steps: [
      'foods-of-the-bible',
      'figs',
      'recipes-hub',
      'lentil-stew',
      'lentils',
    ],
    description:
      'Pillar catalog → ingredient → recipe hub → recipe → back into ingredients via related content.',
  },
  {
    name: 'Daily-life walk',
    steps: [
      'food-in-biblical-times',
      'bread-in-the-bible',
      'wheat',
      'unleavened-bread',
    ],
    description:
      'Daily-life pillar → bread article → wheat ingredient → unleavened recipe.',
  },
  {
    name: 'Gospel walk',
    steps: ['what-did-jesus-eat', 'fish', 'seven-foods-deuteronomy-8', 'honey'],
    description:
      'Jesus-food pillar → fish ingredient → seven-species article → honey ingredient.',
  },
];

export interface RoadmapPhase {
  id: string;
  name: string;
  goal: string;
  targetIds: string[];
  exitCriteria: string;
}

export const ROADMAP_PHASES: RoadmapPhase[] = [
  {
    id: 'phase-1',
    name: 'Phase 1 - Highest authority opportunities',
    goal: 'Publish the verified core: finish existing drafts and ship the two strongest pillars.',
    targetIds: [
      'figs',
      'olives',
      'lentils',
      'dates',
      'honey',
      'barley',
      'seven-foods-deuteronomy-8',
      'what-did-jesus-eat',
    ],
    exitCriteria:
      'Six ingredient profiles published with verified references; Deuteronomy 8:8 verification complete; Jesus-food pillar passes fact-check with tiered evidence labels.',
  },
  {
    id: 'phase-2',
    name: 'Phase 2 - Catalog + daily-life pillars',
    goal: 'Build the two head pillars on top of a now-substantial ingredient base.',
    targetIds: ['foods-of-the-bible', 'food-in-biblical-times', 'wheat'],
    exitCriteria:
      'Both pillars live and internally linked to every published profile; wheat illustration shipped.',
  },
  {
    id: 'phase-3',
    name: 'Phase 3 - Question content',
    goal: 'Individually justified question pages that already passed briefs.',
    targetIds: [
      'john-the-baptist-diet',
      'last-supper-foods',
      'what-is-manna',
      'fish',
    ],
    exitCriteria:
      'Each page has a completed, fact-checked brief; no page ships from keyword list alone.',
  },
  {
    id: 'phase-4',
    name: 'Phase 4 - Recipe expansion',
    goal: 'Grow /recipes/ into a genuine hub with honest classifications.',
    targetIds: ['recipes-hub', 'ezekiel-bread', 'unleavened-bread'],
    exitCriteria:
      'Four or more published recipes; Ezekiel/unleavened recipes carry verse-context depth competitors lack.',
  },
  {
    id: 'phase-5',
    name: 'Phase 5 - Long-tail topical coverage',
    goal: 'Supporting articles only where briefs justify them.',
    targetIds: [
      'bread-in-the-bible',
      'salt',
      'herbs-spices',
      'grapes',
      'pomegranate',
    ],
    exitCriteria: 'Reviewed against search-console data collected by then.',
  },
];

export interface TechSeoFinding {
  area: string;
  status: 'healthy' | 'fixed-in-v3b' | 'gap-future';
  finding: string;
}

export const TECH_SEO_AUDIT: TechSeoFinding[] = [
  {
    area: 'Titles & meta descriptions',
    status: 'healthy',
    finding:
      'Unique per-page titles/descriptions flow from BaseLayout props; V3A pages all pass explicit values.',
  },
  {
    area: 'Canonical URLs',
    status: 'healthy',
    finding: 'Canonical generated from Astro.site + pathname in BaseLayout.',
  },
  {
    area: 'Sitemap',
    status: 'fixed-in-v3b',
    finding:
      'Sitemap now filters out the internal /seo-map/ route so planning URLs never enter the public sitemap.',
  },
  {
    area: 'robots.txt',
    status: 'healthy',
    finding: 'Allows all + points at sitemap-index.xml.',
  },
  {
    area: 'Draft indexing behavior',
    status: 'healthy',
    finding:
      'Production builds exclude non-published entries entirely (routes not generated); no accidental draft indexing possible.',
  },
  {
    area: 'Internal strategy route',
    status: 'fixed-in-v3b',
    finding:
      '/seo-map/ emits noindex, follow and renders an empty shell outside development previews.',
  },
  {
    area: 'Structured data',
    status: 'healthy',
    finding:
      'WebSite + BreadcrumbList always; Recipe/Article JSON-LD gated behind published status with complete data (no misleading schema).',
  },
  {
    area: 'Open Graph / Twitter',
    status: 'gap-future',
    finding:
      'OG image still missing (pre-existing TODO in BaseLayout). Recommended: branded 1200x630 social image before first pillar publishes.',
  },
  {
    area: 'Heading hierarchy',
    status: 'healthy',
    finding:
      'Verified single-H1 structure across detail routes in V3A testing.',
  },
  {
    area: 'Image optimization',
    status: 'gap-future',
    finding:
      'Inline SVG illustrations are lightweight; when photography arrives, add width/height/alt discipline + Astro image pipeline.',
  },
  {
    area: 'Redirects & URL normalization',
    status: 'gap-future',
    finding:
      'Static host should enforce a single trailing-slash form; decide canonical slash style at deploy time.',
  },
];

export interface ResearchLogEntry {
  date: string;
  query: string;
  method: string;
  label: 'VERIFIED-SERP-OBSERVATION';
  observations: string[];
}

export const RESEARCH_LOG: ResearchLogEntry[] = [
  {
    date: '2026-08-23',
    query: 'foods of the bible',
    method: 'web search tool (organic results review)',
    label: 'VERIFIED-SERP-OBSERVATION',
    observations: [
      'List-format articles with scripture references dominate (learnreligions.com, biblehub.com topical lists, churchequips.com).',
      'Bible-diet wellness sites hold multiple positions.',
      'Dedicated niche competitor domain biblical.recipes ranks.',
      'Content quality is mixed; several entries are thin or unsourced.',
    ],
  },
  {
    date: '2026-08-23',
    query: 'what did jesus eat',
    method: 'web search tool (organic results review)',
    label: 'VERIFIED-SERP-OBSERVATION',
    observations: [
      'Moderate-depth Christian content sites dominate; faithward.org cites scholarly literature (JSTOR links).',
      'Strong food-media entry exists built on a historian interview (tastingtable.com / Neot Kedumim).',
      'Consensus framing is hedged ("likely ate") around bread, fish, legumes, olive oil; vegetarian-question FAQ common.',
      'christianityfaq.com asserts Luke 24:42-43 is the only explicit eating reference - recorded as a claim TO VERIFY, not adopted.',
    ],
  },
  {
    date: '2026-08-23',
    query: 'food in biblical times what did people eat',
    method: 'web search tool (organic results review)',
    label: 'VERIFIED-SERP-OBSERVATION',
    observations: [
      'Thin blogs and topical encyclopedias mixed; scholarly anchor exists: Nathan MacDonald, "What Did the Ancient Israelites Eat?: Diet in Biblical Times" (Eerdmans, 2008).',
      'NYT piece (May 2026) covers the social-media "biblical diet" trend - cultural-interest signal.',
      'Deuteronomy 8:8 species lists recur across multiple domains.',
    ],
  },
  {
    date: '2026-08-23',
    query: 'recipes from the bible biblical recipes',
    method: 'web search tool (organic results review)',
    label: 'VERIFIED-SERP-OBSERVATION',
    observations: [
      'biblical.recipes ranks across clusters (direct competitor).',
      'thebiblecookbook.com explicitly labels its recipes modern creations - validates our inspired/researched/reconstructed honesty model.',
      'Wellness hubs cover Ezekiel bread and unleavened bread extensively.',
      'Published book "Cooking with the Bible" (Chiffolo & Hesse) demonstrates serious market for story-based biblical meals.',
      'Low-effort listicles ("5 biblical recipes") are common - quality bar beatable.',
    ],
  },
  {
    date: '2026-08-23',
    query: 'fruits in the bible',
    method: 'web search tool (V3B completion audit)',
    label: 'VERIFIED-SERP-OBSERVATION',
    observations: [
      'Strong scholarly-archaeology entry exists (biblicalarchaeology.org, PhD-authored, six tree fruits incl. Hebrew terms).',
      'Majority of remaining results are symbolism-devotional pages (fruit of the Spirit, dream interpretation) rather than literal-food editorial.',
      'Literal-food intent under-served; our evidence-labeled food angle is differentiated but must match BAS-level sourcing discipline.',
    ],
  },
  {
    date: '2026-08-23',
    query: 'vegetables in the bible',
    method: 'web search tool (V3B completion audit)',
    label: 'VERIFIED-SERP-OBSERVATION',
    observations: [
      'Dominated by topical encyclopedias and verse-collection listicles (biblehub, biblegateway, knowing-jesus); one combined fruits+vegetables listicle observed.',
      'No dedicated food-editorial vegetables page found - genuine gap.',
      'Health framing present on some competitors; excluded from our scope.',
      'Ezekiel-style grain lists (spelt, millet, beans) recur - inventory entries justified but wording still requires translation verification.',
    ],
  },
  {
    date: '2026-08-23',
    query: 'meat in the bible what animals were eaten',
    method: 'web search tool (V3B completion audit)',
    label: 'VERIFIED-SERP-OBSERVATION',
    observations: [
      'Results dominated by contested clean/unclean doctrine from denominational sites arguing OPPOSITE positions (incl. claims that pork is now clean).',
      'Descriptive eaten-animals intent visible in FAQ-style results, but heavily entangled with doctrinal advocacy.',
      'Confirms elevated risk for meat-in-the-bible target: execution requires qualified theological review; page stays strictly descriptive.',
      'Multiple results repeat Luke 24:42-43 fish claim - remains on our verification list, not adopted.',
    ],
  },
];

export const DATA_LIMITS_DISCLAIMER =
  'No search-volume, keyword-difficulty, click-stream, or ranking data was used anywhere in this map because no such tooling was available. Priorities rest on SERP pattern observations (dated above), intent analysis, topical fit, and editorial capacity. All volume-dependent judgments remain hypotheses until Search Console data accumulates.';
