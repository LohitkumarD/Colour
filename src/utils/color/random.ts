import { hslToRgb, rgbToHex } from './conversions';

export function randomHex(): string {
  return rgbToHex(hslToRgb({ h: Math.random() * 360, s: 55 + Math.random() * 35, l: 40 + Math.random() * 30 }));
}

export function randomHslHex(satRange: [number, number] = [40, 90], lightRange: [number, number] = [30, 70]): string {
  const h = Math.random() * 360;
  const s = satRange[0] + Math.random() * (satRange[1] - satRange[0]);
  const l = lightRange[0] + Math.random() * (lightRange[1] - lightRange[0]);
  return rgbToHex(hslToRgb({ h, s, l }));
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
