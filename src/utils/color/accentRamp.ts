import { hexToRgb, hslToRgb, isValidHex, rgbToHex, rgbToHsl } from './conversions';

export const ACCENT_RAMP_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type AccentRampStep = (typeof ACCENT_RAMP_STEPS)[number];

const BASE_STEP: AccentRampStep = 500;

/** Lightness offsets from the 500 step, sampled from the original static primary-* token ramp, so the chosen color lands exactly on primary-500 and the rest of the ramp keeps the same tonal spread. */
const LIGHTNESS_OFFSET: Record<AccentRampStep, number> = {
  50: 35,
  100: 32,
  200: 27,
  300: 19,
  400: 9,
  500: 0,
  600: -7,
  700: -15,
  800: -23,
  900: -30,
  950: -40,
};

export function buildAccentRamp(baseHex: string): Record<AccentRampStep, string> {
  const fallback = '#863BFF';
  const normalized = isValidHex(baseHex) ? baseHex : fallback;
  const { h, s, l } = rgbToHsl(hexToRgb(normalized));
  const ramp = {} as Record<AccentRampStep, string>;
  for (const step of ACCENT_RAMP_STEPS) {
    if (step === BASE_STEP) {
      ramp[step] = rgbToHex(hexToRgb(normalized));
      continue;
    }
    const targetL = Math.min(98, Math.max(2, l + LIGHTNESS_OFFSET[step]));
    ramp[step] = rgbToHex(hslToRgb({ h, s, l: targetL }));
  }
  return ramp;
}
