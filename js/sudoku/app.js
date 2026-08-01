import {
  createInitialState,
  startPuzzle,
  newPuzzle,
  selectCell,
  setValue,
  clearCell,
  backToMenu,
} from './game/state.js';
import { renderMenu, bindMenu } from './ui/menu.js';
import { renderBoard, bindBoard } from './ui/board.js';
import { renderPalette, bindPalette } from './ui/palette.js';
import { renderToolbar, bindToolbar } from './ui/toolbar.js';
import { showCelebration, hideCelebration, bindCelebration } from './ui/celebration.js';

let state = createInitialState();

const screens = {
  menu: document.getElementById('su-menu'),
  playing: document.getElementById('su-playing'),
};

function render() {
  const showPlaying = state.screen === 'playing' || state.screen === 'celebrating';
  screens.menu.classList.toggle('hidden', state.screen !== 'menu');
  screens.playing.classList.toggle('hidden', !showPlaying);

  if (state.screen === 'menu') {
    renderMenu();
    hideCelebration();
    return;
  }

  renderToolbar(state);
  renderBoard(state);
  renderPalette(state);

  if (state.screen === 'celebrating') {
    showCelebration();
  } else {
    hideCelebration();
  }
}

bindMenu((variantId) => {
  state = startPuzzle(state, variantId);
  render();
});

bindBoard((row, col) => {
  state = selectCell(state, row, col);
  render();
});

bindPalette({
  onValue: (value) => {
    state = setValue(state, value);
    render();
  },
  onClear: () => {
    state = clearCell(state);
    render();
  },
});

bindToolbar({
  onBack: () => {
    state = backToMenu(state);
    render();
  },
  onNew: () => {
    state = newPuzzle(state);
    render();
  },
});

bindCelebration({
  onNewPuzzle: () => {
    state = newPuzzle(state);
    render();
  },
  onMenu: () => {
    state = backToMenu(state);
    render();
  },
});

render();
