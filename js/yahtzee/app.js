import {
  createInitialState,
  chooseVariant,
  startGame,
  rollDice,
  toggleHold,
  setManualDie,
  canScore,
  previewScore,
  chooseCategory,
  restart,
} from './game/state.js';
import { renderMenu, bindMenu } from './ui/menu.js';
import { renderPlayers, bindPlayers } from './ui/players.js';
import { renderDice, bindDice } from './ui/dice.js';
import { renderScorecard, bindScorecard } from './ui/scorecard.js';
import { renderGameOver, bindGameOver } from './ui/gameover.js';

let state = createInitialState();

const screens = {
  menu: document.getElementById('yz-menu'),
  players: document.getElementById('yz-players'),
  playing: document.getElementById('yz-playing'),
  gameover: document.getElementById('yz-gameover'),
};

function render() {
  Object.entries(screens).forEach(([name, el]) => {
    el.classList.toggle('hidden', name !== state.screen);
  });

  if (state.screen === 'menu') {
    renderMenu();
  } else if (state.screen === 'players') {
    renderPlayers();
  } else if (state.screen === 'playing') {
    renderDice(state);
    renderScorecard(state, {
      canScore: canScore(state),
      getPreview: (categoryId) => previewScore(state, categoryId),
    });
  } else if (state.screen === 'gameover') {
    renderGameOver(state);
  }
}

bindMenu((variant, mode) => {
  state = chooseVariant(state, variant, mode);
  render();
});

bindPlayers((names) => {
  state = startGame(state, names);
  render();
});

bindDice({
  onRoll: () => {
    state = rollDice(state);
    render();
  },
  onHold: (index) => {
    state = toggleHold(state, index);
    render();
  },
  onManual: (index, value) => {
    state = setManualDie(state, index, value);
    render();
  },
});

bindScorecard((categoryId) => {
  state = chooseCategory(state, categoryId);
  render();
});

bindGameOver(() => {
  state = restart(state);
  render();
});

render();
