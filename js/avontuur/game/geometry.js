// Bounds of the cartoon drawings (see dots/game/puzzles.js), so a picture
// can be framed tightly — including details that stick out of the outline,
// like a balloon's string.

const ARGS = { M: 2, L: 2, T: 2, Q: 4, S: 4, C: 6, A: 7, H: 1, V: 1, Z: 0 };

// The points of an SVG path with absolute commands (as the drawings use):
// end points and control points. Control points can lie a little outside
// the curve, which only makes the bounds slightly generous.
export function pathPoints(d) {
  const tokens = d.match(/[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?/g) || [];
  const points = [];
  let cmd = 'M';
  let x = 0;
  let y = 0;
  let i = 0;
  while (i < tokens.length) {
    if (/[A-Za-z]/.test(tokens[i])) {
      cmd = tokens[i].toUpperCase();
      i += 1;
      if (cmd === 'Z') continue;
    }
    const n = ARGS[cmd];
    if (!n) { i += 1; continue; }
    const args = tokens.slice(i, i + n).map(Number);
    i += n;
    if (cmd === 'H') x = args[0];
    else if (cmd === 'V') y = args[0];
    else if (cmd === 'A') { [x, y] = args.slice(5); } else {
      for (let k = 0; k < n - 2; k += 2) points.push([args[k], args[k + 1]]);
      [x, y] = args.slice(n - 2);
    }
    points.push([x, y]);
  }
  return points;
}

function boxOf(points) {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
}

export function partBounds(part) {
  const a = part.attrs;
  switch (part.type) {
    case 'circle': return { minX: a.cx - a.r, minY: a.cy - a.r, maxX: a.cx + a.r, maxY: a.cy + a.r };
    case 'ellipse': return { minX: a.cx - a.rx, minY: a.cy - a.ry, maxX: a.cx + a.rx, maxY: a.cy + a.ry };
    case 'rect': return { minX: a.x, minY: a.y, maxX: a.x + a.width, maxY: a.y + a.height };
    case 'line': return boxOf([[a.x1, a.y1], [a.x2, a.y2]]);
    case 'path': return boxOf(pathPoints(a.d));
    default: return null;
  }
}

// Bounds of the whole picture (outline + details) with a margin, clamped to
// the 0..100 drawing space: { x, y, width, height }.
export function pictureBounds(picture, margin = 3) {
  const boxes = [boxOf(picture.dots), ...(picture.details || []).map(partBounds).filter(Boolean)];
  const x = Math.max(0, Math.min(...boxes.map((b) => b.minX)) - margin);
  const y = Math.max(0, Math.min(...boxes.map((b) => b.minY)) - margin);
  const right = Math.min(100, Math.max(...boxes.map((b) => b.maxX)) + margin);
  const bottom = Math.min(100, Math.max(...boxes.map((b) => b.maxY)) + margin);
  return { x, y, width: right - x, height: bottom - y };
}
