import { mirrorX } from './shapes.js';

// Babyshower connect-the-dots pictures — reachable via the babyshower hub,
// not part of the regular numbered-level picker. Same closed-loop mechanic
// as the regular picture puzzles (see puzzles.js): { id, label, emoji,
// color, dots } with the dots forming a closed loop, filled + emoji-stamped
// on completion.
export const BABY_LEVEL = 'baby';

const CATALOG = [
  { id: 'flesje', label: 'flesje', emoji: '🍼', color: '#74b9ff',
    dots: mirrorX([[50,8],[45,14],[46,20],[40,28],[37,38],[37,80],[44,90],[50,94]]) },
  { id: 'beertje', label: 'beertje', emoji: '🧸', color: '#c98a4b',
    dots: mirrorX([[50,20],[40,12],[30,18],[24,30],[28,42],[20,52],[18,68],[28,82],[40,90],[50,94]]) },
  { id: 'badeendje', label: 'badeendje', emoji: '🦆', color: '#f9ca24',
    dots: [[20,70],[14,58],[20,42],[34,30],[40,18],[54,14],[62,20],[78,26],[80,32],[68,36],[58,34],[52,44],[46,64],[36,78],[20,82]] },
  { id: 'strikje', label: 'strikje', emoji: '🎀', color: '#fd79a8',
    dots: [[15,15],[50,42],[85,15],[85,75],[50,58],[15,75]] },
  { id: 'babygezicht', label: 'babygezicht', emoji: '👶', color: '#fddab1',
    dots: mirrorX([[50,10],[40,12],[30,20],[20,36],[22,54],[30,68],[40,76],[50,78]]) },
  { id: 'sokje', label: 'sokje', emoji: '🧦', color: '#55efc4',
    dots: [[38,10],[60,10],[62,34],[62,50],[78,54],[92,64],[86,78],[62,80],[46,68],[38,50],[36,34]] },
  { id: 'voetje', label: 'voetje', emoji: '👣', color: '#a29bfe',
    dots: [[35,90],[30,70],[32,50],[26,42],[24,34],[28,26],[36,18],[46,14],[54,22],[52,36],[56,50],[58,68],[52,88]] },
];

export const BABY_PUZZLES = CATALOG.map((p) => ({ ...p, level: BABY_LEVEL }));

export function getBabyPuzzle(id) {
  return BABY_PUZZLES.find((p) => p.id === id);
}
