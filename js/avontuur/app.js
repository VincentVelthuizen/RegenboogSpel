import { getPuzzle } from '../dots/game/puzzles.js';
import { getNode } from './game/story.js';
import { createAdventure, beginAdventure, finishActivity, choose, activityFor } from './game/state.js';
import { startDotsActivity } from './ui/dotsActivity.js';
import { startColorActivity } from './ui/colorActivity.js';
import { startPuzzleActivity } from './ui/puzzleActivity.js';
import { renderStory, renderIntro } from './ui/storyView.js';

const PALETTE = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];
const CONFETTI_COUNT = 40;

const INSTRUCTIONS = {
  dots: 'Verbind de stippen',
  color: 'Kleur de tekening',
  puzzle: 'Maak de puzzel',
};

const ACTIVITY_START = {
  dots: startDotsActivity,
  color: startColorActivity,
  puzzle: startPuzzleActivity,
};

// How long the finished picture shows before the celebration appears.
const REVEAL_DELAY = { dots: 900, color: 0, puzzle: 600 };

const stage = document.getElementById('stage');
const celebration = document.getElementById('celebration');
let state = createAdventure();
// Colours of the step's colouring page, so the story shows the child's own picture.
let colors = null;
let cleanup = null;

function clearStage() {
  if (cleanup) cleanup();
  cleanup = null;
  stage.innerHTML = '';
  stage.className = '';
  celebration.classList.add('hidden');
}

function render() {
  clearStage();
  const node = getNode(state.nodeId);

  if (state.phase === 'intro') {
    renderIntro(stage, () => { state = beginAdventure(state); render(); });
    return;
  }

  if (state.phase === 'activity') {
    const picture = getPuzzle(node.picture);
    const type = activityFor(state.step, picture);
    stage.className = `activity activity-${type}`;
    const label = document.createElement('div');
    label.className = 'activity-label';
    label.textContent = INSTRUCTIONS[type];
    stage.appendChild(label);
    cleanup = ACTIVITY_START[type](stage, picture, (madeColors) => {
      colors = madeColors;
      window.setTimeout(celebrate, REVEAL_DELAY[type]);
    }) || null;
    return;
  }

  renderStory(stage, node, colors, {
    onChoose: (next) => { state = choose(state, next); colors = null; render(); },
    onRestart: () => { state = beginAdventure(createAdventure()); colors = null; render(); },
  });
}

function celebrate() {
  const confetti = document.getElementById('confetti');
  confetti.innerHTML = '';
  for (let i = 0; i < CONFETTI_COUNT; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.backgroundColor = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.animationDuration = `${2 + Math.random() * 2}s`;
    piece.style.animationDelay = `${Math.random() * 1.5}s`;
    piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 40}vw`);
    piece.style.setProperty('--rot', `${Math.random() * 720}deg`);
    confetti.appendChild(piece);
  }
  celebration.classList.remove('hidden');
}

celebration.addEventListener('click', () => {
  state = finishActivity(state);
  render();
});

render();
