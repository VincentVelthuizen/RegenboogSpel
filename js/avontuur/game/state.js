import { getStory, getNode } from './story.js';

// What the child can do with a step's picture: connect the dots, colour it
// in, put it together as a jigsaw, solve it as a sliding puzzle, or walk the
// story's hero along a parcours to it. Each story sets the order in which
// they take turns.
export const ACTIVITIES = ['dots', 'color', 'puzzle', 'slide', 'parcours'];

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
// `path`: the node of every step so far; `made`: for every finished step,
// the colours the child used (or null when it wasn't a colouring page).
export function createAdventure() {
  return { phase: 'pick', storyId: null, nodeId: null, step: 0, path: [], made: [] };
}

export function pickStory(state, storyId) {
  const story = getStory(storyId);
  if (!story) return state;
  return { phase: 'activity', storyId, nodeId: story.start, step: 0, path: [story.start], made: [] };
}

export function finishActivity(state, colors = null) {
  if (state.phase !== 'activity') return state;
  const made = state.made.slice(0, state.step);
  made[state.step] = colors;
  return { ...state, phase: 'story', made };
}

// Picking a choice starts the next step. After going back to an earlier
// step, this replaces whatever came after it.
export function choose(state, nextId) {
  if (state.phase !== 'story') return state;
  const node = getNode(getStory(state.storyId), state.nodeId);
  if (!node.choices.some((c) => c.next === nextId)) return state;
  const step = state.step + 1;
  return {
    ...state,
    phase: 'activity',
    nodeId: nextId,
    step,
    path: [...state.path.slice(0, step), nextId],
    made: state.made.slice(0, step),
  };
}

// Back (or forward) to the story of a finished step, e.g. to choose again.
export function revisit(state, step) {
  if (!isFinished(state, step)) return state;
  return { ...state, phase: 'story', step, nodeId: state.path[step] };
}

export function isFinished(state, step) {
  return Number.isInteger(step) && step >= 0 && step < state.made.length && step < state.path.length;
}

// The colours the child gave each picture, up to and including the current
// step: { pictureId: { region: colour } }.
export function colorsByPicture(state) {
  const story = getStory(state.storyId);
  const out = {};
  state.made.slice(0, state.step + 1).forEach((colors, i) => {
    if (colors) out[getNode(story, state.path[i]).picture] = colors;
  });
  return out;
}
