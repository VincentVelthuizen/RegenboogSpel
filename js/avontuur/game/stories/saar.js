// "Saar en Mees vieren feest": Saar en haar babybroertje Mees vieren een
// verjaardag, Kerstmis of Pasen. Ze maken iets lekkers in de keuken, kleden
// zich aan en regelen een cadeautje. Elk stukje verhaal is een versje dat
// per twee regels rijmt (AABB). Story format: see ../story.js.
export const SAAR = {
  id: 'saar',
  title: 'Saar en Mees vieren feest',
  emoji: '👧',
  start: 'start',
  activities: ['color', 'dots', 'puzzle', 'color', 'slide'],
  nodes: [
    {
      id: 'start', picture: 'meisje',
      text: 'Dit is Saar in haar {d3|rode} jurk, zo vrolijk en zo blij,\n'
        + 'en baby Mees, haar broertje, is altijd overal bij.\n'
        + 'Vandaag is er een feest, dat wordt een leuke dag!\n'
        + 'Welk feest gaan ze vieren? Kies maar wat je mag!',
      choices: [
        { label: 'Een verjaardag', next: 'verjaardag' },
        { label: 'Kerstmis', next: 'kerst' },
        { label: 'Pasen', next: 'pasen' },
      ],
    },

    // ---- Welk feest?
    {
      id: 'verjaardag', picture: 'ballon',
      text: 'Oma is jarig, hoera, hoera!\n'
        + 'Saar blaast ballonnen en Mees kijkt ze na.\n'
        + 'Nu snel naar de keuken, met schort en met pan:\n'
        + 'wat bakken ze voor oma? Iets lekkers, dat kan!',
      choices: [
        { label: 'Een taart bakken', next: 'taart' },
        { label: 'Koekjes bakken', next: 'koekjes' },
      ],
    },
    {
      id: 'kerst', picture: 'kerstboom',
      text: 'De kerstboom staat te stralen, met lichtjes in het rond,\n'
        + 'en baby Mees zit stil te kijken, met zijn duim in zijn mond.\n'
        + 'Vanavond is het kerstdiner, dus hup, de keuken in:\n'
        + 'wat maken Saar en Mees? Ze hebben er zo\'n zin!',
      choices: [
        { label: 'Kerstkoekjes bakken', next: 'koekjes' },
        { label: 'Een fruitschaal maken', next: 'appels' },
      ],
    },
    {
      id: 'pasen', picture: 'paasei',
      text: 'Het is Pasen, hoera! De paashaas kwam vannacht\n'
        + 'en heeft in de tuin wel tien eitjes gebracht.\n'
        + 'Dan snel naar de keuken voor het paasontbijt:\n'
        + 'wat maken Saar en Mees? Ze hebben nog tijd!',
      choices: [
        { label: 'Een paastaart bakken', next: 'taart' },
        { label: 'Een fruitschaal maken', next: 'appels' },
      ],
    },

    // ---- In de keuken
    {
      id: 'taart', picture: 'taart',
      text: 'Eieren, suiker, meel en boter: Saar roert het door elkaar,\n'
        + 'en Mees likt de lepel af: mmm, de taart is bijna klaar!\n'
        + 'De taart gaat in de oven, wat ruikt dat fijn!\n'
        + 'Nu nog aankleden: wat zal het zijn?',
      choices: [
        { label: 'Een feestjurk', next: 'jurk' },
        { label: 'Een warme trui', next: 'trui' },
      ],
    },
    {
      id: 'koekjes', picture: 'koekje',
      text: 'Saar kneedt het deeg en rolt het mooi plat,\n'
        + 'Mees snoept stiekem een stukje: mmm, lekker is dat!\n'
        + 'De koekjes zijn klaar, knapperig en warm.\n'
        + 'Nu nog aankleden! Saar neemt Mees op haar arm.',
      choices: [
        { label: 'Een feestjurk', next: 'jurk' },
        { label: 'Een warme trui', next: 'trui' },
      ],
    },
    {
      id: 'appels', picture: 'appel',
      text: 'Appels uit de mand, gesneden in partjes,\n'
        + 'Saar legt ze op een schaal, in de vorm van hartjes.\n'
        + 'Mees mag ook proeven: hap! Wat smaakt dat fijn.\n'
        + 'Nu nog aankleden, dan kunnen ze op tijd zijn.',
      choices: [
        { label: 'Een feestjurk', next: 'jurk' },
        { label: 'Een warme trui', next: 'trui' },
      ],
    },

    // ---- Aankleden
    {
      id: 'jurk', picture: 'jurk',
      text: 'Saar trekt haar {body|roze} feestjurk aan, die zwiert in het rond,\n'
        + 'en Mees krijgt een strikje en rolt blij over de grond.\n'
        + 'Nu nog een cadeautje, dat hoort er toch bij!\n'
        + 'Wat zullen ze geven? "Kies jij maar," zegt Saar blij.',
      choices: [
        { label: 'Een pakje', next: 'pakje' },
        { label: 'Een bos bloemen', next: 'bloemen' },
        { label: 'Een zelfgemaakte kaart', next: 'kaart' },
      ],
    },
    {
      id: 'trui', picture: 'trui',
      text: 'Saar trekt een {body|blauwe} trui aan, zo warm en zo zacht,\n'
        + 'en Mees krijgt een mutsje: hij lacht en hij lacht.\n'
        + 'Nu nog een cadeautje, dat hoort er toch bij!\n'
        + 'Wat zullen ze geven? "Kies jij maar," zegt Saar blij.',
      choices: [
        { label: 'Een pakje', next: 'pakje' },
        { label: 'Een zelfgemaakte kaart', next: 'kaart' },
        { label: 'Een gouden ster', next: 'ster' },
      ],
    },

    // ---- Het cadeautje (eindes)
    {
      id: 'pakje', picture: 'cadeau',
      text: 'Ze pakken het cadeautje in, met papier en een strik,\n'
        + 'en Mees helpt met plakken, met plakband: tik, tik!\n'
        + 'Op het feest is iedereen blij, wat een fijne dag!\n'
        + 'Saar geeft Mees een kusje, en Mees geeft haar een lach.',
      choices: [],
    },
    {
      id: 'bloemen', picture: 'tulp',
      text: 'Saar plukt in de tuin een bos tulpen, zo fijn,\n'
        + 'Mees houdt er één vast, de allerkleinste, zo klein.\n'
        + 'Op het feest roept iedereen: wat een prachtige bos!\n'
        + 'En Mees zwaait met zijn tulp en laat hem niet meer los.',
      choices: [],
    },
    {
      id: 'kaart', picture: 'hart',
      text: 'Saar tekent een kaart met een groot rood hart,\n'
        + 'Mees zet er een vlek op: zijn handtekening, apart!\n'
        + 'Op het feest krijgt de kaart het mooiste plekje aan de wand,\n'
        + 'en Saar en Mees gaan naar huis, samen hand in hand.',
      choices: [],
    },
    {
      id: 'ster', picture: 'ster',
      text: 'Saar knutselt een ster van goud, met veel glans,\n'
        + 'Mees mag hem vasthouden en doet een vrolijke dans.\n'
        + 'Op het feest hangt de ster te stralen, zo mooi en zo fijn.\n'
        + 'Wat kan een cadeautje toch gezellig zijn!',
      choices: [],
    },
  ],
};
