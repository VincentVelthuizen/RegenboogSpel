// Parcours model: a winding path through a landscape, from a start (bottom)
// to a goal (top). The child drags the hero along it; leaving the path sends
// the hero back to the last flag passed. All in the 0..100 drawing space.

// Half the drawn path width, and how far from the middle of the path a
// finger may stray before the hero "falls off".
export const PATH_HALF_WIDTH = 5.5;
export const TOLERANCE = 9;
// While dragging, the hero can slide back a little or forward this far
// along the path per move; a finger further ahead than that has left it.
const LOOK_BEHIND = 8;
const LOOK_AHEAD = 20;
// The goal counts as reached this close to the end.
const FINISH_MARGIN = 1.5;
// Flags at these fractions of the path.
export const CHECKPOINTS = [1 / 3, 2 / 3];

// The courses: control points of the path, and the kind of landscape (which
// obstacles line it).
export const COURSES = {
  wei: {
    theme: 'wei',
    points: [[10, 90], [32, 82], [42, 64], [24, 50], [28, 32], [52, 26], [68, 42], [84, 34], [86, 16]],
  },
  bos: {
    theme: 'bos',
    points: [[12, 90], [48, 86], [80, 76], [72, 58], [38, 58], [18, 42], [30, 24], [58, 22], [84, 16]],
  },
  bijen: {
    theme: 'bijen',
    points: [[10, 90], [44, 88], [80, 82], [84, 66], [52, 62], [18, 58], [16, 40], [48, 34], [80, 34], [84, 16]],
  },
};

const OBSTACLES = {
  wei: ['bloem', 'bloem', 'plas', 'steen', 'struik', 'bloem'],
  bos: ['boom', 'boom', 'struik', 'steen', 'paddenstoel', 'boom'],
  bijen: ['bloem', 'struik', 'bloem', 'steen', 'bloem', 'plas'],
};

const SIZE = { bloem: 3, plas: 5, steen: 3.5, struik: 4.5, boom: 6, paddenstoel: 3.5 };

// Catmull-Rom spline through the control points, as a dense polyline.
export function smoothPath(points, samples = 10) {
  const out = [points[0]];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    for (let k = 1; k <= samples; k++) {
      const t = k / samples;
      const t2 = t * t;
      const t3 = t2 * t;
      const at = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([at(p0[0], p1[0], p2[0], p3[0]), at(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  return out;
}

// A course ready to play: polyline, cumulative lengths, total length,
// flag positions (as distances along the path) and obstacles.
export function buildCourse(course) {
  const path = smoothPath(course.points);
  const lengths = [0];
  for (let i = 1; i < path.length; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]));
  }
  const length = lengths[lengths.length - 1];
  const built = { path, lengths, length, flags: CHECKPOINTS.map((f) => f * length) };
  return { ...built, obstacles: scatterObstacles(built, course.theme) };
}

// The point at distance `s` along the path.
export function pointAt(course, s) {
  const { path, lengths } = course;
  const d = Math.max(0, Math.min(course.length, s));
  let i = 1;
  while (i < lengths.length - 1 && lengths[i] < d) i++;
  const seg = lengths[i] - lengths[i - 1] || 1;
  const t = (d - lengths[i - 1]) / seg;
  return [path[i - 1][0] + (path[i][0] - path[i - 1][0]) * t, path[i - 1][1] + (path[i][1] - path[i - 1][1]) * t];
}

// The point of the path nearest to `p`, looking only between distances
// `from` and `to` along it: { s, dist }.
export function project(course, p, from = 0, to = course.length) {
  const { path, lengths } = course;
  let best = { s: from, dist: Infinity };
  for (let i = 1; i < path.length; i++) {
    if (lengths[i] < from || lengths[i - 1] > to) continue;
    const [ax, ay] = path[i - 1];
    const [bx, by] = path[i];
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy || 1;
    let t = ((p[0] - ax) * dx + (p[1] - ay) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    const s = Math.max(from, Math.min(to, lengths[i - 1] + t * (lengths[i] - lengths[i - 1])));
    const [qx, qy] = pointAt(course, s);
    const dist = Math.hypot(p[0] - qx, p[1] - qy);
    if (dist < best.dist) best = { s, dist };
  }
  return best;
}

export function distanceToPath(course, p) {
  return project(course, p).dist;
}

// Progress: { s (distance along the path), checkpoint (s of the last flag
// passed, or 0), done }.
export function startProgress() {
  return { s: 0, checkpoint: 0, done: false };
}

// The finger moved to `p` while dragging the hero. Returns the new progress
// and whether the hero fell off the path.
export function advance(course, progress, p) {
  if (progress.done) return { progress, fell: false };
  const { s, dist } = project(course, p, progress.s - LOOK_BEHIND, progress.s + LOOK_AHEAD);
  if (dist > TOLERANCE) {
    return { progress: { ...progress, s: progress.checkpoint }, fell: true };
  }
  const checkpoint = Math.max(progress.checkpoint, ...course.flags.filter((f) => f <= s));
  const done = s >= course.length - FINISH_MARGIN;
  return { progress: { s: done ? course.length : s, checkpoint, done }, fell: false };
}

// Small deterministic random generator, so a course always looks the same.
function seeded(seed) {
  let x = seed;
  return () => {
    x = (x * 16807) % 2147483647;
    return x / 2147483647;
  };
}

// Obstacles beside the path: tried on a jittered grid, kept only where they
// stay clear of the path, the start and the goal.
export function scatterObstacles(course, theme) {
  const kinds = OBSTACLES[theme] || OBSTACLES.wei;
  const random = seeded([...theme].reduce((sum, c) => sum * 31 + c.charCodeAt(0), 7) % 2147483646 + 1);
  const start = course.path[0];
  const goal = course.path[course.path.length - 1];
  const out = [];
  for (let gy = 8; gy <= 94; gy += 13) {
    for (let gx = 7; gx <= 94; gx += 13) {
      const kind = kinds[Math.floor(random() * kinds.length)];
      const size = SIZE[kind];
      const x = gx + (random() - 0.5) * 7;
      const y = gy + (random() - 0.5) * 7;
      if (x < size || x > 100 - size || y < size || y > 100 - size) continue;
      if (distanceToPath(course, [x, y]) < PATH_HALF_WIDTH + size + 2) continue;
      if (Math.hypot(x - start[0], y - start[1]) < 14 || Math.hypot(x - goal[0], y - goal[1]) < 16) continue;
      out.push({ kind, x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10, size });
    }
  }
  return out;
}
