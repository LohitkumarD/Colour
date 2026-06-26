import { describe, expect, it } from 'vitest';
import { simulateColorBlindness } from '../blindness';
import { mixColors } from '../mixing';
import { generateShades, generateTints, generateTones } from '../tones';

describe('simulateColorBlindness', () => {
  it('returns the same color for normal vision', () => {
    expect(simulateColorBlindness('#863BFF', 'normal')).toBe('#863BFF');
  });

  it('achromatopsia produces a neutral gray (r=g=b)', () => {
    const result = simulateColorBlindness('#863BFF', 'achromatopsia');
    const hex = result.replace('#', '');
    const r = hex.slice(0, 2);
    const g = hex.slice(2, 4);
    const b = hex.slice(4, 6);
    expect(r).toBe(g);
    expect(g).toBe(b);
  });

  it('protanopia/deuteranopia/tritanopia all return valid hex', () => {
    for (const type of ['protanopia', 'deuteranopia', 'tritanopia'] as const) {
      expect(simulateColorBlindness('#FF6B6B', type)).toMatch(/^#[0-9A-F]{6}$/);
    }
  });
});

describe('mixColors', () => {
  it('ratio 0 returns color A, ratio 100 returns color B (digital)', () => {
    expect(mixColors('#FF0000', '#0000FF', 0, 'digital')).toBe('#FF0000');
    expect(mixColors('#FF0000', '#0000FF', 100, 'digital')).toBe('#0000FF');
  });

  it('paint types produce a valid hex result', () => {
    for (const type of ['digital', 'acrylic', 'watercolor', 'oil'] as const) {
      expect(mixColors('#FFD700', '#1E3A8A', 50, type)).toMatch(/^#[0-9A-F]{6}$/);
    }
  });
});

describe('tint/shade/tone generators', () => {
  it('produce the requested number of steps', () => {
    expect(generateTints('#863BFF', 10)).toHaveLength(10);
    expect(generateShades('#863BFF', 10)).toHaveLength(10);
    expect(generateTones('#863BFF', 10)).toHaveLength(10);
  });

  it('tints move toward white, shades move toward black', () => {
    const tints = generateTints('#222222', 3);
    const shades = generateShades('#222222', 3);
    expect(parseInt(tints[2].slice(1, 3), 16)).toBeGreaterThan(0x22);
    expect(parseInt(shades[2].slice(1, 3), 16)).toBeLessThan(0x22);
  });
});
