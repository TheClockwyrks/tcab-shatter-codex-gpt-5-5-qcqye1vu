import { describe, expect, it } from "vitest";
import type { InitApi, UpdateApi } from "@clockwyrks/simple-2d";
import { BULLET_LIFE, FACE_UP, TICK_DT } from "./constants";
import { game, type ShatterDebugApi, type ShatterState } from "./game";

function init(): [ShatterState, ShatterDebugApi] {
  const initApi: InitApi<ShatterState> = {
    input: { register: () => undefined, layout: () => null },
    audio: { define: () => undefined, load: async () => undefined },
    assets: {
      loadImage: async () => {
        throw new Error("unused");
      },
      loadAudio: async () => {
        throw new Error("unused");
      },
      load: async () => new Blob(),
      resolve: (path) => path,
    },
    diagnostics: { register: () => undefined },
    events: { on: () => () => undefined },
    viewport: () => ({
      width: 1280,
      height: 720,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    }),
  };
  const result = game.initialize(initApi);
  if (result instanceof Promise) throw new Error("unexpected async initialize");
  return result;
}

function updateApi(
  pressed: readonly string[] = [],
  held: readonly string[] = [],
): UpdateApi {
  const edge = new Set(pressed);
  const down = new Set([...pressed, ...held]);
  let muted = false;
  return {
    input: {
      value: (name) => (down.has(name) ? 1 : 0),
      pressed: (name) => {
        const result = edge.has(name);
        edge.delete(name);
        return result;
      },
      pointer: () => ({
        x: -100,
        y: -100,
        down: false,
        device: "mouse",
        buttons: [],
      }),
      pointerPressed: () => false,
      pointerReleased: () => false,
      pointerSamples: () => [],
      pointerContacts: () => [],
      wheel: () => ({ x: 0, y: 0 }),
    },
    audio: {
      play: () => undefined,
      loop: () => undefined,
      stop: () => undefined,
      looping: () => false,
      setMuted: (value) => {
        muted = value;
      },
      muted: () => muted,
    },
    frame: () => ({ count: 0, timeMs: 0, lastDeltaMs: 0 }),
    viewport: () => ({
      width: 1280,
      height: 720,
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    }),
  };
}

function step(
  state: ShatterState,
  frames = 1,
  api = updateApi(),
): ShatterState {
  let next = state;
  for (let i = 0; i < frames; i += 1) next = game.update(next, api, TICK_DT);
  return next;
}

describe("Shatter simulation", () => {
  it("starts on the title screen and exposes the required snapshot", () => {
    const [state, debug] = init();
    const snap = debug.snapshot(state);
    expect(snap.version).toBe(1);
    expect(snap.screen).toBe("title");
    expect(snap.lives).toBe(3);
    expect(snap.torpedoReady).toBe(true);
    expect(debug.menuItemRect(state, 0)).not.toBeNull();
  });

  it("chips armored rocks before splitting them", () => {
    const [initial, debug] = init();
    let state = debug.setScreen(initial, "playing");
    state = debug.setWaveSpawning(state, false);
    state = debug.clearRocks(state);
    state = debug.addRock(state, "large", 500, 500);
    const rocks = debug.snapshot(state).rocks;
    const rock = rocks[rocks.length - 1]!;
    state = debug.setRockVelocity(state, rock.id, 0, 0);
    state = debug.addBullet(state, 500, 500, 0, 0);
    state = step(state);
    const snap = debug.snapshot(state);
    expect(snap.rocks).toHaveLength(1);
    expect(snap.rocks[0]!.health).toBe(2);
    expect(snap.score).toBe(0);
    expect(snap.bullets).toHaveLength(0);
  });

  it("torpedoes destroy a large rock outright and append fragments", () => {
    const [initial, debug] = init();
    let state = debug.setScreen(initial, "playing");
    state = debug.setWaveSpawning(state, false);
    state = debug.clearRocks(state);
    state = debug.addRock(state, "large", 760, 560);
    const rocks = debug.snapshot(state).rocks;
    const rock = rocks[rocks.length - 1]!;
    state = debug.setRockVelocity(state, rock.id, 0, 0);
    state = debug.addTorpedo(state, 760, 560, 0);
    state = step(state);
    const snap = debug.snapshot(state);
    expect(snap.score).toBe(20);
    expect(snap.rocks.map((r) => r.size)).toEqual(["medium", "medium"]);
    expect(snap.torpedoes).toHaveLength(0);
  });

  it("recharges a fired torpedo over ten seconds after it is gone", () => {
    const [initial, debug] = init();
    let state = debug.setScreen(initial, "playing");
    state = debug.clearRocks(state);
    state = debug.setShipAngle(state, FACE_UP);
    state = game.update(state, updateApi(["b"]), TICK_DT);
    expect(debug.snapshot(state).torpedoCharge).toBe(0);
    state = debug.clearTorpedoes(state);
    state = step(state, Math.ceil(10 / TICK_DT) + 1);
    expect(debug.snapshot(state).torpedoCharge).toBe(1);
  });

  it("expires bullets by their fixed lifetime", () => {
    const [initial, debug] = init();
    let state = debug.setScreen(initial, "playing");
    state = debug.setWaveSpawning(state, false);
    state = debug.clearRocks(state);
    state = debug.addBullet(state, 100, 100, 0, 0);
    state = step(state, Math.ceil(BULLET_LIFE / TICK_DT) + 1);
    expect(debug.snapshot(state).bullets).toHaveLength(0);
  });
});
