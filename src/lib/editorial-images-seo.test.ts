import { describe, expect, it } from 'vitest';
import {
  EDITORIAL_IMAGES,
  getEditorialImageAlt,
  getEditorialImageDimensions,
  isValidEditorialImageAsset,
} from './editorial-images';

describe('V3C.24 editorial image SEO metadata', () => {
  it('keeps every manifest asset internally consistent and discoverable through canonical paths', () => {
    const ids = new Set<string>();
    const publicPaths = new Set<string>();

    for (const asset of EDITORIAL_IMAGES) {
      expect(isValidEditorialImageAsset(asset)).toBe(true);
      expect(ids.has(asset.id)).toBe(false);
      expect(publicPaths.has(asset.publicPath)).toBe(false);

      ids.add(asset.id);
      publicPaths.add(asset.publicPath);
    }
  });

  it('uses meaningful manifest subjects for informative image alternatives without inventing historical claims', () => {
    const asset = EDITORIAL_IMAGES.find(
      (candidate) => candidate.id === 'journal-ancient-table',
    );

    expect(asset).toBeDefined();
    expect(getEditorialImageAlt(asset)).toBe(asset?.subject);
    expect(
      getEditorialImageAlt(
        asset,
        'Editorial still life of a Mediterranean table',
      ),
    ).toBe('Editorial still life of a Mediterranean table');
  });

  it('preserves V3C.23 intrinsic dimensions for generated assets', () => {
    for (const asset of EDITORIAL_IMAGES.filter(
      (candidate) => candidate.status === 'generated',
    )) {
      expect(getEditorialImageDimensions(asset)).toBeDefined();
    }
  });

  it('rejects invalid asset metadata', () => {
    const [asset] = EDITORIAL_IMAGES;

    expect(
      isValidEditorialImageAsset({
        ...asset,
        publicPath: '/images/figs.jpg',
      }),
    ).toBe(false);
    expect(
      isValidEditorialImageAsset({
        ...asset,
        pageUsage: [],
      }),
    ).toBe(false);
  });
});
