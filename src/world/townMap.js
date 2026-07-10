// Deterministic town layout. Seeded RNG places all 100 locations into their
// districts on a jittered grid, scatters the 300+ objects and the 30 lore
// tapes, and builds a coarse collision grid. Same seed → same town, so saves
// and easter-egg spots always line up.

import { Rng } from '../core/rng.js';
import { LOCATIONS, DISTRICTS } from '../data/locations.js';
import { OBJECTS } from '../data/objects.js';
import { TAPES } from '../data/lore.js';

export const WORLD_W = 4800;
export const WORLD_H = 3600;
export const CELL = 48;
const COLS = WORLD_W / CELL;
const ROWS = WORLD_H / CELL;

// District rects: 4×2 grid of 1200×1800 zones.
const DISTRICT_GRID = [
  ['woods', 'suburbs', 'downtown', 'oldtown'],
  ['park', 'mall', 'industrial', 'beach'],
];

export class TownMap {
  constructor(seed = 20260710) {
    this.rng = new Rng(seed);
    this.districtRects = new Map();
    this.buildings = [];      // { loc, x, y, w, h, door:{x,y} }
    this.spots = [];          // nature/landmark open areas { loc, x, y, w, h }
    this.props = [];          // { obj, x, y, poked:false }
    this.tapes = [];          // { tape, x, y, found:false }
    this.byLocationId = new Map();
    this.solid = new Uint8Array(COLS * ROWS);
    this._layoutDistricts();
    this._placeLocations();
    this._placeProps();
    this._placeTapes();
  }

  _layoutDistricts() {
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 4; c++) {
        this.districtRects.set(DISTRICT_GRID[r][c], {
          x: c * 1200, y: r * 1800, w: 1200, h: 1800,
        });
      }
    }
  }

  _placeLocations() {
    for (const d of DISTRICTS) {
      const rect = this.districtRects.get(d.id);
      const locs = this.rng.shuffle(LOCATIONS.filter((l) => l.district === d.id));
      // 3×5 jittered grid of slots per district, with margins for roads.
      const slots = [];
      const cols = 3, rows = 5;
      const mx = 100, my = 120;
      const sw = (rect.w - mx * 2) / cols, sh = (rect.h - my * 2) / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          slots.push({ x: rect.x + mx + c * sw, y: rect.y + my + r * sh, w: sw, h: sh });
        }
      }
      const shuffled = this.rng.shuffle(slots);
      locs.forEach((loc, i) => {
        const slot = shuffled[i % shuffled.length];
        const w = Math.min(loc.w, slot.w - 60);
        const h = Math.min(loc.h, slot.h - 70);
        const x = slot.x + this.rng.float(10, Math.max(11, slot.w - w - 10));
        const y = slot.y + this.rng.float(10, Math.max(11, slot.h - h - 60));
        const isOpen = loc.type === 'nature' || loc.type === 'landmark';
        const entry = { loc, x, y, w, h, door: { x: x + w / 2, y: y + h + 24 } };
        if (isOpen) {
          this.spots.push(entry);
          // Landmarks get a small solid core so you can't walk through a statue.
          if (loc.type === 'landmark') {
            this._markSolid(x + w * 0.3, y + h * 0.3, w * 0.4, h * 0.4);
          }
        } else {
          this.buildings.push(entry);
          this._markSolid(x, y, w, h);
        }
        this.byLocationId.set(loc.id, entry);
      });
    }
  }

  _placeProps() {
    for (const obj of OBJECTS) {
      const districtId = obj.district === 'any'
        ? this.rng.pick(DISTRICTS).id : obj.district;
      const rect = this.districtRects.get(districtId);
      let x = 0, y = 0, tries = 0;
      do {
        x = rect.x + this.rng.float(60, rect.w - 60);
        y = rect.y + this.rng.float(60, rect.h - 60);
        tries++;
      } while (this.isSolid(x, y) && tries < 30);
      this.props.push({ obj, x, y, poked: false, seed: this.rng.float(0, 100) });
    }
  }

  _placeTapes() {
    // Tapes hide near props and behind buildings — deterministic scatter.
    for (const tape of TAPES) {
      const d = this.rng.pick(DISTRICTS);
      const rect = this.districtRects.get(d.id);
      let x = 0, y = 0, tries = 0;
      do {
        x = rect.x + this.rng.float(80, rect.w - 80);
        y = rect.y + this.rng.float(80, rect.h - 80);
        tries++;
      } while (this.isSolid(x, y) && tries < 30);
      this.tapes.push({ tape, x, y, found: false });
    }
  }

  _markSolid(x, y, w, h) {
    const c0 = Math.max(0, Math.floor(x / CELL));
    const r0 = Math.max(0, Math.floor(y / CELL));
    const c1 = Math.min(COLS - 1, Math.floor((x + w) / CELL));
    const r1 = Math.min(ROWS - 1, Math.floor((y + h) / CELL));
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) this.solid[r * COLS + c] = 1;
    }
  }

  isSolid(x, y) {
    if (x < 20 || y < 20 || x > WORLD_W - 20 || y > WORLD_H - 20) return true;
    const c = Math.floor(x / CELL), r = Math.floor(y / CELL);
    return this.solid[r * COLS + c] === 1;
  }

  districtAt(x, y) {
    for (const [id, r] of this.districtRects) {
      if (x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h) return id;
    }
    return 'downtown';
  }

  // Where an NPC stands when "at" a location: the doorstep, with jitter.
  standPoint(locId, rng = this.rng) {
    const e = this.byLocationId.get(locId);
    if (!e) return { x: WORLD_W / 2, y: WORLD_H / 2 };
    const isOpen = e.loc.type === 'nature';
    const jx = (rng.next ? rng.next() : Math.random()) * 120 - 60;
    if (isOpen) {
      return { x: e.x + e.w / 2 + jx, y: e.y + e.h / 2 + jx * 0.4 };
    }
    return { x: e.door.x + jx, y: e.door.y + Math.abs(jx) * 0.3 };
  }
}
