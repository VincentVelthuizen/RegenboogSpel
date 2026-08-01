import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  chooseMode,
  selectTheme,
  selectCell,
  newPuzzle,
  backToThemes,
  backToModeSelect,
} from '../../js/woordzoeker/game/state.js';

function seededRng(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

describe('createInitialState', () => {
  it('starts on the mode-select screen', () => {
    const s = createInitialState();
    expect(s.screen).toBe('mode');
    expect(s.mode).toBeNull();
  });
});

describe('chooseMode', () => {
  it('moves to the theme screen with the chosen mode', () => {
    const s = chooseMode(createInitialState(), 'kids');
    expect(s.screen).toBe('theme');
    expect(s.mode).toBe('kids');
  });
});

describe('selectTheme', () => {
  it('generates a puzzle and moves to the playing screen', () => {
    const s = selectTheme(chooseMode(createInitialState(), 'kids'), 'dieren', seededRng(1));
    expect(s.screen).toBe('playing');
    expect(s.themeId).toBe('dieren');
    expect(s.grid.length).toBe(s.size);
    expect(s.words.length).toBeGreaterThan(0);
    expect(s.words.every((w) => w.found === false)).toBe(true);
  });
});

function playingState(mode = 'kids', themeId = 'dieren', seed = 2) {
  return selectTheme(chooseMode(createInitialState(), mode), themeId, seededRng(seed));
}

describe('selectCell', () => {
  it('sets selectionStart on the first tap', () => {
    let s = playingState();
    s = selectCell(s, 0, 0);
    expect(s.selectionStart).toEqual({ row: 0, col: 0 });
  });

  it('cancels the selection when the same cell is tapped again', () => {
    let s = playingState();
    s = selectCell(s, 0, 0);
    s = selectCell(s, 0, 0);
    expect(s.selectionStart).toBeNull();
  });

  it('marks a word as found when its exact cell line is tapped end-to-end', () => {
    let s = playingState();
    const target = s.words[0];
    const first = target.cells[0];
    const last = target.cells[target.cells.length - 1];

    s = selectCell(s, first.row, first.col);
    s = selectCell(s, last.row, last.col);

    const updated = s.words.find((w) => w.word === target.word);
    expect(updated.found).toBe(true);
    expect(s.selectionStart).toBeNull();
  });

  it('also matches when tapped in reverse (end then start)', () => {
    let s = playingState();
    const target = s.words[0];
    const first = target.cells[0];
    const last = target.cells[target.cells.length - 1];

    s = selectCell(s, last.row, last.col);
    s = selectCell(s, first.row, first.col);

    const updated = s.words.find((w) => w.word === target.word);
    expect(updated.found).toBe(true);
  });

  it('clears the selection without marking anything found on a non-matching line', () => {
    let s = playingState();
    // Pick two corners that are very unlikely to form any placed word.
    s = selectCell(s, 0, 0);
    s = selectCell(s, 0, s.size - 1);
    expect(s.selectionStart).toBeNull();
    expect(s.words.every((w) => !w.found)).toBe(true);
  });

  it('moves to celebrating once every word is found', () => {
    let s = playingState('kids', 'dieren', 3);
    s.words.forEach((w) => {
      const first = w.cells[0];
      const last = w.cells[w.cells.length - 1];
      s = selectCell(s, first.row, first.col);
      s = selectCell(s, last.row, last.col);
    });
    expect(s.screen).toBe('celebrating');
    expect(s.words.every((w) => w.found)).toBe(true);
  });
});

describe('newPuzzle', () => {
  it('regenerates a fresh puzzle for the same theme/mode', () => {
    let s = playingState();
    const themeId = s.themeId;
    s = newPuzzle(s, seededRng(4));
    expect(s.themeId).toBe(themeId);
    expect(s.screen).toBe('playing');
    expect(s.words.every((w) => !w.found)).toBe(true);
  });
});

describe('backToThemes / backToModeSelect', () => {
  it('backToThemes keeps the mode but clears the puzzle', () => {
    const s = backToThemes(playingState());
    expect(s.screen).toBe('theme');
    expect(s.mode).toBe('kids');
    expect(s.grid).toBeNull();
  });

  it('backToModeSelect resets everything', () => {
    expect(backToModeSelect(playingState())).toEqual(createInitialState());
  });
});
