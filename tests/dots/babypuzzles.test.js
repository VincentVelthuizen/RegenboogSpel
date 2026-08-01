import { describe, it, expect } from 'vitest';
import { BABY_PUZZLES, BABY_LEVEL, getBabyPuzzle } from '../../js/dots/game/babypuzzles.js';
import { PUZZLES } from '../../js/dots/game/puzzles.js';
import { CONSTELLATIONS } from '../../js/dots/game/constellations.js';

describe('BABY_PUZZLES data integrity', () => {
  it('every puzzle has id, label, emoji, color, level, and a closed loop of at least 3 dots', () => {
    for (const puzzle of BABY_PUZZLES) {
      expect(typeof puzzle.id).toBe('string');
      expect(puzzle.id.length).toBeGreaterThan(0);
      expect(typeof puzzle.label).toBe('string');
      expect(typeof puzzle.emoji).toBe('string');
      expect(puzzle.emoji.length).toBeGreaterThan(0);
      expect(typeof puzzle.color).toBe('string');
      expect(puzzle.color.length).toBeGreaterThan(0);
      expect(puzzle.level).toBe(BABY_LEVEL);
      expect(Array.isArray(puzzle.dots)).toBe(true);
      expect(puzzle.dots.length).toBeGreaterThanOrEqual(4);
    }
  });

  it('all dot coordinates are 2-number arrays within [0, 100]', () => {
    for (const puzzle of BABY_PUZZLES) {
      for (const dot of puzzle.dots) {
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

  it('has no duplicate consecutive (or wrap-around) dots in the same puzzle', () => {
    for (const puzzle of BABY_PUZZLES) {
      const { dots } = puzzle;
      for (let i = 0; i < dots.length; i++) {
        const next = dots[(i + 1) % dots.length];
        expect(dots[i]).not.toEqual(next);
      }
    }
  });

  it('is not marked as a star figure', () => {
    for (const puzzle of BABY_PUZZLES) {
      expect(puzzle.star).toBeUndefined();
    }
  });

  it('has at least 6 puzzles', () => {
    expect(BABY_PUZZLES.length).toBeGreaterThanOrEqual(6);
  });

  it('all ids are unique', () => {
    const ids = BABY_PUZZLES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('does not share ids with the picture puzzles or constellations', () => {
    const otherIds = new Set([...PUZZLES.map((p) => p.id), ...CONSTELLATIONS.map((c) => c.id)]);
    for (const p of BABY_PUZZLES) {
      expect(otherIds.has(p.id)).toBe(false);
    }
  });
});

describe('getBabyPuzzle', () => {
  it('returns the puzzle by id', () => {
    const p = getBabyPuzzle('flesje');
    expect(p).toBeDefined();
    expect(p.emoji).toBe('🍼');
  });

  it('returns undefined for an unknown id', () => {
    expect(getBabyPuzzle('onbekend')).toBeUndefined();
  });
});
