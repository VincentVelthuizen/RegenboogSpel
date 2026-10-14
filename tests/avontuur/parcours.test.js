import { describe, it, expect } from 'vitest';
import {
  COURSES, CHECKPOINTS, PATH_HALF_WIDTH, TOLERANCE,
  smoothPath, buildCourse, pointAt, project, distanceToPath, startProgress, advance,
} from '../../js/avontuur/game/parcours.js';
import { STORIES, getNode } from '../../js/avontuur/game/story.js';
import { activityFor } from '../../js/avontuur/game/state.js';
import { getPuzzle } from '../../js/dots/game/puzzles.js';

const straight = buildCourse({ theme: 'wei', points: [[10, 50], [90, 50]] });

describe('parcours path', () => {
  it('passes through every control point', () => {
    const pts = [[0, 0], [10, 20], [30, 10]];
    const path = smoothPath(pts, 5);
    for (const p of pts) expect(path).toContainEqual(p);
  });

  it('measures length and finds points along it', () => {
    expect(straight.length).toBeCloseTo(80);
    expect(pointAt(straight, 40)).toEqual([50, 50]);
    expect(pointAt(straight, -5)).toEqual([10, 50]);
    expect(pointAt(straight, 500)).toEqual([90, 50]);
    expect(straight.flags.map((f) => f / straight.length)).toEqual(CHECKPOINTS);
  });

  it('projects a point onto the path, within a window', () => {
    expect(project(straight, [30, 55])).toEqual({ s: 20, dist: 5 });
    const limited = project(straight, [80, 50], 0, 30);
    expect(limited.s).toBe(30);
    expect(limited.dist).toBeCloseTo(40);
  });
});

describe('dragging the hero', () => {
  it('moves forward along the path, and reaches the goal', () => {
    let progress = startProgress();
    for (let x = 12; x <= 90; x += 6) progress = advance(straight, progress, [x, 52]).progress;
    progress = advance(straight, progress, [90, 50]).progress;
    expect(progress.done).toBe(true);
    expect(progress.s).toBe(straight.length);
  });

  it('remembers the flags passed', () => {
    let progress = startProgress();
    for (let x = 12; x <= 70; x += 6) progress = advance(straight, progress, [x, 50]).progress;
    expect(progress.checkpoint).toBeCloseTo(straight.flags[1]);
  });

  it('sends the hero back to the last flag when the finger leaves the path', () => {
    let progress = startProgress();
    for (let x = 12; x <= 50; x += 6) progress = advance(straight, progress, [x, 50]).progress;
    const result = advance(straight, progress, [50, 50 + TOLERANCE + 1]);
    expect(result.fell).toBe(true);
    expect(result.progress.s).toBeCloseTo(straight.flags[0]);
    expect(result.progress.done).toBe(false);
  });

  it('does not let the finger jump far ahead', () => {
    const result = advance(straight, startProgress(), [85, 50]);
    expect(result.fell).toBe(true);
    expect(result.progress.s).toBe(0);
  });
});

describe.each(Object.entries(COURSES))('course %s', (_, spec) => {
  const course = buildCourse(spec);

  it('stays inside the board', () => {
    for (const [x, y] of course.path) {
      expect(x).toBeGreaterThanOrEqual(PATH_HALF_WIDTH);
      expect(x).toBeLessThanOrEqual(100 - PATH_HALF_WIDTH);
      expect(y).toBeGreaterThanOrEqual(PATH_HALF_WIDTH);
      expect(y).toBeLessThanOrEqual(100 - PATH_HALF_WIDTH);
    }
  });

  it('runs from the bottom to the top', () => {
    expect(course.path[0][1]).toBeGreaterThan(80);
    expect(course.path[course.path.length - 1][1]).toBeLessThan(25);
  });

  it('never crosses itself closely (no shortcuts between bends)', () => {
    // Points far apart along the path must also be apart on the board.
    const { path, lengths } = course;
    for (let i = 0; i < path.length; i++) {
      for (let j = i + 1; j < path.length; j++) {
        if (lengths[j] - lengths[i] < 30) continue;
        const d = Math.hypot(path[i][0] - path[j][0], path[i][1] - path[j][1]);
        expect(d, `${i} ${j}`).toBeGreaterThan(2 * TOLERANCE);
      }
    }
  });

  it('has obstacles beside the path, not on it', () => {
    expect(course.obstacles.length).toBeGreaterThan(6);
    for (const o of course.obstacles) {
      expect(distanceToPath(course, [o.x, o.y])).toBeGreaterThan(PATH_HALF_WIDTH + o.size);
    }
  });
});

describe('stories with a parcours', () => {
  it('name a hero, and a known course and task for every parcours step', () => {
    const withParcours = STORIES.filter((s) => s.activities.includes('parcours'));
    expect(withParcours.length).toBeGreaterThan(0);
    for (const story of withParcours) {
      expect(getPuzzle(story.hero), story.id).toBeDefined();
      const walk = (id, step) => {
        const node = getNode(story, id);
        if (activityFor(story, step, getPuzzle(node.picture)) === 'parcours') {
          expect(COURSES[node.course], `${story.id}/${id}`).toBeDefined();
          expect(node.task, `${story.id}/${id}`).toBeTruthy();
        }
        node.choices.forEach((c) => walk(c.next, step + 1));
      };
      walk(story.start, 0);
    }
  });
});
