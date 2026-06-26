import type { CMYK, HSL, HSV, LAB, LCH, OKLCH, OKLab, RGB, RGBA } from '@/types/color';
import { hexToRgb, hslToRgb, hsvToRgb, isValidHex, rgbToHex } from './conversions';

export function formatRgb(rgb: RGB): string {
  return `rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`;
}

export function formatRgba(rgba: RGBA): string {
  return `rgba(${Math.round(rgba.r)}, ${Math.round(rgba.g)}, ${Math.round(rgba.b)}, ${rgba.a})`;
}

export function formatHsl(hsl: HSL): string {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

export function formatHsv(hsv: HSV): string {
  return `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`;
}

export function formatCmyk(cmyk: CMYK): string {
  return `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;
}

export function formatLab(lab: LAB): string {
  return `lab(${lab.l}% ${lab.a} ${lab.b})`;
}

export function formatLch(lch: LCH): string {
  return `lch(${lch.l}% ${lch.c} ${lch.h})`;
}

export function formatOklab(oklab: OKLab): string {
  return `oklab(${oklab.l} ${oklab.a} ${oklab.b})`;
}

export function formatOklch(oklch: OKLCH): string {
  return `oklch(${oklch.l} ${oklch.c} ${oklch.h})`;
}

/** Parses loosely-formatted user input (hex / rgb() / rgba() / hsl() / hsla()) into RGB. */
export function parseColorInput(input: string): RGB | null {
  const value = input.trim();
  if (!value) return null;

  if (isValidHex(value)) {
    return hexToRgb(value);
  }

  const rgbMatch = value.match(/rgba?\(([^)]+)\)/i);
  if (rgbMatch) {
    const parts = rgbMatch[1].split(/[,\s/]+/).filter(Boolean).map(Number);
    if (parts.length >= 3 && parts.slice(0, 3).every((n) => !Number.isNaN(n))) {
      return { r: parts[0], g: parts[1], b: parts[2] };
    }
  }

  const hslMatch = value.match(/hsla?\(([^)]+)\)/i);
  if (hslMatch) {
    const parts = hslMatch[1].split(/[,\s/]+/).filter(Boolean);
    if (parts.length >= 3) {
      const h = parseFloat(parts[0]);
      const s = parseFloat(parts[1]);
      const l = parseFloat(parts[2]);
      if (![h, s, l].some(Number.isNaN)) {
        return hslToRgb({ h, s, l });
      }
    }
  }

  const hsvMatch = value.match(/hsva?\(([^)]+)\)/i);
  if (hsvMatch) {
    const parts = hsvMatch[1].split(/[,\s/]+/).filter(Boolean);
    if (parts.length >= 3) {
      const h = parseFloat(parts[0]);
      const s = parseFloat(parts[1]);
      const v = parseFloat(parts[2]);
      if (![h, s, v].some(Number.isNaN)) {
        return hsvToRgb({ h, s, v });
      }
    }
  }

  return null;
}

export function normalizeHex(input: string): string | null {
  const rgb = parseColorInput(input);
  return rgb ? rgbToHex(rgb) : null;
}
