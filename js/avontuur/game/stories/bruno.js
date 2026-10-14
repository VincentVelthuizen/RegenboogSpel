// "Bruno en het feest": Bruno de beer gaat naar het verjaardagsfeest van Uil.
// Eerst haalt hij een cadeautje — via een parcours — dan steekt hij het bos,
// het meer of de rivier over. Story format: see ../story.js.
export const BRUNO = {
  id: 'bruno',
  title: 'Bruno en het feest',
  emoji: '🐻',
  hero: 'beer',
  start: 'start',
  activities: ['color', 'parcours', 'dots', 'puzzle'],
  nodes: [
    {
      id: 'start', picture: 'beer',
      text: 'Dit is Bruno, een grote bruine beer met een rode sjaal. Vanochtend vond hij een brief: "Kom je op mijn verjaardagsfeest? Groetjes, Uil." Uil woont aan de andere kant van het bos. Bruno wil een cadeautje meenemen. Wat gaat hij halen?',
      choices: [
        { label: 'Mooie bloemen', next: 'tulp' },
        { label: 'Lekkere appels', next: 'appel' },
        { label: 'Zoete honing', next: 'honing' },
      ],
    },

    // ---- Het cadeautje halen (parcours)
    {
      id: 'tulp', picture: 'tulp', course: 'wei', task: 'Breng Bruno naar de bloemen',
      text: 'In de wei staan tulpen in alle kleuren. Bruno plukt een prachtige bos. "Die vindt Uil vast mooi!" Nu snel naar het feest. Welke weg neemt Bruno?',
      choices: [
        { label: 'Door het bos', next: 'bos' },
        { label: 'Over de brug', next: 'brug' },
      ],
    },
    {
      id: 'appel', picture: 'appel', course: 'bos', task: 'Breng Bruno naar de appel',
      text: 'Diep in het bos staat een oude appelboom. Bruno schudt aan de stam en plof, plof, plof! Drie rode appels vallen in het gras. Welke weg neemt Bruno nu?',
      choices: [
        { label: 'Over het meer', next: 'meer' },
        { label: 'Over de brug', next: 'brug' },
      ],
    },
    {
      id: 'honing', picture: 'honing', course: 'bijen', task: 'Breng Bruno naar de honing',
      text: 'Bij de bijenkorf zoemen de bijen. "Mogen jullie een beetje honing missen?" vraagt Bruno. "Voor het feest van Uil? Natuurlijk!" zoemen de bijen. Welke weg neemt Bruno?',
      choices: [
        { label: 'Door het bos', next: 'bos' },
        { label: 'Over het meer', next: 'meer' },
      ],
    },

    // ---- Op weg naar Uil
    {
      id: 'bos', picture: 'boom',
      text: 'Het pad gaat dwars door het bos. Hoog in een boom zit een eekhoorn. "Ga je naar het feest van Uil? Ik ook!" Samen lopen ze verder. Bijna zijn ze er… Wat zien ze?',
      choices: [
        { label: 'Ballonnen in de bomen', next: 'ballonnen' },
        { label: 'Een grote taart', next: 'taart' },
      ],
    },
    {
      id: 'meer', picture: 'boot',
      text: 'Aan het meer ligt een bootje. Bruno stapt in en roeit naar de overkant. Een eend zwemt vrolijk mee. Kwak! Aan de overkant ziet Bruno het huis van Uil al. Wat ziet hij nog meer?',
      choices: [
        { label: 'Een grote taart', next: 'taart' },
        { label: 'Lichtjes in de lucht', next: 'sterren' },
      ],
    },
    {
      id: 'brug', picture: 'brug',
      text: 'Over de rivier ligt een stenen brug. Bruno loopt voorzichtig naar de overkant, met zijn cadeautje stevig vast. Onder de brug springt een vis. Hallo vis! Aan de overkant hoort Bruno muziek. Wat is daar?',
      choices: [
        { label: 'Een feest met ballonnen', next: 'ballonnen' },
        { label: 'Uil staat te wachten', next: 'knuffel' },
      ],
    },

    // ---- Eindes
    {
      id: 'taart', picture: 'taart',
      text: '"Verrassing!" roepen alle dieren als Bruno binnenkomt. Op tafel staat een enorme taart met een kaarsje. Uil blaast het uit en Bruno geeft zijn cadeautje. "Wat lief van je, Bruno!"',
      choices: [],
    },
    {
      id: 'ballonnen', picture: 'ballon',
      text: 'Overal hangen ballonnen: rood, geel en blauw. Bruno geeft Uil zijn cadeautje en Uil is er superblij mee. Dan doen alle dieren ballonnenspelletjes, tot iedereen moe is van het lachen.',
      choices: [],
    },
    {
      id: 'sterren', picture: 'ster',
      text: 'Het feest duurt tot het donker wordt. Alle dieren liggen samen in het gras en kijken naar de sterren. "Dit was mijn allermooiste verjaardag," zegt Uil zachtjes. "Dankzij jou, Bruno."',
      choices: [],
    },
    {
      id: 'knuffel', picture: 'hart',
      text: 'Uil staat al bij de deur te wachten. Als hij het cadeautje ziet, glimmen zijn ogen. "Het mooiste cadeau is dat jij er bent," zegt Uil. En ze geven elkaar een dikke berenknuffel.',
      choices: [],
    },
  ],
};
