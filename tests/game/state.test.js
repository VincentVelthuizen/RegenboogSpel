import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  recordCorrect,
  recordWrong,
  restart,
} from '../../js/game/state.js';

const RNG_ZERO = () => 0;

describe('createInitialState', () => {
  it('starts in playing phase with no colors filled', () => {
    const s = createInitialState(RNG_ZERO);
    expect(s.phase).toBe('playing');
    expect(s.filledColors).toEqual([]);
    expect(s.wrongCountThisChallenge).toBe(0);
    expect(s.tapsAreLocked).toBe(false);
    expect(s.currentColor).toBe('purple');
    expect(s.currentChoices).toHaveLength(3);
    expect(typeof s.correctIndex).toBe('number');
  });
});

describe('recordCorrect', () => {
  it('appends currentColor to filledColors and generates a new challenge', () => {
    const s0 = createInitialState(RNG_ZERO);
    const s1 = recordCorrect(s0, RNG_ZERO);
    expect(s1.filledColors).toEqual(['purple']);
    expect(s1.currentColor).toBe('blue');
    expect(s1.wrongCountThisChallenge).toBe(0);
    expect(s1.phase).toBe('playing');
  });

  it('transitions to celebrating after the 6th color', () => {
    let s = createInitialState(RNG_ZERO);
    for (let i = 0; i < 6; i++) {
      s = recordCorrect(s, RNG_ZERO);
    }
    expect(s.phase).toBe('celebrating');
    expect(s.filledColors).toEqual([
      'purple', 'blue', 'green', 'yellow', 'orange', 'red',
    ]);
  });

  it('resets wrongCountThisChallenge to 0', () => {
    let s = createInitialState(RNG_ZERO);
    s = recordWrong(s);
    s = recordWrong(s);
    expect(s.wrongCountThisChallenge).toBe(2);
    s = recordCorrect(s, RNG_ZERO);
    expect(s.wrongCountThisChallenge).toBe(0);
  });
});

describe('recordWrong', () => {
  it('increments wrongCountThisChallenge', () => {
    const s0 = createInitialState(RNG_ZERO);
    const s1 = recordWrong(s0);
    expect(s1.wrongCountThisChallenge).toBe(1);
    const s2 = recordWrong(s1);
    expect(s2.wrongCountThisChallenge).toBe(2);
  });

  it('does not change filledColors or currentColor', () => {
    const s0 = createInitialState(RNG_ZERO);
    const s1 = recordWrong(s0);
    expect(s1.filledColors).toEqual(s0.filledColors);
    expect(s1.currentColor).toBe(s0.currentColor);
    expect(s1.currentChoices).toEqual(s0.currentChoices);
  });
});

describe('restart', () => {
  it('returns to playing with no colors filled', () => {
    let s = createInitialState(RNG_ZERO);
    for (let i = 0; i < 6; i++) s = recordCorrect(s, RNG_ZERO);
    expect(s.phase).toBe('celebrating');

    const fresh = restart(s, RNG_ZERO);
    expect(fresh.phase).toBe('playing');
    expect(fresh.filledColors).toEqual([]);
    expect(fresh.currentColor).toBe('purple');
    expect(fresh.wrongCountThisChallenge).toBe(0);
  });
});
