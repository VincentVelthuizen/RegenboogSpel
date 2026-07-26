import { totalScore } from '../game/scoring.js';

let onRestartCallback = null;

export function bindGameOver(handler) {
  onRestartCallback = handler;
}

export function renderGameOver(state) {
  const container = document.getElementById('yz-gameover');
  container.innerHTML = '';

  const ranked = state.players
    .map((p) => ({ name: p.name, total: totalScore(state.variant, p) }))
    .sort((a, b) => b.total - a.total);

  const title = document.createElement('h2');
  title.className = 'yz-title';
  title.textContent = ranked.length > 1 ? `🎉 ${ranked[0].name} wint!` : '🎉 Goed gespeeld!';
  container.appendChild(title);

  const list = document.createElement('ol');
  list.className = 'yz-ranking';
  ranked.forEach((r) => {
    const li = document.createElement('li');
    li.textContent = `${r.name}: ${r.total} punten`;
    list.appendChild(li);
  });
  container.appendChild(list);

  const restartBtn = document.createElement('button');
  restartBtn.type = 'button';
  restartBtn.className = 'yz-start-btn';
  restartBtn.textContent = '🔁 Opnieuw';
  restartBtn.addEventListener('click', () => onRestartCallback && onRestartCallback());
  container.appendChild(restartBtn);
}
