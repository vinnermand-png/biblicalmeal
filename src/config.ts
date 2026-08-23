/**
 * Central site configuration.
 * Single source of truth for metadata, navigation, and locale settings.
 * Locale list must stay in sync with `i18n.locales` in astro.config.mjs.
 */

export const SITE = {
  name: 'BiblicalMeal',
  title: 'BiblicalMeal — Foods & Culinary Traditions of the Biblical World',
  description:
    'Explore the foods, ingredients, recipes, history, and culinary traditions of the biblical world.',
  url: 'https://biblicalmeal.com',
  locale: 'en',
} as const;

export const NAV_LINKS = [
  { label: 'Recipes', href: '/recipes/' },
  { label: 'Ingredients', href: '/ingredients/' },
  { label: 'Articles', href: '/articles/' },
] as const;
