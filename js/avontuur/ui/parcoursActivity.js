import { COURSES, buildCourse, pointAt, startProgress, advance } from '../game/parcours.js';
import { pictureBounds } from '../game/geometry.js';
import { drawPicture, svgElement } from '../../dots/ui/picture.js';

const HERO_SIZE = 17;
const GOAL_SIZE = 22;
// How close to the hero a finger must land to pick it up.
const GRAB_RADIUS = 15;

const GROUND = { wei: '#d9f99d', bos: '#bbf7d0', bijen: '#fef9c3' };

// Decorations beside the path, drawn around (0, 0) at scale `size`.
const DRAW = {
  bloem: (g, r) => {
    const colors = ['#f472b6', '#facc15', '#a78bfa', '#fb923c'];
    const petal = colors[Math.floor(r * 7) % colors.length];
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      g.appendChild(svgElement('circle', { cx: Math.cos(a) * 1.6, cy: Math.sin(a) * 1.6, r: 1.3, fill: petal }));
    }
    g.appendChild(svgElement('circle', { cx: 0, cy: 0, r: 1, fill: '#fde047' }));
  },
  plas: (g) => {
    g.appendChild(svgElement('ellipse', { cx: 0, cy: 0, rx: 5, ry: 2.8, fill: '#7dd3fc' }));
    g.appendChild(svgElement('ellipse', { cx: -1.5, cy: -0.8, rx: 1.8, ry: 0.7, fill: '#e0f2fe' }));
  },
  steen: (g) => {
    g.appendChild(svgElement('ellipse', { cx: 0, cy: 0, rx: 3.5, ry: 2.6, fill: '#a8a29e', stroke: '#78716c', 'stroke-width': 0.6 }));
    g.appendChild(svgElement('ellipse', { cx: -1, cy: -0.9, rx: 1.2, ry: 0.6, fill: '#d6d3d1' }));
  },
  struik: (g) => {
    [[-2, 0.5, 2.6], [2, 0.5, 2.6], [0, -1.4, 2.9]].forEach(([cx, cy, r]) => g.appendChild(svgElement('circle', { cx, cy, r, fill: '#4ade80', stroke: '#16a34a', 'stroke-width': 0.6 })));
  },
  boom: (g) => {
    g.appendChild(svgElement('rect', { x: -1.2, y: 1, width: 2.4, height: 5, fill: '#92400e' }));
    g.appendChild(svgElement('circle', { cx: 0, cy: -1.5, r: 4.5, fill: '#22c55e', stroke: '#15803d', 'stroke-width': 0.7 }));
    g.appendChild(svgElement('circle', { cx: -1.6, cy: -3, r: 1.2, fill: '#86efac' }));
  },
  paddenstoel: (g) => {
    g.appendChild(svgElement('rect', { x: -1, y: 0, width: 2, height: 3, fill: '#fef3c7', rx: 0.6 }));
    g.appendChild(svgElement('path', { d: 'M-3.5,0.5 Q-3.5,-3.5 0,-3.5 Q3.5,-3.5 3.5,0.5 Z', fill: '#ef4444' }));
    g.appendChild(svgElement('circle', { cx: -1.4, cy: -1.6, r: 0.6, fill: '#fff' }));
    g.appendChild(svgElement('circle', { cx: 1.2, cy: -2.2, r: 0.5, fill: '#fff' }));
  },
};

// A drawing (cartoon picture) as a nested <svg> of `size`, centred on (0, 0),
// optionally in the colours the child gave it.
function pictureAt(picture, size, colors = null) {
  const box = pictureBounds(picture);
  const svg = svgElement('svg', {
    x: -size / 2, y: -size / 2, width: size, height: size,
    viewBox: `${box.x} ${box.y} ${box.width} ${box.height}`, preserveAspectRatio: 'xMidYMid meet',
  });
  drawPicture(svg, picture, colors, { page: false });
  return svg;
}

function polyline(points, attrs) {
  return svgElement('polyline', { points: points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' '), fill: 'none', ...attrs });
}

// Parcours: drag the hero along the winding path to the goal (the step's
// picture). Off the path, the hero hops back to the last flag passed.
// Returns a cleanup function.
export function startParcoursActivity(container, picture, onDone, { hero, heroColors = null, course: courseId } = {}) {
  const spec = COURSES[courseId] || COURSES.wei;
  const course = buildCourse(spec);
  let progress = startProgress();
  let dragging = false;

  const board = svgElement('svg', { viewBox: '0 0 100 100', preserveAspectRatio: 'xMidYMid meet' });
  board.classList.add('activity-board', 'parcours-board');
  container.appendChild(board);

  board.appendChild(svgElement('rect', { x: 0, y: 0, width: 100, height: 100, rx: 4, fill: GROUND[spec.theme] || GROUND.wei }));
  course.obstacles.forEach(({ kind, x, y }, i) => {
    const g = svgElement('g', { transform: `translate(${x} ${y})` });
    DRAW[kind](g, (i * 0.37) % 1);
    board.appendChild(g);
  });

  board.appendChild(polyline(course.path, { stroke: '#c9a27a', 'stroke-width': 12.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  board.appendChild(polyline(course.path, { stroke: '#f1dcb8', 'stroke-width': 10.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
  board.appendChild(polyline(course.path, { stroke: '#fff', 'stroke-width': 0.8, 'stroke-dasharray': '2 2.5', opacity: 0.8 }));

  const trail = polyline([course.path[0]], { stroke: '#f59e0b', 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': '0.1 3.2' });
  board.appendChild(trail);

  const flags = course.flags.map((s) => {
    const [x, y] = pointAt(course, s);
    const g = svgElement('g', { transform: `translate(${x + 4.5} ${y - 1})` });
    g.appendChild(svgElement('line', { x1: 0, y1: 3, x2: 0, y2: -6, stroke: '#57534e', 'stroke-width': 0.8 }));
    const cloth = svgElement('path', { d: 'M0,-6 L5,-4.3 L0,-2.6 Z' });
    cloth.classList.add('parcours-flag');
    g.appendChild(cloth);
    board.appendChild(g);
    return { s, cloth };
  });

  const [sx, sy] = course.path[0];
  board.appendChild(svgElement('circle', { cx: sx, cy: sy, r: 4.2, fill: '#fff', stroke: '#c9a27a', 'stroke-width': 1 }));
  const [gx, gy] = course.path[course.path.length - 1];
  const goal = svgElement('g', { transform: `translate(${gx} ${gy})` });
  goal.classList.add('parcours-goal');
  goal.appendChild(svgElement('circle', { cx: 0, cy: 0, r: GOAL_SIZE / 2 + 1, fill: '#fff', opacity: 0.85 }));
  goal.appendChild(pictureAt(picture, GOAL_SIZE));
  board.appendChild(goal);

  const heroEl = svgElement('g');
  heroEl.classList.add('parcours-hero');
  const ring = svgElement('circle', { cx: 0, cy: 0, r: HERO_SIZE / 2 + 1.5 });
  ring.classList.add('parcours-ring');
  heroEl.appendChild(ring);
  if (hero) heroEl.appendChild(pictureAt(hero, HERO_SIZE, heroColors));
  board.appendChild(heroEl);

  function render() {
    const [x, y] = pointAt(course, progress.s);
    heroEl.style.transform = `translate(${x}px, ${y}px)`;
    const upTo = course.path.filter((_, i) => course.lengths[i] <= progress.s);
    trail.setAttribute('points', [...upTo, [x, y]].map(([px, py]) => `${px.toFixed(2)},${py.toFixed(2)}`).join(' '));
    flags.forEach(({ s, cloth }) => cloth.classList.toggle('passed', progress.checkpoint >= s));
    heroEl.classList.toggle('dragging', dragging);
  }

  function toBoard(e) {
    const pt = board.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(board.getScreenCTM().inverse());
    return [p.x, p.y];
  }

  board.addEventListener('pointerdown', (e) => {
    if (progress.done) return;
    const p = toBoard(e);
    const [hx, hy] = pointAt(course, progress.s);
    if (Math.hypot(p[0] - hx, p[1] - hy) > GRAB_RADIUS) return;
    e.preventDefault();
    board.setPointerCapture(e.pointerId);
    dragging = true;
    heroEl.classList.remove('hop-back');
    render();
  });

  board.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const result = advance(course, progress, toBoard(e));
    progress = result.progress;
    if (result.fell) {
      dragging = false;
      heroEl.classList.add('hop-back');
      board.classList.remove('oops');
      void board.getBoundingClientRect(); // restart the animation
      board.classList.add('oops');
    }
    render();
    if (progress.done) {
      dragging = false;
      render();
      goal.classList.add('reached');
      onDone(null);
    }
  });

  const release = () => {
    dragging = false;
    render();
  };
  board.addEventListener('pointerup', release);
  board.addEventListener('pointercancel', release);

  render();
}
