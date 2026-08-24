import type { RecipeContentRecord } from './types';
import { GRILLED_FISH_CONTENT } from './recipes/grilled-fish';
import { BARLEY_BREAD_CONTENT } from './recipes/barley-bread';
import { WHEAT_FLATBREAD_CONTENT } from './recipes/wheat-flatbread';
import { UNLEAVENED_BREAD_CONTENT } from './recipes/unleavened-bread';
import { LENTIL_POTTAGE_CONTENT } from './recipes/lentil-pottage';
import { EZEKIEL_BREAD_CONTENT } from './recipes/ezekiel-bread';
import { OLIVE_OIL_FLATBREAD_CONTENT } from './recipes/olive-oil-flatbread';
import { HONEY_CAKES_CONTENT } from './recipes/honey-cakes';
import { BITTER_HERBS_CONTENT } from './recipes/bitter-herbs';

/**
 * V3C.18 + V3C.44C + V3C.44D + V3C.44E + V3C.44G — Recipe Content Records.
 *
 * The V3C.17 → V3C.18 pipeline is preserved: research records own evidence
 * and reconstruction; content records own practical quantities and steps.
 *
 * V3C.44C Wave 1 adds three scripture-inspired-preparation recipes
 * (Grilled Fish, Barley Bread, Wheat Flatbread).
 *
 * V3C.44D Wave 2 upgrades the original two historically-informed-
 * reconstruction seeds (Unleavened Bread, Lentil Pottage) from minimal
 * drafts to production-quality content.
 *
 * V3C.44E Wave 3 adds Ezekiel Bread — a historically-informed-reconstruction
 * based on Ezekiel 4:9.
 *
 * V3C.44G Wave 4 adds three scripture-inspired-preparation recipes
 * (Olive Oil Flatbread, Honey Cakes, Bitter Herbs) using the V3C.44F
 * research records.
 *
 * Content production and research-state progression are separate lifecycle
 * concerns. Research records may remain in-progress while content is
 * produced alongside them.
 *
 * All records are intentionally draft and non-public. The practical
 * quantities and timings are modern kitchen choices, not recovered ancient
 * measurements or exact biblical preparation instructions.
 */
export const RECIPE_CONTENT_RECORDS: readonly RecipeContentRecord[] = [
  // ─── V3C.44D WAVE 2 — HISTORICALLY-INFORMED RECONSTRUCTIONS ─────────
  UNLEAVENED_BREAD_CONTENT,
  LENTIL_POTTAGE_CONTENT,

  // ─── V3C.44E WAVE 3 — HISTORICALLY-INFORMED RECONSTRUCTION ──────────
  EZEKIEL_BREAD_CONTENT,

  // ─── V3C.44C WAVE 1 — SCRIPTURE-INSPIRED PREPARATIONS ──────────────
  GRILLED_FISH_CONTENT,
  BARLEY_BREAD_CONTENT,
  WHEAT_FLATBREAD_CONTENT,

  // ─── V3C.44G WAVE 4 — SCRIPTURE-INSPIRED PREPARATIONS ──────────────
  OLIVE_OIL_FLATBREAD_CONTENT,
  HONEY_CAKES_CONTENT,
  BITTER_HERBS_CONTENT,
];
