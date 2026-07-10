// Day/night cycle. One game day = 12 real minutes. Emits hour/day events
// that drive NPC schedules, lighting, and the daily-event system.

import { DAILY_EVENTS } from '../data/quests.js';

const REAL_SECONDS_PER_GAME_DAY = 12 * 60;
export const HOURS_PER_SECOND = 24 / REAL_SECONDS_PER_GAME_DAY;

export const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export class Clock {
  constructor(bus) {
    this.bus = bus;
    this.hour = 9;        // start mid-morning, town already in motion
    this.day = 1;
    this._lastHour = Math.floor(this.hour);
  }

  update(dt) {
    this.hour += dt * HOURS_PER_SECOND;
    if (this.hour >= 24) {
      this.hour -= 24;
      this.day++;
      this.bus.emit('clock:day', { day: this.day, weekday: this.weekday(), event: this.dailyEvent() });
    }
    const h = Math.floor(this.hour);
    if (h !== this._lastHour) {
      this._lastHour = h;
      this.bus.emit('clock:hour', { hour: h, phase: this.phase() });
    }
  }

  weekday() { return WEEKDAYS[this.day % 7]; }
  isTuesday() { return this.day % 7 === 2; }
  dailyEvent() { return DAILY_EVENTS[this.day % 7]; }

  // 'morning' | 'day' | 'evening' | 'night'
  phase() {
    const h = this.hour;
    if (h >= 6 && h < 10) return 'morning';
    if (h >= 10 && h < 17) return 'day';
    if (h >= 17 && h < 21) return 'evening';
    return 'night';
  }

  // 0 = full day, 1 = full night; smooth ramps at dawn/dusk for lighting.
  darkness() {
    const h = this.hour;
    if (h >= 7 && h < 18) return 0;
    if (h >= 18 && h < 21) return (h - 18) / 3;
    if (h >= 5 && h < 7) return 1 - (h - 5) / 2;
    return 1;
  }
}
