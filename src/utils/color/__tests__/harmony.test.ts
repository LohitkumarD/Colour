import { describe, expect, it } from 'vitest';
import { hexToRgb, rgbToHsl } from '../conversions';
import { generateHarmonyPalette } from '../harmony';

describe('generateHarmonyPalette', () => {
  it('complementary produces hues 180 degrees apart', () => {
    const [a, b] = generateHarmonyPalette('#FF0000', 'complementary', 2);
    const hueA = rgbToHsl(hexToRgb(a)).h;
    const hueB = rgbToHsl(hexToRgb(b)).h;
    const diff = Math.abs(hueA - hueB);
    expect(Math.min(diff, 360 - diff)).toBeCloseTo(180, 0);
  });

  it('triadic produces 3 hues spaced 120 degrees apart', () => {
    const colors = generateHarmonyPalette('#3366FF', 'triadic', 3);
    expect(colors).toHaveLength(3);
    const hues = colors.map((c) => rgbToHsl(hexToRgb(c)).h).sort((a, b) => a - b);
    expect(hues[1] - hues[0]).toBeCloseTo(120, 0);
  });

  it('respects requested count for any rule, extending beyond anchors', () => {
    const colors = generateHarmonyPalette('#22C55E', 'square', 12);
    expect(colors).toHaveLength(12);
    expect(new Set(colors).size).toBeGreaterThan(4);
  });

  it('monochromatic stays on a single hue', () => {
    const base = rgbToHsl(hexToRgb('#863BFF'));
    const colors = generateHarmonyPalette('#863BFF', 'monochromatic', 8);
    expect(colors).toHaveLength(8);
    for (const c of colors) {
      const hue = rgbToHsl(hexToRgb(c)).h;
      expect(Math.abs(hue - base.h)).toBeLessThan(1);
    }
  });
});
