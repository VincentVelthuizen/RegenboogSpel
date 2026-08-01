import { FACES } from './prompts.js';

export function createInitialState() {
  return {
    screen: 'ready', // 'ready' | 'result'
    faceId: null,
    prompt: null,
    usedByFace: {}, // { faceId: [used prompt indices] }
  };
}

// Picks a prompt index not yet used for this face; once every prompt in the
// face's pool has been seen, the pool resets so it can be reused.
function pickPromptIndex(poolSize, used, rng) {
  const allIndices = Array.from({ length: poolSize }, (_, i) => i);
  const remaining = allIndices.filter((i) => !used.includes(i));
  const pool = remaining.length > 0 ? remaining : allIndices;
  const resetting = remaining.length === 0;
  const index = pool[Math.floor(rng() * pool.length)];
  return { index, resetting };
}

export function roll(state, rng = Math.random) {
  const face = FACES[Math.floor(rng() * FACES.length)];
  const usedSoFar = state.usedByFace[face.id] || [];
  const { index, resetting } = pickPromptIndex(face.prompts.length, usedSoFar, rng);

  return {
    ...state,
    screen: 'result',
    faceId: face.id,
    prompt: face.prompts[index],
    usedByFace: {
      ...state.usedByFace,
      [face.id]: [...(resetting ? [] : usedSoFar), index],
    },
  };
}

export function restart(_state) {
  return createInitialState();
}
