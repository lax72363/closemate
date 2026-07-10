# WOBBLETON: Absolutely Normal Town

A browser-based animated comedy sandbox: a chaotic little town of 50 citizens
(51 — long story, she's "one person") rendered in seven clashing art styles,
where the comedy engine guarantees a joke every 5–15 seconds even if you never
touch the keyboard.

> Repo note: `main` previously described a real-estate chatbot ("closemate");
> this branch contains the animated-comedy game build.

## Run it

No build step, no dependencies. Serve the folder statically and open it:

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

(Any static server works. ES modules require http://, not file://.)

## Controls

| Key | Action |
|---|---|
| WASD / arrows | move |
| E | talk to citizens · poke objects · start minigames |
| 1–3 | dialogue choices (nice / weird / chaotic) |
| J | journal — VHS lore tapes, quests, friendships |
| Tab | switch journal tabs |
| Esc | close things (works 60% of the time, every time) |

## What's inside

- **50 citizens** with personalities, quirks, fears, goals, schedules,
  moods, memories of what you did, and relationships that drift over time
- **100 locations** across 8 districts, **330 pokeable objects**, day/night
  cycle, and weather including fish rain, meatball hail, and disco fog
- **A comedy engine**: background gags, one-liners, pratfalls, fourth-wall
  breaks, callbacks to specific earlier jokes, and running gags that escalate
  (the mayor's toupee has an arc)
- **Generative dialogue** that references the weather, town gossip, active
  events, and your past choices — with anti-repetition ledgers
- **Gameplay**: 5 escalating quest chains, 3 minigames (never blink at
  Gerald), 30 hidden lore tapes, reputation & friendship systems, random
  town events, easter eggs, autosave
- **Seven art styles** coexisting: 2D cartoon, pixel art, paper cutout,
  clay, low-poly, hand-drawn doodle, and one suspiciously photorealistic
  mannequin

## Architecture

Zero-dependency ES modules + Canvas 2D at a fixed-timestep 60 Hz with
camera culling, offscreen-canvas caching, and particle pools (measured
60 FPS headless). Full design doc: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

```
src/
  core/      engine loop, camera, input, RNG, event bus, saves
  data/      all content: citizens, locations, objects, jokes, lore, quests
  world/     clock, weather, town layout, random events
  ai/        NPC brains, memory, relationships
  comedy/    the joke scheduler
  dialogue/  generative template dialogue
  gameplay/  player, quests, collectibles, minigames
  render/    7 character styles, world, particles, UI
```
