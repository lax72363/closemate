// Per-NPC memory: a ring buffer of salient facts about the player and the
// world. Dialogue pulls from here so citizens reference what actually
// happened — and saves persist it.

const MAX_MEMORIES = 12;

export class Memory {
  constructor() { this.entries = []; }

  // kind: 'player_choice' | 'gift' | 'quest' | 'witnessed' | 'weather' | 'event'
  remember(kind, text, weight = 1) {
    this.entries.push({ kind, text, weight, at: Date.now() });
    if (this.entries.length > MAX_MEMORIES) {
      // Forget the least important old thing, not just the oldest.
      let minI = 0;
      for (let i = 1; i < this.entries.length - 1; i++) {
        if (this.entries[i].weight < this.entries[minI].weight) minI = i;
      }
      this.entries.splice(minI, 1);
    }
  }

  // A memory about the player, weighted toward important ones.
  recallAboutPlayer(rng) {
    const about = this.entries.filter((e) =>
      e.kind === 'player_choice' || e.kind === 'gift' || e.kind === 'quest');
    if (!about.length) return null;
    return rng.weighted(about, (e) => e.weight).text;
  }

  hasAny() { return this.entries.length > 0; }
  export() { return this.entries.slice(-MAX_MEMORIES); }
  import(list) { this.entries = Array.isArray(list) ? list : []; }
}
