// The 30 lost VHS tapes of Season Zero. Walk over one to collect it; the
// journal (J) plays back the lore. Collecting all 30 reveals the cast list.

import { dist2 } from '../core/util.js';
import { TAPES } from '../data/lore.js';

export class Collectibles {
  constructor(game) {
    this.game = game;
    this.found = new Set();
  }

  update() {
    const { player, map, bus } = this.game;
    for (const t of map.tapes) {
      if (t.found) continue;
      if (dist2(player.x, player.y, t.x, t.y) < 46 * 46) {
        t.found = true;
        this.found.add(t.tape.n);
        bus.emit('tape:found', { tape: t.tape, count: this.found.size, total: TAPES.length });
        bus.emit('narrator', {
          text: `TAPE FOUND (${this.found.size}/${TAPES.length}): ${t.tape.label}. Press J to watch. Please be kind. Rewind.`,
          kind: 'tape',
        });
        if (this.found.size === TAPES.length) {
          bus.emit('narrator', { text: 'ALL TAPES FOUND. The journal has a new final page. It was always going to be you.', kind: 'tape' });
        }
      }
    }
  }

  export() { return [...this.found]; }
  import(list) {
    this.found = new Set(list || []);
    for (const t of this.game.map.tapes) t.found = this.found.has(t.tape.n);
  }
}
