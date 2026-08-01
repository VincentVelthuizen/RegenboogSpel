import { describe, it, expect } from 'vitest';
import { generateSolvedGrid, generatePuzzle } from '../../js/sudoku/game/generator.js';
import { isValidPlacement } from '../../js/sudoku/game/grid.js';

function seededRng(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function isFullyValid(grid, size, boxRows, boxCols) {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!isValidPlacement(grid, size, boxRows, boxCols, r, c, grid[r][c])) return false;
    }
  }
  return true;
}

describe('generateSolvedGrid', () => {
  it('produces a fully-filled, rule-valid 4x4 grid', () => {
    const grid = generateSolvedGrid(4, 2, 2, seededRng(1));
    expect(grid.flat().every((v) => v >= 1 && v <= 4)).toBe(true);
    expect(isFullyValid(grid, 4, 2, 2)).toBe(true);
  });

  it('produces a fully-filled, rule-valid 9x9 grid', () => {
    const grid = generateSolvedGrid(9, 3, 3, seededRng(2));
    expect(grid.flat().every((v) => v >= 1 && v <= 9)).toBe(true);
    expect(isFullyValid(grid, 9, 3, 3)).toBe(true);
  });

  it('produces a fully-filled, rule-valid 6x6 grid with 2x3 boxes', () => {
    const grid = generateSolvedGrid(6, 2, 3, seededRng(3));
    expect(grid.flat().every((v) => v >= 1 && v <= 6)).toBe(true);
    expect(isFullyValid(grid, 6, 2, 3)).toBe(true);
  });
});

describe('generatePuzzle', () => {
  it('returns a puzzle whose given cells match the solution', () => {
    const { puzzle, solution } = generatePuzzle(4, 2, 2, 10, seededRng(4));
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (puzzle[r][c] !== 0) expect(puzzle[r][c]).toBe(solution[r][c]);
      }
    }
  });

  it('removes clues down to (at most) the requested count', () => {
    const { puzzle } = generatePuzzle(4, 2, 2, 10, seededRng(5));
    const clues = puzzle.flat().filter((v) => v !== 0).length;
    expect(clues).toBeLessThanOrEqual(10);
  });

  it('the solution is itself a valid complete grid', () => {
    const { solution } = generatePuzzle(6, 2, 3, 20, seededRng(6));
    expect(isFullyValid(solution, 6, 2, 3)).toBe(true);
  });

  it('generates a 9x9 hard puzzle with a unique solution in reasonable time', () => {
    const start = Date.now();
    const { puzzle, solution } = generatePuzzle(9, 3, 3, 26, seededRng(7));
    const elapsed = Date.now() - start;
    expect(isFullyValid(solution, 9, 3, 3)).toBe(true);
    expect(puzzle.flat().filter((v) => v !== 0).length).toBeLessThanOrEqual(40);
    expect(elapsed).toBeLessThan(5000);
  });
});
