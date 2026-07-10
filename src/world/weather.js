// Dynamic weather, some of it illegal in neighboring towns. Each weather has
// particles, a sky tint, a mood modifier for NPCs, and joke hooks. Transitions
// every 2–5 game hours with weighted odds.

import { chaos } from '../core/rng.js';

export const WEATHERS = [
  { id: 'sunny', name: 'Sunny', w: 26, tint: null, mood: +0.1, particle: null },
  { id: 'perfect', name: 'Suspiciously Perfect', w: 4, tint: 'rgba(255,240,180,0.06)', mood: +0.15, particle: 'sparkle' },
  { id: 'rain', name: 'Rain (Regular!)', w: 16, tint: 'rgba(40,60,110,0.18)', mood: -0.1, particle: 'rain' },
  { id: 'sideways', name: 'Sideways Rain', w: 6, tint: 'rgba(40,60,110,0.16)', mood: -0.05, particle: 'sideways' },
  { id: 'fishrain', name: 'Fish Rain', w: 6, tint: 'rgba(60,110,120,0.14)', mood: +0.05, particle: 'fish' },
  { id: 'meatballhail', name: 'Meatball Hail', w: 4, tint: 'rgba(120,60,30,0.12)', mood: 0, particle: 'meatball' },
  { id: 'snow', name: 'Snow', w: 8, tint: 'rgba(200,220,255,0.14)', mood: +0.05, particle: 'snow' },
  { id: 'wind', name: 'Very Opinionated Wind', w: 10, tint: null, mood: -0.05, particle: 'leaf' },
  { id: 'discofog', name: 'Disco Fog', w: 5, tint: 'rgba(160,60,200,0.14)', mood: +0.2, particle: 'disco' },
  { id: 'glitch', name: 'Sky Buffering', w: 3, tint: 'rgba(80,255,160,0.07)', mood: 0, particle: 'glitch' },
];

const BY_ID = new Map(WEATHERS.map((w) => [w.id, w]));

export class Weather {
  constructor(bus) {
    this.bus = bus;
    this.current = BY_ID.get('sunny');
    this.hoursLeft = chaos.float(2, 5);
    this.windPhase = 0;
  }

  setById(id) {
    const w = BY_ID.get(id);
    if (w) this.current = w;
  }

  update(dt, hoursPerSecond) {
    this.windPhase += dt;
    this.hoursLeft -= dt * hoursPerSecond;
    if (this.hoursLeft <= 0) this.transition();
  }

  transition(forceId = null) {
    const prev = this.current;
    if (forceId) {
      this.current = BY_ID.get(forceId) || prev;
    } else {
      // Don't repeat; suspiciously perfect never follows sunny (too subtle a gag).
      let next = prev;
      let guard = 0;
      while ((next === prev || (prev.id === 'sunny' && next.id === 'perfect')) && guard++ < 20) {
        next = chaos.weighted(WEATHERS);
      }
      this.current = next;
    }
    this.hoursLeft = chaos.float(2, 5);
    if (this.current !== prev) {
      this.bus.emit('weather:changed', { from: prev, to: this.current });
    }
  }
}
