import { LEVELS, puzzlesByLevel, getPuzzle } from './game/puzzles.js';
import {
  createInitialState,
  selectLevel,
  selectPuzzle,
  recordDotTap,
  backToPicker,
  backToLevels,
} from './game/state.js';
import { renderLevelSelect, renderPuzzlePicker } from './ui/picker.js';
import { bindBoard, renderBoard, revealPicture } from './ui/board.js';
import { bindCelebration, showCelebration, hideCelebration } from './ui/reveal.js';

let state = createInitialState();

function render() {
  const picker = document.getElementById('picker');
  const board = document.getElementById('board');

  if (state.screen === 'levels') {
    picker.classList.remove('hidden');
    board.classList.add('hidden');
    hideCelebration();
    renderLevelSelect(LEVELS, onSelectLevel);
  } else if (state.screen === 'picking') {
    picker.classList.remove('hidden');
    board.classList.add('hidden');
    hideCelebration();
    renderPuzzlePicker(puzzlesByLevel(state.level), onSelectPuzzle, onBackToLevels);
  } else {
    picker.classList.add('hidden');
    board.classList.remove('hidden');
    renderBoard(getPuzzle(state.puzzleId), state);
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

  const puzzle = getPuzzle(state.puzzleId);
  const before = state.nextDotIndex;
  state = recordDotTap(state, i, puzzle.dots.length);

  if (state.nextDotIndex !== before) {
    // `before` is the index of the dot that was just connected.
    renderBoard(puzzle, state, before);
    if (state.screen === 'celebrating') {
      revealPicture(puzzle);
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
