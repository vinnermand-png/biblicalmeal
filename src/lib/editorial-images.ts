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

export const EDITORIAL_IMAGES = editorialImages as EditorialImageAsset[];

export function getEditorialImage(id: string | undefined) {
  return EDITORIAL_IMAGES.find((asset) => asset.id === id);
}

export function hasGeneratedEditorialImage(id: string | undefined) {
  return getEditorialImage(id)?.status === 'generated';
}
