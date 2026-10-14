import { describe, it, expect } from 'vitest';
import { gridFor, makePieces, shuffled, fitsCell, isSolved } from '../../js/avontuur/game/jigsaw.js';

describe('jigsaw', () => {
  it('cuts wide pictures 3×2 and tall ones 2×3', () => {
    expect(gridFor({ width: 60, height: 40 })).toEqual({ cols: 3, rows: 2 });
    expect(gridFor({ width: 40, height: 60 })).toEqual({ cols: 2, rows: 3 });
  });

  it('makes pieces that tile the box exactly', () => {
    const box = { x: 10, y: 20, width: 60, height: 40 };
    const pieces = makePieces(box, { cols: 3, rows: 2 });
    expect(pieces).toHaveLength(6);
    expect(pieces[4]).toEqual({ id: 4, col: 1, row: 1, viewBox: { x: 30, y: 40, width: 20, height: 20 } });
    const area = pieces.reduce((sum, p) => sum + p.viewBox.width * p.viewBox.height, 0);
    expect(area).toBe(60 * 40);
  });

  it('never shuffles into the solved order', () => {
    const items = [1, 2, 3];
    let calls = 0;
    // A "random" that would keep the order on the first attempt.
    const random = () => (calls++ < 2 ? 0.99 : 0);
    const out = shuffled(items, random);
    expect(out).not.toEqual(items);
    expect(out.slice().sort()).toEqual(items);
  });

  it('accepts a drop anywhere inside the piece’s own cell only', () => {
    const grid = { cols: 3, rows: 2 };
    const piece = { col: 1, row: 1 };
    expect(fitsCell(piece, grid, 0.5, 0.75)).toBe(true);
    expect(fitsCell(piece, grid, 0.34, 0.51)).toBe(true);
    expect(fitsCell(piece, grid, 0.2, 0.75)).toBe(false);
    expect(fitsCell(piece, grid, 0.5, 0.25)).toBe(false);
    expect(fitsCell(piece, grid, 0.5, 1.2)).toBe(false);
  });

  it('is solved when every piece is placed', () => {
    const pieces = [{ id: 0 }, { id: 1 }];
    expect(isSolved(pieces, new Set([0]))).toBe(false);
    expect(isSolved(pieces, new Set([1, 0]))).toBe(true);
  });
});
