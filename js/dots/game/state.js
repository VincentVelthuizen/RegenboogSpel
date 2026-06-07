export function createInitialState() {
  return {
    screen: 'levels',
    level: null,
    puzzleId: null,
    nextDotIndex: 0,
    tapsAreLocked: false,
  };
}

export function selectLevel(state, level) {
  return {
    ...state,
    screen: 'picking',
    level,
    puzzleId: null,
    nextDotIndex: 0,
    tapsAreLocked: false,
  };
}

export function selectPuzzle(state, puzzleId) {
  return {
    ...state,
    screen: 'playing',
    puzzleId,
    nextDotIndex: 0,
    tapsAreLocked: false,
  };
}

export function recordDotTap(state, index, dotCount) {
  if (index !== state.nextDotIndex) return state;

  const nextDotIndex = state.nextDotIndex + 1;

  if (nextDotIndex >= dotCount) {
    return {
      ...state,
      nextDotIndex,
      screen: 'celebrating',
    };
  }

  return {
    ...state,
    nextDotIndex,
  };
}

// Back to the picker for the current level (keeps `level`).
export function backToPicker(state) {
  return {
    ...state,
    screen: 'picking',
    puzzleId: null,
    nextDotIndex: 0,
    tapsAreLocked: false,
  };
}

// Back to the difficulty-level selection screen.
export function backToLevels(_state) {
  return createInitialState();
}
