import editorialImages from '../data/editorial-images.json';
import type { ArtKind } from './visuals';

type EditorialImageStatus = 'planned' | 'generated';

export interface EditorialImageAsset {
  id: string;
  title: string;
  category: string;
  purpose: string;
  subject: string;
  pageUsage: string[];
  aspectRatio: string;
  size: string;
  quality: string;
  output: string;
  publicPath: string;
  status: EditorialImageStatus;
  promptSubject: string;
  fallbackArt: ArtKind;
}

export interface EditorialImageDimensions {
  width: number;
  height: number;
}

export const EDITORIAL_IMAGES = editorialImages as EditorialImageAsset[];

export function getEditorialImage(id: string | undefined) {
  return EDITORIAL_IMAGES.find((asset) => asset.id === id);
}

export function getEditorialImageAlt(
  asset: EditorialImageAsset | undefined,
  altOverride?: string,
): string {
  if (altOverride?.trim()) return altOverride.trim();
  if (asset?.subject.trim()) return asset.subject.trim();
  return asset?.title.trim() ?? '';
}

export function getEditorialImageDimensions(
  asset: Pick<EditorialImageAsset, 'size'> | undefined,
): EditorialImageDimensions | undefined {
  if (!asset) return undefined;

  const match = /^(\d+)x(\d+)$/.exec(asset.size.trim());
  if (!match) return undefined;

  const width = Number(match[1]);
  const height = Number(match[2]);

  if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height)) {
    return undefined;
  }

  if (width <= 0 || height <= 0) return undefined;

  return { width, height };
}

export function isValidEditorialImageAsset(
  asset: EditorialImageAsset,
): boolean {
  if (!asset.id || !asset.title || !asset.category || !asset.subject.trim()) {
    return false;
  }

  if (!getEditorialImageDimensions(asset)) return false;

  if (!asset.output.startsWith('public/assets/editorial/')) return false;
  if (!asset.publicPath.startsWith('/assets/editorial/')) return false;
  if (!asset.output.endsWith('.webp') || !asset.publicPath.endsWith('.webp')) {
    return false;
  }

  const outputPath = asset.output.replace(/^public/, '');
  if (outputPath !== asset.publicPath) return false;

  if (asset.pageUsage.length === 0 || asset.pageUsage.some((path) => !path.startsWith('/'))) {
    return false;
  }

  return true;
}

export function hasGeneratedEditorialImage(id: string | undefined) {
  return getEditorialImage(id)?.status === 'generated';
}
