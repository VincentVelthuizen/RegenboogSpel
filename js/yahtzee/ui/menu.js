const OPTIONS = [
  { variant: 'classic', mode: 'digital', emoji: '🎲', label: 'Klassiek', sub: 'digitale dobbelstenen' },
  { variant: 'classic', mode: 'physical', emoji: '📋', label: 'Scorebord', sub: 'met je eigen dobbelstenen' },
  { variant: 'kids', mode: 'digital', emoji: '🧸', label: 'Kids', sub: 'voor de kleintjes' },
];

let onSelectCallback = null;

export function bindMenu(handler) {
  onSelectCallback = handler;
}

export function renderMenu() {
  const container = document.getElementById('yz-menu');
  container.innerHTML = '';

  OPTIONS.forEach((opt) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'yz-menu-card';

    const emoji = document.createElement('span');
    emoji.className = 'yz-menu-emoji';
    emoji.textContent = opt.emoji;

    const label = document.createElement('span');
    label.className = 'yz-menu-label';
    label.textContent = opt.label;

    const sub = document.createElement('span');
    sub.className = 'yz-menu-sub';
    sub.textContent = opt.sub;

    btn.append(emoji, label, sub);
    btn.addEventListener('click', () => {
      if (onSelectCallback) onSelectCallback(opt.variant, opt.mode);
    });
    container.appendChild(btn);
  });
}
