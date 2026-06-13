// Renders the Smoothy motion ad to PNG frames, then encodes an MP4 with ffmpeg.
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const { execFileSync } = require('child_process');
const ffmpeg = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');

// Try to register a bold font for nicer text.
try { GlobalFonts.registerFromPath('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 'Smoothy'); } catch (e) {}
try { GlobalFonts.registerFromPath('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 'SmoothyReg'); } catch (e) {}
const FB = 'Smoothy';      // bold family
const FR = 'SmoothyReg';   // regular family

const W = 1080, H = 1920, FPS = 30, DUR = 8;          // 8s vertical ad
const FRAMES = FPS * DUR;
const OUT = path.join(__dirname, 'frames');
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// easing
const easeOut = t => 1 - Math.pow(1 - t, 3);
const clamp01 = t => Math.max(0, Math.min(1, t));
// progress of a segment [a,b] at time s
const seg = (s, a, b) => clamp01((s - a) / (b - a));

const ACCENT = '#39e0a6', ACCENT2 = '#7af0c8', INK = '#eafff6', MUTED = '#9fd9c5';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const buckets = [
  { name: 'Savings', val: '+$480', icon: 'S' },
  { name: 'Investing', val: '+$240', icon: 'I' },
  { name: 'Goals', val: '+$180', icon: 'G' },
];

function drawFrame(i) {
  const s = i / FPS; // seconds
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // background gradient
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#0f3d30');
  bg.addColorStop(0.55, '#0a1f1a');
  bg.addColorStop(1, '#05100d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // brand
  ctx.globalAlpha = easeOut(seg(s, 0.1, 0.7));
  ctx.fillStyle = ACCENT;
  roundRect(ctx, 90, 120, 56, 56, 16); ctx.fill();
  ctx.fillStyle = INK;
  ctx.font = `bold 52px ${FB}`;
  ctx.textBaseline = 'middle';
  ctx.fillText('Smoothy', 168, 150);
  ctx.globalAlpha = 1;

  // headline
  const hp = easeOut(seg(s, 0.2, 1.0));
  ctx.globalAlpha = hp;
  ctx.textAlign = 'center';
  ctx.font = `bold 88px ${FB}`;
  ctx.fillStyle = INK;
  ctx.fillText('Get paid.', W / 2, 360 - (1 - hp) * 30);
  ctx.fillStyle = ACCENT;
  ctx.fillText('Save automatically.', W / 2, 470 - (1 - hp) * 30);
  ctx.globalAlpha = 1;
  ctx.textAlign = 'left';

  // paycheck card drops in
  const dp = easeOut(seg(s, 1.0, 1.9));
  if (dp > 0) {
    const cardY = 640 - (1 - dp) * 280;
    ctx.globalAlpha = dp;
    const cw = 760, cx = (W - cw) / 2;
    ctx.fillStyle = '#0c2a22';
    roundRect(ctx, cx, cardY, cw, 230, 28); ctx.fill();
    ctx.strokeStyle = 'rgba(122,240,200,.3)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = MUTED; ctx.font = `36px ${FR}`;
    ctx.fillText('Paycheck deposited', cx + 44, cardY + 62);
    ctx.fillStyle = INK; ctx.font = `bold 96px ${FB}`;
    ctx.fillText('$2,400', cx + 44, cardY + 150);
    ctx.fillStyle = ACCENT; ctx.font = `32px ${FR}`;
    ctx.fillText('Smoothy caught it the second it landed', cx + 44, cardY + 200);
    ctx.globalAlpha = 1;
  }

  // buckets pop in
  const bw = 300, gap = 30, totalW = bw * 3 + gap * 2;
  const startX = (W - totalW) / 2, by = 1180;
  buckets.forEach((b, k) => {
    const bp = easeOut(seg(s, 2.5 + k * 0.2, 3.0 + k * 0.2));
    if (bp <= 0) return;
    const x = startX + k * (bw + gap);
    ctx.globalAlpha = bp;
    const yo = (1 - bp) * 24;
    ctx.fillStyle = 'rgba(255,255,255,.05)';
    roundRect(ctx, x, by + yo, bw, 230, 22); ctx.fill();
    ctx.strokeStyle = 'rgba(122,240,200,.2)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = ACCENT; ctx.font = `bold 44px ${FB}`;
    ctx.textAlign = 'center';
    ctx.fillText(b.name, x + bw / 2, by + yo + 90);
    ctx.fillStyle = INK; ctx.font = `bold 56px ${FB}`;
    ctx.fillText(b.val, x + bw / 2, by + yo + 165);
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
  });

  // coins flying from card to buckets
  for (let k = 0; k < 3; k++) {
    const cp = seg(s, 2.35 + k * 0.15, 3.0 + k * 0.15);
    if (cp > 0 && cp < 1) {
      const sx = W / 2, sy = 760;
      const tx = startX + k * (bw + gap) + bw / 2, ty = by + 60;
      const x = sx + (tx - sx) * easeOut(cp);
      const y = sy + (ty - sy) * (cp * cp) - Math.sin(cp * Math.PI) * 80;
      ctx.globalAlpha = 1 - cp * 0.3;
      const g = ctx.createRadialGradient(x - 4, y - 4, 2, x, y, 16);
      g.addColorStop(0, ACCENT2); g.addColorStop(1, ACCENT);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y, 15, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // CTA
  const cp = easeOut(seg(s, 3.3, 4.0));
  if (cp > 0) {
    ctx.globalAlpha = cp;
    const bw2 = 560, bx = (W - bw2) / 2, byy = 1560 - (1 - cp) * 20;
    const grad = ctx.createLinearGradient(bx, 0, bx + bw2, 0);
    grad.addColorStop(0, ACCENT); grad.addColorStop(1, ACCENT2);
    ctx.fillStyle = grad;
    roundRect(ctx, bx, byy, bw2, 110, 55); ctx.fill();
    ctx.fillStyle = '#05221a'; ctx.font = `bold 48px ${FB}`;
    ctx.textAlign = 'center';
    ctx.fillText('Start free', W / 2, byy + 68);
    ctx.fillStyle = MUTED; ctx.font = `30px ${FR}`;
    ctx.fillText('First 1,000 users  ·  3 months Pro  ·  No card', W / 2, byy + 175);
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
  }

  fs.writeFileSync(path.join(OUT, `f${String(i).padStart(4, '0')}.png`), canvas.toBuffer('image/png'));
}

console.log(`Rendering ${FRAMES} frames...`);
for (let i = 0; i < FRAMES; i++) drawFrame(i);
console.log('Encoding MP4...');
execFileSync(ffmpeg, [
  '-y', '-framerate', String(FPS),
  '-i', path.join(OUT, 'f%04d.png'),
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  path.join(__dirname, 'smoothy-ad-vertical.mp4'),
], { stdio: 'inherit' });
console.log('Done: smoothy-ad-vertical.mp4');
