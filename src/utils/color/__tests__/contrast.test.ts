import { describe, expect, it } from 'vitest';
import { contrastRatio, getWcagResult, suggestAccessibleColor } from '../contrast';

describe('contrastRatio', () => {
  it('black on white is 21:1', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#123456', '#FEDCBA')).toBeCloseTo(contrastRatio('#FEDCBA', '#123456'), 5);
  });

  it('same color is 1:1', () => {
    expect(contrastRatio('#777777', '#777777')).toBeCloseTo(1, 1);
  });
});

describe('getWcagResult', () => {
  it('flags black on white as AAA', () => {
    const result = getWcagResult('#000000', '#FFFFFF');
    expect(result.score).toBe('AAA');
    expect(result.aaNormal).toBe(true);
    expect(result.aaaNormal).toBe(true);
  });

  it('flags low contrast as Fail', () => {
    const result = getWcagResult('#888888', '#999999');
    expect(result.score).toBe('Fail');
  });
});

describe('suggestAccessibleColor', () => {
  it('returns the same color if it already passes', () => {
    expect(suggestAccessibleColor('#000000', '#FFFFFF', 4.5)).toBe('#000000');
  });

  it('finds a darker/lighter variant that passes the target ratio', () => {
    const suggestion = suggestAccessibleColor('#AAAAAA', '#FFFFFF', 4.5);
    expect(suggestion).not.toBeNull();
    if (suggestion) {
      expect(contrastRatio(suggestion, '#FFFFFF')).toBeGreaterThanOrEqual(4.5);
    }
  });
});
