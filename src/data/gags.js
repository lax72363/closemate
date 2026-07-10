// Gag data for the comedy engine. Pure data.
//
// RUNNING_GAGS escalate: occurrence N uses stages[min(N, last)] — the joke
// evolves over a playthrough and the counter persists in saves.
// BACKGROUND_GAGS are visual bits spawned near the camera.
// META_JOKES break the fourth wall via the narrator or the UI.
// ONE_LINERS are ambient NPC bubbles, tagged for context filtering.

export const RUNNING_GAGS = [
  {
    id: 'toupee',
    name: 'The Mayor\'s Toupee',
    stages: [
      { narrator: 'BREAKING: the mayor\'s toupee has escaped again.', visual: 'toupee_run' },
      { narrator: 'The toupee has been spotted holding a tiny suitcase.', visual: 'toupee_run' },
      { narrator: 'Update: the toupee got a job at the barber shop. The irony is noted.', visual: 'toupee_run' },
      { narrator: 'The toupee has unionized with three wigs and a merkin. Negotiations ongoing.', visual: 'toupee_run' },
      { narrator: 'The toupee has filed candidacy papers for mayor. Polling at 12%.', visual: 'toupee_run' },
      { narrator: 'Polling update: toupee 48%, mayor 47%, "the statue, why not" 5%.', visual: 'toupee_run' },
      { narrator: 'The toupee has declined the mayorship, citing "a need to find itself". The town wept.', visual: 'toupee_run' },
    ],
  },
  {
    id: 'statue',
    name: 'The Statue Poses',
    stages: [
      { narrator: 'The founder statue is now doing finger guns. It wasn\'t before.', visual: 'statue_pose' },
      { narrator: 'The statue has moved to a heroic lunge. Museum: "it has always been lunging."', visual: 'statue_pose' },
      { narrator: 'The statue is doing jazz hands. Wendy has updated the binder.', visual: 'statue_pose' },
      { narrator: 'The statue appears to be mid-dab. Historians are inconsolable.', visual: 'statue_pose' },
      { narrator: 'The statue is now pointing directly at YOU. Okay. Cool. Fine.', visual: 'statue_pose' },
      { narrator: 'The statue has returned to its original pose. Somehow this is scarier.', visual: 'statue_pose' },
    ],
  },
  {
    id: 'wifi',
    name: 'The Town WiFi Password',
    stages: [
      { narrator: 'TOWN ANNOUNCEMENT: the WiFi password is now "wobble123". Yodeled at noon.', visual: null },
      { narrator: 'The WiFi password is now "wobble124". The town is evolving.', visual: null },
      { narrator: 'The WiFi password is now "definitely_not_wobble125". Security is improving.', visual: null },
      { narrator: 'The WiFi password is now the mayor\'s locker combination. Both are "1234".', visual: null },
      { narrator: 'The WiFi password is now a feeling. You\'ll know it when you feel it.', visual: null },
      { narrator: 'The WiFi is down. The password remains, out of respect.', visual: null },
    ],
  },
  {
    id: 'bagel',
    name: 'The Bagel Incident',
    stages: [
      { narrator: 'Someone mentioned The Bagel Incident. Three citizens left the area.', visual: null },
      { narrator: 'The Bagel Incident anniversary is in [REDACTED] days. Barry has begun stress-baking donuts.', visual: null },
      { narrator: 'The archive\'s Bagel Incident file was found slightly warmer today.', visual: null },
      { narrator: 'Old Man Whickers says the third bagel "nears". He said it about brunch, but still.', visual: null },
      { narrator: 'A perfectly circular cloud passed over the bakery. Barry closed early.', visual: null },
    ],
  },
  {
    id: 'gerald',
    name: 'Gerald Watches',
    stages: [
      { narrator: 'Gerald the pigeon is watching. This is not news. This is a constant.', visual: 'gerald_stare' },
      { narrator: 'Gerald has not blinked in 9 days. The record is Gerald\'s.', visual: 'gerald_stare' },
      { narrator: 'Gerald judged a passing jogger today. The jogger apologized. For what? Exactly.', visual: 'gerald_stare' },
      { narrator: 'Scientists attempted to study Gerald. Gerald is now studying the scientists.', visual: 'gerald_stare' },
      { narrator: 'Gerald looked at the camera. THE camera. This one. He knows.', visual: 'gerald_stare' },
    ],
  },
  {
    id: 'traincoming',
    name: 'The Emotionally Unavailable Train',
    stages: [
      { narrator: 'The train depot board updated: "soon <3".', visual: null },
      { narrator: 'The train was heard in the distance. It needed space. It took it.', visual: null },
      { narrator: 'The train sent a postcard from two towns over. "Thinking of you."', visual: null },
      { narrator: 'The train has started therapy. The tracks are "cautiously optimistic".', visual: null },
      { narrator: 'THE TRAIN ARRIVED. It stayed 40 seconds. Everyone cried. It was perfect.', visual: null },
    ],
  },
];

// Background visual gags — spawned near the camera edge; renderer key + line.
export const BACKGROUND_GAGS = [
  { id: 'pigeon_heist', visual: 'toupee_run', line: 'A hat runs by. It has tiny legs. Nobody reacts.' },
  { id: 'gnome_rotate', visual: 'gnome_march', line: 'A garden gnome relocates itself with visible smugness.' },
  { id: 'doodle_chase', visual: 'dog_chase', line: 'Scribbles chases a photorealistic hot dog through two art styles.' },
  { id: 'confetti_burst', visual: 'confetti', line: 'Unexplained confetti. Lulu was nowhere near. (Lulu was near.)' },
  { id: 'fish_flop', visual: 'fish_flop', line: 'A previously-rained fish commutes to its job at the market.' },
  { id: 'balloon_escape', visual: 'balloon', line: 'A balloon escapes. A child\'s scream doppler-shifts past.' },
  { id: 'roomba_patrol', visual: 'roomba', line: 'Rick vacuums a crime scene that hasn\'t happened yet.' },
  { id: 'paper_plane', visual: 'paper_plane', line: 'A paper airplane loops overhead. It\'s a subpoena from Bird & Bird & Bird.' },
  { id: 'sock_run', visual: 'toupee_run', line: 'The Other Sock sprints past, living its best life.' },
  { id: 'zap_spark', visual: 'sparkle', line: 'Zap shorts a streetlight, giggles in static.' },
  { id: 'swan_honk', visual: 'sparkle', line: 'The scrap swan honks at dawn. It is not dawn. The swan is practicing.' },
  { id: 'lens_flare_walk', visual: 'sparkle', line: 'A grounded lens flare shuffles by, too proud to ask for directions.' },
];

// Fourth-wall breaks: delivered by the Narrator toast or UI itself.
export const META_JOKES = [
  'Autosaving... just kidding, we did that ages ago. You\'re safe. Probably.',
  'The camera operator would like a raise. The camera operator is a for-loop.',
  'Fun fact: this town runs at 60 frames per second. The citizens experience all of them.',
  'Dale asked us to tell you the cursor "hovered meaningfully" again.',
  'This joke was scheduled 11 seconds ago. Comedy is logistics.',
  'If you stand still long enough, the town forgets you\'re the protagonist. Try it. We\'ll wait.',
  'The narrator is contractually obligated to mention: the fourth wall\'s repair bill is overdue.',
  'Achievement unlocked: "Read a Fake Achievement".',
  'Some say pressing E near objects reveals their secrets. The narrator says it. Right now. It\'s a tutorial.',
  'The background characters are paid in exposure. To weather. They\'re paid in weather exposure.',
  'Loading additional whimsy... whimsy loaded. Sorry for the delay.',
  'A joke was supposed to appear here. It\'s at the printer. Please enjoy this apology instead.',
  'The devs put 300 objects in this town and you\'ve poked, what, six? Gerald counts. Gerald judges.',
  'Reminder: your reputation is being tracked by a number. The number has feelings about you.',
];

// Ambient NPC one-liners, filtered by tags: time (morning/day/evening/night),
// weather ids, or 'any'.
export const ONE_LINERS = [
  { tags: ['morning'], line: 'The kazoo bell rang at 8. My soul rang back.' },
  { tags: ['morning'], line: 'Coffee first. Chaos second. Wobbleton has a schedule.' },
  { tags: ['morning'], line: 'The sunrise was gorgeous today. Vlad hissed at it, then tipped it.' },
  { tags: ['day'], line: 'Lunch options: noodles, pizza roulette, or whatever the sky drops.' },
  { tags: ['day'], line: 'The parking lot took another car last night. It gives them back eventually. Changed.' },
  { tags: ['evening'], line: 'The swings are creaking in D minor. Right on schedule. Chills.' },
  { tags: ['evening'], line: 'Golden hour makes even the junkyard look majestic. The swan agrees. Loudly.' },
  { tags: ['night'], line: 'The glow pond show starts at nine. Ticket price is up to TWO flies. Inflation.' },
  { tags: ['night'], line: 'Don\'t look at the statue after midnight. It waves. That\'s the problem. It WAVES.' },
  { tags: ['night'], line: 'The gnomes rotate at three. I stay up sometimes. Just to feel something.' },
  { tags: ['any'], line: 'I asked the escalator how it was doing. It went up, then came back down. Same, buddy.' },
  { tags: ['any'], line: 'My horoscope said "pretzels". Madame Oolong is never wrong.' },
  { tags: ['any'], line: 'The hedge maze rearranged again. Bruno\'s been in there since Tuesday. He sounds happy?' },
  { tags: ['any'], line: 'Penny offered to buy my house. I don\'t own a house. She offered to fix that. For a fee.' },
  { tags: ['any'], line: 'The koi complimented my posture today. I\'m unstoppable now.' },
  { tags: ['any'], line: 'Norm said "hi" to me. Just "hi". What did he MEAN by that?' },
  { tags: ['any'], line: 'I put a suggestion in the box. A bee took it under advisement.' },
  { tags: ['any'], line: 'The claw machine asked about my mother. Great rates though.' },
];
