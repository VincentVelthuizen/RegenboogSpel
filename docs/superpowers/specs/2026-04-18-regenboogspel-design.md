# Regenboogspel — ontwerpdocument

**Datum:** 2026-04-18
**Status:** ter review

## Doel

Een zeer simpel browser-spel voor peuters van 2–3 jaar. Het kind vult een
regenboog stapsgewijs in door uit een rijtje emoji's degene te kiezen die bij
de gevraagde kleur past. Doel van het product: vrolijk kleuren herkennen,
zonder leesvaardigheid, zonder faalervaring.

## Doelgroep en randvoorwaarden

- **Leeftijd:** 2–3 jaar. Kan niet lezen, nog beperkt motorische precisie.
- **Apparaten:** fully responsive — tablet, telefoon, laptop/desktop. Touch en
  muis gelijkwaardig ondersteund.
- **Geen geluid** in de eerste versie (uitbreidbaar later; niet nu in scope).
- **Geen tekst** in het spel zelf. Geen instructies, geen labels. Alles is
  visueel of iconografisch.
- **Geen persistentie:** state leeft in-memory, verdwijnt bij refresh. Voor een
  peuterspelletje is dat prima.

## Kernbeslissingen

- **Zes kleuren**, vaste volgorde: `paars → blauw → groen → geel → oranje →
  rood`. De regenboogboog vult van binnen (paars) naar buiten (rood).
- **Drie emoji-keuzes per challenge**, waarvan er één bij de doelkleur hoort.
  De andere twee zijn emoji's uit twee **andere** regenboogkleuren, zodat elke
  keuze duidelijk gekleurd is en het spel puur over kleur-matching gaat.
- **Foute taps doen stilletjes niets** (geen negatieve feedback). Pas na 2
  foute taps in dezelfde challenge verschijnt hulp: een grote gekleurde vlek
  in de doelkleur boven de emoji's, én de juiste emoji gaat stuiteren.
- **Eindviering:** bij het compleet inkleuren van de zesde baan toont het
  spel een confetti-overlay. De regenboog blijft zichtbaar. Een tap ergens op
  het scherm start een nieuwe ronde.
- **Herspeelbaarheid:** elke kleur heeft een poule van meerdere emoji's, zodat
  opeenvolgende rondes niet telkens identiek zijn.

## Techniek

**Stack:** vanilla JavaScript + inline SVG + CSS. Gebruikt de bestaande
webpack-setup (`js/app.js` als entry). Geen framework, geen extra runtime
dependencies.

**Motivatie:** de scope is klein en visueel simpel; SVG schaalt vloeiend
responsive, CSS-transities en keyframes dekken alle benodigde animaties, en
een kleine state-machine is eenvoudig met hand te schrijven.

## Visuele componenten

### Regenboogboog

Bovenste ~60% van het scherm. Eén inline `<svg>` met zes concentrische
halfronde `<path>`-bogen. Paars is de binnenste, rood de buitenste. Elke baan
heeft drie mogelijke states via een CSS-class:

- `.empty` — stroke `#e5e5e5` (lichtgrijs).
- `.filled` — stroke in de eigen regenboogkleur, met `transition: stroke
  500ms ease` voor soepel inkleuren.
- `.target` — alleen op de eerstvolgende lege baan: `@keyframes` pulseert
  tussen lichtgrijs en de doelkleur, zodat duidelijk is welke kleur we zoeken.

### Emoji-keuzes

Onderste ~30% van het scherm. Drie grote vierkante `<button>`-elementen naast
elkaar, gecentreerd. Emoji als tekst, lettergrootte `clamp(3rem, 15vw, 8rem)`
zodat het op elk apparaat comfortabel tap-baar is. Minimale hitzone 64×64 px.
Subtiele schaduw en afronding voor een "drukknop"-gevoel.

Op correct-tap krijgt de knop een kortstondige `.fly-to-rainbow` class:
krimpt en beweegt richting de target-baan (~500 ms), vervaagt naar
`opacity: 0`. Daarna: de target-baan wordt `.filled`, de volgende baan wordt
`.target`, en er verschijnen drie nieuwe emoji-knoppen.

### Kleurvlek-indicator (hint)

Eén grote ronde `<div>` tussen regenboog en emoji-rij. `display: none`
standaard. Zodra `wrongCountThisChallenge ≥ 2` krijgt hij
`display: block` met de doelkleur als `background-color`. Verdwijnt weer bij
start van de volgende challenge.

### Viering-overlay

Full-screen `<div>` bovenop het spel, verschijnt wanneer de zesde baan net is
ingekleurd. Bevat:

- Confetti: ~30 kleine gekleurde `<div>`-deeltjes met willekeurige kleur,
  rotatie, horizontaal startpunt en animatieduur. Gebruikt CSS `@keyframes`
  voor val + drift.
- De regenboog blijft compleet zichtbaar onder de overlay.
- Visuele "tap om opnieuw" hint zonder tekst: bijvoorbeeld de zes
  regenboogkleuren die samen zacht pulseren. De hele viewport is tap-target.

### Layout

Flexbox kolom, volledig op `100vw` × `100vh`. Geen media-queries; alles
schaalt via `clamp()` / viewport-units. De regenboog-SVG heeft een vast
`viewBox` en wordt met `preserveAspectRatio="xMidYMid meet"` vloeiend
geschaald.

## Datamodel

### Constanten

```js
const COLORS = ['purple', 'blue', 'green', 'yellow', 'orange', 'red'];

const COLOR_HEX = {
  purple: '#9b59b6',
  blue:   '#3498db',
  green:  '#2ecc71',
  yellow: '#f1c40f',
  orange: '#e67e22',
  red:    '#e74c3c',
};

const EMOJI_POOL = {
  purple: ['🍆', '🍇', '🟣', '🟪', '👾', '🔮'],
  blue:   ['🫐', '🐳', '🟦', '🔵', '💙', '🌀'],
  green:  ['🐸', '🥒', '🟢', '🟩', '🥬', '🌲'],
  yellow: ['🍌', '🌻', '🟡', '🟨', '⭐', '🧀'],
  orange: ['🍊', '🥕', '🟠', '🟧', '🦊', '🎃'],
  red:    ['🍎', '🍓', '🔴', '🟥', '❤️', '🚒'],
};
```

(Exacte poule-samenstelling wordt bij implementatie nog getoetst: emoji's die
platform-afhankelijk anders renderen, of wier kleur in de praktijk niet
overtuigend overeenkomt, worden vervangen.)

### Runtime-state

```js
{
  filledColors: [],                    // kleuren in volgorde afgerond
  currentColor: 'purple',              // doelkleur nu (COLORS[filledColors.length])
  currentChoices: ['🍆', '🍌', '🐸'],  // 3 emoji's, positie random
  correctIndex: 0,                     // index in currentChoices
  wrongCountThisChallenge: 0,          // reset per challenge
  phase: 'playing',                    // 'playing' | 'celebrating'
  tapsAreLocked: false,                // tijdens inkleur-animatie
}
```

### Challenge-generatie

Bij start van elke challenge:

1. `currentColor = COLORS[filledColors.length]`.
2. Kies willekeurig één emoji uit `EMOJI_POOL[currentColor]`.
3. Kies twee andere kleuren willekeurig (zonder duplicaten) uit
   `COLORS` exclusief `currentColor`. Pak uit elk van die twee kleuren één
   willekeurige emoji.
4. Shuffle de drie emoji's. Sla `correctIndex` op.

## Interactie

### Tap op een emoji-knop

```
onEmojiTap(index):
  if phase != 'playing': return
  if tapsAreLocked:      return
  if index == correctIndex:
    handleCorrect()
  else:
    handleWrong()
```

### handleCorrect

1. Zet `tapsAreLocked = true`.
2. Emoji-knop krijgt `.fly-to-rainbow` class (schaal omlaag + translate richting
   target-baan + fade-out over ~500 ms).
3. Tegelijk: target-baan wisselt `.target` → `.filled`. CSS-transition op
   `stroke` kleurt soepel in.
4. Op `transitionend` (of `setTimeout` als fallback):
   - `filledColors.push(currentColor)`.
   - Als `filledColors.length == 6`: `phase = 'celebrating'`, toon
     viering-overlay. Stop hier.
   - Anders: genereer volgende challenge, render nieuwe emoji-knoppen, zet de
     volgende baan op `.target`, verberg kleurvlek-indicator, reset
     `wrongCountThisChallenge = 0`, unlock taps.

### handleWrong

1. `wrongCountThisChallenge += 1`.
2. Geen visuele reactie op de foute emoji (bewust stil).
3. Als `wrongCountThisChallenge >= 2`:
   - Toon kleurvlek-indicator in `COLOR_HEX[currentColor]`.
   - Geef de juiste emoji-knop een `.hint-bounce` class (subtiele CSS
     `@keyframes` bounce, loopt door tot de challenge eindigt).

### Tap op viering-overlay

1. `filledColors = []`, `wrongCountThisChallenge = 0`, `phase = 'playing'`.
2. Alle regenboog-bogen terug naar `.empty` (fade via transition).
3. Genereer nieuwe challenge. Zet paars-baan op `.target`.
4. Verwijder viering-overlay. Unlock taps.

### Tap-locking

Eén boolean `tapsAreLocked` gedurende de inkleur-animatie voorkomt dubbele
registraties. Geen aparte debounce-logica nodig.

### Toegankelijkheid

Emoji-knoppen zijn `<button>`-elementen zodat ze tab/enter/spatie krijgen.
Ieder krijgt een `aria-label` in het Nederlands (bv. `"paarse aubergine"`) —
niet zichtbaar, maar nuttig voor screen readers en als onzichtbare
documentatie.

## Bestandsstructuur

```
js/
├── app.js                  # Entry: bootstrapt het spel, hangt aan DOM
├── game/
│   ├── state.js            # Pure state-reducers
│   ├── challenge.js        # generateChallenge(filledColors)
│   ├── colors.js           # COLORS, COLOR_HEX, EMOJI_POOL
│   └── random.js           # pickOne(array), shuffle(array)
└── ui/
    ├── rainbow.js          # SVG-regenboog renderen + updaten
    ├── emojiChoices.js     # 3 knoppen renderen, tap-handlers, lock/unlock
    ├── hintIndicator.js    # Kleurvlek tonen/verbergen
    └── celebration.js      # Viering-overlay + confetti + tap-to-restart

css/
└── style.css               # Alle styling, inclusief animaties

index.html                  # SVG-skelet, emoji-container, overlay-container
```

### Verantwoordelijkheden per laag

- **`game/*`** — puur, geen DOM. Alle logica en state-transities. Trivially
  unit-testbaar.
- **`ui/*`** — alleen DOM-manipulatie en animaties. Ontvangen state en
  callbacks; geen eigen state.
- **`app.js`** — plakt het aan elkaar. Bouwt initiële state, bindt UI aan
  DOM, dispatcht taps naar state-reducers, roept UI-renderers aan.

### Dataflow (één-richting)

```
user tap
  → ui/emojiChoices.onTap(index)
  → app.js: handleTap(index)
    → game/state.recordCorrect() of .recordWrong()
    → ui/rainbow.update(state)
    → ui/emojiChoices.render(state)
    → ui/hintIndicator.update(state)
    → eventueel ui/celebration.show()
```

State is single source of truth. UI herrendert vanuit state. Geen gedeelde
mutable globals tussen modules.

## Testen

### Unit tests (pure logic)

`game/state.js` en `game/challenge.js` zijn puur en trivially testbaar. Voeg
`vitest` toe als devDep. Stub `game/random.js` voor deterministische tests
(bv. mocked `pickOne` en `shuffle`). Geen browser-omgeving nodig voor deze
laag.

Te dekken:

- `generateChallenge`: juiste kleur, 3 emoji's, 1 correcte, 2 uit andere
  kleuren, `correctIndex` consistent met de gekozen positie.
- State-reducers: transities tussen playing/celebrating, `filledColors` groeit
  in juiste volgorde, `wrongCountThisChallenge` reset op challenge-start,
  hint-threshold op 2.

### Handmatig visueel testen

UI-gedrag (animaties, responsive layout, confetti, pulseren, inkleuren) is het
snelst te valideren met `npm start` in verschillende vensterbreedtes en op
touch-devices. Voor een project van deze scope is geautomatiseerde e2e
(Playwright/Cypress) overkill.

## Buiten scope (expliciet)

- Geluid / stemgeluid / muziek.
- Persistentie tussen sessies.
- Meerdere spel-modi, moeilijkheidsgraden, leeftijds-instellingen.
- Leaderboards, scores, timer.
- Ouderlijk-dashboard of -statistieken.
- Offline PWA-installatie (kan later, zit grotendeels al in de HTML5
  Boilerplate).

## Openstaande punten voor implementatie

- Exacte emoji-poule per kleur finaliseren: zichtbaar testen op Chrome,
  Safari en Firefox of de emoji's overtuigend de juiste kleur tonen.
- Exacte hex-waarden van de regenboogkleuren finaliseren: levendig en
  peuter-vriendelijk, voldoende contrast tussen naburige banen.
- Confetti-kleuren en -dichtheid tweaken op basis van visuele indruk.
