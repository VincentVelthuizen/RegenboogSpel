import { SYMBOL_SETS } from '../game/variants.js';

let onValueCallback = null;
let onClearCallback = null;

export function bindPalette({ onValue, onClear }) {
  onValueCallback = onValue;
  onClearCallback = onClear;
}

export function renderPalette(state) {
  const container = document.getElementById('su-palette');
  container.innerHTML = '';
  if (state.screen !== 'playing' && state.screen !== 'celebrating') return;

  const kidsSymbols = SYMBOL_SETS[state.variantId];
  const row = document.createElement('div');
  row.className = 'su-palette-row';

  for (let v = 1; v <= state.size; v++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'su-palette-btn';
    btn.textContent = kidsSymbols ? kidsSymbols[v - 1] : String(v);
    btn.disabled = !state.selected;
    btn.addEventListener('click', () => onValueCallback && onValueCallback(v));
    row.appendChild(btn);
  }

  const clearBtn = document.createElement('button');
  clearBtn.type = 'button';
  clearBtn.className = 'su-palette-btn su-clear-btn';
  clearBtn.textContent = '✕';
  clearBtn.disabled = !state.selected;
  clearBtn.setAttribute('aria-label', 'wissen');
  clearBtn.addEventListener('click', () => onClearCallback && onClearCallback());
  row.appendChild(clearBtn);

  container.appendChild(row);
}
