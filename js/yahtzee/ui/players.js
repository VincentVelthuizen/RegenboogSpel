const MAX_PLAYERS = 6;

let onStartCallback = null;

export function bindPlayers(handler) {
  onStartCallback = handler;
}

export function renderPlayers() {
  const container = document.getElementById('yz-players');
  container.innerHTML = '';

  const title = document.createElement('h2');
  title.className = 'yz-title';
  title.textContent = 'Wie speelt er mee?';
  container.appendChild(title);

  const list = document.createElement('div');
  list.className = 'yz-player-list';
  container.appendChild(list);

  function addRow() {
    if (list.children.length >= MAX_PLAYERS) return;

    const row = document.createElement('div');
    row.className = 'yz-player-row';

    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'yz-player-input';
    input.placeholder = `Speler ${list.children.length + 1}`;
    input.maxLength = 20;
    row.appendChild(input);

    if (list.children.length > 0) {
      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'yz-remove-player-btn';
      removeBtn.setAttribute('aria-label', 'speler verwijderen');
      removeBtn.textContent = '✕';
      removeBtn.addEventListener('click', () => row.remove());
      row.appendChild(removeBtn);
    }

    list.appendChild(row);
  }

  addRow();

  const addBtn = document.createElement('button');
  addBtn.type = 'button';
  addBtn.className = 'yz-add-player-btn';
  addBtn.textContent = '+ Speler';
  addBtn.addEventListener('click', addRow);
  container.appendChild(addBtn);

  const startBtn = document.createElement('button');
  startBtn.type = 'button';
  startBtn.className = 'yz-start-btn';
  startBtn.textContent = '🎉 Start spel';
  startBtn.addEventListener('click', () => {
    const names = Array.from(list.querySelectorAll('.yz-player-input')).map(
      (input, i) => input.value.trim() || `Speler ${i + 1}`,
    );
    if (onStartCallback) onStartCallback(names);
  });
  container.appendChild(startBtn);
}
