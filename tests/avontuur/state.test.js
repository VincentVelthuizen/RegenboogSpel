import { describe, it, expect } from 'vitest';
import {
  createAdventure, pickStory, finishActivity, choose, revisit, isFinished, colorsByPicture, activityFor, MAX_DOTS_IN_STORY,
} from '../../js/avontuur/game/state.js';
import { STORIES, getStory, getNode } from '../../js/avontuur/game/story.js';
import { getPuzzle } from '../../js/dots/game/puzzles.js';

const pic = (n) => ({ dots: Array.from({ length: n }, (_, i) => [i, i]) });

describe('adventure flow', () => {
  it('starts on the story picker', () => {
    expect(createAdventure()).toEqual({ phase: 'pick', storyId: null, nodeId: null, step: 0, path: [], made: [] });
  });

  it('ignores unknown stories', () => {
    const s = createAdventure();
    expect(pickStory(s, 'onbekend')).toBe(s);
  });

  it.each(STORIES.map((s) => [s.id]))('%s: pick → activity → story → (choice) → activity of the chosen node', (id) => {
    const story = getStory(id);
    let s = pickStory(createAdventure(), id);
    expect(s).toEqual({ phase: 'activity', storyId: id, nodeId: story.start, step: 0, path: [story.start], made: [] });
    s = finishActivity(s);
    expect(s.phase).toBe('story');
    expect(s.made).toEqual([null]);
    const next = getNode(story, story.start).choices[0].next;
    s = choose(s, next);
    expect(s).toEqual({ phase: 'activity', storyId: id, nodeId: next, step: 1, path: [story.start, next], made: [null] });
  });

  it('ignores choices that are not offered, or made outside the story phase', () => {
    const story = getStory('pip');
    const reading = finishActivity(pickStory(createAdventure(), 'pip'));
    expect(choose(reading, 'robot')).toBe(reading);
    const activity = pickStory(createAdventure(), 'pip');
    expect(choose(activity, getNode(story, story.start).choices[0].next)).toBe(activity);
  });

  it('only finishes an activity during the activity phase', () => {
    const picking = createAdventure();
    expect(finishActivity(picking)).toBe(picking);
  });
});

describe('going back to an earlier step', () => {
  // Bruno: start (beer, coloured) → tulp → bos.
  const coloured = { body: '#3498db', d5: '#f1c40f' };
  const atBos = () => {
    let s = finishActivity(pickStory(createAdventure(), 'bruno'), coloured);
    s = finishActivity(choose(s, 'tulp'));
    return finishActivity(choose(s, 'bos'));
  };

  it('remembers what was made at every step', () => {
    const s = atBos();
    expect(s.path).toEqual(['start', 'tulp', 'bos']);
    expect(s.made).toEqual([coloured, null, null]);
    expect([0, 1, 2, 3].map((i) => isFinished(s, i))).toEqual([true, true, true, false]);
  });

  it('can revisit a finished step, keeping the steps after it', () => {
    const s = revisit(atBos(), 1);
    expect(s).toMatchObject({ phase: 'story', step: 1, nodeId: 'tulp', path: ['start', 'tulp', 'bos'] });
    expect(s.made).toHaveLength(3);
    expect(revisit(s, 2)).toMatchObject({ step: 2, nodeId: 'bos' });
  });

  it('does not revisit steps that are not finished', () => {
    const s = choose(atBos(), 'taart');
    expect(revisit(s, 3)).toBe(s);
    expect(revisit(s, -1)).toBe(s);
  });

  it('choosing again replaces what came after', () => {
    const s = choose(revisit(atBos(), 1), 'brug');
    expect(s).toMatchObject({ phase: 'activity', step: 2, nodeId: 'brug', path: ['start', 'tulp', 'brug'] });
    expect(s.made).toEqual([coloured, null]);
  });

  it('knows the colours per picture, up to the current step', () => {
    expect(colorsByPicture(atBos())).toEqual({ beer: coloured });
    expect(colorsByPicture(pickStory(createAdventure(), 'bruno'))).toEqual({});
  });
});

describe('activityFor', () => {
  const story = { activities: ['color', 'slide', 'dots', 'puzzle'] };

  it("takes turns in the story's own order", () => {
    expect([0, 1, 2, 3, 4].map((step) => activityFor(story, step, pic(10))))
      .toEqual(['color', 'slide', 'dots', 'puzzle', 'color']);
  });

  it('turns pictures with many dots into a colouring page instead', () => {
    expect(activityFor(story, 2, pic(MAX_DOTS_IN_STORY))).toBe('dots');
    expect(activityFor(story, 2, pic(MAX_DOTS_IN_STORY + 1))).toBe('color');
  });

  it('gives Robo all four activities on every path', () => {
    const robo = getStory('robo');
    const paths = [];
    const walk = (id, path) => {
      const node = getNode(robo, id);
      if (node.choices.length === 0) paths.push([...path, id]);
      node.choices.forEach((c) => walk(c.next, [...path, id]));
    };
    walk(robo.start, []);
    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) {
      const types = path.map((id, step) => activityFor(robo, step, getPuzzle(getNode(robo, id).picture)));
      expect(new Set(types).size, path.join(' → ')).toBe(4);
    }
  });
});
