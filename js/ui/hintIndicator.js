import { COLOR_HEX } from '../game/colors.js';

export function updateHint(state) {
  const el = document.getElementById('hint-indicator');
  if (state.phase === 'playing' && state.wrongCountThisChallenge >= 2) {
    el.style.backgroundColor = COLOR_HEX[state.currentColor];
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
    el.style.removeProperty('background-color');
  }
}
