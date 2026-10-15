import { BODY, detailRegion, isColorable } from '../../avontuur/game/coloring.js';
import { pictureBounds } from '../../avontuur/game/geometry.js';

export const SVG_NS = 'http://www.w3.org/2000/svg';

const PAGE_LINE = '#444';
const UNCOLORED = '#fff';

export function svgElement(type, attrs = {}) {
  const el = document.createElementNS(SVG_NS, type);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, String(v)));
  return el;
}

function partElement(part) {
  const el = svgElement(part.type, part.attrs);
  el.style.fill = part.fill || 'none';
  if (part.stroke) el.style.stroke = part.stroke;
  if (part.strokeWidth) el.style.strokeWidth = String(part.strokeWidth);
  el.style.strokeLinecap = 'round';
  el.style.strokeLinejoin = 'round';
  return el;
}

// Draws a cartoon picture into `target` (an <svg> or <g> in the 0..100
// space). Without `colors` it looks like the finished dots picture; with
// `colors` ({ regionId: color }) it is a colouring page: colourable regions
// get a dark outline and are white until coloured, and carry their region id
// in `data-region`. With `{ page: false }` the colours are painted onto the
// finished picture instead (uncoloured regions keep their own colour), e.g.
// for the story's hero as the child coloured them.
export function drawPicture(target, picture, colors = null, { page = colors !== null } = {}) {
  const own = colors || {};
  const body = svgElement('polygon', { points: picture.dots.map(([x, y]) => `${x},${y}`).join(' ') });
  body.style.fill = own[BODY] || (page ? UNCOLORED : picture.fill || picture.color);
  body.style.stroke = page ? PAGE_LINE : picture.color;
  body.style.strokeWidth = '2.5';
  body.style.strokeLinejoin = 'round';
  if (page) body.dataset.region = BODY;
  target.appendChild(body);

  (picture.details || []).forEach((part, i) => {
    const el = partElement(part);
    const region = detailRegion(i);
    if (page && isColorable(part)) {
      el.dataset.region = region;
      el.style.fill = own[region] || UNCOLORED;
      el.style.stroke = PAGE_LINE;
      el.style.strokeWidth = String(part.strokeWidth || 0.9);
    } else if (page) {
      el.style.pointerEvents = 'none';
    } else if (own[region]) {
      el.style.fill = own[region];
    }
    target.appendChild(el);
  });
}

// The finished drawing as a small picture, framed tightly (optionally as
// the child coloured it).
export function pictureThumbnail(picture, colors = null) {
  const box = pictureBounds(picture);
  const svg = svgElement('svg', { viewBox: `${box.x} ${box.y} ${box.width} ${box.height}`, preserveAspectRatio: 'xMidYMid meet' });
  svg.classList.add('picture-thumb');
  svg.setAttribute('aria-hidden', 'true');
  drawPicture(svg, picture, colors);
  return svg;
}

// What a button shows for a picture: its emoji, or — for pictures without a
// fitting emoji (`thumbnail: true`, like the hot air balloon) — the drawing.
export function pictureIcon(picture) {
  return picture.thumbnail ? pictureThumbnail(picture) : document.createTextNode(picture.emoji);
}
