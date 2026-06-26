import type { CMYK, HSL, HSV, LAB, LCH, OKLCH, OKLab, RGB, XYZ } from '@/types/color';

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const round = (value: number, precision = 0) => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};

/* --------------------------------- HEX <-> RGB -------------------------------- */

export function hexToRgb(hex: string): RGB {
  let clean = hex.trim().replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (clean.length === 4) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('')
      .slice(0, 6);
  }
  if (clean.length === 8) clean = clean.slice(0, 6);
  const int = parseInt(clean, 16);
  if (clean.length !== 6 || Number.isNaN(int)) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function isValidHex(hex: string): boolean {
  return /^#?([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(hex.trim());
}

/* --------------------------------- RGB <-> HSL -------------------------------- */

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = (gn - bn) / d + (gn < bn ? 6 : 0);
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: round(h * 360, 1), s: round(s * 100, 1), l: round(l * 100, 1) };
}

function hueToRgbChannel(p: number, q: number, t: number): number {
  let tt = t;
  if (tt < 0) tt += 1;
  if (tt > 1) tt -= 1;
  if (tt < 1 / 6) return p + (q - p) * 6 * tt;
  if (tt < 1 / 2) return q;
  if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
  return p;
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const hn = ((h % 360) + 360) % 360 / 360;
  const sn = clamp(s, 0, 100) / 100;
  const ln = clamp(l, 0, 100) / 100;

  if (sn === 0) {
    const v = Math.round(ln * 255);
    return { r: v, g: v, b: v };
  }

  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;

  return {
    r: Math.round(hueToRgbChannel(p, q, hn + 1 / 3) * 255),
    g: Math.round(hueToRgbChannel(p, q, hn) * 255),
    b: Math.round(hueToRgbChannel(p, q, hn - 1 / 3) * 255),
  };
}

/* --------------------------------- RGB <-> HSV -------------------------------- */

export function rgbToHsv({ r, g, b }: RGB): HSV {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;

  if (d !== 0) {
    switch (max) {
      case rn:
        h = ((gn - bn) / d) % 6;
        break;
      case gn:
        h = (bn - rn) / d + 2;
        break;
      default:
        h = (rn - gn) / d + 4;
        break;
    }
    h *= 60;
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : d / max;
  const v = max;

  return { h: round(h, 1), s: round(s * 100, 1), v: round(v * 100, 1) };
}

export function hsvToRgb({ h, s, v }: HSV): RGB {
  const hn = ((h % 360) + 360) % 360;
  const sn = clamp(s, 0, 100) / 100;
  const vn = clamp(v, 0, 100) / 100;

  const c = vn * sn;
  const x = c * (1 - Math.abs(((hn / 60) % 2) - 1));
  const m = vn - c;

  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (hn < 60) [r1, g1, b1] = [c, x, 0];
  else if (hn < 120) [r1, g1, b1] = [x, c, 0];
  else if (hn < 180) [r1, g1, b1] = [0, c, x];
  else if (hn < 240) [r1, g1, b1] = [0, x, c];
  else if (hn < 300) [r1, g1, b1] = [x, 0, c];
  else [r1, g1, b1] = [c, 0, x];

  return {
    r: Math.round((r1 + m) * 255),
    g: Math.round((g1 + m) * 255),
    b: Math.round((b1 + m) * 255),
  };
}

/* --------------------------------- RGB <-> CMYK -------------------------------- */

export function rgbToCmyk({ r, g, b }: RGB): CMYK {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const k = 1 - Math.max(rn, gn, bn);

  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = (1 - rn - k) / (1 - k);
  const m = (1 - gn - k) / (1 - k);
  const y = (1 - bn - k) / (1 - k);

  return { c: round(c * 100, 1), m: round(m * 100, 1), y: round(y * 100, 1), k: round(k * 100, 1) };
}

export function cmykToRgb({ c, m, y, k }: CMYK): RGB {
  const cn = clamp(c, 0, 100) / 100;
  const mn = clamp(m, 0, 100) / 100;
  const yn = clamp(y, 0, 100) / 100;
  const kn = clamp(k, 0, 100) / 100;

  return {
    r: Math.round(255 * (1 - cn) * (1 - kn)),
    g: Math.round(255 * (1 - mn) * (1 - kn)),
    b: Math.round(255 * (1 - yn) * (1 - kn)),
  };
}

/* ------------------------------ sRGB <-> linear RGB ----------------------------- */

export function srgbChannelToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

export function linearChannelToSrgb(c: number): number {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055;
}

/* --------------------------------- RGB <-> XYZ -------------------------------- */

const D65 = { x: 95.047, y: 100, z: 108.883 };

export function rgbToXyz({ r, g, b }: RGB): XYZ {
  const rl = srgbChannelToLinear(r / 255);
  const gl = srgbChannelToLinear(g / 255);
  const bl = srgbChannelToLinear(b / 255);

  const x = (rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375) * 100;
  const y = (rl * 0.2126729 + gl * 0.7151522 + bl * 0.072175) * 100;
  const z = (rl * 0.0193339 + gl * 0.119192 + bl * 0.9503041) * 100;

  return { x: round(x, 3), y: round(y, 3), z: round(z, 3) };
}

export function xyzToRgb({ x, y, z }: XYZ): RGB {
  const xn = x / 100;
  const yn = y / 100;
  const zn = z / 100;

  const rl = xn * 3.2404542 + yn * -1.5371385 + zn * -0.4985314;
  const gl = xn * -0.969266 + yn * 1.8760108 + zn * 0.041556;
  const bl = xn * 0.0556434 + yn * -0.2040259 + zn * 1.0572252;

  const r = clamp(linearChannelToSrgb(rl), 0, 1) * 255;
  const g = clamp(linearChannelToSrgb(gl), 0, 1) * 255;
  const b = clamp(linearChannelToSrgb(bl), 0, 1) * 255;

  return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
}

/* --------------------------------- XYZ <-> LAB -------------------------------- */

const LAB_EPSILON = 216 / 24389;
const LAB_KAPPA = 24389 / 27;

export function xyzToLab({ x, y, z }: XYZ): LAB {
  const xr = x / D65.x;
  const yr = y / D65.y;
  const zr = z / D65.z;

  const f = (t: number) => (t > LAB_EPSILON ? Math.cbrt(t) : (LAB_KAPPA * t + 16) / 116);

  const fx = f(xr);
  const fy = f(yr);
  const fz = f(zr);

  return {
    l: round(116 * fy - 16, 2),
    a: round(500 * (fx - fy), 2),
    b: round(200 * (fy - fz), 2),
  };
}

export function labToXyz({ l, a, b }: LAB): XYZ {
  const fy = (l + 16) / 116;
  const fx = a / 500 + fy;
  const fz = fy - b / 200;

  const fInv = (t: number) => (t ** 3 > LAB_EPSILON ? t ** 3 : (116 * t - 16) / LAB_KAPPA);

  return {
    x: round(fInv(fx) * D65.x, 3),
    y: round((l > LAB_KAPPA * LAB_EPSILON ? fy ** 3 : l / LAB_KAPPA) * D65.y, 3),
    z: round(fInv(fz) * D65.z, 3),
  };
}

export function rgbToLab(rgb: RGB): LAB {
  return xyzToLab(rgbToXyz(rgb));
}

export function labToRgb(lab: LAB): RGB {
  return xyzToRgb(labToXyz(lab));
}

/* --------------------------------- LAB <-> LCH -------------------------------- */

export function labToLch({ l, a, b }: LAB): LCH {
  const c = Math.sqrt(a * a + b * b);
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { l: round(l, 2), c: round(c, 2), h: round(h, 2) };
}

export function lchToLab({ l, c, h }: LCH): LAB {
  const hRad = (h * Math.PI) / 180;
  return { l: round(l, 2), a: round(c * Math.cos(hRad), 2), b: round(c * Math.sin(hRad), 2) };
}

export function rgbToLch(rgb: RGB): LCH {
  return labToLch(rgbToLab(rgb));
}

export function lchToRgb(lch: LCH): RGB {
  return labToRgb(lchToLab(lch));
}

/* --------------------------------- RGB <-> OKLab -------------------------------- */

export function rgbToOklab({ r, g, b }: RGB): OKLab {
  const rl = srgbChannelToLinear(r / 255);
  const gl = srgbChannelToLinear(g / 255);
  const bl = srgbChannelToLinear(b / 255);

  const l = 0.4122214708 * rl + 0.5363325363 * gl + 0.0514459929 * bl;
  const m = 0.2119034982 * rl + 0.6806995451 * gl + 0.1073969566 * bl;
  const s = 0.0883024619 * rl + 0.2817188376 * gl + 0.6299787005 * bl;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  return {
    l: round(0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_, 4),
    a: round(1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_, 4),
    b: round(0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_, 4),
  };
}

export function oklabToRgb({ l, a, b }: OKLab): RGB {
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const l3 = l_ ** 3;
  const m3 = m_ ** 3;
  const s3 = s_ ** 3;

  const rl = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  const gl = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
  const bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

  return {
    r: Math.round(clamp(linearChannelToSrgb(rl), 0, 1) * 255),
    g: Math.round(clamp(linearChannelToSrgb(gl), 0, 1) * 255),
    b: Math.round(clamp(linearChannelToSrgb(bl), 0, 1) * 255),
  };
}

/* --------------------------------- OKLab <-> OKLCH -------------------------------- */

export function oklabToOklch({ l, a, b }: OKLab): OKLCH {
  const c = Math.sqrt(a * a + b * b);
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { l: round(l, 4), c: round(c, 4), h: round(h, 2) };
}

export function oklchToOklab({ l, c, h }: OKLCH): OKLab {
  const hRad = (h * Math.PI) / 180;
  return { l: round(l, 4), a: round(c * Math.cos(hRad), 4), b: round(c * Math.sin(hRad), 4) };
}

export function rgbToOklch(rgb: RGB): OKLCH {
  return oklabToOklch(rgbToOklab(rgb));
}

export function oklchToRgb(oklch: OKLCH): RGB {
  return oklabToRgb(oklchToOklab(oklch));
}

export { clamp, round };
