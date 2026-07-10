// Side-quest chains (mundane → unhinged) and daily events. Pure data.
//
// Step types the quest engine understands:
//   { type:'talk', npc }         — speak to a citizen
//   { type:'goto', loc }         — stand at a location
//   { type:'minigame', id }      — win/complete a minigame
// Each step: say (giver's brief), done (line on completion).

export const QUEST_CHAINS = [
  {
    id: 'keys',
    giver: 'norm',
    title: 'The Keys Saga',
    steps: [
      { type: 'goto', loc: 'parkinglot',
        say: 'I lost my keys. Probably in the parking lot. It\'s a normal errand. I like those.',
        done: 'No keys, but you found three OTHER people\'s keys. The lot giveth.' },
      { type: 'talk', npc: 'penny',
        say: 'Penny "found" my keys. Her word. In quotes. Negotiate. Bring nothing of value; she\'ll sense it.',
        done: 'Penny released the keys for two compliments and a promise to "think about investing".' },
      { type: 'goto', loc: 'cul3',
        say: 'Take my keys home before anything weird— just hurry, please.',
        done: 'The keys are home. The keys have... arranged themselves into a tiny parliament?' },
      { type: 'talk', npc: 'professor_wug',
        say: 'My keys have formed a government. There\'s a house key acting as speaker. Ask Wug what this means.',
        done: 'Wug: "Fascinating. A keyocracy. Historically they last a week, then demand a tiny flag." Norm has ordered the flag. He respects process.' },
    ],
  },
  {
    id: 'sandwich',
    giver: 'big_frank',
    title: 'The Glizzy Files',
    steps: [
      { type: 'talk', npc: 'scribbles',
        say: 'The doodle-dog\'s after my cart again. Talk to him. Dog to person. Person to dog. You get it.',
        done: 'Scribbles explained (via interpretive borking) that the chase is "about the journey".' },
      { type: 'minigame', id: 'sandwich',
        say: 'Rush hour\'s coming and my hands are full of destiny. Cover the assembly station.',
        done: 'You built sandwiches under pressure. Frank nodded. That\'s a medal, from Frank.' },
      { type: 'goto', loc: 'picnicfield',
        say: 'The ants stole a COMPANY asset (one sandwich, sentimental value). Attend the negotiation at the field.',
        done: 'The ants returned the sandwich minus "handling fees" (the middle). Diplomatic victory.' },
      { type: 'talk', npc: 'mayor',
        say: 'The mayor wants to declare my next hot dog a town monument. Confirm he understands it will be EATEN.',
        done: 'The mayor understands. He\'s scheduled the eating as a ribbon-cutting. There is a ribbon. It\'s mustard.' },
    ],
  },
  {
    id: 'binder',
    giver: 'wendy',
    title: 'Page 47',
    steps: [
      { type: 'goto', loc: 'statue',
        say: 'Watch the statue for me. Just... watch it. Note anything. ANYTHING.',
        done: 'The statue did nothing while you watched. It changed pose the MOMENT you left. Wendy: "classic."' },
      { type: 'talk', npc: 'baron_beak',
        say: 'Baron Beak claims the statue is a fourth pigeon. Absurd. Get his evidence anyway. For the binder.',
        done: 'His evidence is compelling, crumb-based, and inadmissible. Filed under "unfortunately interesting".' },
      { type: 'goto', loc: 'townarchive',
        say: 'The founder\'s sealed diary is in the archive. I can\'t open it. Maybe YOU can\'t open it differently.',
        done: 'You couldn\'t open it differently, but the 400 identical diaries at Books-A-Trillion? Page one matches. "So it begins again."' },
      { type: 'talk', npc: 'old_whickers',
        say: 'Whickers predicted the statue thing. Both binder-keepers must meet. Arrange it. History demands it.',
        done: 'They compared binders for six hours. Conclusion: a THIRD binder is needed. You\'re listed as a source. Page 47.' },
    ],
  },
  {
    id: 'mixtape',
    giver: 'dj_drizzle',
    title: 'The Double Rainbow Drop',
    steps: [
      { type: 'talk', npc: 'echo',
        say: 'I need backup vocals that answer slightly wrong. There\'s only one artist with that range.',
        done: 'Echo agreed ("no... probably yes"). Her demo tape is a cover of itself.' },
      { type: 'minigame', id: 'danceoff',
        say: 'Prove the town can HANDLE the drop. Show me your moves at the bandstand.',
        done: 'Your moves registered on the weather vane. It\'s spinning. It won\'t stop. Perfect.' },
      { type: 'goto', loc: 'weirdrock',
        say: 'The weird rock hums the anthem off-key. Off-key is a GENRE. Recruit it.',
        done: 'The rock agreed by humming slightly MORE off-key. In the industry we call that "yes".' },
      { type: 'goto', loc: 'bandstand',
        say: 'Tonight: me, Echo, the rock, and one (1) meteorologically significant bass drop. Be there.',
        done: 'The drop hit. It rained upward for four seconds. A double rainbow apologized to a triple rainbow. Legendary.' },
    ],
  },
  {
    id: 'normalday',
    giver: 'officer_paws',
    title: 'Operation: One Normal Day',
    steps: [
      { type: 'talk', npc: 'lulu',
        say: 'One day of zero nonsense. That\'s all I want. Start with Lulu. Ask her to pause the inventions. ASK NICELY.',
        done: 'Lulu agreed to a one-day pause and immediately invented a machine to enforce the pause. It\'s already causing one (1) new problem.' },
      { type: 'talk', npc: 'gus',
        say: 'The gnomes rotate at 3 AM and it wakes the flamingos, which wakes EVERYTHING. Negotiate a ceasefire.',
        done: 'Gus agreed to rotate at 3 PM instead, "so everyone can appreciate it". Not the outcome. An outcome.' },
      { type: 'goto', loc: 'gazebo',
        say: 'All gossip legally flows through the gazebo. Post a notice: one day, no rumors. Brace yourself.',
        done: 'The gazebo\'s floorboards squeaked the notice to everyone by sundown. The rumor about the no-rumor day is the biggest rumor of the year.' },
      { type: 'talk', npc: 'officer_paws',
        say: 'Report back. How bad is it.',
        done: 'You reported: the pause machine, the 3 PM gnomes, the meta-rumor. Paws stared into the distance, said "so, a normal day", and issued the town a warning. The town framed it.' },
    ],
  },
];

// Daily events by weekday (0 = Sunday). The clock announces these; NPCs
// reference them; some modify mood or weather odds.
export const DAILY_EVENTS = [
  { day: 0, id: 'quiet_sunday', name: 'Suspiciously Quiet Sunday',
    blurb: 'Nothing is scheduled. The town finds this deeply unsettling.', moodMod: -0.05 },
  { day: 1, id: 'meeting_monday', name: 'Town Meeting Monday',
    blurb: 'Emergency town meeting at the bandstand about last week\'s emergencies. Generates next week\'s.', moodMod: -0.1 },
  { day: 2, id: 'backwards_tuesday', name: 'Backwards Day (legally binding)',
    blurb: 'Everything runs backwards: the clock tower, the barber pole, several arguments (they end politely).', moodMod: 0.1 },
  { day: 3, id: 'gossip_wednesday', name: 'Gazebo Open Mic',
    blurb: 'Gossip amnesty at the gazebo. All rumors 40% louder, 0% more accurate.', moodMod: 0.1 },
  { day: 4, id: 'glorpmart_thursday', name: 'GlorpMart Flash Sale',
    blurb: 'Everything must go, including several things that should stay.', moodMod: 0.15 },
  { day: 5, id: 'fryday', name: 'FRY-day',
    blurb: 'The food court\'s shared deep fryer works overtime. Chadwick declares a "market holiday".', moodMod: 0.2 },
  { day: 6, id: 'league_saturday', name: 'Junkyard Symphony Night',
    blurb: 'The scrap conducts itself at sundown. The swan has a solo. Bring earplugs and an open heart.', moodMod: 0.2 },
];
