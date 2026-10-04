import { describe, it, expect } from 'vitest';
import { projectStars, minSpacing } from '../../js/dots/game/sky.js';

describe('projectStars', () => {
  it('puts north up (higher declination -> smaller y)', () => {
    const [north, south] = projectStars([
      { ra: 100, dec: 30 },
      { ra: 100, dec: 20 },
    ]);
    expect(north[1]).toBeLessThan(south[1]);
  });

  it('puts east on the left, as seen looking up (higher RA -> smaller x)', () => {
    const [east, west] = projectStars([
      { ra: 110, dec: 0 },
      { ra: 100, dec: 0 },
    ]);
    expect(east[0]).toBeLessThan(west[0]);
  });

  it('fits the figure inside the margin, filling it along the longest side', () => {
    const pts = projectStars([
      { ra: 80, dec: -8 },
      { ra: 89, dec: 7 },
      { ra: 84, dec: 10 },
    ], 8);
    for (const [x, y] of pts) {
      expect(x).toBeGreaterThanOrEqual(8 - 0.05);
      expect(x).toBeLessThanOrEqual(92 + 0.05);
      expect(y).toBeGreaterThanOrEqual(8 - 0.05);
      expect(y).toBeLessThanOrEqual(92 + 0.05);
    }
    const ys = pts.map(([, y]) => y);
    expect(Math.max(...ys) - Math.min(...ys)).toBeCloseTo(84, 0);
  });

  it('keeps relative distances (uniform scale) for a small patch of sky', () => {
    // Three stars near the celestial equator: 2° east and 4° north of the first.
    const [a, b, c] = projectStars([
      { ra: 50, dec: 0 },
      { ra: 52, dec: 0 },
      { ra: 50, dec: 4 },
    ]);
    const ab = Math.hypot(a[0] - b[0], a[1] - b[1]);
    const ac = Math.hypot(a[0] - c[0], a[1] - c[1]);
    expect(ac / ab).toBeCloseTo(2, 1);
  });

  it('handles figures straddling RA 0h without wrapping around the board', () => {
    const pts = projectStars([
      { ra: 358, dec: 10 },
      { ra: 2, dec: 10 },
    ]);
    expect(Math.abs(pts[0][0] - pts[1][0])).toBeCloseTo(84, 0);
  });
});

describe('minSpacing', () => {
  it('returns the smallest distance between any two points', () => {
    expect(minSpacing([[0, 0], [3, 4], [10, 0]])).toBe(5);
  });
});
