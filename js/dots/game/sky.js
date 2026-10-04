// Turns real sky positions (right ascension / declination, in degrees) into
// the board's 0..100 space, the way a star chart does: a gnomonic
// (tangent-plane) projection centred on the figure, north up and east to the
// LEFT (as you see it looking up), scaled uniformly so relative distances and
// angles between the stars are kept.
const D2R = Math.PI / 180;

export function projectStars(stars, margin = 8) {
  // Centre on the mean direction, so constellations near RA 0h don't wrap.
  let vx = 0;
  let vy = 0;
  let vz = 0;
  for (const { ra, dec } of stars) {
    const a = ra * D2R;
    const d = dec * D2R;
    vx += Math.cos(d) * Math.cos(a);
    vy += Math.cos(d) * Math.sin(a);
    vz += Math.sin(d);
  }
  const ra0 = Math.atan2(vy, vx);
  const dec0 = Math.asin(vz / Math.hypot(vx, vy, vz));

  const plane = stars.map(({ ra, dec }) => {
    const a = ra * D2R - ra0;
    const d = dec * D2R;
    const cosc = Math.sin(dec0) * Math.sin(d) + Math.cos(dec0) * Math.cos(d) * Math.cos(a);
    const xi = (Math.cos(d) * Math.sin(a)) / cosc;
    const eta = (Math.cos(dec0) * Math.sin(d) - Math.sin(dec0) * Math.cos(d) * Math.cos(a)) / cosc;
    return [-xi, -eta];
  });

  const xs = plane.map(([x]) => x);
  const ys = plane.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const scale = (100 - 2 * margin) / Math.max(maxX - minX, maxY - minY);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const r1 = (v) => Math.round(v * 10) / 10;

  return plane.map(([x, y]) => [r1(50 + (x - cx) * scale), r1(50 + (y - cy) * scale)]);
}

export function minSpacing(points) {
  let min = Infinity;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      min = Math.min(min, Math.hypot(points[i][0] - points[j][0], points[i][1] - points[j][1]));
    }
  }
  return min;
}
