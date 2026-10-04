// Geometry helpers for building dot outlines in the 0..100 space.
const r1 = (v) => Math.round(v * 10) / 10;

// `n` points evenly spread along an elliptical arc, from `startDeg` to
// `endDeg` inclusive. Angles are in screen space (y down), so increasing the
// angle runs clockwise: 0 = right, 90 = down, 180 = left, 270 = up.
export function arc(cx, cy, rx, ry, startDeg, endDeg, n) {
  return Array.from({ length: n }, (_, i) => {
    const t = ((startDeg + ((endDeg - startDeg) * i) / (n - 1)) * Math.PI) / 180;
    return [r1(cx + rx * Math.cos(t)), r1(cy + ry * Math.sin(t))];
  });
}

// Build a symmetric closed loop from its left half.
// `half` runs from a top axis-point (x = axis) down to a bottom axis-point;
// the interior (everything between those two endpoints) is mirrored across
// x = axis and appended in reverse, so the on-axis points are never duplicated.
export function mirrorX(half, axis = 50) {
  const interior = half.slice(1, half.length - 1);
  const right = interior
    .slice()
    .reverse()
    .map(([x, y]) => [r1(2 * axis - x), y]);
  return [...half, ...right];
}
