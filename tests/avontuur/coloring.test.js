import { describe, it, expect } from 'vitest';
import {
  colorRegions, isColorable, pathBoxArea, paint, isFullyColored, BODY, PALETTE,
} from '../../js/avontuur/game/coloring.js';
import { STORY } from '../../js/avontuur/game/story.js';
import { getPuzzle } from '../../js/dots/game/puzzles.js';

describe('colouring page', () => {
  it('measures the bounding box of a path', () => {
    expect(pathBoxArea('M10,10 L30,10 Q30,20 10,25 Z')).toBe(20 * 15);
  });

  it('only lets big filled parts be coloured, not lines or small eyes', () => {
    expect(isColorable({ type: 'circle', attrs: { r: 8 }, fill: '#333' })).toBe(true);
    expect(isColorable({ type: 'circle', attrs: { r: 2 }, fill: '#333' })).toBe(false);
    expect(isColorable({ type: 'circle', attrs: { r: 5 }, fill: '#fff' })).toBe(false);
    expect(isColorable({ type: 'path', attrs: { d: 'M0,0 L20,20' }, fill: 'none', stroke: '#000' })).toBe(false);
    expect(isColorable({ type: 'line', attrs: { x1: 0, y1: 0, x2: 9, y2: 9 }, stroke: '#000' })).toBe(false);
    expect(isColorable({ type: 'rect', attrs: { width: 10, height: 10 }, fill: '#123' })).toBe(true);
  });

  it('always has the body as the first region', () => {
    for (const node of Object.values(STORY)) {
      const regions = colorRegions(getPuzzle(node.picture));
      expect(regions[0]).toBe(BODY);
      expect(new Set(regions).size).toBe(regions.length);
    }
  });

  it('paints without mutating and knows when everything is coloured', () => {
    const empty = {};
    const one = paint(empty, BODY, PALETTE[0]);
    expect(empty).toEqual({});
    expect(isFullyColored([BODY, 'd1'], one)).toBe(false);
    expect(isFullyColored([BODY, 'd1'], paint(one, 'd1', PALETTE[1]))).toBe(true);
  });
});
