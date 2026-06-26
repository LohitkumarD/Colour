import type { RGB } from '@/types/color';
import { hexToRgb, rgbToHex } from './conversions';

function lerpChannel(a: number, b: number, t: number): number {
  return Math.round(a + (b - a) * t);
}

function lerpRgb(a: RGB, b: RGB, t: number): RGB {
  return {
    r: lerpChannel(a.r, b.r, t),
    g: lerpChannel(a.g, b.g, t),
    b: lerpChannel(a.b, b.b, t),
  };
}

const WHITE: RGB = { r: 255, g: 255, b: 255 };
const BLACK: RGB = { r: 0, g: 0, b: 0 };
const GRAY: RGB = { r: 128, g: 128, b: 128 };

function buildSteps(baseHex: string, target: RGB, steps: number): string[] {
  const base = hexToRgb(baseHex);
  return Array.from({ length: steps }, (_, i) => {
    const t = (i + 1) / (steps + 1);
    return rgbToHex(lerpRgb(base, target, t));
  });
}

/** Tints: base mixed toward white. */
export function generateTints(baseHex: string, steps = 10): string[] {
  return buildSteps(baseHex, WHITE, steps);
}

/** Shades: base mixed toward black. */
export function generateShades(baseHex: string, steps = 10): string[] {
  return buildSteps(baseHex, BLACK, steps);
}

/** Tones: base mixed toward neutral gray. */
export function generateTones(baseHex: string, steps = 10): string[] {
  return buildSteps(baseHex, GRAY, steps);
}
