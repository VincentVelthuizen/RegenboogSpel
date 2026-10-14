import { partBounds } from './geometry.js';

// Colouring page model: a cartoon picture (see dots/game/puzzles.js) is
// coloured region by region. The body (the outline polygon) is one region;
// every filled detail big enough to tap is another. Small accents (eyes,
// pupils, buttons) and lines keep their own colours.
export const PALETTE = [
  '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db',
  '#9b59b6', '#fd79a8', '#8d5524', '#95a5a6',
];

export const BODY = 'body';

const WHITE = ['#fff', '#ffffff'];

// Area of the bounding box of an SVG path.
export function pathBoxArea(d) {
  const b = partBounds({ type: 'path', attrs: { d } });
  return (b.maxX - b.minX) * (b.maxY - b.minY);
}

export function isColorable(part) {
  if (!part.fill || part.fill === 'none') return false;
  const a = part.attrs;
  switch (part.type) {
    case 'circle': return a.r >= 4.5 && !WHITE.includes(part.fill);
    case 'ellipse': return a.rx * a.ry >= 10;
    case 'rect': return a.width * a.height >= 24;
    case 'path': return pathBoxArea(a.d) >= 30;
    default: return false;
  }
}

export const detailRegion = (i) => `d${i}`;

// Ids of all regions the child can colour, body first.
export function colorRegions(picture) {
  const regions = [BODY];
  (picture.details || []).forEach((part, i) => {
    if (isColorable(part)) regions.push(detailRegion(i));
  });
  return regions;
}

export function paint(colors, region, color) {
  return { ...colors, [region]: color };
}

export function isFullyColored(regions, colors) {
  return regions.every((r) => Boolean(colors[r]));
}
