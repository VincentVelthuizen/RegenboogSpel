const CONFETTI_COUNT = 40;
const CONFETTI_COLORS = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];

let onNewPuzzleCallback = null;
let onThemesCallback = null;

export function bindCelebration({ onNewPuzzle, onThemes }) {
  onNewPuzzleCallback = onNewPuzzle;
  onThemesCallback = onThemes;
}

export function showCelebration() {
  const overlay = document.getElementById('wz-celebration');
  const confetti = document.getElementById('wz-confetti');
  confetti.innerHTML = '';

  for (let i = 0; i < CONFETTI_COUNT; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.backgroundColor = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.animationDuration = `${2 + Math.random() * 2}s`;
    piece.style.animationDelay = `${Math.random() * 1.5}s`;
    piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 40}vw`);
    piece.style.setProperty('--rot', `${Math.random() * 720}deg`);
    confetti.appendChild(piece);
  }

  const content = document.getElementById('wz-celebration-content');
  content.innerHTML = '';

  const title = document.createElement('h2');
  title.className = 'wz-title';
  title.textContent = '🎉 Allemaal gevonden!';
  content.appendChild(title);

  const newBtn = document.createElement('button');
  newBtn.type = 'button';
  newBtn.className = 'wz-start-btn';
  newBtn.textContent = '🔁 Nieuwe puzzel';
  newBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (onNewPuzzleCallback) onNewPuzzleCallback();
  });
  content.appendChild(newBtn);

  const themesBtn = document.createElement('button');
  themesBtn.type = 'button';
  themesBtn.className = 'wz-start-btn wz-secondary-btn';
  themesBtn.textContent = "🎨 Ander thema";
  themesBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (onThemesCallback) onThemesCallback();
  });
  content.appendChild(themesBtn);

  overlay.classList.remove('hidden');
}

export function hideCelebration() {
  document.getElementById('wz-celebration').classList.add('hidden');
  document.getElementById('wz-confetti').innerHTML = '';
}
