// Composition root. Builds the Game context, wires every system to the
// EventBus, runs the fixed-step update and the render pass. The only file
// that knows about everything.

import { Engine } from './core/engine.js';
import { EventBus } from './core/eventBus.js';
import { Input } from './core/input.js';
import { Camera } from './core/camera.js';
import { SaveSystem } from './core/save.js';
import { chaos } from './core/rng.js';
import { TownMap, WORLD_W, WORLD_H } from './world/townMap.js';
import { Clock, HOURS_PER_SECOND } from './world/clock.js';
import { Weather } from './world/weather.js';
import { RandomEvents } from './world/randomEvents.js';
import { Npc } from './ai/npc.js';
import { Relationships } from './ai/relationships.js';
import { ComedyEngine } from './comedy/comedyEngine.js';
import { DialogueEngine } from './dialogue/dialogueEngine.js';
import { Player } from './gameplay/player.js';
import { Quests } from './gameplay/quests.js';
import { Collectibles } from './gameplay/collectibles.js';
import { Minigames } from './gameplay/minigames.js';
import { WorldRenderer } from './render/worldRenderer.js';
import { drawCharacter, drawPlayer } from './render/characterRenderer.js';
import { Effects } from './render/effects.js';
import { UI } from './render/ui.js';
import { CITIZENS } from './data/citizens.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function buildGame() {
  const game = {};
  game.bus = new EventBus();
  game.input = new Input();
  game.map = new TownMap();
  game.clock = new Clock(game.bus);
  game.weather = new Weather(game.bus);
  game.randomEvents = new RandomEvents(game.bus, game.clock);
  game.relationships = new Relationships(CITIZENS.map((c) => c.id));
  game.npcs = CITIZENS.map((c) => new Npc(c, game.map));
  game.npcById = new Map(game.npcs.map((n) => [n.id, n]));
  const fountain = game.map.byLocationId.get('fountain');
  game.player = new Player(game.map, {
    x: fountain.x + fountain.w / 2,
    y: fountain.y + fountain.h + 80,
  });
  game.camera = new Camera(WORLD_W, WORLD_H);
  game.camera.x = game.player.x;
  game.camera.y = game.player.y;
  game.dialogue = new DialogueEngine(game);
  game.quests = new Quests(game);
  game.collectibles = new Collectibles(game);
  game.minigames = new Minigames(game);
  game.worldRenderer = new WorldRenderer(game.map);
  game.effects = new Effects(game);
  game.ui = new UI(game);
  game.comedy = new ComedyEngine(game);
  game.save = new SaveSystem(game);
  game.interactHint = null;
  game.eggs = { geraldPokes: 0, idleFired: false, fountainDay: 0 };
  return game;
}

const game = buildGame();

// ── update ────────────────────────────────────────────────────────────
function update(dt) {
  const { input } = game;

  // Modal layers eat input in priority order: minigame → journal → dialogue.
  if (game.minigames.isOpen) {
    game.minigames.update(dt, input);
  } else if (game.ui.journalOpen) {
    if (input.pressed('KeyJ', 'Escape')) game.ui.journalOpen = false;
    if (input.pressed('Tab')) game.ui.journalTab = (game.ui.journalTab + 1) % 3;
  } else if (game.dialogue.isOpen) {
    const d = game.dialogue.active;
    if (d.phase === 'choices') {
      if (input.pressed('Digit1')) game.dialogue.choose(0);
      if (input.pressed('Digit2')) game.dialogue.choose(1);
      if (input.pressed('Digit3')) game.dialogue.choose(2);
    } else if (input.pressed('KeyE', 'Space')) {
      game.dialogue.advance();
    }
    if (input.pressed('Escape')) game.dialogue.close();
  } else {
    game.player.update(dt, input);
    if (input.pressed('KeyJ')) game.ui.journalOpen = true;
    if (input.pressed('KeyE')) interact();
  }

  // The town runs regardless of what the player is doing. That's the show.
  game.clock.update(dt);
  game.weather.update(dt, HOURS_PER_SECOND);
  game.randomEvents.update(dt, HOURS_PER_SECOND);

  const npcView = game.camera.viewRect(260);
  for (const npc of game.npcs) {
    const onScreen = npc.x > npcView.x && npc.x < npcView.x + npcView.w &&
                     npc.y > npcView.y && npc.y < npcView.y + npcView.h;
    npc.update(dt, game, onScreen);
  }

  game.comedy.update(dt);
  game.quests.update();
  game.collectibles.update();
  game.effects.update(dt);
  game.ui.update(dt);
  updateInteractHint();
  updateEasterEggs();

  game.camera.follow(game.player.x, game.player.y - 30, dt);

  // Autosave every 45s of play.
  if (performance.now() - game.save.lastSaveAt > 45000) game.save.save();

  input.endTick();
}

function interact() {
  const npc = game.player.nearestNpc(game.npcs);
  if (npc) {
    if (npc.id === 'gerald') {
      game.eggs.geraldPokes++;
      if (game.eggs.geraldPokes === 10) {
        game.bus.emit('narrator', { text: 'Gerald... blinked. GERALD BLINKED. This changes the entire—we need a minute.', kind: 'meta' });
        game.player.reputation += 5;
      }
    }
    game.dialogue.start(npc);
    // Quest business rides along in the same conversation.
    const questLines = game.quests.onTalk(npc);
    if (questLines) game.dialogue.active.lines.push(...questLines);
    return;
  }
  const spot = game.minigames.availableAt(game.player.x, game.player.y);
  if (spot) { game.minigames.start(spot.id); return; }
  const prop = game.player.nearestProp(game.map.props);
  if (prop) {
    prop.poked = true;
    game.bus.emit('narrator', { text: `${prop.obj.name}: ${prop.obj.desc}`, kind: 'object' });
    game.bus.emit('object:poked', { prop });
  }
}

function updateInteractHint() {
  const npc = game.player.nearestNpc(game.npcs);
  if (npc) { game.interactHint = `E — talk to ${npc.data.name}`; return; }
  const spot = game.minigames.availableAt(game.player.x, game.player.y);
  if (spot) { game.interactHint = `E — ${spot.prompt}`; return; }
  const prop = game.player.nearestProp(game.map.props);
  if (prop) { game.interactHint = `E — inspect ${prop.obj.name}`; return; }
  game.interactHint = null;
}

function updateEasterEggs() {
  const p = game.player;
  // Stand still for 60s: the town forgets who the protagonist is.
  if (p.idleTime > 60 && !game.eggs.idleFired) {
    game.eggs.idleFired = true;
    const npc = p.nearestNpc(game.npcs, 4000) || chaos.pick(game.npcs);
    npc.say('Hey, uh... you\'re the protagonist, right? You dropped this: your motivation.', 6, game.engine.time);
    game.bus.emit('narrator', { text: 'You stood still so long the town forgot you\'re the main character. An NPC is attempting to deliver your lines.', kind: 'meta' });
  }
  if (p.idleTime < 1) game.eggs.idleFired = false;
  // The fountain at midnight: 20 minutes younger, once per day.
  if (game.clock.hour < 1 && game.eggs.fountainDay !== game.clock.day) {
    const f = game.map.byLocationId.get('fountain');
    const cx = f.x + f.w / 2, cy = f.y + f.h / 2;
    if ((p.x - cx) ** 2 + (p.y - cy) ** 2 < 140 * 140) {
      game.eggs.fountainDay = game.clock.day;
      game.player.reputation += 2;
      game.bus.emit('narrator', { text: 'You stand in the Fountain of Mild Youth at midnight. You feel 20 minutes younger. Mona rates your splash: "acceptable. Three splashes."', kind: 'meta' });
      game.bus.emit('gag:visual', { visual: 'sparkle', x: p.x, y: p.y });
    }
  }
}

// ── render ────────────────────────────────────────────────────────────
const entityBuffer = [];

function render(dt, t) {
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  game.camera.apply(ctx);
  game.worldRenderer.render(ctx, game.camera, game);

  // Y-sorted entities: painter's algorithm keeps feet honest.
  const view = game.camera.viewRect(120);
  entityBuffer.length = 0;
  for (const npc of game.npcs) {
    if (npc.x > view.x && npc.x < view.x + view.w && npc.y > view.y && npc.y < view.y + view.h) {
      entityBuffer.push(npc);
    }
  }
  entityBuffer.push(game.player);
  entityBuffer.sort((a, b) => a.y - b.y);
  for (const e of entityBuffer) {
    if (e === game.player) drawPlayer(ctx, game.player, t);
    else drawCharacter(ctx, e, t);
  }

  game.effects.render(ctx);
  game.ui.renderBubbles(ctx);

  // Night: streetlight glows at building doors, then a screen tint.
  const dark = game.clock.darkness();
  if (dark > 0.05) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const b of game.map.buildings) {
      if (b.door.x < view.x || b.door.x > view.x + view.w ||
          b.door.y < view.y || b.door.y > view.y + view.h) continue;
      const g = ctx.createRadialGradient(b.door.x, b.door.y, 5, b.door.x, b.door.y, 90);
      g.addColorStop(0, `rgba(255,214,110,${0.28 * dark})`);
      g.addColorStop(1, 'rgba(255,214,110,0)');
      ctx.fillStyle = g;
      ctx.fillRect(b.door.x - 90, b.door.y - 90, 180, 180);
    }
    ctx.restore();
  }
  game.camera.restore(ctx);

  if (dark > 0.05) {
    ctx.fillStyle = `rgba(12,10,40,${0.42 * dark})`;
    ctx.fillRect(0, 0, w, h);
  }
  const tint = game.weather.current.tint;
  if (tint) { ctx.fillStyle = tint; ctx.fillRect(0, 0, w, h); }

  game.minigames.render(ctx, w, h);
  game.ui.render(ctx, w, h);
}

// ── boot ──────────────────────────────────────────────────────────────
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  game.camera.resize(canvas.width, canvas.height);
}
window.addEventListener('resize', resize);
resize();

game.engine = new Engine({ update, render });

const bootEl = document.getElementById('boot');
const bootJokes = [
  'Loading 300 objects, 50 residents, and 1 (one) sentient toupee…',
  'Calibrating whimsy… whimsy at dangerous levels. Proceeding.',
  'Teaching the statue to hold still… negotiations failed. Proceeding.',
  'Reticulating noodles…',
];
document.getElementById('bootJoke').textContent = chaos.pick(bootJokes);

document.getElementById('startBtn').addEventListener('click', () => {
  bootEl.classList.add('hidden');
  const data = game.save.load();
  if (data) {
    game.save.restore(data);
    game.bus.emit('narrator', { text: `Welcome back to Wobbleton, day ${game.clock.day}. The town pretended not to miss you. The town missed you.`, kind: 'meta' });
  } else {
    game.bus.emit('narrator', { text: 'Welcome to WOBBLETON. Population: fluctuating. Vibes: immaculate. Statue: fine. Walk with WASD; poke things with E.', kind: 'meta' });
  }
  game.engine.start();
  canvas.focus();
});

// Expose for debugging and the curious. Dale says hi.
window.wobbleton = game;
