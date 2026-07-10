// Quest engine over the declarative chains in data/quests.js. Chains start
// mundane and escalate. Talking to a chain's giver offers/advances it;
// goto steps complete on arrival; minigame steps complete on a win.

import { QUEST_CHAINS } from '../data/quests.js';
import { CITIZENS_BY_ID } from '../data/citizens.js';
import { dist2 } from '../core/util.js';

export class Quests {
  constructor(game) {
    this.game = game;
    // chainId -> { step: index, done: bool }  (absent = not started)
    this.state = new Map();
    game.bus.on('minigame:won', ({ id }) => this._checkMinigame(id));
  }

  chainFor(npcId) { return QUEST_CHAINS.find((c) => c.giver === npcId); }
  progress(chainId) { return this.state.get(chainId); }

  activeChains() {
    return QUEST_CHAINS
      .filter((c) => this.state.has(c.id) && !this.state.get(c.id).done)
      .map((c) => ({ chain: c, ...this.state.get(c.id) }));
  }

  // Called when the player talks to any NPC. Returns quest dialogue lines
  // to inject, or null if this NPC has no quest business right now.
  onTalk(npc) {
    // Advancing a talk-step for any active chain?
    for (const { chain, step } of this.activeChains()) {
      const s = chain.steps[step];
      if (s.type === 'talk' && s.npc === npc.id) {
        this._advance(chain);
        return [{ who: npc.data.name, text: `(Quest: ${chain.title}) ` + s.done }];
      }
    }
    // Offering / progressing own chain?
    const chain = this.chainFor(npc.id);
    if (!chain) return null;
    const st = this.state.get(chain.id);
    if (st?.done) return null;
    if (!st) {
      // Quests unlock once the giver tolerates you.
      if (this.game.relationships.withPlayer(npc.id) < 5) return null;
      this.state.set(chain.id, { step: 0, done: false });
      this.game.bus.emit('quest:started', { chain });
      return [
        { who: npc.data.name, text: `(New quest: ${chain.title})` },
        { who: npc.data.name, text: chain.steps[0].say },
      ];
    }
    const s = chain.steps[st.step];
    return [{ who: npc.data.name, text: '(Reminder) ' + s.say }];
  }

  update() {
    // Complete goto-steps on arrival.
    const p = this.game.player;
    for (const { chain, step } of this.activeChains()) {
      const s = chain.steps[step];
      if (s.type !== 'goto') continue;
      const spot = this.game.map.byLocationId.get(s.loc);
      if (!spot) continue;
      const cx = spot.x + spot.w / 2, cy = spot.y + spot.h / 2;
      if (dist2(p.x, p.y, cx, cy) < 220 * 220) {
        this._advance(chain);
        this.game.bus.emit('narrator', { text: `(${chain.title}) ` + s.done, kind: 'quest' });
      }
    }
  }

  _checkMinigame(id) {
    for (const { chain, step } of this.activeChains()) {
      const s = chain.steps[step];
      if (s.type === 'minigame' && s.id === id) {
        this._advance(chain);
        this.game.bus.emit('narrator', { text: `(${chain.title}) ` + s.done, kind: 'quest' });
      }
    }
  }

  _advance(chain) {
    const st = this.state.get(chain.id);
    st.step++;
    if (st.step >= chain.steps.length) {
      st.done = true;
      this.game.player.reputation += 8;
      const giver = CITIZENS_BY_ID.get(chain.giver);
      this.game.relationships.addPlayer(chain.giver, 15);
      this.game.bus.emit('quest:completed', { chain });
      this.game.bus.emit('narrator', {
        text: `QUEST COMPLETE: "${chain.title}". ${giver.name} will remember this. So will the gazebo.`,
        kind: 'quest',
      });
      const npc = this.game.npcById.get(chain.giver);
      npc?.memory.remember('quest', `finished "${chain.title}" for me`, 3);
    } else {
      this.game.bus.emit('quest:advanced', { chain, step: st.step });
      // Tell the player the next beat immediately — no quest-log spelunking.
      const next = chain.steps[st.step];
      this.game.bus.emit('narrator', { text: `(${chain.title} — next) ` + next.say, kind: 'quest' });
    }
  }

  export() {
    return Object.fromEntries([...this.state].map(([k, v]) => [k, { ...v }]));
  }
  import(obj) {
    this.state = new Map(Object.entries(obj || {}).map(([k, v]) => [k, { ...v }]));
  }
}
