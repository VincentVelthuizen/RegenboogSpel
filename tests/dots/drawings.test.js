import { describe, it, expect } from 'vitest';
import { PUZZLES } from '../../js/dots/game/puzzles.js';
import { BABY_PUZZLES } from '../../js/dots/game/babypuzzles.js';
import { arc, mirrorX } from '../../js/dots/game/shapes.js';

const PICTURES = [...PUZZLES, ...BABY_PUZZLES];
const DETAIL_TYPES = ['circle', 'ellipse', 'rect', 'path', 'line'];

describe('cartoon picture puzzles', () => {
  it('every picture has a body fill next to its outline colour', () => {
    for (const p of PICTURES) {
      expect(typeof p.fill, p.id).toBe('string');
      expect(p.fill, p.id).not.toBe(p.color);
    }
  });

  it('every picture has drawable details', () => {
    for (const p of PICTURES) {
      expect(Array.isArray(p.details), p.id).toBe(true);
      expect(p.details.length, p.id).toBeGreaterThan(0);
      for (const part of p.details) {
        expect(DETAIL_TYPES, p.id).toContain(part.type);
        expect(part.fill || part.stroke, p.id).toBeTruthy();
        for (const v of Object.values(part.attrs)) {
          if (typeof v === 'number') expect(Number.isFinite(v), p.id).toBe(true);
          else expect(typeof v, p.id).toBe('string');
        }
      }
    }
  });

  it('keeps dots far enough apart to tap them one by one', () => {
    for (const p of PICTURES) {
      for (let i = 0; i < p.dots.length; i++) {
        for (let j = i + 1; j < p.dots.length; j++) {
          const [ax, ay] = p.dots[i];
          const [bx, by] = p.dots[j];
          expect(Math.hypot(ax - bx, ay - by), `${p.id} ${i + 1}-${j + 1}`).toBeGreaterThanOrEqual(5);
        }
      }
    }
  });
});

describe('shape helpers', () => {
  it('arc spreads n points from start to end angle inclusive', () => {
    const pts = arc(50, 50, 10, 20, 0, 180, 3);
    expect(pts).toEqual([[60, 50], [50, 70], [40, 50]]);
  });

  it('mirrorX closes a symmetric loop without repeating the axis points', () => {
    expect(mirrorX([[50, 0], [40, 10], [50, 20]])).toEqual([[50, 0], [40, 10], [50, 20], [60, 10]]);
  });
});
