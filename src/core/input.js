// Keyboard state with pressed-edge detection. `pressed()` is true for exactly
// one update tick after the key goes down.

export class Input {
  constructor(target = window) {
    this.down = new Set();
    this.justPressed = new Set();
    this.anyKeyThisTick = false;
    target.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      this.down.add(e.code);
      this.justPressed.add(e.code);
      this.anyKeyThisTick = true;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Tab'].includes(e.code)) {
        e.preventDefault();
      }
    });
    target.addEventListener('keyup', (e) => this.down.delete(e.code));
    window.addEventListener('blur', () => this.down.clear());
  }

  held(...codes) { return codes.some((c) => this.down.has(c)); }
  pressed(...codes) { return codes.some((c) => this.justPressed.has(c)); }

  // Movement axis from WASD + arrows, normalized.
  axis() {
    let x = 0, y = 0;
    if (this.held('KeyA', 'ArrowLeft')) x -= 1;
    if (this.held('KeyD', 'ArrowRight')) x += 1;
    if (this.held('KeyW', 'ArrowUp')) y -= 1;
    if (this.held('KeyS', 'ArrowDown')) y += 1;
    if (x !== 0 && y !== 0) { const inv = 1 / Math.SQRT2; x *= inv; y *= inv; }
    return { x, y };
  }

  endTick() { this.justPressed.clear(); this.anyKeyThisTick = false; }
}
