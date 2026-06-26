import { rgbToHex } from './conversions';

export interface ExtractedPalette {
  dominant: string;
  average: string;
  palette: string[];
  histogram: { r: number[]; g: number[]; b: number[] };
}

const BUCKET_BITS = 4; // 4 bits per channel -> 16 levels -> 4096 buckets
const SHIFT = 8 - BUCKET_BITS;

/**
 * Extracts a representative palette from raw pixel data using a histogram/quantization
 * approach: pixels are bucketed into a coarse RGB grid, the most frequent buckets are
 * selected, and each is reported as the true average color of pixels that fell into it.
 */
export function extractPaletteFromImageData(data: Uint8ClampedArray, count = 6): ExtractedPalette {
  const buckets = new Map<number, { r: number; g: number; b: number; n: number }>();
  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let total = 0;

  const histR = new Array(32).fill(0);
  const histG = new Array(32).fill(0);
  const histB = new Array(32).fill(0);

  const step = 4; // sample every pixel (RGBA)
  for (let i = 0; i < data.length; i += step) {
    const a = data[i + 3];
    if (a < 16) continue; // skip near-transparent pixels

    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    sumR += r;
    sumG += g;
    sumB += b;
    total += 1;

    histR[r >> 3] += 1;
    histG[g >> 3] += 1;
    histB[b >> 3] += 1;

    const key = ((r >> SHIFT) << (BUCKET_BITS * 2)) | ((g >> SHIFT) << BUCKET_BITS) | (b >> SHIFT);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
      bucket.n += 1;
    } else {
      buckets.set(key, { r, g, b, n: 1 });
    }
  }

  if (total === 0) {
    return { dominant: '#000000', average: '#000000', palette: [], histogram: { r: histR, g: histG, b: histB } };
  }

  const sorted = [...buckets.values()].sort((a, b) => b.n - a.n);
  const palette = sorted
    .slice(0, count)
    .map((b) => rgbToHex({ r: b.r / b.n, g: b.g / b.n, b: b.b / b.n }));

  const average = rgbToHex({ r: sumR / total, g: sumG / total, b: sumB / total });
  const dominant = palette[0] ?? average;

  return { dominant, average, palette, histogram: { r: histR, g: histG, b: histB } };
}
