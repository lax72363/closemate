// Draws the town: ground + roads + buildings are rasterized once per district
// into offscreen canvases (at half resolution — they're flat shapes) and
// blitted per frame. Props, tapes, water, and lighting are dynamic but culled
// to the camera. This is what keeps 100 buildings + 300 props at 60 FPS.

import { DISTRICTS } from '../data/locations.js';
import { roundRect, TAU, wobble, pointInRect } from '../core/util.js';

const CACHE_SCALE = 0.5;

export class WorldRenderer {
  constructor(map) {
    this.map = map;
    this.districtCanvases = new Map();
    this._buildCaches();
  }

  _buildCaches() {
    for (const d of DISTRICTS) {
      const rect = this.map.districtRects.get(d.id);
      const c = document.createElement('canvas');
      c.width = rect.w * CACHE_SCALE;
      c.height = rect.h * CACHE_SCALE;
      const g = c.getContext('2d');
      g.scale(CACHE_SCALE, CACHE_SCALE);
      g.translate(-rect.x, -rect.y);
      this._paintGround(g, d, rect);
      this._paintRoads(g, rect);
      for (const b of this.map.spots) {
        if (b.loc.district === d.id) this._paintSpot(g, b);
      }
      for (const b of this.map.buildings) {
        if (b.loc.district === d.id) this._paintBuilding(g, b);
      }
      this.districtCanvases.set(d.id, { canvas: c, rect });
    }
  }

  _paintGround(g, d, rect) {
    g.fillStyle = d.ground;
    g.fillRect(rect.x, rect.y, rect.w, rect.h);
    // Texture flecks — grass tufts, sand dots, pavement cracks. Same trick, new hat.
    g.fillStyle = 'rgba(0,0,0,0.07)';
    for (let i = 0; i < 380; i++) {
      const x = rect.x + ((i * 733) % rect.w);
      const y = rect.y + ((i * 1291) % rect.h);
      g.fillRect(x, y, 5, 2.5);
    }
    g.fillStyle = 'rgba(255,255,255,0.05)';
    for (let i = 0; i < 200; i++) {
      const x = rect.x + ((i * 977) % rect.w);
      const y = rect.y + ((i * 541) % rect.h);
      g.fillRect(x, y, 4, 2);
    }
  }

  _paintRoads(g, rect) {
    g.fillStyle = '#5a5766';
    const roadW = 70;
    // Border roads between districts + one internal avenue.
    g.fillRect(rect.x, rect.y, rect.w, roadW / 2);
    g.fillRect(rect.x, rect.y + rect.h - roadW / 2, rect.w, roadW / 2);
    g.fillRect(rect.x, rect.y, roadW / 2, rect.h);
    g.fillRect(rect.x + rect.w - roadW / 2, rect.y, roadW / 2, rect.h);
    g.fillRect(rect.x, rect.y + rect.h / 2 - roadW / 2, rect.w, roadW);
    // Dashes.
    g.fillStyle = '#d8d444';
    for (let x = rect.x + 20; x < rect.x + rect.w; x += 90) {
      g.fillRect(x, rect.y + rect.h / 2 - 3, 40, 6);
    }
  }

  _paintSpot(g, b) {
    const { loc } = b;
    if (loc.type === 'nature') {
      g.fillStyle = `hsl(${loc.hue} 40% 45% / 0.5)`;
      g.beginPath();
      g.ellipse(b.x + b.w / 2, b.y + b.h / 2, b.w / 2, b.h / 2, 0, 0, TAU);
      g.fill();
      // Ponds get water, everything else gets shrubs.
      const watery = /pond|pool|tide|canal/i.test(loc.name);
      if (watery) {
        g.fillStyle = '#4f8fd4';
        g.beginPath();
        g.ellipse(b.x + b.w / 2, b.y + b.h / 2, b.w * 0.36, b.h * 0.36, 0, 0, TAU);
        g.fill();
      } else {
        g.fillStyle = `hsl(${loc.hue} 45% 35%)`;
        for (let i = 0; i < 5; i++) {
          g.beginPath();
          g.arc(b.x + (i + 0.5) * b.w / 5, b.y + b.h * (0.3 + (i % 2) * 0.4), 14, 0, TAU);
          g.fill();
        }
      }
    } else { // landmark: a plinth + a Thing
      g.fillStyle = '#9a97a8';
      roundRect(g, b.x + b.w * 0.3, b.y + b.h * 0.45, b.w * 0.4, b.h * 0.4, 8);
      g.fill();
      g.fillStyle = `hsl(${loc.hue} 45% 55%)`;
      g.beginPath();
      g.ellipse(b.x + b.w / 2, b.y + b.h * 0.35, b.w * 0.18, b.h * 0.25, 0, 0, TAU);
      g.fill();
    }
    this._label(g, b);
  }

  _paintBuilding(g, b) {
    const { loc } = b;
    const wallL = 58, roofL = 42;
    // Shadow, wall, roof — flat cartoon architecture with personality hues.
    g.fillStyle = 'rgba(0,0,0,0.2)';
    roundRect(g, b.x + 6, b.y + 10, b.w, b.h, 10);
    g.fill();
    g.fillStyle = `hsl(${loc.hue} 42% ${wallL}%)`;
    g.strokeStyle = '#33304a';
    g.lineWidth = 4;
    roundRect(g, b.x, b.y, b.w, b.h, 10);
    g.fill(); g.stroke();
    // Roof band.
    g.fillStyle = `hsl(${(loc.hue + 25) % 360} 48% ${roofL}%)`;
    roundRect(g, b.x, b.y, b.w, b.h * 0.3, 10);
    g.fill();
    // Windows.
    g.fillStyle = 'rgba(255,244,180,0.85)';
    const cols = Math.max(2, Math.floor(b.w / 70));
    for (let i = 0; i < cols; i++) {
      roundRect(g, b.x + 18 + i * ((b.w - 36) / cols) + 6, b.y + b.h * 0.42, 26, 22, 4);
      g.fill();
    }
    // Door.
    g.fillStyle = '#4a3b2e';
    roundRect(g, b.x + b.w / 2 - 16, b.y + b.h - 40, 32, 36, 6);
    g.fill();
    this._label(g, b);
  }

  _label(g, b) {
    const name = b.loc.name;
    g.font = 'bold 17px "Comic Sans MS", cursive';
    g.textAlign = 'center';
    const tw = Math.min(b.w + 60, g.measureText(name).width + 18);
    g.fillStyle = 'rgba(20,18,31,0.82)';
    roundRect(g, b.x + b.w / 2 - tw / 2, b.y - 26, tw, 24, 8);
    g.fill();
    g.fillStyle = '#ffd94a';
    g.fillText(name, b.x + b.w / 2, b.y - 8, b.w + 50);
  }

  // ── per-frame ──
  render(ctx, camera, game) {
    const view = camera.viewRect(120);
    for (const { canvas, rect } of this.districtCanvases.values()) {
      if (rect.x + rect.w < view.x || rect.x > view.x + view.w ||
          rect.y + rect.h < view.y || rect.y > view.y + view.h) continue;
      ctx.drawImage(canvas, rect.x, rect.y, rect.w, rect.h);
    }
    this._renderStatuePose(ctx, game);
    this._renderProps(ctx, view, game.engine.time);
    this._renderTapes(ctx, view, game.engine.time);
  }

  // The founder statue's pose escalates with its running gag.
  _renderStatuePose(ctx, game) {
    const e = this.map.byLocationId.get('statue');
    if (!e) return;
    const stage = game.comedy ? game.comedy.gagCounters.get('statue') || 0 : 0;
    const cx = e.x + e.w / 2, cy = e.y + e.h * 0.35;
    ctx.save();
    ctx.strokeStyle = '#7d7a8c';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    // Arms only — the body is baked into the cache. Poses cycle with the gag.
    const poses = [
      [[-0.6, 0.5], [0.6, 0.5]],     // arms down (dignified. allegedly.)
      [[-0.9, -0.2], [0.9, -0.2]],   // finger guns
      [[-0.5, -0.9], [0.5, -0.9]],   // jazz hands up
      [[-1.0, 0.1], [0.4, -1.0]],    // heroic lunge
      [[-0.3, -1.1], [1.0, -0.4]],   // dab-adjacent
      [[0, -1.2], [0.9, -0.8]],      // pointing at YOU
    ];
    const pose = poses[stage % poses.length];
    for (const [dx, dy] of pose) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + dx * 34, cy + dy * 34);
      ctx.stroke();
    }
    ctx.restore();
  }

  _renderProps(ctx, view, t) {
    for (const p of this.map.props) {
      if (!pointInRect(p.x, p.y, view)) continue;
      drawProp(ctx, p, t);
    }
  }

  _renderTapes(ctx, view, t) {
    for (const tape of this.map.tapes) {
      if (tape.found || !pointInRect(tape.x, tape.y, view)) continue;
      const bob = Math.sin(t * 3 + tape.x) * 4;
      ctx.save();
      ctx.translate(tape.x, tape.y + bob);
      ctx.shadowColor = '#9fe8ff';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#22203a';
      roundRect(ctx, -14, -9, 28, 18, 3);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#9fe8ff';
      ctx.beginPath(); ctx.arc(-6, 0, 3.5, 0, TAU); ctx.arc(6, 0, 3.5, 0, TAU);
      ctx.fill();
      ctx.restore();
    }
  }
}

// Props: tiny mixed-style shapes by kind. Doodle props boil; photo props shine.
export function drawProp(ctx, p, t) {
  const { obj } = p;
  const hue = obj.hue;
  ctx.save();
  ctx.translate(p.x, p.y);
  const doodle = obj.style === 'doodle';
  const photo = obj.style === 'photo';
  if (doodle) {
    ctx.strokeStyle = '#22203a';
    ctx.lineWidth = 2;
    const j = wobble(Math.floor(t * 8) + p.seed, 1) * 1.5;
    ctx.translate(j, -j);
  }
  const fill = photo
    ? (() => { const g = ctx.createRadialGradient(-3, -5, 1, 0, 0, 16); g.addColorStop(0, `hsl(${hue} 60% 75%)`); g.addColorStop(1, `hsl(${hue} 55% 35%)`); return g; })()
    : `hsl(${hue} 55% ${obj.style === 'paper' ? 68 : 52}%)`;
  ctx.fillStyle = fill;
  switch (obj.kind) {
    case 'tall':
      roundRect(ctx, -5, -26, 10, 30, 4); doodle ? ctx.stroke() : ctx.fill();
      ctx.beginPath(); ctx.arc(0, -28, 7, 0, TAU); doodle ? ctx.stroke() : ctx.fill();
      break;
    case 'ball':
      ctx.beginPath(); ctx.arc(0, -6, 9, 0, TAU); doodle ? ctx.stroke() : ctx.fill();
      break;
    case 'box':
      roundRect(ctx, -9, -14, 18, 16, 3); doodle ? ctx.stroke() : ctx.fill();
      break;
    case 'flat':
      roundRect(ctx, -11, -5, 22, 7, 2); doodle ? ctx.stroke() : ctx.fill();
      break;
    case 'plant':
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath(); ctx.ellipse(i * 6, -8 - Math.abs(i) * -3, 5, 9, i * 0.4, 0, TAU);
        doodle ? ctx.stroke() : ctx.fill();
      }
      break;
    case 'food':
      ctx.beginPath(); ctx.arc(0, -6, 8, Math.PI, TAU); doodle ? ctx.stroke() : ctx.fill();
      ctx.fillStyle = `hsl(${(hue + 60) % 360} 55% 45%)`;
      ctx.fillRect(-8, -6, 16, 3);
      break;
    default: // misc: a little rhombus of intrigue
      ctx.beginPath();
      ctx.moveTo(0, -16); ctx.lineTo(8, -7); ctx.lineTo(0, 0); ctx.lineTo(-8, -7);
      ctx.closePath(); doodle ? ctx.stroke() : ctx.fill();
  }
  if (p.poked) { // a small heart: this object has been acknowledged
    ctx.fillStyle = 'rgba(255,120,150,0.9)';
    ctx.font = '10px sans-serif';
    ctx.fillText('♥', 8, -18);
  }
  ctx.restore();
}
