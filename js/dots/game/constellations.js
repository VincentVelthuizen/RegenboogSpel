// Sterrenbeelden (constellations) — the "✨" star level.
//
// Unlike the picture puzzles, a constellation is an OPEN path: the dots are
// connected in order but the figure is never closed into a polygon. `renderBoard`
// already draws an open polyline, so the play interaction is shared; only the
// reveal differs (a faint star-atlas figure + its name, instead of a filled shape).
//
// `star: true` marks a figure as a constellation so the app can switch on the
// night-sky theme and the constellation reveal. Coordinates live in the same
// 0..100 space as the puzzles (y grows downward). Each is a single traceable
// stroke through the brightest stars — a kid-friendly "stick figure" of the sky.
export const STAR_LEVEL = 'star';

const CATALOG = [
  // Famous, easy-to-recognise shapes
  { id: 'grote-beer', label: 'grote beer', emoji: '🐻', color: '#cfe3ff',
    dots: [[14,28],[27,30],[40,34],[52,40],[55,58],[80,55],[78,37]] },
  { id: 'cassiopeia', label: 'cassiopeia', emoji: '👑', color: '#ffd9a8',
    dots: [[12,38],[30,58],[48,40],[66,60],[86,36]] },
  { id: 'orion', label: 'orion', emoji: '🏹', color: '#b8c6ff',
    dots: [[28,84],[34,22],[50,14],[66,22],[74,84],[60,52],[50,54],[40,52]] },

  // Zodiac star signs
  { id: 'ram', label: 'ram', emoji: '🐏', color: '#ffc9a8',
    dots: [[20,40],[44,34],[68,46],[80,60]] },
  { id: 'stier', label: 'stier', emoji: '🐂', color: '#d9b8ff',
    dots: [[14,16],[30,32],[46,48],[60,32],[78,14]] },
  { id: 'tweelingen', label: 'tweelingen', emoji: '👯', color: '#a8e6cf',
    dots: [[34,16],[40,44],[34,80],[50,46],[66,80],[60,44],[66,16]] },
  { id: 'leeuw', label: 'leeuw', emoji: '🦁', color: '#ffe08a',
    dots: [[40,28],[29,35],[27,49],[41,55],[74,62],[91,53]] },
  { id: 'schorpioen', label: 'schorpioen', emoji: '🦂', color: '#ff9aa2',
    dots: [[18,20],[32,24],[44,30],[50,44],[54,58],[62,70],[72,78],[80,72],[74,64]] },
];

export const CONSTELLATIONS = CATALOG.map((c) => ({ ...c, star: true, level: STAR_LEVEL }));

export function getConstellation(id) {
  return CONSTELLATIONS.find((c) => c.id === id);
}
