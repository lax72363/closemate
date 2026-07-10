// World-scale random events: parades, alien audits, flash sales. Events pick
// a stage location, pull nearby NPCs toward it, feed the comedy engine, and
// clean up after themselves. Fires every 3–7 game hours; the town is never
// quiet for long.

import { chaos } from '../core/rng.js';

export const EVENTS = [
  { id: 'parade', name: 'Impromptu Mayor Parade', dur: 45, loc: 'cityhall',
    start: 'The mayor has declared a parade! Reason: "the vibes". Route: wherever.',
    end: 'The parade has dispersed. Cleanup crews report confetti and one abandoned tuba.',
    npcLine: 'A parade! For what? Doesn\'t matter! WOO!' },
  { id: 'alien_audit', name: 'Alien Audit', dur: 40, loc: 'cityhall',
    start: 'A UFO has landed at City Hall. They\'re not invading — they\'re AUDITING. Have your receipts ready.',
    end: 'The aliens have left. Wobbleton scored a B-minus in "existing plausibly". We\'ll take it.',
    npcLine: 'The aliens asked to see my receipts. I showed them the 47-foot one. They left.' },
  { id: 'flashsale', name: 'GlorpMart Flash Sale', dur: 35, loc: 'glorpmart',
    start: 'GLORPMART FLASH SALE! Everything 90% off, including things that should not be sold.',
    end: 'The flash sale ended. GlorpMart somehow made money AND lost inventory it never had.',
    npcLine: 'I bought a jar of Tuesday for a nickel! ...What do I do with it?' },
  { id: 'crab_raid', name: 'Crab Buffet Counter-Raid', dur: 30, loc: 'crabshack',
    start: 'Crusty is leading a raid on the Crab Grab Shack. The buffet is now a battlefield of honor.',
    end: 'The raid concluded. Scoreboard update: Crabs 341, Customers 12. Butter reserves: secured (by crabs).',
    npcLine: 'The crabs have a battle formation. It\'s a pincer movement. OF COURSE it\'s a pincer movement.' },
  { id: 'karaoke_night', name: 'Emergency Karaoke', dur: 40, loc: 'bandstand',
    start: 'DJ Drizzle has declared emergency karaoke at the bandstand. The emergency is "feelings".',
    end: 'Karaoke has ended. The judgy machine gave everyone a 7, except Norm. Norm got 100. Again. HOW.',
    npcLine: 'I sang "Wonderwall... probably" with Echo. We brought the house down. Legally, partially.' },
  { id: 'maze_shift', name: 'The Hedge Maze Rearranges', dur: 25, loc: 'hedgemaze',
    start: 'The hedge maze is rearranging itself. Please hold. If you are IN the maze: congratulations on the exclusive preview.',
    end: 'The maze has settled into its new layout. Bruno emerged. Different Bruno? No. Same Bruno. Probably.',
    npcLine: 'The maze moved my shortcut. It left a little apology hedge. Grew it overnight. Sweet, honestly.' },
  { id: 'statue_meeting', name: 'Emergency Statue Meeting', dur: 30, loc: 'statue',
    start: 'Emergency town meeting AT the statue ABOUT the statue. The statue will be present. Obviously. Unfortunately.',
    end: 'Motion passed: the statue "has always been where it currently is" (weekly renewal). The statue posed for the minutes.',
    npcLine: 'We voted on the statue again. It abstained. It ALWAYS abstains. Suspicious.' },
  { id: 'train_rumor', name: 'Train Sighting (Alleged)', dur: 20, loc: 'traindepot',
    start: 'Someone heard the train! The whole town is heading to the depot with welcome signs, just in case.',
    end: 'It was the wind doing a train impression. The wind apologized. The signs go back in storage. Next time.',
    npcLine: 'I brought a welcome banner. Third one this month. Hope is a lifestyle.' },
];

export class RandomEvents {
  constructor(bus, clockRef) {
    this.bus = bus;
    this.clock = clockRef;
    this.active = null;      // { def, endsAtHourAbs }
    this.nextInHours = chaos.float(1.5, 3); // first event comes early
    this._lastId = null;
  }

  absHours() { return this.clock.day * 24 + this.clock.hour; }

  update(dt, hoursPerSecond) {
    if (this.active) {
      if (this.absHours() >= this.active.endsAt) this._end();
      return;
    }
    this.nextInHours -= dt * hoursPerSecond;
    if (this.nextInHours <= 0) this._start();
  }

  _start() {
    let def = chaos.pick(EVENTS);
    if (def.id === this._lastId) def = chaos.pick(EVENTS);
    this._lastId = def.id;
    this.active = { def, endsAt: this.absHours() + def.dur / 60 };
    this.bus.emit('event:start', { def });
  }

  _end() {
    const def = this.active.def;
    this.active = null;
    this.nextInHours = chaos.float(3, 7);
    this.bus.emit('event:end', { def });
  }

  // Force an event now (used by the comedy engine's interruption system).
  trigger(id) {
    if (this.active) return false;
    const def = EVENTS.find((e) => e.id === id);
    if (!def) return false;
    this._lastId = def.id;
    this.active = { def, endsAt: this.absHours() + def.dur / 60 };
    this.bus.emit('event:start', { def });
    return true;
  }
}
