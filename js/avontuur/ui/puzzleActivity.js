import { pictureBounds } from '../game/geometry.js';
import { gridFor, makePieces, shuffled, fitsCell, isSolved } from '../game/jigsaw.js';
import { drawPicture, svgElement } from '../../dots/ui/picture.js';

const GAP = 10;

// How far down the instruction (and steps bar) above an activity reach.
export function topReserved(container) {
  const origin = container.getBoundingClientRect().top;
  const bottoms = [...container.querySelectorAll(':scope > .activity-label, :scope > .trail')]
    .map((el) => el.getBoundingClientRect().bottom - origin);
  return bottoms.length ? Math.max(...bottoms) + 12 : 0;
}

// Jigsaw: the picture's pieces lie shuffled in a tray. Tap a piece and then
// its spot on the board, or drag it there. A piece on its own cell snaps
// into place; dropped anywhere else it slides back to the tray. A faint ghost of the picture on the board helps.
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
    const top = Math.max(H * 0.11, topReserved(container));
    const area = landscape
      ? { x: W * 0.04, y: top, w: W * 0.5, h: H * 0.95 - top }
      : { x: W * 0.05, y: top, w: W * 0.9, h: H * 0.57 - top };
    const tray = landscape
      ? { x: W * 0.58, y: top, w: W * 0.38, h: H * 0.95 - top }
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

  // Put a piece in its cell for good.
  function place(piece) {
    const el = els.get(piece.id);
    placed.add(piece.id);
    el.classList.remove('selected');
    el.classList.add('placed');
    el.style.zIndex = '0';
    moveTo(el, geo.bx + piece.col * geo.cw, geo.by + piece.row * geo.ch, 1);
    if (isSolved(pieces, placed)) {
      board.classList.add('solved');
      onDone(null);
    }
  }

  // Tap-to-place: tap a piece to pick it up (it lights up), then tap the
  // spot on the board where it belongs. A wrong spot makes the piece wiggle
  // and it stays picked up.
  let selected = null;
  function select(piece) {
    selected = selected === piece ? null : piece;
    els.forEach((el, id) => el.classList.toggle('selected', selected !== null && id === selected.id));
    board.classList.toggle('awaiting', selected !== null);
  }

  board.addEventListener('click', (e) => {
    if (!selected) return;
    const r = board.getBoundingClientRect();
    const piece = selected;
    if (fitsCell(piece, grid, (e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height)) {
      select(piece);
      place(piece);
    } else {
      const el = els.get(piece.id);
      el.classList.remove('wiggle');
      void el.offsetWidth; // restart the animation
      el.classList.add('wiggle');
    }
  });

  // Dragging works too: a press that moves more than a few pixels drags the
  // piece; a press that stays put is a tap.
  const DRAG_THRESHOLD = 8;
  function enableDrag(piece, el) {
    let press = null;
    let grab = null;
    el.addEventListener('pointerdown', (e) => {
      if (placed.has(piece.id)) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      press = { x: e.clientX, y: e.clientY };
    });
    const follow = (e) => {
      const x = e.clientX - grab.origin.left - grab.fx * geo.cw;
      const y = e.clientY - grab.origin.top - grab.fy * geo.ch;
      moveTo(el, x, y, 1);
    };
    el.addEventListener('pointermove', (e) => {
      if (!press) return;
      if (!grab) {
        if (Math.hypot(e.clientX - press.x, e.clientY - press.y) < DRAG_THRESHOLD) return;
        const origin = container.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        // Where in the piece it was grabbed, as a fraction, so it stays under
        // the finger while growing from tray size to board size.
        grab = { fx: (press.x - r.left) / r.width, fy: (press.y - r.top) / r.height, origin };
        if (selected) select(selected);
        el.classList.add('dragging');
        el.style.zIndex = String(++top);
      }
      follow(e);
    });
    const release = (e) => {
      if (!press) return;
      press = null;
      if (!grab) {
        if (e.type === 'pointerup') select(piece);
        return;
      }
      const cx = e.clientX - grab.origin.left - grab.fx * geo.cw + geo.cw / 2;
      const cy = e.clientY - grab.origin.top - grab.fy * geo.ch + geo.ch / 2;
      grab = null;
      el.classList.remove('dragging');
      if (fitsCell(piece, grid, (cx - geo.bx) / geo.bw, (cy - geo.by) / geo.bh)) {
        place(piece);
      } else {
        const slot = geo.slots.get(piece.id);
        moveTo(el, slot.x, slot.y, geo.s);
      }
    };
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
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
