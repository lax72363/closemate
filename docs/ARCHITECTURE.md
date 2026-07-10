# WOBBLETON: Absolutely Normal Town — Architecture

A browser-based animated comedy sandbox. A chaotic little town that generates
jokes constantly — even when the player just stands there. This document is
the complete design: every system, the folder layout, the performance plan,
and the scalability plan. Code follows this document.

---

## 1. High-level architecture

**Zero-dependency, zero-build.** Pure ES modules + Canvas 2D. Rationale:

- No bundler/toolchain to break; `index.html` + a static server is the whole pipeline.
- Canvas 2D comfortably hits 60 FPS for a few hundred stylized vector/pixel
  entities when combined with culling and offscreen caching (see §8).
- Every asset is procedural (shapes, offscreen-canvas sprites, particles),
  which is exactly what the "mixed art styles" pillar wants: each style is a
  *renderer*, not an asset pack.

**Core pattern:** a single `Game` context object owns subsystem instances.
Subsystems communicate through a pub/sub `EventBus` (`npc:slipped`,
`weather:changed`, `joke:told`, `quest:advanced`, …). The comedy engine is a
*listener over everything*: any system can emit a comedic opportunity and the
comedy engine decides whether it becomes a joke, a callback, or a running-gag
escalation.

```
                 ┌────────────────────────────────────────────┐
                 │                  Engine                     │
                 │  fixed-step update (60 Hz) + rAF render     │
                 └───────┬────────────────────────┬───────────┘
                         ▼                        ▼
   ┌─────────────── UPDATE ───────────────┐  ┌── RENDER ──────────────┐
   │ Clock → Weather → RandomEvents       │  │ WorldRenderer (culled) │
   │ → NPC brains (LOD) → Player          │  │ → CharacterRenderer    │
   │ → Quests → ComedyEngine → Dialogue   │  │   (7 art styles)       │
   │ → Effects/Particles → Camera         │  │ → Effects → UI/Bubbles │
   └──────────────────┬───────────────────┘  └────────────────────────┘
                      ▼
               EventBus (pub/sub)  ←— every system emits & listens
                      ▼
               SaveSystem (localStorage snapshots)
```

## 2. Folder design

```
index.html                  bootstrap + canvas + font
styles/main.css             HUD/dialogue chrome (canvas draws the world)
docs/ARCHITECTURE.md        this file
src/
  main.js                   composition root: builds Game, wires systems
  core/
    engine.js               fixed-timestep loop, FPS guard
    eventBus.js             pub/sub
    input.js                keyboard state + pressed-edge queries
    camera.js               follow/lerp/shake/zoom/letterbox
    rng.js                  seeded mulberry32 + helpers
    util.js                 math/geometry helpers
    save.js                 localStorage serialize/restore
  data/                     pure data — no logic imports anything from here up
    citizens.js             50 hand-authored citizens
    locations.js            100 hand-authored locations across 8 districts
    objects.js              300 hand-authored objects
    dialogue.js             template banks per personality/context
    gags.js                 running gags, background gags, meta jokes
    lore.js                 hidden lore (VHS tapes), easter eggs
    quests.js               escalating side-quest chains + daily events
  world/
    clock.js                day/night cycle, weekdays, day counter
    weather.js              10 weathers (some illegal), particles, transitions
    townMap.js              deterministic town layout from locations.js,
                            collision grid, object & collectible placement
    randomEvents.js         world-scale events (alien audit, toupee escape…)
  ai/
    npc.js                  NPC brain: schedule → goal → steering, moods,
                            state machine, LOD updates
    memory.js               per-NPC memory of player actions & world events
    relationships.js        friendship/rivalry matrix, drift, updates
  comedy/
    comedyEngine.js         joke scheduler (guaranteed 5–15 s cadence),
                            callback ledger, running-gag escalation,
                            interruption system, background gag spawner
  dialogue/
    dialogueEngine.js       generative template dialogue + choices,
                            anti-repetition ledger, memory references
  gameplay/
    player.js               movement, squash & stretch, interaction probe
    quests.js               quest state machine over quests.js data
    collectibles.js         VHS tapes → lore unlocks
    minigames.js            3 minigames (modal states)
  render/
    characterRenderer.js    the 7 art styles + faces + squash/stretch
    worldRenderer.js        ground, districts, buildings (cached), props
    effects.js              particle pools, screen effects
    ui.js                   speech bubbles, dialogue panel, HUD, journal,
                            narrator toasts, letterbox
```

**Dependency rule:** `data/` imports nothing. `core/` imports only `core/`.
Everything else may import `core/` + `data/`. `main.js` is the only file that
knows every system. This keeps modules unit-replaceable.

## 3. World systems

- **Clock** — 1 game day ≈ 12 real minutes. Emits `clock:hour`, `clock:day`.
  Weekdays matter (Tuesday is legally Backwards Day).
- **Weather** — sun, rain, snow, wind, fog, plus comedic: fish rain, meatball
  hail, disco fog, sideways rain, "suspiciously perfect". Weighted transitions
  every 2–5 game hours; each weather has particles, tint, NPC mood modifier,
  and joke hooks.
- **Town map** — 100 locations placed deterministically (seeded RNG) into 8
  districts on a 4800×3600 world. Buildings rasterized once into offscreen
  canvases per district. Collision = coarse grid (48 px cells). 300 objects
  scattered by district affinity; 30 VHS tapes hidden in odd spots.
- **Random events** — timed world events (parade, alien audit, statue moved,
  GlorpMart flash sale) that retarget NPC goals and feed the comedy engine.

## 4. NPC AI

Each of the 50 citizens has authored `personality, quirks, fears, goals,
home, job, favoriteSpots, style, species, catchphrase`. At runtime each gets:

- **Schedule** — hour→location intent derived from job/home/favorites with
  per-NPC jitter; random events can override.
- **State machine** — `idle | walk | work | chat | flee | dance | nap | panic`.
- **Mood** — scalar mood plus a named emotion (weather, events, player actions,
  and personality bias move it). Mood drives face rendering + dialogue tone.
- **Memory** — ring buffer of salient facts: what the player said/did, gags
  they witnessed, who insulted them. Dialogue references these directly.
- **Relationships** — NPC↔NPC friendship/rivalry values that drift when they
  share locations; NPC↔player friendship changed by dialogue choices, gifts,
  quests. Thresholds unlock dialogue banks and quest chains.
- **LOD** — off-screen NPCs update at 5 Hz with simplified steering; on-screen
  at full rate. Keeps 50 brains cheap.

## 5. Comedy engine (the heart)

A scheduler guarantees **a joke every 5–15 seconds**, choosing by weighted
category, with a *pity timer* so no category starves:

1. **Background gags** — visual bits spawned near (not on) the camera: pigeon
   Gerald judging someone, the statue changing pose, a doodle-dog chasing a
   photorealistic hot dog.
2. **NPC one-liners** — bubble lines filtered by personality/mood/weather.
3. **Physical comedy** — an on-screen NPC slips/bounces/gets bonked (squash &
   stretch impulse + particles), then complains about it.
4. **Meta/fourth-wall** — narrator toasts, HUD jokes, Dale the Doodle
   addressing the player, fake "autosave" messages.
5. **Callbacks** — a ledger records every joke instance; callback jokes
   reference a *specific earlier instance* ("still no word from the mayor's
   toupee, day 3").
6. **Running gags** — each gag has an escalation track: occurrence N picks
   line/visual N (the toupee: escapes → gets a job → unionizes → runs for
   mayor). Counters persist in saves.
7. **Interruptions** — dialogue can be hijacked by events with an apology
   beat, then resumes.

Anti-repetition: every line/gag id has a cooldown ledger; the scheduler
filters candidates through it before weighting.

## 6. Dialogue

Generative, template-based, choice-driven:

- Line = template bank keyed by `(personality, context)` where context ∈
  {greeting, weather, event, memory-callback, gossip, mood, lore-hint}.
- Slots filled from live state: current weather, active event, a memory of the
  player, a relationship fact about another NPC, the day's running-gag state.
- 2–3 player choices per beat (nice / weird / chaotic), shifting friendship &
  reputation and writing into NPC memory — later conversations reference them.
- Anti-repetition ledger with per-line cooldowns; gossip lines pull from the
  NPC↔NPC relationship matrix so conversations surprise.

## 7. Gameplay loop

Exploration (walk anywhere, everything comments), **reputation** (town-wide,
moves with choices/quests/chaos), **friendship** per NPC, **collectibles**
(30 VHS tapes → the Season Zero lore, including what The Bagel Incident was),
**3 minigames** (Pigeon Stare-Down — do NOT press anything; Sandwich Speedrun
— key sequence under pressure; Dance-Off — timed arrows), **daily events**
(per weekday), **random encounters**, and **5 side-quest chains** that start
mundane ("find my keys") and end unhinged ("my keys have formed a government").

## 8. Performance plan (bottlenecks & mitigations)

| Bottleneck | Mitigation |
|---|---|
| Drawing 100 buildings/frame | Rasterize each district to an offscreen canvas once; blit 1–2 per frame |
| 50 NPC brains | LOD: off-screen brains tick at 5 Hz, no per-frame pathing |
| Pixel-art & detailed characters | Pre-render pixel sprites to offscreen canvases; nearest-neighbor blit |
| Particles (weather + gags) | Fixed-size pools, hard caps, no allocation in the hot loop |
| Text layout (bubbles) | Cache wrapped-line measurement per string |
| GC pressure | Reused scratch vectors; data arrays allocated once at boot |
| Overdraw | Camera-frustum culling for entities, props, and particles |
| Fixed-step spiral | Clamped accumulator (max 5 steps), panic-skip on tab-restore |

Target: 60 FPS on integrated graphics; the engine renders on rAF and
updates on a fixed 60 Hz accumulator so gameplay speed is frame-rate
independent.

## 9. Scalability plan

- **Content scales in `data/` only** — new citizens/locations/gags/quests are
  new entries, zero engine changes. Every system iterates data, never
  hardcodes ids (running gags and quests reference ids declaratively).
- **New art style** = one new case in `characterRenderer` (a pure function
  `(ctx, npc, t) → void`).
- **New minigame** = one object implementing `{enter, update, render, exit}`.
- **Saves are versioned** (`SAVE_VERSION`); migration hook on load.
- **EventBus decoupling** means new systems (sound, achievements, mod hooks)
  subscribe without touching existing code.
- District-level spatial partition already in place if the world grows 10×.

## 10. Implementation order

1. core (loop, input, camera, rng, bus, save)
2. data (citizens, locations, objects, dialogue, gags, lore, quests)
3. world (clock, weather, map, random events)
4. render (characters, world, effects, UI)
5. ai (npc, memory, relationships)
6. comedy engine → dialogue engine
7. gameplay (player, quests, collectibles, minigames)
8. composition root, smoke test in headless Chromium, tune cadence.
