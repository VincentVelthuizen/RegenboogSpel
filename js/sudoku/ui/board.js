import { hasConflict } from '../game/state.js';
import { boxOrigin } from '../game/grid.js';
import { KIDS_SYMBOLS } from '../game/variants.js';

let onSelectCallback = null;

export function bindBoard(handler) {
  onSelectCallback = handler;
}

function sameBox(r1, c1, r2, c2, boxRows, boxCols) {
  const [br1, bc1] = boxOrigin(r1, c1, boxRows, boxCols);
  const [br2, bc2] = boxOrigin(r2, c2, boxRows, boxCols);
  return br1 === br2 && bc1 === bc2;
}

export function renderBoard(state) {
  const container = document.getElementById('su-board');
  container.innerHTML = '';

  const { size, boxRows, boxCols, puzzle, given, selected } = state;
  const kidsSymbols = KIDS_SYMBOLS[state.variantId];

  const grid = document.createElement('div');
  grid.className = 'su-grid';
  grid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const value = puzzle[r][c];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'su-cell';

      if (given[r][c]) btn.classList.add('su-given');
      if (selected && selected.row === r && selected.col === c) {
        btn.classList.add('su-selected');
      } else if (
        selected &&
        (selected.row === r || selected.col === c || sameBox(r, c, selected.row, selected.col, boxRows, boxCols))
      ) {
        btn.classList.add('su-peer');
      }
      if (state.screen === 'playing' && hasConflict(state, r, c)) btn.classList.add('su-conflict');
      if ((c + 1) % boxCols === 0 && c !== size - 1) btn.classList.add('su-border-right');
      if ((r + 1) % boxRows === 0 && r !== size - 1) btn.classList.add('su-border-bottom');

      btn.textContent = value ? (kidsSymbols ? kidsSymbols[value - 1] : String(value)) : '';
      btn.disabled = given[r][c];
      btn.setAttribute('aria-label', value ? `rij ${r + 1}, kolom ${c + 1}, ${value}` : `rij ${r + 1}, kolom ${c + 1}, leeg`);
      btn.addEventListener('click', () => onSelectCallback && onSelectCallback(r, c));
      grid.appendChild(btn);
    }
  }

  container.appendChild(grid);
}
