// The player: Newt, the new kid whose art style never settled (a feature,
// per the town). Responsive movement with acceleration, squash & stretch,
// and an interaction probe for NPCs, props, and tapes.

import { clamp, dist2 } from '../core/util.js';

const ACCEL = 1400;
const MAX_SPEED = 230;
const FRICTION = 8;

export class Player {
  constructor(map, spawn) {
    this.map = map;
    this.x = spawn.x; this.y = spawn.y;
    this.vx = 0; this.vy = 0;
    this.facing = 1;
    this.reputation = 0;
    this.squash = 0;
    this.bounceT = 0;
    this.idleTime = 0;      // easter egg: the town forgets the protagonist
    this.styleGlitchT = 0;  // Newt's art style flickers between renderers
  }

  update(dt, input) {
    const ax = input.axis();
    this.vx += ax.x * ACCEL * dt;
    this.vy += ax.y * ACCEL * dt;
    if (ax.x === 0) this.vx -= this.vx * Math.min(1, FRICTION * dt);
    if (ax.y === 0) this.vy -= this.vy * Math.min(1, FRICTION * dt);
    const sp = Math.hypot(this.vx, this.vy);
    if (sp > MAX_SPEED) { this.vx *= MAX_SPEED / sp; this.vy *= MAX_SPEED / sp; }

    const nx = this.x + this.vx * dt;
    const ny = this.y + this.vy * dt;
    if (!this.map.isSolid(nx, this.y)) this.x = nx;
    else { this.squash = Math.max(this.squash, 0.7); this.vx *= -0.3; } // bonk!
    if (!this.map.isSolid(this.x, ny)) this.y = ny;
    else { this.squash = Math.max(this.squash, 0.7); this.vy *= -0.3; }

    if (this.vx !== 0) this.facing = this.vx > 0 ? 1 : -1;
    this.bounceT += dt * (2 + sp * 0.03);
    this.squash = Math.max(0, this.squash - dt * 4);
    this.styleGlitchT += dt;
    this.idleTime = sp < 5 ? this.idleTime + dt : 0;
    this.reputation = clamp(this.reputation, -100, 100);
  }

  nearestNpc(npcs, range = 90) {
    let best = null, bestD = range * range;
    for (const n of npcs) {
      const d = dist2(this.x, this.y, n.x, n.y);
      if (d < bestD) { bestD = d; best = n; }
    }
    return best;
  }

  nearestProp(props, range = 70) {
    let best = null, bestD = range * range;
    for (const p of props) {
      const d = dist2(this.x, this.y, p.x, p.y);
      if (d < bestD) { bestD = d; best = p; }
    }
    return best;
  }
}
