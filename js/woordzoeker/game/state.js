import { themeWords } from './puzzles.js';
import { generatePuzzle } from './generator.js';

const KIDS_DIRECTIONS = [
  [0, 1], // left to right
  [1, 0], // top to bottom
];

const ALL_DIRECTIONS = [
  [0, 1], [0, -1], [1, 0], [-1, 0],
  [1, 1], [1, -1], [-1, 1], [-1, -1],
];

const MODE_CONFIG = {
  kids: { minSize: 6, directions: KIDS_DIRECTIONS, maxWords: 6, margin: 1 },
  standard: { minSize: 13, directions: ALL_DIRECTIONS, maxWords: 12, margin: 2 },
};

export function createInitialState() {
  return {
    screen: 'mode',
    mode: null,
    themeId: null,
    grid: null,
    size: 0,
    words: [],
    selectionStart: null,
  };
}

export function chooseMode(_state, mode) {
  return { ...createInitialState(), screen: 'theme', mode };
}

export function selectTheme(state, themeId, rng = Math.random) {
  const words = themeWords(themeId, state.mode);
  const cfg = MODE_CONFIG[state.mode];
  const { grid, size, words: placed } = generatePuzzle(words, cfg, rng);

  return {
    ...state,
    screen: 'playing',
    themeId,
    grid,
    size,
    words: placed.map((w) => ({ ...w, found: false })),
    selectionStart: null,
  };
}

export function newPuzzle(state, rng = Math.random) {
  if (!state.themeId) return state;
  return selectTheme(state, state.themeId, rng);
}

export function computeLine(start, end) {
  const dRow = end.row - start.row;
  const dCol = end.col - start.col;
  const steps = Math.max(Math.abs(dRow), Math.abs(dCol));
  if (steps === 0) return null;
  if (dRow !== 0 && dCol !== 0 && Math.abs(dRow) !== Math.abs(dCol)) return null;

  const stepRow = Math.sign(dRow);
  const stepCol = Math.sign(dCol);
  const cells = [];
  for (let i = 0; i <= steps; i++) {
    cells.push({ row: start.row + stepRow * i, col: start.col + stepCol * i });
  }
  return cells;
}

function cellsEqual(a, b) {
  return a.length === b.length && a.every((cell, i) => cell.row === b[i].row && cell.col === b[i].col);
}

export function selectCell(state, row, col) {
  if (state.screen !== 'playing') return state;

  if (!state.selectionStart) {
    return { ...state, selectionStart: { row, col } };
  }

  if (state.selectionStart.row === row && state.selectionStart.col === col) {
    return { ...state, selectionStart: null };
  }

  const line = computeLine(state.selectionStart, { row, col });
  if (!line) return { ...state, selectionStart: { row, col } };

  const reversedLine = [...line].reverse();
  const match = state.words.find(
    (w) => !w.found && (cellsEqual(w.cells, line) || cellsEqual(w.cells, reversedLine)),
  );

  if (!match) return { ...state, selectionStart: null };

  const words = state.words.map((w) => (w === match ? { ...w, found: true } : w));
  const allFound = words.every((w) => w.found);

  return {
    ...state,
    words,
    selectionStart: null,
    screen: allFound ? 'celebrating' : 'playing',
  };
}

export function backToThemes(state) {
  return { ...createInitialState(), screen: 'theme', mode: state.mode };
}

export function backToModeSelect(_state) {
  return createInitialState();
}

export function restart(_state) {
  return createInitialState();
}
