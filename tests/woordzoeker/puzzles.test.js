import { describe, it, expect } from 'vitest';
import { THEMES, themesForMode, themeWords } from '../../js/woordzoeker/game/puzzles.js';

describe('themesForMode', () => {
  it('standard mode includes every theme', () => {
    expect(themesForMode('standard')).toHaveLength(THEMES.length);
  });

  it('kids mode only includes themes marked for it', () => {
    const kidsThemes = themesForMode('kids');
    expect(kidsThemes.length).toBeGreaterThan(0);
    expect(kidsThemes.length).toBeLessThan(THEMES.length);
    kidsThemes.forEach((t) => expect(t.modes).toContain('kids'));
  });

  it('the adult-only themes are excluded from kids mode', () => {
    const kidsThemeIds = themesForMode('kids').map((t) => t.id);
    ['landen', 'beroepen', 'sport', 'ruimte', 'muziek'].forEach((id) => {
      expect(kidsThemeIds).not.toContain(id);
    });
  });
});

describe('themeWords', () => {
  it('standard mode returns the full word list for adult-only themes', () => {
    const words = themeWords('landen', 'standard');
    expect(words.length).toBeGreaterThanOrEqual(10);
  });

  it('every theme has enough short words for kids mode where applicable', () => {
    themesForMode('kids').forEach((theme) => {
      const words = themeWords(theme.id, 'kids');
      expect(words.length).toBeGreaterThanOrEqual(6);
    });
  });
});
