import { SITE } from '../config';

export interface CanonicalSocialMetadataInput {
  title?: string;
  description?: string;
  pathname?: string;
  type?: 'website' | 'article';
  imagePath?: string;
  imageAlt?: string;
}

export interface SocialMetadata {
  title: string;
  description: string;
  canonicalURL: string;
  type: 'website' | 'article';
  imageURL: string;
  imageAlt: string;
}

export const DEFAULT_SOCIAL_IMAGE_PATH = '/og-default.svg';
export const DEFAULT_SOCIAL_IMAGE_ALT = 'BiblicalMeal — Foods & Culinary Traditions of the Biblical World';

export function absoluteSiteURL(pathname = '/'): string {
  return new URL(pathname, SITE.url).toString();
}

export function resolveSocialImage(
  imagePath = DEFAULT_SOCIAL_IMAGE_PATH,
): string {
  return absoluteSiteURL(imagePath);
}

export function resolveSocialMetadata(
  input: CanonicalSocialMetadataInput = {},
): SocialMetadata {
  const title = input.title ? `${input.title} | ${SITE.name}` : SITE.title;
  const description = input.description ?? SITE.description;

  return {
    title,
    description,
    canonicalURL: absoluteSiteURL(input.pathname ?? '/'),
    type: input.type ?? 'website',
    imageURL: resolveSocialImage(input.imagePath),
    imageAlt: input.imageAlt ?? DEFAULT_SOCIAL_IMAGE_ALT,
  };
}
