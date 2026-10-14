import { PUZZLES, getPuzzle } from '../dots/game/puzzles.js';
import { pictureThumbnail } from '../dots/ui/picture.js';
import { startColorActivity } from '../avontuur/ui/colorActivity.js';
import { startPuzzleActivity } from '../avontuur/ui/puzzleActivity.js';
import { startSlideActivity } from '../avontuur/ui/slideActivity.js';
import { startParcoursActivity } from '../avontuur/ui/parcoursActivity.js';
import { COURSES } from '../avontuur/game/parcours.js';
import { MODES, PARCOURS_HERO, modeFromSearch } from './modes.js';

const START = {
  color: startColorActivity, puzzle: startPuzzleActivity, slide: startSlideActivity, parcours: startParcoursActivity,
};
const INSTRUCTIONS = {
  color: 'Kleur de tekening', puzzle: 'Maak de puzzel', slide: 'Schuif de stukjes op hun plek', parcours: 'Breng Bruno naar het plaatje',
};
// How long the finished picture shows before the celebration appears.
const REVEAL_DELAY = { color: 0, puzzle: 600, slide: 800, parcours: 700 };
const PALETTE = ['#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', '#9b59b6'];
const CONFETTI_COUNT = 40;

const mode = MODES[modeFromSearch(window.location.search)];
const stage = document.getElementById('stage');
const celebration = document.getElementById('celebration');
const homeBtn = document.querySelector('.home-btn');
let pictureId = null; // null: choosing a picture
let cleanup = null;
// The parcours takes turns between the landscapes.
const courseIds = Object.keys(COURSES);
let courseTurn = Math.floor(Math.random() * courseIds.length);

document.title = mode.title;

function clearStage() {
  if (cleanup) cleanup();
  cleanup = null;
  stage.innerHTML = '';
  stage.className = '';
  celebration.classList.add('hidden');
}

function renderPicker() {
  const view = document.createElement('div');
  view.className = 'plaatjes-picker';
  const title = document.createElement('h1');
  title.className = 'plaatjes-title';
  title.textContent = `${mode.icon} ${mode.title}`;
  view.appendChild(title);
  const grid = document.createElement('div');
  grid.className = 'plaatjes-grid';
  // Easiest pictures first, as in the dots game.
  PUZZLES.forEach((picture) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'plaatje-btn';
    btn.setAttribute('aria-label', picture.label);
    btn.appendChild(pictureThumbnail(picture));
    btn.addEventListener('click', () => { pictureId = picture.id; render(); });
    grid.appendChild(btn);
  });
  view.appendChild(grid);
  stage.appendChild(view);
}

function render() {
  clearStage();
  if (pictureId === null) {
    renderPicker();
    return;
  }
  stage.className = `activity activity-${mode.activity}`;
  const label = document.createElement('div');
  label.className = 'activity-label';
  label.textContent = INSTRUCTIONS[mode.activity];
  stage.appendChild(label);
  const options = { hero: getPuzzle(PARCOURS_HERO), course: courseIds[courseTurn++ % courseIds.length] };
  cleanup = START[mode.activity](stage, getPuzzle(pictureId), () => {
    window.setTimeout(celebrate, REVEAL_DELAY[mode.activity]);
  }, options) || null;
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

// After the celebration, back to the pictures to pick the next one.
celebration.addEventListener('click', () => {
  pictureId = null;
  render();
});

// While making a picture, the back button returns to the pictures; on the
// picker it goes home.
homeBtn.addEventListener('click', (e) => {
  if (pictureId === null) return;
  e.preventDefault();
  pictureId = null;
  render();
});

render();
