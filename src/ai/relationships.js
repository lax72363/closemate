// The town's social fabric: NPC↔NPC friendship/rivalry values that drift as
// citizens share space, and NPC↔player friendship moved by dialogue, gifts,
// and quests. Values in [-100, 100].

import { clamp } from '../core/util.js';
import { chaos } from '../core/rng.js';

export const TIER = {
  friend: 30,
  close: 60,
};

export class Relationships {
  constructor(citizenIds) {
    this.ids = citizenIds;
    this.player = new Map();   // npcId -> value
    this.social = new Map();   // 'a|b' (sorted) -> value
    for (const id of citizenIds) this.player.set(id, 0);
    // Seed NPC↔NPC feelings so the town has pre-existing drama on day one.
    for (let i = 0; i < citizenIds.length; i++) {
      for (let j = i + 1; j < citizenIds.length; j++) {
        if (chaos.chance(0.12)) {
          this.social.set(this._key(citizenIds[i], citizenIds[j]), chaos.int(-60, 60));
        }
      }
    }
  }

  _key(a, b) { return a < b ? a + '|' + b : b + '|' + a; }

  withPlayer(id) { return this.player.get(id) ?? 0; }
  addPlayer(id, delta) {
    this.player.set(id, clamp(this.withPlayer(id) + delta, -100, 100));
  }
  playerTier(id) {
    const v = this.withPlayer(id);
    return v >= TIER.close ? 'high' : v >= TIER.friend ? 'mid' : 'low';
  }

  between(a, b) { return this.social.get(this._key(a, b)) ?? 0; }
  addBetween(a, b, delta) {
    const k = this._key(a, b);
    this.social.set(k, clamp((this.social.get(k) ?? 0) + delta, -100, 100));
  }

  // A juicy relationship fact about `id` for gossip: strongest feeling first.
  gossipAbout(id) {
    let best = null, bestAbs = 20; // only report feelings worth gossiping about
    for (const [k, v] of this.social) {
      const [a, b] = k.split('|');
      if (a !== id && b !== id) continue;
      if (Math.abs(v) > bestAbs) { bestAbs = Math.abs(v); best = { other: a === id ? b : a, v }; }
    }
    return best;
  }

  // Citizens who share a location drift together (or apart, for rivals).
  drift(aId, bId) {
    const v = this.between(aId, bId);
    this.addBetween(aId, bId, v >= 0 ? chaos.float(0, 0.6) : -chaos.float(0, 0.4));
  }

  exportPlayer() { return Object.fromEntries(this.player); }
  importPlayer(obj) {
    for (const [k, v] of Object.entries(obj || {})) this.player.set(k, v);
  }
}
