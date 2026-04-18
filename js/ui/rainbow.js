import { COLOR_HEX } from '../game/colors.js';

export function updateRainbow(state) {
  const svg = document.getElementById('rainbow');
  const arcs = svg.querySelectorAll('.arc');

  arcs.forEach((arc) => {
    const color = arc.dataset.color;
    arc.classList.remove('filled', 'target');
    arc.style.removeProperty('--target-color');

    if (state.filledColors.includes(color)) {
      arc.classList.add('filled');
    } else if (state.phase === 'playing' && color === state.currentColor) {
      arc.classList.add('target');
      arc.style.setProperty('--target-color', COLOR_HEX[color]);
    }
  });
}
