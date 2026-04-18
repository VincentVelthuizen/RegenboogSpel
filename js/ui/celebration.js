import { COLOR_HEX, COLORS } from '../game/colors.js';

const CONFETTI_COUNT = 40;
let onTapCallback = null;

export function bindCelebrationTap(handler) {
  onTapCallback = handler;
  const overlay = document.getElementById('celebration');
  overlay.addEventListener('click', () => {
    if (onTapCallback) onTapCallback();
  });
}

export function showCelebration() {
  const overlay = document.getElementById('celebration');
  const confettiContainer = document.getElementById('confetti');
  confettiContainer.innerHTML = '';

  for (let i = 0; i < CONFETTI_COUNT; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    piece.style.backgroundColor = COLOR_HEX[color];
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
  const overlay = document.getElementById('celebration');
  overlay.classList.add('hidden');
  document.getElementById('confetti').innerHTML = '';
}
