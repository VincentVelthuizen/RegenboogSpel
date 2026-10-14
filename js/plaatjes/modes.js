// The three stand-alone picture games. They share the picture picker and the
// activities of the adventure game (see ../avontuur/ui/).
export const MODES = {
  kleuren: { activity: 'color', title: 'Kleurplaat', icon: '🖍️' },
  legpuzzel: { activity: 'puzzle', title: 'Legpuzzel', icon: '🧩' },
  schuifpuzzel: { activity: 'slide', title: 'Schuifpuzzel', icon: '🔲' },
};

export const DEFAULT_MODE = 'kleuren';

// The mode named in the page's query string (?spel=...), or the default.
export function modeFromSearch(search) {
  const name = new URLSearchParams(search).get('spel');
  return Object.hasOwn(MODES, name) ? name : DEFAULT_MODE;
}
