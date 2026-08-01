import { shuffle } from '../../game/random.js';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const PLACEMENT_ATTEMPTS = 200;

function computeGridSize(words, minSize) {
  const longest = words.reduce((max, w) => Math.max(max, w.length), 0);
  return Math.max(minSize, longest + 2);
}

function canPlace(grid, size, word, row, col, dRow, dCol) {
  for (let i = 0; i < word.length; i++) {
    const r = row + dRow * i;
    const c = col + dCol * i;
    if (r < 0 || r >= size || c < 0 || c >= size) return false;
    const cell = grid[r][c];
    if (cell !== null && cell !== word[i]) return false;
  }
  return true;
}

function place(grid, word, row, col, dRow, dCol) {
  const cells = [];
  for (let i = 0; i < word.length; i++) {
    const r = row + dRow * i;
    const c = col + dCol * i;
    grid[r][c] = word[i];
    cells.push({ row: r, col: c });
  }
  return cells;
}

// Builds a letter grid with each word placed once in a straight line
// (as allowed by `directions`), then fills the remaining cells with
// random letters. Words that can't be placed after a bounded number of
// attempts are simply left out of the returned word list.
export function generatePuzzle(words, { minSize, directions, maxWords }, rng = Math.random) {
  const chosenWords = shuffle(words, rng).slice(0, maxWords);
  const size = computeGridSize(chosenWords, minSize);
  const grid = Array.from({ length: size }, () => Array(size).fill(null));
  const placedWords = [];

  const byLengthDesc = [...chosenWords].sort((a, b) => b.length - a.length);
  byLengthDesc.forEach((word) => {
    for (let attempt = 0; attempt < PLACEMENT_ATTEMPTS; attempt++) {
      const [dRow, dCol] = directions[Math.floor(rng() * directions.length)];
      const row = Math.floor(rng() * size);
      const col = Math.floor(rng() * size);
      if (canPlace(grid, size, word, row, col, dRow, dCol)) {
        placedWords.push({ word, cells: place(grid, word, row, col, dRow, dCol) });
        return;
      }
    }
  });

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === null) grid[r][c] = ALPHABET[Math.floor(rng() * ALPHABET.length)];
    }
  }

  return { grid, size, words: placedWords };
}
