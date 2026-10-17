// "Noor en Mo vieren feest": Noor en haar babybroertje Mo vieren een
// verjaardag, Kerstmis of Pasen. Ze maken iets lekkers in de keuken, kleden
// zich aan en regelen een cadeautje. Elk stukje verhaal is een versje dat
// per twee regels rijmt (AABB). Story format: see ../story.js.
export const NOOR = {
  id: 'noor',
  title: 'Noor en Mo vieren feest',
  emoji: '👧',
  start: 'start',
  activities: ['color', 'dots', 'puzzle', 'color', 'slide'],
  nodes: [
    {
      id: 'start', picture: 'meisje',
      text: 'Dit is Noor in haar {d3|rode} jurk, zo vrolijk en zo blij,\n'
        + 'en baby Mo, haar broertje, is altijd overal bij.\n'
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
        + 'Noor blaast ballonnen en Mo kijkt ze na.\n'
        + 'Nu snel naar de keuken, met schort en met pan:\n'
        + 'wat gaan ze er maken? Wie weet hoe dat kan?',
      choices: [
        { label: 'Een taart bakken', next: 'taart' },
        { label: 'Koekjes bakken', next: 'koekjes' },
      ],
    },
    {
      id: 'kerst', picture: 'kerstboom',
      text: 'De kerstboom staat te stralen, met lichtjes in het rond,\n'
        + 'en baby Mo zit stil te kijken, met zijn duim in zijn mond.\n'
        + 'Vanavond is het kerstdiner, dus hup, de keuken in:\n'
        + 'wat maken Noor en Mo? Ze hebben er zo\'n zin!',
      choices: [
        { label: 'Kerstkoekjes bakken', next: 'koekjes' },
        { label: 'Appels poffen', next: 'appels' },
      ],
    },
    {
      id: 'pasen', picture: 'paasei',
      text: 'Het is Pasen, hoera! De paashaas kwam vannacht\n'
        + 'en heeft in de tuin wel tien eitjes gebracht.\n'
        + 'Dan snel naar de keuken voor het paasontbijt:\n'
        + 'wat maken Noor en Mo? Ze hebben nog tijd!',
      choices: [
        { label: 'Een paastaart bakken', next: 'taart' },
        { label: 'Een fruitschaal maken', next: 'appels' },
      ],
    },

    // ---- In de keuken
    {
      id: 'taart', picture: 'taart',
      text: 'Eieren, suiker, meel en boter: alles gaat erin.\n'
        + 'Noor roert en roert, en Mo heeft er zin.\n'
        + 'De taart gaat in de oven, wat ruikt dat fijn!\n'
        + 'Nu nog aankleden: wat zal het zijn?',
      choices: [
        { label: 'Een feestjurk', next: 'jurk' },
        { label: 'Een warme trui', next: 'trui' },
      ],
    },
    {
      id: 'koekjes', picture: 'koekje',
      text: 'Noor kneedt het deeg en rolt het mooi plat,\n'
        + 'Mo snoept stiekem een stukje: mmm, lekker is dat!\n'
        + 'De koekjes zijn klaar, knapperig en warm.\n'
        + 'Nu nog aankleden! Noor neemt Mo op haar arm.',
      choices: [
        { label: 'Een feestjurk', next: 'jurk' },
        { label: 'Een warme trui', next: 'trui' },
      ],
    },
    {
      id: 'appels', picture: 'appel',
      text: 'Appels uit de mand, gesneden in partjes,\n'
        + 'Noor legt ze op een schaal, in de vorm van hartjes.\n'
        + 'Mo mag ook proeven: hap! Wat smaakt dat fijn.\n'
        + 'Nu nog aankleden, dan kunnen ze op tijd zijn.',
      choices: [
        { label: 'Een feestjurk', next: 'jurk' },
        { label: 'Een warme trui', next: 'trui' },
      ],
    },

    // ---- Aankleden
    {
      id: 'jurk', picture: 'jurk',
      text: 'Noor trekt haar {body|roze} feestjurk aan, die zwiert in het rond,\n'
        + 'en Mo krijgt een strikje, hij rolt over de grond.\n'
        + 'Nu nog een cadeautje, dat mogen ze niet vergeten.\n'
        + 'Wat zullen ze geven? Dat moet Noor nog weten!',
      choices: [
        { label: 'Een pakje', next: 'pakje' },
        { label: 'Een bos bloemen', next: 'bloemen' },
        { label: 'Een zelfgemaakte kaart', next: 'kaart' },
      ],
    },
    {
      id: 'trui', picture: 'trui',
      text: 'Noor trekt een {body|blauwe} trui aan, zo warm en zo zacht,\n'
        + 'en Mo krijgt een mutsje: hij lacht en hij lacht.\n'
        + 'Nu nog een cadeautje, dat mogen ze niet vergeten.\n'
        + 'Wat zullen ze geven? Dat moet Noor nog weten!',
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
        + 'en Mo helpt met plakken: een plak en een klik!\n'
        + 'Op het feest is iedereen blij, wat een fijne dag!\n'
        + 'En Noor geeft Mo een kusje, omdat hij helpen mag.',
      choices: [],
    },
    {
      id: 'bloemen', picture: 'tulp',
      text: 'Noor plukt in de tuin een bos tulpen, zo fijn,\n'
        + 'Mo houdt er één vast, de allerkleinste, zo klein.\n'
        + 'Op het feest roept iedereen: wat een prachtige bos!\n'
        + 'En Mo klapt in zijn handjes en laat zijn tulp niet los.',
      choices: [],
    },
    {
      id: 'kaart', picture: 'hart',
      text: 'Noor tekent een kaart met een groot rood hart,\n'
        + 'Mo maakt er een vlek op: dat is zijn handtekening, apart!\n'
        + 'Op het feest krijgt de kaart het mooiste plekje aan de wand,\n'
        + 'en Noor en Mo gaan naar huis, samen hand in hand.',
      choices: [],
    },
    {
      id: 'ster', picture: 'ster',
      text: 'Noor knutselt een ster van goud en vol glans,\n'
        + 'Mo mag hem vasthouden en doet een vrolijke dans.\n'
        + 'Op het feest hangt de ster te stralen, zo mooi en zo fijn.\n'
        + 'Wat kan een cadeautje toch gezellig zijn!',
      choices: [],
    },
  ],
};
