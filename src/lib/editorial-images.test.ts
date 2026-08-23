import { describe, expect, it } from 'vitest';
import {
  EDITORIAL_IMAGES,
  getEditorialImageDimensions,
} from './editorial-images';

describe('V3C.23 editorial image performance metadata', () => {
  it('exposes intrinsic dimensions for generated editorial assets', () => {
    const generatedAssets = EDITORIAL_IMAGES.filter(
      (asset) => asset.status === 'generated',
    );

    expect(generatedAssets.length).toBeGreaterThan(0);

    for (const asset of generatedAssets) {
      const dimensions = getEditorialImageDimensions(asset);

      expect(dimensions).toBeDefined();
      expect(dimensions?.width).toBeGreaterThan(0);
      expect(dimensions?.height).toBeGreaterThan(0);
    }
  });

  it('rejects malformed or impossible image dimensions instead of emitting invalid layout metadata', () => {
    expect(getEditorialImageDimensions({ size: '1536 by 1024' })).toBeUndefined();
    expect(getEditorialImageDimensions({ size: '0x1024' })).toBeUndefined();
    expect(getEditorialImageDimensions({ size: '1536x0' })).toBeUndefined();
    expect(getEditorialImageDimensions({ size: '-1x1024' })).toBeUndefined();
  });
});
