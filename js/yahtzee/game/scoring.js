const UPPER_FACES = [
  { id: 'ones', face: 1, label: 'Enen', emoji: '1️⃣' },
  { id: 'twos', face: 2, label: 'Tweeën', emoji: '2️⃣' },
  { id: 'threes', face: 3, label: 'Drieën', emoji: '3️⃣' },
  { id: 'fours', face: 4, label: 'Vieren', emoji: '4️⃣' },
  { id: 'fives', face: 5, label: 'Vijven', emoji: '5️⃣' },
  { id: 'sixes', face: 6, label: 'Zessen', emoji: '6️⃣' },
];

export const CLASSIC_CATEGORIES = [
  ...UPPER_FACES.map((u) => ({ id: u.id, section: 'upper', label: u.label, emoji: u.emoji })),
  { id: 'threeKind', section: 'lower', label: 'Drie gelijk', emoji: '🎯' },
  { id: 'fourKind', section: 'lower', label: 'Vier gelijk', emoji: '🎯' },
  { id: 'fullHouse', section: 'lower', label: 'Full house', emoji: '🏠' },
  { id: 'smallStraight', section: 'lower', label: 'Kleine straat', emoji: '➡️' },
  { id: 'largeStraight', section: 'lower', label: 'Grote straat', emoji: '🌈' },
  { id: 'yahtzee', section: 'lower', label: 'Yahtzee', emoji: '🎉' },
  { id: 'chance', section: 'lower', label: 'Vrije keuze', emoji: '🍀' },
];

export const KIDS_CATEGORIES = [
  ...UPPER_FACES.map((u) => ({ id: u.id, section: 'upper', label: u.label, emoji: u.emoji })),
  { id: 'threeKind', section: 'bonus', label: 'Drie gelijk', emoji: '🎯' },
  { id: 'yahtzee', section: 'bonus', label: 'Alle gelijk', emoji: '🥳' },
  { id: 'chance', section: 'bonus', label: 'Alle stippen', emoji: '🎲' },
];

const UPPER_BONUS_THRESHOLD = 63;
const UPPER_BONUS_POINTS = 35;
const YAHTZEE_BONUS_POINTS = 100;

export function categoriesFor(variant) {
  return variant === 'kids' ? KIDS_CATEGORIES : CLASSIC_CATEGORIES;
}

function counts(dice) {
  const c = [0, 0, 0, 0, 0, 0, 0]; // index 0 unused, faces 1..6
  dice.forEach((d) => c[d]++);
  return c;
}

function sum(dice) {
  return dice.reduce((total, d) => total + d, 0);
}

function hasCountAtLeast(dice, n) {
  return counts(dice).some((c) => c >= n);
}

function isYahtzee(dice) {
  return hasCountAtLeast(dice, 5);
}

function isFullHouseShape(dice) {
  const groupSizes = counts(dice).slice(1).filter((c) => c > 0).sort();
  return groupSizes.length === 2 && groupSizes[0] === 2 && groupSizes[1] === 3;
}

function hasStraight(dice, length) {
  const present = new Set(dice);
  for (let start = 1; start <= 6 - length + 1; start++) {
    let ok = true;
    for (let face = start; face < start + length; face++) {
      if (!present.has(face)) {
        ok = false;
        break;
      }
    }
    if (ok) return true;
  }
  return false;
}

// A second (or later) Yahtzee, once the Yahtzee box already holds 50, is a
// "Free Choice Joker": it earns a 100-point bonus and may fill any open
// lower-section category as if its shape requirement were met.
function isJokerActive(dice, playerScores) {
  return isYahtzee(dice) && playerScores.yahtzee === 50;
}

function scoreClassicCategory(categoryId, dice, playerScores = {}) {
  const upper = UPPER_FACES.find((u) => u.id === categoryId);
  if (upper) return counts(dice)[upper.face] * upper.face;

  const jokerActive = isJokerActive(dice, playerScores);

  switch (categoryId) {
    case 'threeKind':
      return hasCountAtLeast(dice, 3) ? sum(dice) : 0;
    case 'fourKind':
      return hasCountAtLeast(dice, 4) ? sum(dice) : 0;
    case 'fullHouse':
      return isFullHouseShape(dice) || jokerActive ? 25 : 0;
    case 'smallStraight':
      return hasStraight(dice, 4) || jokerActive ? 30 : 0;
    case 'largeStraight':
      return hasStraight(dice, 5) || jokerActive ? 40 : 0;
    case 'yahtzee':
      return isYahtzee(dice) ? 50 : 0;
    case 'chance':
      return sum(dice);
    default:
      return 0;
  }
}

function scoreKidsCategory(categoryId, dice) {
  const upper = UPPER_FACES.find((u) => u.id === categoryId);
  if (upper) return counts(dice)[upper.face] * upper.face;

  switch (categoryId) {
    case 'threeKind':
      return hasCountAtLeast(dice, 3) ? 15 : 0;
    case 'yahtzee':
      return isYahtzee(dice) ? 30 : 0;
    case 'chance':
      return sum(dice);
    default:
      return 0;
  }
}

export function scoreCategory(variant, categoryId, dice, playerScores = {}) {
  return variant === 'kids'
    ? scoreKidsCategory(categoryId, dice)
    : scoreClassicCategory(categoryId, dice, playerScores);
}

export function yahtzeeBonusEarned(variant, dice, playerScores = {}) {
  if (variant === 'kids') return 0;
  return isJokerActive(dice, playerScores) ? YAHTZEE_BONUS_POINTS : 0;
}

export function upperBonus(variant, playerScores) {
  if (variant === 'kids') return 0;
  const upperTotal = UPPER_FACES.reduce((t, u) => t + (playerScores[u.id] || 0), 0);
  return upperTotal >= UPPER_BONUS_THRESHOLD ? UPPER_BONUS_POINTS : 0;
}

export function totalScore(variant, player) {
  const categoryTotal = categoriesFor(variant).reduce(
    (t, c) => t + (player.scores[c.id] || 0),
    0,
  );
  return categoryTotal + upperBonus(variant, player.scores) + (player.yahtzeeBonus || 0);
}
