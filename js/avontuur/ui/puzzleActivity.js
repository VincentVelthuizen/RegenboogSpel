import { pictureBounds } from '../game/geometry.js';
import { gridFor, makePieces, shuffled, fitsCell, isSolved } from '../game/jigsaw.js';
import { drawPicture, svgElement } from './picture.js';

const GAP = 10;

// Jigsaw: the picture's pieces lie shuffled in a tray; drag each one onto
// the board. A piece dropped on its own cell snaps into place; anywhere else
// it slides back to the tray. A faint ghost of the picture on the board helps.
// Returns a cleanup function (removes the resize listener).
export function startPuzzleActivity(container, picture, onDone) {
  const box = pictureBounds(picture);
  const grid = gridFor(box);
  const pieces = makePieces(box, grid);
  const trayOrder = shuffled(pieces);
  const placed = new Set();
  let top = 1;
  let geo = null;

  const board = document.createElement('div');
  board.className = 'puzzle-board';
  const ghost = svgElement('svg', { viewBox: `${box.x} ${box.y} ${box.width} ${box.height}`, preserveAspectRatio: 'none' });
  ghost.classList.add('puzzle-ghost');
  drawPicture(ghost, picture);
  board.appendChild(ghost);
  container.appendChild(board);

  const els = new Map();
  pieces.forEach((piece) => {
    const el = document.createElement('div');
    el.className = 'puzzle-piece';
    const { x, y, width, height } = piece.viewBox;
    const svg = svgElement('svg', { viewBox: `${x} ${y} ${width} ${height}`, preserveAspectRatio: 'none' });
    drawPicture(svg, picture);
    el.appendChild(svg);
    container.appendChild(el);
    els.set(piece.id, el);
    enableDrag(piece, el);
  });

  function layout() {
    const W = container.clientWidth;
    const H = container.clientHeight;
    const landscape = W > H;
    const aspect = box.width / box.height;
    const area = landscape
      ? { x: W * 0.04, y: H * 0.12, w: W * 0.5, h: H * 0.82 }
      : { x: W * 0.05, y: H * 0.11, w: W * 0.9, h: H * 0.46 };
    const tray = landscape
      ? { x: W * 0.58, y: H * 0.12, w: W * 0.38, h: H * 0.82 }
      : { x: W * 0.05, y: H * 0.6, w: W * 0.9, h: H * 0.37 };

    let bw = area.w;
    let bh = bw / aspect;
    if (bh > area.h) { bh = area.h; bw = bh * aspect; }
    const bx = area.x + (area.w - bw) / 2;
    const by = area.y + (area.h - bh) / 2;
    const cw = bw / grid.cols;
    const ch = bh / grid.rows;

    // Tray: the grid of columns that lets the pieces be as big as possible.
    let best = { scale: 0, cols: 1 };
    for (let cols = 1; cols <= pieces.length; cols++) {
      const rows = Math.ceil(pieces.length / cols);
      const scale = Math.min(1, (tray.w - GAP * (cols - 1)) / (cols * cw), (tray.h - GAP * (rows - 1)) / (rows * ch));
      if (scale > best.scale) best = { scale, cols };
    }
    const s = best.scale;
    const tcols = best.cols;
    const trows = Math.ceil(pieces.length / tcols);
    const usedW = tcols * cw * s + GAP * (tcols - 1);
    const usedH = trows * ch * s + GAP * (trows - 1);
    const slots = trayOrder.map((piece, i) => ({
      id: piece.id,
      x: tray.x + (tray.w - usedW) / 2 + (i % tcols) * (cw * s + GAP),
      y: tray.y + (tray.h - usedH) / 2 + Math.floor(i / tcols) * (ch * s + GAP),
    }));

    geo = { bx, by, bw, bh, cw, ch, s, slots: new Map(slots.map((slot) => [slot.id, slot])) };
    Object.assign(board.style, { left: `${bx}px`, top: `${by}px`, width: `${bw}px`, height: `${bh}px` });
    pieces.forEach((piece) => {
      const el = els.get(piece.id);
      el.style.width = `${cw}px`;
      el.style.height = `${ch}px`;
      if (placed.has(piece.id)) moveTo(el, bx + piece.col * cw, by + piece.row * ch, 1);
      else moveTo(el, geo.slots.get(piece.id).x, geo.slots.get(piece.id).y, s);
    });
  }

  function moveTo(el, x, y, scale) {
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.transform = `scale(${scale})`;
  }

  function enableDrag(piece, el) {
    let grab = null;
    el.addEventListener('pointerdown', (e) => {
      if (placed.has(piece.id)) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      const origin = container.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      // Where in the piece it was grabbed, as a fraction, so it stays under
      // the finger while growing from tray size to board size.
      grab = { fx: (e.clientX - r.left) / r.width, fy: (e.clientY - r.top) / r.height, origin };
      el.classList.add('dragging');
      el.style.zIndex = String(++top);
      follow(e);
    });
    const follow = (e) => {
      const x = e.clientX - grab.origin.left - grab.fx * geo.cw;
      const y = e.clientY - grab.origin.top - grab.fy * geo.ch;
      moveTo(el, x, y, 1);
    };
    el.addEventListener('pointermove', (e) => { if (grab) follow(e); });
    const drop = (e) => {
      if (!grab) return;
      const cx = e.clientX - grab.origin.left - grab.fx * geo.cw + geo.cw / 2;
      const cy = e.clientY - grab.origin.top - grab.fy * geo.ch + geo.ch / 2;
      grab = null;
      el.classList.remove('dragging');
      if (fitsCell(piece, grid, (cx - geo.bx) / geo.bw, (cy - geo.by) / geo.bh)) {
        placed.add(piece.id);
        el.classList.add('placed');
        el.style.zIndex = '0';
        moveTo(el, geo.bx + piece.col * geo.cw, geo.by + piece.row * geo.ch, 1);
        if (isSolved(pieces, placed)) {
          board.classList.add('solved');
          onDone(null);
        }
      } else {
        const slot = geo.slots.get(piece.id);
        moveTo(el, slot.x, slot.y, geo.s);
      }
    };
    el.addEventListener('pointerup', drop);
    el.addEventListener('pointercancel', drop);
  }

  layout();
  // Only animate moves after the pieces are in the tray, so they don't
  // slide in from the corner.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    els.forEach((el) => el.classList.add('animated'));
  }));
  window.addEventListener('resize', layout);
  return () => window.removeEventListener('resize', layout);
}
