export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface RGBA extends RGB {
  a: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

export interface XYZ {
  x: number;
  y: number;
  z: number;
}

export interface LAB {
  l: number;
  a: number;
  b: number;
}

export interface LCH {
  l: number;
  c: number;
  h: number;
}

export interface OKLab {
  l: number;
  a: number;
  b: number;
}

export interface OKLCH {
  l: number;
  c: number;
  h: number;
}

export type ColorSpace =
  | 'hex'
  | 'rgb'
  | 'rgba'
  | 'hsl'
  | 'hsv'
  | 'cmyk'
  | 'lab'
  | 'xyz'
  | 'lch'
  | 'oklab'
  | 'oklch';

export interface ColorAllFormats {
  hex: string;
  rgb: RGB;
  hsl: HSL;
  hsv: HSV;
  cmyk: CMYK;
  lab: LAB;
  xyz: XYZ;
  lch: LCH;
  oklab: OKLab;
  oklch: OKLCH;
}

export type HarmonyRule =
  | 'complementary'
  | 'analogous'
  | 'triadic'
  | 'split-complementary'
  | 'tetradic'
  | 'square'
  | 'monochromatic'
  | 'double-complementary'
  | 'random';

export type PaintType = 'digital' | 'acrylic' | 'watercolor' | 'oil';

export type GradientType = 'linear' | 'radial' | 'angular' | 'mesh';

export type ColorBlindnessType =
  | 'normal'
  | 'protanopia'
  | 'deuteranopia'
  | 'tritanopia'
  | 'achromatopsia';

export interface GradientStop {
  id: string;
  color: string;
  position: number; // 0 - 100
}

export interface GradientConfig {
  type: GradientType;
  angle: number; // for linear / angular
  stops: GradientStop[];
  shape?: 'circle' | 'ellipse'; // for radial
  meshSeed?: number; // for mesh variations
}
