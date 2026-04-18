import {
  createInitialState,
  recordCorrect,
  recordWrong,
  restart,
} from './game/state.js';
import { updateRainbow, flashFilledArcs } from './ui/rainbow.js';
import {
  renderChoices,
  bindChoices,
  markHintBounce,
  clearHintBounce,
} from './ui/emojiChoices.js';
import { updateHint } from './ui/hintIndicator.js';
import {
  showCelebration,
  hideCelebration,
  bindCelebrationTap,
} from './ui/celebration.js';

let state = createInitialState();

function renderAll() {
  updateRainbow(state);
  renderChoices(state);
  updateHint(state);
  clearHintBounce();
  if (state.phase === 'playing' && state.wrongCountThisChallenge >= 2) {
    markHintBounce(state.correctIndex);
  }
}

function handleTap(index, buttonEl) {
  if (state.phase !== 'playing') return;
  if (state.tapsAreLocked) return;

  if (index === state.correctIndex) {
    handleCorrect(buttonEl);
  } else {
    handleWrong();
  }
}

function handleCorrect(buttonEl) {
  state = { ...state, tapsAreLocked: true };

  buttonEl.classList.add('fly-to-rainbow');

  window.setTimeout(() => {
    state = recordCorrect(state);

    // Fill the new arc but suppress the next target pulse until after the flash
    updateRainbow({ ...state, phase: 'celebrating' });
    flashFilledArcs(state.filledColors);

    const cascadeDuration = (state.filledColors.length - 1) * 250 + 500;
    window.setTimeout(() => {
      state = { ...state, tapsAreLocked: false };
      if (state.phase === 'celebrating') {
        renderChoices(state);
        updateHint(state);
        showCelebration();
      } else {
        renderAll();
      }
    }, cascadeDuration);
  }, 500);
}

function handleWrong() {
  state = recordWrong(state);
  updateHint(state);
  if (state.wrongCountThisChallenge >= 2) {
    markHintBounce(state.correctIndex);
  }
}

function handleRestart() {
  state = restart(state);
  hideCelebration();
  renderAll();
}

bindChoices(handleTap);
bindCelebrationTap(handleRestart);
renderAll();
