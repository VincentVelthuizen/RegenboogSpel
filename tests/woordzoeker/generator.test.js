import { describe, it, expect } from 'vitest';
import { generatePuzzle } from '../../js/woordzoeker/game/generator.js';

function seededRng(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const KIDS_CFG = { minSize: 8, directions: [[0, 1], [1, 0]], maxWords: 8 };
const STANDARD_CFG = {
  minSize: 12,
  directions: [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]],
  maxWords: 10,
};

describe('generatePuzzle', () => {
  it('fills every cell of the grid with a single uppercase letter', () => {
    const words = ['HOND', 'KAT', 'VIS', 'KOE'];
    const { grid, size } = generatePuzzle(words, KIDS_CFG, seededRng(1));
    expect(grid).toHaveLength(size);
    grid.forEach((row) => {
      expect(row).toHaveLength(size);
      row.forEach((cell) => expect(cell).toMatch(/^[A-Z]$/));
    });
  });

  it('places placed words exactly along their reported cells', () => {
    const words = ['HOND', 'KAT', 'VIS', 'KOE', 'KIP', 'EEND'];
    const { grid, words: placed } = generatePuzzle(words, KIDS_CFG, seededRng(2));
    placed.forEach(({ word, cells }) => {
      expect(cells).toHaveLength(word.length);
      const readOut = cells.map(({ row, col }) => grid[row][col]).join('');
      expect(readOut).toBe(word);
    });
  });

  it('only uses left-to-right / top-to-bottom directions in kids mode', () => {
    const words = ['HOND', 'KAT', 'VIS', 'KOE', 'KIP', 'EEND', 'MUIS', 'BEER'];
    const { words: placed } = generatePuzzle(words, KIDS_CFG, seededRng(3));
    placed.forEach(({ cells }) => {
      if (cells.length < 2) return;
      const dRow = cells[1].row - cells[0].row;
      const dCol = cells[1].col - cells[0].col;
      const isValidKidsDirection = (dRow === 0 && dCol === 1) || (dRow === 1 && dCol === 0);
      expect(isValidKidsDirection).toBe(true);
    });
  });

  it('places most or all requested words (allowing for rare placement failures)', () => {
    const words = ['HOND', 'KAT', 'VIS', 'KOE', 'KIP', 'EEND', 'MUIS', 'BEER'];
    const { words: placed } = generatePuzzle(words, KIDS_CFG, seededRng(4));
    expect(placed.length).toBeGreaterThanOrEqual(words.length - 1);
  });

  it('caps the number of words at maxWords', () => {
    const words = ['PEER', 'KIWI', 'KERS', 'APPEL', 'PRUIM', 'DRUIF', 'MANGO', 'BANAAN', 'ANANAS', 'CITROEN', 'AARDBEI', 'MELOEN'];
    const { words: placed } = generatePuzzle(words, STANDARD_CFG, seededRng(5));
    expect(placed.length).toBeLessThanOrEqual(STANDARD_CFG.maxWords);
  });

  it('grid size grows to fit the longest chosen word', () => {
    const words = ['CITROEN', 'AARDBEI']; // 7 letters
    const { size } = generatePuzzle(words, STANDARD_CFG, seededRng(6));
    expect(size).toBeGreaterThanOrEqual(9);
  });
});
