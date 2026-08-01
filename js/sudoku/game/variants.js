// Kids variants use colored symbols instead of digits.
export const KIDS_SYMBOLS = {
  kids4: ['🔴', '🟡', '🟢', '🔵'],
  kids6: ['🔴', '🟡', '🟢', '🔵', '🟣', '🟠'],
};

export const VARIANTS = {
  kids4: { size: 4, boxRows: 2, boxCols: 2, clueCount: 10, label: '4x4', kids: true },
  kids6: { size: 6, boxRows: 2, boxCols: 3, clueCount: 20, label: '6x6', kids: true },
  easy: { size: 9, boxRows: 3, boxCols: 3, clueCount: 40, label: 'Makkelijk', kids: false },
  medium: { size: 9, boxRows: 3, boxCols: 3, clueCount: 32, label: 'Gemiddeld', kids: false },
  hard: { size: 9, boxRows: 3, boxCols: 3, clueCount: 26, label: 'Moeilijk', kids: false },
};

export const VARIANT_GROUPS = [
  { id: 'kids', label: 'Kids', emoji: '🧸', variantIds: ['kids4', 'kids6'] },
  { id: 'classic', label: 'Klassiek', emoji: '🔢', variantIds: ['easy', 'medium', 'hard'] },
];
