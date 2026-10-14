import { describe, it, expect } from 'vitest';
import { MODES, DEFAULT_MODE, modeFromSearch } from '../../js/plaatjes/modes.js';
import { ACTIVITIES } from '../../js/avontuur/game/state.js';

describe('stand-alone picture games', () => {
  it('offers colouring, the jigsaw and the sliding puzzle', () => {
    expect(Object.values(MODES).map((m) => m.activity).sort()).toEqual(['color', 'puzzle', 'slide']);
    for (const mode of Object.values(MODES)) {
      expect(ACTIVITIES).toContain(mode.activity);
      expect(mode.title.length).toBeGreaterThan(0);
    }
  });

  it('reads the game from ?spel=, falling back to colouring', () => {
    expect(modeFromSearch('?spel=legpuzzel')).toBe('legpuzzel');
    expect(modeFromSearch('?spel=schuifpuzzel')).toBe('schuifpuzzel');
    expect(modeFromSearch('')).toBe(DEFAULT_MODE);
    expect(modeFromSearch('?spel=toString')).toBe(DEFAULT_MODE);
    expect(DEFAULT_MODE).toBe('kleuren');
  });
});
