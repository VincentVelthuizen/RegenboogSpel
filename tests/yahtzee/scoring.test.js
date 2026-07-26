import { describe, it, expect } from 'vitest';
import {
  categoriesFor,
  scoreCategory,
  yahtzeeBonusEarned,
  upperBonus,
  totalScore,
  CLASSIC_CATEGORIES,
  KIDS_CATEGORIES,
} from '../../js/yahtzee/game/scoring.js';

describe('categoriesFor', () => {
  it('returns the classic 13 categories for the classic variant', () => {
    expect(categoriesFor('classic')).toBe(CLASSIC_CATEGORIES);
    expect(categoriesFor('classic')).toHaveLength(13);
  });

  it('returns the simplified set for the kids variant', () => {
    expect(categoriesFor('kids')).toBe(KIDS_CATEGORIES);
    expect(categoriesFor('kids')).toHaveLength(9);
  });
});

describe('scoreCategory — upper section (both variants)', () => {
  it('sums only the dice matching the category face', () => {
    const dice = [3, 3, 5, 3, 6];
    expect(scoreCategory('classic', 'threes', dice)).toBe(9);
    expect(scoreCategory('classic', 'sixes', dice)).toBe(6);
    expect(scoreCategory('classic', 'fours', dice)).toBe(0);
    expect(scoreCategory('kids', 'threes', dice)).toBe(9);
  });
});

describe('scoreCategory — classic lower section', () => {
  it('scores three of a kind as the sum, or 0 without three matching', () => {
    expect(scoreCategory('classic', 'threeKind', [2, 2, 2, 5, 6])).toBe(17);
    expect(scoreCategory('classic', 'threeKind', [2, 2, 3, 5, 6])).toBe(0);
  });

  it('scores four of a kind as the sum, or 0 without four matching', () => {
    expect(scoreCategory('classic', 'fourKind', [4, 4, 4, 4, 6])).toBe(22);
    expect(scoreCategory('classic', 'fourKind', [4, 4, 4, 5, 6])).toBe(0);
  });

  it('scores a full house as 25, or 0 otherwise', () => {
    expect(scoreCategory('classic', 'fullHouse', [2, 2, 5, 5, 5])).toBe(25);
    expect(scoreCategory('classic', 'fullHouse', [2, 2, 5, 5, 6])).toBe(0);
  });

  it('scores small and large straights', () => {
    expect(scoreCategory('classic', 'smallStraight', [1, 2, 3, 4, 6])).toBe(30);
    expect(scoreCategory('classic', 'smallStraight', [1, 2, 4, 5, 6])).toBe(0);
    expect(scoreCategory('classic', 'largeStraight', [2, 3, 4, 5, 6])).toBe(40);
    expect(scoreCategory('classic', 'largeStraight', [1, 2, 3, 4, 6])).toBe(0);
  });

  it('scores yahtzee as 50 only for five of a kind', () => {
    expect(scoreCategory('classic', 'yahtzee', [6, 6, 6, 6, 6])).toBe(50);
    expect(scoreCategory('classic', 'yahtzee', [6, 6, 6, 6, 5])).toBe(0);
  });

  it('scores chance as the sum of all dice', () => {
    expect(scoreCategory('classic', 'chance', [1, 2, 3, 4, 5])).toBe(15);
  });
});

describe('scoreCategory — free choice joker', () => {
  const dice = [5, 5, 5, 5, 5];

  it('does not apply joker rules without a prior scored Yahtzee', () => {
    expect(scoreCategory('classic', 'fullHouse', dice, { yahtzee: undefined })).toBe(0);
    expect(scoreCategory('classic', 'smallStraight', dice, { yahtzee: 0 })).toBe(0);
  });

  it('lets a second Yahtzee fill full house / straights once yahtzee already scored 50', () => {
    const playerScores = { yahtzee: 50 };
    expect(scoreCategory('classic', 'fullHouse', dice, playerScores)).toBe(25);
    expect(scoreCategory('classic', 'smallStraight', dice, playerScores)).toBe(30);
    expect(scoreCategory('classic', 'largeStraight', dice, playerScores)).toBe(40);
  });
});

describe('yahtzeeBonusEarned', () => {
  it('is 0 for the kids variant', () => {
    expect(yahtzeeBonusEarned('kids', [4, 4, 4, 4, 4], { yahtzee: 30 })).toBe(0);
  });

  it('is 0 without a prior scored Yahtzee, or for a non-Yahtzee roll', () => {
    expect(yahtzeeBonusEarned('classic', [4, 4, 4, 4, 4], {})).toBe(0);
    expect(yahtzeeBonusEarned('classic', [4, 4, 4, 4, 3], { yahtzee: 50 })).toBe(0);
  });

  it('awards 100 for a second Yahtzee once the box already holds 50', () => {
    expect(yahtzeeBonusEarned('classic', [4, 4, 4, 4, 4], { yahtzee: 50 })).toBe(100);
  });
});

describe('scoreCategory — kids variant', () => {
  it('gives a flat bonus for three of a kind regardless of dice sum', () => {
    expect(scoreCategory('kids', 'threeKind', [2, 2, 2, 5, 6])).toBe(15);
    expect(scoreCategory('kids', 'threeKind', [2, 2, 3, 5, 6])).toBe(0);
  });

  it('gives a flat bonus for five of a kind', () => {
    expect(scoreCategory('kids', 'yahtzee', [3, 3, 3, 3, 3])).toBe(30);
    expect(scoreCategory('kids', 'yahtzee', [3, 3, 3, 3, 4])).toBe(0);
  });

  it('scores chance as the sum of all dice', () => {
    expect(scoreCategory('kids', 'chance', [1, 1, 1, 1, 1])).toBe(5);
  });
});

describe('upperBonus', () => {
  it('is 0 for the kids variant', () => {
    expect(upperBonus('kids', { ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18 })).toBe(0);
  });

  it('awards 35 once the upper section reaches 63', () => {
    const scores = { ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18 }; // 63
    expect(upperBonus('classic', scores)).toBe(35);
  });

  it('is 0 below the threshold', () => {
    const scores = { ones: 1, twos: 2, threes: 3 };
    expect(upperBonus('classic', scores)).toBe(0);
  });
});

describe('totalScore', () => {
  it('sums category scores, upper bonus and yahtzee bonus (classic)', () => {
    const player = {
      scores: { ones: 3, twos: 6, threes: 9, fours: 12, fives: 15, sixes: 18, chance: 20 },
      yahtzeeBonus: 100,
    };
    // 63 upper + 35 bonus + 20 chance + 100 yahtzee bonus
    expect(totalScore('classic', player)).toBe(63 + 35 + 20 + 100);
  });

  it('sums category scores only for kids (no bonuses)', () => {
    const player = { scores: { ones: 3, chance: 10 }, yahtzeeBonus: 0 };
    expect(totalScore('kids', player)).toBe(13);
  });
});
