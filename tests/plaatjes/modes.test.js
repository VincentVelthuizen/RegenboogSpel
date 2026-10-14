import { describe, it, expect } from 'vitest';
import { MODES, DEFAULT_MODE, PARCOURS_HERO, modeFromSearch } from '../../js/plaatjes/modes.js';
import { ACTIVITIES } from '../../js/avontuur/game/state.js';
import { getPuzzle } from '../../js/dots/game/puzzles.js';

describe('stand-alone picture games', () => {
  it('offers colouring, the jigsaw, the sliding puzzle and the parcours', () => {
    expect(Object.values(MODES).map((m) => m.activity).sort()).toEqual(['color', 'parcours', 'puzzle', 'slide']);
    for (const mode of Object.values(MODES)) {
      expect(ACTIVITIES).toContain(mode.activity);
      expect(mode.title.length).toBeGreaterThan(0);
    }
  });

  it('reads the game from ?spel=, falling back to colouring', () => {
    expect(modeFromSearch('?spel=legpuzzel')).toBe('legpuzzel');
    expect(modeFromSearch('?spel=schuifpuzzel')).toBe('schuifpuzzel');
    expect(modeFromSearch('?spel=parcours')).toBe('parcours');
    expect(modeFromSearch('')).toBe(DEFAULT_MODE);
    expect(modeFromSearch('?spel=toString')).toBe(DEFAULT_MODE);
    expect(DEFAULT_MODE).toBe('kleuren');
  });

  it('lets an existing drawing walk the parcours', () => {
    expect(getPuzzle(PARCOURS_HERO)).toBeDefined();
  });
});
