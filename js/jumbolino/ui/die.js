import { FACES } from '../game/prompts.js';

export function renderDie(state) {
  const dieEl = document.getElementById('jl-die');
  const resultEl = document.getElementById('jl-result');
  const rollBtn = document.getElementById('jl-roll-btn');

  if (state.screen === 'ready') {
    dieEl.textContent = '🎲';
    resultEl.innerHTML = '';
    rollBtn.textContent = '🎲 Gooi de dobbelsteen!';
    return;
  }

  const face = FACES.find((f) => f.id === state.faceId);
  dieEl.textContent = face.emoji;

  resultEl.innerHTML = '';

  const label = document.createElement('div');
  label.className = 'jl-face-label';
  label.textContent = face.label;
  resultEl.appendChild(label);

  const prompt = document.createElement('div');
  prompt.className = 'jl-prompt-card';
  prompt.textContent = state.prompt;
  resultEl.appendChild(prompt);

  rollBtn.textContent = '🎲 Gooi opnieuw';
}
