export function pickOne(array, rng = Math.random) {
  const index = Math.floor(rng() * array.length);
  return array[index];
}

export function shuffle(array, rng = Math.random) {
  const result = array.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
