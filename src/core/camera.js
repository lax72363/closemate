// Cinematic camera: smooth follow, trauma-based shake, zoom punches for
// dramatic beats, letterbox for "very serious cartoon moments".

import { clamp, damp, lerp } from './util.js';

export class Camera {
  constructor(worldW, worldH) {
    this.x = 0; this.y = 0;            // center, world coords
    this.zoom = 1; this.targetZoom = 1;
    this.viewW = 1280; this.viewH = 720;
    this.worldW = worldW; this.worldH = worldH;
    this.trauma = 0;                    // 0..1, shake = trauma^2
    this.shakeX = 0; this.shakeY = 0; this.shakeRot = 0;
    this.letterbox = 0;                 // 0..1 animated bars
    this.letterboxTarget = 0;
    this.followRate = 5.5;
    this._t = 0;
  }

  resize(w, h) { this.viewW = w; this.viewH = h; }

  shake(amount) { this.trauma = clamp(this.trauma + amount, 0, 1); }
  punchZoom(z = 1.25, holdBack = 1) { this.zoom = z; this.targetZoom = holdBack; }
  cinematic(on) { this.letterboxTarget = on ? 1 : 0; }

  follow(tx, ty, dt) {
    this._t += dt;
    const k = damp(this.followRate, dt);
    this.x = lerp(this.x, tx, k);
    this.y = lerp(this.y, ty, k);
    this.zoom = lerp(this.zoom, this.targetZoom, damp(3, dt));
    this.letterbox = lerp(this.letterbox, this.letterboxTarget, damp(4, dt));

    // Shake decays; sample smooth pseudo-noise so it feels handheld, not jittery.
    this.trauma = Math.max(0, this.trauma - dt * 1.4);
    const s = this.trauma * this.trauma;
    this.shakeX = s * 22 * Math.sin(this._t * 47.3);
    this.shakeY = s * 22 * Math.sin(this._t * 39.7 + 2);
    this.shakeRot = s * 0.03 * Math.sin(this._t * 31.1 + 4);

    // Keep view inside the world.
    const hw = this.viewW / (2 * this.zoom), hh = this.viewH / (2 * this.zoom);
    this.x = clamp(this.x, hw, this.worldW - hw);
    this.y = clamp(this.y, hh, this.worldH - hh);
  }

  apply(ctx) {
    ctx.save();
    ctx.translate(this.viewW / 2, this.viewH / 2);
    ctx.rotate(this.shakeRot);
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-this.x + this.shakeX, -this.y + this.shakeY);
  }

  restore(ctx) { ctx.restore(); }

  // Visible world-space rect (with margin) for culling.
  viewRect(margin = 80) {
    const hw = this.viewW / (2 * this.zoom) + margin;
    const hh = this.viewH / (2 * this.zoom) + margin;
    return { x: this.x - hw, y: this.y - hh, w: hw * 2, h: hh * 2 };
  }

  worldToScreen(wx, wy) {
    return {
      x: (wx - this.x + this.shakeX) * this.zoom + this.viewW / 2,
      y: (wy - this.y + this.shakeY) * this.zoom + this.viewH / 2,
    };
  }
}
