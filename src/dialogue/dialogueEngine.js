// Generative dialogue: templates × live state. Every conversation pulls from
// the speaking citizen's personality bank, fills slots from the world (weather,
// events, memories of the player, gossip from the relationship matrix), offers
// tone-based choices, and writes the player's choice back into NPC memory and
// the town's reputation. An anti-repetition ledger keeps lines fresh.

import { chaos } from '../core/rng.js';
import {
  PERSONALITY_LINES, WEATHER_LINES, PLAYER_CHOICES, CHOICE_REACTIONS,
  CHOICE_TONES, PLAYER_TITLES,
} from '../data/dialogue.js';
import { CITIZENS } from '../data/citizens.js';
import { LOCATIONS_BY_ID } from '../data/locations.js';

const SNACKS = ['pretzels', 'a suspicious sushi', 'the infinite noodle', 'a meatball (hail-fresh)',
  'fro-yo with topping crimes', 'a glizzy', 'blue-flavored slush'];

export class DialogueEngine {
  constructor(game) {
    this.game = game;
    this.active = null;      // { npc, lines:[{who,text}], choices, phase }
    this.used = new Map();   // line -> engine time (anti-repetition)
  }

  get isOpen() { return this.active !== null; }

  start(npc) {
    const bank = PERSONALITY_LINES[npc.data.personality];
    const tier = this.game.relationships.playerTier(npc.id);
    const lines = [];

    lines.push({ who: npc.data.name, text: this._fill(this._fresh(bank['greet_' + tier]), npc) });

    // Second beat: memory callback > gossip > weather > mood — whatever's juiciest.
    const memory = npc.memory.recallAboutPlayer(chaos);
    if (memory && chaos.chance(0.65)) {
      lines.push({ who: npc.data.name, text: this._fill(this._fresh(bank.memory), npc, { memory }) });
    } else if (chaos.chance(0.5)) {
      const gossip = this.game.relationships.gossipAbout(npc.id);
      const otherId = gossip ? gossip.other : chaos.pick(CITIZENS).id;
      lines.push({ who: npc.data.name, text: this._fill(this._fresh(bank.gossip), npc, { otherId }) });
    } else if (chaos.chance(0.6)) {
      const wline = this._fresh(WEATHER_LINES[this.game.weather.current.id] || []);
      if (wline) lines.push({ who: npc.data.name, text: wline });
    } else {
      const moodBank = npc.mood >= 0 ? bank.mood_good : bank.mood_bad;
      lines.push({ who: npc.data.name, text: this._fill(this._fresh(moodBank), npc) });
    }

    // An active world event barges into conversations. It's that kind of town.
    const ev = this.game.randomEvents.active;
    if (ev && chaos.chance(0.7)) {
      lines.push({ who: npc.data.name, text: ev.def.npcLine });
    }

    // Rarely, the comedy engine hijacks the whole conversation.
    const interrupt = this.game.comedy.maybeInterruptDialogue();
    if (interrupt) {
      lines.push({ who: npc.data.name, text: interrupt });
      lines.push({ who: npc.data.name, text: 'Sorry. Where were we? Doesn\'t matter. LOOK AT THAT.' });
    }

    const set = chaos.pick(PLAYER_CHOICES);
    this.active = {
      npc, lines,
      idx: 0,
      choices: [
        { tone: 'nice', text: set.nice },
        { tone: 'weird', text: set.weird },
        { tone: 'chaotic', text: set.chaotic },
      ],
      phase: 'lines', // lines → choices → reaction → done
    };
    npc.setState('chat');
    npc.stateTime = -999; // pinned in chat until dialogue closes
    this.game.camera.cinematic(true);
    this.game.camera.punchZoom(1.18, 1.12);
  }

  advance() {
    const a = this.active;
    if (!a) return;
    if (a.phase === 'lines') {
      a.idx++;
      if (a.idx >= a.lines.length) a.phase = 'choices';
    } else if (a.phase === 'reaction') {
      this.close();
    }
  }

  choose(i) {
    const a = this.active;
    if (!a || a.phase !== 'choices') return;
    const choice = a.choices[i];
    if (!choice) return;
    const effects = CHOICE_TONES[choice.tone];
    this.game.relationships.addPlayer(a.npc.id, effects.friend);
    this.game.player.reputation += effects.rep;
    a.npc.memory.remember('player_choice',
      choice.tone === 'nice' ? 'said something genuinely kind'
        : choice.tone === 'weird' ? `asked about ${choice.text.toLowerCase().includes('soup') ? 'soup' : 'something deeply strange'}`
        : 'proposed glorious chaos', choice.tone === 'chaotic' ? 2 : 1);
    a.lines = [{ who: a.npc.data.name, text: chaos.pick(CHOICE_REACTIONS[choice.tone]) }];
    // High-friendship bonus beat: the catchphrase, earned.
    if (this.game.relationships.playerTier(a.npc.id) === 'high' && chaos.chance(0.5)) {
      a.lines.push({ who: a.npc.data.name, text: a.npc.data.catchphrase });
    }
    a.idx = 0;
    a.phase = 'reaction';
    this.game.bus.emit('dialogue:choice', { npc: a.npc, tone: choice.tone });
  }

  close() {
    if (!this.active) return;
    const npc = this.active.npc;
    const bank = PERSONALITY_LINES[npc.data.personality];
    npc.say(this._fill(this._fresh(bank.farewell), npc), 3, this.game.engine.time);
    npc.setState('idle');
    this.active = null;
    this.game.camera.cinematic(false);
    this.game.camera.targetZoom = 1;
  }

  // ── template filling ──
  _fill(template, npc, extra = {}) {
    if (!template) return '...';
    const rel = this.game.relationships;
    const other = extra.otherId
      ? CITIZENS.find((c) => c.id === extra.otherId)
      : chaos.pick(CITIZENS.filter((c) => c.id !== npc.id));
    const nearProp = this._nearestPropName(npc);
    return template
      .replaceAll('{player}', this.playerTitle())
      .replaceAll('{name}', npc.data.name)
      .replaceAll('{other}', other.name)
      .replaceAll('{place}', chaos.pick([...LOCATIONS_BY_ID.values()]).name)
      .replaceAll('{weather}', this.game.weather.current.name.toLowerCase())
      .replaceAll('{memory}', extra.memory || 'did that thing everyone talks about')
      .replaceAll('{snack}', chaos.pick(SNACKS))
      .replaceAll('{object}', nearProp)
      .replaceAll('{day}', String(this.game.clock.day));
  }

  playerTitle() {
    const rep = this.game.player.reputation;
    let title = PLAYER_TITLES[0].title;
    for (const t of PLAYER_TITLES) if (rep >= t.min) title = t.title;
    return title;
  }

  _nearestPropName(npc) {
    let best = null, bestD = 400 * 400;
    for (const p of this.game.map.props) {
      const dx = p.x - npc.x, dy = p.y - npc.y;
      const d = dx * dx + dy * dy;
      if (d < bestD) { bestD = d; best = p; }
    }
    return best ? best.obj.name : 'the incident';
  }

  _fresh(lines) {
    if (!lines || !lines.length) return null;
    const t = this.game.engine.time;
    const ok = lines.filter((l) => (this.used.get(l) ?? -999) < t - 90);
    const line = ok.length ? chaos.pick(ok) : chaos.pick(lines);
    this.used.set(line, t);
    return line;
  }
}
