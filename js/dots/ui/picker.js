const SVG_NS = 'http://www.w3.org/2000/svg';

// A small dot-to-dot icon hinting at difficulty: more dots = harder level.
function levelIcon(level) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('class', 'level-icon');

  const n = level + 1; // 2..5 dots
  const pts = [];
  for (let i = 0; i < n; i++) {
    const x = 15 + (70 * i) / (n - 1);
    const y = i % 2 === 0 ? 64 : 36;
    pts.push([x, y]);
  }

  const line = document.createElementNS(SVG_NS, 'polyline');
  line.setAttribute('class', 'level-icon-line');
  line.setAttribute('points', pts.map((p) => p.join(',')).join(' '));
  svg.appendChild(line);

  pts.forEach(([x, y]) => {
    const dot = document.createElementNS(SVG_NS, 'circle');
    dot.setAttribute('class', 'level-icon-dot');
    dot.setAttribute('cx', String(x));
    dot.setAttribute('cy', String(y));
    dot.setAttribute('r', '8');
    svg.appendChild(dot);
  });

  return svg;
}

function backButton(onBack) {
  const btn = document.createElement('button');
  btn.className = 'emoji-btn back-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'terug');
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('class', 'back-icon');
  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('d', 'M14.5 5l-7 7 7 7');
  svg.appendChild(path);
  btn.appendChild(svg);
  btn.addEventListener('click', onBack);
  return btn;
}

export function renderLevelSelect(levels, onSelectLevel) {
  const container = document.getElementById('picker');
  container.innerHTML = '';

  levels.forEach((level) => {
    const btn = document.createElement('button');
    btn.className = 'emoji-btn level-btn';
    btn.type = 'button';
    btn.setAttribute('aria-label', `niveau ${level}`);
    btn.appendChild(levelIcon(level));
    btn.addEventListener('click', () => onSelectLevel(level));
    container.appendChild(btn);
  });
}

export function renderPuzzlePicker(puzzles, onSelect, onBack) {
  const container = document.getElementById('picker');
  container.innerHTML = '';

  container.appendChild(backButton(onBack));

  puzzles.forEach((puzzle) => {
    const btn = document.createElement('button');
    btn.className = 'emoji-btn';
    btn.type = 'button';
    btn.textContent = puzzle.emoji;
    btn.setAttribute('aria-label', puzzle.label);
    btn.addEventListener('click', () => onSelect(puzzle.id));
    container.appendChild(btn);
  });
}
