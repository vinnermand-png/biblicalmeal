/**
 * V3C.1 publication-readiness gate.
 *
 * Central validator deciding whether an entry MAY become publicly visible.
 * Grounded in the existing V3B architecture - it invents no new editorial
 * philosophy:
 * - Workflow lifecycle: src/lib/workflow.ts (`approved` unlocks publication)
 * - Citation obligations: source-citations.ts CITATION_REQUIREMENTS
 *   (ingredients/articles mandate scripture sources)
 * - Recipe honesty: editorial-trust.ts METHODOLOGY_RULES (exactly one
 *   classification; researched/reconstructed need a cited basis)
 * - Canonical ownership: seo-master-map.ts SEO_TARGETS (not-pursuing targets
 *   can never receive published content)
 * - Inventory alignment: food-universe.ts (evidence status preserved, never
 *   flattened)
 *
 * Pure module: no astro:content imports so it stays unit-testable.
 */

import { FOOD_UNIVERSE } from '../data/food-universe';
import { SEO_TARGETS } from '../data/seo-master-map';
import { questionsForSubject } from '../data/research/questions';
import { RESEARCH_DOSSIERS } from '../data/research/dossiers';
import { RESEARCH_CLAIMS } from '../data/research/claims';
import { researchComplete, type WorkflowStatus } from './workflow';

export interface GateOptions {
  /**
   * V3C.2: when true, a declared researchSubjectId is resolved through the
   * research layer and unresolved questions become gate output. Off by
   * default so existing call sites keep their exact behavior.
   */
  consumeResearchState?: boolean;
}

export type GateCollection = 'ingredients' | 'recipes' | 'articles';

export interface PublicationIssue {
  code: string;
  message: string;
}

export interface PublicationReadiness {
  ready: boolean;
  blockers: PublicationIssue[];
  warnings: PublicationIssue[];
}

/**
 * Minimal structural shape accepted by the gate. Real CollectionEntry values
 * satisfy it; tests can build lightweight synthetic entries.
 */
export interface GateEntry<TData extends object = Record<string, unknown>> {
  collection: GateCollection;
  /** Slug/route segment of the entry. */
  id: string;
  status?: string;
  workflowStatus?: WorkflowStatus;
  data: TData;
  body?: string;
}

const MIN_DESCRIPTION_CHARS = 40;
const MIN_INSPIRED_NOTE_CHARS = 20;
const MIN_ARTICLE_BODY_WORDS = 100;

/** Collections accept these SeoTarget contentTypes as canonical owners. */
const COLLECTION_CONTENT_TYPES: Record<GateCollection, readonly string[]> = {
  ingredients: ['ingredient'],
  recipes: ['recipe'],
  articles: ['pillar', 'article'],
};

function str(data: object, key: string): string | undefined {
  const value = (data as Record<string, unknown>)[key];
  return typeof value === 'string' ? value : undefined;
}

function arr<T = unknown>(data: object, key: string): T[] | undefined {
  const value = (data as Record<string, unknown>)[key];
  return Array.isArray(value) ? (value as T[]) : undefined;
}

function issue(code: string, message: string): PublicationIssue {
  return { code, message };
}

function wordCount(text: string | undefined): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function validatePublication(
  entry: GateEntry,
  options: GateOptions = {},
): PublicationReadiness {
  const blockers: PublicationIssue[] = [];
  const warnings: PublicationIssue[] = [];
  const data = entry.data;

  // ---- Common gates ----------------------------------------------------

  const workflow = entry.workflowStatus ?? 'research-needed';
  if (workflow !== 'approved') {
    blockers.push(
      issue(
        'workflow-not-approved',
        `Editorial workflow is "${workflow}"; publication requires "approved".`,
      ),
    );
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.id)) {
    blockers.push(
      issue('invalid-route-slug', `"${entry.id}" is not a valid URL slug.`),
    );
  }

  // Optional canonical-ownership link into the V3B master map.
  const seoTargetId = str(data, 'seoTargetId');
  if (seoTargetId) {
    const target = SEO_TARGETS.find((t) => t.id === seoTargetId);
    if (!target) {
      blockers.push(
        issue(
          'canonical-target-invalid',
          `seoTargetId "${seoTargetId}" does not exist in the SEO master map.`,
        ),
      );
    } else {
      if (target.status === 'not-pursuing') {
        blockers.push(
          issue(
            'canonical-target-not-pursuing',
            `Target "${target.id}" is marked not-pursuing; it cannot own published content.`,
          ),
        );
      }
      if (
        !COLLECTION_CONTENT_TYPES[entry.collection].includes(target.contentType)
      ) {
        blockers.push(
          issue(
            'canonical-content-type-mismatch',
            `Target "${target.id}" has contentType "${target.contentType}", which cannot be owned by ${entry.collection}.`,
          ),
        );
      }
      const expectedSlug = target.targetRoute.split('/').filter(Boolean).pop();
      if (expectedSlug && expectedSlug !== entry.id) {
        blockers.push(
          issue(
            'canonical-route-mismatch',
            `Entry slug "${entry.id}" does not match canonical route "${target.targetRoute}".`,
          ),
        );
      }
    }
  }

  // V3C.2: consume real research state when the entry declares a subject.
  if (options.consumeResearchState) {
    const researchSubjectId = str(data, 'researchSubjectId');
    if (researchSubjectId) {
      const dossier = RESEARCH_DOSSIERS.find(
        (d) => d.id === researchSubjectId || d.subjectId === researchSubjectId,
      );
      const hasRecords =
        dossier !== undefined ||
        questionsForSubject(researchSubjectId).length > 0 ||
        RESEARCH_CLAIMS.some((c) => c.subjectId === researchSubjectId);
      if (!hasRecords) {
        blockers.push(
          issue(
            'research-subject-invalid',
            `researchSubjectId "${researchSubjectId}" matches no dossier or research subject.`,
          ),
        );
      }
      // A dossier resolves to several equivalent subject keys: its own
      // subject id and every related canonical target id.
      const subjectKeys = new Set<string>([researchSubjectId]);
      if (dossier) {
        subjectKeys.add(dossier.subjectId);
        for (const targetId of dossier.relatedTargetIds) {
          subjectKeys.add(targetId);
        }
      }
      for (const key of subjectKeys) {
        for (const q of questionsForSubject(key)) {
          if (q.resolution === 'blocker') {
            blockers.push(
              issue(
                `unresolved-research-${q.id}`,
                `${q.question} (${q.kind}) must be resolved before publication.`,
              ),
            );
          } else if (q.resolution === 'warning') {
            warnings.push(
              issue(
                `research-disclosure-${q.id}`,
                `Disclose on-page: ${q.question}`,
              ),
            );
          }
        }
      }
    }
  }

  switch (entry.collection) {
    case 'ingredients':
      validateIngredient(entry, workflow, blockers, warnings);
      break;
    case 'recipes':
      validateRecipe(entry, workflow, blockers, warnings);
      break;
    case 'articles':
      validateArticle(entry, blockers);
      break;
  }

  return { ready: blockers.length === 0, blockers, warnings };
}

function validateIngredient(
  entry: GateEntry,
  workflow: WorkflowStatus,
  blockers: PublicationIssue[],
  warnings: PublicationIssue[],
): void {
  const data = entry.data;
  const description = str(data, 'description');
  if (!description || description.trim().length < MIN_DESCRIPTION_CHARS) {
    blockers.push(
      issue(
        'missing-description',
        'A meaningful description (40+ characters) is required.',
      ),
    );
  }

  const scriptureRefs = arr(data, 'scriptureRefs') ?? [];
  const scriptureNote = str(data, 'scriptureNote');

  // CITATION_REQUIREMENTS.ingredient.mandatory = ['scripture'].
  if (scriptureRefs.length === 0) {
    blockers.push(
      issue(
        'missing-scripture-refs',
        'Ingredient pages must cite at least one scripture reference.',
      ),
    );
  } else if (!scriptureNote || scriptureNote.trim().length === 0) {
    blockers.push(
      issue(
        'unframed-scripture-refs',
        'Listed scripture references require a scriptureNote framing sentence.',
      ),
    );
  }

  const history = str(data, 'history');
  if (history) {
    // Historical claims demand completed research before they go live.
    if (!researchComplete(workflow)) {
      blockers.push(
        issue(
          'historical-claims-before-research',
          '"history" content exists but research is not complete.',
        ),
      );
    }
  } else {
    warnings.push(
      issue(
        'no-historical-context',
        'No historical context yet - page will feel thin against SERP competitors.',
      ),
    );
  }

  const universeId = str(data, 'foodUniverseId');
  if (!universeId) {
    warnings.push(
      issue(
        'no-universe-linkage',
        'Not linked to a food-universe entity; evidence status cannot be verified.',
      ),
    );
    return;
  }
  const entity = FOOD_UNIVERSE.find((f) => f.id === universeId);
  if (!entity) {
    blockers.push(
      issue(
        'universe-entity-invalid',
        `foodUniverseId "${universeId}" does not exist in the food universe.`,
      ),
    );
    return;
  }
  if (entity.classification === 'not-pursuing') {
    blockers.push(
      issue(
        'ingredient-entity-not-pursuing',
        `Food-universe entity "${entity.id}" is classified not-pursuing.`,
      ),
    );
  }
  if (
    history &&
    (entity.evidence === 'requires-verification' ||
      entity.evidence === 'uncertain-identification')
  ) {
    warnings.push(
      issue(
        'uncertain-evidence-on-page',
        `Entity "${entity.id}" carries evidence "${entity.evidence}" - uncertainty must stay visible on the page.`,
      ),
    );
  }
}

function validateRecipe(
  entry: GateEntry,
  workflow: WorkflowStatus,
  blockers: PublicationIssue[],
  warnings: PublicationIssue[],
): void {
  const data = entry.data;
  const description = str(data, 'description');
  if (!description || description.trim().length < MIN_DESCRIPTION_CHARS) {
    blockers.push(
      issue(
        'missing-description',
        'A meaningful description (40+ characters) is required.',
      ),
    );
  }

  const recipeIngredients = arr<{ item?: string }>(data, 'ingredients') ?? [];
  const instructions = arr<string>(data, 'instructions') ?? [];

  if (recipeIngredients.length === 0) {
    blockers.push(issue('missing-ingredients', 'Recipe lists no ingredients.'));
  } else if (
    recipeIngredients.some((i) => !i.item || i.item.trim().length === 0)
  ) {
    blockers.push(
      issue('invalid-ingredients', 'Every ingredient needs a non-empty item.'),
    );
  }

  if (instructions.length === 0) {
    blockers.push(
      issue('missing-instructions', 'Recipe lists no instructions.'),
    );
  }

  const inspiredNote = str(data, 'inspiredNote');
  if (!inspiredNote || inspiredNote.trim().length < MIN_INSPIRED_NOTE_CHARS) {
    blockers.push(
      issue(
        'missing-inspired-note',
        'Honesty framing (inspiredNote, 20+ chars) is required on every recipe.',
      ),
    );
  }

  const recipeType = str(data, 'recipeType') ?? 'inspired';
  const scriptureRefs = arr(data, 'scriptureRefs') ?? [];
  if (recipeType === 'researched' || recipeType === 'reconstructed') {
    // METHODOLOGY_RULES (recipes): historical classifications require a cited
    // basis, so they also require completed research.
    if (!researchComplete(workflow)) {
      blockers.push(
        issue(
          'historical-recipe-before-research',
          `"${recipeType}" recipes require research-complete or later.`,
        ),
      );
    }
    if (scriptureRefs.length === 0) {
      blockers.push(
        issue(
          'historical-recipe-without-basis',
          `"${recipeType}" recipes require cited scripture/historical anchors.`,
        ),
      );
    }
    if (recipeType === 'reconstructed') {
      warnings.push(
        issue(
          'reconstruction-faces-extra-review',
          'Reconstruction claims face the strictest review (per-ingredient sourcing where knowable).',
        ),
      );
    }
  }
}

function validateArticle(entry: GateEntry, blockers: PublicationIssue[]): void {
  const data = entry.data;
  const excerpt = str(data, 'excerpt');
  if (!excerpt || excerpt.trim().length < MIN_DESCRIPTION_CHARS) {
    blockers.push(
      issue('missing-excerpt', 'Articles require a meaningful excerpt.'),
    );
  }

  const pubDate = (data as Record<string, unknown>).pubDate;
  if (!(pubDate instanceof Date) && typeof pubDate !== 'string') {
    blockers.push(
      issue('missing-pub-date', 'Articles require a publication date.'),
    );
  }

  if (wordCount(entry.body) < MIN_ARTICLE_BODY_WORDS) {
    blockers.push(
      issue(
        'thin-body',
        `Article body has fewer than ${MIN_ARTICLE_BODY_WORDS} words.`,
      ),
    );
  }

  // CITATION_REQUIREMENTS.article.mandatory = ['scripture'].
  const scriptureRefs = arr(data, 'scriptureRefs') ?? [];
  if (scriptureRefs.length === 0) {
    blockers.push(
      issue(
        'missing-scripture-refs',
        'Articles must cite at least one scripture reference.',
      ),
    );
  }
}
