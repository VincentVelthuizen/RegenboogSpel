import { describe, it, expect } from 'vitest';
import { pathPoints, partBounds, pictureBounds } from '../../js/avontuur/game/geometry.js';
import { getPuzzle } from '../../js/dots/game/puzzles.js';

describe('pathPoints', () => {
  it('reads end and control points of M/L/Q/C paths', () => {
    expect(pathPoints('M10,20 L30,40 Q50,60 70,80 Z')).toEqual([[10, 20], [30, 40], [50, 60], [70, 80]]);
    expect(pathPoints('M0,0 C1,2 3,4 5,6')).toEqual([[0, 0], [1, 2], [3, 4], [5, 6]]);
  });

  it('takes only the end point of an arc, and handles H/V', () => {
    expect(pathPoints('M44,90 L44,72 A6,6 0 0 1 56,72 L56,90 Z')).toEqual([[44, 90], [44, 72], [56, 72], [56, 90]]);
    expect(pathPoints('M38,9 V18 H40')).toEqual([[38, 9], [38, 18], [40, 18]]);
  });

  it('continues implicit repeated commands', () => {
    expect(pathPoints('M0,0 L1,1 2,2')).toEqual([[0, 0], [1, 1], [2, 2]]);
  });
});

describe('bounds', () => {
  it('measures every detail type', () => {
    expect(partBounds({ type: 'circle', attrs: { cx: 10, cy: 20, r: 5 } })).toEqual({ minX: 5, minY: 15, maxX: 15, maxY: 25 });
    expect(partBounds({ type: 'rect', attrs: { x: 1, y: 2, width: 3, height: 4 } })).toEqual({ minX: 1, minY: 2, maxX: 4, maxY: 6 });
    expect(partBounds({ type: 'line', attrs: { x1: 9, y1: 1, x2: 2, y2: 8 } })).toEqual({ minX: 2, minY: 1, maxX: 9, maxY: 8 });
  });

  it('frames the outline with a margin, clamped to the drawing space', () => {
    const picture = { dots: [[20, 30], [80, 30], [80, 70], [20, 70]] };
    expect(pictureBounds(picture)).toEqual({ x: 17, y: 27, width: 66, height: 46 });
    expect(pictureBounds({ dots: [[1, 1], [99, 99]] })).toEqual({ x: 0, y: 0, width: 100, height: 100 });
  });

  it('includes details sticking out of the outline, like a balloon string', () => {
    const ballon = getPuzzle('ballon');
    const dotsBottom = Math.max(...ballon.dots.map(([, y]) => y));
    const box = pictureBounds(ballon, 0);
    expect(box.y + box.height).toBeGreaterThan(dotsBottom + 5);
  });
});
