let onBackCallback = null;
let onNewCallback = null;

export function bindToolbar({ onBack, onNew }) {
  onBackCallback = onBack;
  onNewCallback = onNew;
}

export function renderToolbar() {
  const container = document.getElementById('wz-toolbar');
  container.innerHTML = '';

  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'wz-toolbar-btn';
  backBtn.textContent = "🏠 Thema's";
  backBtn.addEventListener('click', () => onBackCallback && onBackCallback());
  container.appendChild(backBtn);

  const newBtn = document.createElement('button');
  newBtn.type = 'button';
  newBtn.className = 'wz-toolbar-btn';
  newBtn.textContent = '🔁 Nieuw';
  newBtn.addEventListener('click', () => onNewCallback && onNewCallback());
  container.appendChild(newBtn);
}
