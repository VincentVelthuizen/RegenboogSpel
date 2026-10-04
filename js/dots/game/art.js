// Shorthands for the `details` of a picture puzzle: small SVG shapes drawn
// on top of the filled outline at reveal time (see ui/board.js). Same 0..100
// space as the dots. Keep them inside the outline so the traced shape stays
// the picture.
export const circle = (cx, cy, r, fill) => ({ type: 'circle', attrs: { cx, cy, r }, fill });

export const ellipse = (cx, cy, rx, ry, fill) => ({ type: 'ellipse', attrs: { cx, cy, rx, ry }, fill });

export const rect = (x, y, width, height, fill, rx = 0) => ({ type: 'rect', attrs: { x, y, width, height, rx }, fill });

export const shape = (d, fill) => ({ type: 'path', attrs: { d }, fill });

export const stroke = (d, color, strokeWidth = 1.5) => ({ type: 'path', attrs: { d }, stroke: color, strokeWidth, fill: 'none' });

export const line = (x1, y1, x2, y2, color, strokeWidth = 1.5) => ({ type: 'line', attrs: { x1, y1, x2, y2 }, stroke: color, strokeWidth });

// Two cartoon eyes: white with a dark pupil looking slightly to one side.
export const eyes = (x1, x2, y, r = 3.2, look = 0.6) => [
  circle(x1, y, r, '#fff'),
  circle(x2, y, r, '#fff'),
  circle(x1 + look, y + 0.3, r * 0.55, '#2c2c2c'),
  circle(x2 + look, y + 0.3, r * 0.55, '#2c2c2c'),
];
