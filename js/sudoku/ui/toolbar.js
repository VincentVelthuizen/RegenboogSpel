import { VARIANTS } from '../game/variants.js';

let onBackCallback = null;
let onNewCallback = null;

export function bindToolbar({ onBack, onNew }) {
  onBackCallback = onBack;
  onNewCallback = onNew;
}

export function renderToolbar(state) {
  const container = document.getElementById('su-toolbar');
  container.innerHTML = '';

  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'su-toolbar-btn';
  backBtn.textContent = '🏠 Menu';
  backBtn.addEventListener('click', () => onBackCallback && onBackCallback());
  container.appendChild(backBtn);

  const label = document.createElement('span');
  label.className = 'su-toolbar-label';
  label.textContent = VARIANTS[state.variantId] ? VARIANTS[state.variantId].label : '';
  container.appendChild(label);

  const newBtn = document.createElement('button');
  newBtn.type = 'button';
  newBtn.className = 'su-toolbar-btn';
  newBtn.textContent = '🔁 Nieuw';
  newBtn.addEventListener('click', () => onNewCallback && onNewCallback());
  container.appendChild(newBtn);
}
