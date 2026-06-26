import type { ColorBlindnessType, RGB } from '@/types/color';
import { hexToRgb, rgbToHex } from './conversions';

/**
 * Approximate color-blindness simulation matrices (Machado/Viénot-style coefficients),
 * applied directly in gamma-encoded sRGB space for a fast, visually-representative
 * preview. This is an educational approximation, not a clinically calibrated model.
 */
const MATRICES: Record<Exclude<ColorBlindnessType, 'normal' | 'achromatopsia'>, number[][]> = {
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758],
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7],
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525],
  ],
};

function applyMatrix(rgb: RGB, matrix: number[][]): RGB {
  const { r, g, b } = rgb;
  return {
    r: Math.round(matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b),
    g: Math.round(matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b),
    b: Math.round(matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b),
  };
}

export function simulateColorBlindness(hex: string, type: ColorBlindnessType): string {
  if (type === 'normal') return hex;
  const rgb = hexToRgb(hex);

  if (type === 'achromatopsia') {
    const gray = Math.round(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
    return rgbToHex({ r: gray, g: gray, b: gray });
  }

  return rgbToHex(applyMatrix(rgb, MATRICES[type]));
}

export const COLOR_BLINDNESS_LABELS: Record<ColorBlindnessType, string> = {
  normal: 'Normal Vision',
  protanopia: 'Protanopia',
  deuteranopia: 'Deuteranopia',
  tritanopia: 'Tritanopia',
  achromatopsia: 'Achromatopsia',
};

export const COLOR_BLINDNESS_DESCRIPTIONS: Record<ColorBlindnessType, string> = {
  normal: 'Typical trichromatic color vision.',
  protanopia: 'Reduced sensitivity to red light — reds appear darker and muted.',
  deuteranopia: 'Reduced sensitivity to green light — reds and greens are hard to tell apart.',
  tritanopia: 'Reduced sensitivity to blue light — blues and yellows are hard to tell apart.',
  achromatopsia: 'Complete color blindness — the world is seen in shades of gray.',
};
