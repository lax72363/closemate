// Tiny pub/sub. Every system talks through here so the comedy engine can
// eavesdrop on the whole town.

export class EventBus {
  constructor() { this.listeners = new Map(); }

  on(type, fn) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(fn);
    return () => this.off(type, fn);
  }

  off(type, fn) { this.listeners.get(type)?.delete(fn); }

  emit(type, payload) {
    const set = this.listeners.get(type);
    if (set) for (const fn of set) fn(payload);
    const any = this.listeners.get('*');
    if (any) for (const fn of any) fn(type, payload);
  }
}
