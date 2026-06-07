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

export function revealPicture(puzzle) {
  const board = document.getElementById('board');
  const { dots, color, emoji } = puzzle;

  // Filled polygon at the very back
  const polygon = document.createElementNS(SVG_NS, 'polygon');
  polygon.setAttribute('class', 'dot-fill');
  const points = dots.map(([x, y]) => `${x},${y}`).join(' ');
  polygon.setAttribute('points', points);
  polygon.style.fill = color;
  polygon.style.stroke = color;
  board.insertBefore(polygon, board.firstChild);

  // Emoji sized to fill the dots' bounding box, centred on it
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
  // Place the emoji just above the fill but BELOW the drawn lines and dots,
  // so the connect-the-dots picture stays visible in front of it.
  board.insertBefore(text, polygon.nextSibling);
}
