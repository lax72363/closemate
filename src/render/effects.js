// Particles and gag visuals. Fixed-size pool, no allocation in the hot loop,
// hard caps — weather can rain fish all day without denting the frame budget.

import { chaos } from '../core/rng.js';
import { TAU } from '../core/util.js';

const MAX_PARTICLES = 400;

export class Effects {
  constructor(game) {
    this.game = game;
    this.pool = Array.from({ length: MAX_PARTICLES }, () => ({
      alive: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 1,
      kind: 'rain', size: 2, hue: 0, dir: 1,
    }));
    this.cursor = 0;
    game.bus.on('gag:visual', (g) => this.spawnGag(g));
  }

  _spawn(kind, x, y, vx, vy, life, size = 3, hue = 0, dir = 1) {
    const p = this.pool[this.cursor];
    this.cursor = (this.cursor + 1) % MAX_PARTICLES;
    p.alive = true; p.kind = kind;
    p.x = x; p.y = y; p.vx = vx; p.vy = vy;
    p.life = life; p.maxLife = life; p.size = size; p.hue = hue; p.dir = dir;
  }

  // Weather particles fall inside the camera view only.
  updateWeather(dt) {
    const kind = this.game.weather.current.particle;
    if (!kind) return;
    const cam = this.game.camera;
    const view = cam.viewRect(60);
    const rate = { rain: 14, sideways: 12, snow: 6, fish: 0.6, meatball: 0.9, leaf: 3, disco: 4, sparkle: 2, glitch: 3 }[kind] || 3;
    if (chaos.next() < rate * dt * 4) {
      const x = view.x + chaos.float(0, view.w);
      const y = view.y - 40;
      switch (kind) {
        case 'rain': this._spawn('rain', x, y, 0, 620, 1.6, 2); break;
        case 'sideways': this._spawn('rain', view.x - 20, view.y + chaos.float(0, view.h), 640, 60, 1.6, 2); break;
        case 'snow': this._spawn('snow', x, y, chaos.float(-25, 25), 70, 8, 3); break;
        case 'fish': this._spawn('fish', x, y, chaos.float(-30, 30), 380, 2.4, 9, 195); break;
        case 'meatball': this._spawn('meatball', x, y, 0, 520, 2, 7, 18); break;
        case 'leaf': this._spawn('leaf', x, y, chaos.float(60, 160), 90, 5, 4, 95); break;
        case 'disco': this._spawn('disco', x, view.y + chaos.float(0, view.h), chaos.float(-20, 20), chaos.float(-14, 14), 4, 26, chaos.float(0, 360)); break;
        case 'sparkle': this._spawn('sparkle', x, view.y + chaos.float(0, view.h), 0, -18, 2, 3, 48); break;
        case 'glitch': this._spawn('glitch', x, view.y + chaos.float(0, view.h), 0, 0, 0.5, 10, 140); break;
      }
    }
  }

  spawnGag({ visual, x, y, dir = 1 }) {
    switch (visual) {
      case 'toupee_run': this._spawn('toupee', x, y, dir * 190, 0, 5, 10, 35, dir); break;
      case 'gnome_march': this._spawn('gnome', x, y, dir * 45, 0, 6, 10, 15, dir); break;
      case 'dog_chase':
        this._spawn('hotdog', x, y, dir * 210, 0, 5, 8, 25, dir);
        this._spawn('dogline', x - dir * 70, y, dir * 220, 0, 5, 10, 200, dir);
        break;
      case 'fish_flop': this._spawn('fish', x, y, dir * 60, -40, 4, 9, 195, dir); break;
      case 'balloon': this._spawn('balloon', x, y, chaos.float(-15, 15), -85, 7, 9, chaos.float(0, 360)); break;
      case 'roomba': this._spawn('roomba', x, y, dir * 120, 0, 5, 11, 200, dir); break;
      case 'paper_plane': this._spawn('plane', x, y, dir * 150, -12, 5, 8, 0, dir); break;
      case 'gerald_stare': this._spawn('gerald', x, y, 0, 0, 5, 10, 0, dir); break;
      case 'statue_pose': this._spawn('sparkle', x, y, 0, -30, 1.5, 5, 48); break;
      case 'confetti':
        for (let i = 0; i < 26; i++) {
          this._spawn('confetti', x, y, chaos.float(-160, 160), chaos.float(-260, -60), chaos.float(1, 2.2), 4, chaos.float(0, 360));
        }
        break;
      case 'impact':
        for (let i = 0; i < 10; i++) {
          const a = chaos.float(0, TAU);
          this._spawn('star', x, y - 14, Math.cos(a) * 130, Math.sin(a) * 130 - 60, 0.7, 4, 48);
        }
        break;
      case 'sparkle':
        for (let i = 0; i < 6; i++) {
          this._spawn('sparkle', x + chaos.float(-24, 24), y + chaos.float(-24, 24), 0, -25, 1.4, 3, 48);
        }
        break;
    }
  }

  update(dt) {
    this.updateWeather(dt);
    for (const p of this.pool) {
      if (!p.alive) continue;
      p.life -= dt;
      if (p.life <= 0) { p.alive = false; continue; }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.kind === 'confetti' || p.kind === 'star') p.vy += 420 * dt;
      if (p.kind === 'snow' || p.kind === 'leaf') p.x += Math.sin(p.life * 3) * 30 * dt;
    }
  }

  render(ctx) {
    const t = this.game.engine.time;
    for (const p of this.pool) {
      if (!p.alive) continue;
      const a = Math.min(1, p.life / (p.maxLife * 0.3));
      ctx.globalAlpha = a;
      switch (p.kind) {
        case 'rain':
          ctx.strokeStyle = 'rgba(160,190,255,0.7)';
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 0.02, p.y - p.vy * 0.02); ctx.stroke();
          break;
        case 'snow':
          ctx.fillStyle = '#fff';
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, TAU); ctx.fill();
          break;
        case 'fish':
          ctx.fillStyle = `hsl(${p.hue} 50% 60%)`;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.size, p.size * 0.5, Math.sin(t * 9) * 0.4, 0, TAU);
          ctx.fill();
          ctx.beginPath();
          ctx.moveTo(p.x - p.size * p.dir, p.y);
          ctx.lineTo(p.x - p.size * 1.7 * p.dir, p.y - 4);
          ctx.lineTo(p.x - p.size * 1.7 * p.dir, p.y + 4);
          ctx.fill();
          break;
        case 'meatball':
          ctx.fillStyle = `hsl(${p.hue} 45% 35%)`;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, TAU); ctx.fill();
          break;
        case 'leaf':
          ctx.fillStyle = `hsl(${p.hue} 45% 45%)`;
          ctx.beginPath(); ctx.ellipse(p.x, p.y, p.size, p.size * 0.5, p.life * 4, 0, TAU); ctx.fill();
          break;
        case 'disco':
          ctx.fillStyle = `hsl(${(p.hue + t * 120) % 360} 80% 60% / 0.16)`;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, TAU); ctx.fill();
          break;
        case 'sparkle': case 'star': {
          ctx.fillStyle = `hsl(${p.hue} 90% 70%)`;
          const s = p.size;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - s); ctx.lineTo(p.x + s * 0.35, p.y - s * 0.35);
          ctx.lineTo(p.x + s, p.y); ctx.lineTo(p.x + s * 0.35, p.y + s * 0.35);
          ctx.lineTo(p.x, p.y + s); ctx.lineTo(p.x - s * 0.35, p.y + s * 0.35);
          ctx.lineTo(p.x - s, p.y); ctx.lineTo(p.x - s * 0.35, p.y - s * 0.35);
          ctx.closePath(); ctx.fill();
          break;
        }
        case 'glitch':
          ctx.fillStyle = `hsl(${p.hue} 90% 60% / 0.5)`;
          ctx.fillRect(p.x, p.y, p.size * chaos.float(0.5, 3), 3);
          break;
        case 'confetti':
          ctx.fillStyle = `hsl(${p.hue} 85% 60%)`;
          ctx.fillRect(p.x, p.y, p.size, p.size * 0.6);
          break;
        case 'toupee': // a determined hairpiece with tiny legs
          ctx.fillStyle = `hsl(${p.hue} 45% 30%)`;
          ctx.beginPath(); ctx.ellipse(p.x, p.y - 8, p.size, p.size * 0.5, 0, Math.PI, TAU); ctx.fill();
          ctx.strokeStyle = '#22203a'; ctx.lineWidth = 2;
          for (const s of [-1, 1]) {
            ctx.beginPath();
            ctx.moveTo(p.x + s * 4, p.y - 5);
            ctx.lineTo(p.x + s * 4 + Math.sin(t * 25 + s) * 4, p.y + 2);
            ctx.stroke();
          }
          break;
        case 'gnome':
          ctx.fillStyle = `hsl(0 60% 50%)`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y - 18); ctx.lineTo(p.x + 6, p.y - 8); ctx.lineTo(p.x - 6, p.y - 8); ctx.fill();
          ctx.fillStyle = `hsl(${p.hue} 50% 60%)`;
          ctx.beginPath(); ctx.arc(p.x, p.y - 4, 6, 0, TAU); ctx.fill();
          break;
        case 'hotdog':
          ctx.fillStyle = `hsl(${p.hue} 60% 45%)`;
          ctx.beginPath(); ctx.ellipse(p.x, p.y - 6, p.size, p.size * 0.4, 0, 0, TAU); ctx.fill();
          break;
        case 'dogline': { // Scribbles at full sprint: three boiling lines and joy
          ctx.strokeStyle = '#22203a'; ctx.lineWidth = 2.5;
          const j = (n) => Math.sin(Math.floor(t * 8) * 3 + n) * 2;
          ctx.beginPath();
          ctx.ellipse(p.x + j(1), p.y - 8 + j(2), 10, 6, 0, 0, TAU);
          ctx.moveTo(p.x + 10 * p.dir, p.y - 12);
          ctx.lineTo(p.x + 15 * p.dir + j(3), p.y - 16);
          ctx.stroke();
          break;
        }
        case 'roomba':
          ctx.fillStyle = `hsl(${p.hue} 25% 45%)`;
          ctx.beginPath(); ctx.ellipse(p.x, p.y - 3, p.size, p.size * 0.35, 0, 0, TAU); ctx.fill();
          ctx.fillStyle = '#9fe8ff';
          ctx.fillRect(p.x - 2, p.y - 7, 4, 2);
          break;
        case 'plane':
          ctx.fillStyle = '#f5f2ff';
          ctx.beginPath();
          ctx.moveTo(p.x + 8 * p.dir, p.y);
          ctx.lineTo(p.x - 6 * p.dir, p.y - 5);
          ctx.lineTo(p.x - 3 * p.dir, p.y);
          ctx.lineTo(p.x - 6 * p.dir, p.y + 5);
          ctx.closePath(); ctx.fill();
          break;
        case 'balloon':
          ctx.fillStyle = `hsl(${p.hue} 75% 60%)`;
          ctx.beginPath(); ctx.ellipse(p.x, p.y - 10, 8, 10, 0, 0, TAU); ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x + Math.sin(t * 4) * 3, p.y + 12); ctx.stroke();
          break;
        case 'gerald': // Gerald manifests. Gerald watches. Gerald leaves.
          ctx.strokeStyle = '#22203a'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.ellipse(p.x, p.y - 8, 9, 7, 0, 0, TAU); ctx.stroke();
          ctx.beginPath(); ctx.arc(p.x + 7, p.y - 14, 4.5, 0, TAU); ctx.stroke();
          ctx.fillStyle = '#22203a';
          ctx.beginPath(); ctx.arc(p.x + 8.5, p.y - 15, 1.6, 0, TAU); ctx.fill();
          break;
      }
      ctx.globalAlpha = 1;
    }
  }
}
