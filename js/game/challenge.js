import { COLORS, EMOJI_POOL } from './colors.js';
import { pickOne, shuffle } from './random.js';

export function generateChallenge(filledColors, rng = Math.random) {
  const currentColor = COLORS[filledColors.length];

  const correctEmoji = pickOne(EMOJI_POOL[currentColor], rng);

  const otherColors = COLORS.filter((c) => c !== currentColor);
  const [distractorColorA, distractorColorB] = shuffle(otherColors, rng).slice(0, 2);

  const distractorA = pickOne(EMOJI_POOL[distractorColorA], rng);
  const distractorB = pickOne(EMOJI_POOL[distractorColorB], rng);

  const shuffled = shuffle([correctEmoji, distractorA, distractorB], rng);
  const correctIndex = shuffled.indexOf(correctEmoji);

  return {
    currentColor,
    currentChoices: shuffled,
    correctIndex,
  };
}
