import { describe, it, expect } from 'vitest';
import { generateChallenge } from '../../js/game/challenge.js';
import { COLORS, EMOJI_POOL } from '../../js/game/colors.js';

function deterministicRng(sequence) {
  let i = 0;
  return () => sequence[i++ % sequence.length];
}

describe('generateChallenge', () => {
  it('targets the next unfilled color', () => {
    const result = generateChallenge([], Math.random);
    expect(result.currentColor).toBe('purple');

    const result2 = generateChallenge(['purple', 'blue'], Math.random);
    expect(result2.currentColor).toBe('green');
  });

  it('returns exactly 3 choices', () => {
    const result = generateChallenge([], Math.random);
    expect(result.currentChoices).toHaveLength(3);
  });

  it('includes one emoji from the target color pool', () => {
    const result = generateChallenge([], Math.random);
    const purplePool = EMOJI_POOL.purple;
    const purpleEmojisInChoices = result.currentChoices.filter((e) =>
      purplePool.includes(e),
    );
    expect(purpleEmojisInChoices).toHaveLength(1);
  });

  it('correctIndex points to the target-color emoji', () => {
    const result = generateChallenge([], Math.random);
    const correctEmoji = result.currentChoices[result.correctIndex];
    expect(EMOJI_POOL[result.currentColor]).toContain(correctEmoji);
  });

  it('two distractors come from two distinct non-target colors', () => {
    const result = generateChallenge([], Math.random);
    const distractors = result.currentChoices.filter(
      (_, i) => i !== result.correctIndex,
    );
    expect(distractors).toHaveLength(2);

    const colorsFound = distractors.map((emoji) => {
      for (const color of COLORS) {
        if (EMOJI_POOL[color].includes(emoji)) return color;
      }
      return null;
    });

    expect(colorsFound).not.toContain(result.currentColor);
    expect(colorsFound[0]).not.toBe(colorsFound[1]);
  });

  it('is deterministic with a fixed rng', () => {
    const rng = deterministicRng([0, 0, 0, 0, 0, 0, 0, 0]);
    const a = generateChallenge([], rng);
    const rng2 = deterministicRng([0, 0, 0, 0, 0, 0, 0, 0]);
    const b = generateChallenge([], rng2);
    expect(a).toEqual(b);
  });
});
