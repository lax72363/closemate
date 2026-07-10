// All screen-space UI: speech bubbles, the dialogue panel, HUD, narrator
// toasts, the journal, interact prompts, and cinematic letterboxing.

import { roundRect, wrapText, timeString, clamp } from '../core/util.js';
import { TAPES } from '../data/lore.js';
import { QUEST_CHAINS } from '../data/quests.js';
import { CITIZENS } from '../data/citizens.js';

const FONT = '"Comic Sans MS", "Chalkboard SE", cursive';
const TOAST_TIME = 6;

export class UI {
  constructor(game) {
    this.game = game;
    this.toasts = [];           // { text, kind, t }
    this.journalOpen = false;
    this.journalTab = 0;        // 0 tapes · 1 quests · 2 friends
    game.bus.on('narrator', ({ text, kind }) => {
      this.toasts.push({ text, kind, t: 0 });
      if (this.toasts.length > 3) this.toasts.shift();
    });
  }

  update(dt) {
    for (const toast of this.toasts) toast.t += dt;
    this.toasts = this.toasts.filter((t) => t.t < TOAST_TIME);
  }

  // ── world-space (called inside camera transform) ──
  renderBubbles(ctx) {
    const t = this.game.engine.time;
    const view = this.game.camera.viewRect(0);
    for (const npc of this.game.npcs) {
      if (!npc.bubble || t > npc.bubble.until) continue;
      if (npc.x < view.x || npc.x > view.x + view.w || npc.y < view.y || npc.y > view.y + view.h) continue;
      this._bubble(ctx, npc.x, npc.y - 58, npc.bubble.text);
    }
  }

  _bubble(ctx, x, y, text) {
    const font = `15px ${FONT}`;
    const lines = wrapText(ctx, text, 220, font);
    ctx.font = font;
    const w = Math.min(236, Math.max(...lines.map((l) => ctx.measureText(l).width)) + 20);
    const h = lines.length * 19 + 14;
    ctx.fillStyle = 'rgba(255,255,255,0.96)';
    ctx.strokeStyle = '#22203a';
    ctx.lineWidth = 2.5;
    roundRect(ctx, x - w / 2, y - h, w, h, 10);
    ctx.fill(); ctx.stroke();
    ctx.beginPath();               // tail
    ctx.moveTo(x - 7, y - 2);
    ctx.lineTo(x, y + 10);
    ctx.lineTo(x + 7, y - 2);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.96)';
    ctx.fill();
    ctx.fillStyle = '#22203a';
    ctx.textAlign = 'center';
    lines.forEach((l, i) => ctx.fillText(l, x, y - h + 20 + i * 19));
  }

  // ── screen-space ──
  render(ctx, w, h) {
    this._letterbox(ctx, w, h);
    this._hud(ctx, w, h);
    this._toasts(ctx, w, h);
    this._interactPrompt(ctx, w, h);
    this._dialogue(ctx, w, h);
    if (this.journalOpen) this._journal(ctx, w, h);
  }

  _letterbox(ctx, w, h) {
    const lb = this.game.camera.letterbox;
    if (lb < 0.02) return;
    const bar = h * 0.09 * lb;
    ctx.fillStyle = '#0c0a18';
    ctx.fillRect(0, 0, w, bar);
    ctx.fillRect(0, h - bar, w, bar);
  }

  _hud(ctx, w) {
    const g = this.game;
    ctx.save();
    ctx.font = `bold 16px ${FONT}`;
    ctx.textAlign = 'left';
    const line1 = `Day ${g.clock.day} (${g.clock.weekday()}) · ${timeString(g.clock.hour)} · ${g.weather.current.name}`;
    const ev = g.randomEvents.active ? ` · ⚡ ${g.randomEvents.active.def.name}` : '';
    const line2 = `${g.dialogue.playerTitle()} · rep ${g.player.reputation} · tapes ${g.collectibles.found.size}/${TAPES.length} · J journal`;
    const width = Math.max(ctx.measureText(line1 + ev).width, ctx.measureText(line2).width) + 24;
    ctx.fillStyle = 'rgba(20,18,31,0.75)';
    roundRect(ctx, 12, 12, width, 58, 12);
    ctx.fill();
    ctx.fillStyle = '#ffd94a';
    ctx.fillText(line1 + ev, 24, 36);
    ctx.fillStyle = '#cfc9ee';
    ctx.fillText(line2, 24, 58);
    // FPS, small and honest.
    ctx.textAlign = 'right';
    ctx.fillStyle = g.engine.fps >= 55 ? 'rgba(110,231,110,0.7)' : 'rgba(255,120,120,0.9)';
    ctx.fillText(`${g.engine.fps} fps`, w - 16, 28);
    ctx.restore();
  }

  _toasts(ctx, w) {
    ctx.save();
    ctx.textAlign = 'center';
    let y = 92;
    for (const toast of this.toasts) {
      const fade = clamp(Math.min(toast.t * 3, (TOAST_TIME - toast.t) * 2), 0, 1);
      ctx.globalAlpha = fade;
      const font = `15px ${FONT}`;
      const lines = wrapText(ctx, toast.text, w * 0.5, font);
      ctx.font = font;
      const bw = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 36;
      const bh = lines.length * 19 + 16;
      const isQuest = toast.kind === 'quest' || toast.kind === 'tape' || toast.kind === 'minigame';
      ctx.fillStyle = isQuest ? 'rgba(38,66,38,0.9)' : 'rgba(30,27,52,0.9)';
      ctx.strokeStyle = isQuest ? '#6ee76e' : '#8a7fe8';
      ctx.lineWidth = 2;
      roundRect(ctx, w / 2 - bw / 2, y, bw, bh, 10);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#f5f2ff';
      lines.forEach((l, i) => ctx.fillText(l, w / 2, y + 21 + i * 19));
      // The narrator signs their work.
      if (toast.kind === 'meta' || toast.kind === 'callback') {
        ctx.font = `italic 11px ${FONT}`;
        ctx.fillStyle = '#8a7fe8';
        ctx.fillText('— The Narrator', w / 2 + bw / 2 - 60, y + bh + 12);
      }
      y += bh + 18;
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  _interactPrompt(ctx, w, h) {
    const hint = this.game.interactHint;
    if (!hint || this.game.dialogue.isOpen || this.game.minigames.isOpen) return;
    ctx.save();
    ctx.font = `bold 16px ${FONT}`;
    ctx.textAlign = 'center';
    const tw = ctx.measureText(hint).width + 30;
    ctx.fillStyle = 'rgba(20,18,31,0.85)';
    roundRect(ctx, w / 2 - tw / 2, h - 96, tw, 32, 10);
    ctx.fill();
    ctx.fillStyle = '#6ee76e';
    ctx.fillText(hint, w / 2, h - 74);
    ctx.restore();
  }

  _dialogue(ctx, w, h) {
    const d = this.game.dialogue.active;
    if (!d) return;
    ctx.save();
    const panelH = 190;
    const y = h - panelH - 18;
    ctx.fillStyle = 'rgba(16,14,30,0.94)';
    ctx.strokeStyle = '#8a7fe8';
    ctx.lineWidth = 3;
    roundRect(ctx, 24, y, w - 48, panelH, 16);
    ctx.fill(); ctx.stroke();

    ctx.textAlign = 'left';
    if (d.phase === 'lines' || d.phase === 'reaction') {
      const line = d.lines[Math.min(d.idx, d.lines.length - 1)];
      ctx.font = `bold 18px ${FONT}`;
      ctx.fillStyle = '#ffd94a';
      ctx.fillText(line.who, 48, y + 36);
      ctx.font = `17px ${FONT}`;
      ctx.fillStyle = '#f5f2ff';
      const lines = wrapText(ctx, line.text, w - 130, `17px ${FONT}`);
      lines.forEach((l, i) => ctx.fillText(l, 48, y + 66 + i * 24));
      ctx.font = `13px ${FONT}`;
      ctx.fillStyle = '#8884aa';
      ctx.textAlign = 'right';
      ctx.fillText('E / SPACE to continue', w - 48, y + panelH - 16);
    } else if (d.phase === 'choices') {
      ctx.font = `bold 16px ${FONT}`;
      ctx.fillStyle = '#9fe8ff';
      ctx.fillText('Your move:', 48, y + 32);
      ctx.font = `16px ${FONT}`;
      d.choices.forEach((c, i) => {
        const cy = y + 62 + i * 36;
        ctx.fillStyle = ['#6ee76e', '#ffd94a', '#ff8a8a'][i];
        ctx.fillText(`${i + 1}.`, 48, cy);
        ctx.fillStyle = '#f5f2ff';
        ctx.fillText(c.text, 76, cy);
      });
    }
    ctx.restore();
  }

  _journal(ctx, w, h) {
    ctx.save();
    ctx.fillStyle = 'rgba(10,8,22,0.92)';
    ctx.fillRect(0, 0, w, h);
    const bw = Math.min(760, w - 60);
    const bx = w / 2 - bw / 2;
    ctx.fillStyle = '#1e1b34';
    ctx.strokeStyle = '#8a7fe8';
    ctx.lineWidth = 3;
    roundRect(ctx, bx, 46, bw, h - 92, 18);
    ctx.fill(); ctx.stroke();

    const tabs = ['VHS TAPES', 'QUESTS', 'FRIENDS'];
    ctx.textAlign = 'left';
    tabs.forEach((tab, i) => {
      ctx.font = `bold 17px ${FONT}`;
      ctx.fillStyle = i === this.journalTab ? '#ffd94a' : '#6c6690';
      ctx.fillText(tab, bx + 32 + i * 150, 84);
    });
    ctx.font = `12px ${FONT}`;
    ctx.fillStyle = '#8884aa';
    ctx.textAlign = 'right';
    ctx.fillText('TAB to switch · J / ESC to close', bx + bw - 24, 84);
    ctx.textAlign = 'left';

    let y = 122;
    const maxY = h - 78;
    if (this.journalTab === 0) {
      const found = this.game.collectibles.found;
      for (const tape of TAPES) {
        if (y > maxY) break;
        if (found.has(tape.n)) {
          ctx.font = `bold 14px ${FONT}`;
          ctx.fillStyle = '#9fe8ff';
          ctx.fillText(tape.label, bx + 32, y);
          y += 18;
          ctx.font = `13px ${FONT}`;
          ctx.fillStyle = '#cfc9ee';
          const text = tape.text.replaceAll('{player}', this.game.dialogue.playerTitle());
          for (const l of wrapText(ctx, text, bw - 70, `13px ${FONT}`)) {
            if (y > maxY) break;
            ctx.fillText(l, bx + 44, y);
            y += 16;
          }
          y += 8;
        } else {
          ctx.font = `13px ${FONT}`;
          ctx.fillStyle = '#524d70';
          ctx.fillText(`S0E${String(tape.n).padStart(2, '0')} — [ static. keep looking. ]`, bx + 32, y);
          y += 20;
        }
      }
    } else if (this.journalTab === 1) {
      for (const chain of QUEST_CHAINS) {
        if (y > maxY) break;
        const st = this.game.quests.progress(chain.id);
        ctx.font = `bold 15px ${FONT}`;
        ctx.fillStyle = st?.done ? '#6ee76e' : st ? '#ffd94a' : '#524d70';
        const status = st?.done ? '✓ ' : st ? `(${st.step}/${chain.steps.length}) ` : '? ';
        ctx.fillText(status + chain.title, bx + 32, y);
        y += 20;
        ctx.font = `13px ${FONT}`;
        ctx.fillStyle = '#cfc9ee';
        const detail = st?.done ? 'Complete. The gazebo has the full story.'
          : st ? chain.steps[st.step].say
          : 'Someone in town has a problem. Befriend people; problems follow.';
        for (const l of wrapText(ctx, detail, bw - 70, `13px ${FONT}`)) {
          if (y > maxY) break;
          ctx.fillText(l, bx + 44, y);
          y += 16;
        }
        y += 10;
      }
    } else {
      const rel = this.game.relationships;
      const ranked = CITIZENS
        .map((c) => ({ c, v: rel.withPlayer(c.id) }))
        .filter((r) => r.v !== 0)
        .sort((a, b) => b.v - a.v)
        .slice(0, 18);
      if (!ranked.length) {
        ctx.font = `14px ${FONT}`;
        ctx.fillStyle = '#8884aa';
        ctx.fillText('No friendships yet. Walk up to someone and press E. They don\'t bite. Mostly.', bx + 32, y);
      }
      for (const { c, v } of ranked) {
        if (y > maxY) break;
        ctx.font = `bold 14px ${FONT}`;
        ctx.fillStyle = v >= 60 ? '#6ee76e' : v >= 30 ? '#9fe8ff' : v > 0 ? '#cfc9ee' : '#ff8a8a';
        const tier = v >= 60 ? 'close friend' : v >= 30 ? 'friend' : v > 0 ? 'acquaintance' : 'it\'s complicated';
        ctx.fillText(`${c.name} — ${tier} (${v})`, bx + 32, y);
        y += 17;
        ctx.font = `12px ${FONT}`;
        ctx.fillStyle = '#8884aa';
        ctx.fillText(c.species + ' · ' + c.quirk, bx + 44, y, bw - 80);
        y += 20;
      }
    }
    ctx.restore();
  }
}
