import { describe, it, expect } from 'vitest';
import { pickOne, shuffle } from '../../js/game/random.js';

describe('pickOne', () => {
  it('returns an element from the array', () => {
    const arr = ['a', 'b', 'c'];
    const result = pickOne(arr);
    expect(arr).toContain(result);
  });

  it('uses the injected rng to pick deterministically', () => {
    const arr = ['a', 'b', 'c'];
    const rng = () => 0;
    expect(pickOne(arr, rng)).toBe('a');
    const rng2 = () => 0.99;
    expect(pickOne(arr, rng2)).toBe('c');
  });
});

describe('shuffle', () => {
  it('returns a new array with the same elements', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle(arr);
    expect(result).not.toBe(arr);
    expect(result.slice().sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('is deterministic with a fixed rng', () => {
    const rng = () => 0;
    const result = shuffle([1, 2, 3], rng);
    // rng=0 always picks index 0 to swap into current last position: [2,3,1]
    expect(result).toEqual([2, 3, 1]);
  });
});
