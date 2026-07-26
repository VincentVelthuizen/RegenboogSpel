export function randomFace(rng = Math.random) {
  return Math.floor(rng() * 6) + 1;
}

export function createDice(count = 5) {
  return Array.from({ length: count }, () => ({ value: null, held: false }));
}

// Rolls every die that isn't held. Held dice keep their current value.
export function rollDice(dice, rng = Math.random) {
  return dice.map((die) => (die.held ? die : { ...die, value: randomFace(rng) }));
}

export function toggleHeld(dice, index) {
  return dice.map((die, i) => (i === index ? { ...die, held: !die.held } : die));
}

export function setManualValue(dice, index, value) {
  return dice.map((die, i) => (i === index ? { ...die, value } : die));
}

export function diceValues(dice) {
  return dice.map((die) => die.value);
}

export function allDiceSet(dice) {
  return dice.every((die) => die.value !== null);
}
