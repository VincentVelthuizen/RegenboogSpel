import { START_NODE, getNode } from './story.js';

// What the child does with each step's picture, in turn: connect the dots,
// colour it in, or put it together as a jigsaw.
export const ACTIVITIES = ['dots', 'color', 'puzzle'];

// Pictures with more dots than this are too long a detour in a story; they
// become a colouring page instead.
export const MAX_DOTS_IN_STORY = 25;

export function activityFor(step, picture) {
  const type = ACTIVITIES[step % ACTIVITIES.length];
  if (type === 'dots' && picture.dots.length > MAX_DOTS_IN_STORY) return 'color';
  return type;
}

// phase: 'intro' (title screen) → 'activity' (make the picture) → 'story'
// (read the text, pick a choice) → 'activity' of the chosen node → ...
export function createAdventure() {
  return { phase: 'intro', nodeId: START_NODE, step: 0, path: [START_NODE] };
}

export function beginAdventure(state) {
  if (state.phase !== 'intro') return state;
  return { ...state, phase: 'activity' };
}

export function finishActivity(state) {
  if (state.phase !== 'activity') return state;
  return { ...state, phase: 'story' };
}

export function choose(state, nextId) {
  if (state.phase !== 'story') return state;
  const node = getNode(state.nodeId);
  if (!node.choices.some((c) => c.next === nextId)) return state;
  return {
    phase: 'activity',
    nodeId: nextId,
    step: state.step + 1,
    path: [...state.path, nextId],
  };
}
