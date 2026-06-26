import type { PaintType, RGB } from '@/types/color';
import { hexToRgb, rgbToHex } from './conversions';

function rgbToCmy(rgb: RGB) {
  return { c: 1 - rgb.r / 255, m: 1 - rgb.g / 255, y: 1 - rgb.b / 255 };
}

function cmyToRgb(cmy: { c: number; m: number; y: number }): RGB {
  return {
    r: Math.round((1 - cmy.c) * 255),
    g: Math.round((1 - cmy.m) * 255),
    b: Math.round((1 - cmy.y) * 255),
  };
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export interface PaintProfile {
  /** 0 = pure additive RGB average, 1 = fully subtractive pigment-style mixing. */
  subtractiveness: number;
  /** Lightens the mix slightly to mimic translucent media (e.g. watercolor washes). */
  lightenBias: number;
  /** Darkens/saturates the mix slightly to mimic dense, opaque pigment (e.g. oil paint). */
  densityBias: number;
}

export const PAINT_PROFILES: Record<PaintType, PaintProfile> = {
  digital: { subtractiveness: 0, lightenBias: 0, densityBias: 0 },
  acrylic: { subtractiveness: 0.7, lightenBias: 0, densityBias: 0.06 },
  watercolor: { subtractiveness: 0.45, lightenBias: 0.16, densityBias: 0 },
  oil: { subtractiveness: 0.85, lightenBias: 0, densityBias: 0.12 },
};

/**
 * Mixes two colors using `ratio` (0-100, % weight of color B) and a paint profile that
 * blends additive (digital) and subtractive (pigment-like) mixing models. This is a
 * stylized approximation tuned for pleasant, intuitive results rather than a physically
 * exact pigment simulation.
 */
export function mixColors(hexA: string, hexB: string, ratio: number, paintType: PaintType = 'digital'): string {
  const t = clamp01(ratio / 100);
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const profile = PAINT_PROFILES[paintType];

  const additive: RGB = {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };

  const cmyA = rgbToCmy(a);
  const cmyB = rgbToCmy(b);
  const subtractiveCmy = {
    c: cmyA.c + (cmyB.c - cmyA.c) * t,
    m: cmyA.m + (cmyB.m - cmyA.m) * t,
    y: cmyA.y + (cmyB.y - cmyA.y) * t,
  };
  const subtractive = cmyToRgb(subtractiveCmy);

  let r = additive.r + (subtractive.r - additive.r) * profile.subtractiveness;
  let g = additive.g + (subtractive.g - additive.g) * profile.subtractiveness;
  let bl = additive.b + (subtractive.b - additive.b) * profile.subtractiveness;

  if (profile.lightenBias > 0) {
    r += (255 - r) * profile.lightenBias;
    g += (255 - g) * profile.lightenBias;
    bl += (255 - bl) * profile.lightenBias;
  }

  if (profile.densityBias > 0) {
    r -= r * profile.densityBias;
    g -= g * profile.densityBias;
    bl -= bl * profile.densityBias;
  }

  return rgbToHex({
    r: Math.round(clamp01(r / 255) * 255),
    g: Math.round(clamp01(g / 255) * 255),
    b: Math.round(clamp01(bl / 255) * 255),
  });
}

/** Composites a color over a white canvas at the given opacity (0-100), simulating paint coverage. */
export function applyOpacityOverWhite(hex: string, opacity: number): string {
  const t = clamp01(opacity / 100);
  const rgb = hexToRgb(hex);
  return rgbToHex({
    r: rgb.r * t + 255 * (1 - t),
    g: rgb.g * t + 255 * (1 - t),
    b: rgb.b * t + 255 * (1 - t),
  });
}

export const PAINT_TYPE_LABELS: Record<PaintType, string> = {
  digital: 'Digital',
  acrylic: 'Acrylic',
  watercolor: 'Watercolor',
  oil: 'Oil',
};
