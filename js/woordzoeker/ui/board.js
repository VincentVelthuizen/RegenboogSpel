import { computeLine } from '../game/state.js';

let onSelectCallback = null;
let cellEls = null; // cellEls[row][col] -> button element, rebuilt on every render
let drag = null; // { startRow, startCol, moved, path: [{row,col}, ...] }

export function bindBoard(handler) {
  onSelectCallback = handler;
}

function foundCellSet(words) {
  const set = new Set();
  words.forEach((w) => {
    if (w.found) w.cells.forEach((c) => set.add(`${c.row},${c.col}`));
  });
  return set;
}

function cellFromPoint(x, y) {
  const el = document.elementFromPoint(x, y);
  const cell = el && el.closest && el.closest('.wz-cell');
  if (!cell) return null;
  return { row: Number(cell.dataset.row), col: Number(cell.dataset.col) };
}

function dragPath(start, end) {
  return computeLine(start, end) || [start];
}

function setDragClass(path, on) {
  path.forEach(({ row, col }) => {
    const el = cellEls?.[row]?.[col];
    if (el) el.classList.toggle('wz-dragging', on);
  });
}

function stopTrackingDrag() {
  window.removeEventListener('pointermove', handleWindowPointerMove);
  window.removeEventListener('pointerup', handleWindowPointerUp);
  window.removeEventListener('pointercancel', handleWindowPointerCancel);
}

function handleWindowPointerMove(event) {
  if (!drag) return;
  const hover = cellFromPoint(event.clientX, event.clientY);
  if (!hover) return;
  if (hover.row !== drag.startRow || hover.col !== drag.startCol) drag.moved = true;

  setDragClass(drag.path, false);
  drag.path = dragPath({ row: drag.startRow, col: drag.startCol }, hover);
  setDragClass(drag.path, true);
}

function handleWindowPointerUp(event) {
  if (!drag) return;
  const hover = cellFromPoint(event.clientX, event.clientY);
  setDragClass(drag.path, false);

  const { startRow, startCol, moved } = drag;
  drag = null;
  stopTrackingDrag();

  // A plain tap (no movement) is left entirely to the native `click` event,
  // so mouse taps, touch taps and keyboard activation share one code path.
  if (!moved || !onSelectCallback) return;

  onSelectCallback(startRow, startCol);
  onSelectCallback(hover ? hover.row : startRow, hover ? hover.col : startCol);
}

function handleWindowPointerCancel() {
  if (!drag) return;
  setDragClass(drag.path, false);
  drag = null;
  stopTrackingDrag();
}

function handleGridPointerDown(event) {
  const cell = event.target.closest('.wz-cell');
  if (!cell) return;

  const row = Number(cell.dataset.row);
  const col = Number(cell.dataset.col);
  drag = { startRow: row, startCol: col, moved: false, path: [{ row, col }] };
  setDragClass(drag.path, true);

  window.addEventListener('pointermove', handleWindowPointerMove);
  window.addEventListener('pointerup', handleWindowPointerUp);
  window.addEventListener('pointercancel', handleWindowPointerCancel);
}

// Handles plain clicks/taps (no drag movement) and keyboard activation
// (Enter/Space on a focused cell), all via the browser's native click.
function handleClick(event) {
  const cell = event.target.closest('.wz-cell');
  if (!cell || !onSelectCallback) return;
  onSelectCallback(Number(cell.dataset.row), Number(cell.dataset.col));
}

export function renderBoard(state) {
  const container = document.getElementById('wz-board');
  container.innerHTML = '';
  stopTrackingDrag();
  drag = null;
  if (!state.grid) return;

  const found = foundCellSet(state.words);
  const grid = document.createElement('div');
  grid.className = 'wz-grid';
  grid.style.gridTemplateColumns = `repeat(${state.size}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${state.size}, 1fr)`;

  cellEls = Array.from({ length: state.size }, () => new Array(state.size).fill(null));

  for (let r = 0; r < state.size; r++) {
    for (let c = 0; c < state.size; c++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'wz-cell';
      btn.dataset.row = String(r);
      btn.dataset.col = String(c);
      if (found.has(`${r},${c}`)) btn.classList.add('wz-found');
      if (state.selectionStart && state.selectionStart.row === r && state.selectionStart.col === c) {
        btn.classList.add('wz-selecting');
      }
      btn.textContent = state.grid[r][c];
      btn.setAttribute('aria-label', `rij ${r + 1}, kolom ${c + 1}, letter ${state.grid[r][c]}`);
      cellEls[r][c] = btn;
      grid.appendChild(btn);
    }
  }

  grid.addEventListener('pointerdown', handleGridPointerDown);
  grid.addEventListener('click', handleClick);

  container.appendChild(grid);
}

export function renderWordList(state) {
  const container = document.getElementById('wz-wordlist');
  container.innerHTML = '';
  if (!state.words) return;

  const list = document.createElement('ul');
  list.className = 'wz-word-list';
  state.words.forEach((w) => {
    const li = document.createElement('li');
    li.className = w.found ? 'wz-word-found' : '';
    li.textContent = w.found ? `✅ ${w.word}` : w.word;
    list.appendChild(li);
  });

  container.appendChild(list);
}
