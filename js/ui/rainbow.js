import { COLOR_HEX } from '../game/colors.js';

export function flashFilledArcs(filledColors) {
  const svg = document.getElementById('rainbow');
  filledColors.forEach((color, i) => {
    const arc = svg.querySelector(`.arc[data-color="${color}"]`);
    if (!arc) return;
    window.setTimeout(() => {
      arc.classList.add('blink-once');
      arc.addEventListener('animationend', () => arc.classList.remove('blink-once'), { once: true });
    }, i * 250);
  });
}

export function updateRainbow(state) {
  const svg = document.getElementById('rainbow');
  const arcs = svg.querySelectorAll('.arc');

  arcs.forEach((arc) => {
    const color = arc.dataset.color;
    const isFilled = state.filledColors.includes(color);
    const isTarget = state.phase === 'playing' && color === state.currentColor;

    arc.classList.toggle('filled', isFilled);
    arc.classList.toggle('target', isTarget);

    if (isTarget) {
      arc.style.setProperty('--target-color', COLOR_HEX[color]);
    } else {
      arc.style.removeProperty('--target-color');
    }
  });
}
