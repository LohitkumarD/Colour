import type { RGB } from '@/types/color';
import { hexToRgb, hslToRgb, rgbToHex, rgbToHsl, srgbChannelToLinear } from './conversions';

export function relativeLuminance(rgb: RGB): number {
  const r = srgbChannelToLinear(rgb.r / 255);
  const g = srgbChannelToLinear(rgb.g / 255);
  const b = srgbChannelToLinear(rgb.b / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(hexA: string, hexB: string): number {
  const lumA = relativeLuminance(hexToRgb(hexA));
  const lumB = relativeLuminance(hexToRgb(hexB));
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

export interface WcagResult {
  ratio: number;
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  aaaLarge: boolean;
  score: 'Fail' | 'AA' | 'AAA';
}

export function getWcagResult(fgHex: string, bgHex: string): WcagResult {
  const ratio = contrastRatio(fgHex, bgHex);
  const aaNormal = ratio >= 4.5;
  const aaLarge = ratio >= 3;
  const aaaNormal = ratio >= 7;
  const aaaLarge = ratio >= 4.5;

  let score: WcagResult['score'] = 'Fail';
  if (aaaNormal) score = 'AAA';
  else if (aaNormal) score = 'AA';

  return {
    ratio: Math.round(ratio * 100) / 100,
    aaNormal,
    aaLarge,
    aaaNormal,
    aaaLarge,
    score,
  };
}

/**
 * Suggests an adjusted version of fgHex (by stepping lightness in HSL) that meets
 * the target contrast ratio against bgHex. Returns null if no in-range lightness works.
 */
export function suggestAccessibleColor(fgHex: string, bgHex: string, targetRatio = 4.5): string | null {
  if (contrastRatio(fgHex, bgHex) >= targetRatio) return fgHex;

  const hsl = rgbToHsl(hexToRgb(fgHex));
  const bgLum = relativeLuminance(hexToRgb(bgHex));

  // Decide direction: darken if background is light, lighten if background is dark.
  const directions = bgLum > 0.5 ? [-1, 1] : [1, -1];

  for (const dir of directions) {
    for (let step = 1; step <= 100; step += 1) {
      const l = Math.min(100, Math.max(0, hsl.l + dir * step));
      const candidate = rgbToHex(hslToRgb({ h: hsl.h, s: hsl.s, l }));
      if (contrastRatio(candidate, bgHex) >= targetRatio) {
        return candidate;
      }
      if (l === 0 || l === 100) break;
    }
  }

  return null;
}
