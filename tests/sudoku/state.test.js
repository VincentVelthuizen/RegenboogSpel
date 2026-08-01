import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  startPuzzle,
  newPuzzle,
  selectCell,
  setValue,
  clearCell,
  hasConflict,
  backToMenu,
} from '../../js/sudoku/game/state.js';

function seededRng(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

describe('createInitialState', () => {
  it('starts on the menu screen', () => {
    const s = createInitialState();
    expect(s.screen).toBe('menu');
    expect(s.variantId).toBeNull();
  });
});

describe('startPuzzle', () => {
  it('generates a puzzle for the chosen variant and marks given cells', () => {
    const s = startPuzzle(createInitialState(), 'kids4', seededRng(1));
    expect(s.screen).toBe('playing');
    expect(s.size).toBe(4);
    expect(s.puzzle).toHaveLength(4);
    const givenCount = s.given.flat().filter(Boolean).length;
    const filledCount = s.puzzle.flat().filter((v) => v !== 0).length;
    expect(givenCount).toBe(filledCount);
    expect(givenCount).toBeLessThanOrEqual(10);
  });
});

describe('selectCell', () => {
  it('selects an empty cell', () => {
    let s = startPuzzle(createInitialState(), 'kids4', seededRng(2));
    const emptyCell = findEmptyCell(s);
    s = selectCell(s, emptyCell.row, emptyCell.col);
    expect(s.selected).toEqual(emptyCell);
  });

  it('refuses to select a given cell', () => {
    let s = startPuzzle(createInitialState(), 'kids4', seededRng(3));
    const givenCell = findGivenCell(s);
    const after = selectCell(s, givenCell.row, givenCell.col);
    expect(after.selected).toBeNull();
  });
});

function findEmptyCell(state) {
  for (let r = 0; r < state.size; r++) {
    for (let c = 0; c < state.size; c++) {
      if (!state.given[r][c]) return { row: r, col: c };
    }
  }
  throw new Error('no empty cell found');
}

function findGivenCell(state) {
  for (let r = 0; r < state.size; r++) {
    for (let c = 0; c < state.size; c++) {
      if (state.given[r][c]) return { row: r, col: c };
    }
  }
  throw new Error('no given cell found');
}

describe('setValue / clearCell', () => {
  it('does nothing without a selection', () => {
    const s = startPuzzle(createInitialState(), 'kids4', seededRng(4));
    const after = setValue(s, 1);
    expect(after).toBe(s);
  });

  it('writes the value into the selected empty cell', () => {
    let s = startPuzzle(createInitialState(), 'kids4', seededRng(5));
    const cell = findEmptyCell(s);
    s = selectCell(s, cell.row, cell.col);
    s = setValue(s, 3);
    expect(s.puzzle[cell.row][cell.col]).toBe(3);
  });

  it('clearCell resets the selected cell to empty', () => {
    let s = startPuzzle(createInitialState(), 'kids4', seededRng(6));
    const cell = findEmptyCell(s);
    s = selectCell(s, cell.row, cell.col);
    s = setValue(s, 2);
    s = clearCell(s);
    expect(s.puzzle[cell.row][cell.col]).toBe(0);
  });

  it('moves to celebrating once the grid matches the solution', () => {
    let s = startPuzzle(createInitialState(), 'kids4', seededRng(7));
    // Fill every non-given cell with the solution value.
    for (let r = 0; r < s.size; r++) {
      for (let c = 0; c < s.size; c++) {
        if (!s.given[r][c]) {
          s = selectCell(s, r, c);
          s = setValue(s, s.solution[r][c]);
        }
      }
    }
    expect(s.screen).toBe('celebrating');
    expect(s.selected).toBeNull();
  });
});

describe('hasConflict', () => {
  it('is false for an empty cell', () => {
    const s = startPuzzle(createInitialState(), 'kids4', seededRng(8));
    const cell = findEmptyCell(s);
    expect(hasConflict(s, cell.row, cell.col)).toBe(false);
  });

  it('detects a value duplicated in the same row', () => {
    let s = startPuzzle(createInitialState(), 'kids4', seededRng(9));
    // Find an empty cell and place the value already used elsewhere in its row.
    const cell = findEmptyCell(s);
    const rowValue = s.puzzle[cell.row].find((v) => v !== 0);
    s = selectCell(s, cell.row, cell.col);
    s = setValue(s, rowValue);
    expect(hasConflict(s, cell.row, cell.col)).toBe(true);
  });
});

describe('newPuzzle', () => {
  it('regenerates a puzzle for the same variant', () => {
    let s = startPuzzle(createInitialState(), 'kids4', seededRng(10));
    const variantId = s.variantId;
    s = newPuzzle(s, seededRng(11));
    expect(s.variantId).toBe(variantId);
    expect(s.screen).toBe('playing');
    expect(s.selected).toBeNull();
  });
});

describe('backToMenu', () => {
  it('returns to a fresh menu state', () => {
    const s = startPuzzle(createInitialState(), 'kids4', seededRng(12));
    expect(backToMenu(s)).toEqual(createInitialState());
  });
});
