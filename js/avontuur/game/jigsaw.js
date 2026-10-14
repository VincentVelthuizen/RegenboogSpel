// Jigsaw model: the picture's bounds (see geometry.js) are cut into a grid
// of pieces; each piece belongs in exactly one cell.

// Six pieces: 3 wide × 2 high, or 2 × 3 for tall pictures.
export function gridFor(box) {
  return box.height > box.width ? { cols: 2, rows: 3 } : { cols: 3, rows: 2 };
}

export function makePieces(box, { cols, rows }) {
  const w = box.width / cols;
  const h = box.height / rows;
  const pieces = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      pieces.push({
        id: row * cols + col,
        col,
        row,
        viewBox: { x: box.x + col * w, y: box.y + row * h, width: w, height: h },
      });
    }
  }
  return pieces;
}

// Fisher–Yates shuffle that never returns the solved order (for 2+ items).
export function shuffled(items, random = Math.random) {
  if (items.length < 2) return items.slice();
  let out;
  do {
    out = items.slice();
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
  } while (out.every((item, i) => item === items[i]));
  return out;
}

// Does dropping a piece with its centre at (x, y) — in board fractions,
// 0..1 — put it in its own cell? Anywhere inside the cell counts.
export function fitsCell(piece, { cols, rows }, x, y) {
  return Math.floor(x * cols) === piece.col && Math.floor(y * rows) === piece.row
    && x >= 0 && x < 1 && y >= 0 && y < 1;
}

export function isSolved(pieces, placed) {
  return pieces.every((p) => placed.has(p.id));
}
