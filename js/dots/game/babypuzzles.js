import { mirrorX } from './shapes.js';
import { circle, ellipse, rect, shape, stroke, line, eyes } from './art.js';

// Babyshower connect-the-dots pictures — reachable via the babyshower hub,
// not part of the regular numbered-level picker. Same cartoon model as the
// regular picture puzzles (see puzzles.js): the dots trace the outline of a
// drawing; on completion it fills with `fill` (outline in `color`) and the
// `details` are drawn on top.
export const BABY_LEVEL = 'baby';

// A small heart centred on (cx, cy).
const heart = (cx, cy, s) => `M${cx},${cy + s * 0.9} C${cx - s * 1.6},${cy - s * 0.1} ${cx - s * 0.7},${cy - s * 1.2} ${cx},${cy - s * 0.4} `
  + `C${cx + s * 0.7},${cy - s * 1.2} ${cx + s * 1.6},${cy - s * 0.1} ${cx},${cy + s * 0.9} Z`;

const CATALOG = [
  { id: 'flesje', label: 'flesje', emoji: '🍼', color: '#2563eb', fill: '#e0f2fe',
    dots: mirrorX([[50,4],[44,8],[43,15],[34,17],[33,25],[37,30],[37,44],[37,58],[37,72],[39,85],[44,91],[50,93]]),
    details: [
      shape('M50,4 L44,8 L43,15 L57,15 L56,8 Z', '#fdba74'),
      shape('M43,15 L34,17 L33,25 L37,30 L63,30 L67,25 L66,17 L57,15 Z', '#93c5fd'),
      shape('M37,50 L63,50 L63,72 L61,85 L56,91 L50,93 L44,91 L39,85 L37,72 Z', '#fff'),
      line(54, 38, 62, 38, '#60a5fa', 1.4), line(57, 44, 62, 44, '#60a5fa', 1.4), line(54, 50, 62, 50, '#60a5fa', 1.4),
      shape(heart(50, 70, 6), '#f472b6'),
    ] },
  { id: 'beertje', label: 'beertje', emoji: '🧸', color: '#7c4a1e', fill: '#c98a4b',
    dots: mirrorX([[50,10],[42,11],[36,8],[29,8],[24,14],[26,21],[29,27],[28,34],[32,40],[38,44],[30,47],[23,53],[21,60],[26,64],[32,61],[32,70],[27,77],[26,86],[32,93],[41,92],[45,86],[50,82]]),
    details: [
      circle(30, 15, 3.5, '#f5d0a9'), circle(70, 15, 3.5, '#f5d0a9'),
      ellipse(50, 34, 8, 6, '#f5d0a9'),
      ellipse(50, 31, 2.6, 1.8, '#3b2414'),
      stroke('M47,36 Q50,39 53,36', '#3b2414', 1.3),
      ...eyes(41, 59, 24, 2.6, 0),
      ellipse(50, 66, 11, 12, '#f5d0a9'),
      ellipse(33, 88, 4, 3, '#f5d0a9'), ellipse(67, 88, 4, 3, '#f5d0a9'),
      shape('M50,46 L43,42 L43,50 Z M50,46 L57,42 L57,50 Z', '#f472b6'), circle(50, 46, 1.8, '#db2777'),
    ] },
  { id: 'badeendje', label: 'badeendje', emoji: '🦆', color: '#d97706', fill: '#facc15',
    dots: [[10,44],[18,51],[27,54],[36,52],[42,46],[44,38],[44,29],[48,22],[55,17],[63,16],[70,20],[75,26],[83,27],[89,32],[82,37],[73,39],[77,48],[80,58],[76,69],[66,77],[52,80],[37,79],[23,74],[14,65],[10,55]],
    details: [
      shape('M75,26 L83,27 L89,32 L82,37 L73,39 Q71,32 75,26 Z', '#fb923c'),
      line(75, 33, 87, 32, '#c2410c', 1),
      circle(62, 27, 3.4, '#fff'), circle(63, 27.5, 2, '#222'), circle(63.7, 26.6, 0.7, '#fff'),
      circle(67, 35, 2.5, '#fca5a5'),
      shape('M30,60 Q44,54 58,62 Q46,73 32,68 Q26,64 30,60 Z', '#eab308'),
      stroke('M36,62 Q44,60 52,63', '#ca8a04', 1.2),
    ] },
  { id: 'strikje', label: 'strikje', emoji: '🎀', color: '#be185d', fill: '#f9a8d4',
    dots: mirrorX([[50,40],[44,38],[36,30],[26,24],[16,22],[9,28],[8,38],[10,48],[16,56],[26,58],[36,54],[42,52],[37,62],[31,74],[27,86],[35,82],[41,87],[43,79],[45,70],[50,62]]),
    details: [
      stroke('M42,44 Q30,34 14,30', '#ec4899', 1.6), stroke('M42,48 Q30,50 16,48', '#ec4899', 1.6),
      stroke('M58,44 Q70,34 86,30', '#ec4899', 1.6), stroke('M58,48 Q70,50 84,48', '#ec4899', 1.6),
      circle(24, 40, 1.6, '#fff'), circle(16, 34, 1.3, '#fff'), circle(30, 50, 1.3, '#fff'),
      circle(76, 40, 1.6, '#fff'), circle(84, 34, 1.3, '#fff'), circle(70, 50, 1.3, '#fff'),
      rect(43, 38, 14, 22, '#ec4899', 5),
      stroke('M47,42 Q50,49 47,56 M53,42 Q50,49 53,56', '#be185d', 1.2),
    ] },
  { id: 'babygezicht', label: 'babygezicht', emoji: '👶', color: '#c2763c', fill: '#fddab1',
    dots: mirrorX([[50,8],[46,15],[40,11],[39,20],[30,25],[22,33],[18,42],[12,44],[8,51],[11,58],[18,60],[21,70],[27,78],[35,84],[43,87],[50,88]]),
    details: [
      shape('M50,8 L46,15 L40,11 L39,20 Q50,16 61,20 L60,11 L54,15 Z', '#a16207'),
      circle(12, 51, 2.4, '#f5b78a'), circle(88, 51, 2.4, '#f5b78a'),
      ...eyes(39, 61, 48, 3.8, 0.4),
      circle(31, 62, 4.5, '#fca5a5'), circle(69, 62, 4.5, '#fca5a5'),
      ellipse(50, 58, 2, 1.4, '#e8a87c'),
      stroke('M43,68 Q50,75 57,68', '#9f1239', 1.6),
    ] },
  { id: 'sokje', label: 'sokje', emoji: '🧦', color: '#0f766e', fill: '#5eead4',
    dots: [[34,8],[44,8],[53,8],[62,8],[62,18],[62,28],[62,38],[64,47],[72,52],[81,56],[88,62],[92,70],[89,78],[81,82],[71,83],[61,82],[51,80],[42,76],[35,69],[32,60],[32,50],[33,40],[33,30],[33,19]],
    details: [
      rect(33.5, 8, 28.5, 11, '#ccfbf1'),
      stroke('M38,9 V18 M43,9 V18 M48,9 V18 M53,9 V18 M58,9 V18', '#5eead4', 1.4),
      rect(33, 28, 29, 5, '#fff'), rect(32.5, 40, 30, 5, '#fff'),
      shape('M32.5,58 Q34,72 46,78 Q49,66 40,58 Z', '#f472b6'),
      shape('M81,56 Q77,70 81,82 L89,78 L92,70 L88,62 Z', '#f472b6'),
    ] },
  { id: 'voetje', label: 'voetje', emoji: '👣', color: '#7c3aed', fill: '#c4b5fd',
    dots: [[50,94],[60,91],[66,84],[68,74],[67,64],[68,54],[71,44],[73,34],[74,24],[71,15],[64,10],[57,12],[53,20],[50,13],[44,12],[40,19],[35,15],[32,22],[26,20],[24,28],[26,38],[29,48],[30,58],[29,68],[31,78],[35,86],[42,92]],
    details: [
      ellipse(65, 16, 3.6, 3, '#ede9fe'), ellipse(47, 16, 2.4, 2, '#ede9fe'),
      ellipse(36, 19, 1.9, 1.6, '#ede9fe'), ellipse(28, 24, 1.6, 1.4, '#ede9fe'),
      stroke('M53,20 Q54,25 56,28 M40,19 Q41,24 43,27 M32,22 Q33,26 35,29', '#8b5cf6', 1.1),
      shape(heart(49, 62, 9), '#f9a8d4'),
    ] },
];

export const BABY_PUZZLES = CATALOG.map((p) => ({ ...p, level: BABY_LEVEL }));

export function getBabyPuzzle(id) {
  return BABY_PUZZLES.find((p) => p.id === id);
}
