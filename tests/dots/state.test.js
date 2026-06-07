import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  selectLevel,
  selectPuzzle,
  recordDotTap,
  backToPicker,
  backToLevels,
} from '../../js/dots/game/state.js';

describe('createInitialState', () => {
  it('starts on the level-select screen', () => {
    const s = createInitialState();
    expect(s.screen).toBe('levels');
    expect(s.level).toBeNull();
    expect(s.puzzleId).toBeNull();
    expect(s.nextDotIndex).toBe(0);
    expect(s.tapsAreLocked).toBe(false);
  });
});

describe('selectLevel', () => {
  it('moves to the picker for the chosen level', () => {
    const s1 = selectLevel(createInitialState(), 3);
    expect(s1.screen).toBe('picking');
    expect(s1.level).toBe(3);
    expect(s1.puzzleId).toBeNull();
  });
});

describe('selectPuzzle', () => {
  it('sets screen to playing and stores puzzleId', () => {
    const s1 = selectPuzzle(selectLevel(createInitialState(), 1), 'ster');
    expect(s1.screen).toBe('playing');
    expect(s1.puzzleId).toBe('ster');
  });

  it('keeps the current level while playing', () => {
    const s1 = selectPuzzle(selectLevel(createInitialState(), 2), 'auto');
    expect(s1.level).toBe(2);
  });

  it('resets nextDotIndex and tapsAreLocked', () => {
    const s0 = { screen: 'playing', level: 1, puzzleId: 'hart', nextDotIndex: 5, tapsAreLocked: true };
    const s1 = selectPuzzle(s0, 'huis');
    expect(s1.nextDotIndex).toBe(0);
    expect(s1.tapsAreLocked).toBe(false);
  });
});

describe('recordDotTap', () => {
  it('advances nextDotIndex when index matches', () => {
    const s0 = { screen: 'playing', level: 1, puzzleId: 'ster', nextDotIndex: 0, tapsAreLocked: false };
    const s1 = recordDotTap(s0, 0, 10);
    expect(s1.nextDotIndex).toBe(1);
    expect(s1.screen).toBe('playing');
  });

  it('is a no-op when index does not match nextDotIndex', () => {
    const s0 = { screen: 'playing', level: 1, puzzleId: 'ster', nextDotIndex: 0, tapsAreLocked: false };
    const s1 = recordDotTap(s0, 3, 10);
    expect(s1).toBe(s0);
  });

  it('sets screen to celebrating when the last dot is tapped', () => {
    const s0 = { screen: 'playing', level: 1, puzzleId: 'huis', nextDotIndex: 4, tapsAreLocked: false };
    const s1 = recordDotTap(s0, 4, 5);
    expect(s1.nextDotIndex).toBe(5);
    expect(s1.screen).toBe('celebrating');
  });

  it('returns a new object on a valid tap (immutability)', () => {
    const s0 = { screen: 'playing', level: 1, puzzleId: 'boom', nextDotIndex: 2, tapsAreLocked: false };
    const s1 = recordDotTap(s0, 2, 7);
    expect(s1).not.toBe(s0);
    expect(s0.nextDotIndex).toBe(2);
  });
});

describe('backToPicker', () => {
  it('returns to the picker keeping the level', () => {
    const s0 = { screen: 'celebrating', level: 2, puzzleId: 'auto', nextDotIndex: 16, tapsAreLocked: false };
    const s1 = backToPicker(s0);
    expect(s1.screen).toBe('picking');
    expect(s1.level).toBe(2);
    expect(s1.puzzleId).toBeNull();
    expect(s1.nextDotIndex).toBe(0);
  });
});

describe('backToLevels', () => {
  it('returns to the level-select screen', () => {
    const s0 = { screen: 'picking', level: 4, puzzleId: null, nextDotIndex: 0, tapsAreLocked: false };
    const s1 = backToLevels(s0);
    expect(s1.screen).toBe('levels');
    expect(s1.level).toBeNull();
  });
});
