import { describe, it, expect } from 'vitest';
import {
  createAdventure, beginAdventure, finishActivity, choose, activityFor, MAX_DOTS_IN_STORY,
} from '../../js/avontuur/game/state.js';
import { START_NODE, getNode } from '../../js/avontuur/game/story.js';

const pic = (n) => ({ dots: Array.from({ length: n }, (_, i) => [i, i]) });

describe('adventure flow', () => {
  it('starts on the intro of the start node', () => {
    expect(createAdventure()).toEqual({ phase: 'intro', nodeId: START_NODE, step: 0, path: [START_NODE] });
  });

  it('goes intro → activity → story → (choice) → activity of the chosen node', () => {
    let s = beginAdventure(createAdventure());
    expect(s.phase).toBe('activity');
    s = finishActivity(s);
    expect(s.phase).toBe('story');
    const next = getNode(START_NODE).choices[0].next;
    s = choose(s, next);
    expect(s).toEqual({ phase: 'activity', nodeId: next, step: 1, path: [START_NODE, next] });
  });

  it('ignores choices that are not offered, or made outside the story phase', () => {
    const story = finishActivity(beginAdventure(createAdventure()));
    expect(choose(story, 'robot')).toBe(story);
    const activity = beginAdventure(createAdventure());
    expect(choose(activity, getNode(START_NODE).choices[0].next)).toBe(activity);
  });

  it('only finishes an activity during the activity phase', () => {
    const intro = createAdventure();
    expect(finishActivity(intro)).toBe(intro);
  });
});

describe('activityFor', () => {
  it('takes turns: dots, colouring, jigsaw', () => {
    expect([0, 1, 2, 3, 4, 5].map((step) => activityFor(step, pic(10))))
      .toEqual(['dots', 'color', 'puzzle', 'dots', 'color', 'puzzle']);
  });

  it('turns pictures with many dots into a colouring page instead', () => {
    expect(activityFor(0, pic(MAX_DOTS_IN_STORY))).toBe('dots');
    expect(activityFor(0, pic(MAX_DOTS_IN_STORY + 1))).toBe('color');
  });
});
