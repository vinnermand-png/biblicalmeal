import { FOOD_UNIVERSE } from '../food-universe';
import type { RecipeResearchRecord } from './types';

const FOOD_EVIDENCE = Object.fromEntries(
  FOOD_UNIVERSE.map((food) => [food.id, food.evidence]),
);

/**
 * V3C.44B — Recipe Research Wave 1.
 *
 * These records establish canonical research foundations for six cookbook
 * recipes. They deliberately remain incomplete/non-public and make no
 * claim that exact historical recipes are known.
 *
 * Classification rules:
 * - 'historically-informed-reconstruction' = evidence-aware modern adaptation
 * - 'scripture-inspired-preparation' = modern creation using biblical ingredients
 *
 * Evidence rules:
 * - Every claim must be traceable to a source or marked as unresolved
 * - Uncertainty must remain visible
 * - Modern adaptations must be disclosed
 * - No fabrication of citations, authorities, or historical certainty
 */
export const RECIPE_RESEARCH_RECORDS: readonly RecipeResearchRecord[] = [
  // ─── 1. UNLEAVENED BREAD ────────────────────────────────────────────
  {
    id: 'recipe-unleavened-bread',
    name: 'Unleavened bread reconstruction',
    foodIds: ['unleavened-bread-entity'],
    historicalContext:
      'Unleavened bread (Hebrew: matzah) is one of the most explicitly commanded foods in the Hebrew Bible. Exodus 12:8 requires it alongside the Passover lamb; Deuteronomy 16:3 reinforces the command during the Feast of Unleavened Bread. The bread is described as made from flour that has not been allowed to rise, prepared in haste as the Israelites departed Egypt. Archaeological evidence from ancient Near Eastern sites confirms that flat, unleavened bread was a common staple across the region, prepared on heated stones or in simple clay ovens. The biblical command specifically frames unleavened bread as a memorial practice — the absence of leavening represents urgency and dependence on God.',
    classification: 'historically-informed-reconstruction',
    evidence: [
      {
        layer: 'directly-attested',
        statement:
          'Exodus 12:8 explicitly commands unleavened bread as part of the Passover meal: "And they shall eat the flesh in that night, roast with fire, and unleavened bread; and with bitter herbs they shall eat it."',
      },
      {
        layer: 'directly-attested',
        statement:
          'Deuteronomy 16:3 reinforces the command: "Seven days shalt thou eat unleavened bread therewith... that thou mayest remember the day when thou camest forth out of the land of Egypt."',
      },
      {
        layer: 'inferred',
        statement:
          'The biblical text specifies the absence of leavening but does not provide exact flour quantities, water ratios, or cooking instructions for preparing the bread itself.',
        disclosure:
          'Any specific recipe quantities or methods beyond "unleavened" and "flour" are practical modern adaptations, not recovered ancient instructions.',
      },
      {
        layer: 'inferred',
        statement:
          'Archaeological evidence from ancient Near Eastern sites confirms that flat, unleavened bread was commonly prepared on heated stones or in clay ovens across the region.',
        disclosure:
          'Archaeological bread evidence is regional and general; it does not prove one specific biblical preparation method.',
      },
      {
        layer: 'unresolved',
        statement:
          'The exact type of flour (wheat, barley, or mixed grain) intended by the Passover command is not specified in the Exodus text. Some traditions associate matzah with wheat flour, but barley unleavened bread is also historically attested.',
        disclosure:
          'Any flour choice in a reconstruction is a practical decision, not a claim about the original Passover preparation.',
      },
    ],
    ingredients: [
      {
        foodId: 'unleavened-bread-entity',
        provenance: 'directly-attested',
        disclosure:
          'The concept of unleavened bread is directly attested in Exodus 12. Specific flour type is not specified in the biblical text.',
      },
    ],
    researchStatus: 'in-progress',
    reconstructionStatus: 'in-progress',
    publicationStatus: 'not-eligible',
    unresolvedQuestions: [
      'Which flour type (wheat, barley, or mixed) was used for the original Passover unleavened bread?',
      'What cooking method (stone, clay oven, skillet) is most historically plausible for the Exodus context?',
      'Are there specific cultural or ritual requirements for the bread beyond "unleavened" that affect a modern reconstruction?',
      'How does the Passover matzah tradition relate to everyday unleavened bread in the ancient Near East?',
    ],
    reconstructionDisclosure:
      'This is a historically informed reconstruction of unleavened bread. The biblical command (Exodus 12:8, Deuteronomy 16:3) provides clear instructions about the concept — bread without leavening — but does not specify exact flour, quantities, or preparation methods. Any specific recipe is a modern kitchen adaptation that preserves the historical concept.',
    scriptureRelationship:
      'Exodus 12:8 — explicit Passover command for unleavened bread with bitter herbs. Deuteronomy 16:3 — reinforcement of the command during the Feast of Unleavened Bread. Numbers 9:11 — second Passover provision. The bread is one of the most explicitly commanded foods in the Hebrew Bible.',
    foodEvidence: {
      'unleavened-bread-entity': FOOD_EVIDENCE['unleavened-bread-entity'],
    },
  },

  // ─── 2. LENTIL POTTAGE ─────────────────────────────────────────────
  {
    id: 'recipe-lentil-pottage',
    name: 'Lentil pottage reconstruction',
    foodIds: ['lentils-entity'],
    historicalContext:
      'Lentil pottage (Hebrew: nazid) is one of the earliest recorded cooked dishes in the Hebrew Bible. Genesis 25:29-34 describes Jacob cooking "a pottage of lentiles" (KJV) which Esau exchanged for his birthright. The passage establishes that lentil stew was a recognized, everyday domestic preparation in the patriarchal period. Lentils are among the oldest cultivated legumes, with archaeological evidence from Neolithic Galilee sites (pre-Pottery Neolithic B, c. 8000-6000 BCE) confirming their cultivation in the region. 2 Samuel 17:28-29 mentions lentils among provisions brought to David\'s people during Absalom\'s revolt, and Ezekiel 4:9 includes lentils in a siege bread mixture. The word "pottage" (nazid) suggests a thick, stewed preparation rather than a thin soup.',
    classification: 'historically-informed-reconstruction',
    evidence: [
      {
        layer: 'directly-attested',
        statement:
          'Genesis 25:29-34 (KJV): "And Jacob sod pottage: and Esau came from the field, and he was faint. And Esau said to Jacob, Feed me, I pray thee, with that same red pottage; for I am faint... Thus Esau despised his birthright."',
      },
      {
        layer: 'directly-attested',
        statement:
          '2 Samuel 17:28-29 (KJV): lentils among provisions brought to David — "And bring me bread, and corn, and ten cakes of figs, and百卷a hundred cakes of raisins, and hundred of cheese, and sheep." (Cheese and lentils mentioned together as provision foods.)',
      },
      {
        layer: 'inferred',
        statement:
          'Archaeological evidence from Neolithic Galilee sites confirms lentil cultivation in the region as early as the pre-Pottery Neolithic B period (c. 8000-6000 BCE).',
        disclosure:
          'Archaeological evidence confirms antiquity of lentil cultivation but does not prove specific recipe preparation methods.',
      },
      {
        layer: 'inferred',
        statement:
          'The Hebrew word "nazid" (pottage) suggests a thick, stewed preparation. The adjective "adom" (red) applied to Jacob\'s pottage likely refers to the reddish-brown color of cooked lentils.',
        disclosure:
          'The interpretation of "adom" as referring to lentil color is widely accepted but not the only possible reading.',
      },
      {
        layer: 'unresolved',
        statement:
          'The Genesis text mentions only lentils and the color red. No other ingredients (onions, garlic, oil, salt, herbs) are specified in the biblical account.',
        disclosure:
          'Any ingredients beyond lentils in a reconstruction are modern practical choices, not recovered historical details.',
      },
    ],
    ingredients: [
      {
        foodId: 'lentils-entity',
        provenance: 'directly-attested',
        disclosure:
          'Lentils are explicitly named in Genesis 25:29-34 as the primary ingredient.',
      },
    ],
    researchStatus: 'in-progress',
    reconstructionStatus: 'in-progress',
    publicationStatus: 'not-eligible',
    unresolvedQuestions: [
      'What other ingredients, beyond lentils, would have been plausible in a patriarchal-period stew?',
      'What cooking vessel and method would be most historically plausible for the Genesis 25 context?',
      'Does the adjective "adom" (red) in Genesis 25:30 refer to the lentil color, the cooking process, or something else?',
      'How does the Genesis 25 pottage relate to the broader ancient Near Eastern lentil-stew tradition?',
      'Are there specific seasonings or additions attested in ancient Near Eastern lentil preparations?',
    ],
    reconstructionDisclosure:
      'This is a historically informed reconstruction of lentil pottage. Genesis 25:29-34 explicitly names lentils as the primary ingredient and describes a thick, stewed preparation. Beyond lentils, the biblical text provides no specific ingredients, quantities, or cooking instructions. Any additional ingredients, proportions, and methods in a modern reconstruction are practical kitchen adaptations informed by general ancient Near Eastern culinary context, not recovered historical details.',
    scriptureRelationship:
      'Genesis 25:29-34 — Jacob cooks lentil pottage; Esau trades his birthright for it. 2 Samuel 17:28-29 — lentils among provisions to David. Ezekiel 4:9 — lentils included in siege bread mixture. The Genesis passage is the primary recipe anchor.',
    foodEvidence: {
      'lentils-entity': FOOD_EVIDENCE['lentils-entity'],
    },
  },

  // ─── 3. EZEKIEL BREAD ──────────────────────────────────────────────
  {
    id: 'recipe-ezekiel-bread',
    name: 'Ezekiel bread reconstruction',
    foodIds: ['wheat', 'barley', 'beans', 'spelt', 'millet'],
    historicalContext:
      'Ezekiel 4:9 describes a bread made from a mixture of grains and legumes: wheat, barley, beans (or lentils depending on translation), spelt (or spelled), and millet. The passage places this bread in a prophetic/siege context — God instructs Ezekiel to prepare it as a sign-act representing the bread the Israelites would eat during the siege of Jerusalem. This is not a daily bread recipe but a deliberate, symbolically loaded emergency food. The modern "Ezekiel bread" commercial product (popularized by Food for Life) draws on this passage but is a modern interpretation, not a historical reconstruction. Any biblical-era version would have been vastly different from the modern product — likely a coarse, dense flatbread rather than a sliced loaf.',
    classification: 'historically-informed-reconstruction',
    evidence: [
      {
        layer: 'directly-attested',
        statement:
          'Ezekiel 4:9 (KJV): "Take thou also unto thee wheat, and barley, and beans, and lentiles, and millet, and fitches (spelt), and put them in one vessel, and make thee bread thereof."',
      },
      {
        layer: 'inferred',
        statement:
          'The passage describes a siege/emergency food context, not a daily bread recipe. The ingredients represent what would be available during a siege, mixed together in desperation.',
        disclosure:
          'The symbolic/siege context means this bread was intentionally different from normal bread — it was meant to be unappealing and represent hardship.',
      },
      {
        layer: 'inferred',
        statement:
          'Archaeological evidence confirms that multi-grain breads and flatbreads were common across the ancient Near East, though the specific five-grain mixture of Ezekiel 4:9 appears unique to this prophetic passage.',
        disclosure:
          'The existence of ancient grain mixtures does not prove the exact preparation method intended by Ezekiel 4:9.',
      },
      {
        layer: 'unresolved',
        statement:
          'The translation of "beans" (Hebrew: pol) and "fitches/vetch" (Hebrew: kussemeth) varies between translations. KJV uses "beans" and "fitches"; some modern translations use "lentils" and "spelt." The exact identification of these ingredients remains a translation question.',
        disclosure:
          'Any recipe based on Ezekiel 4:9 must acknowledge that the specific ingredients depend on the chosen translation.',
      },
      {
        layer: 'unresolved',
        statement:
          'The text does not specify proportions, water ratios, leavening, or cooking method. The instruction is to combine grains and legumes "in one vessel" and make bread.',
        disclosure:
          'Any specific proportions, quantities, or cooking methods in a reconstruction are modern practical choices, not historical recoveries.',
      },
    ],
    ingredients: [
      {
        foodId: 'wheat',
        provenance: 'directly-attested',
        disclosure: 'Wheat is explicitly named in Ezekiel 4:9 (KJV).',
      },
      {
        foodId: 'barley',
        provenance: 'directly-attested',
        disclosure: 'Barley is explicitly named in Ezekiel 4:9 (KJV).',
      },
      {
        foodId: 'beans',
        provenance: 'historically-inferred',
        disclosure:
          'KJV translates the Hebrew "pol" as "beans." Other translations may read "lentils." The identification is inferred from translation, not direct proof.',
      },
      {
        foodId: 'spelt',
        provenance: 'historically-inferred',
        disclosure:
          'KJV translates "kussemeth" as "fitches" (a type of spelt or vetch). The exact plant identification remains debated among translators.',
      },
      {
        foodId: 'millet',
        provenance: 'historically-inferred',
        disclosure:
          'Millet is explicitly named in Ezekiel 4:9 (KJV) as "millet." Archaeological evidence confirms millet cultivation in the ancient Near East.',
      },
    ],
    researchStatus: 'in-progress',
    reconstructionStatus: 'not-started',
    publicationStatus: 'not-eligible',
    unresolvedQuestions: [
      'Which translation of Ezekiel 4:9 should be used as the primary recipe source — KJV or modern scholarly translations?',
      'What proportions of the five ingredients are historically plausible for a siege bread?',
      'What cooking method (stone-baked, clay oven, skillet) would be most appropriate for this context?',
      'How does the siege/symbolic context affect the recipe approach — should it be intentionally coarse or adapted for modern palates?',
      'What is the relationship between the modern commercial "Ezekiel bread" and any historical preparation?',
    ],
    reconstructionDisclosure:
      'This is a historically informed reconstruction of the bread described in Ezekiel 4:9. The biblical text explicitly names five ingredients (wheat, barley, beans/lentils, spelt/vetch, millet) but provides no proportions, quantities, or cooking instructions. The passage describes a siege/emergency bread — a deliberate act of prophetic symbolism, not a daily recipe. Any modern reconstruction is a practical kitchen adaptation that preserves the multi-grain concept while acknowledging that the original preparation was likely very different from modern bread.',
    scriptureRelationship:
      'Ezekiel 4:9 — the primary anchor: God instructs Ezekiel to make bread from wheat, barley, beans, spelt, and millet as a sign-act for the siege of Jerusalem. Ezekiel 4:10-15 — describes eating it by weight and with impure water, reinforcing the emergency/siege context. The passage is prophetic and symbolic, not a recipe instruction.',
    foodEvidence: {
      wheat: FOOD_EVIDENCE['wheat'],
      barley: FOOD_EVIDENCE['barley'],
      beans: FOOD_EVIDENCE['beans'],
      spelt: FOOD_EVIDENCE['spelt'],
      millet: FOOD_EVIDENCE['millet'],
    },
  },

  // ─── 4. GRILLED FISH ──────────────────────────────────────────────
  {
    id: 'recipe-grilled-fish',
    name: 'Grilled fish — inspired preparation',
    foodIds: ['fish-entity'],
    historicalContext:
      'Fish is one of the most explicitly attested foods associated with Jesus in the Gospel narratives. Luke 24:42-43 (KJV) records the risen Jesus eating fish: "And they gave him a piece of a broiled fish, and of an honeycomb. And he took it, and did eat before them." This is the most direct explicit eating reference for Jesus in the Gospels. Fish was a staple of the Galilean economy — the Sea of Galilee was a major fishing center, and archaeological evidence confirms extensive fishing operations in the first century. Multiple Gospel passages reference fish: the calling of the first disciples (who were fishermen), the feeding of the five thousand (which involved loaves and fishes), and post-resurrection fishing encounters. The specific preparation in Luke 24 is "broiled" (Greek: optos — roasted/baked/cooked over fire), suggesting a simple open-fire or stone preparation common in the region.',
    classification: 'scripture-inspired-preparation',
    evidence: [
      {
        layer: 'directly-attested',
        statement:
          'Luke 24:42-43 (KJV): "And they gave him a piece of a broiled fish, and of an honeycomb. And he took it, and did eat before them."',
      },
      {
        layer: 'directly-attested',
        statement:
          'The Greek word "optos" ( Luke 24:42) means roasted, baked, or cooked over fire — consistent with simple open-fire preparation common in the ancient Near East.',
      },
      {
        layer: 'inferred',
        statement:
          'Archaeological evidence from first-century Galilee confirms extensive fishing operations. Fish bones, weights, hooks, and net fragments have been found at multiple sites around the Sea of Galilee, including at Magdala, Capernaum, and Ginosar.',
        disclosure:
          'Archaeological fishing evidence confirms the importance of fish in the Galilean economy but does not prove specific cooking methods.',
      },
      {
        layer: 'inferred',
        statement:
          'Multiple Gospel passages reference fish in the context of meals: the calling of fishermen disciples (Matthew 4:18-22), the feeding of the five thousand (Matthew 14:17-21), and the miraculous catch of fish (John 21:9-13).',
        disclosure:
          'These passages confirm fish was a common food but do not provide specific cooking instructions.',
      },
      {
        layer: 'unresolved',
        statement:
          "The specific species of fish consumed in the Luke 24 passage is not identified in the text. Archaeological evidence suggests several species were commonly caught in the Sea of Galilee, including Tilapia (St. Peter's fish), carp, and sardines.",
        disclosure:
          'Any fish species used in a modern preparation is a practical choice, not a claim about the specific fish in Luke 24.',
      },
    ],
    ingredients: [
      {
        foodId: 'fish-entity',
        provenance: 'directly-attested',
        disclosure:
          'Fish consumption is explicitly attested in Luke 24:42-43 and supported by extensive archaeological evidence from Galilee.',
      },
    ],
    researchStatus: 'complete',
    reconstructionStatus: 'ready',
    publicationStatus: 'not-eligible',
    unresolvedQuestions: [
      'What specific fish species would have been most common in first-century Galilee for everyday consumption?',
      'What seasoning or preparation (salt, herbs, oil) was typically used for broiled fish in the region?',
      'How does the "broiled" (optos) preparation in Luke 24 relate to other ancient Near Eastern fish-cooking methods?',
    ],
    reconstructionDisclosure:
      'This recipe is a modern kitchen creation inspired by the biblical attestation of fish consumption. Luke 24:42-43 explicitly records Jesus eating broiled fish, providing the strongest direct evidence of a specific food consumption in the Gospels. Any preparation method, fish species, and seasonings used in this recipe are modern choices that honor the ancient tradition without claiming to replicate a specific historical preparation.',
    scriptureRelationship:
      'Luke 24:42-43 — explicit post-resurrection fish consumption. Matthew 4:18-22 — calling of fisherman disciples. Matthew 14:17-21 — feeding of the five thousand with loaves and fishes. John 21:9-13 — miraculous catch and breakfast by the Sea of Galilee. The Luke 24 passage is the strongest direct eating reference for Jesus.',
    foodEvidence: {
      'fish-entity': FOOD_EVIDENCE['fish-entity'],
    },
  },

  // ─── 5. BARLEY BREAD ──────────────────────────────────────────────
  {
    id: 'recipe-barley-bread',
    name: 'Barley bread — inspired preparation',
    foodIds: ['barley'],
    historicalContext:
      "Barley (Hebrew: se'orah) is one of the seven species of the Land of Israel (Deuteronomy 8:8) and was the staple grain of the common people in the ancient Near East. Barley bread was the bread of the poor and working class — cheaper and coarser than wheat bread. Archaeological evidence confirms barley cultivation in the region from the Neolithic period onward. The biblical text references barley in multiple contexts: Ruth gleaning barley (Ruth 2), the miracle of the barley loaves (John 6:9, 13), and barley as animal feed (1 Kings 4:28). Barley bread was likely prepared as simple flatbreads or thick cakes, cooked on heated stones or in clay ovens. The texture would have been dense and coarse compared to wheat bread.",
    classification: 'scripture-inspired-preparation',
    evidence: [
      {
        layer: 'directly-attested',
        statement:
          'Deuteronomy 8:8 (KJV): barley is named as one of the seven species of the Land of Israel: "A land of wheat, and barley, and vines, and fig trees, and pomegranates; a land of oil olive, and honey."',
      },
      {
        layer: 'directly-attested',
        statement:
          'John 6:9, 13 (KJV): "There is a lad here, which hath five barley loaves, and two small fishes... they took up of the fragments that remained twelve baskets full." Barley loaves are explicitly named in the feeding of the five thousand.',
      },
      {
        layer: 'inferred',
        statement:
          'Barley was the staple grain of common people in the ancient Near East — cheaper and more widely available than wheat. Archaeological evidence confirms barley cultivation across the region from the Neolithic period.',
        disclosure:
          'The general availability and use of barley is well supported, but specific bread-making techniques are not proven by archaeological evidence.',
      },
      {
        layer: 'inferred',
        statement:
          'Barley bread was likely prepared as flatbreads or thick cakes, cooked on heated stones, in clay ovens, or over open fire — consistent with ancient Near Eastern bread-making practices.',
        disclosure:
          'The specific cooking method is inferred from general ancient bread-making evidence, not from a specific biblical recipe instruction.',
      },
      {
        layer: 'unresolved',
        statement:
          'The biblical text does not provide a specific barley bread recipe — proportions, water ratios, or cooking instructions. The John 6:9 reference to "barley loaves" confirms barley bread existed but does not describe how it was made.',
        disclosure:
          'Any specific recipe is a modern practical adaptation inspired by the attested use of barley for bread.',
      },
    ],
    ingredients: [
      {
        foodId: 'barley',
        provenance: 'directly-attested',
        disclosure:
          'Barley is explicitly attested as a bread grain in John 6:9 and as one of the seven species in Deuteronomy 8:8.',
      },
    ],
    researchStatus: 'complete',
    reconstructionStatus: 'ready',
    publicationStatus: 'not-eligible',
    unresolvedQuestions: [
      'What type of barley flour (whole grain, hulled, pearled) would have been most commonly used for bread in the ancient Near East?',
      'What ratio of barley flour to water produces the most historically plausible bread texture?',
      'Were barley breads typically leavened or unleavened in everyday use?',
      'How does the "barley loaves" of John 6:9 relate to the broader barley bread tradition?',
    ],
    reconstructionDisclosure:
      'This recipe is a modern kitchen creation inspired by the biblical attestation of barley as a bread grain. Barley is named as one of the seven species of Israel (Deuteronomy 8:8) and barley loaves are explicitly mentioned in John 6:9. However, no specific barley bread recipe exists in the biblical text. Any preparation method, proportions, and techniques used in this recipe are modern choices that honor the ancient tradition.',
    scriptureRelationship:
      'Deuteronomy 8:8 — barley named as one of the seven species. John 6:9, 13 — barley loaves in the feeding of the five thousand. Ruth 2 — Ruth gleaning barley. 1 Kings 4:28 — barley as animal feed. The seven-species and John 6 references are the primary anchors.',
    foodEvidence: {
      barley: FOOD_EVIDENCE['barley'],
    },
  },

  // ─── 6. WHEAT FLATBREAD ───────────────────────────────────────────
  {
    id: 'recipe-wheat-flatbread',
    name: 'Wheat flatbread — inspired preparation',
    foodIds: ['wheat'],
    historicalContext:
      'Wheat (Hebrew: chittah) is one of the seven species of the Land of Israel (Deuteronomy 8:8) and the premium grain of the ancient Near East. Wheat bread was the bread of the wealthy and for special occasions — finer and more valued than barley bread. Archaeological evidence confirms wheat cultivation in the region from the Pre-Pottery Neolithic period (c. 9000 BCE). The biblical text references wheat frequently: the manna was compared to coriander seed (Exodus 16:31), wheat appears in economic and agricultural contexts throughout the Old Testament, and Jesus uses wheat in parables (Matthew 13:24-30, the parable of the wheat and tares). Flatbread (Hebrew: uggah) was the most common bread form in the ancient Near East — simple rounds of dough cooked on heated stones or in clay ovens.',
    classification: 'scripture-inspired-preparation',
    evidence: [
      {
        layer: 'directly-attested',
        statement:
          'Deuteronomy 8:8 (KJV): wheat is named as one of the seven species of the Land of Israel: "A land of wheat, and barley, and vines, and fig trees, and pomegranates; a land of oil olive, and honey."',
      },
      {
        layer: 'directly-attested',
        statement:
          'Exodus 16:31 (KJV): "And the house of Israel called the name thereof Manna: and it was like coriander seed, white; and the taste of it was like wafers made with honey." This compares manna to wheat-based food preparation.',
      },
      {
        layer: 'inferred',
        statement:
          'Archaeological evidence confirms wheat cultivation in the Levant from the Pre-Pottery Neolithic period. Wheat was the premium grain, used for finer breads and special occasions.',
        disclosure:
          'Archaeological wheat evidence confirms cultivation but does not prove specific bread-making recipes.',
      },
      {
        layer: 'inferred',
        statement:
          'Flatbread (Hebrew: uggah) was the most common bread form in the ancient Near East — simple rounds of dough cooked on heated stones, in clay ovens, or over open fire.',
        disclosure:
          'The general prevalence of flatbread is well supported, but specific preparation techniques vary by region and period.',
      },
      {
        layer: 'unresolved',
        statement:
          'The biblical text does not provide a specific wheat flatbread recipe. While wheat bread is referenced frequently, no passage gives exact ingredients, proportions, or cooking instructions.',
        disclosure:
          'Any specific recipe is a modern practical adaptation inspired by the attested use of wheat for bread.',
      },
    ],
    ingredients: [
      {
        foodId: 'wheat',
        provenance: 'directly-attested',
        disclosure:
          'Wheat is explicitly attested as a bread grain in Deuteronomy 8:8 and throughout the biblical text.',
      },
    ],
    researchStatus: 'complete',
    reconstructionStatus: 'ready',
    publicationStatus: 'not-eligible',
    unresolvedQuestions: [
      'What type of wheat flour (whole grain, refined, emmer, einkorn) would have been most commonly used for flatbread in the biblical period?',
      'What is the historical relationship between the Hebrew "uggah" (flatbread/cake) and other ancient Near Eastern flatbread traditions?',
      'Were wheat flatbreads typically leavened or unleavened in everyday use?',
      'How does the wheat flatbread tradition relate to the unleavened bread command (Exodus 12)?',
    ],
    reconstructionDisclosure:
      'This recipe is a modern kitchen creation inspired by the biblical attestation of wheat as the premium bread grain. Wheat is named as one of the seven species of Israel (Deuteronomy 8:8) and wheat-based breads appear throughout the biblical text. However, no specific wheat flatbread recipe exists in the biblical text. Any preparation method, proportions, and techniques used in this recipe are modern choices that honor the ancient tradition.',
    scriptureRelationship:
      'Deuteronomy 8:8 — wheat named as one of the seven species. Exodus 16:31 — manna compared to wheat-based food. Matthew 13:24-30 — parable of the wheat and tares. The seven-species reference is the primary anchor.',
    foodEvidence: {
      wheat: FOOD_EVIDENCE['wheat'],
    },
  },
];
