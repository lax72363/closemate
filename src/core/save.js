// localStorage save/restore. Versioned so future content updates can migrate
// old saves instead of nuking them.

export const SAVE_VERSION = 1;
const KEY = 'wobbleton.save';

export class SaveSystem {
  constructor(game) { this.game = game; this.lastSaveAt = 0; }

  snapshot() {
    const g = this.game;
    return {
      v: SAVE_VERSION,
      day: g.clock.day,
      hour: g.clock.hour,
      player: { x: g.player.x, y: g.player.y, reputation: g.player.reputation },
      friendships: g.relationships.exportPlayer(),
      npcMemories: g.npcs.map((n) => ({ id: n.id, mem: n.memory.export(), mood: n.mood })),
      gags: g.comedy.exportGagCounters(),
      quests: g.quests.export(),
      tapes: g.collectibles.export(),
      weather: g.weather.current.id,
    };
  }

  save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(this.snapshot()));
      this.lastSaveAt = performance.now();
      return true;
    } catch { return false; }
  }

  load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data.v !== SAVE_VERSION) return null; // future: migrate
      return data;
    } catch { return null; }
  }

  restore(data) {
    const g = this.game;
    g.clock.day = data.day; g.clock.hour = data.hour;
    g.player.x = data.player.x; g.player.y = data.player.y;
    g.player.reputation = data.player.reputation;
    g.relationships.importPlayer(data.friendships);
    for (const rec of data.npcMemories || []) {
      const npc = g.npcById.get(rec.id);
      if (npc) { npc.memory.import(rec.mem); npc.mood = rec.mood; }
    }
    g.comedy.importGagCounters(data.gags);
    g.quests.import(data.quests);
    g.collectibles.import(data.tapes);
    g.weather.setById(data.weather);
  }

  clear() { localStorage.removeItem(KEY); }
}
