const SVG_NS = 'http://www.w3.org/2000/svg';
let dotTapCallback = null;

export function bindBoard(handler) {
  dotTapCallback = handler;
}

export function renderBoard(puzzle, state, justScored = -1) {
  const board = document.getElementById('board');
  board.innerHTML = '';

  const { dots, color } = puzzle;
  const { nextDotIndex } = state;

  // Polyline through already-connected dots
  if (nextDotIndex >= 1) {
    const polyline = document.createElementNS(SVG_NS, 'polyline');
    polyline.setAttribute('class', 'dot-line');
    const points = dots.slice(0, nextDotIndex).map(([x, y]) => `${x},${y}`).join(' ');
    polyline.setAttribute('points', points);
    polyline.style.stroke = color;
    board.appendChild(polyline);
  }

  // Dot groups. Built in order, then appended lowest-number-last so that
  // lower-numbered dots paint above higher-numbered ones where they overlap.
  const groups = dots.map(([x, y], i) => {
    const g = document.createElementNS(SVG_NS, 'g');
    g.setAttribute('class', 'dot-group');

    // Transparent hit area — only on dots not yet connected, so a completed dot
    // (which now paints above its neighbours) can't steal taps from the live dot.
    if (i >= nextDotIndex) {
      const hit = document.createElementNS(SVG_NS, 'circle');
      hit.setAttribute('class', 'dot-hit');
      hit.setAttribute('cx', String(x));
      hit.setAttribute('cy', String(y));
      hit.setAttribute('r', '11');
      g.appendChild(hit);
    }

    // Visible dot
    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('cx', String(x));
    circle.setAttribute('cy', String(y));
    circle.setAttribute('r', '5');

    if (i < nextDotIndex) {
      circle.setAttribute('class', i === justScored ? 'dot done collapsing' : 'dot done');
      circle.style.fill = color;
    } else if (i === nextDotIndex) {
      circle.setAttribute('class', 'dot next');
      circle.style.setProperty('--dot-color', color);
    } else {
      circle.setAttribute('class', 'dot');
    }
    g.appendChild(circle);

    // Number label — only on dots not yet connected; scored dots collapse to a plain dot.
    if (i >= nextDotIndex) {
      const text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('class', 'dot-num');
      text.setAttribute('x', String(x));
      text.setAttribute('y', String(y));
      text.textContent = String(i + 1);
      g.appendChild(text);
    }

    g.addEventListener('click', () => {
      if (dotTapCallback) dotTapCallback(i);
    });

    return g;
  });

  for (let i = groups.length - 1; i >= 0; i--) {
    board.appendChild(groups[i]);
  }
}

function renderDetailPart(part) {
  const el = document.createElementNS(SVG_NS, part.type);
  Object.entries(part.attrs || {}).forEach(([k, v]) => el.setAttribute(k, String(v)));
  el.setAttribute('class', 'dot-detail');
  if (part.fill) el.style.fill = part.fill;
  if (part.stroke) el.style.stroke = part.stroke;
  if (part.strokeWidth) el.style.strokeWidth = String(part.strokeWidth);
  return el;
}

export function revealPicture(puzzle) {
  const board = document.getElementById('board');
  const { dots, color, emoji, details } = puzzle;

  // Filled polygon at the very back
  const polygon = document.createElementNS(SVG_NS, 'polygon');
  polygon.setAttribute('class', details && details.length > 0 ? 'dot-fill dot-fill-solid' : 'dot-fill');
  const points = dots.map(([x, y]) => `${x},${y}`).join(' ');
  polygon.setAttribute('points', points);
  polygon.style.fill = color;
  polygon.style.stroke = color;
  board.insertBefore(polygon, board.firstChild);

  if (details && details.length > 0) {
    // Hand-authored cartoon accents (eyes, horns, ...) on top of the fill,
    // in front of each other in the given order, but still BELOW the drawn
    // lines and dots so the connect-the-dots picture stays visible in front.
    let insertAfter = polygon;
    details.forEach((part, i) => {
      const el = renderDetailPart(part);
      el.style.animationDelay = `${150 + i * 80}ms`;
      insertAfter.after(el);
      insertAfter = el;
    });
    return;
  }

  // Fallback for puzzles without hand-authored details: stamp the emoji,
  // sized to fill the dots' bounding box, centred on it.
  const xs = dots.map(([x]) => x);
  const ys = dots.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const size = Math.min(maxX - minX, maxY - minY) * 1.15;

  const text = document.createElementNS(SVG_NS, 'text');
  text.setAttribute('class', 'dot-emoji');
  text.setAttribute('x', String(cx));
  text.setAttribute('y', String(cy));
  text.style.fontSize = `${size}px`;
  text.textContent = emoji;
  board.insertBefore(text, polygon.nextSibling);
}

// A small 4-point sparkle, like a twinkling star glyph (✦).
function sparklePath(cx, cy, r) {
  const k = r * 0.22;
  return `M${cx},${cy - r} Q${cx + k},${cy - k} ${cx + r},${cy} `
    + `Q${cx + k},${cy + k} ${cx},${cy + r} Q${cx - k},${cy + k} ${cx - r},${cy} `
    + `Q${cx - k},${cy - k} ${cx},${cy - r} Z`;
}

// Reveal for a finished constellation: the stars stay stars — no solid
// fill — but the line connecting them now traces the actual figure (see
// game/constellations.js), drawn as a glowing outline instead of a flat
// wash, with small starlight accents and the figure's name like an old
// star atlas chart. Each connected dot also gets a twinkling sparkle
// stamped on top, so it's unmistakably the actual stars of the pattern.
export function revealConstellation(figure) {
  const board = document.getElementById('board');
  const { dots, color, label, details } = figure;

  const outline = document.createElementNS(SVG_NS, 'polygon');
  outline.setAttribute('class', 'constellation-outline');
  const points = dots.map(([x, y]) => `${x},${y}`).join(' ');
  outline.setAttribute('points', points);
  outline.style.stroke = color;
  outline.style.setProperty('--glow-color', color);
  board.insertBefore(outline, board.firstChild);

  if (details && details.length > 0) {
    let insertAfter = outline;
    details.forEach((part, i) => {
      const el = renderDetailPart(part);
      el.style.animationDelay = `${150 + i * 80}ms`;
      insertAfter.after(el);
      insertAfter = el;
    });
  }

  const name = document.createElementNS(SVG_NS, 'text');
  name.setAttribute('class', 'constellation-name');
  name.setAttribute('x', '50');
  name.setAttribute('y', '9');
  name.textContent = label;
  board.appendChild(name);

  // Sparkles on top of everything, one per star, popping in in sequence.
  dots.forEach(([x, y], i) => {
    const star = document.createElementNS(SVG_NS, 'path');
    const r = i % 3 === 0 ? 3.6 : 2.4; // a few brighter "lead" stars for variety
    star.setAttribute('d', sparklePath(x, y, r));
    star.setAttribute('class', 'constellation-star');
    star.style.setProperty('--glow-color', color);
    star.style.animationDelay = `${150 + i * 40}ms`;
    board.appendChild(star);
  });
}
