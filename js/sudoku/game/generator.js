import { isValidPlacement } from './grid.js';

function emptyGrid(size) {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

function shuffledValues(size, rng) {
  const values = Array.from({ length: size }, (_, i) => i + 1);
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
}

function shuffledPositions(size, rng) {
  const positions = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) positions.push([r, c]);
  }
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  return positions;
}

// Fills the grid completely with a randomized backtracking search.
export function generateSolvedGrid(size, boxRows, boxCols, rng = Math.random) {
  const grid = emptyGrid(size);

  function fill(pos) {
    if (pos === size * size) return true;
    const row = Math.floor(pos / size);
    const col = pos % size;

    for (const value of shuffledValues(size, rng)) {
      if (isValidPlacement(grid, size, boxRows, boxCols, row, col, value)) {
        grid[row][col] = value;
        if (fill(pos + 1)) return true;
        grid[row][col] = 0;
      }
    }
    return false;
  }

  fill(0);
  return grid;
}

// Counts solutions of `grid` up to `limit`, stopping early once reached —
// only used to confirm a puzzle still has exactly one solution.
function countSolutions(grid, size, boxRows, boxCols, limit) {
  let count = 0;

  function solve(pos) {
    if (count >= limit) return;
    if (pos === size * size) {
      count++;
      return;
    }
    const row = Math.floor(pos / size);
    const col = pos % size;

    if (grid[row][col] !== 0) {
      solve(pos + 1);
      return;
    }

    for (let value = 1; value <= size; value++) {
      if (isValidPlacement(grid, size, boxRows, boxCols, row, col, value)) {
        grid[row][col] = value;
        solve(pos + 1);
        grid[row][col] = 0;
        if (count >= limit) return;
      }
    }
  }

  solve(0);
  return count;
}

// Generates a puzzle with a unique solution, removing clues down to
// `clueCount` (or as close to it as uniqueness allows).
export function generatePuzzle(size, boxRows, boxCols, clueCount, rng = Math.random) {
  const solution = generateSolvedGrid(size, boxRows, boxCols, rng);
  const puzzle = solution.map((row) => row.slice());

  let clues = size * size;
  for (const [row, col] of shuffledPositions(size, rng)) {
    if (clues <= clueCount) break;

    const backup = puzzle[row][col];
    puzzle[row][col] = 0;

    const solutions = countSolutions(puzzle.map((r) => r.slice()), size, boxRows, boxCols, 2);
    if (solutions === 1) {
      clues--;
    } else {
      puzzle[row][col] = backup;
    }
  }

  return { puzzle, solution };
}
