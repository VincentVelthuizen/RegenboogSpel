import { getPuzzle } from '../dots/game/puzzles.js';
import { STORIES, getStory, getNode } from './game/story.js';
import { createAdventure, pickStory, finishActivity, choose, activityFor } from './game/state.js';
import { startDotsActivity } from './ui/dotsActivity.js';
import { startColorActivity } from './ui/colorActivity.js';
import { startPuzzleActivity } from './ui/puzzleActivity.js';
import { startSlideActivity } from './ui/slideActivity.js';
import { startParcoursActivity } from './ui/parcoursActivity.js';
import { renderStory, renderStoryPicker } from './ui/storyView.js';

const PALETTE = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];
const CONFETTI_COUNT = 40;

const INSTRUCTIONS = {
  dots: 'Verbind de stippen',
  color: 'Kleur de tekening',
  puzzle: 'Maak de puzzel',
  slide: 'Schuif de stukjes op hun plek',
  parcours: 'Volg het pad',
};

const ACTIVITY_START = {
  dots: startDotsActivity,
  color: startColorActivity,
  puzzle: startPuzzleActivity,
  slide: startSlideActivity,
  parcours: startParcoursActivity,
};

// How long the finished picture shows before the celebration appears.
const REVEAL_DELAY = { dots: 900, color: 0, puzzle: 600, slide: 800, parcours: 700 };

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

function start(storyId) {
  state = pickStory(state, storyId);
  colors = null;
  render();
}

function render() {
  clearStage();

  if (state.phase === 'pick') {
    renderStoryPicker(stage, STORIES, start);
    return;
  }

  const story = getStory(state.storyId);
  const node = getNode(story, state.nodeId);

  if (state.phase === 'activity') {
    const picture = getPuzzle(node.picture);
    const type = activityFor(story, state.step, picture);
    stage.className = `activity activity-${type}`;
    const label = document.createElement('div');
    label.className = 'activity-label';
    label.textContent = (type === 'parcours' && node.task) || INSTRUCTIONS[type];
    stage.appendChild(label);
    const options = { hero: story.hero && getPuzzle(story.hero), course: node.course };
    cleanup = ACTIVITY_START[type](stage, picture, (madeColors) => {
      colors = madeColors;
      window.setTimeout(celebrate, REVEAL_DELAY[type]);
    }, options) || null;
    return;
  }

  renderStory(stage, story, node, colors, {
    onChoose: (next) => { state = choose(state, next); colors = null; render(); },
    onRestart: () => start(state.storyId),
    onStories: () => { state = createAdventure(); render(); },
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
