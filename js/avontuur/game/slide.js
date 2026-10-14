// Sliding puzzle model. The board is a list of cells, row by row; each cell
// holds a tile id or null (the one empty cell). Solved: tile i in cell i,
// with the empty cell last (bottom right).

export const SLIDE_GRID = { cols: 3, rows: 3 };

// How many random moves are made from the solved board. Few enough for a
// young child, and every puzzle is solvable because it is made by moves.
export const SCRAMBLE_MOVES = 10;

export function solvedBoard({ cols, rows }) {
  const n = cols * rows;
  return Array.from({ length: n }, (_, i) => (i < n - 1 ? i : null));
}

export function isSolved(board) {
  return board.every((tile, i) => (i < board.length - 1 ? tile === i : tile === null));
}

export function neighbours(cell, { cols, rows }) {
  const col = cell % cols;
  const row = Math.floor(cell / cols);
  const out = [];
  if (row > 0) out.push(cell - cols);
  if (row < rows - 1) out.push(cell + cols);
  if (col > 0) out.push(cell - 1);
  if (col < cols - 1) out.push(cell + 1);
  return out;
}

export function canMove(board, cell, grid) {
  return board[cell] !== null && neighbours(cell, grid).includes(board.indexOf(null));
}

// Slide the tile in `cell` into the empty cell (if they touch).
export function move(board, cell, grid) {
  if (!canMove(board, cell, grid)) return board;
  const empty = board.indexOf(null);
  const next = board.slice();
  next[empty] = board[cell];
  next[cell] = null;
  return next;
}

// Random walk of the empty cell, never straight back; keeps going while the
// board happens to be solved.
export function scramble(grid, moves = SCRAMBLE_MOVES, random = Math.random) {
  let board = solvedBoard(grid);
  let previous = -1;
  for (let i = 0; i < moves || isSolved(board); i++) {
    const empty = board.indexOf(null);
    const options = neighbours(empty, grid).filter((cell) => cell !== previous);
    const cell = options[Math.floor(random() * options.length)];
    board = move(board, cell, grid);
    previous = empty;
  }
  return board;
}
