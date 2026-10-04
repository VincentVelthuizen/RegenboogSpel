const SVG_NS = 'http://www.w3.org/2000/svg';
let dotTapCallback = null;

export function bindBoard(handler) {
  dotTapCallback = handler;
}

export function renderBoard(puzzle, state, justScored = -1) {
  const board = document.getElementById('board');
  board.innerHTML = '';

  const { dots, color, lines, dotRadius } = puzzle;
  const { nextDotIndex } = state;
  const r = dotRadius || 5;

  // Line through already-connected dots. For constellations only the real
  // star-to-star lines are drawn; a step between two stars that aren't joined
  // in the figure lifts the pen.
  if (nextDotIndex >= 1) {
    const path = document.createElementNS(SVG_NS, 'path');
    path.setAttribute('class', 'dot-line');
    const joined = lines ? new Set(lines.map(([a, b]) => (a < b ? `${a}-${b}` : `${b}-${a}`))) : null;
    const d = dots.slice(0, nextDotIndex).map(([x, y], i) => {
      const drawn = i > 0 && (!joined || joined.has(`${i - 1}-${i}`));
      return `${drawn ? 'L' : 'M'}${x},${y}`;
    }).join(' ');
    path.setAttribute('d', d);
    path.style.stroke = color;
    board.appendChild(path);
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
      hit.setAttribute('r', dotRadius ? String(Math.max(6, r * 2.4)) : '11');
      g.appendChild(hit);
    }

    // Visible dot
    const circle = document.createElementNS(SVG_NS, 'circle');
    circle.setAttribute('cx', String(x));
    circle.setAttribute('cy', String(y));
    circle.setAttribute('r', String(r));
    if (dotRadius) circle.style.strokeWidth = String(r * 0.25);

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
      if (dotRadius) text.style.fontSize = `${(r * 1.4).toFixed(2)}px`;
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
  // `fill` is the body colour of a cartoon figure; `color` stays the
  // (darker) outline, i.e. the line the player drew.
  polygon.style.fill = puzzle.fill || color;
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

// Stars brighter than this get their (real) name written next to them.
const NAMED_STAR_MAG = 1.5;

// Reveal for a finished constellation, like a star chart: the whole
// traditional stick figure lights up (including lines that weren't drawn
// while tapping), every star gets a sparkle sized by its real brightness
// (magnitude), the brightest stars are named, and the constellation's name
// is written where there's room.
export function revealConstellation(figure) {
  const board = document.getElementById('board');
  const { dots, color, label, lines, mags, starNames, dotRadius } = figure;

  const figureLines = document.createElementNS(SVG_NS, 'path');
  figureLines.setAttribute('class', 'constellation-outline');
  figureLines.setAttribute('d', lines.map(([a, b]) => `M${dots[a][0]},${dots[a][1]} L${dots[b][0]},${dots[b][1]}`).join(' '));
  figureLines.style.stroke = color;
  figureLines.style.setProperty('--glow-color', color);
  board.insertBefore(figureLines, board.firstChild);

  const ys = dots.map(([, y]) => y);
  let nameY = 4;
  if (Math.min(...ys) > 16) nameY = 9;
  else if (Math.max(...ys) < 84) nameY = 94;
  const name = document.createElementNS(SVG_NS, 'text');
  name.setAttribute('class', 'constellation-name');
  name.setAttribute('x', '50');
  name.setAttribute('y', String(nameY));
  name.textContent = label;
  board.appendChild(name);

  // Sparkles on top of everything, one per star, popping in in sequence.
  // Magnitude runs backwards: smaller = brighter = bigger sparkle.
  dots.forEach(([x, y], i) => {
    const sparkle = dotRadius * Math.min(1.9, Math.max(0.7, 1.9 - 0.3 * mags[i]));
    const star = document.createElementNS(SVG_NS, 'path');
    star.setAttribute('d', sparklePath(x, y, sparkle));
    star.setAttribute('class', 'constellation-star');
    star.style.setProperty('--glow-color', color);
    star.style.animationDelay = `${150 + i * 40}ms`;
    board.appendChild(star);

    if (mags[i] <= NAMED_STAR_MAG) {
      const starName = document.createElementNS(SVG_NS, 'text');
      starName.setAttribute('class', 'constellation-star-name');
      starName.setAttribute('x', String(x));
      starName.setAttribute('y', String(y > 88 ? y - sparkle - 2 : y + sparkle + 3));
      starName.textContent = starNames[i];
      board.appendChild(starName);
    }
  });
}
