import { describe, expect, it } from 'vitest';
import {
  cmykToRgb,
  hexToRgb,
  hslToRgb,
  hsvToRgb,
  labToRgb,
  lchToRgb,
  oklabToRgb,
  oklchToRgb,
  rgbToCmyk,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
  rgbToLab,
  rgbToLch,
  rgbToOklab,
  rgbToOklch,
  rgbToXyz,
  xyzToRgb,
} from '../conversions';

const closeRgb = (a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }, tol = 2) => {
  expect(Math.abs(a.r - b.r)).toBeLessThanOrEqual(tol);
  expect(Math.abs(a.g - b.g)).toBeLessThanOrEqual(tol);
  expect(Math.abs(a.b - b.b)).toBeLessThanOrEqual(tol);
};

describe('hex <-> rgb', () => {
  it('parses 6-digit hex', () => {
    expect(hexToRgb('#FF8800')).toEqual({ r: 255, g: 136, b: 0 });
  });

  it('parses 3-digit shorthand hex', () => {
    expect(hexToRgb('#F80')).toEqual({ r: 255, g: 136, b: 0 });
  });

  it('round-trips rgb -> hex -> rgb', () => {
    const rgb = { r: 12, g: 200, b: 77 };
    expect(hexToRgb(rgbToHex(rgb))).toEqual(rgb);
  });
});

describe('known reference colors', () => {
  it('pure red matches known HSL/HSV/CMYK', () => {
    const red = { r: 255, g: 0, b: 0 };
    expect(rgbToHsl(red)).toEqual({ h: 0, s: 100, l: 50 });
    expect(rgbToHsv(red)).toEqual({ h: 0, s: 100, v: 100 });
    expect(rgbToCmyk(red)).toEqual({ c: 0, m: 100, y: 100, k: 0 });
  });

  it('white has L=100 in Lab and zero a/b', () => {
    const white = { r: 255, g: 255, b: 255 };
    const lab = rgbToLab(white);
    expect(lab.l).toBeCloseTo(100, 0);
    expect(lab.a).toBeCloseTo(0, 0);
    expect(lab.b).toBeCloseTo(0, 0);
  });

  it('black maps to origin in XYZ', () => {
    const xyz = rgbToXyz({ r: 0, g: 0, b: 0 });
    expect(xyz.x).toBeCloseTo(0, 1);
    expect(xyz.y).toBeCloseTo(0, 1);
    expect(xyz.z).toBeCloseTo(0, 1);
  });
});

describe('round trips stay within rounding tolerance', () => {
  const samples = ['#863BFF', '#14B8D4', '#FF6B6B', '#FFFFFF', '#000000', '#22C55E', '#0B1020'];

  it.each(samples)('hsl round-trip for %s', (hex) => {
    const rgb = hexToRgb(hex);
    closeRgb(hslToRgb(rgbToHsl(rgb)), rgb);
  });

  it.each(samples)('hsv round-trip for %s', (hex) => {
    const rgb = hexToRgb(hex);
    closeRgb(hsvToRgb(rgbToHsv(rgb)), rgb);
  });

  it.each(samples)('cmyk round-trip for %s', (hex) => {
    const rgb = hexToRgb(hex);
    closeRgb(cmykToRgb(rgbToCmyk(rgb)), rgb);
  });

  it.each(samples)('xyz round-trip for %s', (hex) => {
    const rgb = hexToRgb(hex);
    closeRgb(xyzToRgb(rgbToXyz(rgb)), rgb);
  });

  it.each(samples)('lab round-trip for %s', (hex) => {
    const rgb = hexToRgb(hex);
    closeRgb(labToRgb(rgbToLab(rgb)), rgb);
  });

  it.each(samples)('lch round-trip for %s', (hex) => {
    const rgb = hexToRgb(hex);
    closeRgb(lchToRgb(rgbToLch(rgb)), rgb);
  });

  it.each(samples)('oklab round-trip for %s', (hex) => {
    const rgb = hexToRgb(hex);
    closeRgb(oklabToRgb(rgbToOklab(rgb)), rgb);
  });

  it.each(samples)('oklch round-trip for %s', (hex) => {
    const rgb = hexToRgb(hex);
    closeRgb(oklchToRgb(rgbToOklch(rgb)), rgb);
  });
});
