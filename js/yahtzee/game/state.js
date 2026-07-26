import {
  createDice,
  rollDice as rollDiceValues,
  toggleHeld,
  setManualValue,
  diceValues,
  allDiceSet,
} from './dice.js';
import { categoriesFor, scoreCategory, yahtzeeBonusEarned } from './scoring.js';

const DICE_COUNT = 5;
const MAX_ROLLS = 3;

export function createInitialState() {
  return {
    screen: 'menu',
    variant: null,
    mode: null,
    players: [],
    currentPlayerIndex: 0,
    dice: createDice(DICE_COUNT),
    rollsLeft: MAX_ROLLS,
  };
}

export function chooseVariant(state, variant, mode) {
  return {
    ...createInitialState(),
    screen: 'players',
    variant,
    mode: variant === 'kids' ? 'digital' : mode,
  };
}

export function backToMenu(_state) {
  return createInitialState();
}

export function startGame(state, playerNames) {
  const players = playerNames.map((name) => ({
    name,
    scores: {},
    yahtzeeBonus: 0,
  }));

  return {
    ...state,
    screen: 'playing',
    players,
    currentPlayerIndex: 0,
    dice: createDice(DICE_COUNT),
    rollsLeft: MAX_ROLLS,
  };
}

export function currentPlayer(state) {
  return state.players[state.currentPlayerIndex];
}

export function rollDice(state, rng = Math.random) {
  if (state.mode !== 'digital') return state;
  if (state.rollsLeft <= 0) return state;

  return {
    ...state,
    dice: rollDiceValues(state.dice, rng),
    rollsLeft: state.rollsLeft - 1,
  };
}

export function toggleHold(state, index) {
  if (state.mode !== 'digital') return state;
  if (state.rollsLeft === MAX_ROLLS) return state; // nothing rolled yet this turn
  if (state.rollsLeft <= 0) return state; // no rolls left, holding has no effect

  return { ...state, dice: toggleHeld(state.dice, index) };
}

export function setManualDie(state, index, value) {
  if (state.mode !== 'physical') return state;
  return { ...state, dice: setManualValue(state.dice, index, value) };
}

// Whether the current dice can be committed to a category yet.
export function canScore(state) {
  if (state.mode === 'physical') return allDiceSet(state.dice);
  return state.rollsLeft < MAX_ROLLS;
}

export function openCategories(state) {
  const player = currentPlayer(state);
  return categoriesFor(state.variant).filter((c) => !(c.id in player.scores));
}

export function previewScore(state, categoryId) {
  const player = currentPlayer(state);
  return scoreCategory(state.variant, categoryId, diceValues(state.dice), player.scores);
}

export function chooseCategory(state, categoryId) {
  if (!canScore(state)) return state;

  const player = currentPlayer(state);
  if (categoryId in player.scores) return state;

  const values = diceValues(state.dice);
  const score = scoreCategory(state.variant, categoryId, values, player.scores);
  const bonus = yahtzeeBonusEarned(state.variant, values, player.scores);

  const updatedPlayer = {
    ...player,
    scores: { ...player.scores, [categoryId]: score },
    yahtzeeBonus: player.yahtzeeBonus + bonus,
  };

  const players = state.players.map((p, i) =>
    i === state.currentPlayerIndex ? updatedPlayer : p,
  );

  const categories = categoriesFor(state.variant);
  const allDone = players.every((p) => categories.every((c) => c.id in p.scores));

  if (allDone) {
    return { ...state, players, screen: 'gameover' };
  }

  return {
    ...state,
    players,
    currentPlayerIndex: (state.currentPlayerIndex + 1) % players.length,
    dice: createDice(DICE_COUNT),
    rollsLeft: MAX_ROLLS,
  };
}

export function restart(_state) {
  return createInitialState();
}
