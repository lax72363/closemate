// The Comedy Engine. Guarantees a joke every 5–15 seconds, forever.
//
// A weighted scheduler picks a category (background gag, NPC one-liner,
// physical comedy, meta/fourth-wall, callback, running gag), with pity
// timers so no category starves and a cooldown ledger so nothing repeats
// too soon. It also eavesdrops on the EventBus: weather changes, world
// events, and NPC chats all become comedic opportunities. Running-gag
// counters persist through saves so the toupee's arc survives a reload.

import { chaos } from '../core/rng.js';
import { RUNNING_GAGS, BACKGROUND_GAGS, META_JOKES, ONE_LINERS } from '../data/gags.js';
import { WEATHER_LINES } from '../data/dialogue.js';
import { dist2 } from '../core/util.js';

const MIN_GAP = 5, MAX_GAP = 15;
const LEDGER_COOLDOWN = 120;      // seconds before a specific line can repeat

const CATEGORIES = [
  { id: 'background', w: 26 },
  { id: 'oneliner', w: 24 },
  { id: 'physical', w: 14 },
  { id: 'meta', w: 12 },
  { id: 'running', w: 14 },
  { id: 'callback', w: 10 },
];

export class ComedyEngine {
  constructor(game) {
    this.game = game;
    this.nextJokeAt = 2;               // first laugh lands fast
    this.ledger = new Map();           // lineKey -> last told (engine time)
    this.history = [];                 // { cat, text, at, day } for callbacks
    this.gagCounters = new Map(RUNNING_GAGS.map((g) => [g.id, 0]));
    this.pity = new Map(CATEGORIES.map((c) => [c.id, 0]));
    this._wire();
  }

  _wire() {
    const { bus } = this.game;
    // Weather changes are free material — someone always has an opinion.
    bus.on('weather:changed', ({ to }) => {
      const npc = this._onScreenNpc();
      const line = this._fresh(WEATHER_LINES[to.id] || []);
      if (npc && line) this._npcSays(npc, line);
    });
    // World events: a nearby citizen reacts, and NPCs get pulled to the stage.
    bus.on('event:start', ({ def }) => {
      this._narrate(def.start, 'event');
      for (const npc of this.game.npcs) {
        if (chaos.chance(0.35)) npc.goToEvent(def.loc);
      }
      const npc = this._onScreenNpc();
      if (npc) this._npcSays(npc, def.npcLine);
    });
    bus.on('event:end', ({ def }) => {
      this._narrate(def.end, 'event');
      for (const npc of this.game.npcs) npc.leaveEvent();
    });
    // NPC chats: sometimes the gossip is audible.
    bus.on('npc:chat', ({ a, b }) => {
      if (!this._isOnScreen(a) || !chaos.chance(0.3)) return;
      const rel = this.game.relationships.between(a.id, b.id);
      const line = rel > 20 ? `Ah, ${b.data.name}! My favorite ${b.data.species}.`
        : rel < -20 ? `Oh. It's ${b.data.name}. Wonderful. (It is not wonderful.)`
        : null;
      if (line) this._npcSays(a, line, 3.5);
    });
  }

  update(dt) {
    const t = this.game.engine.time;
    for (const [k, v] of this.pity) this.pity.set(k, v + dt);
    if (t < this.nextJokeAt) return;
    this._tellJoke();
    this.nextJokeAt = t + chaos.float(MIN_GAP, MAX_GAP);
  }

  _tellJoke() {
    // Pity-boosted weighted pick: starving categories get funnier-looking odds.
    const cat = chaos.weighted(CATEGORIES, (c) => c.w * (1 + this.pity.get(c.id) / 60));
    const done = this._deliver(cat.id) || this._deliver('meta'); // meta never fails
    if (done) this.pity.set(cat.id, 0);
  }

  _deliver(catId) {
    switch (catId) {
      case 'background': return this._backgroundGag();
      case 'oneliner': return this._oneLiner();
      case 'physical': return this._physical();
      case 'meta': return this._meta();
      case 'running': return this._runningGag();
      case 'callback': return this._callback();
      default: return false;
    }
  }

  _backgroundGag() {
    const gag = chaos.pick(BACKGROUND_GAGS);
    if (this._onCooldown('bg:' + gag.id)) return false;
    // Spawn just off the camera edge so it enters frame — background, not spotlight.
    const cam = this.game.camera;
    const side = chaos.pick([-1, 1]);
    const x = cam.x + side * (cam.viewW / (2 * cam.zoom) + 40);
    const y = cam.y + chaos.float(-cam.viewH / 3, cam.viewH / 3);
    this.game.bus.emit('gag:visual', { visual: gag.visual, x, y, dir: -side });
    if (chaos.chance(0.5)) this._narrate(gag.line, 'background');
    this._record('bg:' + gag.id, 'background', gag.line);
    return true;
  }

  _oneLiner() {
    const npc = this._onScreenNpc();
    if (!npc) return false;
    const phase = this.game.clock.phase();
    const pool = ONE_LINERS.filter((l) =>
      l.tags.includes('any') || l.tags.includes(phase) ||
      l.tags.includes(this.game.weather.current.id));
    const line = this._fresh(pool.map((l) => l.line));
    if (!line) return false;
    this._npcSays(npc, line);
    this._record('ol:' + line.slice(0, 24), 'oneliner', line, npc);
    return true;
  }

  _physical() {
    const npc = this._onScreenNpc();
    if (!npc) return false;
    const kind = chaos.pick(['slip', 'bonk', 'boing']);
    npc.pratfall(kind);
    this.game.bus.emit('gag:visual', { visual: 'impact', x: npc.x, y: npc.y });
    this.game.camera.shake(0.25);
    const complaints = {
      slip: ['I MEANT to do that.', 'The ground moved. File it with the gazebo.', 'Who polished the WORLD?'],
      bonk: ['Ow. Classic. Right on schedule.', 'The physics here are PERSONAL.', 'I demand a softer universe.'],
      boing: ['Why am I bouncy today?!', 'Okay. New talent unlocked, I guess.', 'Do NOT tell the trampoline about this.'],
    };
    this._npcSays(npc, chaos.pick(complaints[kind]), 3.5);
    this._record('ph:' + npc.id, 'physical', `${npc.data.name} ${kind}ed spectacularly`, npc);
    return true;
  }

  _meta() {
    const line = this._fresh(META_JOKES);
    if (!line) return true; // even exhausted meta stays silent gracefully
    this._narrate(line, 'meta');
    this._record('meta:' + line.slice(0, 24), 'meta', line);
    return true;
  }

  _runningGag() {
    const gag = chaos.pick(RUNNING_GAGS);
    const n = this.gagCounters.get(gag.id);
    const stage = gag.stages[Math.min(n, gag.stages.length - 1)];
    if (this._onCooldown('rg:' + gag.id, 300)) return false; // running gags breathe
    this._narrate(stage.narrator, 'running');
    if (stage.visual) {
      const cam = this.game.camera;
      this.game.bus.emit('gag:visual', {
        visual: stage.visual,
        x: cam.x + chaos.float(-200, 200),
        y: cam.y + chaos.float(-150, 150),
        dir: chaos.pick([-1, 1]),
      });
    }
    this.gagCounters.set(gag.id, n + 1);
    this._record('rg:' + gag.id, 'running', stage.narrator);
    return true;
  }

  _callback() {
    // Reference a *specific* earlier joke instance, aged for flavor.
    if (this.history.length < 4) return false;
    const old = chaos.pick(this.history.slice(0, Math.max(1, this.history.length - 3)));
    if (this._onCooldown('cb:' + old.at)) return false;
    const daysAgo = this.game.clock.day - old.day;
    const when = daysAgo <= 0 ? 'earlier today' : daysAgo === 1 ? 'yesterday' : `${daysAgo} days ago`;
    const frames = [
      `Remember ${when}: "${trim(old.text)}"? The town remembers. The town keeps minutes.`,
      `Update on "${trim(old.text)}" (${when}): no update. Thank you for your patience.`,
      `A moment of silence for ${when}'s incident: "${trim(old.text)}".`,
    ];
    this._narrate(chaos.pick(frames), 'callback');
    this._record('cb:' + old.at, 'callback', old.text);
    return true;
  }

  // ── Interruption system: dialogue hijacks ──
  maybeInterruptDialogue() {
    if (!chaos.chance(0.06)) return null;
    if (this.game.randomEvents.active) return null;
    const ev = chaos.pick(['parade', 'karaoke_night', 'train_rumor']);
    if (this.game.randomEvents.trigger(ev)) {
      return 'HOLD THAT THOUGHT—'; // the dialogue engine shows the beat
    }
    return null;
  }

  // ── helpers ──
  _npcSays(npc, text, secs = 4.5) {
    npc.say(text, secs, this.game.engine.time);
    this.game.bus.emit('joke:told', { source: npc.id, text });
  }

  _narrate(text, kind) {
    this.game.bus.emit('narrator', { text, kind });
    this.game.bus.emit('joke:told', { source: 'narrator', text });
  }

  _onScreenNpc() {
    const cam = this.game.camera;
    const candidates = this.game.npcs.filter((n) => this._isOnScreen(n) && !n.bubble &&
      dist2(n.x, n.y, this.game.player.x, this.game.player.y) > 90 * 90);
    return candidates.length ? chaos.pick(candidates) : null;
  }

  _isOnScreen(npc) {
    const r = this.game.camera.viewRect(0);
    return npc.x > r.x && npc.x < r.x + r.w && npc.y > r.y && npc.y < r.y + r.h;
  }

  _fresh(lines) {
    const ok = lines.filter((l) => !this._onCooldown('ln:' + l.slice(0, 32)));
    if (!ok.length) return null;
    const line = chaos.pick(ok);
    this.ledger.set('ln:' + line.slice(0, 32), this.game.engine.time);
    return line;
  }

  _onCooldown(key, cd = LEDGER_COOLDOWN) {
    const last = this.ledger.get(key);
    return last !== undefined && this.game.engine.time - last < cd;
  }

  _record(key, cat, text, npc = null) {
    this.ledger.set(key, this.game.engine.time);
    this.history.push({ cat, text, at: this.game.engine.time, day: this.game.clock.day, npc: npc?.id });
    if (this.history.length > 60) this.history.shift();
  }

  exportGagCounters() { return Object.fromEntries(this.gagCounters); }
  importGagCounters(obj) {
    for (const [k, v] of Object.entries(obj || {})) this.gagCounters.set(k, v);
  }
}

function trim(s, n = 60) { return s.length > n ? s.slice(0, n - 1) + '…' : s; }
