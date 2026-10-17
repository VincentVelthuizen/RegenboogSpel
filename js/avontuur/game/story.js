import { PIP } from './stories/pip.js';
import { ROBO } from './stories/robo.js';
import { BRUNO } from './stories/bruno.js';
import { NOOR } from './stories/noor.js';

// Branching picture stories. Every node is one step of an adventure: first
// the child makes the node's `picture` (one of the cartoon drawings of the
// dots game, see dots/game/puzzles.js), then the node's `text` is read
// aloud, then the child picks one of the `choices` ({ label, next }). A node
// without choices is an ending.
//
// A story: { id, title, emoji, start (node id), activities, nodes }, and
// optionally `hero` (a picture id) who walks the parcours.
// `activities` is the order in which the activities take turns, one per
// step (see state.js). Parcours steps use the node's `course` (see
// parcours.js) and show its `task` as the instruction.
//
// `audio` (optional, per node): path to a recorded fragment of the text, for
// example 'audio/avontuur/pip/start.mp3' (the audio/ folder is copied into
// the build). When present, the story screen shows a play button.
//
// Line breaks (\n) in a text are kept, e.g. for the lines of a verse.
export const STORIES = [PIP, ROBO, BRUNO, NOOR].map((story) => ({
  ...story,
  nodes: Object.fromEntries(story.nodes.map((node) => [node.id, node])),
}));

export function getStory(id) {
  return STORIES.find((story) => story.id === id);
}

export function getNode(story, id) {
  return story.nodes[id];
}

export function isEnding(node) {
  return node.choices.length === 0;
}
