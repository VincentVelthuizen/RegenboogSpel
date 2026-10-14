import { PIP } from './stories/pip.js';
import { ROBO } from './stories/robo.js';

// Branching picture stories. Every node is one step of an adventure: first
// the child makes the node's `picture` (one of the cartoon drawings of the
// dots game, see dots/game/puzzles.js), then the node's `text` is read
// aloud, then the child picks one of the `choices` ({ label, next }). A node
// without choices is an ending.
//
// A story: { id, title, emoji, start (node id), activities, nodes }.
// `activities` is the order in which the activities take turns, one per
// step (see state.js).
//
// `audio` (optional, per node): path to a recorded fragment of the text, for
// example 'audio/avontuur/pip/start.mp3' (the audio/ folder is copied into
// the build). When present, the story screen shows a play button.
export const STORIES = [PIP, ROBO].map((story) => ({
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
