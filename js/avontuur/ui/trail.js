import { getPuzzle } from '../../dots/game/puzzles.js';
import { getNode } from '../game/story.js';
import { isFinished } from '../game/state.js';
import { pictureThumbnail } from '../../dots/ui/picture.js';

// The steps of this adventure as a row of little pictures at the top: every
// finished step shows the picture as the child made it and can be tapped to
// go back to that part of the story (and choose again). The step being made
// right now is a dashed placeholder.
export function renderTrail(container, story, state, onVisit) {
  const trail = document.createElement('nav');
  trail.className = 'trail';
  trail.setAttribute('aria-label', 'stappen');

  state.path.forEach((nodeId, i) => {
    if (i > 0) {
      const link = document.createElement('span');
      link.className = 'trail-link';
      trail.appendChild(link);
    }
    const here = i === state.step;
    if (!isFinished(state, i)) {
      const pending = document.createElement('span');
      pending.className = 'trail-step pending';
      pending.textContent = String(i + 1);
      trail.appendChild(pending);
      return;
    }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'trail-step';
    if (here) btn.classList.add('current');
    if (i > state.step) btn.classList.add('later');
    const picture = getPuzzle(getNode(story, nodeId).picture);
    btn.setAttribute('aria-label', `stap ${i + 1}: ${picture.label}`);
    btn.appendChild(pictureThumbnail(picture, state.made[i]));
    btn.addEventListener('click', () => {
      if (!(here && state.phase === 'story')) onVisit(i);
    });
    trail.appendChild(btn);
  });

  container.appendChild(trail);
  container.classList.add('with-trail');
}
