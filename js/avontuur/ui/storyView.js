import { getPuzzle } from '../../dots/game/puzzles.js';
import { getNode, isEnding } from '../game/story.js';
import { pictureBounds } from '../game/geometry.js';
import { drawPicture, svgElement } from './picture.js';

function button(className, content, label, onClick) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = className;
  btn.setAttribute('aria-label', label);
  btn.append(...content);
  btn.addEventListener('click', onClick);
  return btn;
}

function span(className, text) {
  const el = document.createElement('span');
  el.className = className;
  el.textContent = text;
  return el;
}

function audioButton(src) {
  let audio = null;
  return button('audio-btn', ['🔊'], 'voorlezen', () => {
    if (!audio) audio = new Audio(src);
    audio.currentTime = 0;
    audio.play().catch(() => {});
  });
}

// The story step: the picture the child just made (in their colours), the
// text to read aloud, and the choices — or, at an ending, "again" / "home".
export function renderStory(container, node, colors, { onChoose, onRestart }) {
  const view = document.createElement('div');
  view.className = 'story';

  const drawing = getPuzzle(node.picture);
  const box = pictureBounds(drawing, 5);
  const picture = svgElement('svg', { viewBox: `${box.x} ${box.y} ${box.width} ${box.height}`, preserveAspectRatio: 'xMidYMid meet' });
  picture.classList.add('story-picture');
  drawPicture(picture, drawing, colors);
  view.appendChild(picture);

  const side = document.createElement('div');
  side.className = 'story-side';
  const text = document.createElement('p');
  text.className = 'story-text';
  text.textContent = node.text;
  side.appendChild(text);
  if (node.audio) side.appendChild(audioButton(node.audio));

  const choices = document.createElement('div');
  choices.className = 'choices';
  if (isEnding(node)) {
    side.appendChild(span('story-end', 'Einde'));
    choices.append(
      button('choice-btn', [span('choice-emoji', '🔁'), span('choice-label', 'Nog een avontuur')], 'nog een avontuur', onRestart),
    );
    const home = document.createElement('a');
    home.className = 'choice-btn';
    home.href = 'index.html';
    home.setAttribute('aria-label', 'naar het menu');
    home.append(span('choice-emoji', '🏠'), span('choice-label', 'Naar het menu'));
    choices.appendChild(home);
  } else {
    node.choices.forEach((choice) => {
      const emoji = getPuzzle(getNode(choice.next).picture).emoji;
      choices.appendChild(button('choice-btn', [span('choice-emoji', emoji), span('choice-label', choice.label)],
        choice.label, () => onChoose(choice.next)));
    });
  }
  side.appendChild(choices);
  view.appendChild(side);
  container.appendChild(view);
}

export function renderIntro(container, onStart) {
  const view = document.createElement('div');
  view.className = 'intro';
  view.append(
    span('intro-emoji', '📖'),
    span('intro-title', 'Het avontuur van Pip'),
    span('intro-text', 'Wie gaat er vandaag op avontuur? Maak de tekening en ontdek het!'),
    button('start-btn', ['▶'], 'begin', onStart),
  );
  container.appendChild(view);
}
