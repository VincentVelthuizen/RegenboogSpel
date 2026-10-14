import { PALETTE, BODY, colorRegions, paint, isFullyColored } from '../game/coloring.js';
import { pictureBounds } from '../game/geometry.js';
import { drawPicture, svgElement } from './picture.js';

// Colouring page: pick a colour from the palette, tap a region to fill it.
// The ✓ button appears once the body is coloured (the rest is up to the
// child) and starts to bounce when everything is coloured.
export function startColorActivity(container, picture, onDone) {
  const regions = colorRegions(picture);
  let colors = {};
  let current = PALETTE[0];

  const box = pictureBounds(picture);
  const board = svgElement('svg', { viewBox: `${box.x} ${box.y} ${box.width} ${box.height}`, preserveAspectRatio: 'xMidYMid meet' });
  board.classList.add('activity-board', 'color-board');
  container.appendChild(board);

  const bar = document.createElement('div');
  bar.className = 'palette';
  container.appendChild(bar);

  const done = document.createElement('button');
  done.type = 'button';
  done.className = 'done-btn hidden';
  done.setAttribute('aria-label', 'klaar');
  done.textContent = '✓';
  done.addEventListener('click', () => onDone(colors));
  container.appendChild(done);

  const swatches = PALETTE.map((color) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'swatch';
    btn.style.background = color;
    btn.setAttribute('aria-label', color);
    btn.addEventListener('click', () => {
      current = color;
      swatches.forEach((s) => s.classList.toggle('selected', s === btn));
    });
    bar.appendChild(btn);
    return btn;
  });
  swatches[0].classList.add('selected');

  function render() {
    board.innerHTML = '';
    drawPicture(board, picture, colors);
    done.classList.toggle('hidden', !colors[BODY]);
    done.classList.toggle('all-done', isFullyColored(regions, colors));
  }

  board.addEventListener('click', (e) => {
    const region = e.target.dataset && e.target.dataset.region;
    if (!region) return;
    colors = paint(colors, region, current);
    render();
  });

  render();
}
