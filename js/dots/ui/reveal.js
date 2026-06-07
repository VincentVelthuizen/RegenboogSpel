const PALETTE = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];
const CONFETTI_COUNT = 40;

let onTapCallback = null;

export function bindCelebration(handler) {
  onTapCallback = handler;
  const overlay = document.getElementById('dots-celebration');
  overlay.addEventListener('click', () => {
    if (onTapCallback) onTapCallback();
  });
}

export function showCelebration() {
  const overlay = document.getElementById('dots-celebration');
  const confettiContainer = document.getElementById('dots-confetti');
  confettiContainer.innerHTML = '';

  for (let i = 0; i < CONFETTI_COUNT; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.backgroundColor = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.animationDuration = `${2 + Math.random() * 2}s`;
    piece.style.animationDelay = `${Math.random() * 1.5}s`;
    piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 40}vw`);
    piece.style.setProperty('--rot', `${Math.random() * 720}deg`);
    confettiContainer.appendChild(piece);
  }

  overlay.classList.remove('hidden');
}

export function hideCelebration() {
  const overlay = document.getElementById('dots-celebration');
  overlay.classList.add('hidden');
  document.getElementById('dots-confetti').innerHTML = '';
}
