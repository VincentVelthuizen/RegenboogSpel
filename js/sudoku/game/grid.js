export function boxOrigin(row, col, boxRows, boxCols) {
  return [Math.floor(row / boxRows) * boxRows, Math.floor(col / boxCols) * boxCols];
}

// Whether `value` at (row, col) doesn't clash with the rest of the grid.
// The cell itself is skipped, so this also works to validate a value
// already sitting in the grid (pass grid[row][col] as value).
export function isValidPlacement(grid, size, boxRows, boxCols, row, col, value) {
  for (let c = 0; c < size; c++) {
    if (c !== col && grid[row][c] === value) return false;
  }
  for (let r = 0; r < size; r++) {
    if (r !== row && grid[r][col] === value) return false;
  }

  const [boxRow, boxCol] = boxOrigin(row, col, boxRows, boxCols);
  for (let r = boxRow; r < boxRow + boxRows; r++) {
    for (let c = boxCol; c < boxCol + boxCols; c++) {
      if ((r !== row || c !== col) && grid[r][c] === value) return false;
    }
  }

  return true;
}
