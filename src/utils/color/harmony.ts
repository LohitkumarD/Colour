import type { HarmonyRule } from '@/types/color';
import { hexToRgb, hslToRgb, rgbToHex, rgbToHsl } from './conversions';

const wrapHue = (h: number) => ((h % 360) + 360) % 360;

/** Anchor hue offsets (in degrees) that define the "skeleton" of each harmony rule. */
const HARMONY_OFFSETS: Record<Exclude<HarmonyRule, 'random' | 'monochromatic'>, number[]> = {
  complementary: [0, 180],
  analogous: [-30, 0, 30],
  triadic: [0, 120, 240],
  'split-complementary': [0, 150, 210],
  tetradic: [0, 60, 180, 240],
  square: [0, 90, 180, 270],
  'double-complementary': [0, 30, 180, 210],
};

export const HARMONY_LABELS: Record<HarmonyRule, string> = {
  complementary: 'Complementary',
  analogous: 'Analogous',
  triadic: 'Triadic',
  'split-complementary': 'Split Complementary',
  tetradic: 'Tetradic',
  square: 'Square',
  monochromatic: 'Monochromatic',
  'double-complementary': 'Double Complementary',
  random: 'Random',
};

export const HARMONY_DESCRIPTIONS: Record<HarmonyRule, string> = {
  complementary: 'Two hues directly opposite on the wheel — maximum contrast and vibrancy.',
  analogous: 'Neighboring hues that share a family — calm, cohesive, naturally pleasing.',
  triadic: 'Three hues evenly spaced 120° apart — vivid and balanced.',
  'split-complementary': 'A base hue plus the two neighbors of its complement — high contrast, less tension.',
  tetradic: 'Two complementary pairs forming a rectangle — rich, versatile palettes.',
  square: 'Four hues evenly spaced 90° apart — bold and energetic.',
  monochromatic: 'Variations in lightness and saturation of a single hue — elegant and unified.',
  'double-complementary': 'Two adjacent complementary pairs — vibrant with built-in variety.',
  random: 'A surprise combination — sometimes the best discoveries are happy accidents.',
};

function buildFromOffsets(baseHex: string, offsets: number[], satJitter = 0, lightJitter = 0): string[] {
  const base = rgbToHsl(hexToRgb(baseHex));
  return offsets.map((offset, i) => {
    const h = wrapHue(base.h + offset);
    const s = Math.min(100, Math.max(0, base.s + (i % 2 === 0 ? satJitter : -satJitter)));
    const l = Math.min(95, Math.max(5, base.l + (i % 2 === 0 ? -lightJitter : lightJitter)));
    return rgbToHex(hslToRgb({ h, s, l }));
  });
}

function buildMonochromatic(baseHex: string, count: number): string[] {
  const base = rgbToHsl(hexToRgb(baseHex));
  const lightnesses = Array.from({ length: count }, (_, i) => 12 + (i * 76) / Math.max(1, count - 1));
  return lightnesses.map((l) => rgbToHex(hslToRgb({ h: base.h, s: base.s, l })));
}

/**
 * Generates a palette of `count` colors following the given harmony rule, anchored on baseHex.
 * When count exceeds the rule's anchor hues, extra colors are derived by varying
 * lightness/saturation around the nearest anchor hue so the harmony stays intact.
 */
export function generateHarmonyPalette(baseHex: string, rule: HarmonyRule, count = 5): string[] {
  if (rule === 'monochromatic') {
    return buildMonochromatic(baseHex, count);
  }

  if (rule === 'random') {
    const rules = Object.keys(HARMONY_OFFSETS) as (keyof typeof HARMONY_OFFSETS)[];
    const pick = rules[Math.floor(Math.random() * rules.length)];
    return generateHarmonyPalette(baseHex, pick, count);
  }

  const offsets = HARMONY_OFFSETS[rule];
  const anchors = buildFromOffsets(baseHex, offsets);

  if (count <= anchors.length) {
    return anchors.slice(0, count);
  }

  // Extend by adding lightness/saturation variants cycling through anchor hues.
  const base = rgbToHsl(hexToRgb(baseHex));
  const result = [...anchors];
  let i = 0;
  while (result.length < count) {
    const anchorOffset = offsets[i % offsets.length];
    const variantStep = Math.floor(i / offsets.length) + 1;
    const h = wrapHue(base.h + anchorOffset);
    const l = Math.min(92, Math.max(8, base.l + (variantStep % 2 === 0 ? 1 : -1) * variantStep * 9));
    const s = Math.min(100, Math.max(15, base.s - variantStep * 4));
    result.push(rgbToHex(hslToRgb({ h, s, l })));
    i += 1;
  }

  return result;
}

export const HARMONY_RULES: HarmonyRule[] = [
  'complementary',
  'analogous',
  'triadic',
  'split-complementary',
  'tetradic',
  'square',
  'monochromatic',
  'double-complementary',
  'random',
];
