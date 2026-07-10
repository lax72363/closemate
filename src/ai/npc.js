// The NPC brain. Every citizen runs a schedule (hour → intended location),
// a state machine, a mood, a memory, and simple steering with collision.
// Off-screen NPCs tick at 5 Hz (LOD) so 50 brains stay cheap.

import { Memory } from './memory.js';
import { chaos, Rng } from '../core/rng.js';
import { clamp, dist2 } from '../core/util.js';

export const NPC_STATE = {
  IDLE: 'idle', WALK: 'walk', WORK: 'work', CHAT: 'chat',
  DANCE: 'dance', PANIC: 'panic', NAP: 'nap', EVENT: 'event',
};

const WALK_SPEED = 95;
const LOD_TICK = 0.2; // off-screen update interval (5 Hz)

export class Npc {
  constructor(data, map) {
    this.id = data.id;
    this.data = data;
    this.map = map;
    this.rng = new Rng(hashId(data.id));
    // Some citizens list a district as "home"; resolve to a concrete spot.
    this.homeLoc = map.byLocationId.has(data.home) ? data.home : data.job;
    const home = map.standPoint(this.homeLoc);
    this.x = home.x; this.y = home.y;
    this.vx = 0; this.vy = 0;
    this.facing = 1;
    this.state = NPC_STATE.IDLE;
    this.stateTime = 0;
    this.target = null;          // {x, y, then: state}
    this.mood = chaos.float(-0.2, 0.4);   // -1..1
    this.emotion = 'neutral';    // rendered on the face
    this.memory = new Memory();
    this.bubble = null;          // { text, until }
    this.squash = 0;             // physical-comedy impulse; renderer reads it
    this.bounceT = chaos.float(0, 6.28);
    this._lodAcc = 0;
    this._chatPartner = null;
    this._eventLoc = null;
    // Personal schedule jitter so the town doesn't move in lockstep.
    this.wakeJitter = this.rng.float(-0.8, 0.8);
  }

  // Hour → where this citizen wants to be.
  scheduledLocation(hour) {
    const h = (hour + this.wakeJitter + 24) % 24;
    const d = this.data;
    if (this._eventLoc) return this._eventLoc;
    if (h < 7 || h >= 23) return this.homeLoc;
    if (h < 9) return this.rng.chance(0.5) ? 'coffee' : this.homeLoc;
    if (h < 12) return d.job;
    if (h < 13) return d.favorites[0];
    if (h < 18) return d.job;
    if (h < 21) return d.favorites[Math.floor(h) % d.favorites.length];
    return this.homeLoc;
  }

  update(dt, game, onScreen) {
    // LOD: off-screen brains think rarely and skip fine collision.
    if (!onScreen) {
      this._lodAcc += dt;
      if (this._lodAcc < LOD_TICK) return;
      dt = this._lodAcc;
      this._lodAcc = 0;
    }

    this.stateTime += dt;
    this.bounceT += dt * (2 + Math.abs(this.vx + this.vy) * 0.01);
    this.squash = Math.max(0, this.squash - dt * 3);
    if (this.bubble && game.engine.time > this.bubble.until) this.bubble = null;

    // Mood drifts toward the ambient mood set by weather/daily events.
    const ambient = game.weather.current.mood + (game.clock.dailyEvent().moodMod || 0);
    this.mood = clamp(this.mood + (ambient - this.mood) * dt * 0.05, -1, 1);
    this.emotion = this.mood > 0.35 ? 'happy' : this.mood < -0.35 ? 'grumpy' : 'neutral';

    switch (this.state) {
      case NPC_STATE.PANIC: {
        // Flail in a random direction, squashing wildly. Comedy first.
        if (this.stateTime > 2.5) { this.setState(NPC_STATE.IDLE); break; }
        if (this.rng.chance(0.15)) {
          const a = this.rng.float(0, Math.PI * 2);
          this.vx = Math.cos(a) * WALK_SPEED * 2.2;
          this.vy = Math.sin(a) * WALK_SPEED * 2.2;
          this.squash = 1;
        }
        this._move(dt);
        break;
      }
      case NPC_STATE.DANCE:
        this.vx = 0; this.vy = 0;
        this.squash = 0.4 + 0.4 * Math.sin(this.bounceT * 6);
        if (this.stateTime > 6 && !this._eventLoc) this.setState(NPC_STATE.IDLE);
        break;
      case NPC_STATE.CHAT:
        this.vx = 0; this.vy = 0;
        if (this.stateTime > this.rng.float(4, 9)) {
          if (this._chatPartner && game.relationships) {
            game.relationships.drift(this.id, this._chatPartner.id);
          }
          this._chatPartner = null;
          this.setState(NPC_STATE.IDLE);
        }
        break;
      case NPC_STATE.WALK: {
        if (!this.target) { this.setState(NPC_STATE.IDLE); break; }
        const dx = this.target.x - this.x, dy = this.target.y - this.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 40 * 40) {
          this.vx = 0; this.vy = 0;
          const then = this.target.then || NPC_STATE.IDLE;
          this.target = null;
          this.setState(then);
          break;
        }
        const d = Math.sqrt(d2);
        this.vx = (dx / d) * WALK_SPEED;
        this.vy = (dy / d) * WALK_SPEED;
        this._move(dt);
        break;
      }
      default: { // IDLE / WORK / NAP: consider next intent
        this.vx = 0; this.vy = 0;
        if (this.stateTime > this.rng.float(3, 8)) {
          this._decide(game);
        }
        break;
      }
    }
  }

  _decide(game) {
    const wantLoc = this.scheduledLocation(game.clock.hour);
    const spot = this.map.standPoint(wantLoc, this.rng);
    const far = dist2(this.x, this.y, spot.x, spot.y) > 90 * 90;
    if (far) {
      const arriveState = this._eventLoc
        ? (this.data.personality === 'chaotic' || this.mood > 0.3 ? NPC_STATE.DANCE : NPC_STATE.EVENT)
        : (game.clock.phase() === 'night' ? NPC_STATE.NAP : NPC_STATE.WORK);
      this.target = { x: spot.x, y: spot.y, then: arriveState };
      this.setState(NPC_STATE.WALK);
      return;
    }
    // Already there: sometimes chat with a neighbor, sometimes wander a step.
    const near = game.npcs.find((n) => n !== this &&
      dist2(this.x, this.y, n.x, n.y) < 130 * 130 &&
      (n.state === NPC_STATE.IDLE || n.state === NPC_STATE.WORK));
    if (near && this.rng.chance(0.4)) {
      this._chatPartner = near;
      near._chatPartner = this;
      this.setState(NPC_STATE.CHAT);
      near.setState(NPC_STATE.CHAT);
      game.bus.emit('npc:chat', { a: this, b: near });
      return;
    }
    if (this.rng.chance(0.6)) {
      this.target = {
        x: this.x + this.rng.float(-140, 140),
        y: this.y + this.rng.float(-140, 140),
        then: NPC_STATE.IDLE,
      };
      this.setState(NPC_STATE.WALK);
    } else {
      this.setState(NPC_STATE.IDLE);
    }
  }

  _move(dt) {
    const nx = this.x + this.vx * dt;
    const ny = this.y + this.vy * dt;
    // Slide along walls axis-by-axis; NPCs bonk instead of pathing (funnier).
    if (!this.map.isSolid(nx, this.y)) this.x = nx;
    else { this.vx = 0; if (this.state === NPC_STATE.WALK && this.rng.chance(0.3)) this.target = null; }
    if (!this.map.isSolid(this.x, ny)) this.y = ny;
    else { this.vy = 0; if (this.state === NPC_STATE.WALK && this.rng.chance(0.3)) this.target = null; }
    if (this.vx !== 0) this.facing = this.vx > 0 ? 1 : -1;
  }

  setState(s) { this.state = s; this.stateTime = 0; }

  say(text, seconds = 4, engineTime = 0) {
    this.bubble = { text, until: engineTime + seconds };
  }

  // Physical comedy hook: slip, bonk, boing.
  pratfall(kind = 'slip') {
    this.squash = 1.4;
    this.mood = clamp(this.mood - 0.1, -1, 1);
    this.setState(NPC_STATE.PANIC);
    return kind;
  }

  goToEvent(locId) { this._eventLoc = locId; this.setState(NPC_STATE.IDLE); this.stateTime = 99; }
  leaveEvent() { this._eventLoc = null; this.setState(NPC_STATE.IDLE); }
}

function hashId(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
