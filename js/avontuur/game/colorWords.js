import { PALETTE } from './coloring.js';

// Dutch colour words for the palette colours, inflected as before a de-word
// ("een rode sjaal", "de groene auto").
export const COLOR_WORDS = {
  [PALETTE[0]]: 'rode',
  [PALETTE[1]]: 'oranje',
  [PALETTE[2]]: 'gele',
  [PALETTE[3]]: 'groene',
  [PALETTE[4]]: 'blauwe',
  [PALETTE[5]]: 'paarse',
  [PALETTE[6]]: 'roze',
  [PALETTE[7]]: 'bruine',
  [PALETTE[8]]: 'grijze',
};

// Story texts can mention the colours the child chose:
//   {region|default}          a region of this step's picture
//   {picture.region|default}  a region of a picture coloured earlier
// `region` is 'body' or a detail region like 'd5' (see coloring.js). When
// the child didn't colour it, the default word is used.
const PLACEHOLDER = /\{(?:([\w-]+)\.)?(\w+)\|([^}]*)\}/g;

export function colorPlaceholders(text) {
  return [...text.matchAll(PLACEHOLDER)].map(([, picture, region, fallback]) => ({ picture, region, fallback }));
}

// `colorsByPicture`: { pictureId: { region: colour } } for everything the
// child coloured so far; `picture`: this step's picture id.
export function fillColorWords(text, colorsByPicture, picture) {
  return text.replace(PLACEHOLDER, (_, pictureId, region, fallback) => {
    const colors = colorsByPicture[pictureId || picture];
    const color = colors && colors[region];
    return COLOR_WORDS[color] || fallback;
  });
}
