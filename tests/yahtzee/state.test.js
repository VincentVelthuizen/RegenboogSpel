import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  chooseVariant,
  startGame,
  rollDice,
  toggleHold,
  setManualDie,
  canScore,
  openCategories,
  previewScore,
  chooseCategory,
  currentPlayer,
  restart,
} from '../../js/yahtzee/game/state.js';

const RNG_ZERO = () => 0; // always rolls face 1

describe('createInitialState', () => {
  it('starts on the menu screen with no players', () => {
    const s = createInitialState();
    expect(s.screen).toBe('menu');
    expect(s.variant).toBeNull();
    expect(s.players).toEqual([]);
  });
});

describe('chooseVariant', () => {
  it('moves to the players screen with the chosen variant and mode', () => {
    const s = chooseVariant(createInitialState(), 'classic', 'digital');
    expect(s.screen).toBe('players');
    expect(s.variant).toBe('classic');
    expect(s.mode).toBe('digital');
  });

  it('forces digital mode for the kids variant', () => {
    const s = chooseVariant(createInitialState(), 'kids', 'physical');
    expect(s.mode).toBe('digital');
  });
});

describe('startGame', () => {
  it('creates a player per name with empty scores and full rolls', () => {
    const s = startGame(chooseVariant(createInitialState(), 'classic', 'digital'), ['Anna', 'Bo']);
    expect(s.screen).toBe('playing');
    expect(s.players).toHaveLength(2);
    expect(s.players[0]).toEqual({ name: 'Anna', scores: {}, yahtzeeBonus: 0 });
    expect(s.currentPlayerIndex).toBe(0);
    expect(s.rollsLeft).toBe(3);
  });
});

function playingState(variant = 'classic', mode = 'digital', names = ['Anna', 'Bo']) {
  return startGame(chooseVariant(createInitialState(), variant, mode), names);
}

describe('rollDice (digital mode)', () => {
  it('rolls all dice and decrements rollsLeft', () => {
    let s = playingState();
    s = rollDice(s, RNG_ZERO);
    expect(s.dice.every((d) => d.value === 1)).toBe(true);
    expect(s.rollsLeft).toBe(2);
  });

  it('does nothing once rollsLeft reaches 0', () => {
    let s = playingState();
    s = rollDice(s, RNG_ZERO);
    s = rollDice(s, RNG_ZERO);
    s = rollDice(s, RNG_ZERO);
    expect(s.rollsLeft).toBe(0);
    const after = rollDice(s, () => 0.9);
    expect(after).toBe(s);
  });

  it('is a no-op in physical mode', () => {
    let s = playingState('classic', 'physical');
    const after = rollDice(s, RNG_ZERO);
    expect(after).toBe(s);
  });
});

describe('toggleHold', () => {
  it('does nothing before the first roll of the turn', () => {
    const s = playingState();
    const after = toggleHold(s, 0);
    expect(after).toBe(s);
  });

  it('flips held after a roll has happened', () => {
    let s = playingState();
    s = rollDice(s, RNG_ZERO);
    s = toggleHold(s, 0);
    expect(s.dice[0].held).toBe(true);
  });
});

describe('setManualDie / canScore (physical mode)', () => {
  it('cannot score until all five dice are set', () => {
    let s = playingState('classic', 'physical');
    expect(canScore(s)).toBe(false);
    [0, 1, 2, 3].forEach((i) => {
      s = setManualDie(s, i, 4);
    });
    expect(canScore(s)).toBe(false);
    s = setManualDie(s, 4, 4);
    expect(canScore(s)).toBe(true);
  });
});

describe('canScore (digital mode)', () => {
  it('requires at least one roll', () => {
    let s = playingState();
    expect(canScore(s)).toBe(false);
    s = rollDice(s, RNG_ZERO);
    expect(canScore(s)).toBe(true);
  });
});

describe('openCategories / previewScore', () => {
  it('lists all categories before any are scored, and previews the current dice', () => {
    let s = playingState();
    s = rollDice(s, RNG_ZERO); // all dice show 1
    expect(openCategories(s)).toHaveLength(13);
    expect(previewScore(s, 'ones')).toBe(5);
    expect(previewScore(s, 'yahtzee')).toBe(50);
  });
});

describe('chooseCategory', () => {
  it('scores the category, resets dice/rolls, and advances to the next player', () => {
    let s = playingState();
    s = rollDice(s, RNG_ZERO); // five 1s
    s = chooseCategory(s, 'ones');
    expect(s.players[0].scores.ones).toBe(5);
    expect(s.currentPlayerIndex).toBe(1);
    expect(s.rollsLeft).toBe(3);
    expect(s.dice.every((d) => d.value === null)).toBe(true);
  });

  it('refuses to score before any roll has happened', () => {
    const s = playingState();
    const after = chooseCategory(s, 'ones');
    expect(after).toBe(s);
  });

  it('refuses to re-score an already-filled category', () => {
    let s = playingState();
    s = rollDice(s, RNG_ZERO);
    s = chooseCategory(s, 'ones');
    // back around to player 0
    s = rollDice(s, RNG_ZERO);
    s = chooseCategory(s, 'ones'); // player Bo scores ones
    expect(s.currentPlayerIndex).toBe(0);
    s = rollDice(s, RNG_ZERO);
    const after = chooseCategory(s, 'ones');
    expect(after).toBe(s);
  });

  it('moves to the gameover screen once every player has filled every category', () => {
    let s = playingState('kids', 'digital', ['Anna']);
    const categoryIds = ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes', 'threeKind', 'yahtzee', 'chance'];
    categoryIds.forEach((id) => {
      s = rollDice(s, RNG_ZERO);
      s = chooseCategory(s, id);
    });
    expect(s.screen).toBe('gameover');
  });

  it('awards the yahtzee bonus on top of the chosen category score', () => {
    let s = playingState('classic', 'digital', ['Anna']);
    s = rollDice(s, () => 0.7); // five of a kind (face 5)
    s = chooseCategory(s, 'yahtzee');
    expect(s.players[0].scores.yahtzee).toBe(50);
    expect(s.players[0].yahtzeeBonus).toBe(0);

    s = rollDice(s, () => 0.7); // another five of a kind
    s = chooseCategory(s, 'fullHouse'); // joker fills full house
    expect(s.players[0].scores.fullHouse).toBe(25);
    expect(s.players[0].yahtzeeBonus).toBe(100);
  });
});

describe('currentPlayer', () => {
  it('returns the player at currentPlayerIndex', () => {
    const s = playingState();
    expect(currentPlayer(s).name).toBe('Anna');
  });
});

describe('restart', () => {
  it('returns to a fresh menu state', () => {
    const s = playingState();
    const fresh = restart(s);
    expect(fresh).toEqual(createInitialState());
  });
});
