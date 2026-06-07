// Geometry helper for building dot outlines in the 0..100 space.
const r1 = (v) => Math.round(v * 10) / 10;

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
