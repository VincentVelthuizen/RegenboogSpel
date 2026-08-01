export const THEMES = [
  {
    id: 'dieren',
    label: 'Dieren',
    emoji: '🐶',
    words: ['HOND', 'KAT', 'VIS', 'KOE', 'KIP', 'EEND', 'MUIS', 'BEER', 'UIL', 'VOS', 'PAARD', 'VOGEL', 'HAAN', 'SCHAAP', 'VARKEN'],
  },
  {
    id: 'fruit',
    label: 'Fruit',
    emoji: '🍎',
    words: ['PEER', 'KIWI', 'KERS', 'APPEL', 'PRUIM', 'DRUIF', 'MANGO', 'BANAAN', 'ANANAS', 'CITROEN', 'AARDBEI', 'MELOEN'],
  },
  {
    id: 'kleuren',
    label: 'Kleuren',
    emoji: '🌈',
    words: ['ROOD', 'GEEL', 'ROZE', 'WIT', 'PAARS', 'BRUIN', 'GRIJS', 'BLAUW', 'GROEN', 'ZWART', 'ORANJE'],
  },
  {
    id: 'natuur',
    label: 'Natuur',
    emoji: '🌳',
    words: ['ZON', 'MAAN', 'STER', 'BOOM', 'WOLK', 'GRAS', 'BERG', 'ZEE', 'BLOEM', 'REGEN', 'RIVIER', 'STRAND'],
  },
  {
    id: 'speelgoed',
    label: 'Speelgoed',
    emoji: '🧸',
    words: ['BAL', 'POP', 'AUTO', 'BEER', 'BOOT', 'TREIN', 'FIETS', 'PUZZEL', 'BLOKKEN', 'VLIEGER'],
  },
];

const KIDS_MAX_WORD_LENGTH = 5;

export function getTheme(themeId) {
  return THEMES.find((t) => t.id === themeId);
}

// Kids mode only uses short words that fit a small grid.
export function themeWords(themeId, mode) {
  const theme = getTheme(themeId);
  if (!theme) return [];
  return mode === 'kids' ? theme.words.filter((w) => w.length <= KIDS_MAX_WORD_LENGTH) : theme.words;
}
