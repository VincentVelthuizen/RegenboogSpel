import { describe, it, expect } from 'vitest';
import {
  CONSTELLATIONS,
  STAR_LEVEL,
  getConstellation,
} from '../../js/dots/game/constellations.js';
import { PUZZLES } from '../../js/dots/game/puzzles.js';

describe('CONSTELLATIONS data integrity', () => {
  it('every constellation has id, label, emoji, color and at least 3 stars', () => {
    for (const c of CONSTELLATIONS) {
      expect(typeof c.id).toBe('string');
      expect(c.id.length).toBeGreaterThan(0);
      expect(typeof c.label).toBe('string');
      expect(c.label.length).toBeGreaterThan(0);
      expect(typeof c.emoji).toBe('string');
      expect(c.emoji.length).toBeGreaterThan(0);
      expect(typeof c.color).toBe('string');
      expect(c.color.length).toBeGreaterThan(0);
      expect(Array.isArray(c.dots)).toBe(true);
      expect(c.dots.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('marks every figure as a star figure on the star level', () => {
    for (const c of CONSTELLATIONS) {
      expect(c.star).toBe(true);
      expect(c.level).toBe(STAR_LEVEL);
    }
  });

  it('all star coordinates are 2-number arrays within [0, 100]', () => {
    for (const c of CONSTELLATIONS) {
      for (const dot of c.dots) {
        expect(dot).toHaveLength(2);
        const [x, y] = dot;
        expect(typeof x).toBe('number');
        expect(typeof y).toBe('number');
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(100);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(100);
      }
    }
  });

  it('has at least 6 constellations', () => {
    expect(CONSTELLATIONS.length).toBeGreaterThanOrEqual(6);
  });

  it('all constellation ids are unique', () => {
    const ids = CONSTELLATIONS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('does not share ids with the picture puzzles (so lookups are unambiguous)', () => {
    const puzzleIds = new Set(PUZZLES.map((p) => p.id));
    for (const c of CONSTELLATIONS) {
      expect(puzzleIds.has(c.id)).toBe(false);
    }
  });
});

describe('getConstellation', () => {
  it('returns the constellation by id', () => {
    const c = getConstellation('orion');
    expect(c).toBeDefined();
    expect(c.label).toBe('orion');
  });

  it('returns undefined for an unknown id', () => {
    expect(getConstellation('onbekend')).toBeUndefined();
  });
});
