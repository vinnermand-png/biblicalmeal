import { SITE } from '../config';
import type { ContentPlan } from '../data/content/model';
import { PUBLIC_FOOD_CONTENT } from '../data/content/public';
import { isContentPublicationEligible } from '../data/content/validation';
import { PUBLIC_FOOD_DRAFTS } from '../data/content/public';

export type JsonLd = Record<string, unknown>;

function canonicalUrl(path: string): string {
  return new URL(path, SITE.url).toString();
}

function publishedDraftFor(content: ContentPlan) {
  return PUBLIC_FOOD_DRAFTS.find((draft) => draft.contentItemId === content.id);
}

function assertPublicSchemaEligible(content: ContentPlan): void {
  const draft = publishedDraftFor(content);
  if (
    !draft ||
    content.publicationStatus !== 'published' ||
    content.workflowStatus !== 'approved' ||
    !content.seo.indexable ||
    !content.seo.schemaEligible ||
    !isContentPublicationEligible(content, draft)
  ) {
    throw new Error(
      `Content is not eligible for public structured data: ${content.id}`,
    );
  }
}

export function foodStructuredData(
  content: ContentPlan,
  description: string,
): JsonLd[] {
  assertPublicSchemaEligible(content);
  const url = canonicalUrl(content.canonicalPath);

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: content.title,
      description,
      url,
      isPartOf: {
        '@type': 'WebSite',
        name: SITE.name,
        url: SITE.url,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: content.title,
      description,
      url,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': url,
      },
      isPartOf: {
        '@type': 'WebSite',
        name: SITE.name,
        url: SITE.url,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Foods',
          item: canonicalUrl('/ingredients/'),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: content.title,
          item: url,
        },
      ],
    },
  ];
}

export function publicFoodStructuredDataFor(
  slug: string,
  description: string,
): JsonLd[] | undefined {
  const content = PUBLIC_FOOD_CONTENT.find(
    (item) => item.canonicalTargetId === slug,
  );
  return content ? foodStructuredData(content, description) : undefined;
}
