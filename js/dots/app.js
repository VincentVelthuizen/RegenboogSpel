import { LEVELS, puzzlesByLevel, getPuzzle } from './game/puzzles.js';
import { STAR_LEVEL, CONSTELLATIONS, getConstellation } from './game/constellations.js';
import {
  createInitialState,
  selectLevel,
  selectPuzzle,
  recordDotTap,
  backToPicker,
  backToLevels,
} from './game/state.js';
import { renderLevelSelect, renderPuzzlePicker } from './ui/picker.js';
import { bindBoard, renderBoard, revealPicture, revealConstellation } from './ui/board.js';
import { bindCelebration, showCelebration, hideCelebration } from './ui/reveal.js';

// The numbered difficulty levels plus the constellation ("✨") level.
const MENU_LEVELS = [...LEVELS, STAR_LEVEL];

// Figures live in two catalogs; ids are unique across both.
function figuresForLevel(level) {
  return level === STAR_LEVEL ? CONSTELLATIONS : puzzlesByLevel(level);
}

function getFigure(id) {
  return getConstellation(id) || getPuzzle(id);
}

let state = createInitialState();

// True whenever the current screen is showing constellations, so the night-sky
// theme can be toggled on the whole game.
function isStarryScreen() {
  if (state.screen === 'levels') return false;
  if (state.screen === 'picking') return state.level === STAR_LEVEL;
  const figure = getFigure(state.puzzleId);
  return Boolean(figure && figure.star);
}

function render() {
  const picker = document.getElementById('picker');
  const board = document.getElementById('board');
  document.getElementById('dots-game').classList.toggle('starry', isStarryScreen());

  if (state.screen === 'levels') {
    picker.classList.remove('hidden');
    board.classList.add('hidden');
    hideCelebration();
    renderLevelSelect(MENU_LEVELS, onSelectLevel);
  } else if (state.screen === 'picking') {
    picker.classList.remove('hidden');
    board.classList.add('hidden');
    hideCelebration();
    renderPuzzlePicker(figuresForLevel(state.level), onSelectPuzzle, onBackToLevels);
  } else {
    picker.classList.add('hidden');
    board.classList.remove('hidden');
    renderBoard(getFigure(state.puzzleId), state);
  }
}

function onSelectLevel(level) {
  state = selectLevel(state, level);
  render();
}

function onSelectPuzzle(id) {
  state = selectPuzzle(state, id);
  render();
}

function onBackToLevels() {
  state = backToLevels(state);
  render();
}

function onDotTap(i) {
  if (state.screen !== 'playing') return;

  const figure = getFigure(state.puzzleId);
  const before = state.nextDotIndex;
  state = recordDotTap(state, i, figure.dots.length);

  if (state.nextDotIndex !== before) {
    // `before` is the index of the dot that was just connected.
    renderBoard(figure, state, before);
    if (state.screen === 'celebrating') {
      if (figure.star) revealConstellation(figure);
      else revealPicture(figure);
      window.setTimeout(showCelebration, 600);
    }
  }
}

function onCelebrationTap() {
  state = backToPicker(state);
  render();
}

bindBoard(onDotTap);
bindCelebration(onCelebrationTap);
render();
