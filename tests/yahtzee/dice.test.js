import { describe, it, expect } from 'vitest';
import {
  randomFace,
  createDice,
  rollDice,
  toggleHeld,
  setManualValue,
  diceValues,
  allDiceSet,
} from '../../js/yahtzee/game/dice.js';

describe('randomFace', () => {
  it('maps rng 0 to face 1 and rng just under 1 to face 6', () => {
    expect(randomFace(() => 0)).toBe(1);
    expect(randomFace(() => 0.999999)).toBe(6);
  });
});

describe('createDice', () => {
  it('creates the requested number of unheld, unset dice', () => {
    const dice = createDice(5);
    expect(dice).toHaveLength(5);
    dice.forEach((d) => {
      expect(d.value).toBeNull();
      expect(d.held).toBe(false);
    });
  });
});

describe('rollDice', () => {
  it('rolls every die when none are held', () => {
    const dice = createDice(5);
    const rolled = rollDice(dice, () => 0);
    expect(diceValues(rolled)).toEqual([1, 1, 1, 1, 1]);
  });

  it('keeps held dice at their current value', () => {
    let dice = createDice(3);
    dice = rollDice(dice, () => 0.5); // all become 4
    dice = toggleHeld(dice, 0);
    const rerolled = rollDice(dice, () => 0); // non-held become 1
    expect(diceValues(rerolled)).toEqual([4, 1, 1]);
  });
});

describe('toggleHeld', () => {
  it('flips held on the targeted die only', () => {
    const dice = createDice(3);
    const held = toggleHeld(dice, 1);
    expect(held.map((d) => d.held)).toEqual([false, true, false]);
    const unheld = toggleHeld(held, 1);
    expect(unheld[1].held).toBe(false);
  });
});

describe('setManualValue', () => {
  it('sets the value of the targeted die only', () => {
    const dice = createDice(3);
    const updated = setManualValue(dice, 2, 6);
    expect(diceValues(updated)).toEqual([null, null, 6]);
  });
});

describe('allDiceSet', () => {
  it('is false while any die is unset and true once all have a value', () => {
    let dice = createDice(2);
    expect(allDiceSet(dice)).toBe(false);
    dice = setManualValue(dice, 0, 3);
    expect(allDiceSet(dice)).toBe(false);
    dice = setManualValue(dice, 1, 5);
    expect(allDiceSet(dice)).toBe(true);
  });
});
