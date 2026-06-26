import type { ColorAllFormats } from '@/types/color';
import {
  hexToRgb,
  rgbToCmyk,
  rgbToHex,
  rgbToHsl,
  rgbToHsv,
  rgbToLab,
  rgbToLch,
  rgbToOklab,
  rgbToOklch,
  rgbToXyz,
} from './conversions';

export function getAllFormats(hex: string): ColorAllFormats {
  const rgb = hexToRgb(hex);
  return {
    hex: rgbToHex(rgb),
    rgb,
    hsl: rgbToHsl(rgb),
    hsv: rgbToHsv(rgb),
    cmyk: rgbToCmyk(rgb),
    lab: rgbToLab(rgb),
    xyz: rgbToXyz(rgb),
    lch: rgbToLch(rgb),
    oklab: rgbToOklab(rgb),
    oklch: rgbToOklch(rgb),
  };
}
