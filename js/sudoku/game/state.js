import { generatePuzzle } from './generator.js';
import { isValidPlacement } from './grid.js';
import { VARIANTS } from './variants.js';

export function createInitialState() {
  return {
    screen: 'menu',
    variantId: null,
    size: 0,
    boxRows: 0,
    boxCols: 0,
    puzzle: null,
    solution: null,
    given: null,
    selected: null,
  };
}

function puzzleFromVariant(variantId, rng) {
  const cfg = VARIANTS[variantId];
  const { puzzle, solution } = generatePuzzle(cfg.size, cfg.boxRows, cfg.boxCols, cfg.clueCount, rng);
  return {
    screen: 'playing',
    variantId,
    size: cfg.size,
    boxRows: cfg.boxRows,
    boxCols: cfg.boxCols,
    puzzle,
    solution,
    given: puzzle.map((row) => row.map((v) => v !== 0)),
    selected: null,
  };
}

export function startPuzzle(state, variantId, rng = Math.random) {
  return puzzleFromVariant(variantId, rng);
}

export function newPuzzle(state, rng = Math.random) {
  if (!state.variantId) return state;
  return puzzleFromVariant(state.variantId, rng);
}

export function selectCell(state, row, col) {
  if (state.screen !== 'playing') return state;
  if (state.given[row][col]) return state;
  return { ...state, selected: { row, col } };
}

function isComplete(state) {
  for (let r = 0; r < state.size; r++) {
    for (let c = 0; c < state.size; c++) {
      if (state.puzzle[r][c] !== state.solution[r][c]) return false;
    }
  }
  return true;
}

export function setValue(state, value) {
  if (state.screen !== 'playing' || !state.selected) return state;
  const { row, col } = state.selected;
  if (state.given[row][col]) return state;

  const puzzle = state.puzzle.map((r) => r.slice());
  puzzle[row][col] = value;

  const next = { ...state, puzzle };
  return isComplete(next) ? { ...next, screen: 'celebrating', selected: null } : next;
}

export function clearCell(state) {
  return setValue(state, 0);
}

export function hasConflict(state, row, col) {
  const value = state.puzzle[row][col];
  if (!value) return false;
  return !isValidPlacement(state.puzzle, state.size, state.boxRows, state.boxCols, row, col, value);
}

export function backToMenu(_state) {
  return createInitialState();
}

export function restart(_state) {
  return createInitialState();
}
