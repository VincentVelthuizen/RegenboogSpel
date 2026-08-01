import { describe, it, expect } from 'vitest';
import { createInitialState, roll, restart } from '../../js/jumbolino/game/state.js';
import { FACES } from '../../js/jumbolino/game/prompts.js';

function seededRng(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

describe('createInitialState', () => {
  it('starts on the ready screen with no face or prompt', () => {
    const s = createInitialState();
    expect(s.screen).toBe('ready');
    expect(s.faceId).toBeNull();
    expect(s.prompt).toBeNull();
    expect(s.usedByFace).toEqual({});
  });
});

describe('roll', () => {
  it('picks a valid face and one of its prompts', () => {
    const s = roll(createInitialState(), seededRng(1));
    expect(s.screen).toBe('result');
    const face = FACES.find((f) => f.id === s.faceId);
    expect(face).toBeDefined();
    expect(face.prompts).toContain(s.prompt);
  });

  it('tracks the used prompt index for that face', () => {
    const s = roll(createInitialState(), seededRng(2));
    const face = FACES.find((f) => f.id === s.faceId);
    const promptIndex = face.prompts.indexOf(s.prompt);
    expect(s.usedByFace[face.id]).toContain(promptIndex);
  });

  it('does not repeat a prompt for the same face until the whole pool is used', () => {
    // Force the rng to always land on the same face by biasing toward index 0,
    // then roll enough times to cycle through its whole prompt pool.
    const faceRng = () => 0; // always picks FACES[0]
    const face = FACES[0];
    const seenPrompts = new Set();
    let s = createInitialState();

    for (let i = 0; i < face.prompts.length; i++) {
      // Use an rng that always selects face 0 and walks the remaining pool in order.
      const rng = (() => {
        let call = 0;
        return () => {
          call += 1;
          return call === 1 ? 0 : (i) / face.prompts.length;
        };
      })();
      s = roll(s, rng);
      expect(seenPrompts.has(s.prompt)).toBe(false);
      seenPrompts.add(s.prompt);
    }

    expect(seenPrompts.size).toBe(face.prompts.length);
  });

  it('resets the pool once every prompt for a face has been used', () => {
    let state = createInitialState();
    state = { ...state, usedByFace: { [FACES[0].id]: FACES[0].prompts.map((_, i) => i) } };

    const rng = (() => {
      let call = 0;
      return () => {
        call += 1;
        return call === 1 ? 0 : 0; // pick face 0, then index 0 of the reset pool
      };
    })();

    const s = roll(state, rng);
    expect(s.usedByFace[FACES[0].id]).toEqual([0]);
  });
});

describe('restart', () => {
  it('returns to a fresh ready state', () => {
    const rolled = roll(createInitialState(), seededRng(3));
    const s = restart(rolled);
    expect(s).toEqual(createInitialState());
  });
});
