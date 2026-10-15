import { describe, it, expect } from 'vitest';
import { COLOR_WORDS, colorPlaceholders, fillColorWords } from '../../js/avontuur/game/colorWords.js';
import { PALETTE, colorRegions } from '../../js/avontuur/game/coloring.js';
import { STORIES } from '../../js/avontuur/game/story.js';
import { getPuzzle } from '../../js/dots/game/puzzles.js';

describe('colour words', () => {
  it('names every palette colour', () => {
    for (const color of PALETTE) expect(COLOR_WORDS[color]).toBeTruthy();
  });

  it('fills in the colours the child chose, or the default', () => {
    const text = 'Een {body|bruine} beer met een {d5|rode} sjaal.';
    expect(fillColorWords(text, {}, 'beer')).toBe('Een bruine beer met een rode sjaal.');
    expect(fillColorWords(text, { beer: { body: PALETTE[4] } }, 'beer')).toBe('Een blauwe beer met een rode sjaal.');
    expect(fillColorWords(text, { beer: { body: PALETTE[4], d5: PALETTE[2] } }, 'beer')).toBe('Een blauwe beer met een gele sjaal.');
  });

  it('can mention a picture coloured in an earlier step', () => {
    const text = 'Zijn {beer.d5|rode} sjaal wappert.';
    expect(fillColorWords(text, { beer: { d5: PALETTE[3] } }, 'brug')).toBe('Zijn groene sjaal wappert.');
    expect(fillColorWords(text, {}, 'brug')).toBe('Zijn rode sjaal wappert.');
  });

  it('leaves texts without placeholders alone', () => {
    expect(fillColorWords('Hallo {niet}!', {}, 'beer')).toBe('Hallo {niet}!');
  });
});

describe('colour placeholders in the stories', () => {
  it('only name pictures and regions that can be coloured', () => {
    let count = 0;
    for (const story of STORIES) {
      for (const node of Object.values(story.nodes)) {
        for (const { picture, region, fallback } of colorPlaceholders(node.text)) {
          count += 1;
          const id = picture || node.picture;
          expect(getPuzzle(id), `${story.id}/${node.id}: ${id}`).toBeDefined();
          expect(colorRegions(getPuzzle(id)), `${story.id}/${node.id}: ${id}.${region}`).toContain(region);
          expect(fallback.length, `${story.id}/${node.id}`).toBeGreaterThan(0);
        }
        expect(node.text.replace(/\{[^}]*\|[^}]*\}/g, ''), `${story.id}/${node.id}`).not.toMatch(/[{}]/);
      }
    }
    expect(count).toBeGreaterThan(5);
  });
});
