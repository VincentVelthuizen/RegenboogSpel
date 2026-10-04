import { projectStars, minSpacing } from './sky.js';

// Sterrenbeelden (constellations) — the "✨" star level.
//
// Every dot is a real star, placed at its true position in the sky: right
// ascension / declination (J2000, degrees) and visual magnitude come from the
// Hipparcos catalogue as packaged by d3-celestial (BSD-3-Clause), and
// `lines` are the traditional constellation stick figures from the same
// source. sky.js projects them like a star chart (north up, east left).
// A few faint or tightly clustered stars are left out so every dot stays
// tappable; where one was dropped its two lines are joined.
//
// Stars are listed in tap order. When two consecutive stars are not joined
// by a real line, no line is drawn between them while playing (the next star
// just pulses); the remaining lines light up when the figure is finished.
export const STAR_LEVEL = 'star';

const CATALOG = [
  {
    id: 'grote-beer', label: 'grote beer', emoji: '🐻', color: '#8fb6ff',
    stars: [
      { name: 'Alkaid',          ra: 206.8852, dec:  49.3133, mag: 1.85 },
      { name: 'Mizar',           ra: 200.9814, dec:  54.9254, mag: 2.23 },
      { name: 'Alioth',          ra: 193.5073, dec:  55.9598, mag: 1.76 },
      { name: 'Megrez',          ra: 183.8565, dec:  57.0326, mag: 3.32 },
      { name: 'Phecda',          ra: 178.4577, dec:  53.6948, mag: 2.41 },
      { name: 'Merak',           ra: 165.4603, dec:  56.3824, mag: 2.34 },
      { name: 'Dubhe',           ra: 165.9320, dec:  61.7510, mag: 1.81 },
      { name: 'h 23 UMa',        ra: 142.8821, dec:  63.0619, mag: 3.65 },
      { name: 'Muscida',         ra: 127.5661, dec:  60.7182, mag: 3.35 },
      { name: 'υ 29 UMa',        ra: 147.7473, dec:  59.0387, mag: 3.78 },
      { name: 'θ 25 UMa',        ra: 143.2143, dec:  51.6773, mag: 3.17 },
      { name: 'Talitha',         ra: 134.8019, dec:  48.0418, mag: 3.12 },
      { name: 'Tania Australis', ra: 155.5823, dec:  41.4995, mag: 3.06 },
      { name: 'ψ 52 UMa',        ra: 167.4159, dec:  44.4985, mag: 3 },
      { name: 'Taiyangshou',     ra: 176.5126, dec:  47.7794, mag: 3.69 },
      { name: 'Alula Borealis',  ra: 169.6197, dec:  33.0943, mag: 3.49 },
    ],
    lines: [
      ['Megrez', 'Alioth'], ['Phecda', 'Megrez'], ['Dubhe', 'Megrez'],
      ['h 23 UMa', 'Dubhe'], ['Merak', 'Dubhe'], ['θ 25 UMa', 'Merak'],
      ['υ 29 UMa', 'Merak'], ['Merak', 'Phecda'], ['Taiyangshou', 'Phecda'],
      ['Alioth', 'Mizar'], ['Mizar', 'Alkaid'], ['ψ 52 UMa', 'Taiyangshou'],
      ['Alula Borealis', 'Taiyangshou'], ['Tania Australis', 'ψ 52 UMa'], ['Muscida', 'h 23 UMa'],
      ['Muscida', 'υ 29 UMa'], ['Talitha', 'θ 25 UMa'],
    ],
  },
  {
    id: 'cassiopeia', label: 'cassiopeia', emoji: '👑', color: '#f7d774',
    stars: [
      { name: 'Caph',    ra:   2.2945, dec:  59.1498, mag: 2.28 },
      { name: 'Shedar',  ra:  10.1268, dec:  56.5373, mag: 2.24 },
      { name: 'Navi',    ra:  14.1772, dec:  60.7167, mag: 2.15 },
      { name: 'Ruchbah', ra:  21.4540, dec:  60.2353, mag: 2.66 },
      { name: 'Segin',   ra:  28.5989, dec:  63.6701, mag: 3.35 },
    ],
    lines: [
      ['Ruchbah', 'Segin'], ['Navi', 'Ruchbah'], ['Shedar', 'Navi'],
      ['Caph', 'Shedar'],
    ],
  },
  {
    id: 'orion', label: 'orion', emoji: '🏹', color: '#9fe0ff',
    stars: [
      { name: 'Rigel',          ra:  78.6345, dec:  -8.2016, mag: 0.18 },
      { name: 'Saif al Jabbar', ra:  81.1192, dec:  -2.3971, mag: 3.35 },
      { name: 'Alnilam',        ra:  84.0534, dec:  -1.2019, mag: 1.69 },
      { name: 'Mintaka',        ra:  83.0017, dec:  -0.2991, mag: 2.25 },
      { name: 'Bellatrix',      ra:  81.2828, dec:   6.3497, mag: 1.64 },
      { name: 'Meissa',         ra:  83.7845, dec:   9.9342, mag: 3.39 },
      { name: 'Betelgeuse',     ra:  88.7929, dec:   7.4071, mag: 0.45 },
      { name: 'Alnitak',        ra:  85.1897, dec:  -1.9426, mag: 1.74 },
      { name: 'Saiph',          ra:  86.9391, dec:  -9.6696, mag: 2.07 },
    ],
    lines: [
      ['Alnitak', 'Betelgeuse'], ['Meissa', 'Betelgeuse'], ['Bellatrix', 'Betelgeuse'],
      ['Bellatrix', 'Meissa'], ['Bellatrix', 'Mintaka'], ['Rigel', 'Saif al Jabbar'],
      ['Saif al Jabbar', 'Mintaka'], ['Mintaka', 'Alnilam'], ['Alnilam', 'Alnitak'],
      ['Alnitak', 'Saiph'],
    ],
  },
  {
    id: 'ram', label: 'ram', emoji: '🐏', color: '#ffc48a',
    stars: [
      { name: 'Bharani',   ra:  42.4960, dec:  27.2605, mag: 3.61 },
      { name: 'Hamal',     ra:  31.7934, dec:  23.4624, mag: 2.01 },
      { name: 'Sheratan',  ra:  28.6600, dec:  20.8080, mag: 2.64 },
      { name: 'Mesarthim', ra:  28.3826, dec:  19.2939, mag: 3.88 },
    ],
    lines: [
      ['Hamal', 'Bharani'], ['Sheratan', 'Hamal'], ['Mesarthim', 'Sheratan'],
    ],
  },
  {
    id: 'stier', label: 'stier', emoji: '🐂', color: '#ff9f8a',
    stars: [
      { name: 'Elnath',         ra:  81.5730, dec:  28.6075, mag: 1.65 },
      { name: 'Ain',            ra:  67.1542, dec:  19.1804, mag: 3.53 },
      { name: 'Secunda Hyadum', ra:  65.7337, dec:  17.5425, mag: 3.77 },
      { name: 'λ 35 Tau',       ra:  60.1701, dec:  12.4903, mag: 3.41 },
      { name: 'Prima Hyadum',   ra:  64.9483, dec:  15.6276, mag: 3.65 },
      { name: 'Aldebaran',      ra:  68.9802, dec:  16.5093, mag: 0.87 },
      { name: 'Tianguan',       ra:  84.4112, dec:  21.1425, mag: 2.97 },
    ],
    lines: [
      ['Aldebaran', 'Tianguan'], ['Prima Hyadum', 'Aldebaran'], ['λ 35 Tau', 'Prima Hyadum'],
      ['Prima Hyadum', 'Secunda Hyadum'], ['Secunda Hyadum', 'Ain'], ['Ain', 'Elnath'],
    ],
  },
  {
    id: 'tweelingen', label: 'tweelingen', emoji: '👯', color: '#c3b8ff',
    stars: [
      { name: 'Propus',   ra:  93.7194, dec:  22.5068, mag: 3.31 },
      { name: 'Tejat',    ra:  95.7401, dec:  22.5136, mag: 2.87 },
      { name: 'Mebsuta',  ra: 100.9830, dec:  25.1311, mag: 3.06 },
      { name: 'τ 46 Gem', ra: 107.7849, dec:  30.2452, mag: 4.41 },
      { name: 'Castor',   ra: 113.6494, dec:  31.8883, mag: 1.58 },
      { name: 'Pollux',   ra: 116.3290, dec:  28.0262, mag: 1.16 },
      { name: 'υ 69 Gem', ra: 113.9806, dec:  26.8957, mag: 4.06 },
      { name: 'Wasat',    ra: 110.0307, dec:  21.9823, mag: 3.5 },
      { name: 'λ 54 Gem', ra: 109.5232, dec:  16.5404, mag: 3.58 },
      { name: 'Mekbuda',  ra: 106.0272, dec:  20.5703, mag: 4.01 },
      { name: 'Alhena',   ra:  99.4279, dec:  16.3993, mag: 1.93 },
      { name: 'Alzirr',   ra: 101.3224, dec:  12.8956, mag: 3.35 },
    ],
    lines: [
      ['Propus', 'Tejat'], ['Tejat', 'Mebsuta'], ['Mebsuta', 'τ 46 Gem'],
      ['τ 46 Gem', 'Castor'], ['Castor', 'Pollux'], ['υ 69 Gem', 'Pollux'],
      ['Wasat', 'υ 69 Gem'], ['λ 54 Gem', 'Wasat'], ['Mekbuda', 'Wasat'],
      ['Alhena', 'Mekbuda'], ['Alhena', 'Alzirr'],
    ],
  },
  {
    id: 'leeuw', label: 'leeuw', emoji: '🦁', color: '#ffd27a',
    stars: [
      { name: 'Algenubi',  ra: 146.4628, dec:  23.7743, mag: 2.97 },
      { name: 'Rasalas',   ra: 148.1909, dec:  26.0070, mag: 3.88 },
      { name: 'Adhafera',  ra: 154.1726, dec:  23.4173, mag: 3.43 },
      { name: 'Algieba',   ra: 154.9931, dec:  19.8415, mag: 2.01 },
      { name: 'Zosma',     ra: 168.5271, dec:  20.5237, mag: 2.56 },
      { name: 'Denebola',  ra: 177.2649, dec:  14.5721, mag: 2.14 },
      { name: 'Chertan',   ra: 168.5600, dec:  15.4296, mag: 3.33 },
      { name: 'Regulus',   ra: 152.0930, dec:  11.9672, mag: 1.36 },
      { name: 'Al Jabhah', ra: 151.8331, dec:  16.7627, mag: 3.48 },
    ],
    lines: [
      ['Regulus', 'Chertan'], ['Al Jabhah', 'Regulus'], ['Al Jabhah', 'Algieba'],
      ['Adhafera', 'Algieba'], ['Algieba', 'Zosma'], ['Zosma', 'Denebola'],
      ['Chertan', 'Denebola'], ['Rasalas', 'Adhafera'], ['Algenubi', 'Rasalas'],
    ],
  },
  {
    id: 'schorpioen', label: 'schorpioen', emoji: '🦂', color: '#ff8fb1',
    stars: [
      { name: 'Shaula',     ra: 263.4022, dec: -37.1038, mag: 1.62 },
      { name: 'Mula',       ra: 265.6220, dec: -39.0300, mag: 2.39 },
      { name: 'Sargas',     ra: 264.3297, dec: -42.9978, mag: 1.86 },
      { name: 'η Sco',      ra: 258.0383, dec: -43.2392, mag: 3.32 },
      { name: 'Grafias',    ra: 253.6459, dec: -42.3613, mag: 3.62 },
      { name: 'Xamidimura', ra: 252.9676, dec: -38.0474, mag: 3 },
      { name: 'Larawag',    ra: 252.5409, dec: -34.2932, mag: 2.29 },
      { name: 'Paikauhale', ra: 248.9706, dec: -28.2160, mag: 2.82 },
      { name: 'Antares',    ra: 247.3519, dec: -26.4320, mag: 1.06 },
      { name: 'Alniyat',    ra: 245.2972, dec: -25.5928, mag: 2.9 },
      { name: 'Fang',       ra: 239.7130, dec: -26.1141, mag: 2.89 },
      { name: 'Dschubba',   ra: 240.0834, dec: -22.6217, mag: 2.29 },
      { name: 'Acrab',      ra: 241.3593, dec: -19.8055, mag: 2.56 },
    ],
    lines: [
      ['Fang', 'Dschubba'], ['Dschubba', 'Alniyat'], ['Dschubba', 'Acrab'],
      ['Alniyat', 'Antares'], ['Antares', 'Paikauhale'], ['Paikauhale', 'Larawag'],
      ['Larawag', 'Xamidimura'], ['Xamidimura', 'Grafias'], ['Grafias', 'η Sco'],
      ['η Sco', 'Sargas'], ['Sargas', 'Mula'], ['Shaula', 'Mula'],
    ],
  },
];

function compile({ stars, lines, ...rest }) {
  const index = new Map(stars.map((s, i) => [s.name, i]));
  const dots = projectStars(stars);
  return {
    ...rest,
    star: true,
    level: STAR_LEVEL,
    dots,
    starNames: stars.map((s) => s.name),
    mags: stars.map((s) => s.mag),
    lines: lines.map(([a, b]) => [index.get(a), index.get(b)]),
    // Dense figures (Orion's belt!) get smaller dots so neighbours don't merge.
    dotRadius: Math.min(5, Math.max(2.2, minSpacing(dots) * 0.4)),
  };
}

export const CONSTELLATIONS = CATALOG.map(compile);

export function getConstellation(id) {
  return CONSTELLATIONS.find((c) => c.id === id);
}
