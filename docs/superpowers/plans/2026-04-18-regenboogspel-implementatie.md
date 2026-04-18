# Regenboogspel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Een browser-spel bouwen waarin peuters (2–3 jaar) een klassieke regenboogboog invullen door uit 3 emoji's telkens degene te kiezen die bij de doelkleur hoort; de regenboog vult van binnen (paars) naar buiten (rood).

**Architecture:** Vanilla JavaScript, gesplitst in pure game-logic modules (`game/*`) en DOM-renderers (`ui/*`), geplakt door `app.js`. Eén-richtings dataflow: UI dispatcht taps, state-reducers berekenen nieuwe state, UI herrendert. Regenboog als inline SVG, animaties via CSS. Unit tests met vitest op de pure logica.

**Tech Stack:** Vanilla JS (ES modules), inline SVG, CSS @keyframes, webpack (bestaand), vitest (nieuw).

**Volle spec:** `docs/superpowers/specs/2026-04-18-regenboogspel-design.md`

---

## Bestandsstructuur

```
js/
├── app.js                    # Entry: bootstraps het spel
├── game/
│   ├── random.js             # pickOne, shuffle — deterministisch stubbable
│   ├── colors.js             # COLORS, COLOR_HEX, EMOJI_POOL constanten
│   ├── challenge.js          # generateChallenge(filledColors, rng?)
│   └── state.js              # createInitialState, recordCorrect, recordWrong, startCelebration, restart
└── ui/
    ├── rainbow.js            # renderRainbow, updateRainbow
    ├── emojiChoices.js       # renderChoices, lockTaps, unlockTaps
    ├── hintIndicator.js      # showHint, hideHint
    └── celebration.js        # showCelebration, hideCelebration, spawnConfetti

tests/game/
├── random.test.js
├── challenge.test.js
└── state.test.js

css/
└── style.css                 # volledige styling (vervangt boilerplate)

index.html                    # minimale scaffold
package.json                  # vitest toevoegen
vitest.config.js              # testconfig
```

Elke module heeft één duidelijke verantwoordelijkheid. `game/*` is puur en
DOM-loos. `ui/*` doet enkel DOM-manipulatie. `app.js` plakt ze aan elkaar.

---

## Task 0: Git + test-infrastructuur

**Files:**
- Modify: `package.json`
- Create: `vitest.config.js`
- Create: `.gitignore` (controleren of correct)

- [ ] **Step 1: Initialiseer git-repo (indien nog niet gedaan)**

Run in project root `/mnt/c/Users/vevr/IdeaProjects/RegenboogSpel/`:

```bash
git init
git config --local --add safe.directory "$(pwd)"
```

Expected: `Initialized empty Git repository in .../RegenboogSpel/.git/`.

- [ ] **Step 2: Controleer `.gitignore`**

Bevat al `node_modules` en `dist`. Open en verifieer:

```
node_modules
dist
```

Zo niet, voeg toe.

- [ ] **Step 3: Installeer vitest**

```bash
npm install --save-dev vitest
```

Expected: `package.json` krijgt `vitest` onder `devDependencies`.

- [ ] **Step 4: Wijzig test-script in `package.json`**

Vervang in `package.json`:

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "start": "webpack serve --open --config webpack.config.dev.js",
  "build": "webpack --config webpack.config.prod.js"
}
```

Door:

```json
"scripts": {
  "test": "vitest run",
  "test:watch": "vitest",
  "start": "webpack serve --open --config webpack.config.dev.js",
  "build": "webpack --config webpack.config.prod.js"
}
```

- [ ] **Step 5: Maak `vitest.config.js` in project root**

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
  },
});
```

- [ ] **Step 6: Verifieer dat vitest start**

```bash
npm test
```

Expected output: "No test files found, exiting with code 1" — prima, infra werkt. We hebben nog geen tests.

- [ ] **Step 7: Eerste commit**

```bash
git add .gitignore .gitattributes .editorconfig .idea 404.html LICENSE.txt css favicon.ico icon.png icon.svg img index.html js package.json robots.txt site.webmanifest webpack.common.js webpack.config.dev.js webpack.config.prod.js vitest.config.js docs
git commit -m "chore: initialiseer project, voeg vitest toe"
```

Expected: commit succesvol. (`package-lock.json` en `node_modules` laten we liggen — `node_modules` is genegeerd; `package-lock.json` voegen we pas toe als het er is.)

- [ ] **Step 8: Commit package-lock.json als die bestaat**

```bash
ls package-lock.json 2>/dev/null && git add package-lock.json && git commit -m "chore: lock dependencies"
```

Indien geen lock: sla over.

---

## Task 1: `game/random.js` — pure random utils

**Files:**
- Create: `js/game/random.js`
- Test: `tests/game/random.test.js`

- [ ] **Step 1: Write the failing test**

Maak `tests/game/random.test.js`:

```js
import { describe, it, expect, vi } from 'vitest';
import { pickOne, shuffle } from '../../js/game/random.js';

describe('pickOne', () => {
  it('returns an element from the array', () => {
    const arr = ['a', 'b', 'c'];
    const result = pickOne(arr);
    expect(arr).toContain(result);
  });

  it('uses the injected rng to pick deterministically', () => {
    const arr = ['a', 'b', 'c'];
    const rng = () => 0;
    expect(pickOne(arr, rng)).toBe('a');
    const rng2 = () => 0.99;
    expect(pickOne(arr, rng2)).toBe('c');
  });
});

describe('shuffle', () => {
  it('returns a new array with the same elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle(arr);
    expect(result).not.toBe(arr);
    expect(result.slice().sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('is deterministic with a fixed rng', () => {
    const rng = () => 0; // always picks first remaining
    const result = shuffle([1, 2, 3], rng);
    expect(result).toEqual([1, 2, 3]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/game/random.test.js
```

Expected: FAIL — "Failed to load ../../js/game/random.js" (module bestaat nog niet).

- [ ] **Step 3: Write minimal implementation**

Maak `js/game/random.js`:

```js
export function pickOne(array, rng = Math.random) {
  const index = Math.floor(rng() * array.length);
  return array[index];
}

export function shuffle(array, rng = Math.random) {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- tests/game/random.test.js
```

Expected: PASS — 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add js/game/random.js tests/game/random.test.js
git commit -m "feat(game): voeg pickOne en shuffle toe met injectable rng"
```

---

## Task 2: `game/colors.js` — constanten

**Files:**
- Create: `js/game/colors.js`

Geen test — pure data-constanten.

- [ ] **Step 1: Maak `js/game/colors.js`**

```js
export const COLORS = ['purple', 'blue', 'green', 'yellow', 'orange', 'red'];

export const COLOR_HEX = {
  purple: '#9b59b6',
  blue:   '#3498db',
  green:  '#2ecc71',
  yellow: '#f1c40f',
  orange: '#e67e22',
  red:    '#e74c3c',
};

export const EMOJI_POOL = {
  purple: ['🍆', '🍇', '🟣', '🟪', '👾', '🔮'],
  blue:   ['🫐', '🐳', '🟦', '🔵', '💙', '🌀'],
  green:  ['🐸', '🥒', '🟢', '🟩', '🥬', '🌲'],
  yellow: ['🍌', '🌻', '🟡', '🟨', '⭐', '🧀'],
  orange: ['🍊', '🥕', '🟠', '🟧', '🦊', '🎃'],
  red:    ['🍎', '🍓', '🔴', '🟥', '❤️', '🚒'],
};
```

- [ ] **Step 2: Commit**

```bash
git add js/game/colors.js
git commit -m "feat(game): voeg kleur- en emoji-constanten toe"
```

---

## Task 3: `game/challenge.js` — challenge-generator

**Files:**
- Create: `js/game/challenge.js`
- Test: `tests/game/challenge.test.js`

- [ ] **Step 1: Write the failing test**

Maak `tests/game/challenge.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { generateChallenge } from '../../js/game/challenge.js';
import { COLORS, EMOJI_POOL } from '../../js/game/colors.js';

function deterministicRng(sequence) {
  let i = 0;
  return () => sequence[i++ % sequence.length];
}

describe('generateChallenge', () => {
  it('targets the next unfilled color', () => {
    const result = generateChallenge([], Math.random);
    expect(result.currentColor).toBe('purple');

    const result2 = generateChallenge(['purple', 'blue'], Math.random);
    expect(result2.currentColor).toBe('green');
  });

  it('returns exactly 3 choices', () => {
    const result = generateChallenge([], Math.random);
    expect(result.currentChoices).toHaveLength(3);
  });

  it('includes one emoji from the target color pool', () => {
    const result = generateChallenge([], Math.random);
    const purplePool = EMOJI_POOL.purple;
    const purpleEmojisInChoices = result.currentChoices.filter((e) =>
      purplePool.includes(e),
    );
    expect(purpleEmojisInChoices).toHaveLength(1);
  });

  it('correctIndex points to the target-color emoji', () => {
    const result = generateChallenge([], Math.random);
    const correctEmoji = result.currentChoices[result.correctIndex];
    expect(EMOJI_POOL[result.currentColor]).toContain(correctEmoji);
  });

  it('two distractors come from two distinct non-target colors', () => {
    const result = generateChallenge([], Math.random);
    const distractors = result.currentChoices.filter(
      (_, i) => i !== result.correctIndex,
    );
    expect(distractors).toHaveLength(2);

    const colorsFound = distractors.map((emoji) => {
      for (const color of COLORS) {
        if (EMOJI_POOL[color].includes(emoji)) return color;
      }
      return null;
    });

    expect(colorsFound).not.toContain(result.currentColor);
    expect(colorsFound[0]).not.toBe(colorsFound[1]);
  });

  it('is deterministic with a fixed rng', () => {
    const rng = deterministicRng([0, 0, 0, 0, 0, 0, 0, 0]);
    const a = generateChallenge([], rng);
    const rng2 = deterministicRng([0, 0, 0, 0, 0, 0, 0, 0]);
    const b = generateChallenge([], rng2);
    expect(a).toEqual(b);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/game/challenge.test.js
```

Expected: FAIL — module niet gevonden.

- [ ] **Step 3: Write minimal implementation**

Maak `js/game/challenge.js`:

```js
import { COLORS, EMOJI_POOL } from './colors.js';
import { pickOne, shuffle } from './random.js';

export function generateChallenge(filledColors, rng = Math.random) {
  const currentColor = COLORS[filledColors.length];

  const correctEmoji = pickOne(EMOJI_POOL[currentColor], rng);

  const otherColors = COLORS.filter((c) => c !== currentColor);
  const [distractorColorA, distractorColorB] = shuffle(otherColors, rng).slice(0, 2);

  const distractorA = pickOne(EMOJI_POOL[distractorColorA], rng);
  const distractorB = pickOne(EMOJI_POOL[distractorColorB], rng);

  const shuffled = shuffle([correctEmoji, distractorA, distractorB], rng);
  const correctIndex = shuffled.indexOf(correctEmoji);

  return {
    currentColor,
    currentChoices: shuffled,
    correctIndex,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- tests/game/challenge.test.js
```

Expected: PASS — 6 tests passing.

- [ ] **Step 5: Commit**

```bash
git add js/game/challenge.js tests/game/challenge.test.js
git commit -m "feat(game): voeg generateChallenge toe"
```

---

## Task 4: `game/state.js` — pure state-reducers

**Files:**
- Create: `js/game/state.js`
- Test: `tests/game/state.test.js`

- [ ] **Step 1: Write the failing test**

Maak `tests/game/state.test.js`:

```js
import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  recordCorrect,
  recordWrong,
  restart,
} from '../../js/game/state.js';

const RNG_ZERO = () => 0;

describe('createInitialState', () => {
  it('starts in playing phase with no colors filled', () => {
    const s = createInitialState(RNG_ZERO);
    expect(s.phase).toBe('playing');
    expect(s.filledColors).toEqual([]);
    expect(s.wrongCountThisChallenge).toBe(0);
    expect(s.tapsAreLocked).toBe(false);
    expect(s.currentColor).toBe('purple');
    expect(s.currentChoices).toHaveLength(3);
    expect(typeof s.correctIndex).toBe('number');
  });
});

describe('recordCorrect', () => {
  it('appends currentColor to filledColors and generates a new challenge', () => {
    const s0 = createInitialState(RNG_ZERO);
    const s1 = recordCorrect(s0, RNG_ZERO);
    expect(s1.filledColors).toEqual(['purple']);
    expect(s1.currentColor).toBe('blue');
    expect(s1.wrongCountThisChallenge).toBe(0);
    expect(s1.phase).toBe('playing');
  });

  it('transitions to celebrating after the 6th color', () => {
    let s = createInitialState(RNG_ZERO);
    for (let i = 0; i < 6; i++) {
      s = recordCorrect(s, RNG_ZERO);
    }
    expect(s.phase).toBe('celebrating');
    expect(s.filledColors).toEqual([
      'purple', 'blue', 'green', 'yellow', 'orange', 'red',
    ]);
  });

  it('resets wrongCountThisChallenge to 0', () => {
    let s = createInitialState(RNG_ZERO);
    s = recordWrong(s);
    s = recordWrong(s);
    expect(s.wrongCountThisChallenge).toBe(2);
    s = recordCorrect(s, RNG_ZERO);
    expect(s.wrongCountThisChallenge).toBe(0);
  });
});

describe('recordWrong', () => {
  it('increments wrongCountThisChallenge', () => {
    const s0 = createInitialState(RNG_ZERO);
    const s1 = recordWrong(s0);
    expect(s1.wrongCountThisChallenge).toBe(1);
    const s2 = recordWrong(s1);
    expect(s2.wrongCountThisChallenge).toBe(2);
  });

  it('does not change filledColors or currentColor', () => {
    const s0 = createInitialState(RNG_ZERO);
    const s1 = recordWrong(s0);
    expect(s1.filledColors).toEqual(s0.filledColors);
    expect(s1.currentColor).toBe(s0.currentColor);
    expect(s1.currentChoices).toEqual(s0.currentChoices);
  });
});

describe('restart', () => {
  it('returns to playing with no colors filled', () => {
    let s = createInitialState(RNG_ZERO);
    for (let i = 0; i < 6; i++) s = recordCorrect(s, RNG_ZERO);
    expect(s.phase).toBe('celebrating');

    const fresh = restart(s, RNG_ZERO);
    expect(fresh.phase).toBe('playing');
    expect(fresh.filledColors).toEqual([]);
    expect(fresh.currentColor).toBe('purple');
    expect(fresh.wrongCountThisChallenge).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm test -- tests/game/state.test.js
```

Expected: FAIL — module niet gevonden.

- [ ] **Step 3: Write minimal implementation**

Maak `js/game/state.js`:

```js
import { COLORS } from './colors.js';
import { generateChallenge } from './challenge.js';

export function createInitialState(rng = Math.random) {
  const challenge = generateChallenge([], rng);
  return {
    phase: 'playing',
    filledColors: [],
    currentColor: challenge.currentColor,
    currentChoices: challenge.currentChoices,
    correctIndex: challenge.correctIndex,
    wrongCountThisChallenge: 0,
    tapsAreLocked: false,
  };
}

export function recordCorrect(state, rng = Math.random) {
  const filledColors = [...state.filledColors, state.currentColor];

  if (filledColors.length === COLORS.length) {
    return {
      ...state,
      phase: 'celebrating',
      filledColors,
      wrongCountThisChallenge: 0,
    };
  }

  const next = generateChallenge(filledColors, rng);
  return {
    ...state,
    phase: 'playing',
    filledColors,
    currentColor: next.currentColor,
    currentChoices: next.currentChoices,
    correctIndex: next.correctIndex,
    wrongCountThisChallenge: 0,
  };
}

export function recordWrong(state) {
  return {
    ...state,
    wrongCountThisChallenge: state.wrongCountThisChallenge + 1,
  };
}

export function restart(_state, rng = Math.random) {
  return createInitialState(rng);
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npm test -- tests/game/state.test.js
```

Expected: PASS — 6 tests passing.

- [ ] **Step 5: Run full test suite**

```bash
npm test
```

Expected: PASS — alle tests (random + challenge + state), totaal 16 tests.

- [ ] **Step 6: Commit**

```bash
git add js/game/state.js tests/game/state.test.js
git commit -m "feat(game): voeg state-reducers toe (correct, wrong, restart)"
```

---

## Task 5: `index.html` + basis CSS-reset

**Files:**
- Modify: `index.html`
- Modify: `css/style.css` (voorlopig leegmaken behalve reset)

- [ ] **Step 1: Herschrijf `index.html`**

```html
<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
  <title>Regenboog</title>
  <link rel="stylesheet" href="css/style.css">
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="icon.png">
  <link rel="manifest" href="site.webmanifest">
  <meta name="theme-color" content="#fafafa">
</head>
<body>
  <main id="game">
    <svg
      id="rainbow"
      viewBox="0 0 240 140"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path class="arc" data-color="red"    d="M 7.5 140 A 112.5 112.5 0 0 1 232.5 140" />
      <path class="arc" data-color="orange" d="M 22.5 140 A 97.5 97.5 0 0 1 217.5 140" />
      <path class="arc" data-color="yellow" d="M 37.5 140 A 82.5 82.5 0 0 1 202.5 140" />
      <path class="arc" data-color="green"  d="M 52.5 140 A 67.5 67.5 0 0 1 187.5 140" />
      <path class="arc" data-color="blue"   d="M 67.5 140 A 52.5 52.5 0 0 1 172.5 140" />
      <path class="arc" data-color="purple" d="M 82.5 140 A 37.5 37.5 0 0 1 157.5 140" />
    </svg>

    <div id="hint-indicator" class="hidden" aria-hidden="true"></div>

    <div id="emoji-choices" role="group" aria-label="Kies de juiste emoji"></div>
  </main>

  <div id="celebration" class="hidden" aria-hidden="true">
    <div id="confetti"></div>
    <div id="celebration-hint"></div>
  </div>

  <script src="js/app.js"></script>
</body>
</html>
```

Let op: arcs zijn concentrische halve cirkels. Paars (binnenste) heeft kleinste radius (37.5), rood (buitenste) grootste (112.5). Stroke-width 15, dus banden zijn 15 eenheden breed (radii verschillen 15). ViewBox-hoogte 140 laat ruimte voor het onderste deel van de stroke.

- [ ] **Step 2: Vervang `css/style.css` door minimale reset + layout-skelet**

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fafafa;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
}

#game {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  height: 100vh;
  padding: 2vh 2vw;
}

#rainbow {
  flex: 1 1 auto;
  width: 100%;
  max-height: 60vh;
}

#emoji-choices {
  display: flex;
  gap: 4vw;
  justify-content: center;
  align-items: center;
  flex: 0 0 auto;
  padding-bottom: 2vh;
}

.hidden {
  display: none !important;
}
```

- [ ] **Step 3: Controleer dat de pagina laadt**

Start dev server:

```bash
npm start
```

Expected: browser opent, lege regenboog zichtbaar (6 grijze concentrische bogen), geen console-errors. Stop server met Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css
git commit -m "feat: scaffold HTML met SVG-regenboog en basis-CSS"
```

---

## Task 6: `ui/rainbow.js` — regenboog renderer

**Files:**
- Create: `js/ui/rainbow.js`
- Modify: `css/style.css` (regenboog-styling + target pulse)

- [ ] **Step 1: Maak `js/ui/rainbow.js`**

```js
import { COLOR_HEX } from '../game/colors.js';

export function updateRainbow(state) {
  const svg = document.getElementById('rainbow');
  const arcs = svg.querySelectorAll('.arc');

  arcs.forEach((arc) => {
    const color = arc.dataset.color;
    arc.classList.remove('filled', 'target');
    arc.style.removeProperty('--target-color');

    if (state.filledColors.includes(color)) {
      arc.classList.add('filled');
    } else if (state.phase === 'playing' && color === state.currentColor) {
      arc.classList.add('target');
      arc.style.setProperty('--target-color', COLOR_HEX[color]);
    }
  });
}
```

- [ ] **Step 2: Voeg regenboog-styling toe aan `css/style.css`**

Voeg onder bestaande CSS toe:

```css
/* Regenboog */

.arc {
  fill: none;
  stroke: #e5e5e5;
  stroke-width: 15;
  stroke-linecap: butt;
  transition: stroke 500ms ease;
}

.arc.filled[data-color="purple"] { stroke: #9b59b6; }
.arc.filled[data-color="blue"]   { stroke: #3498db; }
.arc.filled[data-color="green"]  { stroke: #2ecc71; }
.arc.filled[data-color="yellow"] { stroke: #f1c40f; }
.arc.filled[data-color="orange"] { stroke: #e67e22; }
.arc.filled[data-color="red"]    { stroke: #e74c3c; }

.arc.target {
  animation: target-pulse 1.4s ease-in-out infinite;
}

@keyframes target-pulse {
  0%, 100% { stroke: #e5e5e5; }
  50%      { stroke: var(--target-color, #888); }
}
```

- [ ] **Step 3: Verifieer visueel in de browser**

Voeg tijdelijk aan `js/app.js` toe (vervang hele bestand):

```js
import { createInitialState, recordCorrect } from './game/state.js';
import { updateRainbow } from './ui/rainbow.js';

let state = createInitialState();
updateRainbow(state);

// Tijdelijke test-trigger: klik op de regenboog vult volgende kleur
document.getElementById('rainbow').addEventListener('click', () => {
  if (state.phase === 'playing') {
    state = recordCorrect(state);
    updateRainbow(state);
  }
});
```

Start `npm start`. Verwacht:
- Binnenste (paarse) baan pulseert grijs ↔ paars.
- Klikken op SVG kleurt de paarse baan in, blauw begint te pulseren.
- Na 6 kliks staat er een complete regenboog (phase wordt 'celebrating', maar nog geen overlay — komt later).

Stop server.

- [ ] **Step 4: Commit**

```bash
git add js/ui/rainbow.js js/app.js css/style.css
git commit -m "feat(ui): voeg regenboog-renderer met pulse-animatie toe"
```

---

## Task 7: `ui/emojiChoices.js` — emoji-knoppen

**Files:**
- Create: `js/ui/emojiChoices.js`
- Modify: `css/style.css` (emoji-knopstyling)

- [ ] **Step 1: Maak `js/ui/emojiChoices.js`**

```js
let onTapCallback = null;

export function bindChoices(handler) {
  onTapCallback = handler;
}

export function renderChoices(state) {
  const container = document.getElementById('emoji-choices');
  container.innerHTML = '';

  if (state.phase !== 'playing') return;

  state.currentChoices.forEach((emoji, index) => {
    const btn = document.createElement('button');
    btn.className = 'emoji-btn';
    btn.type = 'button';
    btn.textContent = emoji;
    btn.setAttribute('aria-label', `optie ${index + 1}`);
    btn.addEventListener('click', () => {
      if (onTapCallback) onTapCallback(index, btn);
    });
    container.appendChild(btn);
  });
}

export function markHintBounce(correctIndex) {
  const buttons = document.querySelectorAll('#emoji-choices .emoji-btn');
  const btn = buttons[correctIndex];
  if (btn) btn.classList.add('hint-bounce');
}

export function clearHintBounce() {
  const buttons = document.querySelectorAll('#emoji-choices .emoji-btn');
  buttons.forEach((b) => b.classList.remove('hint-bounce'));
}
```

- [ ] **Step 2: Voeg emoji-knop-styling toe aan `css/style.css`**

```css
/* Emoji-knoppen */

.emoji-btn {
  width: clamp(72px, 22vw, 160px);
  height: clamp(72px, 22vw, 160px);
  font-size: clamp(3rem, 12vw, 6rem);
  background: #fff;
  border: 2px solid #ddd;
  border-radius: 20%;
  box-shadow: 0 4px 0 #d0d0d0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: transform 120ms ease, box-shadow 120ms ease;
}

.emoji-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #d0d0d0;
}

.emoji-btn.fly-to-rainbow {
  pointer-events: none;
  animation: fly-to-rainbow 500ms ease-in forwards;
}

@keyframes fly-to-rainbow {
  0%   { transform: scale(1) translateY(0);        opacity: 1; }
  100% { transform: scale(0.1) translateY(-60vh);  opacity: 0; }
}

.emoji-btn.hint-bounce {
  animation: hint-bounce 0.9s ease-in-out infinite;
}

@keyframes hint-bounce {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-12px); }
}
```

- [ ] **Step 3: Commit**

```bash
git add js/ui/emojiChoices.js css/style.css
git commit -m "feat(ui): voeg emoji-keuze-knoppen met animaties toe"
```

---

## Task 8: `ui/hintIndicator.js` — kleurvlek hint

**Files:**
- Create: `js/ui/hintIndicator.js`
- Modify: `css/style.css` (hint-indicator styling)

- [ ] **Step 1: Maak `js/ui/hintIndicator.js`**

```js
import { COLOR_HEX } from '../game/colors.js';

export function updateHint(state) {
  const el = document.getElementById('hint-indicator');
  if (state.phase === 'playing' && state.wrongCountThisChallenge >= 2) {
    el.style.backgroundColor = COLOR_HEX[state.currentColor];
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
    el.style.removeProperty('background-color');
  }
}
```

- [ ] **Step 2: Voeg styling toe aan `css/style.css`**

```css
/* Hint-indicator */

#hint-indicator {
  width: clamp(48px, 10vw, 80px);
  height: clamp(48px, 10vw, 80px);
  border-radius: 50%;
  margin: 1vh 0;
  flex: 0 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  animation: hint-pulse 1.1s ease-in-out infinite;
}

@keyframes hint-pulse {
  0%, 100% { transform: scale(1);    opacity: 0.85; }
  50%      { transform: scale(1.15); opacity: 1; }
}
```

- [ ] **Step 3: Commit**

```bash
git add js/ui/hintIndicator.js css/style.css
git commit -m "feat(ui): voeg kleurvlek-hint toe bij 2+ foute pogingen"
```

---

## Task 9: `ui/celebration.js` — viering-overlay + confetti

**Files:**
- Create: `js/ui/celebration.js`
- Modify: `css/style.css` (celebration styling)

- [ ] **Step 1: Maak `js/ui/celebration.js`**

```js
import { COLOR_HEX, COLORS } from '../game/colors.js';

const CONFETTI_COUNT = 40;
let onTapCallback = null;

export function bindCelebrationTap(handler) {
  onTapCallback = handler;
  const overlay = document.getElementById('celebration');
  overlay.addEventListener('click', () => {
    if (onTapCallback) onTapCallback();
  });
}

export function showCelebration() {
  const overlay = document.getElementById('celebration');
  const confettiContainer = document.getElementById('confetti');
  confettiContainer.innerHTML = '';

  for (let i = 0; i < CONFETTI_COUNT; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    piece.style.backgroundColor = COLOR_HEX[color];
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.animationDuration = `${2 + Math.random() * 2}s`;
    piece.style.animationDelay = `${Math.random() * 1.5}s`;
    piece.style.setProperty('--drift', `${(Math.random() - 0.5) * 40}vw`);
    piece.style.setProperty('--rot', `${Math.random() * 720}deg`);
    confettiContainer.appendChild(piece);
  }

  overlay.classList.remove('hidden');
}

export function hideCelebration() {
  const overlay = document.getElementById('celebration');
  overlay.classList.add('hidden');
  document.getElementById('confetti').innerHTML = '';
}
```

- [ ] **Step 2: Voeg celebration-styling toe aan `css/style.css`**

```css
/* Celebration-overlay */

#celebration {
  position: fixed;
  inset: 0;
  pointer-events: auto;
  cursor: pointer;
  z-index: 10;
}

#confetti {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.confetti-piece {
  position: absolute;
  top: -5vh;
  width: 14px;
  height: 14px;
  border-radius: 3px;
  animation: confetti-fall linear infinite;
  transform: translate(0, 0) rotate(0deg);
}

@keyframes confetti-fall {
  0%   { transform: translate(0, -10vh)            rotate(0deg); opacity: 1; }
  100% { transform: translate(var(--drift), 110vh) rotate(var(--rot)); opacity: 1; }
}

#celebration-hint {
  position: absolute;
  left: 50%;
  bottom: 12vh;
  transform: translateX(-50%);
  width: clamp(80px, 18vw, 140px);
  height: clamp(80px, 18vw, 140px);
  border-radius: 50%;
  background: conic-gradient(
    #e74c3c 0 16.66%,
    #e67e22 16.66% 33.33%,
    #f1c40f 33.33% 50%,
    #2ecc71 50% 66.66%,
    #3498db 66.66% 83.33%,
    #9b59b6 83.33% 100%
  );
  animation: celebration-pulse 1.3s ease-in-out infinite;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

@keyframes celebration-pulse {
  0%, 100% { transform: translateX(-50%) scale(1);    }
  50%      { transform: translateX(-50%) scale(1.15); }
}
```

- [ ] **Step 3: Commit**

```bash
git add js/ui/celebration.js css/style.css
git commit -m "feat(ui): voeg viering-overlay met confetti en tap-to-restart toe"
```

---

## Task 10: `app.js` — alles aan elkaar plakken

**Files:**
- Modify: `js/app.js`

- [ ] **Step 1: Vervang volledige inhoud van `js/app.js`**

```js
import {
  createInitialState,
  recordCorrect,
  recordWrong,
  restart,
} from './game/state.js';
import { updateRainbow } from './ui/rainbow.js';
import {
  renderChoices,
  bindChoices,
  markHintBounce,
  clearHintBounce,
} from './ui/emojiChoices.js';
import { updateHint } from './ui/hintIndicator.js';
import {
  showCelebration,
  hideCelebration,
  bindCelebrationTap,
} from './ui/celebration.js';

let state = createInitialState();

function renderAll() {
  updateRainbow(state);
  renderChoices(state);
  updateHint(state);
  clearHintBounce();
  if (state.phase === 'playing' && state.wrongCountThisChallenge >= 2) {
    markHintBounce(state.correctIndex);
  }
}

function handleTap(index, buttonEl) {
  if (state.phase !== 'playing') return;
  if (state.tapsAreLocked) return;

  if (index === state.correctIndex) {
    handleCorrect(buttonEl);
  } else {
    handleWrong();
  }
}

function handleCorrect(buttonEl) {
  state = { ...state, tapsAreLocked: true };

  buttonEl.classList.add('fly-to-rainbow');

  window.setTimeout(() => {
    state = recordCorrect(state);
    state = { ...state, tapsAreLocked: false };

    if (state.phase === 'celebrating') {
      updateRainbow(state);
      renderChoices(state);
      updateHint(state);
      showCelebration();
    } else {
      renderAll();
    }
  }, 500);
}

function handleWrong() {
  state = recordWrong(state);
  updateHint(state);
  if (state.wrongCountThisChallenge >= 2) {
    markHintBounce(state.correctIndex);
  }
}

function handleRestart() {
  state = restart(state);
  hideCelebration();
  renderAll();
}

bindChoices(handleTap);
bindCelebrationTap(handleRestart);
renderAll();
```

- [ ] **Step 2: Build en visueel verifiëren**

```bash
npm start
```

Doorloop handmatig op laptop-scherm:
- Binnenste baan pulseert paars.
- Klik op paarse emoji → emoji vliegt weg, baan kleurt paars, volgende baan (blauw) pulseert, 3 nieuwe emoji's verschijnen.
- Klik op een foute emoji → niks zichtbaars.
- Klik nog een foute emoji → kleurvlek verschijnt boven de knoppen in doelkleur, juiste emoji bounced.
- Klik juiste emoji → hint verdwijnt, doorgaan.
- Na 6 correcte: viering-overlay met confetti en pulserende regenboogcirkel onderaan.
- Tap ergens op overlay → spel reset, regenboog leeg, paars pulseert weer.

Test ook verkleinen van venster → layout past mee. Test op mobiel (DevTools device toolbar) → werkt touch-friendly.

Stop server.

- [ ] **Step 3: Commit**

```bash
git add js/app.js
git commit -m "feat: plak app.js aan elkaar — taps, animaties, restart"
```

---

## Task 11: End-to-end handmatige regressie

**Files:** geen wijzigingen, enkel verifiëren.

- [ ] **Step 1: Volledige build**

```bash
npm run build
```

Expected: `dist/` folder wordt aangemaakt, geen errors.

- [ ] **Step 2: Draai productie-build lokaal (optioneel)**

```bash
npx http-server dist -p 8080
```

Open http://localhost:8080. Expected: spel werkt identiek aan dev-server.

- [ ] **Step 3: Run alle tests eenmaal**

```bash
npm test
```

Expected: alle 16 tests slagen.

- [ ] **Step 4: Handmatige checklist**

Doorloop elk op minstens 2 viewport-groottes (bv. mobiel 375×667, laptop 1280×800):

- [ ] Binnenste baan pulseert zodra spel start.
- [ ] 3 knoppen zichtbaar, duidelijk tap-baar, niet overlappend.
- [ ] Fly-to-rainbow-animatie soepel; knop verdwijnt, baan kleurt in.
- [ ] Volgende pulse start onmiddellijk na inkleuren.
- [ ] Foute tap geeft geen zichtbare feedback.
- [ ] Na 2 foute taps: kleurvlek verschijnt in doelkleur, juiste emoji bounced.
- [ ] Hint verdwijnt bij volgende challenge.
- [ ] Eindviering: confetti valt, regenboog blijft compleet zichtbaar, gekleurde cirkel pulseert onderaan.
- [ ] Tap op overlay → reset, nieuwe ronde begint met andere emoji's.
- [ ] Regenboog schaalt netjes mee bij venster resize.
- [ ] Geen console-errors.

- [ ] **Step 5: Commit eventuele polish**

Indien tijdens regressie kleine CSS-aanpassingen nodig zijn:

```bash
git add -u css/style.css
git commit -m "polish: kleine layout-tweaks na visuele regressie"
```

---

## Self-review checklist

De plan-auteur heeft onderstaande gecontroleerd voor handoff:

- [x] Elke spec-sectie heeft minstens één taak die het implementeert (Doel → Task 10 wiring; Doelgroep → responsive CSS Task 5/7/8; Kernbeslissingen → Task 2 constanten + Task 3 challenge + Task 4 state; Visuele componenten → Task 5/6/7/8/9; Datamodel → Task 2/3/4; Interactie → Task 10; Bestandsstructuur → alle Tasks; Testen → Task 0/1/3/4).
- [x] Geen TBD/TODO/placeholders in code-blokken.
- [x] Type-consistentie: `currentColor`, `currentChoices`, `correctIndex`, `filledColors`, `wrongCountThisChallenge`, `phase`, `tapsAreLocked` zijn in alle tasks identiek gespeld.
- [x] Functienamen consistent: `createInitialState`, `recordCorrect`, `recordWrong`, `restart`, `generateChallenge`, `pickOne`, `shuffle`, `updateRainbow`, `renderChoices`, `bindChoices`, `markHintBounce`, `clearHintBounce`, `updateHint`, `showCelebration`, `hideCelebration`, `bindCelebrationTap` — alle referenties matchen.
- [x] Geen functies of CSS-classes gebruikt die niet ergens gedefinieerd zijn: `.arc`, `.filled`, `.target`, `.emoji-btn`, `.fly-to-rainbow`, `.hint-bounce`, `.confetti-piece`, `#hint-indicator`, `#celebration`, `#confetti`, `#celebration-hint`, `#rainbow`, `#emoji-choices` — allemaal gedefinieerd in Task 5/6/7/8/9.

---

## Openstaande follow-ups (na implementatie)

Voor later, buiten deze plan-scope:

- Emoji-poule per kleur empirisch tunen (cross-browser rendering checken).
- Kleurpalet finetunen als peuter-feedback binnenkomt.
- Eventueel geluid toevoegen (aparte ontwerpsessie).
- PWA/installable maken (huidige manifest + icons zijn al aanwezig).
