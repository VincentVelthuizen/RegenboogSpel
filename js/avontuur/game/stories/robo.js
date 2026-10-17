// "Robo en de ster": Robo de robot brengt een uit de lucht gevallen ster
// terug naar de hemel. Every run has all four activities once: colouring,
// a sliding puzzle, connect-the-dots and a jigsaw. Story format: see ../story.js.
export const ROBO = {
  id: 'robo',
  title: 'Robo en de ster',
  emoji: '🤖',
  start: 'start',
  activities: ['color', 'slide', 'dots', 'puzzle'],
  nodes: [
    {
      id: 'start', picture: 'robot',
      text: 'Dit is Robo, een vrolijke {body|grijze} robot met {d3|blauwe} ogen. Op een avond hoort hij een plof in de tuin. In het gras ligt een kleine ster! "Ik ben uit de lucht gevallen," snikt ze. "Wil jij me terugbrengen?" Natuurlijk wil Robo dat. Maar hoe?',
      choices: [
        { label: 'Met een raket', next: 'raket' },
        { label: 'Met een luchtballon', next: 'ballon' },
        { label: 'Hulp vragen in het kasteel', next: 'kasteel' },
      ],
    },

    // ---- Hoe brengt Robo de ster terug?
    {
      id: 'raket', picture: 'raket',
      text: 'Robo bouwt een raket van dozen, buizen en schroefjes. De ster mag voorin zitten. Drie, twee, één… woesj! Ze vliegen over de zee en over het dorp. "Kijk, daar beneden!" roept de ster. Wat ziet ze?',
      choices: [
        { label: 'Een bootje op zee', next: 'boot' },
        { label: 'Een huisje met licht', next: 'huis' },
      ],
    },
    {
      id: 'ballon', picture: 'luchtballon',
      text: 'Robo vindt een grote luchtballon. Hij zet de ster voorzichtig in het mandje en stapt zelf ook in. Langzaam zweven ze omhoog. Maar oei, de wind blaast ze naar het bos! Waar komen ze terecht?',
      choices: [
        { label: 'In een hoge boom', next: 'boom' },
        { label: 'In een bloemenveld', next: 'tulp' },
      ],
    },
    {
      id: 'kasteel', picture: 'kasteel',
      text: 'Robo loopt met de ster naar het kasteel. "Majesteit, kunt u ons helpen?" De koning krabt aan zijn kroon. "Ik heb twee ideeën," zegt hij. Welk idee kiest Robo?',
      choices: [
        { label: 'De snelle auto van de koning', next: 'auto' },
        { label: 'De gouden appel uit de tuin', next: 'appel' },
      ],
    },

    // ---- Onderweg
    {
      id: 'boot', picture: 'boot',
      text: 'Robo landt de raket naast een bootje op zee. De visser in het bootje zwaait. "Ik ken de weg naar de hemel," zegt hij. "Volg de heldere sterren maar." Robo bedankt de visser. Wat doen ze nu?',
      choices: [
        { label: 'Verder naar de hemel', next: 'hemel' },
        { label: 'Eerst samen vissen', next: 'vrienden' },
      ],
    },
    {
      id: 'huis', picture: 'huis',
      text: 'In het dorp brandt nog licht in een klein huisje. Er woont een meisje dat niet kan slapen. "Ik ben bang in het donker," fluistert ze. De ster krijgt een idee. Wat gaat ze doen?',
      choices: [
        { label: 'Een nachtje logeren', next: 'logeren' },
        { label: 'Schijnen op het plein', next: 'kerstboom' },
      ],
    },
    {
      id: 'boom', picture: 'boom',
      text: 'Krak! Robo en de ster landen in de takken van een hoge boom. Daar woont een uil. "Oehoe, jullie zijn verdwaald," zegt de uil. "Ik weet de weg!" Wat doen ze?',
      choices: [
        { label: 'Met de uil meevliegen', next: 'hemel' },
        { label: 'Eerst even uitrusten', next: 'vrienden' },
      ],
    },
    {
      id: 'tulp', picture: 'tulp',
      text: 'Ze landen zachtjes in een veld vol tulpen. Wat ruikt het lekker! In één tulp ligt iets te glinsteren. "Wat is dat?" vraagt Robo. Wat doen ze?',
      choices: [
        { label: 'Gaan kijken', next: 'schat' },
        { label: 'Bloemen plukken', next: 'vrienden' },
      ],
    },
    {
      id: 'auto', picture: 'auto',
      text: 'De koning geeft Robo de sleutels van zijn snelle auto. Vroem! Ze rijden de hoogste berg op, helemaal tot bij de wolken. Wat zien ze daar, boven op de top?',
      choices: [
        { label: 'De hemel vol sterren', next: 'hemel' },
        { label: 'Een boom zonder piek', next: 'kerstboom' },
      ],
    },
    {
      id: 'appel', picture: 'appel',
      text: 'In de tuin van het kasteel hangt één gouden appel. "Wie daar een hap van neemt, kan vliegen," zegt de koning. Hap! Robo zweeft omhoog, met de ster in zijn armen. Waar vliegen ze heen?',
      choices: [
        { label: 'Naar de hemel', next: 'hemel' },
        { label: 'Naar de schatkamer', next: 'schat' },
      ],
    },

    // ---- Eindes
    {
      id: 'hemel', picture: 'ster',
      text: 'Hoger en hoger gaan ze, tot ze bij de hemel zijn. Daar is precies één leeg plekje tussen de andere sterren. Plop! De ster springt erin en straalt weer. "Dank je wel, Robo!" Elke nacht knipoogt ze nu naar de {robot.body|grijze} robot beneden.',
      choices: [],
    },
    {
      id: 'vrienden', picture: 'hart',
      text: 'Robo en de ster hebben zoveel plezier samen dat ze de allerbeste vrienden worden. Later brengt Robo haar toch terug naar de hemel. En elke avond zwaaien ze naar elkaar: welterusten, vriendje!',
      choices: [],
    },
    {
      id: 'kerstboom', picture: 'kerstboom',
      text: 'Op het plein staat een grote kerstboom, maar de piek is nog leeg. De ster gaat er bovenop zitten en schijnt zo fel als ze kan. Iedereen komt kijken. Wat een prachtige kerstboom!',
      choices: [],
    },
    {
      id: 'schat', picture: 'ruit',
      text: 'Daar ligt een glinsterende blauwe diamant! "Die maakt mij weer sterk," zegt de ster. Ze neemt hem mee naar de hemel en straalt nu feller dan ooit. Zo vindt Robo haar altijd terug.',
      choices: [],
    },
    {
      id: 'logeren', picture: 'huis-2',
      text: 'De ster logeert een nachtje bij het meisje. Ze schijnt als nachtlampje boven het bed, en het meisje slaapt meteen. De volgende ochtend brengt Robo de ster terug naar boven. Missie geslaagd!',
      choices: [],
    },
  ],
};
