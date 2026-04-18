import { COLORS } from './colors.js';
import { generateChallenge } from './challenge.js';

export function createInitialState(rng = Math.random) {
  const challenge = generateChallenge([], rng);
  return {
    phase: 'playing',
    filledColors: [],
    currentColor: challenge.currentColor,
    currentChoices: challenge.currentChoices,
    correctIndex: challenge.correctIndex,
    wrongCountThisChallenge: 0,
    tapsAreLocked: false,
  };
}

export function recordCorrect(state, rng = Math.random) {
  const filledColors = [...state.filledColors, state.currentColor];

  if (filledColors.length === COLORS.length) {
    return {
      ...state,
      phase: 'celebrating',
      filledColors,
      wrongCountThisChallenge: 0,
    };
  }

  const next = generateChallenge(filledColors, rng);
  return {
    ...state,
    phase: 'playing',
    filledColors,
    currentColor: next.currentColor,
    currentChoices: next.currentChoices,
    correctIndex: next.correctIndex,
    wrongCountThisChallenge: 0,
  };
}

export function recordWrong(state) {
  return {
    ...state,
    wrongCountThisChallenge: state.wrongCountThisChallenge + 1,
  };
}

export function restart(_state, rng = Math.random) {
  return createInitialState(rng);
}
