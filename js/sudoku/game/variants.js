// Kids and babyshower variants use symbols (colored dots or emoji) instead of digits.
export const SYMBOL_SETS = {
  kids4: ['🔴', '🟡', '🟢', '🔵'],
  kids6: ['🔴', '🟡', '🟢', '🔵', '🟣', '🟠'],
  baby4: ['🍼', '👶', '🧸', '🎀'],
  baby6: ['🍼', '👶', '🧸', '🎀', '🦆', '🧦'],
};

export const VARIANTS = {
  kids4: { size: 4, boxRows: 2, boxCols: 2, clueCount: 10, label: '4x4', kids: true },
  kids6: { size: 6, boxRows: 2, boxCols: 3, clueCount: 20, label: '6x6', kids: true },
  easy: { size: 9, boxRows: 3, boxCols: 3, clueCount: 40, label: 'Makkelijk', kids: false },
  medium: { size: 9, boxRows: 3, boxCols: 3, clueCount: 32, label: 'Gemiddeld', kids: false },
  hard: { size: 9, boxRows: 3, boxCols: 3, clueCount: 26, label: 'Moeilijk', kids: false },
  baby4: { size: 4, boxRows: 2, boxCols: 2, clueCount: 10, label: '4x4', kids: true },
  baby6: { size: 6, boxRows: 2, boxCols: 3, clueCount: 20, label: '6x6', kids: true },
};

export const VARIANT_GROUPS = [
  { id: 'kids', label: 'Kids', emoji: '🧸', variantIds: ['kids4', 'kids6'] },
  { id: 'classic', label: 'Klassiek', emoji: '🔢', variantIds: ['easy', 'medium', 'hard'] },
];

export const BABY_VARIANT_GROUP = { id: 'babyshower', label: 'Babyshower', emoji: '🎉', variantIds: ['baby4', 'baby6'] };
