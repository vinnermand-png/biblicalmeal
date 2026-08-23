import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';
import { ART_KINDS } from './lib/visuals';
import { WORKFLOW_STATUSES, type WorkflowStatus } from './lib/workflow';

export const scriptureRefSchema = z.object({
  book: z.string().min(1),
  chapter: z.number().int().positive(),
  verseStart: z.number().int().positive(),
  verseEnd: z.number().int().positive().optional(),
});

export const entryStatus = z.enum(['draft', 'in-review', 'published']);

/**
 * V3C workflow axis. Independent from `entryStatus` (public visibility):
 * an entry may only be `published` when its editorial workflow has reached
 * `approved`. Existing entries without this field default to
 * 'research-needed', so nothing pre-V3C silently becomes publishable.
 */
export const workflowStatusSchema = z
  .enum(WORKFLOW_STATUSES)
  .default('research-needed');

type WithWorkflow = {
  status: z.infer<typeof entryStatus>;
  workflowStatus: WorkflowStatus;
};

/** Schema-level lock: published requires the full editorial lifecycle. */
function withPublishGate<T extends z.ZodType<WithWorkflow>>(schema: T) {
  return schema.superRefine((data, ctx) => {
    if (data.status === 'published' && data.workflowStatus !== 'approved') {
      ctx.addIssue({
        code: 'custom',
        path: ['workflowStatus'],
        message:
          'Published entries require workflowStatus "approved" (V3C publication gate).',
      });
    }
  });
}

const ingredients = defineCollection({
  loader: glob({ pattern: '**/[^_]*.mdx', base: './src/content/ingredients' }),
  schema: withPublishGate(
    z.object({
      name: z.string(),
      description: z.string(),
      category: z.enum([
        'fruit',
        'vegetable',
        'grain',
        'legume',
        'spice',
        'herb',
        'oil',
        'sweetener',
        'dairy',
        'beverage',
        'other',
      ]),
      scriptureRefs: z.array(scriptureRefSchema).default([]),
      scriptureNote: z
        .string()
        .optional()
        .describe(
          'Short framing sentence for the listed scripture references.',
        ),
      history: z
        .string()
        .optional()
        .describe(
          'Verified historical context only. Leave unset until evidence is reviewed.',
        ),
      modern: z
        .string()
        .optional()
        .describe(
          'Modern culinary context: how the ingredient is bought and used today.',
        ),
      art: z.enum(ART_KINDS).optional(),
      featured: z.boolean().default(false),
      order: z.number().int().optional(),
      status: entryStatus.default('draft'),
      workflowStatus: workflowStatusSchema,
      image: z.string().optional(),
      /**
       * Optional link into the V3B food universe (FoodEntity.id). Enables
       * evidence lookup and inventory classification at the publication gate
       * without duplicating universe data in frontmatter.
       */
      foodUniverseId: z.string().optional(),
      /**
       * Optional link into the V3C research layer (dossier id or subject id).
       * When present, the publication gate consumes real research state
       * (blocking/warning questions) instead of manual assertions only.
       */
      researchSubjectId: z.string().optional(),
    }),
  ),
});

const recipes = defineCollection({
  loader: glob({ pattern: '**/[^_]*.mdx', base: './src/content/recipes' }),
  schema: withPublishGate(
    z.object({
      title: z.string(),
      description: z.string(),
      inspiredNote: z
        .string()
        .describe(
          'Framing statement distinguishing inspired recipes from historical reconstruction.',
        ),
      servings: z.number().int().positive().optional(),
      prepMinutes: z.number().int().positive().optional(),
      cookMinutes: z.number().int().positive().optional(),
      difficulty: z.enum(['easy', 'medium', 'project']).optional(),
      tags: z.array(z.string()).default([]),
      recipeType: z
        .enum(['inspired', 'researched', 'reconstructed'])
        .default('inspired')
        .describe(
          'inspired = modern creation using biblical-world ingredients; ' +
            'researched = built from cited historical sources; ' +
            'reconstructed = scholarly best-effort assembly.',
        ),
      ingredients: z
        .array(
          z.object({
            item: z.string().min(1),
            // coerce: YAML like `quantity: 2` arrives as a number.
            quantity: z.coerce.string().optional(),
          }),
        )
        .default([]),
      instructions: z.array(z.string().min(1)).default([]),
      ingredientRefs: z.array(reference('ingredients')).default([]),
      art: z.enum(ART_KINDS).optional(),
      scriptureRefs: z.array(scriptureRefSchema).default([]),
      featured: z.boolean().default(false),
      status: entryStatus.default('draft'),
      workflowStatus: workflowStatusSchema,
      image: z.string().optional(),
      /** Optional link into the V3C research layer (see ingredients). */
      researchSubjectId: z.string().optional(),
    }),
  ),
});

const articles = defineCollection({
  loader: glob({ pattern: '**/[^_]*.mdx', base: './src/content/articles' }),
  schema: withPublishGate(
    z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      excerpt: z.string(),
      category: z.enum([
        'history',
        'ingredient',
        'tradition',
        'passage',
        'kitchen',
      ]),
      relatedIngredients: z.array(reference('ingredients')).default([]),
      relatedRecipes: z.array(reference('recipes')).default([]),
      art: z.enum(ART_KINDS).optional(),
      scriptureRefs: z.array(scriptureRefSchema).default([]),
      pubDate: z.coerce.date().optional(),
      status: entryStatus.default('draft'),
      workflowStatus: workflowStatusSchema,
      image: z.string().optional(),
      /**
       * Optional canonical-ownership link to the V3B SEO Master Map
       * (SeoTarget.id). Validated at the publication gate: the target must
       * exist, must not be not-pursuing, and its content type must match.
       */
      seoTargetId: z.string().optional(),
      /**
       * Optional link into the V3C research layer (dossier id or subject
       * id). When present, the publication gate consumes real research
       * state (blocking/warning questions) instead of manual assertions.
       */
      researchSubjectId: z.string().optional(),
    }),
  ),
});

export const collections = { ingredients, recipes, articles };
