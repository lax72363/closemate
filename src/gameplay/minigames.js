// Three minigames, each a modal state implementing {enter, update, render}.
// Launched near their home locations with E. Winning pays reputation and
// friendship; losing pays jokes. Everyone profits.
//
//  staredown — vs Gerald. Do NOT press anything. The game taunts you.
//  sandwich  — assembly speedrun: hit the shown key sequence in time.
//  danceoff  — timed arrows at the bandstand with DJ Drizzle.

import { chaos } from '../core/rng.js';
import { roundRect } from '../core/util.js';

const KEY_NAMES = { KeyW: 'W', KeyA: 'A', KeyS: 'S', KeyD: 'D', ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→', Space: 'SPACE' };

class StareDown {
  constructor() {
    this.id = 'staredown';
    this.title = 'PIGEON STARE-DOWN';
    this.hint = 'Rules: do NOT press anything. Gerald never blinks. Outlast him anyway.';
  }
  enter() {
    this.t = 0; this.dur = chaos.float(9, 13); this.result = null;
    this.taunts = chaos.shuffle([
      'Press SPACE for free money!!',
      'Your shoelace is untied. (You have no visible shoes.)',
      'Quick! E to blink for him!',
      'A bug is on your screen. Swat it! Use any key!',
      'Gerald respects quitters. Press anything to earn respect!',
    ]);
    this.tauntIdx = 0; this.nextTaunt = 2;
  }
  update(dt, input) {
    if (this.result) return this._exitTimer(dt);
    this.t += dt;
    // Grace period so the E that started the game doesn't instantly lose it.
    if (this.t > 0.5 && input.anyKeyThisTick) { this.result = 'lose'; this.doneIn = 2.2; return null; }
    if (this.t > this.nextTaunt && this.tauntIdx < this.taunts.length) {
      this.tauntIdx++; this.nextTaunt += chaos.float(1.5, 2.5);
    }
    if (this.t >= this.dur) { this.result = 'win'; this.doneIn = 2.2; }
    return null;
  }
  _exitTimer(dt) { this.doneIn -= dt; return this.doneIn <= 0 ? this.result : null; }
  render(ctx, w, h) {
    drawFrame(ctx, w, h, this.title);
    ctx.textAlign = 'center';
    // Gerald: an unblinking doodle pigeon.
    const cx = w / 2, cy = h / 2 - 30;
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(cx, cy, 48, 38, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx + 34, cy - 30, 20, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(cx + 40, cy - 32, 6, 0, Math.PI * 2); ctx.fill(); // the eye
    ctx.beginPath(); ctx.moveTo(cx + 52, cy - 30); ctx.lineTo(cx + 66, cy - 26); ctx.lineTo(cx + 52, cy - 22); ctx.fill();
    ctx.font = '20px "Comic Sans MS", cursive';
    if (this.result === 'win') {
      ctx.fillText('Gerald nods, 1mm. The highest honor.', cx, h - 140);
    } else if (this.result === 'lose') {
      ctx.fillText('You pressed a key. Gerald saw. Gerald always sees.', cx, h - 140);
    } else {
      ctx.fillText(`Hold... ${(this.dur - this.t).toFixed(1)}s`, cx, h - 170);
      if (this.tauntIdx < this.taunts.length) {
        ctx.fillStyle = '#ffd94a';
        ctx.fillText(this.taunts[this.tauntIdx], cx, h - 130);
      }
    }
  }
}

class SandwichRush {
  constructor() {
    this.id = 'sandwich';
    this.title = 'SANDWICH SPEEDRUN';
    this.hint = 'Hit the keys in order before the lunch rush arrives. Mustard is a liability.';
  }
  enter() {
    const pool = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];
    this.seq = Array.from({ length: 8 }, () => chaos.pick(pool));
    this.idx = 0; this.t = 0; this.limit = 9; this.result = null; this.doneIn = 0;
    this.layers = ['bread', 'lettuce', 'tomato', 'cheese', 'mystery', 'pickle', 'more bread?', 'bread'];
  }
  update(dt, input) {
    if (this.result) { this.doneIn -= dt; return this.doneIn <= 0 ? this.result : null; }
    this.t += dt;
    if (this.t > this.limit) { this.result = 'lose'; this.doneIn = 2.2; return null; }
    const want = this.seq[this.idx];
    for (const code of ['KeyW', 'KeyA', 'KeyS', 'KeyD']) {
      if (input.pressed(code)) {
        if (code === want) {
          this.idx++;
          if (this.idx >= this.seq.length) { this.result = 'win'; this.doneIn = 2.2; }
        } else {
          this.t += 0.8; // wrong ingredient: the clock judges you
        }
      }
    }
    return null;
  }
  render(ctx, w, h) {
    drawFrame(ctx, w, h, this.title);
    const cx = w / 2;
    ctx.textAlign = 'center';
    // The sandwich so far.
    for (let i = 0; i < this.idx; i++) {
      ctx.fillStyle = ['#e8c56b', '#7ec850', '#e25b4a', '#f5d442', '#b96be8', '#6bc85f', '#e8c56b', '#e8c56b'][i];
      roundRect(ctx, cx - 70, h / 2 + 40 - i * 14, 140, 12, 6);
      ctx.fill();
    }
    // Key sequence.
    ctx.font = '28px "Comic Sans MS", cursive';
    for (let i = 0; i < this.seq.length; i++) {
      ctx.fillStyle = i < this.idx ? '#6ee76e' : i === this.idx ? '#ffd94a' : '#8884aa';
      ctx.fillText(KEY_NAMES[this.seq[i]], cx - 140 + i * 40, h / 2 - 60);
    }
    ctx.fillStyle = '#fff'; ctx.font = '20px "Comic Sans MS", cursive';
    if (this.result === 'win') ctx.fillText('Frank nodded. That\'s a medal, from Frank.', cx, h - 140);
    else if (this.result === 'lose') ctx.fillText('The rush arrived. The sandwich became... abstract.', cx, h - 140);
    else ctx.fillText(`${Math.max(0, this.limit - this.t).toFixed(1)}s — next layer: ${this.layers[this.idx] || 'done!'}`, cx, h - 140);
  }
}

class DanceOff {
  constructor() {
    this.id = 'danceoff';
    this.title = 'DANCE-OFF AT THE BANDSTAND';
    this.hint = 'Hit each arrow while it\'s in the golden zone. The weather is watching.';
  }
  enter() {
    this.t = 0; this.result = null; this.doneIn = 0;
    this.notes = [];
    const arrows = ['ArrowLeft', 'ArrowDown', 'ArrowUp', 'ArrowRight'];
    for (let i = 0; i < 12; i++) {
      this.notes.push({ code: chaos.pick(arrows), at: 1.5 + i * 0.9, hit: null });
    }
    this.score = 0;
  }
  update(dt, input) {
    if (this.result) { this.doneIn -= dt; return this.doneIn <= 0 ? this.result : null; }
    this.t += dt;
    for (const n of this.notes) {
      if (n.hit === null && input.pressed(n.code) && Math.abs(n.at - this.t) < 0.28) {
        n.hit = true; this.score++;
      }
      if (n.hit === null && this.t > n.at + 0.3) n.hit = false;
    }
    const last = this.notes[this.notes.length - 1];
    if (this.t > last.at + 1) {
      this.result = this.score >= 8 ? 'win' : 'lose';
      this.doneIn = 2.4;
    }
    return null;
  }
  render(ctx, w, h) {
    drawFrame(ctx, w, h, this.title);
    const cy = h / 2;
    // Golden hit zone.
    ctx.fillStyle = 'rgba(255,217,74,0.25)';
    roundRect(ctx, w / 2 - 40, cy - 40, 80, 80, 16); ctx.fill();
    ctx.font = '40px "Comic Sans MS", cursive';
    ctx.textAlign = 'center';
    for (const n of this.notes) {
      const x = w / 2 + (n.at - this.t) * 260;
      if (x < -60 || x > w + 60) continue;
      ctx.fillStyle = n.hit === true ? '#6ee76e' : n.hit === false ? '#5c5877' : '#fff';
      ctx.fillText(KEY_NAMES[n.code], x, cy + 14);
    }
    ctx.fillStyle = '#fff'; ctx.font = '20px "Comic Sans MS", cursive';
    if (this.result === 'win') ctx.fillText('DJ Drizzle wept a light drizzle. Indoors. Perfect score-adjacent!', w / 2, h - 140);
    else if (this.result === 'lose') ctx.fillText('The weather vane stopped spinning out of secondhand embarrassment.', w / 2, h - 140);
    else ctx.fillText(`Groove: ${this.score}/12`, w / 2, h - 140);
  }
}

function drawFrame(ctx, w, h, title) {
  ctx.fillStyle = 'rgba(15,13,28,0.88)';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#ffd94a';
  ctx.font = 'bold 34px "Comic Sans MS", cursive';
  ctx.textAlign = 'center';
  ctx.fillText(title, w / 2, 90);
}

// Where each minigame lives: near this location, E offers it.
export const MINIGAME_SPOTS = [
  { id: 'staredown', loc: 'statue', prompt: 'challenge Gerald to a stare-down' },
  { id: 'sandwich', loc: 'hotdogcart', prompt: 'cover Frank\'s assembly station' },
  { id: 'danceoff', loc: 'bandstand', prompt: 'enter the dance-off' },
];

export class Minigames {
  constructor(game) {
    this.game = game;
    this.games = { staredown: new StareDown(), sandwich: new SandwichRush(), danceoff: new DanceOff() };
    this.active = null;
  }

  get isOpen() { return this.active !== null; }

  availableAt(x, y) {
    for (const spot of MINIGAME_SPOTS) {
      const e = this.game.map.byLocationId.get(spot.loc);
      if (!e) continue;
      const cx = e.x + e.w / 2, cy = e.y + e.h / 2;
      const dx = x - cx, dy = y - cy;
      if (dx * dx + dy * dy < 240 * 240) return spot;
    }
    return null;
  }

  start(id) {
    this.active = this.games[id];
    this.active.enter();
    this.game.bus.emit('minigame:start', { id });
  }

  update(dt, input) {
    if (!this.active) return;
    const result = this.active.update(dt, input);
    if (result) {
      const id = this.active.id;
      this.active = null;
      if (result === 'win') {
        this.game.player.reputation += 3;
        this.game.bus.emit('minigame:won', { id });
        this.game.bus.emit('narrator', { text: 'MINIGAME WON. The town pretends not to be impressed. The town is impressed.', kind: 'minigame' });
      } else {
        this.game.bus.emit('minigame:lost', { id });
        this.game.bus.emit('narrator', { text: 'Minigame lost. A formative experience. The gazebo already knows.', kind: 'minigame' });
      }
    }
  }

  render(ctx, w, h) { this.active?.render(ctx, w, h); }
}
