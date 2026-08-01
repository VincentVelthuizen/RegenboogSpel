import { createInitialState, roll } from './game/state.js';
import { renderDie } from './ui/die.js';

const ROLL_ANIMATION_MS = 450;

let state = createInitialState();

function render() {
  renderDie(state);
}

const dieEl = document.getElementById('jl-die');
const rollBtn = document.getElementById('jl-roll-btn');

rollBtn.addEventListener('click', () => {
  rollBtn.disabled = true;
  dieEl.classList.add('jl-die-rolling');

  window.setTimeout(() => {
    dieEl.classList.remove('jl-die-rolling');
    state = roll(state);
    render();
    rollBtn.disabled = false;
  }, ROLL_ANIMATION_MS);
});

render();
