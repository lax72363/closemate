// Fixed-timestep update (60 Hz) + rAF render. Gameplay speed is frame-rate
// independent; a clamped accumulator prevents the spiral of death after a
// tab-restore or long GC pause.

const STEP = 1 / 60;
const MAX_STEPS = 5;

export class Engine {
  constructor({ update, render }) {
    this.update = update;
    this.render = render;
    this.running = false;
    this.acc = 0;
    this.last = 0;
    this.fps = 60;
    this._fpsAcc = 0;
    this._fpsFrames = 0;
    this.time = 0; // total simulated seconds
  }

  start() {
    this.running = true;
    this.last = performance.now();
    const frame = (now) => {
      if (!this.running) return;
      let dt = (now - this.last) / 1000;
      this.last = now;
      if (dt > 0.25) dt = STEP; // tab was hidden; don't fast-forward the town
      this.acc += dt;

      let steps = 0;
      while (this.acc >= STEP && steps < MAX_STEPS) {
        this.update(STEP, this.time);
        this.time += STEP;
        this.acc -= STEP;
        steps++;
      }
      if (steps === MAX_STEPS) this.acc = 0; // panic-skip backlog

      this._fpsAcc += dt; this._fpsFrames++;
      if (this._fpsAcc >= 0.5) {
        this.fps = Math.round(this._fpsFrames / this._fpsAcc);
        this._fpsAcc = 0; this._fpsFrames = 0;
      }

      this.render(dt, this.time);
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  stop() { this.running = false; }
}
