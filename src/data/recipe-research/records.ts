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
          '2 Samuel 17:28-29 (KJV): lentils among provisions brought to David — "And bring me bread, and corn, and ten cakes of figs, and a hundred cakes of raisins, and hundred of cheese, and sheep." (Cheese and lentils mentioned together as provision foods.)',
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

  // ─── 7. HONEY CAKES ────────────────────────────────────────────────
  {
    id: 'recipe-honey-cakes',
    name: 'Honey cakes — inspired preparation',
    foodIds: ['honey-entity'],
    historicalContext:
      'Honey (Hebrew: dvash) is one of the seven species of the Land of Israel (Deuteronomy 8:8) and appears throughout the biblical text as both a food and a symbol of abundance. The phrase "land flowing with milk and honey" (Exodus 3:8) establishes honey as a defining food of the promised land. While the biblical text does not provide a specific "honey cake" recipe, honey is referenced alongside baked preparations in several passages: Exodus 16:31 compares manna to "wafers made with honey," and 2 Samuel 6:19 records David distributing "a cake of bread" among the people. The Hebrew word for "cake" (uggoth/ishshah) refers to baked grain preparations — flatbreads, round cakes, or baked goods — not modern pastry cakes. Archaeological evidence confirms that honey was widely used as a sweetener in the ancient Near East, and baked grain preparations were common across the region.',
    classification: 'scripture-inspired-preparation',
    evidence: [
      {
        layer: 'directly-attested',
        statement:
          'Deuteronomy 8:8 (KJV): "A land of wheat, and barley, and vines, and fig trees, and pomegranates; a land of oil olive, and honey." Honey is named as one of the seven species of the Land of Israel.',
      },
      {
        layer: 'directly-attested',
        statement:
          'Exodus 16:31 (KJV): "And the house of Israel called the name thereof Manna: and it was like coriander seed, white; and the taste of it was like wafers made with honey." Honey is used in a food preparation context.',
      },
      {
        layer: 'directly-attested',
        statement:
          '2 Samuel 6:19 (KJV): David distributed food "among all the people, even among the whole multitude of Israel, both to the women, and to the men, to every one a cake of bread, and a good piece of flesh, and a flagon of wine." Cakes of bread are attested as a food item.',
      },
      {
        layer: 'inferred',
        statement:
          'Honey was a primary sweetener in the ancient Near East, used in baked preparations, drinks, and as a preserve. Archaeological and textual evidence from the region confirms widespread honey use in food.',
        disclosure:
          'The general use of honey as a sweetener is well supported, but specific recipe combinations are not proven by biblical texts.',
      },
      {
        layer: 'unresolved',
        statement:
          'Whether "honey" (dvash) in the biblical text refers to bee honey, date syrup, or both is a longstanding scholarly question. Different passages may refer to different substances, and the identification varies by context.',
        disclosure:
          'Any recipe using "honey" must acknowledge this translation/identification ambiguity. The choice of bee honey or date syrup in a modern recipe is a practical decision, not a settled historical conclusion.',
      },
      {
        layer: 'unresolved',
        statement:
          'The Hebrew words translated as "cake" (uggoth, ishshah) can refer to flatbread, round baked preparations, or grain cakes — they do not correspond to modern cake or pastry forms. The exact form of biblical "cakes" varies by context.',
        disclosure:
          'Any modern "honey cake" recipe is a contemporary creation using honey as a sweetener in a baked grain preparation. It does not replicate a specific biblical cake form.',
      },
    ],
    ingredients: [
      {
        foodId: 'honey-entity',
        provenance: 'directly-attested',
        disclosure:
          'Honey is explicitly named as one of the seven species in Deuteronomy 8:8 and appears in food preparation contexts throughout the biblical text. The specific identification (bee honey vs. date syrup) remains unresolved.',
      },
    ],
    researchStatus: 'in-progress',
    reconstructionStatus: 'not-started',
    publicationStatus: 'not-eligible',
    unresolvedQuestions: [
      'Does "honey" (dvash) in Deuteronomy 8:8 and other passages refer to bee honey, date syrup, or both?',
      'What form did biblical "cakes" (uggoth/ishshah) take — flatbread, round cake, or baked grain preparation?',
      'Were honey and grain combined in baked preparations in the biblical period, and if so, in what forms?',
      'What grain base would have been most common for sweet baked preparations in the ancient Near East?',
      'How does the modern concept of "honey cake" relate to any ancient Near Eastern baked preparation?',
    ],
    reconstructionDisclosure:
      'This is a scripture-inspired modern creation using honey — one of the seven species of Israel (Deuteronomy 8:8) — as a sweetener in a baked grain preparation. The biblical text attests honey as a food and references "cakes" in narrative contexts, but does not provide a specific honey cake recipe. The Hebrew word for "cake" refers to baked grain preparations, not modern pastry. Any specific recipe is a modern kitchen creation that honors the biblical attestation of honey without claiming to replicate an ancient preparation.',
    scriptureRelationship:
      'Deuteronomy 8:8 — honey named as one of the seven species. Exodus 16:31 — manna compared to wafers made with honey. 2 Samuel 6:19 — cakes distributed among the people. 1 Kings 14:3 — honey among provision items. The seven-species and Exodus 16 references are the primary anchors.',
    foodEvidence: {
      'honey-entity': FOOD_EVIDENCE['honey-entity'],
    },
  },

  // ─── 8. OLIVE OIL FLATBREAD ────────────────────────────────────────
  {
    id: 'recipe-olive-oil-flatbread',
    name: 'Olive oil flatbread — inspired preparation',
    foodIds: ['olive-oil'],
    historicalContext:
      'Olive oil (Hebrew: shemen zayit) is one of the seven species of the Land of Israel (Deuteronomy 8:8) and was the primary cooking fat, preservative, and illumination fuel of the biblical world. Archaeological evidence confirms olive cultivation in the Levant from the Chalcolithic period (c. 4000 BCE) onward, with olive presses found at numerous ancient sites. The biblical text references olive oil in multiple food contexts: Leviticus 2:4-7 describes grain preparations cooked with oil in ovens, on flatplates, and in pans; Exodus 29:2-3 specifies unleavened cakes "mingled with oil" for priestly offerings; and 1 Kings 17:12 references oil alongside meal as household staples. Flatbread (Hebrew: uggah) was the most common bread form in the ancient Near East — simple rounds of dough cooked on heated stones, in clay ovens, or over open fire. The combination of olive oil and flatbread is strongly supported by the attested use of oil in grain preparations, though no specific "olive oil flatbread recipe" exists in the biblical text.',
    classification: 'scripture-inspired-preparation',
    evidence: [
      {
        layer: 'directly-attested',
        statement:
          'Deuteronomy 8:8 (KJV): "A land of wheat, and barley, and vines, and fig trees, and pomegranates; a land of oil olive, and honey." Olive oil is named as one of the seven species of the Land of Israel.',
      },
      {
        layer: 'directly-attested',
        statement:
          'Leviticus 2:4-7 (KJV): "And if thou bring an oblation of a meat offering baken in the oven, it shall be unleavened cakes of fine flour mingled with oil... And if thy oblation be a meat offering baken in a pan, it shall be of fine flour unleavened, mingled with oil." Oil is explicitly used in grain/bread preparations.',
      },
      {
        layer: 'directly-attested',
        statement:
          'Exodus 29:2-3 (KJV): "And unleavened cakes, and cakes unleavened tempered with oil, and wafers unleavened anointed with oil." Oil is explicitly used in the preparation of cakes and wafers.',
      },
      {
        layer: 'inferred',
        statement:
          'Archaeological evidence confirms olive cultivation and oil production in the Levant from the Chalcolithic period onward. Olive presses have been found at numerous ancient sites across the region.',
        disclosure:
          'Archaeological olive evidence confirms cultivation and production but does not prove specific recipe combinations with flatbread.',
      },
      {
        layer: 'inferred',
        statement:
          'Flatbread (Hebrew: uggah) was the most common bread form in the ancient Near East. The combination of olive oil with flatbread is strongly implied by the attested use of oil in grain preparations (Leviticus 2, Exodus 29).',
        disclosure:
          'The prevalence of both olive oil and flatbread is well supported, but the specific combination in a single recipe is a modern practical choice inspired by the biblical context.',
      },
      {
        layer: 'unresolved',
        statement:
          'The biblical text does not provide a specific "olive oil flatbread recipe." While oil is used with grain preparations in Leviticus 2 and Exodus 29, these are offering prescriptions, not everyday cooking instructions.',
        disclosure:
          'Any specific recipe is a modern practical adaptation inspired by the attested use of olive oil in grain preparations.',
      },
    ],
    ingredients: [
      {
        foodId: 'olive-oil',
        provenance: 'directly-attested',
        disclosure:
          'Olive oil is explicitly named as one of the seven species in Deuteronomy 8:8 and is used in grain preparations in Leviticus 2:4-7 and Exodus 29:2-3.',
      },
    ],
    researchStatus: 'in-progress',
    reconstructionStatus: 'not-started',
    publicationStatus: 'not-eligible',
    unresolvedQuestions: [
      'What type of wheat or grain flour would have been most commonly used for flatbread in the biblical period?',
      'Was olive oil commonly added to everyday flatbread, or primarily used in ritual/special-occasion preparations?',
      'What flatbread-making techniques (stone, clay oven, pan) are best supported by archaeological evidence for the biblical period?',
      'How does the olive oil flatbread concept relate to modern Mediterranean and Middle Eastern flatbread traditions?',
    ],
    reconstructionDisclosure:
      'This is a scripture-inspired modern creation using olive oil — one of the seven species of Israel (Deuteronomy 8:8) — in a flatbread preparation. The biblical text attests olive oil as a staple and explicitly describes oil used in grain preparations (Leviticus 2:4-7, Exodus 29:2-3), but does not provide a specific olive oil flatbread recipe. Any specific recipe is a modern kitchen creation that honors the biblical attestation of olive oil and flatbread without claiming to replicate an ancient preparation.',
    scriptureRelationship:
      'Deuteronomy 8:8 — olive oil named as one of the seven species. Leviticus 2:4-7 — oil used in grain/bread preparations. Exodus 29:2-3 — oil in unleavened cakes and wafers. 1 Kings 17:12 — oil as household staple. The seven-species and Leviticus 2 references are the primary anchors.',
    foodEvidence: {
      'olive-oil': FOOD_EVIDENCE['olive-oil'],
    },
  },

  // ─── 9. BITTER HERBS ───────────────────────────────────────────────
  {
    id: 'recipe-bitter-herbs',
    name: 'Bitter herbs — Passover preparation',
    foodIds: ['bitter-herbs'],
    historicalContext:
      'Bitter herbs (Hebrew: marorim) are commanded as part of the Passover meal in Exodus 12:8: "And they shall eat the flesh in that night, roast with fire, and unleavened bread; and with bitter herbs they shall eat it." The command is reinforced in Numbers 9:11 for the second Passover. The Hebrew word marorim is a plural form of maror (bitter), functioning as a category term for bitter plants rather than a specific botanical identification. The Mishnah (Pesachim 2:6) later lists specific plants — including chicory, endive, and others — but these are post-biblical rabbinical traditions, not proof of the original identification. No single plant is definitively established by the biblical text as "the" bitter herb. Archaeological and botanical evidence confirms that several bitter plants grew wild in the region and would have been available during the spring Passover season.',
    classification: 'scripture-inspired-preparation',
    evidence: [
      {
        layer: 'directly-attested',
        statement:
          'Exodus 12:8 (KJV): "And they shall eat the flesh in that night, roast with fire, and unleavened bread; and with bitter herbs they shall eat it." Bitter herbs are explicitly commanded as part of the Passover meal.',
      },
      {
        layer: 'directly-attested',
        statement:
          'Numbers 9:11 (KJV): "They shall keep it on the fourteenth day of the second month at even... they shall eat it with unleavened bread and bitter herbs." The command is reinforced for the second Passover.',
      },
      {
        layer: 'inferred',
        statement:
          'The Hebrew word marorim is a category term for bitter plants, not a specific botanical identification. The plural form suggests a selection or mixture of bitter greens rather than a single species.',
        disclosure:
          'The category interpretation is widely accepted among scholars, but the exact plants intended by the original command remain uncertain.',
      },
      {
        layer: 'inferred',
        statement:
          'Several bitter plants grew wild in the region and would have been available during the spring Passover season, including varieties of chicory, endive, dandelion, and other wild greens.',
        disclosure:
          'The availability of bitter plants in the region is historically plausible, but this does not prove which specific plants were used in the original Passover.',
      },
      {
        layer: 'unresolved',
        statement:
          'Which specific plant or plants the original Passover command intended is not identified in the biblical text. The Mishnah (Pesachim 2:6) lists specific plants, but these represent post-biblical rabbinical tradition, not proof of the original identification.',
        disclosure:
          'Any specific plant choice in a modern preparation is a practical decision, not a claim about the original Passover bitter herbs. The recipe should present a selection of bitter greens as a modern interpretation of the biblical command.',
      },
      {
        layer: 'unresolved',
        statement:
          'Whether the original Passover bitter herbs were a single plant, a specific mixture, or any available bitter plant is unknown. The biblical text provides no further specification beyond "bitter herbs."',
        disclosure:
          'The uncertainty about plant identification is a fundamental limitation of the biblical text and cannot be resolved without evidence that does not currently exist.',
      },
    ],
    ingredients: [
      {
        foodId: 'bitter-herbs',
        provenance: 'directly-attested',
        disclosure:
          'Bitter herbs are explicitly commanded in Exodus 12:8 as part of the Passover meal. The specific plant identification is not provided in the biblical text.',
      },
    ],
    researchStatus: 'in-progress',
    reconstructionStatus: 'not-started',
    publicationStatus: 'not-eligible',
    unresolvedQuestions: [
      'Which specific plant or plants did the original Passover command intend by "bitter herbs" (marorim)?',
      'Does the Mishnaic list (Pesachim 2:6) reflect the original identification or represent later rabbinical interpretation?',
      'Were the bitter herbs a single plant, a specific mixture, or any available bitter plant?',
      'How does the Passover bitter-herb command relate to broader ancient Near Eastern use of bitter plants in meals?',
      'What is the relationship between the biblical marorim and the bitter herbs used in modern Passover seders?',
    ],
    reconstructionDisclosure:
      'This is a scripture-inspired modern preparation honoring the Passover command for bitter herbs (Exodus 12:8). The biblical text explicitly commands "bitter herbs" as part of the Passover meal but does not identify the specific plant or plants. The Hebrew word marorim is a category term for bitter plants. Any specific plant choice in this preparation is a modern interpretation, not a claim about the original Passover bitter herbs. The recipe should be understood as a modern kitchen creation that honors the biblical tradition while acknowledging the genuine uncertainty about plant identification.',
    scriptureRelationship:
      'Exodus 12:8 — primary anchor: bitter herbs commanded alongside Passover lamb and unleavened bread. Numbers 9:11 — reinforcement for the second Passover. The command is explicit about the concept (bitter herbs with the Passover meal) but provides no botanical specification.',
    foodEvidence: {
      'bitter-herbs': FOOD_EVIDENCE['bitter-herbs'],
    },
  },
];
