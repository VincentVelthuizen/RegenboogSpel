import { getStory, getNode } from './story.js';

// What the child can do with a step's picture: connect the dots, colour it
// in, put it together as a jigsaw, or solve it as a sliding puzzle. Each
// story sets the order in which they take turns.
export const ACTIVITIES = ['dots', 'color', 'puzzle', 'slide'];

// Pictures with more dots than this are too long a detour in a story; they
// become a colouring page instead.
export const MAX_DOTS_IN_STORY = 25;

export function activityFor(story, step, picture) {
  const type = story.activities[step % story.activities.length];
  if (type === 'dots' && picture.dots.length > MAX_DOTS_IN_STORY) return 'color';
  return type;
}

// phase: 'pick' (choose a story) → 'activity' (make the picture) → 'story'
// (read the text, pick a choice) → 'activity' of the chosen node → ...
export function createAdventure() {
  return { phase: 'pick', storyId: null, nodeId: null, step: 0, path: [] };
}

export function pickStory(state, storyId) {
  const story = getStory(storyId);
  if (!story) return state;
  return { phase: 'activity', storyId, nodeId: story.start, step: 0, path: [story.start] };
}

export function finishActivity(state) {
  if (state.phase !== 'activity') return state;
  return { ...state, phase: 'story' };
}

export function choose(state, nextId) {
  if (state.phase !== 'story') return state;
  const node = getNode(getStory(state.storyId), state.nodeId);
  if (!node.choices.some((c) => c.next === nextId)) return state;
  return {
    ...state,
    phase: 'activity',
    nodeId: nextId,
    step: state.step + 1,
    path: [...state.path, nextId],
  };
}
