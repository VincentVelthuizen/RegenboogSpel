import { describe, it, expect } from 'vitest';
import {
  CONSTELLATIONS,
  STAR_LEVEL,
  getConstellation,
} from '../../js/dots/game/constellations.js';
import { PUZZLES } from '../../js/dots/game/puzzles.js';
import { minSpacing } from '../../js/dots/game/sky.js';

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

  it('every star has a real name and magnitude', () => {
    for (const c of CONSTELLATIONS) {
      expect(c.starNames).toHaveLength(c.dots.length);
      expect(c.mags).toHaveLength(c.dots.length);
      c.starNames.forEach((n) => expect(n.length).toBeGreaterThan(0));
      c.mags.forEach((m) => {
        expect(m).toBeGreaterThan(-2);
        expect(m).toBeLessThan(6);
      });
      expect(new Set(c.starNames).size).toBe(c.starNames.length);
    }
  });

  it('lines join two different, existing stars and every star is on a line', () => {
    for (const c of CONSTELLATIONS) {
      const used = new Set();
      for (const [a, b] of c.lines) {
        expect(Number.isInteger(a)).toBe(true);
        expect(Number.isInteger(b)).toBe(true);
        expect(a).not.toBe(b);
        expect(a).toBeGreaterThanOrEqual(0);
        expect(b).toBeLessThan(c.dots.length);
        used.add(a);
        used.add(b);
      }
      expect(used.size).toBe(c.dots.length);
    }
  });

  it('keeps stars far enough apart to tap, with dots sized to fit', () => {
    for (const c of CONSTELLATIONS) {
      const spacing = minSpacing(c.dots);
      expect(spacing).toBeGreaterThanOrEqual(5);
      expect(c.dotRadius * 2).toBeLessThan(spacing);
    }
  });

  it('mostly follows the real lines while tapping (at most 2 pen lifts)', () => {
    for (const c of CONSTELLATIONS) {
      const joined = new Set(c.lines.map(([a, b]) => `${Math.min(a, b)}-${Math.max(a, b)}`));
      let lifts = 0;
      for (let i = 1; i < c.dots.length; i++) if (!joined.has(`${i - 1}-${i}`)) lifts++;
      expect(lifts).toBeLessThanOrEqual(2);
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

describe('real sky layout', () => {
  it("Orion: Betelgeuse is up-left of Rigel, and the belt runs between them", () => {
    const orion = getConstellation('orion');
    const at = (name) => orion.dots[orion.starNames.indexOf(name)];
    const [bx, by] = at('Betelgeuse');
    const [rx, ry] = at('Rigel');
    expect(bx).toBeLessThan(rx);
    expect(by).toBeLessThan(ry);
    for (const belt of ['Mintaka', 'Alnilam', 'Alnitak']) {
      const [, y] = at(belt);
      expect(y).toBeGreaterThan(by);
      expect(y).toBeLessThan(ry);
    }
  });

  it('Cassiopeia is a W: its middle star sits higher than the two dips', () => {
    const cas = getConstellation('cassiopeia');
    const at = (name) => cas.dots[cas.starNames.indexOf(name)];
    expect(at('Navi')[1]).toBeLessThan(at('Shedar')[1]);
    expect(at('Navi')[1]).toBeLessThan(at('Ruchbah')[1] + 1);
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
