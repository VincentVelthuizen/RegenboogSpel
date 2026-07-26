// Pip positions on a 3x3 grid (tl/tc/tr, ml/mc/mr, bl/bc/br), standard die layouts.
const PIP_POSITIONS = {
  1: ['mc'],
  2: ['tl', 'br'],
  3: ['tl', 'mc', 'br'],
  4: ['tl', 'tr', 'bl', 'br'],
  5: ['tl', 'tr', 'mc', 'bl', 'br'],
  6: ['tl', 'tr', 'ml', 'mr', 'bl', 'br'],
};

function dieFace(value) {
  const face = document.createElement('div');
  face.className = 'yz-die-face';

  if (value === null || value === undefined) {
    face.classList.add('yz-die-empty');
    return face;
  }

  (PIP_POSITIONS[value] || []).forEach((pos) => {
    const pip = document.createElement('span');
    pip.className = `yz-pip yz-pip-${pos}`;
    face.appendChild(pip);
  });

  return face;
}

let onHoldCallback = null;
let onRollCallback = null;
let onManualCallback = null;

export function bindDice({ onHold, onRoll, onManual }) {
  onHoldCallback = onHold;
  onRollCallback = onRoll;
  onManualCallback = onManual;
}

function digitalDie(die, index, rollsLeft) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'yz-die';
  if (die.held) btn.classList.add('yz-die-held');

  const canHold = die.value !== null && rollsLeft < 3 && rollsLeft > 0;
  btn.disabled = !canHold;
  btn.setAttribute('aria-label', die.value ? `dobbelsteen, ${die.value}${die.held ? ', vastgehouden' : ''}` : 'dobbelsteen');
  btn.appendChild(dieFace(die.value));
  btn.addEventListener('click', () => onHoldCallback && onHoldCallback(index));
  return btn;
}

function manualDie(die, index) {
  const wrap = document.createElement('div');
  wrap.className = 'yz-die-manual';
  wrap.appendChild(dieFace(die.value ?? null));

  const picker = document.createElement('div');
  picker.className = 'yz-manual-picker';
  for (let v = 1; v <= 6; v++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'yz-manual-value-btn';
    if (die.value === v) btn.classList.add('yz-selected');
    btn.textContent = String(v);
    btn.setAttribute('aria-label', `dobbelsteen ${index + 1} op ${v}`);
    btn.addEventListener('click', () => onManualCallback && onManualCallback(index, v));
    picker.appendChild(btn);
  }
  wrap.appendChild(picker);
  return wrap;
}

export function renderDice(state) {
  const container = document.getElementById('yz-dice');
  container.innerHTML = '';

  const row = document.createElement('div');
  row.className = 'yz-dice-row';

  state.dice.forEach((die, i) => {
    row.appendChild(state.mode === 'physical' ? manualDie(die, i) : digitalDie(die, i, state.rollsLeft));
  });
  container.appendChild(row);

  if (state.mode === 'digital') {
    const rollBtn = document.createElement('button');
    rollBtn.type = 'button';
    rollBtn.className = 'yz-roll-btn';
    rollBtn.disabled = state.rollsLeft <= 0;
    rollBtn.textContent = state.rollsLeft > 0 ? `🎲 Gooien (${state.rollsLeft})` : 'Geen worpen meer';
    rollBtn.addEventListener('click', () => onRollCallback && onRollCallback());
    container.appendChild(rollBtn);
  } else {
    const hint = document.createElement('p');
    hint.className = 'yz-hint';
    hint.textContent = 'Gooi je eigen dobbelstenen en kies hierboven wat je gegooid hebt.';
    container.appendChild(hint);
  }
}
