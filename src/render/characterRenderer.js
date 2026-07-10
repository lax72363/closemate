// Seven art styles, one town. Each style is a pure draw function; citizens
// from different renderers share the street like it's normal (it is, here).
// All styles share the same rig: squash & stretch scales, a facing flip,
// a walk bounce, and an expressive face.

import { wobble, TAU } from '../core/util.js';

const SHAPES = {
  blob: { w: 40, h: 34 },
  tall: { w: 28, h: 52 },
  round: { w: 38, h: 38 },
  bean: { w: 30, h: 40 },
  cube: { w: 36, h: 36 },
  triangle: { w: 38, h: 42 },
};

const PIXEL_SCALE = 4;
const pixelCache = new Map(); // 'hue|shape' -> offscreen canvas

export function drawCharacter(ctx, ent, t, styleOverride = null) {
  const d = ent.data;
  const style = styleOverride || d.style;
  const shape = SHAPES[d.shape] || SHAPES.blob;
  const scale = d.scale || 1;
  const w = shape.w * scale, h = shape.h * scale;

  // Squash & stretch: walk bounce + impact impulse. Volume is preserved-ish.
  const bounce = Math.abs(Math.sin(ent.bounceT * 3)) * 0.08 * (moving(ent) ? 1 : 0.25);
  const s = Math.min(1.2, ent.squash + bounce);
  const sx = 1 + s * 0.45;
  const sy = 1 - s * 0.35;
  const hop = moving(ent) ? Math.abs(Math.sin(ent.bounceT * 3)) * 6 : 0;

  // Shadow stays put while the body hops — that's the whole trick.
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.ellipse(ent.x, ent.y + h * 0.5, w * 0.5 * sx, 7, 0, 0, TAU);
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(ent.x, ent.y - hop);
  ctx.scale(ent.facing * sx, sy);

  switch (style) {
    case 'pixel': drawPixel(ctx, d, w, h); break;
    case 'paper': drawPaper(ctx, d, w, h, t); break;
    case 'clay': drawClay(ctx, d, w, h, t); break;
    case 'lowpoly': drawLowpoly(ctx, d, w, h); break;
    case 'doodle': drawDoodle(ctx, d, w, h, t); break;
    case 'photo': drawPhoto(ctx, d, w, h); break;
    default: drawCartoon(ctx, d, w, h);
  }

  if (style !== 'pixel') drawFace(ctx, ent, w, h, t, style);
  ctx.restore();
}

function moving(ent) { return Math.abs(ent.vx) + Math.abs(ent.vy) > 10; }
function body(hue, l = 60) { return `hsl(${hue} 70% ${l}%)`; }

// ── 2D cartoon: flat fills, fat outline, rubber-hose energy ──
function drawCartoon(ctx, d, w, h) {
  ctx.fillStyle = body(d.hue);
  ctx.strokeStyle = '#22203a';
  ctx.lineWidth = 3.5;
  shapePath(ctx, d.shape, w, h, 0.35);
  ctx.fill(); ctx.stroke();
  // Belly patch
  ctx.fillStyle = body(d.hue, 78);
  ctx.beginPath();
  ctx.ellipse(0, h * 0.12, w * 0.28, h * 0.26, 0, 0, TAU);
  ctx.fill();
}

// ── Pixel art: pre-rendered tiny sprite, nearest-neighbor blit ──
function drawPixel(ctx, d, w, h) {
  const key = d.hue + '|' + d.shape;
  let spr = pixelCache.get(key);
  if (!spr) {
    spr = makePixelSprite(d);
    pixelCache.set(key, spr);
  }
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(spr, -w / 2, -h / 2, spr.width * PIXEL_SCALE * (w / 40), spr.height * PIXEL_SCALE * (h / 40));
  ctx.imageSmoothingEnabled = true;
}

function makePixelSprite(d) {
  const c = document.createElement('canvas');
  const px = 10, py = 11;
  c.width = px; c.height = py;
  const g = c.getContext('2d');
  const base = body(d.hue, 55), light = body(d.hue, 70), dark = body(d.hue, 38);
  for (let y = 0; y < py; y++) {
    for (let x = 0; x < px; x++) {
      const cx = x - px / 2 + 0.5, cy = y - py / 2 + 0.5;
      const inside = d.shape === 'cube'
        ? Math.abs(cx) < px * 0.42 && Math.abs(cy) < py * 0.42
        : (cx * cx) / (px * px * 0.2) + (cy * cy) / (py * py * 0.2) < 1;
      if (!inside) continue;
      g.fillStyle = y < 3 ? light : y > py - 4 ? dark : base;
      g.fillRect(x, y, 1, 1);
    }
  }
  // Two-pixel eyes; pixel citizens emote in resolution, not curves.
  g.fillStyle = '#fff'; g.fillRect(5, 3, 1, 1); g.fillRect(7, 3, 1, 1);
  g.fillStyle = '#111'; g.fillRect(5, 4, 1, 1); g.fillRect(7, 4, 1, 1);
  return c;
}

// ── Paper cutout: flat shard with white rim, drop shadow, hinge wobble ──
function drawPaper(ctx, d, w, h, t) {
  ctx.save();
  ctx.rotate(wobble(d.hue, t * 0.7) * 0.06);
  ctx.save();
  ctx.translate(3, 4);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  paperPath(ctx, w, h, d.hue);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = body(d.hue, 62);
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  paperPath(ctx, w, h, d.hue);
  ctx.fill(); ctx.stroke();
  ctx.restore();
}

function paperPath(ctx, w, h, seed) {
  // Slightly irregular polygon — scissors were involved.
  ctx.beginPath();
  const n = 7;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * TAU - Math.PI / 2;
    const r = (i % 2 ? 0.92 : 1.02) + Math.sin(seed + i * 3.7) * 0.05;
    const x = Math.cos(a) * w * 0.5 * r;
    const y = Math.sin(a) * h * 0.5 * r;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
}

// ── Clay: lumpy overlapping blobs with thumbprint shading ──
function drawClay(ctx, d, w, h, t) {
  const lumps = 6;
  for (let pass = 0; pass < 2; pass++) {
    ctx.fillStyle = pass === 0 ? body(d.hue, 45) : body(d.hue, 60);
    for (let i = 0; i < lumps; i++) {
      const a = (i / lumps) * TAU;
      const lump = 1 + wobble(d.hue + i, t * 0.5) * 0.12;
      const r = (Math.min(w, h) * 0.3) * lump - pass * 2;
      const x = Math.cos(a) * w * 0.2;
      const y = Math.sin(a) * h * 0.2 + (pass === 0 ? 2 : 0);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
    }
  }
  // A thumbprint. Someone made this citizen by hand and it shows.
  ctx.strokeStyle = body(d.hue, 40);
  ctx.lineWidth = 1;
  for (let i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(-w * 0.15, h * 0.1, i * 2.5, 0.3, 2.4);
    ctx.stroke();
  }
}

// ── Low-poly: faceted triangles, flat shading ──
function drawLowpoly(ctx, d, w, h) {
  const pts = [
    [0, -h * 0.55], [w * 0.5, -h * 0.1], [w * 0.38, h * 0.5],
    [-w * 0.38, h * 0.5], [-w * 0.5, -h * 0.1],
  ];
  const tris = [[0, 1, 4], [1, 2, 4], [2, 3, 4]];
  const shades = [68, 55, 44];
  tris.forEach((tri, i) => {
    ctx.fillStyle = body(d.hue, shades[i]);
    ctx.strokeStyle = body(d.hue, 30);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pts[tri[0]][0], pts[tri[0]][1]);
    ctx.lineTo(pts[tri[1]][0], pts[tri[1]][1]);
    ctx.lineTo(pts[tri[2]][0], pts[tri[2]][1]);
    ctx.closePath();
    ctx.fill(); ctx.stroke();
  });
}

// ── Doodle: stroke-only, boiling at ~8 fps like hand-drawn animation ──
function drawDoodle(ctx, d, w, h, t) {
  const boil = Math.floor(t * 8); // quantized time = "line boil"
  ctx.strokeStyle = '#22203a';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.beginPath();
  const n = 12;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * TAU - Math.PI / 2;
    const j = wobble(boil + i * 7 + d.hue, 1) * 2.5;
    const x = Math.cos(a) * (w * 0.5 + j);
    const y = Math.sin(a) * (h * 0.5 + j);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
  // Scribble fill: three lazy hatch lines.
  ctx.globalAlpha = 0.35;
  for (let i = 0; i < 3; i++) {
    const j = wobble(boil * 3 + i, 2) * 3;
    ctx.beginPath();
    ctx.moveTo(-w * 0.3 + j, -h * 0.2 + i * h * 0.22);
    ctx.lineTo(w * 0.3 - j, -h * 0.1 + i * h * 0.22);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

// ── "Photorealistic": gradients, gloss, uncanny commitment ──
function drawPhoto(ctx, d, w, h) {
  const grad = ctx.createRadialGradient(-w * 0.2, -h * 0.25, 4, 0, 0, Math.max(w, h) * 0.75);
  grad.addColorStop(0, body(d.hue, 78));
  grad.addColorStop(0.55, body(d.hue, 52));
  grad.addColorStop(1, body(d.hue, 30));
  ctx.fillStyle = grad;
  shapePath(ctx, d.shape, w, h, 0.45);
  ctx.fill();
  // Specular highlight. The others resent how shiny this one is.
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.beginPath();
  ctx.ellipse(-w * 0.18, -h * 0.28, w * 0.12, h * 0.08, -0.5, 0, TAU);
  ctx.fill();
}

function shapePath(ctx, shape, w, h, r) {
  ctx.beginPath();
  switch (shape) {
    case 'cube': {
      const rad = Math.min(w, h) * r * 0.4;
      ctx.roundRect(-w / 2, -h / 2, w, h, rad);
      break;
    }
    case 'triangle':
      ctx.moveTo(0, -h / 2);
      ctx.lineTo(w / 2, h / 2);
      ctx.lineTo(-w / 2, h / 2);
      ctx.closePath();
      break;
    case 'tall':
      ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, TAU);
      break;
    case 'bean':
      ctx.ellipse(0, -h * 0.05, w * 0.5, h * 0.45, 0.15, 0, TAU);
      break;
    default:
      ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, TAU);
  }
}

// ── The face rig: everyone emotes the same way, which is the joke ──
function drawFace(ctx, ent, w, h, t, style) {
  const eyeY = -h * 0.16;
  const eyeDX = w * 0.16;
  const blink = (Math.sin(t * 1.3 + ent.x * 0.01) > 0.985);
  const isDoodle = style === 'doodle';
  const pr = isDoodle ? 0 : Math.max(3.5, w * 0.11); // eye white radius
  // Pupils track movement direction.
  const lookX = Math.max(-2, Math.min(2, ent.vx * 0.02));
  const lookY = Math.max(-2, Math.min(2, ent.vy * 0.02));

  for (const side of [-1, 1]) {
    if (blink && ent.state !== 'panic') {
      ctx.strokeStyle = '#22203a'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(side * eyeDX - 4, eyeY);
      ctx.lineTo(side * eyeDX + 4, eyeY);
      ctx.stroke();
      continue;
    }
    if (!isDoodle) {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(side * eyeDX, eyeY, ent.state === 'panic' ? pr * 1.6 : pr, 0, TAU);
      ctx.fill();
    }
    ctx.fillStyle = '#181628';
    ctx.beginPath();
    ctx.arc(side * eyeDX + lookX, eyeY + lookY, isDoodle ? 2.4 : pr * 0.45, 0, TAU);
    ctx.fill();
  }

  // Mouth: emotion-driven.
  ctx.strokeStyle = '#22203a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  const my = eyeY + h * 0.26;
  if (ent.state === 'panic') {
    ctx.arc(0, my, w * 0.14, 0, TAU); // perfect scream circle
  } else if (ent.emotion === 'happy') {
    ctx.arc(0, my - 2, w * 0.16, 0.25, Math.PI - 0.25);
  } else if (ent.emotion === 'grumpy') {
    ctx.arc(0, my + 7, w * 0.16, Math.PI + 0.3, TAU - 0.3);
  } else {
    ctx.moveTo(-w * 0.1, my);
    ctx.lineTo(w * 0.11, my + wobble(ent.x, t) * 1.2);
  }
  ctx.stroke();
}

// The player's style flickers between all seven — Newt never rendered right
// and the town finds it charming.
const GLITCH_STYLES = ['cartoon', 'pixel', 'paper', 'clay', 'lowpoly', 'doodle', 'photo'];
export function drawPlayer(ctx, player, t) {
  const style = GLITCH_STYLES[Math.floor(player.styleGlitchT / 3.5) % GLITCH_STYLES.length];
  const ent = {
    x: player.x, y: player.y, vx: player.vx, vy: player.vy,
    facing: player.facing, squash: player.squash, bounceT: player.bounceT,
    emotion: 'happy', state: 'idle',
    data: { style, shape: 'bean', hue: 165, scale: 1.0 },
  };
  drawCharacter(ctx, ent, t);
}
