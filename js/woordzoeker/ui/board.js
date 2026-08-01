let onSelectCallback = null;

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

export function renderBoard(state) {
  const container = document.getElementById('wz-board');
  container.innerHTML = '';
  if (!state.grid) return;

  const found = foundCellSet(state.words);
  const grid = document.createElement('div');
  grid.className = 'wz-grid';
  grid.style.gridTemplateColumns = `repeat(${state.size}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${state.size}, 1fr)`;

  for (let r = 0; r < state.size; r++) {
    for (let c = 0; c < state.size; c++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'wz-cell';
      if (found.has(`${r},${c}`)) btn.classList.add('wz-found');
      if (state.selectionStart && state.selectionStart.row === r && state.selectionStart.col === c) {
        btn.classList.add('wz-selecting');
      }
      btn.textContent = state.grid[r][c];
      btn.setAttribute('aria-label', `rij ${r + 1}, kolom ${c + 1}, letter ${state.grid[r][c]}`);
      btn.addEventListener('click', () => onSelectCallback && onSelectCallback(r, c));
      grid.appendChild(btn);
    }
  }

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
