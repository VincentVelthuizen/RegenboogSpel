import { describe, it, expect } from 'vitest';
import {
  SLIDE_GRID, solvedBoard, isSolved, neighbours, canMove, move, scramble,
} from '../../js/avontuur/game/slide.js';

const grid = { cols: 3, rows: 3 };

describe('sliding puzzle', () => {
  it('starts solved with the empty cell bottom right', () => {
    expect(solvedBoard(grid)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, null]);
    expect(isSolved(solvedBoard(grid))).toBe(true);
  });

  it('knows the neighbours of a cell', () => {
    expect(neighbours(0, grid).sort()).toEqual([1, 3]);
    expect(neighbours(4, grid).sort()).toEqual([1, 3, 5, 7]);
    expect(neighbours(8, grid).sort()).toEqual([5, 7]);
  });

  it('only moves tiles next to the empty cell', () => {
    const board = solvedBoard(grid);
    expect(canMove(board, 7, grid)).toBe(true);
    expect(canMove(board, 5, grid)).toBe(true);
    expect(canMove(board, 4, grid)).toBe(false);
    expect(canMove(board, 8, grid)).toBe(false);
    expect(move(board, 4, grid)).toBe(board);
    expect(move(board, 7, grid)).toEqual([0, 1, 2, 3, 4, 5, 6, null, 7]);
  });

  it('scrambles into an unsolved board that the moves can undo', () => {
    for (let seed = 0; seed < 20; seed++) {
      let x = seed + 1;
      const random = () => { x = (x * 16807) % 2147483647; return x / 2147483647; };
      const board = scramble(SLIDE_GRID, 10, random);
      expect(isSolved(board)).toBe(false);
      expect(board.slice().sort()).toEqual(solvedBoard(SLIDE_GRID).slice().sort());
    }
  });

  it('scrambling by moves keeps the puzzle solvable', () => {
    // Solvable 3×3 boards have an even number of inversions.
    const board = scramble(grid, 25);
    const tiles = board.filter((t) => t !== null);
    let inversions = 0;
    tiles.forEach((a, i) => tiles.slice(i + 1).forEach((b) => { if (a > b) inversions += 1; }));
    expect(inversions % 2).toBe(0);
  });
});
