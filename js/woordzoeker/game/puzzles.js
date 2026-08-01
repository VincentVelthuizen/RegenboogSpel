export const THEMES = [
  {
    id: 'dieren',
    label: 'Dieren',
    emoji: '🐶',
    modes: ['kids', 'standard'],
    words: ['HOND', 'KAT', 'VIS', 'KOE', 'KIP', 'EEND', 'MUIS', 'BEER', 'UIL', 'VOS', 'PAARD', 'VOGEL', 'HAAN', 'SCHAAP', 'VARKEN'],
  },
  {
    id: 'fruit',
    label: 'Fruit',
    emoji: '🍎',
    modes: ['kids', 'standard'],
    words: ['PEER', 'KIWI', 'KERS', 'APPEL', 'PRUIM', 'DRUIF', 'MANGO', 'BANAAN', 'ANANAS', 'CITROEN', 'AARDBEI', 'MELOEN'],
  },
  {
    id: 'kleuren',
    label: 'Kleuren',
    emoji: '🌈',
    modes: ['kids', 'standard'],
    words: ['ROOD', 'GEEL', 'ROZE', 'WIT', 'PAARS', 'BRUIN', 'GRIJS', 'BLAUW', 'GROEN', 'ZWART', 'ORANJE'],
  },
  {
    id: 'natuur',
    label: 'Natuur',
    emoji: '🌳',
    modes: ['kids', 'standard'],
    words: ['ZON', 'MAAN', 'STER', 'BOOM', 'WOLK', 'GRAS', 'BERG', 'ZEE', 'BLOEM', 'REGEN', 'RIVIER', 'STRAND'],
  },
  {
    id: 'speelgoed',
    label: 'Speelgoed',
    emoji: '🧸',
    modes: ['kids', 'standard'],
    words: ['BAL', 'POP', 'AUTO', 'BEER', 'BOOT', 'TREIN', 'FIETS', 'PUZZEL', 'BLOKKEN', 'VLIEGER'],
  },
  {
    id: 'landen',
    label: 'Landen',
    emoji: '🌍',
    modes: ['standard'],
    words: ['NEDERLAND', 'BELGIE', 'DUITSLAND', 'FRANKRIJK', 'SPANJE', 'ITALIE', 'PORTUGAL', 'ZWEDEN', 'NOORWEGEN', 'DENEMARKEN', 'POLEN', 'OOSTENRIJK', 'GRIEKENLAND', 'IERLAND', 'ZWITSERLAND'],
  },
  {
    id: 'beroepen',
    label: 'Beroepen',
    emoji: '💼',
    modes: ['standard'],
    words: ['DOKTER', 'LERAAR', 'BAKKER', 'KAPPER', 'MONTEUR', 'ADVOCAAT', 'BOUWVAKKER', 'APOTHEKER', 'TIMMERMAN', 'ELEKTRICIEN', 'BOER', 'PILOOT', 'KOK', 'SCHILDER', 'ARCHITECT'],
  },
  {
    id: 'sport',
    label: 'Sport',
    emoji: '⚽',
    modes: ['standard'],
    words: ['VOETBAL', 'TENNIS', 'ZWEMMEN', 'HARDLOPEN', 'BASKETBAL', 'VOLLEYBAL', 'HOCKEY', 'WIELRENNEN', 'SCHAATSEN', 'GOLF', 'BOKSEN', 'JUDO', 'ATLETIEK', 'HANDBAL', 'TAFELTENNIS'],
  },
  {
    id: 'ruimte',
    label: 'Ruimte',
    emoji: '🚀',
    modes: ['standard'],
    words: ['PLANEET', 'STER', 'MAAN', 'ZON', 'MELKWEG', 'ASTRONAUT', 'RAKET', 'SATELLIET', 'KOMEET', 'ZWARTGAT', 'MARS', 'JUPITER', 'SATURNUS', 'GALAXIE', 'UNIVERSUM'],
  },
  {
    id: 'muziek',
    label: 'Muziek',
    emoji: '🎵',
    modes: ['standard'],
    words: ['GITAAR', 'PIANO', 'VIOOL', 'TROMPET', 'DRUM', 'ZANGER', 'ORKEST', 'MELODIE', 'RITME', 'SAXOFOON', 'KLARINET', 'CELLO', 'HARP', 'ACCORDEON', 'XYLOFOON'],
  },
];

const KIDS_MAX_WORD_LENGTH = 5;

export function getTheme(themeId) {
  return THEMES.find((t) => t.id === themeId);
}

export function themesForMode(mode) {
  return THEMES.filter((t) => t.modes.includes(mode));
}

// Kids mode only uses short words that fit a small grid.
export function themeWords(themeId, mode) {
  const theme = getTheme(themeId);
  if (!theme) return [];
  return mode === 'kids' ? theme.words.filter((w) => w.length <= KIDS_MAX_WORD_LENGTH) : theme.words;
}
