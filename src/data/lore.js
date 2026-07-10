// Hidden lore: the 30 lost VHS tapes of "Season Zero". Collect a tape,
// unlock a fragment. Read in order or scrambled — either way, the truth about
// The Bagel Incident, the statue, and Glorp slowly assembles.
// Rendered in the journal (J).

export const TAPES = [
  { n: 1, label: 'S0E01 — "Pilot (Burnt)"', text: 'A town is founded on a wobble. Founder Wobble\'s first words on record: "this ground is NOT level and I love that for us."' },
  { n: 2, label: 'S0E02 — "The Level Survey"', text: 'Surveyors declare the land unbuildable. Wobble builds anyway, at an angle. The lighthouse\'s lean is original. The town leaned to match, "out of politeness".' },
  { n: 3, label: 'S0E03 — "The First Pigeon"', text: 'A pigeon lands on the founder\'s shoulder during the founding speech and stares at the camera. Historians agree: same stare. Same pigeon? The tape offers no comfort.' },
  { n: 4, label: 'S0E04 — "The Statue Commission"', text: 'The statue\'s sculptor quits mid-project, quote: "it keeps helping." The statue finished itself. Invoice: paid in full, by the statue, in exact change.' },
  { n: 5, label: 'S0E05 — "Zoning Day"', text: 'The districts are drawn by throwing a noodle at a map. The noodle is preserved. The noodle grew. The Noodle Barn is a shrine, technically.' },
  { n: 6, label: 'S0E06 — "The Anthem Auditions"', text: 'A rock hums the winning entry. The runner-up (a human) demands a recount. The rock hums the recount too. Wobbleton\'s anthem has always been geological.' },
  { n: 7, label: 'S0E07 — "The First Tuesday"', text: 'The town\'s first Tuesday goes so badly that the council votes to make every future Tuesday "legally backwards, so it can\'t sneak up on us again."' },
  { n: 8, label: 'S0E08 — "GlorpMart Opens"', text: 'The store opens before it\'s built. Sales are strong. The first item sold: a jar. Empty. Or... not yet full. The jar is important later. Keep watching.' },
  { n: 9, label: 'S0E09 — "The Jar"', text: 'Static. Forty minutes of static. At minute 41, a small voice: "glorp?" The static apologizes and continues.' },
  { n: 10, label: 'S0E10 — "The Weather Contract"', text: 'The town signs a deal with the sky: "surprise us." The sky, a professional, has honored the contract every day since. The fish were clause 12.' },
  { n: 11, label: 'S0E11 — "The Bakery Grand Opening"', text: 'Barry\'s grandfather opens The Bagel Place. The first batch is perfect. TOO perfect. Old Man Whickers (younger, same coat) is seen leaving town at a brisk walk.' },
  { n: 12, label: 'S0E12 — "The Incident, Part 1"', text: 'The tape is warm. The label is scorched. Playable fragment: a torus-shaped shadow over the bakery, and a voice: "it\'s... it\'s rising."' },
  { n: 13, label: 'S0E13 — "The Incident, Part 2"', text: 'Missing. In its case: a single sesame seed and a note in careful handwriting: "NO. — The Archive".' },
  { n: 14, label: 'S0E14 — "The Cleanup"', text: 'The town rebuilds. The ceiling scorch mark is left "as a reminder". A reminder of WHAT is struck from the minutes, by unanimous, slightly shaky vote.' },
  { n: 15, label: 'S0E15 — "Whickers Returns"', text: 'Whickers comes back with a binder. The town laughs. He starts a second binder, labeled "for when they stop laughing".' },
  { n: 16, label: 'S0E16 — "The Toupee Arrives"', text: 'A young Bumbleworth buys his first toupee from a mysterious cart. The vendor: "it will serve you until it doesn\'t." The cart is never seen again. The receipt is 47 feet long.' },
  { n: 17, label: 'S0E17 — "The Mall Descends"', text: 'The MegaMall is not built. It is FOUND, fully stocked, one morning. The town shrugs and shops. The "YOU ARE HERE" dot was already following people.' },
  { n: 18, label: 'S0E18 — "Level 4"', text: 'A parking attendant discovers a fourth level of the lot. He returns changed. "It\'s all reserved spaces," he whispers. "Reserved for WHOM?" He never says. He parks fine now. Too fine.' },
  { n: 19, label: 'S0E19 — "The Train\'s First Day"', text: 'The train arrives on time, once, to no fanfare. Nobody claps. The train remembers. The schedule board changes to "soon <3" the next morning.' },
  { n: 20, label: 'S0E20 — "The Frog Accords"', text: 'The glow pond frogs negotiate lighting rights with the fireflies. The treaty is signed in dew. Both parties honor it flawlessly, which the town finds "frankly showoffy".' },
  { n: 21, label: 'S0E21 — "The Echo Moves In"', text: 'Something answers a hiker slightly wrong. The hiker argues. The argument lasts nine hours. The echo is granted residency for "commitment to the bit".' },
  { n: 22, label: 'S0E22 — "The Census"', text: 'The first census counts 50 citizens. A tall resident in a trench coat is counted once, over her own objection ("we are— I am ONE person"). The count stands. Forever.' },
  { n: 23, label: 'S0E23 — "The Statue Moves (Officially, Once)"', text: 'The 1887 map shows the statue elsewhere. The council votes that the statue "has always been where it currently is", a motion they now have to re-pass weekly.' },
  { n: 24, label: 'S0E24 — "Warehouse 12¾"', text: 'The town builds a warehouse for "everything we refuse to explain". It fills in a week. The toupee-sized cage is installed "proactively". It has never once worked.' },
  { n: 25, label: 'S0E25 — "The Second Incident"', text: 'Yes. There were two. The second one was smaller, "a bagelette". Whickers\' second binder is opened. Nobody laughs anymore. Donut sales triple.' },
  { n: 26, label: 'S0E26 — "The Glorp Emerges"', text: 'The jar from S0E08, kept in GlorpMart\'s back room, is found open and empty. The store\'s new employee starts the same day. Friendly. Round. Absorbs a mop, apologizes. Hired permanently.' },
  { n: 27, label: 'S0E27 — "The Contract Renewal"', text: 'The sky renegotiates: it wants "one day a year of being suspiciously perfect". The town agrees, uneasily. That day is never announced in advance. That\'s the surprise.' },
  { n: 28, label: 'S0E28 — "The Camera"', text: 'A resident (hand-drawn, familiar) notices the camera for the first time and waves. The camera waves back. This is not explained. Dale has been waving ever since.' },
  { n: 29, label: 'S0E29 — "The Finale That Wasn\'t"', text: 'Season Zero\'s finale is announced, then cancelled. The reason, per the archive: "the town declined to end." The show simply... kept going. It is still going. Look around.' },
  { n: 30, label: 'S0E30 — "You"', text: 'The last tape is newer than the others. It shows the town gate, this morning. Someone new walks in. The camera zooms. It\'s you. Welcome to the show, {player}. You were always in it.' },
];

// Easter eggs: id-keyed secrets triggered by specific behaviors.
export const EASTER_EGGS = [
  { id: 'stand_still', desc: 'Stand perfectly still for 60 seconds', reward: 'The town forgets you\'re the protagonist. An NPC walks up and tries to deliver YOUR lines.' },
  { id: 'poke_gerald', desc: 'Try to talk to Gerald 10 times', reward: 'Gerald blinks. Once. The narrator audibly gasps.' },
  { id: 'backwards_walk', desc: 'Walk backwards for 100 meters on a Tuesday', reward: 'The clock tower personally thanks you for your compliance.' },
  { id: 'fountain_dive', desc: 'Stand in the fountain at midnight', reward: 'You feel 20 minutes younger. Mona rates your splash: "acceptable. Three splashes."' },
  { id: 'all_tapes', desc: 'Collect all 30 tapes', reward: 'The journal gains a final page: a cast list. Your name is first. It was always first.' },
];
