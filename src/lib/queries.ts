import { getCollection, type CollectionEntry } from 'astro:content';
import { draftsPreview } from './content';

type IngredientEntry = CollectionEntry<'ingredients'>;
type RecipeEntry = CollectionEntry<'recipes'>;
type ArticleEntry = CollectionEntry<'articles'>;

/**
 * Status-aware content access.
 * Listing pages and static paths must use these helpers instead of calling
 * getCollection directly, so draft content never leaks into production.
 */
export async function getVisibleIngredients(): Promise<IngredientEntry[]> {
  const entries = await getCollection('ingredients');
  return sortIngredients(draftsPreview() ? entries : publishedOnly(entries));
}

export async function getVisibleRecipes(): Promise<RecipeEntry[]> {
  const entries = await getCollection('recipes');
  return draftsPreview() ? entries : publishedOnly(entries);
}

export async function getVisibleArticles(): Promise<ArticleEntry[]> {
  const entries = await getCollection('articles');
  return draftsPreview() ? entries : publishedOnly(entries);
}

function publishedOnly<T extends { data: { status: string } }>(
  entries: T[],
): T[] {
  return entries.filter((entry) => entry.data.status === 'published');
}

function sortIngredients(entries: IngredientEntry[]): IngredientEntry[] {
  return [...entries].sort(
    (a, b) => (a.data.order ?? 99) - (b.data.order ?? 99),
  );
}

export interface RelatedContent {
  ingredients: IngredientEntry[];
  recipes: RecipeEntry[];
  articles: ArticleEntry[];
}

const RELATED_LIMIT = 3;

/** reference() fields resolve to { collection, id } — compare on `.id`. */
const referencesIngredient = (
  recipe: RecipeEntry,
  ingredientId: string,
): boolean => recipe.data.ingredientRefs.some((ref) => ref.id === ingredientId);

/**
 * Central related-content resolver. Relationships are declared in exactly one
 * place per direction:
 *   recipe.frontmatter.ingredientRefs            → recipe ↔ ingredient
 *   article.frontmatter.relatedRecipes / …       → article ↔ …
 * Anything unresolved is filled with same-collection neighbours so pages
 * never dead-end, without fabricating connections.
 */
export async function getRelated(current: {
  collection: 'ingredients' | 'recipes' | 'articles';
  id: string;
}): Promise<RelatedContent> {
  const [allIngredients, allRecipes, allArticles] = await Promise.all([
    getVisibleIngredients(),
    getVisibleRecipes(),
    getVisibleArticles(),
  ]);

  let ingredients: IngredientEntry[] = [];
  let recipes: RecipeEntry[] = [];
  let articles: ArticleEntry[] = [];

  if (current.collection === 'recipes') {
    const self = allRecipes.find((entry) => entry.id === current.id);
    const pantry = new Set(
      (self?.data.ingredientRefs ?? []).map((ref) => ref.id),
    );
    ingredients = allIngredients.filter((entry) => pantry.has(entry.id));
    articles = allArticles.filter((article) => {
      const data = article.data;
      return (
        data.relatedRecipes?.some((ref) => ref.id === current.id) ||
        data.relatedIngredients?.some((ref) => pantry.has(ref.id))
      );
    });
    // Fallback: other recipes sharing any of the same pantry ingredients,
    // then remaining recipes.
    recipes = [
      ...allRecipes.filter(
        (entry) =>
          entry.id !== current.id &&
          entry.data.ingredientRefs.some((ref) => pantry.has(ref.id)),
      ),
      ...allRecipes.filter((entry) => entry.id !== current.id),
    ];
  }

  if (current.collection === 'ingredients') {
    recipes = allRecipes.filter((entry) =>
      referencesIngredient(entry, current.id),
    );
    articles = allArticles.filter((entry) =>
      entry.data.relatedIngredients?.some((ref) => ref.id === current.id),
    );
    ingredients = allIngredients.filter((entry) => entry.id !== current.id);
  }

  if (current.collection === 'articles') {
    const self = allArticles.find((entry) => entry.id === current.id);
    const linkedIngredients = new Set(
      (self?.data.relatedIngredients ?? []).map((ref) => ref.id),
    );
    const linkedRecipes = new Set(
      (self?.data.relatedRecipes ?? []).map((ref) => ref.id),
    );
    ingredients = allIngredients.filter((entry) =>
      linkedIngredients.has(entry.id),
    );
    recipes = allRecipes.filter((entry) => linkedRecipes.has(entry.id));
    articles = allArticles.filter((entry) => entry.id !== current.id);
  }

  return {
    ingredients: cap(ingredients),
    recipes: cap(recipes),
    articles: cap(articles),
  };
}

function cap<T>(list: T[]): T[] {
  return list.slice(0, RELATED_LIMIT);
}
