// "Het avontuur van Pip": Pip de poes gaat op avontuur, met de auto, de boot
// of de luchtballon. Story format: see ../story.js.
export const PIP = {
  id: 'pip',
  title: 'Pip de poes',
  emoji: '🐱',
  start: 'start',
  activities: ['dots', 'color', 'puzzle'],
  nodes: [
    {
      id: 'start', picture: 'poes',
      text: 'Dit is Pip, een nieuwsgierige poes. Het is een zonnige ochtend en Pip wil op avontuur! Hoe gaat Pip op pad?',
      choices: [
        { label: 'Met de auto', next: 'auto' },
        { label: 'Met de boot', next: 'boot' },
        { label: 'Met de luchtballon', next: 'ballon' },
      ],
    },

    // ---- Hoe gaat Pip op pad?
    {
      id: 'auto', picture: 'auto',
      text: 'Vroem vroem! Pip rijdt in haar {body|rode} auto over de weg, langs weilanden en bomen. Bij een groot bos stopt ze. Tussen de bomen beweegt iets… Wat is het?',
      choices: [
        { label: 'Iets dat fladdert', next: 'vlinder' },
        { label: 'Iets dat kruipt', next: 'schildpad' },
      ],
    },
    {
      id: 'boot', picture: 'boot',
      text: 'Pip stapt in een bootje met {d0|witte} zeilen. De wind blaast en het bootje vaart de zee op. Plons! Naast de boot zwemt iets… Wat is het?',
      choices: [
        { label: 'Iets met vinnen', next: 'vis' },
        { label: 'Iets met acht armen', next: 'octopus' },
      ],
    },
    {
      id: 'ballon', picture: 'luchtballon',
      text: 'Pip klimt in het mandje van een grote {body|rode} luchtballon. Wieee! Ze zweeft omhoog, hoog boven de huizen en de bomen. In de verte ziet ze twee dingen. Waar vliegt Pip naartoe?',
      choices: [
        { label: 'Naar het kasteel', next: 'kasteel' },
        { label: 'Naar de raket', next: 'raket' },
      ],
    },

    // ---- Wie komt Pip tegen?
    {
      id: 'vlinder', picture: 'vlinder',
      text: 'Pip stapt uit haar {auto.body|rode} auto. Een prachtige vlinder fladdert om haar heen. "Hallo Pip, ik ben Fleur!" zegt de vlinder. "Ik weet twee geheime plekjes in het bos. Welke wil je zien?"',
      choices: [
        { label: 'De bloemenwei', next: 'tulp' },
        { label: 'De grote boom', next: 'boom' },
      ],
    },
    {
      id: 'schildpad', picture: 'schildpad',
      text: 'Op het pad kruipt een schildpad. Heel, heel langzaam. "Hallo, ik ben Sam," zegt hij. "Ik heb zo\'n honger, en mijn huis is nog zo ver weg." Hoe helpt Pip Sam?',
      choices: [
        { label: 'Eten zoeken', next: 'appel' },
        { label: 'Sam thuisbrengen', next: 'huis' },
      ],
    },
    {
      id: 'vis', picture: 'vis',
      text: 'Een blauwe vis springt uit het water. "Hoi Pip, ik ben Bubbel!" Hij spettert vrolijk. "Zullen we naar de bodem van de zee duiken, of naar het eiland varen?"',
      choices: [
        { label: 'Naar de bodem', next: 'krab' },
        { label: 'Naar het eiland', next: 'cactus' },
      ],
    },
    {
      id: 'octopus', picture: 'octopus',
      text: 'Een roze octopus zwaait met al haar acht armen. "Hallo, ik ben Otje!" zegt ze. "Op de bodem van de zee heb ik een schat gevonden. En ik heb een grappige vriend. Wat wil je zien?"',
      choices: [
        { label: 'De schat', next: 'ruit' },
        { label: 'De vriend', next: 'krab' },
      ],
    },
    {
      id: 'kasteel', picture: 'kasteel',
      text: 'Pip landt met haar {luchtballon.body|rode} luchtballon zachtjes bij een groot kasteel met rode torens. Krrr… de poort gaat langzaam open. Wie woont er in het kasteel?',
      choices: [
        { label: 'Een robot', next: 'robot' },
        { label: 'Een olifant', next: 'olifant' },
      ],
    },
    {
      id: 'raket', picture: 'raket',
      text: 'Pip klimt uit het mandje van haar {luchtballon.body|rode} luchtballon en in een glimmende raket. Drie… twee… één… lancering! De raket vliegt omhoog, door de wolken, de ruimte in. Waar gaat Pip heen?',
      choices: [
        { label: 'Naar de sterren', next: 'ster' },
        { label: 'Naar de robotplaneet', next: 'robot' },
      ],
    },

    // ---- Eindes
    {
      id: 'tulp', picture: 'tulp',
      text: 'Fleur brengt Pip naar een wei vol tulpen in alle kleuren van de regenboog. Wat ruikt dat lekker! Pip plukt een grote bos bloemen en neemt hem mee naar huis, voor mama. Wat een mooie dag.',
      choices: [],
    },
    {
      id: 'boom', picture: 'boom',
      text: 'Fleur vliegt naar de grootste boom van het bos. Daar wonen honderd vlinders! Ze dansen allemaal om Pip heen. Pip lacht en danst mee, de hele middag lang.',
      choices: [],
    },
    {
      id: 'appel', picture: 'appel',
      text: 'Pip vindt een boom vol rode appels. Ze geeft Sam de allergrootste. Hap, hap, hap! "Dank je wel, Pip," zegt Sam. Samen smullen ze van de appels in het zonnetje.',
      choices: [],
    },
    {
      id: 'huis', picture: 'huis-2',
      text: 'Pip tilt Sam voorzichtig op en draagt hem naar huis. Wat gaat dat snel! Sam mag in Pips tuin komen wonen. Vanaf nu spelen ze elke dag samen.',
      choices: [],
    },
    {
      id: 'krab', picture: 'krab',
      text: 'Op de bodem van de zee woont Knijp de krab. Knip, knap! Hij danst zijwaarts heen en weer en Pip doet mee. Alle vissen komen kijken naar de grappigste dans van de zee.',
      choices: [],
    },
    {
      id: 'cactus', picture: 'cactus',
      text: 'Op het eiland staat een grote {body|groene} cactus met een roze bloem. Pip en Bubbel spelen verstoppertje op het warme strand, tot de zon rood wordt en ondergaat.',
      choices: [],
    },
    {
      id: 'ruit', picture: 'ruit',
      text: 'Otje laat de schat zien: een glinsterende blauwe diamant! "Hij is voor jou, Pip," zegt Otje. "Omdat je mijn vriendje bent." Wat een cadeau!',
      choices: [],
    },
    {
      id: 'ster', picture: 'ster',
      text: 'Pip zweeft tussen de sterren. Eén ster is extra groot en lacht naar haar. "Doe maar een wens," fluistert de ster. Pip wenst… dat ze dit avontuur nooit vergeet.',
      choices: [],
    },
    {
      id: 'robot', picture: 'robot',
      text: 'Bliep bloep! Een vriendelijke {body|grijze} robot zegt hallo. Hij laat Pip al zijn knopjes en lampjes zien. Samen maken ze de gekste muziek: piep, toet, bliep!',
      choices: [],
    },
    {
      id: 'olifant', picture: 'olifant',
      text: 'In de tuin van het kasteel woont een olifant. Hij zuigt water op met zijn slurf en… pssst! Pip wordt kletsnat. Ze moeten er allebei heel hard om lachen.',
      choices: [],
    },
  ],
};
