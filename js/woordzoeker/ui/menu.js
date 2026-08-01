import { THEMES } from '../game/puzzles.js';

const MODES = [
  { id: 'kids', emoji: '🧸', label: 'Kids', sub: 'kleine woorden, kleiner raster' },
  { id: 'standard', emoji: '🔤', label: 'Klassiek', sub: 'groter raster, alle richtingen' },
];

let onModeCallback = null;
let onThemeCallback = null;
let onBackCallback = null;

export function bindModeSelect(handler) {
  onModeCallback = handler;
}

export function bindThemeSelect(handler) {
  onThemeCallback = handler;
}

export function bindThemeBack(handler) {
  onBackCallback = handler;
}

export function renderModeSelect() {
  const container = document.getElementById('wz-mode');
  container.innerHTML = '';

  MODES.forEach((mode) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'wz-menu-card';

    const emoji = document.createElement('span');
    emoji.className = 'wz-menu-emoji';
    emoji.textContent = mode.emoji;

    const label = document.createElement('span');
    label.className = 'wz-menu-label';
    label.textContent = mode.label;

    const sub = document.createElement('span');
    sub.className = 'wz-menu-sub';
    sub.textContent = mode.sub;

    btn.append(emoji, label, sub);
    btn.addEventListener('click', () => onModeCallback && onModeCallback(mode.id));
    container.appendChild(btn);
  });
}

export function renderThemeSelect() {
  const container = document.getElementById('wz-theme');
  container.innerHTML = '';

  const backBtn = document.createElement('button');
  backBtn.type = 'button';
  backBtn.className = 'wz-back-btn';
  backBtn.textContent = '← Terug';
  backBtn.addEventListener('click', () => onBackCallback && onBackCallback());
  container.appendChild(backBtn);

  const grid = document.createElement('div');
  grid.className = 'wz-menu-row';
  container.appendChild(grid);

  THEMES.forEach((theme) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'wz-menu-card';

    const emoji = document.createElement('span');
    emoji.className = 'wz-menu-emoji';
    emoji.textContent = theme.emoji;

    const label = document.createElement('span');
    label.className = 'wz-menu-label';
    label.textContent = theme.label;

    btn.append(emoji, label);
    btn.addEventListener('click', () => onThemeCallback && onThemeCallback(theme.id));
    grid.appendChild(btn);
  });
}
