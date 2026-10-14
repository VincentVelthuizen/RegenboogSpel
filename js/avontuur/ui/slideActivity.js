import { pictureBounds } from '../game/geometry.js';
import { makePieces } from '../game/jigsaw.js';
import { SLIDE_GRID, scramble, move, canMove, isSolved } from '../game/slide.js';
import { drawPicture, svgElement } from '../../dots/ui/picture.js';

// Sliding puzzle: tap a tile next to the empty spot to slide it there. A
// small picture alongside shows what it should become. When solved, the
// missing last tile appears. Returns a cleanup function.
export function startSlideActivity(container, picture, onDone) {
  const box = pictureBounds(picture);
  const tiles = makePieces(box, SLIDE_GRID);
  let board = scramble(SLIDE_GRID);
  let solved = false;

  const frame = document.createElement('div');
  frame.className = 'slide-board';
  container.appendChild(frame);

  const example = svgElement('svg', { viewBox: `${box.x} ${box.y} ${box.width} ${box.height}`, preserveAspectRatio: 'xMidYMid meet' });
  example.classList.add('slide-example');
  drawPicture(example, picture);
  container.appendChild(example);

  const els = tiles.map((tile) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'slide-tile';
    el.setAttribute('aria-label', `stukje ${tile.id + 1}`);
    const { x, y, width, height } = tile.viewBox;
    const svg = svgElement('svg', { viewBox: `${x} ${y} ${width} ${height}`, preserveAspectRatio: 'none' });
    drawPicture(svg, picture);
    el.appendChild(svg);
    el.style.width = `${100 / SLIDE_GRID.cols}%`;
    el.style.height = `${100 / SLIDE_GRID.rows}%`;
    el.addEventListener('click', () => {
      if (solved) return;
      const cell = board.indexOf(tile.id);
      if (!canMove(board, cell, SLIDE_GRID)) {
        el.classList.remove('nudge');
        void el.offsetWidth; // restart the nudge animation
        el.classList.add('nudge');
        return;
      }
      board = move(board, cell, SLIDE_GRID);
      place();
      if (isSolved(board)) {
        solved = true;
        frame.classList.add('solved');
        onDone(null);
      }
    });
    frame.appendChild(el);
    return el;
  });
  // The last tile stays out until the puzzle is solved.
  const lastTile = els[els.length - 1];
  lastTile.classList.add('slide-missing');

  function place() {
    board.forEach((tileId, cell) => {
      if (tileId === null) return;
      const el = els[tileId];
      el.style.left = `${((cell % SLIDE_GRID.cols) * 100) / SLIDE_GRID.cols}%`;
      el.style.top = `${(Math.floor(cell / SLIDE_GRID.cols) * 100) / SLIDE_GRID.rows}%`;
      el.classList.toggle('movable', canMove(board, cell, SLIDE_GRID));
    });
    // Parked in its own (solved) spot; shown once the puzzle is complete.
    const n = els.length - 1;
    lastTile.style.left = `${((n % SLIDE_GRID.cols) * 100) / SLIDE_GRID.cols}%`;
    lastTile.style.top = `${(Math.floor(n / SLIDE_GRID.cols) * 100) / SLIDE_GRID.rows}%`;
  }

  function layout() {
    const W = container.clientWidth;
    const H = container.clientHeight;
    const landscape = W > H;
    const aspect = box.width / box.height;
    const area = landscape ? { w: W * 0.58, h: H * 0.8 } : { w: W * 0.9, h: H * 0.6 };
    let bw = area.w;
    let bh = bw / aspect;
    if (bh > area.h) { bh = area.h; bw = bh * aspect; }
    frame.style.width = `${bw}px`;
    frame.style.height = `${bh}px`;
  }

  place();
  layout();
  requestAnimationFrame(() => requestAnimationFrame(() => els.forEach((el) => el.classList.add('animated'))));
  window.addEventListener('resize', layout);
  return () => window.removeEventListener('resize', layout);
}
