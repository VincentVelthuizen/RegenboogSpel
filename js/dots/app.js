import { LEVELS, puzzlesByLevel, getPuzzle } from './game/puzzles.js';
import { STAR_LEVEL, CONSTELLATIONS, getConstellation } from './game/constellations.js';
import { BABY_LEVEL, BABY_PUZZLES, getBabyPuzzle } from './game/babypuzzles.js';
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

// Figures live in three catalogs; ids are unique across all of them.
function figuresForLevel(level) {
  if (level === STAR_LEVEL) return CONSTELLATIONS;
  if (level === BABY_LEVEL) return BABY_PUZZLES;
  return puzzlesByLevel(level);
}

function getFigure(id) {
  return getConstellation(id) || getBabyPuzzle(id) || getPuzzle(id);
}

const isBabyTheme = new URLSearchParams(window.location.search).get('theme') === 'baby';
if (isBabyTheme) {
  const homeBtn = document.querySelector('.home-btn');
  if (homeBtn) homeBtn.href = 'babyshower.html';
}

let state = isBabyTheme ? selectLevel(createInitialState(), BABY_LEVEL) : createInitialState();

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
  if (isBabyTheme) {
    window.location.href = 'babyshower.html';
    return;
  }
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
