import { describe, it, expect } from 'vitest';
import {
  PUZZLES,
  LEVELS,
  getPuzzle,
  puzzlesByLevel,
  levelOf,
} from '../../js/dots/game/puzzles.js';

describe('PUZZLES data integrity', () => {
  it('every puzzle has id, label, emoji, color, level, and at least 3 dots', () => {
    for (const puzzle of PUZZLES) {
      expect(typeof puzzle.id).toBe('string');
      expect(puzzle.id.length).toBeGreaterThan(0);
      expect(typeof puzzle.label).toBe('string');
      expect(puzzle.label.length).toBeGreaterThan(0);
      expect(typeof puzzle.emoji).toBe('string');
      expect(puzzle.emoji.length).toBeGreaterThan(0);
      expect(typeof puzzle.color).toBe('string');
      expect(puzzle.color.length).toBeGreaterThan(0);
      expect(LEVELS).toContain(puzzle.level);
      expect(Array.isArray(puzzle.dots)).toBe(true);
      expect(puzzle.dots.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('all dot coordinates are within [0, 100]', () => {
    for (const puzzle of PUZZLES) {
      for (const [x, y] of puzzle.dots) {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(100);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(100);
      }
    }
  });

  it('every dot is a 2-number array', () => {
    for (const puzzle of PUZZLES) {
      for (const dot of puzzle.dots) {
        expect(Array.isArray(dot)).toBe(true);
        expect(dot).toHaveLength(2);
        expect(typeof dot[0]).toBe('number');
        expect(typeof dot[1]).toBe('number');
      }
    }
  });

  it('all puzzle ids are unique', () => {
    const ids = PUZZLES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each puzzle's level matches its dot count", () => {
    for (const puzzle of PUZZLES) {
      expect(puzzle.level).toBe(levelOf(puzzle.dots.length));
    }
  });
});

describe('levelOf', () => {
  it('maps dot counts to the four difficulty bands', () => {
    expect(levelOf(1)).toBe(1);
    expect(levelOf(14)).toBe(1);
    expect(levelOf(15)).toBe(2);
    expect(levelOf(25)).toBe(2);
    expect(levelOf(26)).toBe(3);
    expect(levelOf(40)).toBe(3);
    expect(levelOf(41)).toBe(4);
    expect(levelOf(60)).toBe(4);
  });
});

describe('difficulty levels', () => {
  it('every level has at least 6 puzzles', () => {
    for (const level of LEVELS) {
      expect(puzzlesByLevel(level).length).toBeGreaterThanOrEqual(6);
    }
  });

  it('puzzlesByLevel only returns puzzles of that level', () => {
    for (const level of LEVELS) {
      for (const puzzle of puzzlesByLevel(level)) {
        expect(puzzle.level).toBe(level);
      }
    }
  });
});

describe('getPuzzle', () => {
  it('returns the correct puzzle by id', () => {
    const puzzle = getPuzzle('ster');
    expect(puzzle).toBeDefined();
    expect(puzzle.id).toBe('ster');
    expect(puzzle.emoji).toBe('⭐');
  });

  it('returns undefined for an unknown id', () => {
    expect(getPuzzle('onbekend')).toBeUndefined();
  });
});
