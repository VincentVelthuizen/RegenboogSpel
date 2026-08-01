import {
  createInitialState,
  chooseMode,
  selectTheme,
  selectCell,
  newPuzzle,
  backToThemes,
  backToModeSelect,
} from './game/state.js';
import { renderModeSelect, renderThemeSelect, bindModeSelect, bindThemeSelect, bindThemeBack } from './ui/menu.js';
import { renderBoard, renderWordList, bindBoard } from './ui/board.js';
import { renderToolbar, bindToolbar } from './ui/toolbar.js';
import { showCelebration, hideCelebration, bindCelebration } from './ui/celebration.js';

let state = createInitialState();

const screens = {
  mode: document.getElementById('wz-mode'),
  theme: document.getElementById('wz-theme'),
  playing: document.getElementById('wz-playing'),
};

function render() {
  const showPlaying = state.screen === 'playing' || state.screen === 'celebrating';
  screens.mode.classList.toggle('hidden', state.screen !== 'mode');
  screens.theme.classList.toggle('hidden', state.screen !== 'theme');
  screens.playing.classList.toggle('hidden', !showPlaying);

  if (state.screen === 'mode') {
    renderModeSelect();
    hideCelebration();
    return;
  }

  if (state.screen === 'theme') {
    renderThemeSelect();
    hideCelebration();
    return;
  }

  renderToolbar();
  renderWordList(state);
  renderBoard(state);

  if (state.screen === 'celebrating') {
    showCelebration();
  } else {
    hideCelebration();
  }
}

bindModeSelect((mode) => {
  state = chooseMode(state, mode);
  render();
});

bindThemeSelect((themeId) => {
  state = selectTheme(state, themeId);
  render();
});

bindThemeBack(() => {
  state = backToModeSelect(state);
  render();
});

bindBoard((row, col) => {
  state = selectCell(state, row, col);
  render();
});

bindToolbar({
  onBack: () => {
    state = backToThemes(state);
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
  onThemes: () => {
    state = backToThemes(state);
    render();
  },
});

render();
