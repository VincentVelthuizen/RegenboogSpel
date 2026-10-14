import { bindBoard, renderBoard, revealPicture } from '../../dots/ui/board.js';
import { recordDotTap } from '../../dots/game/state.js';
import { svgElement } from '../../dots/ui/picture.js';

// Connect-the-dots, exactly like the dots game (same board + reveal).
export function startDotsActivity(container, picture, onDone) {
  const board = svgElement('svg', { id: 'board', viewBox: '0 0 100 100', preserveAspectRatio: 'xMidYMid meet' });
  board.classList.add('activity-board');
  container.appendChild(board);

  let state = { screen: 'playing', nextDotIndex: 0 };
  bindBoard((i) => {
    if (state.screen !== 'playing') return;
    const before = state.nextDotIndex;
    state = recordDotTap(state, i, picture.dots.length);
    if (state.nextDotIndex === before) return;
    renderBoard(picture, state, before);
    if (state.screen === 'celebrating') {
      revealPicture(picture);
      onDone(null);
    }
  });
  renderBoard(picture, state);
}
