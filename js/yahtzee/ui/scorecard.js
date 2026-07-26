import { categoriesFor, upperBonus, totalScore } from '../game/scoring.js';

let onChooseCallback = null;

export function bindScorecard(handler) {
  onChooseCallback = handler;
}

function playerCell(state, player, playerIndex, category, canScore, getPreview) {
  const td = document.createElement('td');
  const isCurrent = playerIndex === state.currentPlayerIndex;
  if (isCurrent) td.classList.add('yz-current');

  const filled = category.id in player.scores;
  if (filled) {
    td.textContent = player.scores[category.id];
    td.classList.add('yz-filled');
  } else if (isCurrent) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'yz-score-btn';
    btn.textContent = canScore ? getPreview(category.id) : '–';
    btn.disabled = !canScore;
    btn.addEventListener('click', () => onChooseCallback && onChooseCallback(category.id));
    td.appendChild(btn);
  }

  return td;
}

export function renderScorecard(state, { canScore, getPreview }) {
  const container = document.getElementById('yz-scorecard');
  container.innerHTML = '';

  const categories = categoriesFor(state.variant);
  const table = document.createElement('table');
  table.className = 'yz-scorecard-table';

  const thead = document.createElement('thead');
  const headRow = document.createElement('tr');
  headRow.appendChild(document.createElement('th'));
  state.players.forEach((p, i) => {
    const th = document.createElement('th');
    th.textContent = p.name;
    if (i === state.currentPlayerIndex) th.classList.add('yz-current');
    headRow.appendChild(th);
  });
  thead.appendChild(headRow);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  categories.forEach((category) => {
    const row = document.createElement('tr');
    row.className = `yz-row yz-section-${category.section}`;

    const th = document.createElement('th');
    th.textContent = `${category.emoji} ${category.label}`;
    row.appendChild(th);

    state.players.forEach((p, i) => {
      row.appendChild(playerCell(state, p, i, category, canScore, getPreview));
    });

    tbody.appendChild(row);

    if (category.id === 'sixes' && state.variant === 'classic') {
      const bonusRow = document.createElement('tr');
      bonusRow.className = 'yz-row yz-bonus-row';
      const bth = document.createElement('th');
      bth.textContent = '🏆 Bonus (63+)';
      bonusRow.appendChild(bth);
      state.players.forEach((p, i) => {
        const td = document.createElement('td');
        td.textContent = upperBonus('classic', p.scores);
        if (i === state.currentPlayerIndex) td.classList.add('yz-current');
        bonusRow.appendChild(td);
      });
      tbody.appendChild(bonusRow);
    }
  });

  table.appendChild(tbody);

  const tfoot = document.createElement('tfoot');
  const totalRow = document.createElement('tr');
  const totalTh = document.createElement('th');
  totalTh.textContent = '✅ Totaal';
  totalRow.appendChild(totalTh);
  state.players.forEach((p, i) => {
    const td = document.createElement('td');
    td.textContent = totalScore(state.variant, p);
    if (i === state.currentPlayerIndex) td.classList.add('yz-current');
    totalRow.appendChild(td);
  });
  tfoot.appendChild(totalRow);
  table.appendChild(tfoot);

  container.appendChild(table);
}
