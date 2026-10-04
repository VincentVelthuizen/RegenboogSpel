import { mirrorX } from './shapes.js';

// Sterrenbeelden (star signs) — the "✨" star level.
//
// These used to be open star-pattern paths with a faint reveal; now they're
// closed cartoon figures like the regular picture puzzles (see puzzles.js),
// so the dots you connect are the actual outline of the animal, not a
// separate emoji stamped on top. `star: true` still marks the level so the
// game can switch on the night-sky theme while playing. `details` are small
// hand-drawn accents (eyes, horns, a crown jewel, ...) layered on the filled
// shape at reveal time — see ui/board.js's revealPicture.
export const STAR_LEVEL = 'star';

const CATALOG = [
  {
    id: 'grote-beer', label: 'grote beer', emoji: '🐻', color: '#a9704b',
    dots: mirrorX([[50,16],[38,8],[26,16],[20,30],[22,46],[30,58],[38,66],[50,68]]),
    details: [
      { type: 'circle', attrs: { cx: 40, cy: 46, r: 3 }, fill: '#2c1810' },
      { type: 'circle', attrs: { cx: 60, cy: 46, r: 3 }, fill: '#2c1810' },
      { type: 'ellipse', attrs: { cx: 50, cy: 58, rx: 6, ry: 4 }, fill: '#c89b74' },
      { type: 'circle', attrs: { cx: 50, cy: 56, r: 2 }, fill: '#2c1810' },
    ],
  },
  {
    id: 'cassiopeia', label: 'cassiopeia', emoji: '👑', color: '#f1c40f',
    dots: [[50,8],[40,26],[22,10],[16,30],[16,52],[84,52],[84,30],[78,10],[60,26]],
    details: [
      { type: 'circle', attrs: { cx: 50, cy: 18, r: 3.5 }, fill: '#e74c3c' },
      { type: 'circle', attrs: { cx: 24, cy: 22, r: 2.5 }, fill: '#3498db' },
      { type: 'circle', attrs: { cx: 76, cy: 22, r: 2.5 }, fill: '#3498db' },
    ],
  },
  {
    id: 'orion', label: 'orion', emoji: '🏹', color: '#8d5a2b',
    dots: [[30,10],[10,30],[6,50],[10,70],[30,90],[38,78],[24,60],[22,50],[24,40],[38,22]],
    details: [
      { type: 'line', attrs: { x1: 14, y1: 50, x2: 68, y2: 50 }, stroke: '#5c3a21', strokeWidth: 2 },
      { type: 'path', attrs: { d: 'M68,46 L78,50 L68,54 Z' }, fill: '#5c3a21' },
      { type: 'line', attrs: { x1: 10, y1: 44, x2: 18, y2: 50 }, stroke: '#5c3a21', strokeWidth: 2 },
      { type: 'line', attrs: { x1: 10, y1: 56, x2: 18, y2: 50 }, stroke: '#5c3a21', strokeWidth: 2 },
    ],
  },
  {
    id: 'ram', label: 'ram', emoji: '🐏', color: '#f0c987',
    dots: mirrorX([[50,14],[38,10],[26,16],[24,28],[20,42],[26,56],[36,64],[50,68]]),
    details: [
      { type: 'path', attrs: { d: 'M34,14 Q24,8 30,2' }, stroke: '#8a6d3b', strokeWidth: 2.5, fill: 'none' },
      { type: 'path', attrs: { d: 'M66,14 Q76,8 70,2' }, stroke: '#8a6d3b', strokeWidth: 2.5, fill: 'none' },
      { type: 'circle', attrs: { cx: 40, cy: 38, r: 2.5 }, fill: '#2c1810' },
      { type: 'circle', attrs: { cx: 60, cy: 38, r: 2.5 }, fill: '#2c1810' },
    ],
  },
  {
    id: 'stier', label: 'stier', emoji: '🐂', color: '#a0522d',
    dots: mirrorX([[50,24],[38,14],[26,10],[30,22],[22,34],[20,50],[28,62],[38,70],[50,74]]),
    details: [
      { type: 'circle', attrs: { cx: 40, cy: 42, r: 2.5 }, fill: '#2c1810' },
      { type: 'circle', attrs: { cx: 60, cy: 42, r: 2.5 }, fill: '#2c1810' },
      { type: 'circle', attrs: { cx: 50, cy: 66, r: 3 }, stroke: '#2c1810', strokeWidth: 1.5, fill: 'none' },
    ],
  },
  {
    id: 'tweelingen', label: 'tweelingen', emoji: '👯', color: '#a29bfe',
    dots: mirrorX([[50,8],[30,14],[22,26],[30,38],[40,48],[30,58],[22,72],[30,86],[50,92]]),
    details: [
      { type: 'circle', attrs: { cx: 42, cy: 24, r: 2 }, fill: '#2c1810' },
      { type: 'circle', attrs: { cx: 58, cy: 24, r: 2 }, fill: '#2c1810' },
      { type: 'path', attrs: { d: 'M42,32 Q50,36 58,32' }, stroke: '#2c1810', strokeWidth: 1.5, fill: 'none' },
      { type: 'circle', attrs: { cx: 42, cy: 68, r: 2 }, fill: '#2c1810' },
      { type: 'circle', attrs: { cx: 58, cy: 68, r: 2 }, fill: '#2c1810' },
      { type: 'path', attrs: { d: 'M42,76 Q50,80 58,76' }, stroke: '#2c1810', strokeWidth: 1.5, fill: 'none' },
    ],
  },
  {
    id: 'leeuw', label: 'leeuw', emoji: '🦁', color: '#f39c12',
    dots: mirrorX([[50,8],[38,16],[28,8],[18,20],[12,18],[10,34],[14,48],[22,58],[32,70],[50,78]]),
    details: [
      { type: 'circle', attrs: { cx: 40, cy: 46, r: 3 }, fill: '#2c1810' },
      { type: 'circle', attrs: { cx: 60, cy: 46, r: 3 }, fill: '#2c1810' },
      { type: 'path', attrs: { d: 'M46,56 L54,56 L50,62 Z' }, fill: '#5c3a21' },
    ],
  },
  {
    id: 'schorpioen', label: 'schorpioen', emoji: '🦂', color: '#6c3483',
    dots: mirrorX([[50,34],[38,30],[26,36],[18,44],[24,50],[20,60],[28,66],[22,74],[32,80],[50,84]]),
    details: [
      { type: 'circle', attrs: { cx: 54, cy: 26, r: 5 }, fill: '#6c3483' },
      { type: 'circle', attrs: { cx: 62, cy: 18, r: 4.5 }, fill: '#6c3483' },
      { type: 'circle', attrs: { cx: 68, cy: 10, r: 4 }, fill: '#6c3483' },
      { type: 'circle', attrs: { cx: 64, cy: 4, r: 3.5 }, fill: '#4a235a' },
      { type: 'circle', attrs: { cx: 44, cy: 44, r: 2 }, fill: '#2c1810' },
      { type: 'circle', attrs: { cx: 56, cy: 44, r: 2 }, fill: '#2c1810' },
    ],
  },
];

export const CONSTELLATIONS = CATALOG.map((c) => ({ ...c, star: true, level: STAR_LEVEL }));

export function getConstellation(id) {
  return CONSTELLATIONS.find((c) => c.id === id);
}
