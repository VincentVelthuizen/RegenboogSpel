import { describe, it, expect } from 'vitest';
import { boxOrigin, isValidPlacement } from '../../js/sudoku/game/grid.js';

describe('boxOrigin', () => {
  it('finds the top-left of the 3x3 box for a 9x9 grid', () => {
    expect(boxOrigin(4, 5, 3, 3)).toEqual([3, 3]);
    expect(boxOrigin(0, 0, 3, 3)).toEqual([0, 0]);
    expect(boxOrigin(8, 8, 3, 3)).toEqual([6, 6]);
  });

  it('finds the top-left of a 2x3 box for a 6x6 grid', () => {
    expect(boxOrigin(3, 4, 2, 3)).toEqual([2, 3]);
  });
});

describe('isValidPlacement', () => {
  it('rejects a value already present in the same row', () => {
    const grid = [
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    expect(isValidPlacement(grid, 4, 2, 2, 0, 1, 1)).toBe(false);
  });

  it('rejects a value already present in the same column', () => {
    const grid = [
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    expect(isValidPlacement(grid, 4, 2, 2, 2, 0, 1)).toBe(false);
  });

  it('rejects a value already present in the same box', () => {
    const grid = [
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    expect(isValidPlacement(grid, 4, 2, 2, 1, 1, 1)).toBe(false);
  });

  it('accepts a value with no conflicts', () => {
    const grid = [
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    expect(isValidPlacement(grid, 4, 2, 2, 3, 3, 1)).toBe(true);
  });

  it('ignores the cell itself when checking its own current value', () => {
    const grid = [
      [1, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    expect(isValidPlacement(grid, 4, 2, 2, 0, 0, 1)).toBe(true);
  });
});
