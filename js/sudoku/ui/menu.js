import { VARIANT_GROUPS, VARIANTS } from '../game/variants.js';

let onSelectCallback = null;

export function bindMenu(handler) {
  onSelectCallback = handler;
}

export function renderMenu() {
  const container = document.getElementById('su-menu');
  container.innerHTML = '';

  VARIANT_GROUPS.forEach((group) => {
    const section = document.createElement('div');
    section.className = 'su-menu-group';

    const heading = document.createElement('h2');
    heading.className = 'su-menu-heading';
    heading.textContent = `${group.emoji} ${group.label}`;
    section.appendChild(heading);

    const row = document.createElement('div');
    row.className = 'su-menu-row';
    group.variantIds.forEach((variantId) => {
      const variant = VARIANTS[variantId];
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'su-menu-card';
      btn.textContent = variant.label;
      btn.addEventListener('click', () => onSelectCallback && onSelectCallback(variantId));
      row.appendChild(btn);
    });

    section.appendChild(row);
    container.appendChild(section);
  });
}
